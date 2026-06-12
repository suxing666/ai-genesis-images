import { sizePresets } from '../data/sizePresets.js';

// Gemini 3.x / 2.5 Flash Image 支持的宽高比（Nano Banana 系列）
// 官方完整集合还包含 1:4/1:8/4:1/8:1 等极端比例，此处保留常见比例以避免普通壁纸尺寸误匹配
const GEMINI_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];

// 将比例字符串转为十进制值
function ratioToDecimal(ratio) {
  const [w, h] = ratio.split(':').map(Number);
  return w / h;
}

// Gemini 比例的十进制值缓存
const geminiDecimalRatios = GEMINI_RATIOS.map(r => ({
  ratio: r,
  decimal: ratioToDecimal(r),
}));

// 找到最接近的 Gemini 比例
function findClosestGeminiRatio(ratioStr) {
  // 精确匹配
  if (GEMINI_RATIOS.includes(ratioStr)) {
    return ratioStr;
  }

  const decimal = ratioToDecimal(ratioStr);
  let closest = geminiDecimalRatios[0];
  let minDiff = Math.abs(decimal - closest.decimal);

  for (let i = 1; i < geminiDecimalRatios.length; i++) {
    const diff = Math.abs(decimal - geminiDecimalRatios[i].decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closest = geminiDecimalRatios[i];
    }
  }

  return closest.ratio;
}

// 构建像素尺寸 → Gemini 宽高比映射表
const sizeToRatioMap = new Map();
for (const category of Object.values(sizePresets)) {
  for (const preset of category) {
    if (!sizeToRatioMap.has(preset.value)) {
      sizeToRatioMap.set(preset.value, findClosestGeminiRatio(preset.ratio));
    }
  }
}

/**
 * 将像素尺寸字符串映射为 Gemini 支持的宽高比
 * @param {string} pixelSize - 如 "1920x1080"
 * @returns {string} Gemini 宽高比，如 "16:9"
 */
export function mapSizeToAspectRatio(pixelSize) {
  if (sizeToRatioMap.has(pixelSize)) {
    return sizeToRatioMap.get(pixelSize);
  }

  // 未知尺寸：从像素值计算
  const parts = pixelSize.split('x').map(Number);
  if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
    const decimal = parts[0] / parts[1];
    let closest = geminiDecimalRatios[0];
    let minDiff = Math.abs(decimal - closest.decimal);
    for (let i = 1; i < geminiDecimalRatios.length; i++) {
      const diff = Math.abs(decimal - geminiDecimalRatios[i].decimal);
      if (diff < minDiff) {
        minDiff = diff;
        closest = geminiDecimalRatios[i];
      }
    }
    return closest.ratio;
  }

  return '1:1'; // 兜底
}

/**
 * 将像素尺寸映射为 GPT Image 支持的预设尺寸
 * GPT Image 系列统一支持的三种尺寸：1024x1024（方）/ 1536x1024（横）/ 1024x1536（竖）
 * gpt-image-2 虽支持 16 倍数的任意尺寸，但 gpt-image-1/mini 不支持，
 * 故统一按宽高比就近映射到这三种预设，保证全系列模型可用
 * @param {string} pixelSize - 如 "1920x1080"
 * @returns {string} OpenAI 尺寸，如 "1536x1024"
 */
export function mapSizeToOpenAISize(pixelSize) {
  const parts = pixelSize.split('x').map(Number);
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return '1024x1024';
  }
  const ratio = parts[0] / parts[1];
  if (ratio > 1.2) {
    return '1536x1024'; // 横向
  }
  if (ratio < 0.83) {
    return '1024x1536'; // 纵向
  }
  return '1024x1024'; // 近似方形
}
