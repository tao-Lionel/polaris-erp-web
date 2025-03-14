<template>
  <div>正在验证授权......</div>
</template>
<script>
import { mapGetters } from "vuex"
import { validatenull } from "@/util/validate"
import { recordLog } from "@/api/login"
import { isPhone } from "../../views/mobile/util/util"
export default {
  name: "wxoauth",
  data() {
    return {
      socialForm: {
        code: "",
        state: ""
      }
    }
  },
  created() {
    //   debugger
    //   alert(this.$route.query)
    const params = this.$route.query
    this.socialForm.state = params.state
    this.socialForm.code = params.code
    console.log("wxoauth", this.socialForm)
    if (!validatenull(this.socialForm.state)) {
      this.handleSocialLogin()
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(["website"]),
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    handleSocialLogin() {
      console.log("handleSocialLogin", handleSocialLogin)
      this.$store
        .dispatch("LoginBySocial", this.socialForm)
        .then(() => {
          recordLog({ type: 1 })
            .then(({ data }) => {})
            .catch(() => {})
          // if (isPhone()) {
          //   this.$router.push({ path: "/mobile" })
          // } else {
          this.$router.push({ path: this.tagWel.value })
          // window.location.replace(`${window.location.origin}`)
          // }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    }
  }
}
</script>
