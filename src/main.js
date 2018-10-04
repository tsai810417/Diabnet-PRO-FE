// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import 'whatwg-fetch'

import Vue from 'vue'
import i18n from './i18n'
import App from './App'
import router from './router'
import VueLocalStorage from 'vue-ls'
import Vue2Leaflet from 'vue2-leaflet'
import 'echarts'
import ECharts from 'vue-echarts/components/ECharts'

import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

Vue.component('v-map', Vue2Leaflet.Map)
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer)
Vue.component('v-marker', Vue2Leaflet.Marker)
Vue.component('chart', ECharts)

Vue.use(router)

let options = {
  namespace: 'vuejs__'
}
Vue.use(VueLocalStorage, options)

Vue.config.productionTip = false

let userLang = navigator.language || navigator.userLanguage

const deflang = ['en-us', 'zh-tw', 'zh-cn']

console.log(userLang)

userLang = deflang.indexOf(userLang.toLowerCase()) !== -1 ? userLang : 'zh-tw'

i18n.locale = userLang.toLowerCase()

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
}).$mount('#app')

function loadLocaleMessage (locale, cb) {
  return fetch('/lang/' + locale, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    return res.json()
  }).then((json) => {
    if (Object.keys(json).length === 0) {
      return Promise.reject(new Error('locale empty !!'))
    } else {
      return Promise.resolve(json)
    }
  }).then((message) => {
    cb(null, message)
  }).catch((error) => {
    cb(error)
  })
}

app.loading = 'loading ...'
loadLocaleMessage('en-us.json', (err, message) => {
  if (err) {
    app.loading = ''
    console.error(err)
    return
  }
  i18n.setLocaleMessage('en', message)
  i18n.setLocaleMessage('en-us', message)
  app.loading = ''
})

loadLocaleMessage('zh-tw.json', (err, message) => {
  if (err) {
    app.loading = ''
    console.error(err)
    return
  }
  i18n.setLocaleMessage('zh-tw', message)
  app.loading = ''
})

loadLocaleMessage('zh-cn.json', (err, message) => {
  if (err) {
    app.loading = ''
    console.error(err)
    return
  }
  i18n.setLocaleMessage('zh-cn', message)
  app.loading = ''
})
