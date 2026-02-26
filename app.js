// 从本地存储加载配置
function loadConfig() {
    const config = JSON.parse(localStorage.getItem('apiConfig') || '{}');
    return {
        image: {
            endpoint: config.imageEndpoint || '',
            apiKey: config.imageApiKey || ''
        },
        video: {
            endpoint: config.videoEndpoint || '',
            apiKey: config.videoApiKey || ''
        },
        timeout: config.timeout || 60000
    };
}

// 保存配置到本地存储
function saveConfig(config) {
    localStorage.setItem('apiConfig', JSON.stringify(config));
}

// 粒子背景动画
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连接线
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 初始化粒子背景
initParticles();

// 尺寸选择器数据
const sizePresets = {
    desktop: [
        { value: '1920x1080', label: '全高清', ratio: '16:9', width: 1920, height: 1080 },
        { value: '2560x1440', label: '2K', ratio: '16:9', width: 2560, height: 1440 },
        { value: '3840x2160', label: '4K', ratio: '16:9', width: 3840, height: 2160 },
        { value: '1920x1200', label: 'WUXGA', ratio: '16:10', width: 1920, height: 1200 },
        { value: '2560x1600', label: 'WQXGA', ratio: '16:10', width: 2560, height: 1600 },
        { value: '1440x900', label: 'WXGA+', ratio: '16:10', width: 1440, height: 900 }
    ],
    mobile: [
        { value: '1080x1920', label: '全高清', ratio: '9:16', width: 1080, height: 1920 },
        { value: '1080x2340', label: '刘海屏', ratio: '9:19.5', width: 1080, height: 2340 },
        { value: '1080x2400', label: '全面屏', ratio: '9:20', width: 1080, height: 2400 },
        { value: '1170x2532', label: 'iPhone 13', ratio: '9:19.5', width: 1170, height: 2532 },
        { value: '1284x2778', label: 'iPhone Pro', ratio: '9:19.5', width: 1284, height: 2778 },
        { value: '1920x1080', label: '横屏 FHD', ratio: '16:9', width: 1920, height: 1080 }
    ],
    social: [
        { value: '1080x1080', label: 'Instagram', ratio: '1:1', width: 1080, height: 1080 },
        { value: '1080x1350', label: 'IG 竖版', ratio: '4:5', width: 1080, height: 1350 },
        { value: '1200x628', label: 'Facebook', ratio: '1.91:1', width: 1200, height: 628 },
        { value: '1024x1792', label: 'Story', ratio: '9:16', width: 1024, height: 1792 },
        { value: '1792x1024', label: '横版', ratio: '16:9', width: 1792, height: 1024 },
        { value: '1080x1920', label: 'TikTok', ratio: '9:16', width: 1080, height: 1920 }
    ],
    square: [
        { value: '1024x1024', label: '标准', ratio: '1:1', width: 1024, height: 1024 },
        { value: '512x512', label: '小尺寸', ratio: '1:1', width: 512, height: 512 },
        { value: '2048x2048', label: '高清', ratio: '1:1', width: 2048, height: 2048 }
    ]
};

// 初始化尺寸选择器
function initSizeSelector() {
    const sizeGrid = document.getElementById('sizeGrid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const imageSizeInput = document.getElementById('imageSize');

    let currentCategory = 'desktop';

    function renderSizes(category) {
        const sizes = sizePresets[category];
        sizeGrid.innerHTML = '';

        sizes.forEach((size, index) => {
            const card = document.createElement('div');
            card.className = 'size-card';
            if (index === 0 && category === currentCategory) {
                card.classList.add('selected');
                imageSizeInput.value = size.value;
            }

            // 计算预览框的尺寸（保持比例，最大高度60px）
            const maxHeight = 60;
            const maxWidth = 100;
            let previewWidth, previewHeight;

            const aspectRatio = size.width / size.height;

            if (aspectRatio > 1) {
                // 横向
                previewWidth = Math.min(maxWidth, maxHeight * aspectRatio);
                previewHeight = previewWidth / aspectRatio;
            } else {
                // 竖向或方形
                previewHeight = maxHeight;
                previewWidth = previewHeight * aspectRatio;
            }

            card.innerHTML = `
                <div class="size-preview">
                    <div class="size-ratio-box" style="width: ${previewWidth}px; height: ${previewHeight}px;"></div>
                </div>
                <div class="size-info">
                    <div class="size-label">${size.label}</div>
                    <div class="size-dimensions">${size.width}×${size.height}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.size-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                imageSizeInput.value = size.value;
            });

            sizeGrid.appendChild(card);
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderSizes(currentCategory);
        });
    });

    // 初始渲染
    renderSizes(currentCategory);
}

// 初始化尺寸选择器
initSizeSelector();

// 侧边栏控制
const settingsBtn = document.getElementById('settingsBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const saveSettings = document.getElementById('saveSettings');
const clearCache = document.getElementById('clearCache');

function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    settingsBtn.classList.add('hidden');
    document.body.style.overflow = 'hidden';

    // 加载当前配置
    const config = loadConfig();
    document.getElementById('imageApiEndpoint').value = config.image.endpoint;
    document.getElementById('imageApiKey').value = config.image.apiKey;
    document.getElementById('videoApiEndpoint').value = config.video.endpoint;
    document.getElementById('videoApiKey').value = config.video.apiKey;
    document.getElementById('apiTimeout').value = config.timeout / 1000;
}

function closeSidebarPanel() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    settingsBtn.classList.remove('hidden');
    document.body.style.overflow = '';
}

settingsBtn.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarPanel);
overlay.addEventListener('click', closeSidebarPanel);

// 悬浮按钮拖拽功能
(function initDraggableBtn() {
    let isDragging = false;
    let hasMoved = false;
    let offsetX, offsetY;

    function onStart(e) {
        const touch = e.touches ? e.touches[0] : e;
        const rect = settingsBtn.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        isDragging = true;
        hasMoved = false;
        settingsBtn.classList.add('dragging');
    }

    function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;

        const maxX = window.innerWidth - settingsBtn.offsetWidth;
        const maxY = window.innerHeight - settingsBtn.offsetHeight;
        const clampedX = Math.max(0, Math.min(x, maxX));
        const clampedY = Math.max(0, Math.min(y, maxY));

        settingsBtn.style.left = clampedX + 'px';
        settingsBtn.style.top = clampedY + 'px';
        settingsBtn.style.right = 'auto';
        settingsBtn.style.bottom = 'auto';
        hasMoved = true;
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        settingsBtn.classList.remove('dragging');
    }

    settingsBtn.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    settingsBtn.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);

    // 拖拽时阻止点击打开侧边栏
    settingsBtn.addEventListener('click', (e) => {
        if (hasMoved) e.stopImmediatePropagation();
    });
})();

saveSettings.addEventListener('click', () => {
    const config = {
        imageEndpoint: document.getElementById('imageApiEndpoint').value,
        imageApiKey: document.getElementById('imageApiKey').value,
        videoEndpoint: document.getElementById('videoApiEndpoint').value,
        videoApiKey: document.getElementById('videoApiKey').value,
        timeout: parseInt(document.getElementById('apiTimeout').value) * 1000
    };

    saveConfig(config);
    showNotification('配置已保存', 'success');
    closeSidebarPanel();
});

// 清空缓存
clearCache.addEventListener('click', () => {
    if (confirm('确定要清空所有缓存吗？这将删除所有保存的配置和数据。')) {
        localStorage.clear();

        document.getElementById('imageApiEndpoint').value = '';
        document.getElementById('imageApiKey').value = '';
        document.getElementById('videoApiEndpoint').value = '';
        document.getElementById('videoApiKey').value = '';
        document.getElementById('apiTimeout').value = '60';

        imageGrid.innerHTML = '';
        imageResults.classList.remove('active');
        videoContainer.innerHTML = '';
        videoResults.classList.remove('active');

        showNotification('缓存已清空', 'success');
    }
});

// 标签切换
const imageTab = document.getElementById('imageTab');
const videoTab = document.getElementById('videoTab');
const imagePanel = document.getElementById('imagePanel');
const videoPanel = document.getElementById('videoPanel');

imageTab.addEventListener('click', () => {
    imageTab.classList.add('active');
    videoTab.classList.remove('active');
    imagePanel.classList.add('active');
    videoPanel.classList.remove('active');
});

videoTab.addEventListener('click', () => {
    videoTab.classList.add('active');
    imageTab.classList.remove('active');
    videoPanel.classList.add('active');
    imagePanel.classList.remove('active');
});

// 图片生成
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

// 视频生成
const generateVideoBtn = document.getElementById('generateVideo');
const videoPrompt = document.getElementById('videoPrompt');
const videoDuration = document.getElementById('videoDuration');
const videoResolution = document.getElementById('videoResolution');
const videoLoading = document.getElementById('videoLoading');
const videoResults = document.getElementById('videoResults');
const videoContainer = document.getElementById('videoContainer');

// 首帧 / 尾帧相关状态
let firstFrameData = null;
let lastFrameData = null;

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

// 通知提示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// 初始化数字输入框的自定义箭头
function initNumberInputControls() {
    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach(input => {
        const controls = input.nextElementSibling;
        if (!controls || !controls.classList.contains('number-controls')) return;

        const incrementBtn = controls.querySelector('.increment');
        const decrementBtn = controls.querySelector('.decrement');

        if (incrementBtn) {
            incrementBtn.addEventListener('click', () => {
                const step = parseFloat(input.step) || 1;
                const max = parseFloat(input.max);
                const currentValue = parseFloat(input.value) || 0;
                const newValue = currentValue + step;

                if (!max || newValue <= max) {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }

        if (decrementBtn) {
            decrementBtn.addEventListener('click', () => {
                const step = parseFloat(input.step) || 1;
                const min = parseFloat(input.min);
                const currentValue = parseFloat(input.value) || 0;
                const newValue = currentValue - step;

                if (min === undefined || newValue >= min) {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    });
}

// 初始化自定义数字输入框控件
initNumberInputControls();
