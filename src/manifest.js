/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
    // name: '__MSG_extName__', // Vue Extension
    // description: '__MSG_extDescription__', // Vue.js Webpack Chrome Extension Template
    // author: 'yunser <>',
    // version: '1.0.0',

    name: '超级拓展',
    version: '1.0.6',
    // description: '功能强大的浏览器拓展，自由添加网站图标，云端高清壁纸，快速访问书签、天气、笔记、待办事项、扩展管理与历史记录。',
    description: '功能强大的浏览器拓展。',
    author: 'yunser',
    icons: {
        '16': 'icons/16.png',
        '128': 'icons/128.png'
    },
    homepage_url: 'https://extension.yunser.com',
    /**
     * @see {@link https://developer.chrome.com/extensions/declare_permissions}
     */
    permissions: [
        '<all_urls>',
        '*://*/*',
        'activeTab',
        'tabs',
        'cookies',
        'background',
        'contextMenus',
        'unlimitedStorage',
        'storage',
        'notifications',
        'identity',
        'identity.email',
        'downloads',
        'downloads.open',
        "clipboardRead",
        "clipboardWrite",
        "bookmarks",
        // "webRequest",
        // 'clipboardWrite',
    ],
    browser_action: {
        default_title: 'title',
        default_popup: 'pages/popup.html'
    },
    background: {
        persistent: false,
        page: 'pages/background.html'
    },
    chrome_url_overrides: {
        newtab: 'pages/app.html'
    },
    options_page: 'pages/options.html',
    content_scripts: [{
        js: [
            'js/manifest.js',
            'js/vendor.js',
            'js/content.js'
        ],
        run_at: 'document_end',
        matches: ['<all_urls>'],
        all_frames: true
    }],
    omnibox: {
        keyword : 'app'
    },
    default_locale: 'en',
    manifest_version: 2,
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
    // content_security_policy: "script-src 'self'; object-src 'self'",
    web_accessible_resources: [
        // 'js/manifest.js',
        // 'js/vendor.js',
        // 'js/content.js'
    ],
    update_url: 'https://clients2.google.com/service/update2/crx',
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAls2ouNziFdl06f6hIc2fy40vDzZCxYLMBrkg2RUpoCfpVRmB+Jy8ZJVctihIfIuaHbmpsw4TFtlWzMP5xlNjJEIM1tY+QQo/0xQIGinhdK0/dzSjOnqfTJlfZkavSBV6MY4/3nVCa6f1/F41Y9JOProB637lxpv188V2P+KToiu0Nut7pCOqdpGPgZH+nC+Y0WjkCvlWMm3az578eFjVu11gB+rm9hcUVrOZyDG9Aeo6+IRyajKm4SiCaeejbnSEKVfBaGqXzL/Zj0KrgIeLhJVwD+LQ5rhK6aEqmkJWAQ+93sdArOkWAX/F411XQrm0gmE5yblfDH/08OdTvawBXwIDAQAB'
}
