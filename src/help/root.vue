<template>
    <div class="box">
        <ui-appbar title="帮助">
        </ui-appbar>
        <ui-article class="article">
            <h2>标签页</h2>
            <p>鼠标右键可以编辑和删除快捷方式。</p>
            <ui-checkbox v-model="trustDevice" label="信任此设备（注意：你的账号、密码、和私钥将会明文保存在这个设备上，非常不安全）" />
            <h2>登录</h2>
            <ui-text-field v-model="account"  hintText="账号" />
            <br>
            <ui-text-field v-model="password" type="password" hintText="密码" />
            <br>
            <ui-raised-button primary @click="login">登录</ui-raised-button>
            <hr>
            <ui-text-field v-model="key" type="password" hintText="密钥" />
            <br>
            <ui-raised-button primary @click="saveKey">保存密钥</ui-raised-button>
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
                test: '',
                key: '',
                trustDevice: false
            }
        },
        computed: {
        },
        created () {},
        mounted () {
            this.key = this.$storage.get('key', '')
            this.account = this.$storage.get('account', '')
            this.password = this.$storage.get('password', '')
            this.trustDevice = this.$storage.get('trustDevice', false)
        },
        methods: {
            saveKey() {
                this.$storage.set('key', this.key)
            },
            login() {
                if (this.trustDevice) {
                    this.$storage.set('account', this.account)
                    this.$storage.set('password', this.password)
                } else {
                }
                this.$storage.set('trustDevice', this.trustDevice)

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