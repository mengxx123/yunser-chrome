<template>
    <div class="page">
        <ui-appbar title="设置"></ui-appbar>
        <div class="body">
            <!-- <ui-text-field v-model="imagePageBgColor" lable="图片背景色" /> -->
        </div>
        <div class="container">
            <!-- <img src="/static/img/icon.png" @click="test"> -->
            <textarea v-model="input"></textarea>
            <button @click="addNote">添加笔记</button>
            <h2 class="section-title">笔记列表</h2>
            <ul class="note-list">
                <li class="item" v-for="item, index in notes">
                    {{ item.content }}
                    <div @click="remove(item, index)">删除</div>
                </li>
            </ul>
            <h2 class="section-title">我的插件</h2>
            <ul class="widget-list">
                <li class="item" v-for="item, index in myWidgets">
                    {{ item.name }}

                    <div @click="removeWidget(item, index)">删除</div>
                </li>
            </ul>
            <h2 class="section-title">插件市场</h2>
            <ul class="widget-list">
                <li class="item" v-for="item, index in widgets">
                    {{ item.name }}
                    <div @click="addWidget(item, index)">添加</div>
                    <!-- <div @click="remove(item, index)">删除</div> -->
                </li>
            </ul>
            <h2 class="section-title">我的搜索</h2>
            <ul class="widget-list">
                <li class="item" v-for="item, index in searchTypes">
                    {{ item.name }}

                    <div @click="removeSearch(item, index)">删除</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        data() {
            return {
                editType: 'create',
                input: '',
                notes: [],
                searchTypes: [],
                myWidgets: [
                    {
                        id: '1',
                        name: '日期',
                        url: 'https://nodeapi.yunser.net/date',
                        content: '',
                    },
                ],
                widgets: [
                    {
                        id: '1',
                        name: '日期',
                        url: 'https://nodeapi.yunser.net/date',
                        content: '',
                    },
                    {
                        id: '2',
                        name: '时间',
                        url: 'https://nodeapi.yunser.com/time?format=text',
                        content: '',
                    },
                    {
                        id: '3',
                        name: '时间记录',
                        url: 'https://nodeapi.yunser.com/record/widget',
                        content: '',
                        more: 'https://record.yunser.com/record'
                    },
                    {
                        id: '4',
                        name: 'UUID',
                        url: 'https://nodeapi.yunser.com/uuid',
                        content: '',
                        more: 'https://util.yunser.com/uuid'
                    },
                    {
                        id: '5',
                        name: '随机数',
                        url: 'https://nodeapi.yunser.com/random',
                        content: '',
                        more: 'https://math.yunser.com/random/generator'
                    },
                    {
                        id: '6',
                        name: '骰子',
                        url: 'https://nodeapi.yunser.com/dice',
                        content: '',
                        more: 'https://math.yunser.com/dice'
                    },
                    {
                        id: '7',
                        name: '抛硬币',
                        url: 'https://nodeapi.yunser.com/coin/widget',
                        content: '',
                        more: 'https://math.yunser.com/dice'
                    },
                    {
                        id: '8',
                        name: '一言',
                        url: 'https://nodeapi.yunser.com/saying?format=text',
                        content: '',
                        // more: 'https://math.yunser.com/dice' // TODO
                    },
                ],
            }
        },
        computed: {},
        created () {},
        mounted () {
            this.loadData()
        },
        methods: {
            loadData() {
                this.searchTypes = this.$storage.get('searchTypes', this.searchTypes)
                this.myWidgets = this.$storage.get('widgets', [])
                this.notes = this.$storage.get('notes', [])
            },
            test() {
                alert('test')
            },
            remove(item, index) {
                this.notes.splice(index, 1)
                this.$storage.set('notes', this.notes)
            },
            addNote() {
                if (!this.input) {
                    this.$message({
                        type: 'danger',
                        text: '请输入内容'
                    })
                    return
                }
                if (this.editType === 'create') {
                    let list = this.$storage.get('notes', [])
                    list.unshift({
                        id: '' + new Date().getTime(),
                        content: this.input,
                        createTime: new Date()
                    })
                    this.$storage.set('notes', list)
                    this.input = ''
                    this.loadData()
                } else {
                    
                }
            },
            addWidget(item) {
                this.myWidgets.push(item)
                this.$storage.set('widgets', this.myWidgets)
            },
            removeWidget(item, index) {
                this.myWidgets.splice(index, 1)
                this.$storage.set('widgets', this.myWidgets)
            },
            removeSearch(item, index) {
                this.searchTypes.splice(index, 1)
                this.$storage.set('searchTypes', this.searchTypes)

                // this.searchTypes = this.$storage.get('searchTypes', this.searchTypes)
            }
        }
    }
</script>

<style lang="scss">
    // * {
    //     margin: 0;
    //     padding: 0;
    //     box-sizing: border-box;
    //     font-size: 14px;
    //     color: #333;
    // }
    .container {
        max-width: 400px;
        margin: 0 auto;
    }
    .section-title {
        font-weight: bold;
        font-size: 24px;
    }
    .page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("/static/img");
    }
    .app-list {
        display: flex;
    }
    .body {
        padding: 16px;
    }
    .note-list {
        .item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000;
        }
    }
    .widget-list {
        .item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000;
        }
    }
</style>