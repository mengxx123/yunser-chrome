/* eslint-disable */
console.log('search')

// TODO 重复
function setPageStyle(id, styleText) {
	let styleElem = document.createElement('style')
	styleElem.setAttribute('id', 'ysStyle-' + id)
	styleElem.setAttribute('class', 'yunser-style')
	styleElem.setAttribute('type', 'text/css')
	styleElem.appendChild(document.createTextNode(styleText))
	var head = document.getElementsByTagName("head")[0];

	head.appendChild(styleElem);
}

function parseQueryString(url) {
	var params = {};
	var arr = url.split("?");
	if (arr.length <= 1) {
		return params;
	}
	arr = arr[1].split("&");
	for (var i = 0, l = arr.length; i < l; i++) {
		var a = arr[i].split("=");
		params[a[0]] = a[1];
	}
	return params;
}

let commonSearchs = [
	{
		name: 'Bing',
		host: 'cn.bing.com',
		type: 'search',
		searchUrl: 'https://cn.bing.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '搜狗',
		host: 'www.sogou.com',
		type: 'search',
		searchUrl: 'https://www.sogou.com/web?query={keyword}',
		searchKey: 'query'
	},
	{
		name: '百度',
		host: 'www.baidu.com',
		type: 'search',
		searchUrl: 'https://www.baidu.com/s?wd={keyword}',
		searchKey: 'wd'
    },
    
    {
		name: '百度百科',
		host: 'baike.baidu.com',
		type: 'search',
        searchUrl: 'https://baike.baidu.com/item/{keyword}',
        regExp: /https:\/\/baike.baidu.com\/item\/([\d\D]+)/,
    },
    {
		name: '维基百科',
		host: 'zh.wikipedia.org',
		type: 'search',
        searchUrl: 'https://zh.wikipedia.org/wiki/{keyword}',
        regExp: /https:\/\/zh.wikipedia.org\/wiki\/([\d\D]+)/,
    },
    {
		name: '萌娘百科',
		host: 'zh.moegirl.org',
		type: 'search',
        searchUrl: 'https://zh.moegirl.org/{keyword}',
        regExp: /https:\/\/zh.moegirl.org\/([\d\D]+)/,
    },

	{
		name: 'Google',
		host: 'www.google.com',
		type: 'search',
		searchUrl: 'https://www.google.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '360 搜索',
		host: 'www.so.com',
		type: 'search',
		searchUrl: 'https://www.so.com/s?q={keyword}',
		searchKey: 'q'
	},

	{
		name: '百度图片',
		type: 'image',
		host: 'image.baidu.com',
		searchUrl: 'http://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&word={keyword}',
		searchKey: 'word'
	},
	{
		name: '搜狗图片',
		type: 'image',
		host: 'pic.sogou.com',
		searchUrl: 'https://pic.sogou.com/pics?query={keyword}',
		searchKey: 'query'
	},

	{
		name: '百度地图',
		type: 'map',
		host: 'map.baidu.com',
		searchUrl: 'https://map.baidu.com/?newmap=1&ie=utf-8&s={keyword}',
		searchKey: 's'
	},
	{
		name: '知乎',
		host: 'www.zhihu.com',
		searchUrl: 'https://www.zhihu.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '简书',
		host: 'www.jianshu.com',
		searchUrl: 'https://www.jianshu.com/search?q={keyword}',
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
		type: 'shopping',
		host: 's.taobao.com',
		searchUrl: 'https://s.taobao.com/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '京东',
		type: 'shopping',
		host: 'search.jd.com',
		searchUrl: 'http://search.jd.com/Search?keyword={keyword}',
		searchKey: 'keyword'
	},
	{
		name: '天猫',
		type: 'shopping',
		host: 'list.tmall.com',
		searchUrl: 'https://list.tmall.com/search_product.htm?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '苏宁易购',
		type: 'shopping',
		host: 'search.suning.com',
        searchUrl: 'https://search.suning.com/{keyword}/',
        regExp: /https:\/\/search.suning.com\/([\d\D]+)\//,
	},
	{
		name: '亚马逊',
		type: 'shopping',
		host: 'search.suning.com',
		searchUrl: 'https://www.amazon.cn/s?field-keywords={keyword}/',
		searchKey: 'field-keywords'
	},
	{
		name: '当当',
		type: 'shopping',
		host: 'search.dangdang.com',
		searchUrl: 'http://search.dangdang.com/?key={keyword}/',
		searchKey: 'key'
	},

	{
		name: '网易云音乐',
		type: 'music',
		host: 'music.163.com',
		searchUrl: 'https://music.163.com/#/search/m/?s={keyword}',
		searchKey: 's'
	},
	{
		name: 'QQ 音乐',
		type: 'music',
		host: 'y.qq.com',
        searchUrl: 'https://y.qq.com/portal/search.html#w={keyword}',
        regExp: /https:\/\/y.qq.com\/portal\/search.html#w=([\d\D]+)/,
	},
	{
		name: '酷狗音乐',
		type: 'music',
		host: 'www.kugou.com',
        searchUrl: 'https://www.kugou.com/yy/html/search.html#searchKeyWord={keyword}',
        regExp: /searchKeyWord=([\d\D]+)/,
	},
	{
		name: '虾米音乐',
		type: 'music',
		host: 'www.xiami.com',
		searchUrl: 'https://www.xiami.com/search?key={keyword}',
		searchKey: 'key'
	},

	{
		name: '爱奇艺',
		type: 'video',
		host: 'www.kugou.com',
        searchUrl: 'https://so.iqiyi.com/so/q_{keyword}',
        regExp: /https:\/\/so.iqiyi.com\/so\/q_([\d\D]+)/,
		// searchKey: 'searchKeyWord' // TODO
	},
	{
		name: 'Bilibili',
		type: 'video',
		host: 'search.bilibili.com',
		searchUrl: 'https://search.bilibili.com/all?keyword={keyword}',
		searchKey: 'keyword'
	},
	{
		name: '优酷',
		type: 'video',
		host: 'so.youku.com',
		searchUrl: 'https://so.youku.com/search_video/q_{keyword}',
		searchKey: 'keyword' // TODO
	},

	{
		name: '腾讯动漫',
		type: 'comic',
		host: 'ac.qq.com',
		searchUrl: 'https://ac.qq.com/Comic/searchList/search/{keyword}',
		searchKey: 'keyword' // TODO
	},
	{
		name: '看漫画',
		type: 'comic',
		host: 'www.kanman.com',
		searchUrl: 'https://www.kanman.com/sort/#{keyword}',
		searchKey: 'keyword' // TODO
	},

	{
		name: '百度翻译',
		type: 'translate',
		host: 'www.iconfont.cn',
		searchUrl: 'https://fanyi.baidu.com/#auto/auto/{keyword}',
		searchKey: 'q' // TODO
	},
	{
		name: '谷歌翻译',
		type: 'translate',
		host: 'translate.google.cn',
		searchUrl: 'https://translate.google.cn/?hl=auto&tab=TT#view=home&op=translate&sl=auto&tl=auto&text={keyword}',
		searchKey: 'text'
	},
	{
		name: '云设',
		type: 'app',
		host: 'search.yunser.com',
		searchUrl: 'https://search.yunser.com/search?keyword={keyword}',
		searchKey: 'keyword'
	},
	{
		name: '好工具',
		type: 'app',
		host: 'www.nicetool.net',
		searchUrl: 'http://www.nicetool.net/m_search/{keyword}',
		searchKey: 'keyword' // TODO
	},
	{
		name: '博客园',
		type: 'tech',
		host: 'zzk.cnblogs.com',
		searchUrl: 'https://zzk.cnblogs.com/s/blogpost?w={keyword}',
		searchKey: 'w'
	},
	{
		name: 'CSDN',
		type: 'tech',
		host: 'so.csdn.net',
		searchUrl: 'https://so.csdn.net/so/search/s.do?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '掘金',
		type: 'tech',
		host: 'juejin.im',
		searchUrl: 'https://juejin.im/search?query={keyword}&type=all',
		searchKey: 'query'
	},

	{
		name: 'Iconfont',
		type: 'icon',
		host: 'www.iconfont.cn',
		searchUrl: 'https://www.iconfont.cn/search/index?searchType=icon&q={keyword}',
		searchKey: 'q'
	},
	{
		name: '优设',
		type: 'ui',
		host: 'so.uisdc.com',
		searchUrl: 'http://so.uisdc.com/cse/search?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '花瓣',
		type: 'image',
		host: 'huaban.com',
		searchUrl: 'http://huaban.com/search/?q={keyword}',
		searchKey: 'q'
	},
	{
		name: '站酷',
		type: 'ui',
		host: 'www.zcool.com.cn',
		searchUrl: 'https://www.zcool.com.cn/search/content?&word={keyword}',
		searchKey: 'word'
	},
	// {
	// 	name: '字体之家',
	// 	host: 'www.17ziti.com',
	// 	searchUrl: 'http://www.17ziti.com/plus/search.php?keyword={keyword}',
	// 	searchKey: 'keyword'
	// },
]

if (location.host === 'www.sogou.com') {


}

function searchAsd(item, keyword) {
    keyword = decodeURIComponent(keyword)

	let $root = document.createElement('div')
	$root.className = 'yunser-search-box'
	let html = ''
	let list = []
	let sortedSearch = commonSearchs.sort((a, b) => {
		function score(sortItem) {
			if (sortItem.type === item.type) {
				return 1
			}
			return 0
		}
		return score(b) - score(a)
	}) 
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

function updateSearchHelp() {
	for (let item of commonSearchs) {
		if (location.host === item.host) {
			let keyword = parseQueryString(location.href)
            if (item.regExp && location.href.match(item.regExp)) {
                let match = location.href.match(item.regExp)
                console.log('匹配================', match[1])
                searchAsd(item, match[1])
            } else if (keyword[item.searchKey]) {
                let keyword = parseQueryString(location.href)
                console.log('keyword', keyword)
				searchAsd(item, keyword[item.searchKey])
			}
            
			break
		}
	}
}

updateSearchHelp()

window.addEventListener('hashchange',function() {
	// self.urlChange()
	// alert(1)
	updateSearchHelp()
})

export default {}
