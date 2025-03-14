import CopyText from './package/index.vue'

CopyText.install = function (Vue) {
  Vue.component(CopyText.name, CopyText)
}

export default CopyText