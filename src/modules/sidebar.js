import { loadConfig, saveConfig } from './config.js';
import { showNotification } from './notification.js';

// 侧边栏控制
export function initSidebar() {
    const settingsBtn = document.getElementById('settingsBtn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const clearCacheBtn = document.getElementById('clearCache');

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

    closeSidebarBtn.addEventListener('click', closeSidebarPanel);
    overlay.addEventListener('click', closeSidebarPanel);

    // 悬浮按钮：长按拖拽 + 单击打开侧边栏
    (function initDraggableBtn() {
        const DRAG_DELAY = 300; // 长按阈值（毫秒）
        let pressTimer = null;
        let isDragReady = false; // 长按计时器到期，进入拖拽就绪
        let isDragging = false;  // 实际发生了拖拽移动
        let offsetX, offsetY;

        function onStart(e) {
            const touch = e.touches ? e.touches[0] : e;
            const rect = settingsBtn.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            isDragReady = false;
            isDragging = false;

            // 长按后才进入拖拽模式
            pressTimer = setTimeout(() => {
                isDragReady = true;
                settingsBtn.classList.add('dragging');
            }, DRAG_DELAY);
        }

        function onMove(e) {
            if (!isDragReady) return;
            e.preventDefault();
            isDragging = true;
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
        }

        function onEnd() {
            clearTimeout(pressTimer);
            settingsBtn.classList.remove('dragging');
            isDragReady = false;
            // 延迟重置 isDragging，让紧随 mouseup 的 click 事件仍能读到 true
            requestAnimationFrame(() => { isDragging = false; });
        }

        settingsBtn.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        settingsBtn.addEventListener('touchstart', onStart, { passive: true });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

        // 单击：只在没有拖拽时打开侧边栏
        settingsBtn.addEventListener('click', (e) => {
            if (isDragging) {
                e.stopImmediatePropagation();
                return;
            }
            openSidebar();
        });
    })();

    saveSettingsBtn.addEventListener('click', () => {
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
    clearCacheBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有缓存吗？这将删除所有保存的配置和数据。')) {
            localStorage.clear();

            document.getElementById('imageApiEndpoint').value = '';
            document.getElementById('imageApiKey').value = '';
            document.getElementById('videoApiEndpoint').value = '';
            document.getElementById('videoApiKey').value = '';
            document.getElementById('apiTimeout').value = '60';

            const imageGrid = document.getElementById('imageGrid');
            const imageResults = document.getElementById('imageResults');
            const videoContainer = document.getElementById('videoContainer');
            const videoResults = document.getElementById('videoResults');

            imageGrid.innerHTML = '';
            imageResults.classList.remove('active');
            videoContainer.innerHTML = '';
            videoResults.classList.remove('active');

            showNotification('缓存已清空', 'success');
        }
    });
}
