<!--
  -    Copyright (c) 2018-2025, aukeyit All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: aukeyit (aukeyit@aukeyit.com)
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input type="text" size="small" v-model="ruleForm2.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="原密码" prop="password">
                <el-input
                  :type="passwordType"
                  v-model="ruleForm2.password"
                  auto-complete="off"
                  size="small"
                  placeholder="请输入原密码"
                >
                  <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword('passwordType')"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="newpassword1">
                <el-input
                  :type="newPasswordType"
                  size="small"
                  v-model="ruleForm2.newpassword1"
                  auto-complete="off"
                  placeholder="新密码由大写字母、小写字母、数字组成，密码长度为8-16位"
                >
                  <i
                    v-show="ruleForm2.newpassword1"
                    class="el-icon-view el-input__icon"
                    slot="suffix"
                    @click="showPassword('newPasswordType')"
                  ></i>
                </el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="newpassword2">
                <el-input
                  :type="confirmNewPasswordType"
                  size="small"
                  v-model="ruleForm2.newpassword2"
                  auto-complete="off"
                  placeholder="请确认密码"
                >
                  <i
                    v-show="ruleForm2.newpassword2"
                    class="el-icon-view el-input__icon"
                    slot="suffix"
                    @click="showPassword('confirmNewPasswordType')"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="企业微信" prop="social">
                <a style="color: blue" @click="handleClick('wechat')" v-if="ruleForm2.email">{{ ruleForm2.email }}</a>
                <a style="color: blue" @click="handleClick('wechat')" v-else>绑定</a>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { openWindow } from "@/util/util"
import { getSocialByType } from "@/api/admin/sys-social-details"
import { mapState } from "vuex"
import { getToken } from "@/util/auth"
import request from "@/router/axios"

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
        // } else if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
        callback(new Error("新密码必须由大写字母和小写字母和数字组成"))
      } else {
        if (this.ruleForm2.newpassword2 !== "") {
          this.$refs.ruleForm2.validateField("newpassword2")
        }
        callback()
      }
    }
    var validatePassNew = (rule, value, callback) => {
      if (this.ruleForm2.password !== "") {
        if (value === "") {
          callback(new Error("请再次输入密码"))
        } else if (value !== this.ruleForm2.newpassword1) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      show: false,
      headers: {
        Authorization: "Bearer " + getToken()
      },
      ruleForm2: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: ""
      },
      rules2: {
        password: [
          {
            required: true,
            // min: 6,
            // message: "原密码不能为空且不少于6位",
            message: "原密码不能为空",
            trigger: "blur"
          }
          // { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 8, max: 16, message: "原密码不能为空且密码长度为8-16位", trigger: "blur" },
          // { validator: validatePass, trigger: "blur" }
        ],
        newpassword1: [
          // {
          //   required: true,
          //   min: 6,
          //   message: "新密码不能为空且不少于6位",
          //   trigger: "change"
          // }
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 8, max: 16, message: "新密码不能为空且密码长度为8-16位", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        newpassword2: [{ required: true, validator: validatePassNew, trigger: "blur" }]
      },
      passwordType: "password",
      newPasswordType: "password",
      confirmNewPasswordType: "password"
    }
  },
  created() {
    this.ruleForm2.username = this.userInfo.username
    this.ruleForm2.email = this.userInfo.email
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request({
            url: "/admin/user/edit",
            method: "put",
            data: this.ruleForm2
          })
            .then((response) => {
              if (response.data.data) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                })
                // 修改密码之后强制重新登录
                if (this.ruleForm2.newpassword1 !== "") {
                  this.$store.dispatch("LogOut").then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                  })
                } else {
                  this.$router.push({ path: "/" })
                }
              } else {
                this.$notify({
                  title: "失败",
                  message: response.data.msg,
                  type: "error",
                  duration: 2000
                })
              }
            })
            .catch(() => {
              this.$notify({
                title: "失败",
                message: "修改失败",
                type: "error",
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClick(thirdpart) {
      let appid, agentid, client_id, redirect_uri, url
      redirect_uri = encodeURIComponent(window.location.origin + "/#/authredirect?type=BIND")
      if (thirdpart === "wechat") {
        getSocialByType("WX").then((response) => {
          if (response.data.code === 0 && response.data.data) {
            var wxConfig = response.data.data
            url =
              "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=" +
              wxConfig.appId +
              "&agentid=" +
              wxConfig.agentId +
              "&redirect_uri=" +
              redirect_uri +
              "&state=" +
              wxConfig.type +
              "&response_type=code&scope=snsapi_login#wechat_redirect"
            openWindow(url, thirdpart, 540, 600)
          }
        })
      } else if (thirdpart === "tencent") {
        client_id = "101322838"
        url =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&state=" +
          appid +
          "&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri
        openWindow(url, thirdpart, 540, 600)
      }
    },
    showPassword(type) {
      this[type] === "" ? (this[type] = "password") : (this[type] = "")
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-icon-view {
  cursor: pointer;
}
</style>
