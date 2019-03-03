<template>
  <div>123</div>
</template>
<script>
  const __ = chrome.i18n.getMessage

  export default {
    data: () => ({
    }),
    computed: { },
    created () {
      console.log(__('popup'))
    },
    mounted () { },
    methods: {
      tab () {
        chrome.tabs.create({ url: 'pages/app.html' })
      }
    }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>
