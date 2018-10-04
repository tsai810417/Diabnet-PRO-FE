import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'en': require('./en-us.json'),
    'en-us': require('./en-us.json'),
    'zh-tw': require('./zh-tw.json'),
    'zh-cn': require('./zh-cn.json')
  }
})

if (module.hot) {
  module.hot.accept(['./en-us.json', './zh-tw.json', './zh-cn'], () => {
    i18n.setLocaleMessage('en', require('./en-us.json'))
    i18n.setLocaleMessage('en-us', require('./en-us.json'))
    i18n.setLocaleMessage('zh-tw', require('./zh-tw.json'))
    i18n.setLocaleMessage('zh-cn', require('./zh-cn.json'))
    console.log('hot reload', this, arguments)
  })
}

export default i18n
