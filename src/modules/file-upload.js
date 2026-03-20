import { showNotification } from './notification.js';

// 将文件转为 Base64
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 初始化帧上传区域
export function initFrameUpload(zoneId, fileInputId, placeholderId, previewId, imgId, removeBtnId, setData) {
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
