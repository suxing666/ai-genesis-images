import { useConfigStore } from '../../stores/config.js';
import { mapSizeToAspectRatio } from '../sizeMapping.js';

const GEMINI_DEFAULT_BASE = 'https://generativelanguage.googleapis.com';

/**
 * 从 data URL 解析 mime type 和 base64 数据
 * @param {string} dataUrl - 如 "data:image/png;base64,iVBOR..."
 */
function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('无效的图片数据格式');
  }
  return { mimeType: match[1], data: match[2] };
}

/**
 * 翻译 Gemini API 错误为用户友好的中文消息
 */
function translateGeminiError(status, errorData) {
  const message = errorData?.error?.message || '';
  const errorStatus = errorData?.error?.status || '';

  if (status === 429 || errorStatus === 'RESOURCE_EXHAUSTED') {
    return 'API 请求频率超限，请稍后再试';
  }
  if (status === 401 || status === 403 || errorStatus === 'UNAUTHENTICATED') {
    return 'Gemini API 密钥无效，请检查配置';
  }
  if (status === 404 || errorStatus === 'NOT_FOUND') {
    return '所选 Gemini 模型不可用，请检查模型名称';
  }
  if (status === 400 || errorStatus === 'INVALID_ARGUMENT') {
    return `请求参数错误: ${message}`;
  }
  return message || `Gemini API 请求失败: ${status}`;
}

/**
 * 从 Gemini 响应中提取图片，返回 data URL 数组
 */
function extractImages(responseData) {
  const candidates = responseData.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('Gemini 未返回任何结果');
  }

  const candidate = candidates[0];

  // 检查安全过滤
  if (candidate.finishReason === 'SAFETY') {
    throw new Error('内容被安全过滤器拦截，请调整描述后重试');
  }

  const parts = candidate.content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('Gemini 未返回图片内容');
  }

  const images = [];
  for (const part of parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;
      images.push(`data:${mimeType};base64,${data}`);
    }
  }

  if (images.length === 0) {
    throw new Error('Gemini 未返回图片内容');
  }

  return images;
}

/**
 * 发送单个 Gemini generateContent 请求
 */
async function callGenerateContent({ prompt, aspectRatio, image, apiKey, model, timeout, baseUrl }) {
  const base = (baseUrl || GEMINI_DEFAULT_BASE).replace(/\/+$/, '');
  const endpoint = `${base}/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // 构建 parts
  const parts = [{ text: prompt }];

  // 图生图：添加参考图片
  if (image) {
    const { mimeType, data } = parseDataUrl(image);
    parts.push({
      inlineData: { mimeType, data },
    });
  }

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  // 添加宽高比配置
  if (aspectRatio) {
    requestBody.generationConfig.imageConfig = {
      aspectRatio,
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(translateGeminiError(response.status, errorData));
  }

  return response.json();
}

/**
 * Gemini 图片生成适配器
 * @param {Object} params
 * @param {string} params.prompt - 提示词
 * @param {string} params.size - 像素尺寸，如 "1920x1080"
 * @param {number} params.n - 生成数量
 * @param {string} [params.style] - 风格
 * @param {string} [params.image] - 参考图片 data URL（图生图模式）
 * @returns {Promise<{images: string[]}>}
 */
export async function generateImage({ prompt, size, n, style, image }) {
  const config = useConfigStore();

  if (!config.geminiApiKey) {
    throw new Error('请先配置 Gemini API 密钥');
  }

  const aspectRatio = mapSizeToAspectRatio(size);

  // 将 style 追加到 prompt（如果存在且非空）
  let fullPrompt = prompt;
  if (style && style !== '-') {
    fullPrompt = `${prompt}, ${style}`;
  }

  const callParams = {
    prompt: fullPrompt,
    aspectRatio,
    image,
    apiKey: config.geminiApiKey,
    model: config.geminiImageModel,
    timeout: config.timeout,
    baseUrl: config.geminiEndpoint,
  };

  if (n <= 1) {
    const data = await callGenerateContent(callParams);
    return { images: extractImages(data) };
  }

  // n > 1：并行发送多个请求
  const promises = Array.from({ length: n }, () => callGenerateContent(callParams));
  const results = await Promise.allSettled(promises);

  const images = [];
  let lastError = null;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      images.push(...extractImages(result.value));
    } else {
      lastError = result.reason;
    }
  }

  if (images.length === 0 && lastError) {
    throw lastError;
  }

  return { images };
}
