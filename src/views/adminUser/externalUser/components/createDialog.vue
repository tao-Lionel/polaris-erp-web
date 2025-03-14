<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showDialog">
    <el-form ref="form" :model="form" :rules="formRules" status-icon>
      <el-form-item label="姓名" prop="displayname">
        <el-input
          size="small"
          v-model.trim="form.displayname"
          placeholder="请输入姓名，不得超过30个字符"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="genders">
        <el-select size="small" v-model="form.genders" placeholder="请选择">
          <el-option v-for="item in gendersList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input
          size="small"
          v-model.trim="form.username"
          placeholder="请输入账号，不得超过50个字符，建议用邮箱"
          maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password" v-if="!isEdit">
        <el-input
          size="small"
          :type="passwordType"
          v-model="form.password"
          placeholder="由数字与字母组成8~16位的字符"
          maxlength="16"
        >
          <i
            v-show="form.password"
            class="el-icon-view el-input__icon"
            slot="suffix"
            @click="showPassword('passwordType')"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="doublePassword" v-if="!isEdit">
        <el-input
          size="small"
          :type="doublePasswordType"
          v-model="form.doublePassword"
          placeholder="请重复输入密码"
          maxlength="16"
        >
          <i
            v-show="form.doublePassword"
            class="el-icon-view el-input__icon"
            slot="suffix"
            @click="showPassword('doublePasswordType')"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input size="small" v-model.trim="form.phone" placeholder="请输入11位阿拉伯数字，非必填"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { gendersList } from "../list"
import { addObj, putObj } from "@/api/admin/user"
import { getStore } from "@/util/store"

let form = {
  userId: "",
  displayname: "",
  genders: "",
  username: "",
  password: "",
  doublePassword: "",
  phone: "",
  isOuterUser: true
}
export default {
  name: "externalUserCreateDialog",
  components: {},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
        callback(new Error("密码必须由大写字母和小写字母和数字组成"))
      } else {
        if (this.form.doublePassword !== "") {
          this.$refs.form.validateField("doublePassword")
        }
        callback()
      }
    }
    const confirmValidatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!value || value.replace(/(^\s*)|(\s*$)/g, "") === "") {
        callback()
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, "")
        if (!/^\d{11}$/.test(value)) {
          callback(new Error("手机号码有误，请重填"))
        } else {
          callback()
        }
      }
    }

    return {
      showDialog: false,
      formRules: {
        displayname: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 30, message: "姓名不得超过30个字符", trigger: "blur" }
        ],
        genders: [{ required: true, message: "请输入性别", trigger: "change" }],
        username: [
          { required: true, message: "请输入用户账号", trigger: "blur" },
          { max: 50, message: "用户账号不得超过50个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 8, max: 16, message: "密码长度为8-16位", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        doublePassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: confirmValidatePass, trigger: "blur" }
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }]
      },
      form: {},
      gendersList: gendersList,
      passwordType: "password",
      doublePasswordType: "password"
    }
  },
  computed: {
    isEdit() {
      return !!this.form.userId
    },
    title() {
      return this.isEdit ? "编辑" : "新建"
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    openDialog(row = null) {
      if (row) {
        this.form = {
          userId: row.userId,
          displayname: row.displayname,
          genders: row.genders == "男" ? 0 : 1,
          username: row.username,
          phone: row.phone,
          isOuterUser: true
        }
      } else {
        this.form = { ...form }
      }
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            addObj(this.form)
              .then((response) => {
                if (response.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "新增成功",
                    type: "success",
                    duration: 2000
                  })

                  this.$emit("updateList")
                  this.showDialog = false
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("新增失败")
                  return
                }
              })
              .finally(() => {})
          } else {
            putObj(this.form)
              .then((response) => {
                if (response.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                  })
                  const userInfo = getStore({ name: "user_info", type: "session" })
                  const { userId, username } = userInfo
                  // 如果当前登录的用户和修改的用户是同一个的话,并且修改了账号就退出登录重新登录
                  if (userId === this.form.userId && username !== this.userInfo.username) {
                    this.$store.dispatch("LogOut").then(() => {
                      this.$router.push({ path: "/login" })
                    })
                  } else {
                    this.$emit("updateList")
                    this.showDialog = false
                  }
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("修改失败")
                  return
                }
              })
              .finally(() => {})
          }
        }
      })
    },
    showPassword(type) {
      this[type] === "" ? (this[type] = "password") : (this[type] = "")
    }
  }
}
</script>

<style lang="scss" scoped></style>
