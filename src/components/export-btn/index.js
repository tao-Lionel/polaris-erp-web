import ExportBtn from "./package/index.vue"

ExportBtn.install = function (Vue) {
  Vue.component(ExportBtn.name, ExportBtn)
}

export default ExportBtn
