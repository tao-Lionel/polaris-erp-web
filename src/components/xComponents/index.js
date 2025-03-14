import xEditor from "./editor/editor"

// 自定义组件
const components = {
  xEditor
}

// 注册组件
const install = function (Vue) {
  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
  })
}

// 自动安装
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components
}
