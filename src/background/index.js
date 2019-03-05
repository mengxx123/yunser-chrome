/* eslint-disable */
import storage from '../util/storage.js'
import http from '../util/http'

const __ = chrome.i18n.getMessage
console.log(__('background'))



// import storage from '../util/storage'

console.log('background !')


//选中的搜索引擎
var whichoneSearch = '0';
/**
 * @description 监听来自content.js的消息
 */
chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
	if(request.resource == "content"){
		whichoneSearch = getItem();
		sendResponse({whichone:whichoneSearch});
	}else if(request.resource == "popup"){
		sendResponse({whichone:request.selected});
		localStorage.setItem("index",request.selected);
    }
    if (request.type === 'getStyle') {
        let userStyle = storage.get('userStyle')
        let ret = []
        for (let item of userStyle) {
            if (item.url.includes(request.url)) {
                ret.push(item)
            }
        }
        console.log('查找', ret)
        sendResponse(ret)
    }
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});

function getItem(){
	var item;
	if(!window.localStorage){
		return "该浏览器版本太低，请更新!";
	}
	item = localStorage.getItem("index");
	if(!item){
		localStorage.setItem("index","0");
		item = "0";
	}
	return item;
}


chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(text => {
    // if (!text) {
    //     return
    // }
    let url = 'https://search.yunser.com/search?keyword=' + text
    console.log('url', url)
    chrome.tabs.getSelected(null, tab => {
        chrome.tabs.update(tab.id, {
            url
        })
    })
})

// function getOpeningIds() {
//     var ids = [];
//     try {
//         ids = JSON.parse(localStorage.openWhenComplete);
//     } catch (e) {
//         localStorage.openWhenComplete = JSON.stringify(ids);
//     }
//     return ids;
// }

// function setOpeningIds(ids) {
//     localStorage.openWhenComplete = JSON.stringify(ids);
// }

// chrome.downloads.onChanged.addListener(function (delta) {
//     if (!delta.state ||
//         (delta.state.current != 'complete')) {
//         return;
//     }
//     var ids = getOpeningIds();
//     if (ids.indexOf(delta.id) < 0) {
//         return;
//     }
//     chrome.downloads.open(delta.id);
//     ids.splice(ids.indexOf(delta.id), 1);
//     setOpeningIds(ids);
// });

// chrome.contextMenus.create({
//     id: 'open',
//     title: chrome.i18n.getMessage('openContextMenuTitle'),
//     contexts: ['link'],
// });

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function () {
    // Create one test item for each context type.
    // var contexts = ["page", "selection", "link", "editable", "image", "video",
    //     "audio"];
    // for (var i = 0; i < contexts.length; i++) {
    //     var context = contexts[i];
    //     var title = "Test '" + context + "' menu item";
    //     var id = chrome.contextMenus.create({
    //         "title": title,
    //         "contexts": [context],
    //         "id": "context" + context
    //     });
    //     console.log("'" + context + "' item:" + id);
    // }

    chrome.contextMenus.create({
        id: 'FILL_TEXT',
        title: '填充',
        contexts: ['editable']
    })

    chrome.contextMenus.create({
        id: '001',
        title: '下载图片',
        contexts: ['image']
    })
    chrome.contextMenus.create({
        id: '002',
        title: '设为壁纸',
        contexts: ['image']
    })
    chrome.contextMenus.create({
        id: 'SEARCH_IMAGE_BY_GOOGLE',
        title: '谷歌搜索该图片',
        contexts: ['image']
    })
    chrome.contextMenus.create({
        id: 'COPY_IMAGE_MARKDOWN',
        title: '复制图片地址（Markdown 格式）',
        contexts: ['image']
    })
    chrome.contextMenus.create({
        id: 'COPY_IMAGE_BASE64',
        title: '复制图片（Base64 格式）',
        contexts: ['image']
    })

    chrome.contextMenus.create({
        id: '003',
        title: '保存笔记',
        contexts: ['selection']
    })
    chrome.contextMenus.create({
        id: 'COPY_TEXT',
        title: '复制文本',
        contexts: ['selection']
    })
    
    chrome.contextMenus.create({
        id: '009',
        title: '选中文本生成二维码',
        contexts: ['selection']
    })

    chrome.contextMenus.create({
        id: '006',
        title: '当前网址生成二维码',
        contexts: ['page']
    })

    chrome.contextMenus.create({
        title: '搜索',
        id: 'other',
        contexts: ['selection']
    })
    let menus = [
        {
            id: 'SEARCH_GOOGLE',
            title: '谷歌',
            url: 'https://www.google.com/search?q={text}'
        },
        {
            id: 'SEARCH_BAIDU',
            title: '百度',
            url: 'https://www.baidu.com/s?wd={text}'
        },
        {
            id: 'SEARCH_BING',
            title: 'Bing',
            url: 'https://cn.bing.com/search?q={text}'
        },
        {
            id: 'SEARCH_SOUGOU',
            title: '搜狗搜索',
            url: 'http://www.sogou.com/web?query={text}'
        },
        {
            id: 'SEARCH_360',
            title: '360 搜索',
            url: 'https://www.so.com/s?q={text}'
        },
        {
            id: 'SEARCH_WIKI',
            title: '维基百科',
            url: 'https://zh.wikipedia.org/wiki/{text}'
        },
        {
            id: 'SEARCH_BAIDU_BAIKE',
            title: '百度百科',
            url: 'https://baike.baidu.com/searchword/?pic=1&word={text}'
        },
        {
            id: 'SEARCH_BAIDU_IMAGE',
            title: '百度图片',
            url: 'https://image.baidu.com/search/index?tn=baiduimage&word={text}'
        },
        {
            id: 'SEARCH_GOOGLE_IMAGE',
            title: '谷歌图片',
            url: 'https://www.google.com.hk/search?q={text}'
        },
        {
            id: 'SEARCH_BAIDU_TRANSLATE',
            title: '百度翻译',
            url: 'https://fanyi.baidu.com/#en/zh/{text}'
        },
        {
            id: 'SEARCH_TAOBAO',
            title: '淘宝',
            url: 'https://ai.taobao.com/search/index.htm?key={text}'
        },
    ]
    for (let item of menus) {
        chrome.contextMenus.create({
            id: item.id,
            title: item.title,
            parentId: 'other',
            contexts: ['selection']
        })
    }

    let allMenu = []
    allMenu = allMenu.concat(menus)

    chrome.contextMenus.create({
        title: '搜索',
        id: 'parent'
    })
    chrome.contextMenus.create({
        title: "在 Google 搜索本网站",
        "parentId": "parent",
        "id": "007"
    })
    chrome.contextMenus.create({
        title: '在百度搜索本站点',
        "parentId": "parent",
        "id": "008"
    })

    chrome.contextMenus.create({
        id: 'COPY',
        title: '复制',
    })
    chrome.contextMenus.create({
        id: 'COPY_TITLE',
        title: '复制页面标题',
        parentId: 'COPY'
    })
    chrome.contextMenus.create({
        id: 'COPY_URL',
        title: '复制页面链接',
        parentId: 'COPY'
    })
    chrome.contextMenus.create({
        id: 'COPY_TITLE_AND_URL',
        title: '复制页面标题和链接',
        parentId: 'COPY'
    })
    chrome.contextMenus.create({
        id: 'COPY_TITLE_AND_URL_HTML',
        title: '复制页面标题和链接（HTML 格式）',
        parentId: 'COPY'
    })
    chrome.contextMenus.create({
        id: 'COPY_TITLE_AND_URL_MARKDOWN',
        title: '复制页面标题和链接（Markdown 格式）',
        parentId: 'COPY'
    })

    chrome.contextMenus.create({
        title: '网络工具',
        id: 'network'
    })
    chrome.contextMenus.create({
        title: '网站 Whios【站长工具】',
        parentId: "network",
        id: '034'
    })
    chrome.contextMenus.create({
        title: '网站 IP【好IP在线工具】',
        parentId: "network",
        id: '029'
    })
    chrome.contextMenus.create({
        title: 'Ping 检测【站长工具】',
        parentId: "network",
        id: '035'
    })
    chrome.contextMenus.create({
        title: '同 IP 站点【站长工具】',
        parentId: "network",
        id: '030'
    })
    chrome.contextMenus.create({
        title: '备案查询【站长工具】',
        parentId: "network",
        id: '031'
    })
    chrome.contextMenus.create({
        title: '网站综合查询【站长工具】',
        parentId: "network",
        id: '032'
    })
    chrome.contextMenus.create({
        title: '网站综合查询【爱站网】',
        parentId: "network",
        id: '033'
    })

    chrome.contextMenus.create({
        title: '网络工具',
        id: 'network'
    })

    // chrome.contextMenus.create({
    //     title: '更多',
    //     id: 'more'
    // })
    // chrome.contextMenus.create({
    //     title: '在百度搜索本站点',
    //     parentId: "more",
    //     id: '028'
    // })

    var getHost = function(url) { 
        var host = "null";
        if(typeof url == "undefined"
                        || null == url)
                url = window.location.href;
        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if(typeof match != "undefined"
                        && null != match)
                host = match[1];
        return host;
    }


    function copyToClipboard(str) {
        var obj=document.getElementById("clipboard");
        console.log('elem', obj)
        if( obj ) {
            obj.value = str;
            obj.select();
            document.execCommand("copy", false, null);
            console.log('copyed', obj.value)
        }
    }

    chrome.contextMenus.onClicked.addListener((menu, e) => {
        console.log('menu', menu)
        if (menu.menuItemId === '001') {
            chrome.downloads.download({ url: menu.srcUrl }, downloadId => {
                // var ids = getOpeningIds()
                // if (ids.indexOf(downloadId) >= 0) {
                //     return
                // }
                // ids.push(downloadId)
                // setOpeningIds(ids)
            });
        } else if (menu.menuItemId === '002') {
            storage.set('wallpaper', menu.srcUrl)
        } else if (menu.menuItemId === '003') {
            alert('功能暂未实现')
            // storage.set('wallpaper', menu.srcUrl)
        } else if (menu.menuItemId === '006') {
            window.open('https://nodeapi.yunser.com/qrcode?content=' + encodeURIComponent(menu.pageUrl))
        } else if (menu.menuItemId === '007') {
            let host = getHost(menu.pageUrl)
            window.open('https://www.google.com/search?ie=UTF-8&q=' + encodeURIComponent('site:' + host))
        } else if (menu.menuItemId === '008') {
            let host = getHost(menu.pageUrl)
            window.open('https://www.baidu.com/s?wd=' + encodeURIComponent('site:' + host))
        } else if (menu.menuItemId === '009') {
            window.open('https://nodeapi.yunser.com/qrcode?content=' + encodeURIComponent(menu.selectionText))
        } else if (menu.menuItemId === '029') {
            let host = getHost(menu.pageUrl)
            window.open('https://haoip.cn/ip/' + encodeURIComponent(host))
        } else if (menu.menuItemId === '030') {
            let host = getHost(menu.pageUrl)
            window.open('http://s.tool.chinaz.com/same?s=' + encodeURIComponent(host))
        } else if (menu.menuItemId === '031') {
            let host = getHost(menu.pageUrl)
            window.open('http://icp.chinaz.com/' + encodeURIComponent(host))
        } else if (menu.menuItemId === '032') {
            let host = getHost(menu.pageUrl)
            window.open('http://seo.chinaz.com/?q=' + encodeURIComponent(host))
        } else if (menu.menuItemId === '033') {
            let host = getHost(menu.pageUrl)
            window.open('https://www.aizhan.com/cha/' + encodeURIComponent(host))
        } else if (menu.menuItemId === '034') {
            let host = getHost(menu.pageUrl)
            // doname
            window.open('http://whois.chinaz.com/' + encodeURIComponent(host))
        } else if (menu.menuItemId === '035') {
            let host = getHost(menu.pageUrl)
            // doname
            window.open('http://ping.chinaz.com/?alllinetype=%E5%85%A8%E9%80%89&linetype=%E7%94%B5%E4%BF%A1&linetype=%E5%A4%9A%E7%BA%BF&linetype=%E8%81%94%E9%80%9A&linetype=%E7%A7%BB%E5%8A%A8&linetype=%E6%B5%B7%E5%A4%96&host=' + encodeURIComponent(host))
        } else if (menu.menuItemId === 'COPY_IMAGE_MARKDOWN') {
            copyToClipboard(`![](${menu.srcUrl})`)
        } else if (menu.menuItemId === 'COPY_IMAGE_BASE64') {
            function copyBase64() {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                var src = this.src;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);
                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                var base64value;
                if(src.indexOf('jpeg') != -1 || src.indexOf('jpg') != -1){
                    base64value = canvas.toDataURL("image/jpeg");
                }else{
                    base64value = canvas.toDataURL("image/png");
                }
                textarea.value = base64value;
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
                this.remove();
            }
            var img = document.createElement('img');
            img.setAttribute('src', menu.srcUrl);
            img.addEventListener('load', copyBase64);
            document.body.appendChild(img);
            // copyToClipboard(`![](${menu.srcUrl})`)
        } else if (menu.menuItemId === 'SEARCH_IMAGE_BY_GOOGLE') {
            window.open('http://www.google.com.hk/searchbyimage?image_content=&filename=&hl=zh-CN&newwindow=1&safe=strict&image_url=' + encodeURIComponent(menu.srcUrl))
        } else if (menu.menuItemId === 'COPY_TEXT') {
            copyToClipboard(menu.selectionText)
        } else if (menu.menuItemId === 'COPY_TITLE') {
            chrome.tabs.getSelected(null, function(tab) {
                copyToClipboard(tab.title); 
                console.log(tab.title);       
            })
        } else if (menu.menuItemId === 'COPY_URL') {
            chrome.tabs.getSelected(null, function(tab) {
                copyToClipboard(tab.url); 
            })
        } else if (menu.menuItemId === 'COPY_TITLE_AND_URL') {
            chrome.tabs.getSelected(null, function(tab) {
                copyToClipboard(tab.title + '\n' + tab.url) 
            })
        } else if (menu.menuItemId === 'COPY_TITLE_AND_URL_HTML') {
            chrome.tabs.getSelected(null, function(tab) {
                // copyToClipboard("<a href='"+tab.url+"'>"+tab.title+"</a>") 
                copyToClipboard(`<a href="${tab.url}">${tab.title}</a>`) 
            })
        } else if (menu.menuItemId === 'COPY_TITLE_AND_URL_MARKDOWN') {
            chrome.tabs.getSelected(null, function(tab) {
                copyToClipboard(`[${tab.title}](${tab.url})`) 
            })
        } else if (menu.menuItemId === 'FILL_TEXT') {
            console.log('FILL_TEXT')
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    asd: 'asd',
                    // info: chromeStorageObj.cm_items[info.menuItemId].info,
                    // editable: info.editable,
                    // doAppend: chromeStorageObj.doAppend
                })
            })
        }

        for (let item of allMenu) {
            if (item.id === menu.menuItemId) {
                window.open(item.url.replace('{text}', menu.selectionText))
                break
            }
        }
        
    })

    // Create a parent item and two children.
    

    // Create some radio items.
    // chrome.contextMenus.create({
    //     "title": "Radio 1", "type": "radio",
    //     "id": "radio1"
    // });
    // chrome.contextMenus.create({
    //     "title": "Radio 2", "type": "radio",
    //     "id": "radio2"
    // });
    // console.log("radio1 radio2");

    // // Create some checkbox items.
    // chrome.contextMenus.create(
    //     { "title": "Checkbox1", "type": "checkbox", "id": "checkbox1" });
    // chrome.contextMenus.create(
    //     { "title": "Checkbox2", "type": "checkbox", "id": "checkbox2" });
    // console.log("checkbox1 checkbox2");

    // Intentionally create an invalid item, to show off error checking in the
    // create callback.
    // console.log("About to try creating an invalid item - an error about " +
    //     "duplicate item child1 should show up");
    // chrome.contextMenus.create({ "title": "Oops", "id": "child1" }, function () {
    //     if (chrome.extension.lastError) {
    //         console.log("Got expected error: " + chrome.extension.lastError.message);
    //     }
    // });
});

// http.post(`/login`, {
//     account: '',
//     password: ''
// })
// .then(res => {
//     let data = res.data
//     console.log('数据')
//     console.log(data)
//     storage.set('user', data.user)
//     storage.set('accessToken', data.accessToken)
// },
// res => {
//     console.log('cuol', res)
//     // if (response.code === 403) {
//     //     this.$store.state.user = null
//     // }
//     // this.loading = false
// })