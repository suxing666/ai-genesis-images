import { useConfigStore } from '../stores/config.js';
import { generateImage as genericGenerate } from './providers/generic.js';
import { generateImage as geminiGenerate } from './providers/gemini.js';

const providers = {
  generic: genericGenerate,
  gemini: geminiGenerate,
};

/**
 * 图片生成门面服务
 * 根据当前配置的 provider 选择对应适配器，统一返回 { images: [] }
 */
export async function generateImage({ prompt, size, n, style, image }) {
  const config = useConfigStore();
  const provider = config.imageProvider || 'generic';

  const generate = providers[provider];
  if (!generate) {
    throw new Error(`未知的图片生成提供商: ${provider}`);
  }

  if (provider === 'generic') {
    if (!config.imageEndpoint || !config.imageApiKey) {
      throw new Error('请先配置图片生成 API');
    }
    return generate({
      prompt, size, n, style, image,
      endpoint: config.imageEndpoint,
      apiKey: config.imageApiKey,
      timeout: config.timeout,
    });
  }

  return generate({ prompt, size, n, style, image });
}

export function registerProvider(name, generateFn) {
  providers[name] = generateFn;
}
