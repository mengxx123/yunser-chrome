<template>
    <div class="page" @click="handlerPageClick">
        <div class="page-bg" asd="asd" :style="{'background-image': wallpaper}"></div>
        <div class="canvas-box">
            <canvas class="canvas" id="canvas" width="500" height="500" v-if="clockVisible"></canvas>
        </div>
        <div class="page-content">
            <div class="appbar">
                <ui-icon-button class="btn" icon="add" @click="toggleStore" />
                <ui-icon-button class="btn" icon="settings" @click="toggleSetting" />
                <ui-icon-button class="btn" icon="help" @click="help" />
            </div>
            <!-- <a href="chrome://extensions/">拓展程序猿</a> -->
            <div class="search-box" v-if="searchVisible">
                <div class="type">
                    <img class="img" :src="searchType.icon" @click.stop="toggleSearchType" ref="button">
                    <ui-menu class="type-menu" v-if="searchTypeVisible">
                        <ui-menu-item v-for="type, index in searchTypes"
                            :title="type.name"
                            @click="setSearchType(type)"
                            :key="index" />
                    </ui-menu>
                </div>
                <input class="input" id="search-input" v-model="keyword" @input="handlerChange" @keydown="handlerKeyDown($event)" placeholder="输入关键词搜索">
                <ui-icon-button class="icon" icon="search" @click="search" />
                <ui-list class="suggest-list" v-if="completeVisible">
                    <ui-list-item
                        :class="{active: index === completeIndex}"
                        :title="item" v-for="item, index in suggestions" @click="searchText(item)" :key="index"></ui-list-item>
                </ui-list>
            </div>
            <div class="container">
                <ul class="app-list" v-if="shortCutVisible">
                    <li class="item" v-for="app, index in apps" @click="viewItem(app)" :key="index"
                        @contextmenu="handlerContextMenu($event, app, index)">
                        <img class="icon" :src="app.icon" v-if="app.icon">
                        <div class="text-icon" v-else>{{ app.title.charAt(0) }}</div>
                        <div class="title">{{ app.title }}</div>
                        <div class="mask"></div>
                    </li>
                </ul>
            </div>
        </div>
        <ui-drawer class="setting-box" right :open="settingVisible" @close="toggleSetting()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" @click="toggleSetting" slot="left" />
            </ui-appbar>
            <div class="body">
                <!-- <ui-raised-button class="btn" primary label="设置壁纸" @click="toggleWallpaper" /> -->
                <!-- <ui-raised-button class="btn" primary label="清除数据" @click="clearStorage" /> -->
                <ui-sub-header class="sub-title">外观设置</ui-sub-header>
                <ui-list>
                    <ui-list-item disableRipple @click.capture="handleToggle($event, 'clockVisible')" title="显示时钟">
                        <ui-switch v-model="clockVisible" slot="right" />
                    </ui-list-item>
                    <ui-list-item disableRipple @click.capture="handleToggle($event, 'todoVisible')" title="显示待办">
                        <ui-switch v-model="todoVisible" slot="right" />
                    </ui-list-item>
                    <ui-list-item disableRipple @click.capture="handleToggle($event, 'searchVisible')" title="显示搜索框">
                        <ui-switch v-model="searchVisible" slot="right" />
                    </ui-list-item>
                    <ui-list-item disableRipple @click.capture="handleToggle($event, 'shortCutVisible')" title="显示快捷图标">
                        <ui-switch v-model="shortCutVisible" slot="right" />
                    </ui-list-item>
                    <ui-list-item disableRipple @click.capture="handleToggle($event, 'sayingVisible')" title="一言">
                        <ui-switch v-model="sayingVisible" slot="right" />
                    </ui-list-item>
                </ui-list>
                <div class="form-item" v-if="sayingVisible">
                    <!-- <ui-sub-header class="sub-title">一言</ui-sub-header> -->
                    <ui-text-field v-model="sayingText" label="显示的文字"></ui-text-field>
                </div>
                <ui-sub-header class="sub-title">其他</ui-sub-header>
                <ui-list>
                    <ui-list-item disableRipple @click="bookmark" title="书签管理">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple @click="more" title="更多设置">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>

                    <!-- <a href="#" class="login" @click.prevent="login" >登录</a> -->


                    <ui-list-item disableRipple @click="login" title="登录" v-if="!isLogin">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple @click="toggleWallpaper" title="设置壁纸">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple href="https://extension.yunser.com/" target="_blank" title="官网">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple href="https://project.yunser.com/products/ed7006403cc011e9ae11c3584647d0bc" target="_blank" title="帮助">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple @click="clearStorage" title="清除数据">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                    <ui-list-item disableRipple title="v1.0.5">
                        <!-- <ui-switch v-model="todoVisible" slot="right" /> -->
                    </ui-list-item>
                </ui-list>
            </div>
        </ui-drawer>
        
        <ui-drawer class="store-box" right :open="storeVisible" @close="toggleStore()">
            <ui-appbar title="应用商店">
                <ui-icon-button icon="close" @click="toggleStore" slot="left" />
                <ui-icon-button icon="add" @click="add" slot="right" tooltip="自定义添加" />
            </ui-appbar>
            <div class="body">
                <ul class="type-list">
                    <li class="item" v-for="group, index in groups"
                    :key="index"
                        :class="{active: index === selectedGroupIndex}"
                        @click="selectGroup(group, index)">
                        {{ group.name }}
                    </li>
                </ul>
                <div class="list-box">
                    <ul class="store-app-list">
                        <li class="item" v-for="app, index in stores" @click="viewStoreItem(app)" :key="index">
                            <img class="icon" :src="app.icon">
                            <div class="title">{{ app.title }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </ui-drawer>

        <ui-drawer class="edit-box" right :open="wallpaperVisible" @close="toggleWallpaper()">
            <ui-appbar title="壁纸">
                <ui-icon-button icon="close" @click="toggleWallpaper" slot="left" />
                <ui-icon-button icon="check" @click="setWallpaper" slot="right" />
            </ui-appbar>
            <div class="body">
                <ui-text-field v-model="wallpaperUrl" label="壁纸链接"></ui-text-field>
            </div>

            <ul class="wallpaper-list">
                <li class="item" v-for="item in wallpapers" @click="setWallpaperItem(item)" :key="index">
                    <img class="img" :src="item" />
                </li>
            </ul>
        </ui-drawer>

        <ui-drawer class="edit-box" right :open="editVisible" @close="toggleEdit()">
            <ui-appbar title="编辑">
                <ui-icon-button icon="close" @click="toggleEdit" slot="left" />
                <ui-icon-button icon="check" @click="finish" slot="right" />
            </ui-appbar>
            <div class="body">
                <ui-text-field v-model="form.title" label="标题"></ui-text-field>
                <br>
                <ui-text-field v-model="form.url" label="链接"></ui-text-field>
                <br>
                <ui-text-field v-model="form.icon" label="图标链接"></ui-text-field>
            </div>
        </ui-drawer>

        <!-- <ui-float-button class="btn-add" icon="add" @click="add" /> -->
        <!-- <ui-float-button class="btn-add" icon="add" @click="toggleStore" /> -->
        
        <ui-menu class="item-menu" :style="{top: menuTop + 'px', left: menuLeft + 'px'}" v-if="menuVisible">
            <ui-menu-item title="打开" @click="openItem"/>
            <ui-menu-item title="编辑" @click="editItem"/>
            <ui-menu-item title="删除" @click="removeItem"/>
            <ui-menu-item title="快速链接" @click.stop="nothing" rightIcon="keyboard_arrow_right" v-if="selectedItem.quickUrls" >
                <ui-menu-item :title="item.title" @click="openUrl(item.url)" v-for="item, index of selectedItem.quickUrls" :key="index" />
            </ui-menu-item>
            <ui-menu-item title="添加到搜索" @click="addToSearch" v-if="selectedItem.searchUrl"/>
            <ui-menu-item :title="selectedItem.key ? `快捷键（${selectedItem.key}）` : '设置快捷键'" @click="addToSearch" v-if="selectedItem.searchUrl"/>
        </ui-menu>
        <div class="desktop-tab">
            <div class="item active"></div>
            <div class="item"></div>
        </div>
        <todo v-if="todoVisible" />
        <saying v-if="sayingVisible" :text="sayingText" />
        <widget />
    </div>
</template>

<script>
    /* eslint-disable */
    import storage from '../util/storage.js'
    import todo from './todo.vue'
    import saying from './saying.vue'
    import widget from './widget.vue'

    function simpleUuid(len = 36, radix = 16) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        
        if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;
            
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            
            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        
        return uuid.join('');
    }

    export default {
        components: {
            todo,
            saying,
            widget
        },
        data() {
            return {
                // 搜索
                searchType: {
                    name: '百度',
                    icon: 'https://img1.yunser.com/icon/baidu.png',
                    url: 'https://www.baidu.com/s?wd={keyword}'
                },
                searchTypes: [
                    {
                        name: '百度',
                        icon: 'https://img1.yunser.com/icon/baidu.png',
                        url: 'https://www.baidu.com/s?wd={keyword}'
                    },
                    {
                        name: '谷歌',
                        icon: 'https://img1.yunser.com/icon/google.png',
                        url: 'https://www.google.com/search?q={keyword}'
                    },
                    {
                        name: '云设',
                        icon: 'https://img1.yunser.com/icon/build.svg',
                        url: 'https://search.yunser.com/search?keyword={keyword}'
                    },
                    {
                        name: '知乎',
                        icon: 'https://img1.yunser.com/icon/zhihu.png',
                        url: 'https://www.zhihu.com/search?q={keyword}&type=content'
                    },
                    {
                        name: '搜狗',
                        icon: 'https://img1.yunser.com/icon/build.svg',
                        url: 'https://www.sogou.com/web?query={keyword}'
                    },
                ],
                searchTypeVisible: false,
                //
                form: {
                    title: '',
                    url: '',
                    icon: ''
                },
                keyword: '',
                //
                settingVisible: false,
                editVisible: false,
                //
                selectedIndex: -1,
                selectedItem: {},
                menuVisible: false,
                storeVisible: false,
                selectedGroupIndex: 0,
                menuLeft: 10,
                menuTop: 10,
                searchVisible: true,
                shortCutVisible: true,
                clockVisible: false,
                todoVisible: false,
                sayingVisible: false,
                sayingText: '测试文本',
                apps: [
                    {
                        type: 'action',
                        title: '设置',
                        icon: 'https://img1.yunser.com/icon/settings.png',
                        url: 'settings'
                    },
                    {
                        title: '知乎',
                        icon: 'https://img1.yunser.com/icon/zhihu.png',
                        url: 'https://www.zhihu.com/',
                        searchUrl: 'https://www.zhihu.com/search?q={keyword}&type=content'
                    },
                    {
                        title: 'Bilibili',
                        icon: 'https://img1.yunser.com/icon/bilibili.png',
                        url: 'https://www.bilibili.com/',
                        quickUrls: [
                            {
                                title: '直播',
                                url: 'https://live.bilibili.com/'
                            },
                            {
                                title: '音乐',
                                url: 'https://www.bilibili.com/audio/home/?type=10'
                            }
                        ],
                        searchUrl: 'https://search.bilibili.com/all?keyword={keyword}'
                    },
                    {
                        title: '百度',
                        icon: 'https://img1.yunser.com/icon/baidu.png',
                        url: 'https://www.baidu.com/',
                        searchUrl: 'https://www.baidu.com/s?wd={keyword}',
                        key: 'B'
                    },
                    {
                        title: '豆瓣',
                        icon: 'https://img1.yunser.com/icon/douban.png',
                        url: 'https://www.douban.com/'
                    },
                    {
                        title: '百度翻译',
                        icon: 'https://img1.yunser.com/icon/baidu_translate.png',
                        url: 'https://fanyi.baidu.com/',
                        key: 'F'
                    },
                    {
                        title: '淘宝',
                        icon: 'https://img1.yunser.com/icon/taobao.png',
                        url: 'https://www.taobao.com/',
                        searchUrl: 'https://s.taobao.com/search?q={keyword}'
                    },
                    {
                        title: '爱奇艺',
                        icon: 'https://img1.yunser.com/icon/iqiyi.png',
                        url: 'https://www.iqiyi.com/'
                    },
                    {
                        title: 'QQ 音乐',
                        icon: 'https://img1.yunser.com/icon/qq_music.png',
                        url: 'https://y.qq.com/'
                    },
                    {
                        title: '云设应用',
                        icon: 'https://img1.yunser.com/icon/build.svg',
                        url: 'https://app.yunser.com/',
                        searchUrl: 'https://search.yunser.com/search?keyword={keyword}',
                        key: 'Y'
                    },
                    {
                        title: '好工具',
                        icon: 'https://img1.yunser.com/nicetool/logo.png',
                        url: 'http://www.nicetool.net/',
                        key: 'Y'
                    },
                    // {
                    //     title: '拓展程序',
                    //     icon: 'https://img1.yunser.com/icon/build.svg',
                    //     url: 'chrome://extensions/'
                    // },
                    {
                        title: '更多',
                        icon: 'https://img1.yunser.com/icon/more.png',
                        url: 'https://app.yunser.com/'
                    },
                ],
                groups: [
                    {
                        name: '推荐',
                        stores: [
                            {
                                title: '谷歌',
                                icon: 'https://img1.yunser.com/icon/google.png',
                                url: 'https://www.google.com.hk/'
                            },
                        ]
                    },
                    {
                        name: '应用',
                        stores: [
                            {
                                type: 'action',
                                title: '设置',
                                icon: 'https://img1.yunser.com/icon/settings.png',
                                url: 'settings'
                            },
                            // {
                            //     title: '百度脑图',
                            //     icon: '/static/img/baidu-naotu.webp',
                            //     url: 'http://naotu.baidu.com/'
                            // }
                            // {
                            //     title: '天气',
                            //     icon: '/static/img/wether.webp'
                            // },
                            // {
                            //     title: '天气',
                            //     icon: '/static/img/wether.webp'
                            // }
                        ]
                    },
                    {
                        name: '效率工具',
                        stores: [
                            {
                                title: '印象笔记',
                                icon: 'https://img1.yunser.com/icon/evernote.png',
                                url: 'https://www.yinxiang.com/'
                            },
                            {
                                title: '百度翻译',
                                icon: 'https://img1.yunser.com/icon/baidu_translate.png',
                                url: 'https://fanyi.baidu.com/'
                            },
                        ]
                    },
                    {
                        name: '购物',
                        stores: [
                            {
                                title: '天猫',
                                icon: 'https://img1.yunser.com/icon/tmall.png',
                                url: 'https://www.tmall.com/'
                            },
                            {
                                title: '淘宝',
                                icon: 'https://img1.yunser.com/icon/taobao.png',
                                url: 'https://www.taobao.com/'
                            },
                            {
                                title: '京东',
                                icon: 'https://img1.yunser.com/icon/jd.png',
                                url: 'https://www.jd.com/'
                            },
                            {
                                title: '小米官网',
                                icon: 'https://img1.yunser.com/icon/xiaomi.png',
                                url: 'https://www.mi.com/'
                            },
                            {
                                title: '闲鱼',
                                icon: 'https://img1.yunser.com/icon/xianyu.png',
                                url: 'https://2.taobao.com/'
                            }
                        ]
                    },
                    {
                        name: '新闻资讯',
                        stores: [
                            {
                                title: '知乎',
                                icon: 'https://img1.yunser.com/icon/zhihu.png',
                                url: 'https://www.zhihu.com/'
                            },
                            {
                                title: '好奇心日报',
                                icon: 'https://img1.yunser.com/icon/qdaily.png',
                                url: 'http://www.qdaily.com/'
                            },
                            {
                                title: '豆瓣',
                                icon: 'https://img1.yunser.com/icon/douban.png',
                                url: 'https://www.douban.com/'
                            },
                            {
                                title: '果壳',
                                icon: 'https://img1.yunser.com/icon/guokr.png',
                                url: 'https://www.guokr.com/'
                            },
                            {
                                title: '爱范儿',
                                icon: 'https://img1.yunser.com/icon/ifanr.png',
                                url: 'https://www.ifanr.com/'
                            },
                            {
                                title: '简书',
                                icon: 'https://img1.yunser.com/icon/jianshu.png',
                                url: 'https://www.jianshu.com/'
                            },
                            {
                                title: '新浪微博',
                                icon: 'https://img1.yunser.com/icon/weibo.png',
                                url: 'https://weibo.com/'
                            },
                            {
                                title: '今日头条',
                                icon: 'https://img1.yunser.com/icon/toutiao.png',
                                url: 'https://www.toutiao.com/'
                            }
                        ]
                    },
                    {
                        name: '音乐视频',
                        stores: [
                            {
                                title: 'Bilibili',
                                icon: 'https://img1.yunser.com/icon/bilibili.png',
                                url: 'https://www.bilibili.com/'
                            },
                            {
                                title: '优酷',
                                icon: 'https://img1.yunser.com/icon/youku.png',
                                url: 'https://www.youku.com/'
                            },
                            {
                                title: '爱奇艺',
                                icon: 'https://img1.yunser.com/icon/iqiyi.png',
                                url: 'https://www.iqiyi.com/'
                            },
                            {
                                title: 'QQ 音乐',
                                icon: 'https://img1.yunser.com/icon/qq_music.png',
                                url: 'https://y.qq.com/'
                            },
                            {
                                title: '酷狗',
                                icon: 'https://img1.yunser.com/icon/kugou.png',
                                url: 'http://www.kugou.com/'
                            },
                            {
                                title: '虾米音乐',
                                icon: 'https://img1.yunser.com/icon/xiami_music.png',
                                url: 'https://www.xiami.com/'
                            },
                            {
                                title: '网易云音乐',
                                icon: 'https://img1.yunser.com/icon/netease_music.png',
                                url: 'https://music.163.com/'
                            }
                        ]
                    },
                    {
                        name: '其他',
                        stores: [
                            {
                                title: '高德地图',
                                icon: 'https://img1.yunser.com/icon/amap.png',
                                url: 'https://www.amap.com/'
                            },
                            {
                                title: '微信网页版',
                                icon: 'https://img1.yunser.com/icon/wechat.png',
                                url: 'https://wx.qq.com/'
                            },
                            {
                                title: '百度',
                                icon: 'https://img1.yunser.com/icon/baidu.png',
                                url: 'https://www.baidu.com/'
                            },
                            {
                                title: '百度贴吧',
                                icon: 'https://img1.yunser.com/icon/baidu_tieba.png',
                                url: 'https://tieba.baidu.com/'
                            },
                            {
                                title: '百度网盘',
                                icon: 'https://img1.yunser.com/icon/baidu_pan.png',
                                url: 'https://pan.baidu.com'
                            },
                            {
                                title: '站酷',
                                icon: 'https://img1.yunser.com/icon/zcool.png',
                                url: 'https://www.zcool.com.cn/'
                            }
                        ]
                    }
                ],
                stores: [],
                completeVisible: false,
                completeIndex: -1,
                // wallpaper
                wallpaperVisible: false,
                wallpaperUrl: '',
                wallpaper: ``,
                wallpapers: [
                    'https://img1.yunser.com/wallpaper/189.jpg',
                    'https://img1.yunser.com/wallpaper/600.jpg',
                    'https://img1.yunser.com/wallpaper/928.jpg',
                    'https://img1.yunser.com/wallpaper/807.jpg'
                ],
                suggestions: [
                    '1',
                    '2'
                ],
                //
                hour: null,
                minute: null,
                month: null,
                date: null,
                week: null,

                isLogin: false,
                
            }
        },
        computed: {},
        created () {},
        mounted () {
            let uuid = simpleUuid()
            console.log('uuid', uuid)

            if (this.$storage.get('accessToken')) {
                this.isLogin = true
            }
            // console.log('tab')
            // this.$storage.set('asd', '456')
            // this.$cookie.set('asd', '456')
            // this.$http.get(`/password/users/1/accounts?url=${encodeURIComponent('exmail.qq.com')}`).then(
            //     response => {
            //         let data = response.data
            //         console.log('数据')
            //         console.log(data)
                    
            //     },
            //     response => {
            //         console.log('cuol')
            //         if (response.code === 403) {
            //             this.$store.state.user = null
            //         }
            //         this.loading = false
            //     })
            // 搜索
            this.trigger = this.$refs.button.$el
            this.searchType = storage.get('searchType', this.searchType)
            this.searchTypes = storage.get('searchTypes', this.searchTypes)
            //
            document.title = '新标签页'
            this.clockVisible = storage.get('clockVisible', false)
            this.todoVisible = storage.get('todoVisible', false)
            this.shortCutVisible = storage.get('shortCutVisible', true)
            this.searchVisible = storage.get('searchVisible', true)
            this.sayingVisible = storage.get('sayingVisible', false)
            this.sayingText = storage.get('sayingText', false)
            this.apps = storage.get('apps', this.apps)
            this.wallpaperUrl = storage.get('wallpaper', this.wallpapers[0])
            this.wallpaper = `url('${this.wallpaperUrl}')`
            this.stores = this.groups[0].stores
            window.addEventListener('keydown', this._keydown = e => {
                return this.handlerPageKeyDown(e)
            })
            this.timer = setInterval(() => {
                this.drawClock()
            }, 1000)
            //
            setTimeout(() => {
                console.log('focus')
                document.getElementById('search-input').focus()
            }, 3000)
        },
        destroyed() {
            window.removeEventListener('keydown', this._keydown)
            clearInterval(this.timer)
        },
        methods: {
            addToSearch() {
                this.searchType = {
                    name: this.selectedItem.title,
                    icon: this.selectedItem.icon,
                    url: this.selectedItem.searchUrl
                }
                this.searchTypes.push(this.searchType)
                storage.set('searchType', this.searchType)
                storage.set('searchTypes', this.searchTypes)
            },
            openUrl(url) {
                location.href = url
                // window.open(url)
            },
            nothing() {},
            setSearchType(type) {
                this.searchType = type
                storage.set('searchType', this.searchType)
            },
            toggleSearchType () {
                console.log('toggleSearchType')
                this.searchTypeVisible = !this.searchTypeVisible
            },
            help() {
                window.open('./help.html')
            },
            more() {
                window.open('./options.html')
            },
            bookmark() {
                window.open('./bookmark.html')
            },
            handleToggle(e, key) {
                e.stopPropagation()
                e.preventDefault()
                console.log('设置了')
            },
            drawClock() {
                let WIDTH = 300
                let HEIGHT = 300
                let SIZE = 240
                let canvas = document.getElementById('canvas')
                if (!canvas) {
                    return
                }
                let ctx = canvas.getContext('2d')
                let center = {
                    x: WIDTH / 2,
                    y: HEIGHT / 2
                }
                canvas.width = WIDTH
                canvas.height = HEIGHT
                ctx.width = WIDTH
                ctx.height = HEIGHT
                ctx.fillStyle = '#fff'
                ctx.strokeStyle = '#fff'
                ctx.lineWidth = 2
                ctx.arc(center.x, center.y, SIZE / 2, 0, Math.PI * 2)
                // ctx.fill()
                // ctx.stroke()


                ctx.beginPath()
                ctx.arc(center.x, center.y, 8, 0, Math.PI * 2)
                ctx.fill()
                // var h = parseInt(da1.getHours());
                // var m = parseInt(da1.getMinutes());
                // var s = parseInt(da1.getSeconds());

                ctx.font = '36px Arial';
                ctx.fillStyle = '#f00';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (var n = 1; n <= 12; n++) {
                    var theta = (n - 3) * (Math.PI * 2) / 12;
                    var x = SIZE / 2 * Math.cos(theta);
                    var y = SIZE / 2 * Math.sin(theta);
                    let length = (n % 3 === 0) ? 32 : 16
                    let x2 = (SIZE / 2 - length) * Math.cos(theta)
                    let y2 = (SIZE / 2 - length) * Math.sin(theta);
                    ctx.beginPath()
                    ctx.moveTo(center.x + x, center.y + y)
                    ctx.lineTo(center.x + x2, center.y + y2)
                    ctx.stroke()
                    // ctx.fillText(n, center.x + x2, center.y + y2);
                }

                let date = new Date()
                let hour = date.getHours()
                let minute = date.getMinutes()
                let second = date.getSeconds()

                // 分针
                var theta = (minute * 60 + second - 15 * 60) / 3600 * (Math.PI * 2)
                var x = SIZE / 2 * 0.7 * Math.cos(theta)
                var y = SIZE / 2 * 0.7 * Math.sin(theta)
                ctx.beginPath()
                ctx.moveTo(center.x, center.y)
                ctx.lineTo(center.x + x, center.y + y)
                ctx.lineWidth = 2
                ctx.stroke()

                // 时针
                theta = (hour + minute / 60 * 1 - 3) / 12 * (Math.PI * 2)
                x = SIZE / 2 * 0.4 * Math.cos(theta)
                y = SIZE / 2 * 0.4 * Math.sin(theta)
                ctx.beginPath()
                ctx.moveTo(center.x, center.y)
                ctx.lineTo(center.x + x, center.y + y)
                ctx.lineWidth = 4
                ctx.stroke()

                // 秒针
                theta = (second - 15) / 60 * (Math.PI * 2)
                x = SIZE / 2 * 0.8 * Math.cos(theta)
                y = SIZE / 2 * 0.8 * Math.sin(theta)
                ctx.beginPath()
                ctx.moveTo(center.x, center.y)
                ctx.lineTo(center.x + x, center.y + y)
                ctx.lineWidth = 1
                ctx.stroke()





                ctx.lineWidth = 1;
                ctx.font = "18px";
            },
            setWallpaperItem(url) {
                this.wallpaperUrl = url
                this.wallpaper = `url('${this.wallpaperUrl}')`
                storage.set('wallpaper', this.wallpaperUrl)
            },
            setWallpaper() {
                this.wallpaper = `url('${this.wallpaperUrl}')`
                storage.set('wallpaper', this.wallpaperUrl)
                this.wallpaperVisible = false
            },
            toggleWallpaper() {
                this.wallpaperVisible = !this.wallpaperVisible
            },
            selectGroup(group, index) {
                this.stores = this.groups[index].stores
                this.selectedGroupIndex = index
            },
            openItem() {
                window.open(this.apps[this.selectedIndex].url)
            },
            editItem() {
                this.form = {
                    ...this.apps[this.selectedIndex]
                }
                this.editVisible = true
                this.isAdd = false
            },
            removeItem() {
                this.apps.splice(this.selectedIndex, 1)
                storage.set('apps', this.apps)
            },
            handlerPageClick() {
                this.menuVisible = false
                this.completeVisible = false
                this.searchTypeVisible = false
            },
            handlerContextMenu(e, item, index) {
                this.selectedItem = item
                this.selectedIndex = index
                console.log(e)
                this.menuVisible = true
                this.menuLeft = e.pageX
                this.menuTop = e.pageY
                e.preventDefault()
                return true
            },
            finish() {
                if (!this.form.title) {
                    this.$message({
                        type: 'danger',
                        text: '请输入标题'
                    })
                    return
                }
                if (!this.form.url) {
                    this.$message({
                        type: 'danger',
                        text: '请输入链接'
                    })
                    return
                }
                console.log('添加', {
                    title: this.form.title,
                    url: this.form.url
                })
                if (this.isAdd) {
                    this.apps.push({
                        title: this.form.title,
                        url: this.form.url,
                        icon: this.form.icon
                    })
                } else {
                    this.apps.splice(this.selectedIndex, 1, {
                        title: this.form.title,
                        url: this.form.url,
                        icon: this.form.icon
                    })
                }
                storage.set('apps', this.apps)
                this.editVisible = false
            },
            viewStoreItem(item) {
                // this.apps.push({
                //     title: item.title,
                //     url: item.url,
                //     icon: item.icon
                // })
                this.apps.push(item)
                storage.set('apps', this.apps)
            },
            toggleSetting() {
                this.settingVisible = !this.settingVisible
            },
            toggleStore() {
                this.storeVisible = !this.storeVisible
            },
            add() {
                this.isAdd = true
                this.editVisible = true
                this.form.title = ''
                this.form.url = ''
                this.form.icon = ''
            },
            toggleEdit() {
                this.editVisible = !this.editVisible
            },
            viewItem(item) {
                console.log('item', item)
                if (item.type === 'action') {
                    console.log('1')
                    if (item.url === 'settings') {
                        this.toggleSetting()
                    } else {
                        this.$message({
                            text: '暂不支持'
                        })
                    }
                } else {
                    window.open(item.url, '_blank')
                }
            },
            handlerChange() {
                console.log(this.keyword)
                if (!this.keyword) {
                    this.completeVisible = false
                    return
                }
                var xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        console.log('xhr.responseText', xhr.responseText)
                        let asd = xhr.responseText.match(/(\[[\w\W]+\])/)[1]
                        let json = JSON.parse(asd)
                        this.suggestions = JSON.parse(asd)
                        this.completeVisible = true
                        this.completeIndex = -1
                    }
                }
                let url = `http://suggestion.baidu.com/su?wd=${this.keyword}&p=3&t=1539015006310&cb=`
                xhr.open('GET', url, true)
                xhr.send()
            },
            search() {
                this.searchText(this.keyword)
                // let url = 'https://www.baidu.com/s?wd=' + this.keyword
                // location.href = url
                // window.open()
                // this.$message({
                //     text: '暂不支持'
                // })
            },
            searchText(text) {
                let url = this.searchType.url.replace('{keyword}', text)
                location.href = url
            },
            handlerKeyDown(e) {
                console.log(e.keyCode)
                if (e.keyCode === 13 && this.keyword) {
                    this.search()
                }
            },
            handlerPageKeyDown(e) {
                // e.preventDefault()
                console.log(e.keyCode)
                switch (e.keyCode) {
                    case 13:
                        if (this.completeIndex > 0) {
                            this.searchText(this.suggestions[this.completeIndex])
                        } else {
                            if (e.keyCode === 13 && this.keyword) {
                                this.search()
                            }
                        }
                        return false
                    case 38:
                        if (this.completeIndex > 0) {
                            this.completeIndex--
                        }
                        this.keyword = this.suggestions[this.completeIndex]
                        console.log('this.suggestions', this.suggestions[this.completeIndex])
                        return false
                    case 40:
                        if (this.completeIndex < this.suggestions.length - 1) {
                            this.completeIndex++
                        }
                        this.keyword = this.suggestions[this.completeIndex]
                        return false
                    case 32:
                        document.getElementById('search-input').focus()
                        return false
                    // case 86:
                        // alert(1)
                        // return
                }
            },
            clearStorage() {
                let ret = confirm('清除数据？')
                if (ret) {
                    localStorage.clear()
                }
            },
            login() {
                window.open('./help.html')
            }
        },
        watch: {
            clockVisible(value) {
                storage.set('clockVisible', value)
            },
            searchVisible(value) {
                storage.set('searchVisible', value)
            },
            shortCutVisible(value) {
                storage.set('shortCutVisible', value)
            },
            todoVisible(value) {
                storage.set('todoVisible', value)
            },
            sayingVisible(value) {
                storage.set('sayingVisible', value)
            },
            sayingText(value) {
                storage.set('sayingText', value)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login {
        position: fixed;
        top: 16px;
        left: 16px;
    }
    // * {
    //     margin: 0;
    //     padding: 0;
    //     box-sizing: border-box;
    //     font-size: 14px;
    //     color: #333;
    // }
    .container {
        // max-width: 1000px;
        color: #fff;
    }
    .page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .page-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
    }
    .canvas-box {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // background-color: #000;
    }
    .page-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
    .appbar {
        height: 56px;
        display: flex;
        padding: 4px;
        justify-content: flex-end;
        color: #fff;
        &:hover {
            .btn {
                display: block;
                color: #fff;
            }
        }
        .btn {
            display: none;
        }
    }
    .search-box {
        position: relative;
        display: flex;
        max-width: 400px;
        height: 48px;
        margin: 40px auto 16px auto;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
        background-color: #fff;
        .input {
            height: 48px;
            // padding-left: 16px;
            flex-grow: 1;
            border: none;
            outline: none;
        }
        .type {
            position: relative;
            width: 48px;
        }
        .img {
            width: 32px;
            height: 32px;
            margin: 8px;
            cursor: pointer;
        }
        .type-menu {
            position: absolute;
            left: 0;
            top: 50px;
            background-color: #fff;
        }
    }
    .suggest-list {
        position: absolute;
        top: 50px;
        left: 0;
        z-index: 10000;
        background-color: #fff;
        max-height: 400px;
        overflow: auto;
        .active {
            background-color: #f1f1f1;
        }
    }
    .app-list {
        display: flex;
        width: 800px;
        // border: 1px solid #f00;
        padding: 80px;
        margin: 0 auto;
        flex-wrap: wrap;
        user-select: none;
        .item {
            position: relative;
            cursor: pointer;
            width: 20%;
            // flex-shrink: 0;
            margin-bottom: 16px;
            &:hover {
                opacity: .9;
            }
        }
        .icon {
            display: block;
            width: 80px;
            height: 80px;
            margin: 0 auto 4px auto;
        }
        .text-icon {
            width: 64px;
            height: 64px;
            margin: 8px auto 12px auto;
            background-color: #333;
            border-radius: 8px;
            line-height: 64px;
            text-align: center;
            font-size: 32px;
        }
        .title {
            text-align: center;
            text-shadow: 2px 2px 2px #000;
        }
        .mask {
            // position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            // background-color: #fff;
        }
    }
    .list-box {
        height: 100%;
        padding: 16px;
        overflow: auto;
        flex-grow: 1;
    }
    .store-app-list {
        display: flex;
        // padding: 80px;
        flex-wrap: wrap;
        .item {
            position: relative;
            cursor: pointer;
            width: 25%;
            // height: 120px;
            // flex-shrink: 0;
            margin-bottom: 16px;
            &:hover {
                opacity: .7;
            }
        }
        .icon {
            display: block;
            width: 80px;
            height: 80px;
            margin: 0 auto 4px auto;
        }
        .text-icon {
            width: 64px;
            height: 64px;
            margin: 8px auto 12px auto;
            background-color: #333;
            border-radius: 8px;
            line-height: 64px;
            text-align: center;
            font-size: 32px;
        }
        .title {
            text-align: center;
        }
        .mask {
            // position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            // background-color: #fff;
        }
    }
    .btn-add {
        position: fixed;
        bottom: 24px;
        right: 24px;
    }
    .edit-box {
        width: 100%;
        max-width: 400px;
        .body {
            padding: 16px;
        }
    }
    .setting-box {
        width: 100%;
        max-width: 400px;
        .body {
            }
        .sub-title {
            padding-top: 16px;
            line-height: 1;
        }
    }
    .store-box {
        width: 100%;
        max-width: 500px;
        .body {
            display: flex;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            // padding: 16px;
            overflow: auto;
        }
        .type-list {
            flex-shrink: 0;
            width: 100px;
            height: 100%;
            border-right: 1px solid rgba(0, 0, 0, .12);
            .item {
                line-height: 48px;
                text-align: center;
                border-bottom: 1px solid rgba(0, 0, 0, .12);
                cursor: pointer;
                &.active {
                    color: #4285f4;
                }
            }
        }
    }
    .item-menu {
        position: fixed;
        top: 10px;
        left: 10px;
        width: 120px;
        z-index: 1000;
        background-color: #fff;
    }
    .wallpaper-list {
        padding: 0 16px;
        .item {
            margin-bottom: 16px;
            cursor: pointer;
        }
        .img {
            width: 100%;
        }
    }
    .canvas {
        width: 300px;
        height: 300px;
        // border: 1px solid rgba(0, 0, 0, .12);
    }
    // .desktop-tab {
    //     position: fixed;
    //     left: 24px;
    //     bottom: 24px;
    //     display: flex;
    //     .item {
    //         height: 8px;
    //         width: 24px;
    //         border-right: 1px solid #f00;
    //         background-color: rgba(255, 255, 255, .6);
    //         &.active {
    //             background-color: #fff;
    //         }
    //     }
    // }
    .form-item {
        padding: 0 16px;
    }
</style>