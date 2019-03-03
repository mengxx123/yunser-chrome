<template>
    <div class="todo-box">
        <div class="search-box">
            <input class="input" v-model="text" @keydown="handlerKeyDown($event)" placeholder="添加待办">
            <ui-icon-button class="icon" icon="send" @click="add" />
        </div>
        <ul class="todo-list">
            <li :class="['item', item.isDone ? 'done' : '']" v-for="item, index in list">
                <ui-checkbox class="checkbox" v-model="item.isDone" />
                <div class="text">{{ item.text }}</div>
                <ui-icon-button class="remove" icon="close" @click="remove(index)" />
            </li>
        </ul>
    </div>
</template>

<script>
/* eslint-disable */
import storage from '../util/storage.js'
import todo from './todo.vue'

export default {
    data() {
        return {
            text: '',
            list: [
                {
                    text: '21212',
                    isDone: false
                },
                {
                    text: '333',
                    isDone: true
                }
            ]
        }
    },
    mounted() {
        this.list = storage.get('todo', []) 
    },
    methods: {
        handlerKeyDown(e) {
            if (e.keyCode === 13) {
                this.list.unshift({
                    text: this.text,
                    isDone: false
                })
                storage.set('todo', this.list)
                this.text = ''
            }
        },
        add() {
            this.list.unshift({
                text: this.text,
                isDone: false
            })
            storage.set('todo', this.list)
            this.text = ''
        },
        remove(index) {
            this.list.splice(index, 1)
            storage.set('todo', this.list)
        }
    }
}
</script>

<style lang="scss" scoped>
.todo-box {
    position: absolute;
    right: 24px;
    top: 56px;
    width: 256px;
    // height: 100px;
    background-color: #fff;
}
.todo-list {
    max-height: 144px;
    overflow: auto;
    .item {
        position: relative;
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 16px;
        &:hover {
            .remove {
                display: block;
            }
        }
    }
    .done {
        opacity: .4;
    }
    .checkbox {
        margin-right: 8px;
    }
    .remove {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
    }
}
.search-box {
    position: relative;
    display: flex;
    max-width: 400px;
    height: 48px;
    // margin: 40px auto 16px auto;
    // box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    overflow: hidden;
    .input {
        height: 48px;
        padding-left: 16px;
        flex-grow: 1;
        border: none;
        outline: none;
    }
    .icon {
        color: #999;
    }
}
</style>