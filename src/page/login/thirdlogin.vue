<template>
  <div class="social-container">
    <div id="wx_reg"></div>
  </div>
</template>

<script>
// import { openWindow } from "@/util/util"
import { getSocialByType } from "@/api/admin/sys-social-details"

export default {
  name: "social-signin",
  methods: {
    // handleClick(thirdPart) {
    //   let url
    //   let redirect_uri = encodeURIComponent(window.location.origin + "/#/authredirect")
    //   if (thirdPart === "wechat") {
    //     let appid = ""
    //     url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX&response_type=code&scope=snsapi_login#wechat_redirect`
    //   } else if (thirdPart === "tencent") {
    //     let client_id = ""
    //     url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ&client_id=${client_id}&redirect_uri=${redirect_uri}`
    //   }
    //   openWindow(url, thirdPart, 540, 540)
    // }
  },
  async created() {
    const { data } = await getSocialByType("WX")
    if (data.code === 0 && data.data) {
      let wxConfig = data.data
      let spt = document.getElementById("qywxscript")
      if (!spt) {
        spt = document.createElement("script")
        spt.id = "qywxscript"
        spt.src = "https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js"
        document.body.appendChild(spt)
        spt.onload = spt.onreadystatechange = function () {
          if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            window.WwLogin({
              id: "wx_reg",
              appid: wxConfig.appId,
              agentid: wxConfig.agentId,
              redirect_uri: encodeURIComponent(window.location.origin + wxConfig.redirectUrl),
              state: wxConfig.type
              //href: "http://trobs.aukeyit.com/styles/weixinlogin.css"
            })
          }
        }
      } else {
        window.WwLogin({
          id: "wx_reg",
          appid: wxConfig.appId,
          agentid: wxConfig.agentId,
          redirect_uri: encodeURIComponent(window.location.origin + wxConfig.redirectUrl),
          state: wxConfig.type
          //href: "http://trobs.aukeyit.com/styles/weixinlogin.css"
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.social-container {
  // margin: 20px 0;
  // height: 80%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .box {
    cursor: pointer;
  }
  .iconfont {
    color: #fff;
    font-size: 30px;
  }
  .container {
    $height: 50px;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .title {
    text-align: center;
  }
}
</style>
