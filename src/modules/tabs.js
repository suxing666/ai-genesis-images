// 标签切换
export function initTabs() {
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
}
