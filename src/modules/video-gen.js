import { loadConfig } from './config.js';
import { showNotification } from './notification.js';

// 将文件转为 Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 初始化帧上传区域
function initFrameUpload(zoneId, fileInputId, placeholderId, previewId, imgId, removeBtnId, setData) {
    const zone = document.getElementById(zoneId);
    const fileInput = document.getElementById(fileInputId);
    const placeholder = document.getElementById(placeholderId);
    const preview = document.getElementById(previewId);
    const img = document.getElementById(imgId);
    const removeBtn = document.getElementById(removeBtnId);

    async function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('请上传图片文件', 'error');
            return;
        }
        const base64 = await fileToBase64(file);
        img.src = base64;
        placeholder.style.display = 'none';
        preview.style.display = 'block';
        zone.classList.add('has-image');
        setData(base64);
    }

    // 点击上传
    zone.addEventListener('click', (e) => {
        if (e.target.closest('.frame-remove-btn')) return;
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    // 拖拽上传
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    // 移除图片
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        img.src = '';
        placeholder.style.display = '';
        preview.style.display = 'none';
        zone.classList.remove('has-image');
        fileInput.value = '';
        setData(null);
    });
}

// 视频生成
export function initVideoGeneration() {
    const generateVideoBtn = document.getElementById('generateVideo');
    const videoPrompt = document.getElementById('videoPrompt');
    const videoDuration = document.getElementById('videoDuration');
    const videoResolution = document.getElementById('videoResolution');
    const videoLoading = document.getElementById('videoLoading');
    const videoResults = document.getElementById('videoResults');
    const videoContainer = document.getElementById('videoContainer');

    // 首帧 / 尾帧相关状态（闭包内局部）
    let firstFrameData = null;
    let lastFrameData = null;

    initFrameUpload(
        'firstFrameZone', 'firstFrameFile', 'firstFramePlaceholder',
        'firstFramePreview', 'firstFrameImg', 'removeFirstFrame',
        (data) => { firstFrameData = data; }
    );

    initFrameUpload(
        'lastFrameZone', 'lastFrameFile', 'lastFramePlaceholder',
        'lastFramePreview', 'lastFrameImg', 'removeLastFrame',
        (data) => { lastFrameData = data; }
    );

    generateVideoBtn.addEventListener('click', async () => {
        const prompt = videoPrompt.value.trim();

        if (!prompt) {
            showNotification('请输入视频描述', 'error');
            return;
        }

        const config = loadConfig();

        videoLoading.classList.add('active');
        videoResults.classList.remove('active');
        videoContainer.innerHTML = '';
        generateVideoBtn.disabled = true;

        try {
            if (!config.video.endpoint || !config.video.apiKey) {
                throw new Error('请先配置视频生成 API');
            }

            const requestBody = {
                prompt: prompt,
                duration: parseInt(videoDuration.value),
                resolution: videoResolution.value
            };

            // 仅在用户上传时附带首帧 / 尾帧
            if (firstFrameData) {
                requestBody.first_frame_image = firstFrameData;
            }
            if (lastFrameData) {
                requestBody.last_frame_image = lastFrameData;
            }

            const response = await fetch(config.video.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.video.apiKey}`
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(config.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            displayVideo(data.url || data.video_url || data.output);

        } catch (error) {
            console.error('生成视频失败:', error);
            showNotification(`生成失败: ${error.message}`, 'error');
        } finally {
            videoLoading.classList.remove('active');
            generateVideoBtn.disabled = false;
        }
    });

    function displayVideo(videoUrl) {
        if (!videoUrl) {
            showNotification('未生成视频', 'error');
            return;
        }

        videoContainer.innerHTML = `
            <div class="video-wrapper">
                <video controls preload="metadata">
                    <source src="${videoUrl}" type="video/mp4">
                    您的浏览器不支持视频播放
                </video>
            </div>
            <div class="video-actions">
                <a href="${videoUrl}" download="generated-video-${Date.now()}.mp4" class="download-btn">
                    下载视频
                </a>
            </div>
        `;

        videoResults.classList.add('active');
    }
}
