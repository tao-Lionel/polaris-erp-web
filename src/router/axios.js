/**
 * 全站http配置
 *
 * header参数说明
 * serialize是否开启form表单提交
 * isToken是否需要token
 */
import { serialize } from "@/util/util"
// import website from '@/const/website'
import store from "../store"
import { getStore } from "../util/store"
import { getToken } from "@/util/auth"
import NProgress from "nprogress" // progress bar
import errorCode from "@/const/errorCode"
import router from "@/router/router"
import { Message } from "element-ui"
import "nprogress/nprogress.css" // progress bar style
import qs from "qs"
import { Loading } from "element-ui"
axios.defaults.timeout = 60000
// let CancelToken = axios.CancelToken;
// let source = CancelToken.source();
// let urls = [];

// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 503 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})
// HTTPrequest拦截
let loadingModel = null
axios.interceptors.request.use(
  (config) => {
    NProgress.start() // start progress bar
    if (!(config.params && config.params.isHideLoading)) {
      loadingModel = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: "common-loading",
        // spinner:null,//el-icon-loading
        // text:'拼命加载中...',
        background: "transparent"
      })
    }
    config.params && delete config.params.isHideLoading

    // debugger
    /*
    if(config.method.toUpperCase()==='GET'&&config.params){//处理axios get不能识别数组
       Object.keys(config.params).forEach(item=>{
        if(config.params[item] instanceof Array){
          config.params[item]=config.params[item].toString();
        }
      })
    }*/
    const isToken = (config.data || {}).isToken === false
    if (getToken() && !isToken && !config.headers.Authorization) {
      config.headers["Authorization"] = "Bearer " + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    config.headers["from"] = "Y"
    const TENANT_ID = getStore({ name: "tenantId" })
    if (TENANT_ID) {
      config.headers["TENANT_ID"] = TENANT_ID // 租户ID
    }
    // headers中配置serialize为true开启序列化
    if (config.methods === "post" && config.headers.serialize) {
      config.data = serialize(config.data)
      delete config.data.serialize
    }
    config.url = "/api" + config.url
    config.paramsSerializer = function (params) {
      params.size = params.size || 20
      return qs.stringify(params, { indices: false })
    }

    // 相同接口频繁不可重复提交
    // const mark = config.url+'&'+config.method;
    // if(urls.indexOf(mark)===-1){
    //   urls.push(mark)
    // }else{
    //   config.cancelToken = source.token;
    //   source.cancel('不可频繁请求，重复提交')
    // }

    return config
  },
  (error) => {
    loadingModel.close()
    return Promise.reject(error)
  }
)

// HTTPresponse拦截
axios.interceptors.response.use(
  (res) => {
    NProgress.done()
    loadingModel.close()

    // urls = urls.filter(val=>{
    //   return val!==res.config.url+'&'+res.config.method
    // })
    const status = Number(res.status) || 200
    const message = res.data.message || res.data.msg || errorCode[status] || errorCode["default"]

    // 判断Bolb类型是否有错误信息
    if (res.data instanceof Blob && res.data.type === "application/json") {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsText(res.data, "utf-8")
        reader.onload = function (e) {
          try {
            let data = JSON.parse(e.target.result)
            if (data.code !== 0) {
              Message({
                message: data.msg,
                type: "error"
              })
              return reject(new Error(data.msg))
            }

            resolve(data) // 返回解析后的数据
          } catch (error) {
            reject(error) // 处理 JSON 解析错误
          }
        }
      })
    }

    if (status === 401) {
      store.dispatch("FedLogOut").then(() => {
        router.push({
          path: "/login"
        })
      })
      return
    }

    // 系统升级的提示
    if (status === 426) {
      Message({
        dangerouslyUseHTMLString: true,
        message: message.replace(/\n/g, "<br>"),
        type: "warning",
        customClass: "customClassUpgrade"
      })
      return Promise.reject(new Error(message))
    }

    if (status !== 200) {
      Message({
        dangerouslyUseHTMLString: true,
        message: message.replace(/\n/g, "<br>"),
        type: "error"
      })
      return Promise.reject(new Error(message))
    }
    /**
     * 判断业务状态码是否为0，否则提示错误信息  先注释隐藏
     */
    // if (res.status == 200 && res.data.code && res.data.code !== 0) {
    //   Message({
    //     message: res.data.msg,
    //     type: "error"
    //   })
    //   return Promise.reject(new Error(data.msg))
    // }

    return res
  },
  (error) => {
    NProgress.done()
    loadingModel.close()
    return Promise.reject(new Error(error))
  }
)

export default axios
