<template>
  <div id="login">
    <div class="bg2">
      <!-- <img class="bg_center" src="./img/bg_last_1.png">
      <img class="left-bottom" src="./img/bg_last_left.png">
      <img class="right-top" src="./img/bg_last_right.png"> -->
    </div>
    <div class="pull-height login-container" @keyup.enter.native="handleLogin">
      <div class="top_tip">
        <div class="left_log">
          <img class="login_bg" src="./img/logo1.png" />
        </div>
        <p class="right_work">Welcome to Login!</p>
      </div>
      <div class="login-weaper">
        <div class="login-left animated fadeInLeft">
          <!-- <div v-show="false" class="login-info">
            <h2 class="login-info-title">{{website.info.title}}</h2>
            <ul class="login-info-list">
              <li class="login-info-item" v-for="(item,index) in website.info.list" :key="index">
                <i class="el-icon-check"></i>
                &nbsp;{{item}}
              </li>
            </ul>
          </div> -->
        </div>
        <div class="animated fadeInRight login-border">
          <div :class="{ 'login-main': true, 'login-type1': activeName === 'user' }">
            <div class="login-theme">
              <h4 class="login-title" v-if="activeName === 'user'">账号密码登录</h4>
              <userLogin v-if="activeName === 'user'"></userLogin>
              <!-- <codeLogin v-else-if="activeName === 'code'"></codeLogin> -->
              <thirdLogin v-else-if="activeName === 'third'"></thirdLogin>
              <!-- <thirdLogin></thirdLogin> -->
            </div>
            <div v-if="isDomainErp" class="login-menu">
              <a @click.stop="activeName = 'user'" v-if="activeName === 'third'">账号密码登录</a>
              <a @click.stop="activeName = 'third'" v-else-if="activeName === 'user'">企业微信扫描登录</a>
              <!-- <a @click.stop="activeName = 'code'">手机号登录</a> -->
            </div>
          </div>
        </div>
      </div>
      <p class="icp">
        广东甜秘密创新技术有限公司:<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
          粤ICP备2023120786号-1
        </a>
      </p>
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin"
import codeLogin from "./codelogin"
import thirdLogin from "./thirdlogin"
import topColor from "../index/top/top-color"
import color from "@/mixins/color"
import { setStore, getStore } from "@/util/store"
import { mapGetters } from "vuex"
import { validatenull } from "@/util/validate"
import { recordLog } from "@/api/login"
export default {
  name: "login",
  mixins: [color()],
  components: {
    topColor,
    userLogin,
    codeLogin,
    thirdLogin
  },
  data() {
    return {
      active: "1",
      activeName: "user",
      socialForm: {
        code: "",
        state: ""
      }
    }
  },
  watch: {
    $route: {
      handler: function () {
        const params = this.$route.query
        console.log("params================", params)
        this.socialForm.state = params.state
        this.socialForm.code = params.code
        if (!validatenull(this.socialForm.state)) {
          // const loading = this.$loading({
          //   lock: true,
          //   text: `登录中,请稍后。。。`,
          //   spinner: "el-icon-loading"
          // });
          // setTimeout(() => {
          //   loading.close();
          // }, 1000);
          this.handleSocialLogin()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.active = getStore({ name: "tenantId" })||'1';
    this.active = Math.round(Math.random()) === 0 ? "1" : "2"
  },
  mounted() {},
  computed: {
    ...mapGetters(["website"]),
    ...mapGetters(["tagWel"]),
    // 是否是erp域名
    isDomainErp() {
      if (process.env.NODE_ENV === "production") {
        return ["erp.sweetnight.com.cn"].includes(window.location.host)
      }
      return true
    }
  },
  props: [],
  methods: {
    handleCommand(command) {
      setStore({ name: "tenantId", content: command })
    },
    handleSocialLogin() {
      this.$store
        .dispatch("LoginBySocial", this.socialForm)
        .then(() => {
          recordLog({ type: 1 })
            .then(({ data }) => {
              window.location.replace(`${window.location.origin}`)
            })
            .catch(() => {})
          // this.$router.push({ path: this.tagWel.value })
        })
        .catch((error) => {
          this.$message.error(error)
          var dom = document.getElementById("wx_reg")
          if (dom) {
            var wxiframeList = dom.getElementsByTagName("iframe")
            if (wxiframeList && wxiframeList.length > 0) {
              var wxiframe = wxiframeList[0]
              wxiframe.src = wxiframe.src
            }
          }
        })
    }
  }
}
</script>

<style lang="scss">
@import "./login.scss";
</style>
