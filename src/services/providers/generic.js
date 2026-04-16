/**
 * 通用 API 适配器
 * 从 ImageGeneration.vue 提取的原有 fetch 逻辑，保持完全一致的行为
 */

export async function generateImage({ prompt, size, n, style, image, endpoint, apiKey, timeout }) {
  const requestBody = {
    prompt,
    size,
    n,
  };

  if (style && style !== '-') {
    requestBody.style = style;
  }

  if (image) {
    requestBody.image = image;
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
    const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const images = data.data || data.images || [];

  return { images };
}
