<template>
    <div :class="['widget', userSetting.isWidgetLock ? 'lock-fixed' : '']" v-if="true">
        <!-- <button @click="getClipboard">test</button> -->
        <ul class="widget-list">
            <li class="item">
                <div class="header">
                    <div class="title">图片编辑</div>
                </div>
                <div class="body">
                    <input type="file" @change="onFileChange($event)">
                </div>
            </li>
            <li class="item" v-for="item in widgets" :key="item.id">
                <div class="header">
                    <div class="title">{{ item.name }}</div>
                    <a class="more" :href="item.more" v-if="item.more">更多</a>
                </div>
                <div class="body" @click="copy(item.content)">
                    <div class="text">{{ item.content }}</div>
                </div>
            </li>
        </ul>
        <div class="lock" @click="toggleLock">
            {{ userSetting.isWidgetLock ? '已锁定' : '锁定' }}
            <!-- <ui-icon value="lock" /> -->
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import storage from '../util/storage.js'
import todo from './todo.vue'
// import moment from '../libs/moment.js'
const moment = require('../libs/moment')

// console.log('moment', moment().format('YYYY-MM-DD'))

function copyToBorad(text) {
	var textarea = document.createElement('textarea')
	document.body.appendChild(textarea)
	textarea.value = text
	textarea.select()
	document.execCommand('copy')
	textarea.remove()
    console.log('复制成功', text)
}

export default {
    data() {
        return {
            userSetting: {},
            widgets: [
            ],
        }
    },
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.userSetting = this.$storage.get('userSetting', {
            isWidgetLock: true,
        })
        this.widgets = this.$storage.get('widgets', [])
        this.widgets.forEach((item, index) => {
            this.$http.get(item.url).then(
                response => {
                    let data = response.data
                    this.widgets[index].content = data
                },
                response => {
                    console.log('cuol')
                    if (response.code === 403) {
                        this.$store.state.user = null
                    }
                    this.loading = false
                })
        })
    },
    methods: {
        toggleLock() {
            this.userSetting.isWidgetLock = !this.userSetting.isWidgetLock
            this.$storage.set('userSetting', this.userSetting)
        },
        copy(text) {
            copyToBorad(text)
            this.$message({
                type: 'success',
                text: '已复制'
            })
        },
        getClipboard() {
            chrome.runtime.sendMessage({
                type: 'getClipboard',
                // host: location.host
            }, res => {
                // console.log('')
                console.log('收到来自后台的回复2：', res)
                // for (let item of res) {
                // 	setPageStyle(item.id, item.style)
                // }
            })
        },
        onFileChange(e) {
            console.log(e.target.files)
            let file = e.target.files[0]
            if (!file) {
                return
            }
            let reader = new FileReader()
            reader.onload = () => {
                console.log(reader.result)
                this.$storage.set('editImage', reader.result)
                window.open('image.html')
            }
            reader.readAsDataURL(file)
        }
    }
}
</script>

<style lang="scss" scoped>
.widget {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000000;
    width: 256px;
    // height: 100px;
    // color: #fff;
    // background-color: #f00;
    &.lock-fixed {
        .widget-list {
            display: block !important;
        }
        .lock {
            display: block !important;
        }
    }
    &:hover {
        .widget-list {
            display: block;    
        }
        .lock {
            display: block;    
        }
    }
}
.widget-list {
    display: none;
    height: 100%;
    padding: 16px;
    overflow: auto;
    .item {
        margin-bottom: 16px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #000;border-radius: 4px;
    }    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 16px;
        border-bottom: 1px solid #ccc;
    }
    .title {
        font-weight: bold;
        font-size: 16px;
    }
    .body {
        padding: 16px;
    }
    .text {
        cursor: pointer;
    }
}
.lock {
    display: none;
    position: absolute;
    left: 16px;
    bottom: 16px;
    color: #999;
    cursor: pointer;
}
</style>