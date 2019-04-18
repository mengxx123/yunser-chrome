<template>
    <div class="box">
        <ui-appbar title="图片编辑器">
        </ui-appbar>
        <div class="body">
            <img :src="image">
            <!-- <textarea class="textarea" v-model="text" name="" id="" cols="30" rows="10"></textarea> -->
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        data() {
            return {
                image: ''
            }
        },
        computed: {
        },
        created () {},
        mounted () {
            document.title = '图片编辑器'
            this.image = this.$storage.get('editImage', '')
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    .body {
        height: 100%;
        padding: 16px;
    }
    .textarea {
        padding: 16px;
        width: 100%;
        height: 100%;
    }
    .box {
        // width: 300px;
        // height: 300px;
        // padding: 16px;
    }
    .btns {
        margin-top: 16px;
        .btn {
            margin-right: 8px;
        }
    }
    .article {
        padding: 16px;
    }
</style>