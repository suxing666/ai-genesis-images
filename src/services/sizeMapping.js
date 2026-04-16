import { sizePresets } from '../data/sizePresets.js';

// Gemini 支持的宽高比
const GEMINI_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9'];

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
