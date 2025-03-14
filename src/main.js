import "babel-polyfill"
import "classlist-polyfill"
import Vue from "vue"
import axios from "./router/axios"
import VueAxios from "vue-axios"
import App from "./App"
import "./icons" // icon
import "./permission" // 权限
import "./error" // 日志
import router from "./router/router"
import "avue-plugin-transfer/packages" // 引入avue-plugin-transfer插件
// import 'avue-plugin-ueditor/packages' //引入avue-plugin-ueditor插件(如果要兼容ie自行换掉富文本编辑器，此款插件不兼容ie)
import store from "./store"
import { loadStyle } from "./util/util"
import * as urls from "@/config/env"
import { iconfontUrl, iconfontVersion } from "@/config/env"
import * as filters from "./filters" // 全局filter
import "./styles/common.scss"
// // 引入avue的包
import Avue from "@/components/avue/index.js"
// // 引入avue的样式文件
import "@/components/avue/theme-chalk/src/index.scss"
import basicContainer from "./components/basic-container/main"
import dropDownButton from "./components/DropDownButton/index"
import yButton from "./components/yvue/button/index"
import detailTemplate from "./components/yvue/detailTemplate/index"
import VueClipboard from "vue-clipboard2"
// 插件 json 展示
import vueJsonTreeView from "vue-json-tree-view"
import * as directiveAll from "@/util/directives"
import Print from "@/util/print"
import "@/styles/base/base.scss"

import XComponents from "./components/xComponents"
import componentsInstall from "./components/components-install"

// 联动布局
// import VueGridLayout from 'vue-grid-layout';

// Vue.use(GridLayout)
// Vue.use(GridItem)

// //源文件包
// import '../packages/index.js';
// import '../packages/theme-chalk/src/index.scss';

Vue.use(Avue, { menuType: "text" })
Vue.use(router)

Vue.use(VueClipboard)

Vue.use(vueJsonTreeView)

Vue.use(VueAxios, axios)
/*指定不打印区域
方法一. 添加no-print样式类
<div class="no-print">不要打印我</div>
方法二. 自定义类名
<div class="do-not-print-me-xxx">不要打印我</div>
this.$print(this.$ref.print,{'no-print':'.do-not-print-me-xxx'}) // 使用
https://github.com/xyl66/vuePlugs_printjs
*/
Vue.use(Print)

Vue.use(XComponents)
Vue.use(componentsInstall)

//取消警告
Vue.config.silent = true
Vue.config.devtools = true

Vue.component("basicContainer", basicContainer)
//引入自定义下拉按钮
Vue.component("el-dropdown-button", dropDownButton)

//引入自定义按钮
Vue.component("y-button", yButton)

// 注册详情结构模板
Object.keys(detailTemplate).forEach((key) => {
  Vue.component(detailTemplate[key].name, detailTemplate[key])
})
// Vue.component('detail-template',detailTemplate)

Object.keys(directiveAll).forEach((key) => {
  Vue.directive(directiveAll[key].name, directiveAll[key].methods)
  // console.log(key);
})

Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key]
})

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele))
})

if (process.env.NODE_ENV === "development") {
  // 手机端调试
  if (require("./views/mobile/util/util").isPhone()) {
    const Vconsole = require("vconsole")
    new Vconsole()
  }
}

Vue.config.productionTip = false
new Vue({
  router,
  store,
  //   components: {
  //     GridLayout: VueGridLayout.GridLayout,
  //     GridItem: VueGridLayout.GridItem
  // },
  render: (h) => h(App)
}).$mount("#app")
