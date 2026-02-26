import { loadConfig } from './config.js';
import { showNotification } from './notification.js';

// 图片生成
export function initImageGeneration() {
    const generateImageBtn = document.getElementById('generateImage');
    const imagePrompt = document.getElementById('imagePrompt');
    const imageSize = document.getElementById('imageSize');
    const imageCount = document.getElementById('imageCount');
    const imageStyle = document.getElementById('imageStyle');
    const imageLoading = document.getElementById('imageLoading');
    const imageResults = document.getElementById('imageResults');
    const imageGrid = document.getElementById('imageGrid');

    generateImageBtn.addEventListener('click', async () => {
        const prompt = imagePrompt.value.trim();

        if (!prompt) {
            showNotification('请输入图片描述', 'error');
            return;
        }

        const config = loadConfig();

        imageLoading.classList.add('active');
        imageResults.classList.remove('active');
        imageGrid.innerHTML = '';
        generateImageBtn.disabled = true;

        try {
            if (!config.image.endpoint || !config.image.apiKey) {
                throw new Error('请先配置图片生成 API');
            }

            const response = await fetch(config.image.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.image.apiKey}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    size: imageSize.value,
                    n: parseInt(imageCount.value),
                    style: imageStyle.value
                }),
                signal: AbortSignal.timeout(config.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            displayImages(data.data || data.images || []);

        } catch (error) {
            console.error('生成图片失败:', error);
            showNotification(`生成失败: ${error.message}`, 'error');
        } finally {
            imageLoading.classList.remove('active');
            generateImageBtn.disabled = false;
        }
    });

    function displayImages(images) {
        imageGrid.innerHTML = '';

        if (!images || images.length === 0) {
            showNotification('未生成任何图片', 'error');
            return;
        }

        images.forEach((img, index) => {
            const imageUrl = img.url || img;
            const div = document.createElement('div');
            div.className = 'image-item';
            div.style.animationDelay = `${index * 0.1}s`;
            div.innerHTML = `
                <img src="${imageUrl}" alt="生成的图片 ${index + 1}"
                    onerror="this.src='https://via.placeholder.com/1024x1024?text=加载失败'">
                <div class="image-overlay">
                    <a href="${imageUrl}" download="image-${Date.now()}-${index + 1}.png" class="download-btn">
                        下载图片
                    </a>
                </div>
            `;
            imageGrid.appendChild(div);
        });

        imageResults.classList.add('active');
    }
}
