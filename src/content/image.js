/* eslint-disable */
console.log('image', window._app)


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

function initImage() {

}

if (location.href.match(/.(gif|png|jpg|webp)$/)) {
    // console.log('is image')
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
}

chrome.runtime.sendMessage({
	type: 'getHeaders',
	url: location.href
}, res => {
    console.log('收到来自后台的回复：', res)
    let contentType = ''
	for (let item of res.responseHeaders) {
        if (item.name === 'Content-Type') {
            contentType = item.value
        }
    }
    console.log('contentType', contentType)
    window._app.contentType = contentType

    
    if (contentType.includes('text/plain')) {
        let $root = document.createElement('div')
        
        $root.className = 'yext-action-button'
        $root.innerHTML = actions.map(item => {
            return `<div>${item.text}</div>`
        }).join('\n')
        let body = document.body
        body.appendChild($root)
    }

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
    }

    if (contentType.includes('text/plain')) {
        let actions = [
        ]
        createAppbar({
            title: '文本',
            actions
        })
    }

    window._init()
})
