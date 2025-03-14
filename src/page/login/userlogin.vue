<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="username">
      <el-input
        class="change_place"
        clearable
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        placeholder="账号"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        class="change_place"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="密码"
      >
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" class="login_yzm">
      <!-- <el-row :span="24">
          <el-col :span="14"> -->
      <el-input
        style="flex: 1"
        clearable
        @keyup.enter.native="handleLogin"
        :maxlength="code.len"
        v-model="loginForm.code"
        auto-complete="off"
        placeholder="请输入验证码"
      >
        <i slot="prefix" class="icon-yanzhengma"></i>
      </el-input>
      <!-- </el-col>
          <el-col :span="10"> -->
      <div class="login-code">
        <span class="login-code-img" @click="refreshCode" v-if="code.type == 'text'">{{ code.value }}</span>
        <img :src="code.src" class="login-code-img" @click="refreshCode" v-else />
        <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
      </div>
      <!-- </el-col>
        </el-row> -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from "@/util/util"
import { mapGetters } from "vuex"
import { recordLog } from "@/api/login"
import { isPhone } from "../../views/mobile/util/util"
// import three from './plugin/js/three.min.js'
// import './plugin/js/index.js'

export default {
  name: "userlogin",
  data() {
    return {
      socialForm: {
        code: "",
        state: ""
      },
      loginForm: {
        username: "",
        password: "",
        code: "",
        redomStr: ""
      },
      checked: false,
      code: {
        src: "/code",
        value: "",
        len: 4,
        type: "image"
      },
      loginRules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" }
        ]
      },
      passwordType: "password"
    }
  },
  watch: {
    $route() {
      const params = this.$route.query
      this.socialForm.state = params.state
      this.socialForm.code = params.code
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `登录中,请稍后。。。`,
          spinner: "el-icon-loading"
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
        this.handleSocialLogin()
      }
    }
  },
  created() {
    this.refreshCode()
  },
  mounted() {
    // require('./plugin/js/three.min.js')
    // require('./plugin/js/index.js')
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      this.loginForm.code = ""
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === "text"
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    showPassword() {
      this.passwordType == "" ? (this.passwordType = "password") : (this.passwordType = "")
    },
    handleSocialLogin() {
      this.$store.dispatch("LoginBySocial", this.socialForm).then(() => {
        this.$router.push({ path: this.tagWel.value })
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              recordLog({ type: 0 })
                .then(({ data }) => {})
                .catch(() => {})

              // if (isPhone()) {
              //   //m端

              //   this.$router.push({ path: "/mobile" })
              // } else {
              //pc端
              console.log("-----", this.tagWel.value)
              this.$router.push({ path: this.tagWel.value })
              // }
            })
            .catch((err) => {
              this.refreshCode()
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* @import './plugin/css/style.css' */
// .login-form{
//  ::v-deep .el-form-item__error{margin-left: 32px;}
// }
</style>
