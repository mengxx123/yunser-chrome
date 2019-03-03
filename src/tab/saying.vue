<template>
    <div class="saying">
        {{ text }}
    </div>
</template>

<script>
/* eslint-disable */
import storage from '../util/storage.js'
import todo from './todo.vue'

export default {
    data() {
        return {
            // text: '这是一句话',
        }
    },
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
.saying {
    position: fixed;
    left: 24px;
    top: 56px;
    z-index: 10000;
    width: 256px;
    // height: 100px;
    color: #fff;
    // background-color: #fff;
}
</style>