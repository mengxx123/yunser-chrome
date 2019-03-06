/* eslint-disable */
// import storage from '../util/storage'

require('./header')

window.devtoolsDetector = function () {}
console.clear = function () {}
// var content = chrome.extension.getURL('js/content.js')
// var script = document.createElement('script')
// script.setAttribute('type', 'text/javascript')
// script.setAttribute('src', content)
// document.body.appendChild(script)


let body =document.body;
let state = 0;
let x = 0;
let y = 0;
var search_engineer = 'baidu'
let g_selectedText = ''

/**
 * @description 与background进行通讯兵监听返回结果,结果为popup中选中的搜索引擎索引
 * @param text 需要查询的值
 * @author 刘放 brizer1992@outlook.com 
 * @date 2015/12/17 11:16
 */
function chooseEngineer(text){
    console.log('搜索', text)
	chrome.extension.sendMessage({resource:"content"},function(response){
		openSearch(response.whichone,text);	
	});
	//这里由于sendMessage是异步的原因，如果直接return会造成未来得及返回正确的值,所以将执行函数提升到onmessage中。
}

function createDiv(text,left,top){
	console.log('666-2')
	var div = document.createElement("div");
	div.id = "selectionHelper";
	var span_copy = document.createElement("span");
	var span_search = document.createElement("span");
	var a_copy = document.createElement("a");
	var a_search = document.createElement("a");
	a_copy.innerHTML = "复制";
	a_search.innerHTML = "搜索 |";
	a_search.id = "a_search";
	a_search.style.color = "gray";
	let type = "baidu";
	span_copy.appendChild(a_copy);
	span_search.appendChild(a_search);
	span_copy.style.margin = "3px";
	span_search.style.margin = "3px";
	div.appendChild(span_search);
	div.appendChild(span_copy);
	div.style.cssText="left: "+left+"px; "+"top: "+top+"px; "+"position: fixed; font-size: 10px; line-height: 1.5; padding: 3px; border: 1px solid rgb(153, 153, 153); display: block; z-index: 999; background-color: rgb(255, 255, 255);";
	body.appendChild(div);
	div.addEventListener('mousedown', e => {
		console.log('elem mousedown')
		e.stopPropagation()
	}, true)
	a_search.onclick = function(){
		console.log('搜索点击')
		chooseEngineer(text);		
		closeIcons()
	};
	a_copy.onclick = function(e) {
		copyToBorad(text);
		closeIcons()
	};
}

function copyToBorad(text){
    // document.execCommand("copy", false, null);
	// window.prompt("请点击ctrl+C来复制", text);
    
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = g_selectedText;
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    console.log('复制成功', g_selectedText)
}

function openSearch(search_engineer,text){
    console.log('clik', openSearch)
	switch (search_engineer){
		case '0':
			window.open("http://www.baidu.com/baidu?word="+text,"_blank");	
			break;
		case '1':
			window.open("http://cn.bing.com/search?q="+text,"_blank");
			break;
		case '2':
			window.open("https://www.google.com.hk/?q=hello#safe=strict&q="+text,"_blank");
			break;
	};
}

/**
 * @description 鼠标抬起事件监听
 * 1. 获取选中的文本字符串
 * 2. 判断文本字符串长度和内容
 * 3. 获取鼠标抬起位置，创建div
 * 4. 将状态位state置为1，说明div已经出现
 * @author 刘放 brizer1992@outlook.com
 * @date 2015/12/15 
 */
body.addEventListener("mouseup",function(e){
	console.log('up4')
	var selected = window.getSelection();
	var selected_value = selected.toString();
	if(selected_value!=='' && selected_value.length<=30){
		var eve = e || window.event;
		x = eve.clientX;
		y = eve.clientY;
		x += document.body.scrollLeft;
		y += document.body.scrollTop;
        g_selectedText = selected_value
		createDiv(selected_value,x,y);
		state = 1;
	}else{
		//
	}
},false);

function closeIcons() {
	var div = document.getElementById("selectionHelper");
	if (div) {
		// div.style.display = "none";
		// state = 0;
		div.remove()
	}
}
/**
 * @description 鼠标点击事件监听
 * 1. 鼠标点击后首先判断状态位，如果未出现则无反应
 * 2. 如果div出现，则通过鼠标位置和div宽高决定div点击区域
 * 3. 如果在点击区域内，则无反应，正常执行
 * 4. 如果在区域外，则将div隐藏，状态位state置为0
 * @author 刘放 brizer1992@outlook.com
 * @date 2015/12/15
 */
body.addEventListener("mousedown",function(e){
	console.log('mousedown')
	if(state == 1){
		var xx = e.clientX;
		var yy = e.clientY;
		xx += document.body.scrollLeft;
		yy += document.body.scrollTop;
		if(xx<=x+38&&yy<=y+26){

		}else{
			var div = document.getElementById("selectionHelper");
			div.style.display = "none";
			state = 0;
			div.remove()
		}
	}
	closeIcons()
},false);


let userNameSelectors = [
	"input[id*=openid i]",
	"input[name='username' i]", // 我图网
	"input[name='account' i]", // 
	"input[name*=openid i]",
	"input[class*=openid i]",
	"input[class='mu-text-field-input' i]", // yunser
	"input[id*=user i]",
	"input[name*=user i]",
	"input[class*=user i]",
	"input[id*=login i]",
	"input[name*=login i]",
	"input[class*=login i]",
	"input[id*=email i]",
	"input[name*=email i]",
	"input[class*=email i]",
	"input[type=email i]",
	"input[type='text' i]",
	"input[type=tel i]"
]

let passwordSelectors = [
	"input[type=password i]",
	'[name="password" i]'
]

function findInput(selectors) {
	console.log('find user name')
	let results = []
	function push(elem) {
		for (let item of results) {
			if (item === elem) {
				return
			}
		}
		results.push(elem)
	}
	for (let item of selectors) {
		console.log('选择器', item)
		let elems = document.querySelectorAll(item)
		if (elems.length) {
			console.log('ook')
			// console.log(elem)
			for (let elem of elems) {
				if (elem.disabled) {
					console.log('失效')
					continue
				}
				if (elem.style.display === 'none') {
					console.log('display none')
					continue
				}
				if (elem.getAttribute('type') === 'submit') {
					continue
				}
				// Elem or its parent has a style 'display: none',
				// or it is just too narrow to be a real field (a trap for spammers?).
				if (elem.offsetWidth < 30 || elem.offsetHeight < 10) {
					console.log('太小')
					continue
				}
				push(elem)
			}
		}
	}
	console.log('length2', results.length)
	// console.log(results[0] === results[1])
	results = results.sort((a, b) => {
		function score(elem) {
			let score = 0
			if (elem.getAttribute('name')) {
				score += 1
			}
			return score
		}
		return score(b) - score(a)
	})
	console.log('繁华', results)
	return results
}

function findUserName() {
	return findInput(userNameSelectors)
}

function findPassword() {
	return findInput(passwordSelectors)
}

function setInputValue(el, value) {
	let eventNames = ['click', 'focus']
    eventNames.forEach(function(eventName) {
      	el.dispatchEvent(new Event(eventName, { bubbles: true }))
	})
	el.setAttribute("value", value);
    el.value = value;
    eventNames = [
		"keypress",
		"keydown",
		"keyup",
		"input",
		"blur",
		"change"
	  ];
	  eventNames.forEach(function(eventName) {
		el.dispatchEvent(new Event(eventName, { bubbles: true }));
	  });
}
function setAccountToPage(item) {
	let accounts = findUserName()
	if (accounts.length) {
		console.log('ok account2', accounts[0])
		// accounts[0].value = item.account
		setInputValue(accounts[0], item.account)
	}
	let passwords = findPassword()
	if (passwords.length) {
		console.log('ok password', passwords[0])
		// passwords[0].value = item.password
		setInputValue(passwords[0], item.password)
	}
	// TODO auto focues
	// document.querySelector('[name="password"]').value = item.password
	// document.getElementById('username').value = item.account
	// document.getElementById('password').value = item.password
}

let g_list
function usePassword(index) {
	console.log(g_list[index])
}
window.usePassword = usePassword
function showPasswordList(list) {
	g_list = list
	let divElem = document.createElement('div')
	// divElem.setAttribute('id', 'tunser-password-list')
	// divElem.setAttribute('class', 'yunser-style')
	// divElem.setAttribute('type', 'text/css')
	let listHtml = ``
	let i = 0
	for (let item of list) {
		listHtml += `
		<div class="yunser-password-item">${item.title}</div>
		`
		i++
	}
	divElem.innerHTML = `
	<div class="yunser-password-list">${listHtml}</div>
	`
	// divElem.appendChild(document.createTextNode(styleText))
	// var head = document.getElementsByTagName("head")[0];

	document.body.appendChild(divElem)

	var oli = document.getElementsByClassName('yunser-password-item')
	console.log('length', oli)
    for (let i = 0; i < oli.length; i++) {
        oli[i].onclick = function () {
			console.log(i, g_list[i])
			setAccountToPage(g_list[i])
        }
	}
	window.asd = 'asd'
}
// chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
// 	console.log('youxiaoxi')
// 	if(request.resource == "content"){
// 		whichoneSearch = getItem();
// 		sendResponse({whichone:whichoneSearch});
// 	}else if(request.resource == "popup"){
// 		sendResponse({whichone:request.selected});
// 		localStorage.setItem("index",request.selected);
// 	}
// })

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('onMessage')
    // if(request.editable) {
    //     var focused = document.activeElement;
    //     if(request.doAppend) {
    //         focused.value+=request.info;
    //     } else {
    //         focused.value = request.info;            
    //     }
	// }
	// var focused = document.activeElement
	if (request.type === 'passwordList') {
		console.log('收到list2', request.data)
		showPasswordList(request.data)
	}
})

// background color
// let bgColor = storage.get('globalBgColor', '')
// console.log('bgcolor', bgColor)
// if (bgColor) {
// 	document.body.style.backgroundColor = bgColor
// }
// document.body.style.backgroundColor = '#000'
chrome.storage.local.get('globalBgColor', (res, b) => {
	document.body.style.backgroundColor = res.globalBgColor
})

let styleText = ''
if (location.host === 'www.baidu.com') {
	styleText = `
// body {
// 	background-color: #09c;
// }
`
}

if (location.host === 'www.zhihu.com') {
	styleText = `
	.GlobalSideBar,
	.Question-sideColumn,
	.CornerAnimayedFlex {
		display: none;
	}
`
}

function setPageStyle(id, styleText) {
	let styleElem = document.createElement('style')
	styleElem.setAttribute('id', 'ysStyle-' + id)
	styleElem.setAttribute('class', 'yunser-style')
	styleElem.setAttribute('type', 'text/css')
	styleElem.appendChild(document.createTextNode(styleText))
	var head = document.getElementsByTagName("head")[0];

	head.appendChild(styleElem);
}

// setPageStyle('1', styleText)

// document.documentElement.appendChild(styleElem)

// console.log('当前页面', location)


// function addStyleElement(styleElement) {
// 	if (!doc.documentElement || doc.getElementById(styleElement.id)) {
// 		return;
// 	}
// 	document.documentElement.appendChild(styleElem)
// 	  .disabled = g_disableAll;
// 	getDynamicIFrames(doc).forEach(function(iframe) {
// 		if (iframeIsLoadingSrcDoc(iframe)) {
// 			addStyleToIFrameSrcDoc(iframe, styleElement);
// 		} else {
// 			addStyleElement(styleElement, iframe.contentDocument);
// 		}
// 	});
// }

// addStyleElement(styleElement, document);

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if (port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			if (msg.type == 'setStyle') {
				console.log('设置样式', msg.style)
				setPageStyle(msg.style.id, msg.style.style)
				// port.postMessage({answer: '我是你爸！'});
			}
			if (msg.type == 'removeStyle') {
				let styleElem = document.getElementById('ysStyle-' + msg.style.id)
				if (!styleElem) {
					console.log('not found')
				}
				styleElem.parentNode.removeChild(styleElem)
			}
			if (msg.type == 'openReadMode') {
				openReadMode()
			}
		});
	}
});

chrome.runtime.sendMessage({
	type: 'getStyle',
	url: location.host
}, res => {
	for (let item of res) {
		setPageStyle(item.id, item.style)
	}
})

// 阅读模式
let simpleplugins = [
	{
		id: '998-1',
		host: 'www.jianshu.com',
		match: 'www.jianshu.com/p/',
		articleSelector: '.show-content-free',
		style: `
			.navbar,
			.note {
				display: none !important;
			}	
		`
	},
	{
		id: '998-2',
		host: 'www.cnblogs.com',
		match: 'www.cnblogs.com/[\\d\\D]+?/p/[\\d\\D]+?.html',
		articleSelector: '#cnblogs_post_body',
		style: `
			#home {
				display: none;
			}	
		`
	},
	{
		id: '998-3',
		host: 'sspai.com',
		match: 'sspai.com',
		articleSelector: '.wangEditor-txt',
		style: `
		#app {
			display: none;
		}		
		`
	},
	{
		id: '998-3',
		host: 'blog.csdn.net',
		match: 'blog.csdn.net',
		articleSelector: '#article_content',
		style: `
		.pulllog-box,
	#mainBox {
		display: none !important;
	}		
		`
	},
	{
		id: '998-4',
		host: 'segmentfault.com',
		match: 'segmentfault.com',
		articleSelector: '.article__content',
		style: `
		.blog-post2 {
		display: none !important;
	}		
		`
	}
]

function openReadMode() {
	let found = false
	for (let plugin of simpleplugins) {
		if (plugin.host === location.host) {
			loadSimplePlugin(plugin)
			found = true
			break
		}
	}
	if (!found) {
		let elem = document.querySelector('#article')
		if (elem) {
			loadSimplePlugin({
				style: '',
				articleSelector: '#article',
			})
			return
		}
		elem = document.querySelector('.article')
		if (elem) {
			loadSimplePlugin({
				style: '',
				articleSelector: '.article',
			})
			return
		}
		elem = document.querySelector('article')
		if (elem) {
			loadSimplePlugin({
				style: '',
				articleSelector: 'article',
			})
			return
		}
	}
}

function loadSimplePlugin(plugin) {
	console.log('loadSimplePlugin(', plugin)
	// if (!new RegExp(plugin.match).test(location.href)) {
	// 	return
	// }
	setPageStyle('ys-simple-style', `
	body {
		background-color: '#f00'
		overflow: hidden;
	}
	${plugin.style}
	.yunser-reader-mode {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000000000;
		background-color: #f9f9f9;
		overflow-x: hidden;
		overflow-x: auto;
	}
	.yrm-container {
		width: 100%;
		max-width: 640px;
		margin: 0 auto;
	}
	.yrm-article {
		padding: 32px;
	}
	.yrm-article blockquote {
		border-left: 4px solid #eee;
	}
	.yrm-article h1 {
        margin-top: 20px;
        margin-bottom: 15px;
        padding-bottom: 5px;
        font-size: 30px;
    }
    .yrm-article h2 {
        margin-top: 20px;
        margin-bottom: 15px;
        padding-bottom: 5px;
        font-size: 25px;
    }
    .yrm-article h3 {
        font-size: 22px;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .yrm-article h4 {
        font-size: 20px;
    }
    .yrm-article h5,
    .yrm-article h6 {
        font-size: 20px;
    }
    .yrm-article p {
        line-height: 1.7;
        margin-bottom: 15px;
    }
    .yrm-article img {
        margin-bottom: 16px;
        max-width: 100%;
    }
    .yrm-article ul {
        list-style: disc;
    }
    .yrm-article ol {
        list-style: decimal;
    }
    .yrm-article li {
        line-height: 1.6;
        margin-bottom: 8px;
        list-style-type: inherit;
    }
    .yrm-article ul,
    .yrm-article ol {
        padding-left: 16px;
        margin-bottom: 16px;
        ul,
        ol {
            margin-top: 8px;
            padding-left: 40px;
        }
    }
    .yrm-article ul ul,
    .yrm-article ol ul {
        list-style-type: circle;
    }
    .yrm-article ol ol ul,
    .yrm-article ol ul ul,
    .yrm-article ul ol ul,
    .yrm-article ul ul ul {
        list-style-type: square;
    }
    .yrm-article table {
        max-width: 100%;
        margin-bottom: 16px;
        th,
        td {
            padding: 8px 16px;
            line-height: 1.42857143;
            vertical-align: top;
            border: 1px solid #ddd;
        }
    }
    .yrm-article pre code {
        padding: 16px;
    }
	.yrm-close {
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 1001;
		color: #f00;
		cursor: pointer;
	}
	`)
	let $root = document.createElement('div')
	$root.className = 'yunser-reader-mode'
	$root.innerHTML = `
	<div class="yrm-close" id="close">关闭</div>
	<div class="yrm-container" id="yrm-container">
		<article id="yrm-article" class="yrm-article"></article>
	</div>
	`
	// styleElem.setAttribute('id', 'ysStyle-' + id)
	// styleElem.setAttribute('class', 'yunser-style')
	// styleElem.setAttribute('type', 'text/css')
	// styleElem.appendChild(document.createTextNode(styleText))
	let body = document.getElementsByTagName('body')[0];
	body.appendChild($root)
	let article = document.querySelector(plugin.articleSelector)
	console.log('article', article.innerHTML)

	let $article = document.getElementById('yrm-article')
	console.log('elem', $article)
	$article.innerHTML = article.innerHTML
	let $close = document.getElementById('close')
	function $$(selector) {
		return document.querySelector(selector)
	}
	$close.addEventListener('click', () => {
		let $style = document.getElementById('ysStyle-ys-simple-style')
		$style.parentNode.removeChild($style)
		$root.parentNode.removeChild($root)
	})
}

function parseQueryString(url) {
	var params = {};
	var arr = url.split("?");
	if (arr.length <= 1) {
	   return params;
	}
	arr = arr[1].split("&");
	for(var i = 0, l = arr.length; i < l; i++) {
	   var a = arr[i].split("=");
	   params[a[0]] = a[1];
	}
	return params;
}

let commonSearchs = [
	{
		name: 'Bing',
		host: 'cn.bing.com',
		searchUrl: 'https://cn.bing.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '搜狗',
		host: 'www.sogou.com',
		searchUrl: 'https://www.sogou.com/web?query={keyword}',
		searchKey: 'query'
	},
	{
		name: '百度',
		host: 'www.baidu.com',
		searchUrl: 'https://www.baidu.com/s?wd={keyword}',
		searchKey: 'wd'
	},
	{
		name: 'Google',
		host: 'www.google.com',
		searchUrl: 'https://www.google.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '知乎',
		host: 'www.zhihu.com',
		searchUrl: 'https://www.zhihu.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '豆瓣',
		host: 'www.douban.com',
		searchUrl: 'https://www.douban.com/search?q={keyword}',
		searchKey: 'q'
	},

	{
		name: '淘宝',
		host: 's.taobao.com',
		searchUrl: 'https://s.taobao.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '京东',
		host: 'search.jd.com',
		searchUrl: 'http://search.jd.com/Search?keyword={keyword}',
		searchKey: 'keyword'
	},
	{
		name: '天猫',
		host: 'list.tmall.com',
		searchUrl: 'https://list.tmall.com/search_product.htm?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '苏宁易购',
		host: 'search.suning.com',
		searchUrl: 'https://search.suning.com/{keyword}/',
		searchKey: 'q' // TODO
	},
	{
		name: '亚马逊',
		host: 'search.suning.com',
		searchUrl: 'https://www.amazon.cn/s?field-keywords={keyword}/',
		searchKey: 'field-keywords'
	},
	{
		name: '当当',
		host: 'search.dangdang.com',
		searchUrl: 'http://search.dangdang.com/?key={keyword}/',
		searchKey: 'key'
	},

	{
		name: '网易云音乐',
		host: 'music.163.com',
		searchUrl: 'https://music.163.com/#/search/m/?s={keyword}',
		searchKey: 's'
	},
	{
		name: 'QQ 音乐',
		host: 'y.qq.com',
		searchUrl: 'https://y.qq.com/portal/search.html#w={keyword}',
		searchKey: 'w' // TODO
	},
	{
		name: '酷狗音乐',
		host: 'www.kugou.com',
		searchUrl: 'https://www.kugou.com/yy/html/search.html#searchKeyWord={keyword}',
		searchKey: 'searchKeyWord' // TODO
	},
	{
		name: '虾米音乐',
		host: 'www.xiami.com',
		searchUrl: 'https://www.xiami.com/search?key={keyword}',
		searchKey: 'key'
	},

	{
		name: '爱奇艺',
		host: 'www.kugou.com',
		searchUrl: 'https://so.iqiyi.com/so/q_{keyword}',
		searchKey: 'searchKeyWord' // TODO
	},
	{
		name: 'Bilibili',
		host: 'search.bilibili.com',
		searchUrl: 'https://search.bilibili.com/all?keyword={keyword}',
		searchKey: 'keyword'
	},
	{
		name: '优酷',
		host: 'so.youku.com',
		searchUrl: 'https://so.youku.com/search_video/q_{keyword}',
		searchKey: 'keyword' // TODO
	},

	{
		name: '腾讯动漫',
		host: 'ac.qq.com',
		searchUrl: 'https://ac.qq.com/Comic/searchList/search/{keyword}',
		searchKey: 'keyword' // TODO
	},

	{
		name: 'Iconfont',
		host: 'www.iconfont.cn',
		searchUrl: 'https://www.iconfont.cn/search/index?searchType=icon&q={keyword}',
		searchKey: 'q'
	},

	{
		name: '百度翻译',
		host: 'www.iconfont.cn',
		searchUrl: 'https://fanyi.baidu.com/#auto/auto/{keyword}',
		searchKey: 'q' // TODO
	},
	{
		name: '谷歌翻译',
		host: 'translate.google.cn',
		searchUrl: 'https://translate.google.cn/?hl=auto&tab=TT#view=home&op=translate&sl=auto&tl=auto&text={keyword}',
		searchKey: 'text'
	},
	{
		name: '云设',
		host: 'search.yunser.com',
		searchUrl: 'https://search.yunser.com/search?keyword={keyword}',
		searchKey: 'keyword'
	},
]

if (location.host === 'www.sogou.com') {

	
}

function searchAsd(item) {
	let keyword = parseQueryString(location.href)
	console.log('keyword', keyword)
	keyword = decodeURIComponent(keyword[item.searchKey])

	let $root = document.createElement('div')
	$root.className = 'yunser-search-box'
	let html = ''
	let list = []
	for (let _item of commonSearchs) {
		if (_item.host !== item.host) {
			let url = _item.searchUrl.replace('{keyword}', encodeURIComponent(keyword))
			list.push(`
				<div class="yunser-search-item">
					<a class="yunser-search-link" href="${url}" target="_blank">${_item.name}</a>
				</div>
			`)
		}
	}
	$root.innerHTML = list.join('\n')
	// styleElem.setAttribute('id', 'ysStyle-' + id)
	// styleElem.setAttribute('class', 'yunser-style')
	// styleElem.setAttribute('type', 'text/css')
	// styleElem.appendChild(document.createTextNode(styleText))
	let body = document.getElementsByTagName('body')[0];
	body.appendChild($root)

	setPageStyle('ys-search-style', `
	.yunser-search-box {
		position: fixed;
		top: 0;
		right: 0;
		width: 110px;
		bottom: 0;
		padding: 16px;
		z-index: 1000000000;
		background-color: #f9f9f9;
		overflow-x: hidden;
		overflow-x: auto;
		border-left: 1px solid #ccc;
		box-sizing: border-box;
	}
	.yunser-search-list {}
	.yunser-search-item {
		margin-bottom: 8px;
	}
	.yunser-search-link {
		color: #666;
		font-size: 14px;
	}
	`)
}

for (let item of commonSearchs) {
	if (location.host === item.host) {
		let keyword = parseQueryString(location.href)
		if (keyword[item.searchKey]) {
			searchAsd(item)
		}
	}
}


// 密码管理模块
function dealPassword($account, $password) {
	if (!$account) {
		return
	}
	$account.value = 'cjh'
	$password.value = '123456'
	let $root = document.createElement('div')
	$root.className = 'yunser-password-box'
	$root.innerHTML = `

	`
	// styleElem.setAttribute('id', 'ysStyle-' + id)
	// styleElem.setAttribute('class', 'yunser-style')
	// styleElem.setAttribute('type', 'text/css')
	// styleElem.appendChild(document.createTextNode(styleText))
	let body = document.body;
	body.appendChild($root)
}


// dealPassword(document.getElementById('username'), document.getElementById('password'))

chrome.runtime.sendMessage({
	type: 'getPassword',
	host: location.host
}, res => {
	// console.log('收到来自后台的回复：', res)
	// for (let item of res) {
	// 	setPageStyle(item.id, item.style)
	// }
})

console.log('inject finish2')
