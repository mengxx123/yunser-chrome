<template>
    <div class="page">
        <ui-appbar title="设置"></ui-appbar>
        <div class="body">
            <ui-text-field v-model="imagePageBgColor" lable="图片背景色" />
            
        暂无设置项
        </div>
        <!-- <img src="/static/img/icon.png" @click="test"> -->
        <textarea v-model="input"></textarea>
        <button @click="addNote">添加笔记</button>
        <h2>笔记列表</h2>
        <ul class="note-list">
            <li class="item" v-for="item, index in notes">
                {{ item.content }}
                <div @click="remove(item, index)">删除</div>
            </li>
        </ul>
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
            }
        },
        computed: {},
        created () {},
        mounted () {
            this.loadData()
        },
        methods: {
            loadData() {
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
</style>