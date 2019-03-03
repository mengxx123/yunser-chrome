<template>
    <div class="box" style="height: 300px">
        <div class="mode-box" v-if="mode === 'add'">
            <ui-appbar title="添加">
                <ui-icon-button icon="close" slot="left" @click="mode = ''"></ui-icon-button>
                <ui-icon-button icon="check" slot="right" @click="finish"></ui-icon-button>
            </ui-appbar>
            <div class="body">
                <ui-text-field v-model="form.title" label="标题"></ui-text-field>
                <br>
                <ui-text-field v-model="form.url" label="链接"></ui-text-field>
                <br>
                <ui-text-field v-model="form.icon" label="图标链接"></ui-text-field>
            </div>
        </div>
        <div class="mode-box" v-if="mode === 'bgColor'">
            <ui-appbar title="设置背景色">
                <ui-icon-button icon="close" slot="left" @click="mode = ''"></ui-icon-button>
                <ui-icon-button icon="check" slot="right" @click="changeColor"></ui-icon-button>
            </ui-appbar>
            <div class="body">
                <form id="form">
                    <!-- 背景色: 
                    <input name="color" type="text"/> -->
                    <ui-text-field v-model="color" label="背景色" />
                    <div class="btns">
                        <!-- <ui-raised-button class="btn" primary label="设置背景色" @click="changeColor($event)" /> -->
                        <!-- <ui-raised-button class="btn" label="还原" @click="changeColor($event)" /> -->
                    </div>
                    <!-- <input name="submit" type="button" value="设置" @click="changeColor" /> -->
                    <!-- <input name="default" type="button" value="default" @click="setDefault" /> -->
                </form>
                <div>或者</div>
                <ui-raised-button class="btn" primary label="设置成白色" @click="setBgColor('#fff')" />
                <ui-raised-button class="btn" secondary label="设置成黑色" @click="setBgColor('#000')" />

            </div>
        </div>
        <div class="mode-box full-width" v-if="mode === ''">
            <div class="body layout">
                <div class="layout-left">
                    <div class="section">
                        <!-- <div>{{ test }}</div> -->
                        <h2 class="section-title">工具箱</h2>
                        <!-- <div>
                            <a href="tools.html" target="_blank">工具箱</a>
                        </div> -->
                        <div class="btns">
                            <ui-raised-button class="btn" label="添加到标签页" @click="addApp()" />
                            <ui-raised-button class="btn" label="设置背景色" @click="mode = 'bgColor'" />
                        </div>

                        <div class="search-type">
                            <label for="search_name">选择搜索引擎：</label>
                            <select name="search_name" id="search_name">
                                <option value="0" selected>Baidu</option>
                                <option value="1">Bing</option>
                                <option value="2">Google</option>
                            </select>
                        </div>
                    </div>

                    <!-- <ui-divider /> -->
                    
                    <!-- <ui-divider /> -->
                    <div class="section">
                        <h2 class="section-title">二维码</h2>
                        <div class="qrcode-box" v-if="qrcodeSrc">
                            <img class="qrcode" :src="qrcodeSrc">
                            <div class="tip">打开手机扫一扫</div>
                        </div>
                    </div>
                </div>
                <div class="layout-right">
                    <div class="section">
                        <h2 class="section-title">样式</h2>
                        <div class="empty" v-if="!styles.length">该网站没有可用的样式</div>
                        <ul class="style-list">
                            <li class="item" v-for="item, index in styles" :key="index">
                                <div class="name">{{ item.name }}</div>
                                <ui-switch label="启用" v-model="item.enable" class="demo-switch" @input="val => useStyle(val, item)" />
                            </li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2 class="section-title">阅读模式</h2>
                        <ui-raised-button class="btn" label="打开" @click="readMode" />
                        <!-- <div class="empty" v-if="!styles.length">该网站没有可用的样式</div>
                        <ul class="style-list">
                            <li class="item" v-for="item, index in styles" :key="index">
                                <div class="name">{{ item.name }}</div>
                                <ui-switch label="启用" v-model="item.enable" class="demo-switch" @input="val => useStyle(val, item)" />
                            </li>
                        </ul> -->
                    </div>

                    <div class="section">
                        <h2 class="section-title">书签</h2>
                        <div class="empty" v-if="!bookmarks.length">该网站没有书签</div>
                        <ul class="bookmark-list">
                            <li class="item" v-for="item, index in bookmarks" :key="index" @click="openBookmark(item)">
                                <div class="name">{{ item.title }}</div>
                                <!-- <ui-switch label="启用" v-model="item.enable" class="demo-switch" @input="val => useStyle(val, item)" /> -->
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="layout-right">
                    <div class="section">
                        <h2 class="section-title">搜索</h2>
                        <div class="empty" v-if="!bookmarks.length">该网站没有书签</div>
                        <ul class="bookmark-list">
                            <li class="item" v-for="item, index in bookmarks" :key="index" @click="openBookmark(item)">
                                <div class="name">{{ item.title }}</div>
                                <!-- <ui-switch label="启用" v-model="item.enable" class="demo-switch" @input="val => useStyle(val, item)" /> -->
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import storage from '../util/storage.js'

    export default {
        data() {
            return {
                form: {
                    title: '',
                    url: '',
                    icon: ''
                },
                mode: '',
                color: '',
                test: '',
                qrcodeSrc: '',
                styles: [],
                bookmarks: [
                    {
                        dateAdded: 1547390521103,
                        id: "1207",
                        index: 23,
                        parentId: "1084",
                        title: "Javascript 修改url不刷新页面_百度搜索",
                        url: "https"
                    }
                ]
            }
        },
        computed: {
            },
        created () {},
        mounted () {
            this.test = location.href
            document.title = '超级拓展'
            document.body.style.height = '400px'

            chrome.storage.local.get("color", items => {
                if (items.color){
                    this.color = items.color
                }else{
                    this.color = '#B5E5B5'
                }
            });

            // qrcode
            console.log('qrcode')

            chrome.tabs.getSelected(null, tab => {
                console.log('tab', tab)

                // if (tab.favIconUrl) {

                // 请求获取短网址
                if (tab.url.indexOf('chrome://') === -1) {
                    this.qrcodeSrc = `https://nodeapi.yunser.com/qrcode?content=` + encodeURIComponent(tab.url)
                } else {
                    this.qrcodeSrc = ''
                }
                let arr = tab.url.split('//')[1].split('/')
                console.log('arr', arr)
                let host = arr[0]
                chrome.bookmarks.search(host, list => {
                    console.log('搜索结果', list)
                    this.bookmarks = list
                })
            })

            
            var selection = document.getElementById("search_name");
            var selected = 0;
            /**
            * @description 通过localStorage将用户选择的搜索引擎记录选中
            * @author 刘放 brizer1992@outlook.com 
            * @date 2015/12/17 10:56
            */
            if(localStorage.getItem("index")){
                selected = localStorage.getItem("index");
            }else {
                localStorage.setItem("index","0");
            }
            selection.value = selected;
            selection.addEventListener("change",function(){
                selected = selection.options[selection.selectedIndex].value;
                localStorage.setItem("index",selected);
                sendMessage(selected);
            },false);

            /**
            * @description 将选中的搜索引擎传递到background中
            * @author 刘放 brizer1992@outlook.com 
            * @date 2015/12/17
            */
            function sendMessage(){
                chrome.extension.sendMessage({resource:"popup",selected:selected},function(response){});
            }

            this.initStyle()
        },
        methods: {
            openBookmark(item) {
                chrome.tabs.create({ url: item.url })
            },
            sendMessage(msg) {
                chrome.tabs.getSelected(null, tab => {
                    let port = chrome.tabs.connect(tab.id, {
                        name: 'test-connect'
                    })
                    port.postMessage(msg)
                })
            },
            readMode() {
                this.sendMessage({
                    type: 'openReadMode',
                })
            },
            useStyle(value, item) {
                console.log('使用', value, item)
                if (value) {
                    chrome.tabs.getSelected(null, tab => {
                        console.log('tab', tab)
                        var port = chrome.tabs.connect(tab.id, {name: 'test-connect'});
                        port.postMessage({
                            type: 'setStyle',
                            style: item
                        })
                        let userStyle = this.$storage.get('userStyle', [])
                        userStyle.push(item)
                        this.$storage.set('userStyle', userStyle)
                        // port.onMessage.addListener(function(msg) {
                        //     alert('收到消息：'+msg.answer);
                        //     if(msg.answer && msg.answer.startsWith('我是'))
                        //     {
                        //         port.postMessage({question: '哦，原来是你啊！'});
                        //     }
                        // });
                        // if (tab.url.includes('www.baidu.com')) {
                        //     this.styles = [
                        //         {
                        //             id: '0889',
                        //             name: '云设百度简化插件',
                        //             style: `
                        //             `
                        //         }
                        //     ]
                        // }
                    })
                } else {
                    chrome.tabs.getSelected(null, tab => {
                        var port = chrome.tabs.connect(tab.id, {name: 'test-connect'});
                        port.postMessage({
                            type: 'removeStyle',
                            style: item
                        })
                        let userStyle = this.$storage.get('userStyle', [])
                        userStyle = userStyle.filter(it => it.id !== item.id)
                        this.$storage.set('userStyle', userStyle)
                    })
                }
                
            },
            isEnable(id) {
                let userStyle = this.$storage.get('userStyle', [])
                let style = userStyle.find(item => item.id === id)
                return !!style
            },
            initStyle() {
                chrome.tabs.getSelected(null, tab => {
                    console.log('tab', tab)
                    let extensionApi = 'http://localhost:7002'
                    let arr = tab.url.split('//')[1].split('/')
                    console.log('arr', arr)
                    let host = arr[0]
                    console.log('host', host)
                    this.$http.get(extensionApi + `/extensions?host=${host}`)
                        .then(response => {
                            let data = response.data
                            this.styles = data.map(item => {
                                return {
                                    ...item,
                                    id: item._id,
                                    enable: this.isEnable(item._id),
                                }
                            })
                            console.log('数据', this.styles)
                        },
                        response => {
                            console.log('cuol')
                            if (response.code === 403) {
                                // this.$store.state.user = null
                            }
                            this.loading = false
                        })
                })
            },
            finish() {
                this.apps = storage.get('apps', [])
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
                this.apps.push({
                    title: this.form.title,
                    url: this.form.url,
                    icon: this.form.icon
                })
                storage.set('apps', this.apps)
                this.mode = ''
            },
            addApp() {
                this.mode = 'add'
                chrome.tabs.getSelected(null, tab => {
                    console.log('tab', tab)
                    this.form.title = tab.title
                    this.form.url = tab.url
                    this.form.icon = tab.favIconUrl
                })
            },
            changeColor(e) {
                chrome.tabs.executeScript(null,
                    {
                        code: `document.body.style.backgroundColor = "${this.color}"`
                    }
                )

                // chrome.storage.local.set({
                //     color
                // })
                window.close()
                this.mode = ''
            },
            setBgColor(color) {
                chrome.tabs.executeScript(null,
                    {
                        code: `document.body.style.backgroundColor = "${color}"`
                    }
                )
                this.$storage.set('globalBgColor', color)
                chrome.storage.local.set({
                    globalBgColor: color
                })
                window.close()
                this.mode = ''
            },
            setDefault(e) {
                // e.target.parentElement.color.value = '#B5E5B5';
                console.log('aaa');
            },
            tab () {
                chrome.tabs.create({ url: 'pages/app.html' })
            }
        }
    }
</script>

<style lang="scss">
    .section {
        margin-bottom: 16px;
        .section-title {
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .empty {
        color: #999;
    }
    .box {
        // width: 300px;
        // height: 300px;
        // padding: 16px;
    }
    .mode-box {
        width: 300px;
        height: 300px;
        .body {
            padding: 16px;
        }
    }
    .full-width {
        width: 700px;
    }
    .layout {
        display: flex;
        
        .layout-right {
            width: 300px;
            height: 300px;
            padding-left: 16px;
            background-color: '#f00';
        }
    }
    .btns {
        margin-top: 16px;
        margin-bottom: 16px;
        .btn {
            margin-right: 8px;
        }
    }
    .qrcode-box {
        width: 160px;
        .qrcode {
            width: 160px;
            height: 160px;
            margin-bottom: 4px;
            border: 1px solid #eee;
            // position: absolute;
        }
        .tip {
            color: #999;
            text-align: center;
        }
    }
    .search-type {
        margin-bottom: 16px;
    }
    .bookmark-list {
        height: 160px;
        overflow: auto;
        .item {
            cursor: pointer;
        }
    }
</style>