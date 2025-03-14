<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :option="tableOption"
      :data="tableData"
      :page="page"
      @size-change="sizeChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @refresh-change="handleRefreshChange"
      @selection-change="selectionChange"
      @current-change="currentChange"
    >
      <template slot="menuLeft">
        <el-button v-if="permissions.external_user_add" size="small" type="primary" @click="handleCreate">
          新建外部用户
        </el-button>
        <el-button v-if="permissions.external_user_edit" size="small" type="primary" @click="handleUpdate">
          修改外部用户
        </el-button>
        <el-button
          v-if="permissions.external_user_relation_function"
          size="small"
          type="primary"
          @click="handleRelevantRole"
        >
          关联功能角色
        </el-button>
        <el-button
          v-if="permissions.external_user_password_reset"
          size="small"
          type="primary"
          @click="handlePasswordInit"
        >
          密码初始化
        </el-button>
        <el-button v-if="permissions.external_user_rep" size="small" type="primary" @click="handleLogin">
          登录
        </el-button>
        <el-button v-if="permissions.external_user_lock" size="small" type="primary" @click="handleEnable"
          >启用</el-button
        >
        <el-button v-if="permissions.external_user_lock" size="small" type="primary" @click="handleDisable"
          >禁用</el-button
        >
      </template>

      <template slot="search">
        <el-form @submit.native.prevent :model="searchParam" ref="searchParam" :inline="true">
          <el-form-item prop="username">
            <el-input v-model="searchParam.username" size="small" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item prop="displayname">
            <el-input v-model="searchParam.displayname" size="small" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item prop="lockFlag">
            <el-select v-model="searchParam.lockFlag" clearable size="small" placeholder="选择启用状态">
              <el-option label="启用中" value="0"></el-option>
              <el-option label="禁用中" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="lockFlag" slot-scope="scope">
        <el-tag :type="scope.row.lockFlag === '禁用中' ? 'danger' : 'success'">{{ scope.row.lockFlag }}</el-tag>
      </template>
    </avue-crud>

    <createDialog ref="createDialogRef" @updateList="updateList"></createDialog>
    <relevantFunctionRoleDialog
      ref="relevantFunctionRoleDialogRef"
      @updateList="updateList"
    ></relevantFunctionRoleDialog>
  </basic-container>
</template>

<script>
import { tableOption } from "./list.js"
import { mapGetters } from "vuex"
import createDialog from "./components/createDialog.vue"
import relevantFunctionRoleDialog from "./components/relevantFunctionRoleDialog.vue"
import { fetchList, editFlagLock, getPassCode, passwordInitV2Api } from "@/api/admin/user"
import router from "@/router/router"
import { recordLog } from "@/api/login"

export default {
  name: "externalUser",
  components: { createDialog, relevantFunctionRoleDialog },
  data() {
    return {
      tableOption,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条,
      },
      searchParam: {
        username: "",
        displayname: "",
        lockFlag: "",
        isOuterUser: true
      },
      selectRows: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },

  watch: {},
  created() {
    this.init()
    this.getList()
  },
  methods: {
    init() {},
    //加载列表数据
    async getList() {
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.searchParam
      }

      fetchList(params).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    searchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.$refs.searchParam.resetFields()
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    handleCreate() {
      this.$refs.createDialogRef.openDialog()
    },
    handleUpdate() {
      if (this.selectRows.length !== 1) {
        this.$message.error("请选择一条数据")
        return
      }
      this.$refs.createDialogRef.openDialog(this.selectRows[0])
    },
    //关联功能角色
    handleRelevantRole() {
      if (this.selectRows.length !== 1) {
        this.$message.error("请选择一条数据")
        return
      }
      this.$refs.relevantFunctionRoleDialogRef.openDialog(this.selectRows[0].userId)
    },
    handlePasswordInit() {
      if (this.selectRows.length !== 1) {
        this.$message.error("请选择一条数据")
        return
      }
      var userId = this.selectRows[0].userId
      var displayname = this.selectRows[0].displayname
      this.$confirm("确定要初始化" + displayname + "的密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data, msg } = await passwordInitV2Api({ userId: userId })
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$notify({
              title: "成功",
              message: "密码初始化成功",
              type: "success",
              duration: 2000
            })
          } else if (data.code == 1) {
            this.$message.error(msg || data.msg)
            return
          } else {
            this.$message.error("密码初始化失败")
            return
          }
        })
        .catch((res) => {})
    },
    handleLogin() {
      if (this.selectRows.length !== 1) {
        this.$message.error("请选择一条数据")
        return
      }
      var username = this.selectRows[0].username
      var lockFlag = this.selectRows[0].lockFlag

      if (lockFlag != "启用中") {
        this.$message.error("非启用中的账号不允许登录")
        return
      }

      this.$confirm("确定要代登录该用户(用户名:" + username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //后台获取密码和验证码
          getPassCode().then((response) => {
            this.$store.dispatch("LogOut").then(() => {
              //代登录
              this.$store
                .dispatch("LoginByUsername", {
                  username: username,
                  password: response.data.data,
                  code: response.data.data,
                  randomStr: response.data.data
                })
                .then(() => {
                  recordLog({ type: 2 })
                    .then(({ data }) => {})
                    .catch(() => {})
                  window.location.href = window.location.origin
                })
                .catch((error) => {
                  router.push({
                    path: "/login"
                  })
                })
            })
          })
        })
        .catch((res) => {})
    },
    //启用
    handleEnable() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请勾选数据")
      } else {
        var selectIds = []
        for (var i = 0; i < this.selectRows.length; i++) {
          var lockFlag = this.selectRows[i].lockFlag
          if (lockFlag != "禁用中") {
            this.$message.error("勾选的数据存在着非禁用中的状态")
            return
          }
          selectIds.push(this.selectRows[i].userId)
        }
        var userIds = selectIds.join(",")
        var lockFlag = "0"
        var param = {
          userIds: userIds,
          lockFlag: lockFlag,
          isOuterUser: true
        }

        editFlagLock(param)
          .then((response) => {
            if (response.data.code === 0) {
              this.$refs.crud.selectClear()
              this.getList()
              this.$notify({
                title: "成功",
                message: "启用成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("启用失败")
              return
            }
          })
          .finally(() => {})
      }
    },

    //禁用
    handleDisable() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else {
        var selectIds = []
        for (var i = 0; i < this.selectRows.length; i++) {
          var lockFlag = this.selectRows[i].lockFlag
          if (lockFlag != "启用中") {
            this.$message.error("勾选的数据存在着非启用中的状态")
            return
          }
          selectIds.push(this.selectRows[i].userId)
        }
        var userIds = selectIds.join(",")
        var lockFlag = "1"
        var param = {
          userIds: userIds,
          lockFlag: lockFlag,
          isOuterUser: true
        }

        editFlagLock(param)
          .then((response) => {
            if (response.data.code == 0) {
              this.$refs.crud.selectClear()
              this.getList()
              this.$notify({
                title: "成功",
                message: "禁用成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("禁用失败")
              return
            }
          })
          .finally(() => {})
      }
    },
    updateList() {
      this.$refs.crud.selectClear()
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
