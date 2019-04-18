/* eslint-disable */
console.log('password')

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
	eventNames.forEach(function (eventName) {
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
	eventNames.forEach(function (eventName) {
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
		<div class="yunser-password-item">
			<div class="yunser-password-title">${item.title}</div>
		</div>
		`
		i++
	}
	if (list.length === 0) {
		listHtml = '没有记录'
	}
	divElem.innerHTML = `
	<div id="yunser-password-list" class="yunser-password-list" style="display: none;">
		${listHtml}
		<a class="yunser-password-manage" href="https://password.yunser.com/manage?host=${encodeURIComponent(location.host)}" target="_blank">管理密码</a>
	</div>
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
            document.querySelector('#yunser-password-list').style.display = 'none'
		}
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type === 'passwordList') {
		console.log('收到list2', request.data)
		showPasswordList(request.data)
		if (request.data.length) {
			document.querySelector('#yunser-password-box').classList.add('active')
		}
	}
	if (request.type === 'type_getSiteSuccess') {
		if (request.data) {
			console.log('有数据', request.data)
			document.querySelector('#yunser-site-box').classList.add('active')
		}
	}
	if (request.type === 'type_getUrlSuccess') {
		console.log('有数据0')
		if (request.data) {
			console.log('有数据2', request.data)
			window.urlCollection = true
			window.urlData = request.data
			document.querySelector('#yunser-url-box').classList.add('active')
		}
	}
	if (request.type === 'type_saveUrlSuccess') {
		console.log('收到来自后台的回复：', request)
		window.urlCollection = true
		window.urlData = request.data
		document.querySelector('#yunser-url-box').classList.add('active')
	}
})
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	
})

// 密码管理模块
function dealPassword() {
	let $root = document.createElement('div')
	$root.id = 'yunser-password-box'
	$root.className = 'yunser-page-actions-btn'
	$root.innerHTML = `
	密码
	`
	let body = document.body
	document.getElementById('yunser-page-actions').appendChild($root)

	$root.addEventListener('click', () => {
		let $list = document.querySelector('#yunser-password-list')

		// $list.style.display = 'none'
		if ($list.style.display === 'block') {
			$list.style.display = 'none'
		} else {
			$list.style.display = 'block'
		}
	})
}

function createPageAction(acton) {
	
}

function dealSite() {
	let $root = document.createElement('div')
	$root.innerHTML = `
	<div id="yunser-site-box" class="yunser-page-actions-btn" title="">
	站点
	</div>

	`
	document.getElementById('yunser-page-actions').appendChild($root)

	document.querySelector('#yunser-site-box').addEventListener('click', () => {
		window.open(`https://nav.yunser.com/sites/${location.host}`, '_blank')
	})
}

function dealUrl() {
	let $root = document.createElement('div')
	$root.innerHTML = `
	<div id="yunser-url-box" class="yunser-page-actions-btn" title="收藏">
		收藏
	</div>

	`
	document.getElementById('yunser-page-actions').appendChild($root)

	document.querySelector('#yunser-url-box').addEventListener('click', () => {
		if (window.urlCollection) {
			console.log('删除', window.urlData)
			chrome.runtime.sendMessage({
				type: 'type_removeUrl',
				data: {
					id: window.urlData.id
				}
			}, res => {
				window.urlCollection = false
				window.urlData = null
				document.querySelector('#yunser-url-box').classList.remove('active')
			// console.log('收到来自后台的回复：', res)
			// for (let item of res) {
			// 	setPageStyle(item.id, item.style)
			// }
			})
		} else {
			chrome.runtime.sendMessage({
				type: 'type_saveUrl',
				data: {
					url: location.href,
					title: document.title
				}
			}, res => {
				
			// for (let item of res) {
			// 	setPageStyle(item.id, item.style)
			// }
			})
		}
	})
}

function dealNote() {
	let $root = document.createElement('div')
	$root.innerHTML = `
	<div id="yunser-note-box" class="yunser-page-actions-btn">
		笔记
	</div>

	`
	document.getElementById('yunser-page-actions').appendChild($root)

	document.querySelector('#yunser-note-box').addEventListener('click', () => {
		// window.open(`https://nav.yunser.com/sites/${location.host}`, '_blank')
	})
	chrome.runtime.sendMessage({
		type: 'type_getNoteByHost',
		data: {
			host: location.host
		}
	}, res => {
		console.log('啦啦啦：', res)
		if (res.length) {
			document.querySelector('#yunser-note-box').classList.add('active')
		}
	})
}

function initInHtml() {
    console.log('初始化 HTML')
    chrome.runtime.sendMessage({
			type: 'getPassword',
			host: location.host
		}, res => {
		// console.log('收到来自后台的回复：', res)
		// for (let item of res) {
		// 	setPageStyle(item.id, item.style)
		// }
    })
    
	dealPassword()
	dealSite()
	dealUrl()
	dealNote()

	chrome.runtime.sendMessage({
		type: 'type_getSite',
		host: location.host
	}, res => {
		// console.log('收到来自后台的回复：', res)
		// for (let item of res) {
		// 	setPageStyle(item.id, item.style)
		// }
	})

	chrome.runtime.sendMessage({
		type: 'type_getUrl',
		url: location.href
	}, res => {
		// console.log('收到来自后台的回复：', res)
		// for (let item of res) {
		// 	setPageStyle(item.id, item.style)
		// }
	})
}

function init() {
		if (window._app.contentType.includes('text/html')) { // TODO file
			// if (location.hostname === 'localhost') {
			// 	return
			// }
			initInHtml()
    }
}

window._init = init

export default {}
