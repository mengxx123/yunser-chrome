/* eslint-disable */
console.log('key', window._app)

function _sendMessage(msg) {
    chrome.runtime.sendMessage(msg, res => {
    })
}

document.addEventListener('keydown', e => {
    console.log('keydown', e.keyCode)

    if (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA') {
        return
    }
    if (e.ctrlKey && e.keyCode === 37) {
        _sendMessage({
            type: 'type_tabLeft',
            url: location.href
        })
        return false
    }
    if (e.ctrlKey && e.keyCode === 39) {
        _sendMessage({
            type: 'type_tabRight',
            url: location.href
        })
        return false
    }
    if (e.shiftKey && e.keyCode === 37) {
        _sendMessage({
            type: 'type_showLeft',
            url: location.href
        })
        return false
    }
    if (e.shiftKey && e.keyCode === 39) {
        _sendMessage({
            type: 'type_showRight',
            url: location.href
        })
        return false
    }
}, false)

