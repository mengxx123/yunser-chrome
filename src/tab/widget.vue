<template>
    <div class="widget" v-if="flase">
        <ul>
            
        </ul>
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
.widget {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000000;
    width: 256px;
    // height: 100px;
    color: #fff;
    background-color: #f9f9f9;
}
</style>