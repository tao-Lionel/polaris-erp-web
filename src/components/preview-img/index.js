import PreviewImg from "./package/index.vue"

PreviewImg.install = function (Vue) {
  Vue.component(PreviewImg.name, PreviewImg)
}

export default PreviewImg
