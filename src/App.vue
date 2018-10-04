<template>
  <div id="app" class="wrapper">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      SetToken: {
        SId: '',
        Token: ''
      }
    }
  },
  created: function () {
    this.SetToken = this.$ls.get('SetToken')
  }
}
</script>
<style>
</style>
