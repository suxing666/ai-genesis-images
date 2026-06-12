import { useConfigStore } from '../../stores/config.js';
import { mapSizeToOpenAISize } from '../sizeMapping.js';

const OPENAI_DEFAULT_BASE = 'https://api.openai.com';

/**
 * 解析最终请求地址：
 * - 留空时回退到官方地址 https://api.openai.com
 * - 以 # 结尾：视为完整地址，去掉 # 后直接访问（不再拼接路径）
 * - 否则自动去除末尾多余的 /，再拼接标准路径
 * @param {string} baseUrl - 用户配置的端点
 * @param {string} path - 标准路径，如 "/v1/images/generations"
 */
function resolveEndpoint(baseUrl, path) {
  const base = (baseUrl || '').trim() || OPENAI_DEFAULT_BASE;
  if (base.endsWith('#')) {
    return base.slice(0, -1);
  }
  return base.replace(/\/+$/, '') + path;
}

/**
 * 将 data URL 转为 Blob，用于图生图（/images/edits）的 multipart 上传
 * @param {string} dataUrl - 如 "data:image/png;base64,iVBOR..."
 */
function dataUrlToBlob(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('无效的图片数据格式');
  }
  const mimeType = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * 翻译 OpenAI 图片 API 错误为用户友好的中文消息
 */
function translateOpenAIError(status, errorData) {
  const message = errorData?.error?.message || errorData?.message || '';

  if (status === 401) {
    return 'OpenAI API 密钥无效，请检查配置';
  }
  if (status === 403) {
    return '无权访问该模型，GPT Image 系列需要先完成组织验证';
  }
  if (status === 404) {
    return '所选模型不可用，请检查模型名称或 API 端点';
  }
  if (status === 429) {
    return 'API 请求频率超限或额度不足，请稍后再试';
  }
  if (status === 400) {
    return `请求参数错误: ${message}`;
  }
  return message || `OpenAI API 请求失败: ${status}`;
}

/**
 * 从 OpenAI 图片响应中提取图片，返回 data URL / URL 数组
 * GPT Image 系列固定返回 base64（b64_json），DALL·E 可能返回 url
 */
function extractImages(responseData) {
  const list = responseData?.data;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('OpenAI 未返回任何图片');
  }

  const images = [];
  for (const item of list) {
    if (item.b64_json) {
      images.push(`data:image/png;base64,${item.b64_json}`);
    } else if (item.url) {
      images.push(item.url);
    }
  }

  if (images.length === 0) {
    throw new Error('OpenAI 未返回图片内容');
  }

  return images;
}

/**
 * 文生图：POST /v1/images/generations（JSON）
 */
async function callGenerations({ prompt, size, n, quality, apiKey, model, timeout, baseUrl }) {
  const endpoint = resolveEndpoint(baseUrl, '/v1/images/generations');

  const requestBody = {
    model,
    prompt,
    size,
    n,
  };
  // quality 为 'auto' 时也合法，但留空则不发送，兼容部分第三方网关
  if (quality) {
    requestBody.quality = quality;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(translateOpenAIError(response.status, errorData));
  }

  return response.json();
}

/**
 * 图生图：POST /v1/images/edits（multipart/form-data）
 */
async function callEdits({ prompt, size, n, quality, image, apiKey, model, timeout, baseUrl }) {
  const endpoint = resolveEndpoint(baseUrl, '/v1/images/edits');

  const form = new FormData();
  form.append('model', model);
  form.append('prompt', prompt);
  form.append('size', size);
  form.append('n', String(n));
  if (quality) {
    form.append('quality', quality);
  }
  form.append('image', dataUrlToBlob(image), 'image.png');

  // 注意：不要手动设置 Content-Type，交由浏览器生成 multipart 边界
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: form,
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(translateOpenAIError(response.status, errorData));
  }

  return response.json();
}

/**
 * OpenAI (GPT Image) 图片生成适配器
 * @param {Object} params
 * @param {string} params.prompt - 提示词
 * @param {string} params.size - 像素尺寸，如 "1920x1080"
 * @param {number} params.n - 生成数量
 * @param {string} [params.style] - 风格（追加到提示词）
 * @param {string} [params.image] - 参考图片 data URL（图生图模式）
 * @returns {Promise<{images: string[]}>}
 */
export async function generateImage({ prompt, size, n, style, image }) {
  const config = useConfigStore();

  if (!config.openaiApiKey) {
    throw new Error('请先配置 OpenAI API 密钥');
  }

  // 将 style 追加到 prompt（GPT Image 无独立 style 参数，统一并入提示词）
  let fullPrompt = prompt;
  if (style && style !== '-') {
    fullPrompt = `${prompt}, ${style}`;
  }

  // 映射到 GPT Image 支持的预设尺寸（兼容 gpt-image-1/mini 仅支持的三种尺寸）
  const openaiSize = mapSizeToOpenAISize(size);

  const callParams = {
    prompt: fullPrompt,
    size: openaiSize,
    n,
    quality: config.openaiQuality,
    image,
    apiKey: config.openaiApiKey,
    model: config.openaiImageModel,
    timeout: config.timeout,
    baseUrl: config.openaiEndpoint,
  };

  // 图生图走 edits 端点，文生图走 generations 端点
  const data = image
    ? await callEdits(callParams)
    : await callGenerations(callParams);

  return { images: extractImages(data) };
}
