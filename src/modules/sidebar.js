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

    settingsBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebarPanel);
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
