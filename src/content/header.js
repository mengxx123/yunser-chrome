/* eslint-disable */
console.log('inject')

function getExt(url) {
    let arr = url.split('/')
    let fileName = arr[arr.length - 1]
    arr = fileName.split('.')
    if (arr.length) {
        return arr[arr.length - 1]
    }
    return ''
}

window._app = {
    fileExtension: ext,
    fileType: 'image'
}

let ext = getExt(location.href)
console.log('ext', ext)

export default {}
