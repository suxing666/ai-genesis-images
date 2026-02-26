// 从本地存储加载配置
export function loadConfig() {
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
export function saveConfig(config) {
    localStorage.setItem('apiConfig', JSON.stringify(config));
}
