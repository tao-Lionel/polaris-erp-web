import { randomStr } from "../util/util.js"
import request from "../router/axios"
import { getSocialByType } from "@/api/admin/sys-social-details"
import Toast from "vant/es/toast"

const wx_sdk = {
  sdk1: "http://res.wx.qq.com/open/js/jweixin-1.2.0.js"
}

export var init_sdk = (sdkName, callback) => {
  ;((window, document) => {
    let count = 0
    const toastErr = (i) => {
      const o = {
        1: "微信验证出错,请刷新页面",
        2: "后台接口错误"
      }
      Toast(o[i])
    }

    function wxConfig(isRefresh) {
      request({
        url: "/weixin/wechat/getJsapiTicketInfo",
        method: "get",
        params: {
          isRefresh: isRefresh === true
        }
      }).then((response) => {
        if (response.data.code === 0 && response.data.data) {
          const ticket = response.data.data
          const timestamp = Number(new Date().getTime().toString().slice(0, 10))
          const nonceStr = randomStr(true, 10, 16)
          const str = `jsapi_ticket=${ticket["ticket"]}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${window.location.href.split("#")[0]}`
          const signature = CryptoJS.SHA1(str).toString() //生成签名

          getSocialByType("WX").then((res) => {
            if (res.data.code === 0 && res.data.data) {
              const wxInfo = res.data.data
              wx.config({
                beta: true,
                debug: process.env.NODE_ENV === "development",
                appId: wxInfo.appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: ["checkJsApi", "scanQRCode"] //可用接口地址 https://work.weixin.qq.com/api/doc#90000/90136/90507
              })
              wx.ready(function () {
                wx.checkJsApi({
                  jsApiList: ["qrCode", "barCode"],
                  success: function (res) {}
                })
                //所有需要调用的动作，加载callback之后
                callback()
              })

              wx.error(function (err) {
                //config验证失败会执行该方法，正确不会,只允许调取最多3次
                if (err.errMsg) {
                  count++
                  if (count < 3) {
                    wxConfig(true)
                  } else {
                    toastErr(1)
                  }
                }
              })
            } else {
              toastErr(2)
            }
          })
        } else {
          toastErr(2)
        }
      })
    }

    const getSDKScript = document.getElementById(sdkName)
    if (getSDKScript) {
      wxConfig()
      return
    }

    let createScriptEle = document.createElement("script")
    let body = document.querySelector("body")
    createScriptEle.src = wx_sdk[sdkName]
    createScriptEle.setAttribute("id", sdkName)
    body.appendChild(createScriptEle)

    createScriptEle.onload = function () {
      wxConfig()
    }
  })(window, document)
}
