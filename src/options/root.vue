<template>
    <div class="page">
        <ui-appbar title="设置"></ui-appbar>
        <div class="body">
            <ui-text-field v-model="imagePageBgColor" lable="图片背景色" />
            
        暂无设置项
        </div>
        <!-- <img src="/static/img/icon.png" @click="test"> -->
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        data() {
            return {
            }
        },
        computed: {},
        created () {},
        mounted () {},
        methods: {
            test() {
                alert('test')
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