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
export function initSizeSelector() {
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
                    <div class="size-dimensions">${size.width}\u00d7${size.height}</div>
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
