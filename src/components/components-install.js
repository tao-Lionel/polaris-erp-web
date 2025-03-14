// src/index-install.js
import Vue from "vue"
import CopyText from "./copy-text"
import ExportBtn from "./export-btn"
import SelectAll from "./select-all"
import PreviewImg from "./preview-img"

const components = [CopyText, ExportBtn, SelectAll, PreviewImg]

const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
  ...components
}
