<template>
  <div class="lock-container pull-height">
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{ shake: passwdError, bounceOut: pass }">
        <h3 class="title">{{ userInfo.username }}</h3>
        <el-input
          placeholder="请输入登录密码"
          type="password"
          class="input-with-select animated"
          v-model="passwd"
          @keyup.enter.native="handleLogin"
        >
          <el-button slot="append" icon="icon-suoping" @click="handleLogin"></el-button>
          <el-button slot="append" icon="icon-tuichu" @click="handleLogout"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex"

export default {
  name: "lock",
  data() {
    return {
      passwd: "",
      passwdError: false,
      pass: false
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    ...mapGetters(["tag", "lockPasswd"])
  },
  props: [],
  methods: {
    handleLogout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store
          .dispatch("LogOut")
          .then(() => {
            this.$router.push({ path: "/login" })
          })
          .catch((res) => {})
      })
    },
    handleLogin() {
      if (this.passwd != this.lockPasswd) {
        this.passwd = ""
        this.$message({
          message: "解锁密码错误,请重新输入",
          type: "error"
        })
        this.passwdError = true
        setTimeout(() => {
          this.passwdError = false
        }, 1000)
        return
      }
      this.pass = true
      setTimeout(() => {
        this.$store.commit("CLEAR_LOCK")
        this.$router.push({ path: this.$router.$avueRouter.getPath({ src: this.tag.value }) })
      }, 1000)
    }
  },
  components: {}
}
</script>

<style lang="scss">
.lock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .title {
    margin-bottom: 8px;
    color: #333;
  }
}

.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("/img/login.png");
  background-size: cover;
}

.lock-form {
  width: 300px;
}
</style>
