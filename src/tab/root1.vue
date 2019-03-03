<template>
    <div>
      <ui-appbar title="设置">
                <ui-icon-button icon="close"  slot="left" />
            </ui-appbar>
    </div>

</template>
<script>
  const __ = chrome.i18n.getMessage

  export default {
    data: () => ({
    }),
    computed: { },
    created () {
      console.log(__('tab'))
    },
    mounted () { },
    methods: { }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>
