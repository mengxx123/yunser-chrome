/* eslint-disable */
console.log('contant - image', window._app)


function copyToClipboard(str) {
    let text = str
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    copyFrom.value = text;
    copyFrom.style.display = 'none'
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    let ret = document.execCommand('copy');
    body.removeChild(copyFrom);
    console.log('copy ok', ret)

    // var obj=document.getElementById("clipboard");
    // console.log('elem', obj)
    // if( obj ) {
    //     obj.value = str;
    //     obj.select();
    //     let ret = document.execCommand("copy", false, null);
    //     console.log('copyed', ret, obj.value)
    // }
}

function createAppbar(appbar) {
    let $root = document.createElement('div')
    let listHtml = appbar.actions.map(item => {
        return `<div id="yext-action-button-${item.id}" class="yext-action-button">${item.text}</div>`
    }).join('\n')

    $root.innerHTML = `
    <div class="yext-appbar">
        <div class="yext-appbar-title">${appbar.title}</div>
        <div class="yext-appbar-actions">
            ${listHtml}
        </div>
    </div>
    `
    let body = document.body
    body.appendChild($root)
    document.body.style.paddingTop = '64px'

    // let $content = document.querySelector('pre')
    // console.log($content.innerHTML)

    for (let item of appbar.actions) {
        document.querySelector(`#yext-action-button-${item.id}`).addEventListener('click', () => {
            item.click && item.click()
            // chrome.runtime.sendMessage({
            //     type: 'type_copy',
            //     data: $content.innerHTML
            // }, res => {
            // })
        })
    }
}

function initImage(contentType = '') {
    function isImage() {
        return contentType.includes('image/') || location.href.match(/.png$/)
    }


    if (contentType.includes('image/svg+xml')) {
        console.log('is svg')
    } else if (isImage()) {
        console.log('is image')
        let img = document.querySelector('img')
        // console.log(img.width, img.height)
        // let $root = document.createElement('div')
        
        // $root.className = 'yext-image-info'
        // $root.innerHTML = 
        // let body = document.body
        // body.appendChild($root)
        // window.g_degree = 0
        let actions = [
            {
                id: 'img-2',
                text: '旋转',
                click() {
                    window.g_degree = (window.g_degree || 0) + 90
                    let $img = document.querySelector('img')
                    $img.style.transform = `rotate(${window.g_degree}deg)`
                    // $content.innerHTML = JSON.stringify(JSON.parse($content.innerHTML), null, 4)
                }
            },
            // {
            //     id: 'img-3',
            //     text: '编辑',
            //     click() {
            //         let $content = document.querySelector('pre')
            //         $content.setAttribute('contentEditable', 'true')
            //         // $content.innerHTML = JSON.stringify(JSON.parse($content.innerHTML), null, 4)
            //     }
            // }
        ]
        createAppbar({
            title: `图片（ ${img.width} × ${img.height}）`,
            actions
        })

        img.classList.add('ys-main-image')

        let canvas = document.createElement('canvas')
        canvas.className = 'ycanvas'
        canvas.width = img.width
        canvas.height = img.height
        document.body.append(canvas)

        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        console.log(canvas.toDataURL("image/png"))

        img.addEventListener('click', e => {
            // https://github.com/yunser/image-tool-front/blob/dev/src/views/Color.vue
            
        })
    }
    
    // if (contentType.includes('text/plain')) {
    //     let $root = document.createElement('div')
        
    //     $root.className = 'yext-action-button'
    //     $root.innerHTML = actions.map(item => {
    //         return `<div>${item.text}</div>`
    //     }).join('\n')
    //     let body = document.body
    //     body.appendChild($root)
    // }

    if (contentType.includes('application/json')) {
        let actions = [
            // {
            //     id: '1',
            //     text: '复制',
            //     click() {
            //         alert(1)
            //         // copyToClipboard($content.innerHTML)
            //     }
            // },
            {
                id: '2',
                text: '格式化',
                click() {
                    let $content = document.querySelector('pre')
                    $content.innerHTML = JSON.stringify(JSON.parse($content.innerHTML), null, 4)
                }
            },
            // {
            //     id: '3',
            //     text: '编辑',
            //     click() {
            //         let $content = document.querySelector('pre')
            //         $content.setAttribute('contentEditable', 'true')
            //     }
            // }
        ]
        createAppbar({
            title: 'JSON',
            actions
        })

        // auto format
        let $content = document.querySelector('pre')
        $content.innerHTML = JSON.stringify(JSON.parse($content.innerHTML), null, 4)
    }

    if (contentType.includes('text/plain')) {
        let actions = [
        ]
        createAppbar({
            title: '文本',
            actions
        })
    }
}

chrome.runtime.sendMessage({
	type: 'getHeaders',
	url: location.href
}, res => {
    if (!res) {
        return
    }
    console.log('收到来自后台的回复：', res)
    let contentType = ''
	for (let item of res.responseHeaders) {
        if (item.name.toLowerCase() === 'content-type') {
            contentType = item.value
        }
    }
    console.log('contentType', contentType)
    window._app.contentType = contentType

    initImage(contentType)

    window._init()
})

if (location.href.match(/file:\/\//)) {
    // initImage()
}

if (location.href.includes('http://localhost:8080/')) {
    // initImage()
    console.log('location.href', window.imok)
    window.asd4 = '1212'
}