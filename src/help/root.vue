<template>
    <div class="box">
        <ui-appbar title="帮助">
        </ui-appbar>
        <ui-article class="article">
            <h2>标签页</h2>
            <p>鼠标右键可以编辑和删除快捷方式。</p>
            <h2>登录</h2>
            <ui-text-field v-model="account"  hintText="账号" />
            <br>
            <ui-text-field v-model="password" type="password" hintText="密码" />
            <br>
            <ui-raised-button primary @click="login">登录</ui-raised-button>
        </ui-article>
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
        },
        methods: {
            login() {
                this.$http.post(`/login`, {
                    account: this.account,
                    password: this.password
                })
                .then(response => {
                    let data = response.data
                    console.log('数据')
                    console.log(data)
                    this.$storage.set('user', data.user)
                    this.$storage.set('accessToken', data.accessToken)
                },
                response => {
                    console.log('cuol')
                    if (response.code === 403) {
                        this.$store.state.user = null
                    }
                    this.loading = false
                })
            }
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