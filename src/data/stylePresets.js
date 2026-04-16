export const stylePresets = {
  photography: [
    { id: 'cinematic', label: '电影感', prompt: 'cinematic lighting, dramatic composition, film grain, 35mm lens, shallow depth of field, anamorphic', apiStyle: 'vivid' },
    { id: 'portrait', label: '人像', prompt: 'portrait photography, soft lighting, bokeh background, 85mm lens, f/1.8, studio quality', apiStyle: 'natural' },
    { id: 'street', label: '街拍', prompt: 'street photography, candid, urban, natural light, 35mm film, documentary style', apiStyle: 'vivid' },
    { id: 'landscape', label: '风景', prompt: 'landscape photography, golden hour, panoramic, vivid colors, dramatic sky', apiStyle: 'vivid' },
    { id: 'macro', label: '微距', prompt: 'macro photography, extreme close-up, detailed texture, shallow depth of field, high detail', apiStyle: 'natural' },
    { id: 'bw', label: '黑白', prompt: 'black and white photography, high contrast, monochrome, dramatic shadows, fine art', apiStyle: null },
    { id: 'film', label: '胶片', prompt: 'shot on Kodak Portra 400, film grain, warm tones, vintage color, analog photography', apiStyle: 'natural' },
    { id: 'product', label: '产品', prompt: 'product photography, studio lighting, clean white background, commercial, professional', apiStyle: 'natural' },
  ],
  art: [
    { id: 'oil-painting', label: '油画', prompt: 'oil painting, thick brushstrokes, rich colors, canvas texture, classical art', apiStyle: null },
    { id: 'watercolor', label: '水彩', prompt: 'watercolor painting, soft washes, pastel tones, translucent layers, paper texture', apiStyle: null },
    { id: 'ink', label: '水墨', prompt: 'Chinese ink painting, traditional brushwork, flowing ink, zen, minimalist', apiStyle: null },
    { id: 'sketch', label: '素描', prompt: 'pencil sketch, charcoal drawing, detailed line work, cross-hatching, monochrome', apiStyle: null },
    { id: 'impressionist', label: '印象派', prompt: 'Impressionist painting, visible brushstrokes, light and color, Monet style, plein air', apiStyle: null },
    { id: 'pop-art', label: '波普', prompt: 'pop art, bold primary colors, comic book style, halftone dots, Andy Warhol', apiStyle: 'vivid' },
  ],
  digital: [
    { id: '3d-render', label: '3D渲染', prompt: '3D render, octane render, C4D, photorealistic, volumetric lighting, ray tracing', apiStyle: 'vivid' },
    { id: 'anime', label: '动漫', prompt: 'anime style illustration, vibrant colors, cel shading, detailed, Japanese animation', apiStyle: 'vivid' },
    { id: 'concept-art', label: '概念艺术', prompt: 'concept art, digital painting, matte painting, fantasy, epic, detailed environment', apiStyle: 'vivid' },
    { id: 'pixel-art', label: '像素', prompt: 'pixel art, 8-bit style, retro gaming, low resolution, nostalgic, pixelated', apiStyle: null },
    { id: 'flat-design', label: '扁平', prompt: 'flat design, vector illustration, minimal, clean lines, bold geometric shapes', apiStyle: null },
    { id: 'cyberpunk', label: '赛博朋克', prompt: 'cyberpunk, neon lights, futuristic, dark cityscape, rain-soaked streets, holographic', apiStyle: 'vivid' },
  ],
  creative: [
    { id: 'surreal', label: '超现实', prompt: 'surrealism, dreamlike, impossible geometry, ethereal atmosphere, Salvador Dali inspired', apiStyle: null },
    { id: 'minimalist', label: '极简', prompt: 'minimalist, simple composition, negative space, limited color palette, clean', apiStyle: 'natural' },
    { id: 'vintage', label: '复古', prompt: 'vintage, retro aesthetic, faded warm colors, aged texture, 1970s vibe, nostalgic', apiStyle: 'natural' },
    { id: 'fantasy', label: '奇幻', prompt: 'fantasy art, magical, enchanted forest, mythical, ethereal light, epic landscape', apiStyle: 'vivid' },
    { id: 'vaporwave', label: '蒸汽波', prompt: 'vaporwave aesthetic, pastel neon, retro 80s, glitch art, nostalgic, synthwave', apiStyle: 'vivid' },
    { id: 'dark', label: '暗黑', prompt: 'dark moody atmosphere, dramatic chiaroscuro, deep shadows, mysterious, gothic', apiStyle: 'vivid' },
  ],
};

export const styleCategoryLabels = {
  photography: '摄影',
  art: '艺术',
  digital: '数字',
  creative: '创意',
};

export function getStyleHint(prompt) {
  return prompt.split(', ').slice(0, 3).join(', ');
}
