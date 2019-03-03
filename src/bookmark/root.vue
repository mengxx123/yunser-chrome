<template>
    <div class="box">
        <ui-appbar title="书签">
        </ui-appbar>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        data() {
            return {
                account: '',
                password: '',
                test: ''
            }
        },
        computed: {
        },
        created () {},
        mounted () {
            chrome.bookmarks.getTree(list => {
                console.log('list', list)
            })
        },
        methods: {
        }
    }
</script>

<style lang="scss">
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