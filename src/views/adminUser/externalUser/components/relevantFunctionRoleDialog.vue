<template>
  <el-dialog title="关联功能角色" :visible.sync="showDialog" width="500px" center @close="showDialogClose">
    <h3 class="mg-b-20">
      功能角色
      <span style="color: red; font-size: 14px; margin-left: 10px">{{ roleFunctionError }}</span>
    </h3>
    <div>
      <el-tag
        :key="tag.roleId"
        v-for="tag in userRoleList"
        closable
        :disable-transitions="false"
        @close="handleCloseTag(tag)"
        >{{ tag.roleName }}</el-tag
      >
    </div>

    <el-form ref="roleFunctionForm" :model="roleFunctionForm">
      <el-form-item
        v-for="(v, i) in roleFunctionForm.roleFunction"
        :label="'功能权限' + (i + 1) + ':'"
        :key="v.key"
        :prop="'roleFunction.' + i + '.value'"
        :rules="[{ required: true, message: '请选择功能角色', trigger: 'change' }]"
      >
        <el-select
          size="small"
          v-model="v.value"
          style="width: 280px"
          placeholder="请选择功能角色, 即功能模板"
          @change="changeRoleSelect()"
          filterable
        >
          <el-option
            v-for="item in allRoleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          ></el-option>
        </el-select>
        <el-button type="text" @click.prevent="removeItem(v)" style="margin: 0 1rem">&times;</el-button>
      </el-form-item>
      <el-button @click="appendItem" style="width: 100%; margin-top: 20px">添加</el-button>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoleListById, getAll as getAllRole } from "@/api/admin/role"
import { assignRole2User } from "@/api/admin/user"

export default {
  name: "relevantFunctionRoleDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      userRoleList: [],
      roleFunctionForm: {
        roleFunction: []
      },
      allRoleList: [],
      roleFunctionError: "",
      userId: "",
      updateRoleParam: {
        id: "",
        roleIds: "",
        isOuterUser: true
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(userId) {
      this.showDialog = true
      this.userId = userId
      this.roleFunctionForm = {
        roleFunction: []
      }
      getRoleListById(userId)
        .then((response) => {
          if (response.data.code == 0) {
            this.userRoleList = response.data.data
            if (!this.userRoleList || this.userRoleList.length == 0) {
              this.userRoleList = []
            }
            getAllRole()
              .then((response) => {
                if (response.data.code == 0) {
                  this.allRoleList = response.data.data
                  if (!this.allRoleList || this.allRoleList.length == 0) {
                    this.allRoleList = []
                  }
                  this.changeRoleSelect()
                  this.showDialog = true
                } else {
                  this.$message.error("查询用户功能权限失败")
                  return false
                }
              })
              .catch((error) => {
                this.$message.error("查询用户功能权限失败")
                return false
              })
          } else {
            this.$message.error("查询用户功能权限失败")
            return false
          }
        })
        .catch(() => {
          this.$message.error("查询用户功能权限失败")
          return false
        })
    },
    //改变功能角色
    changeRoleSelect() {
      let userIdArray = []
      for (var i = 0; i < this.userRoleList.length; i++) {
        userIdArray.push(this.userRoleList[i].roleId)
      }
      for (var j = 0; j < this.roleFunctionForm.roleFunction.length; j++) {
        if (this.roleFunctionForm.roleFunction[j].value && this.roleFunctionForm.roleFunction[j].value != "") {
          userIdArray.push(this.roleFunctionForm.roleFunction[j].value)
        }
      }
      if (new Set(userIdArray).size != userIdArray.length) {
        this.roleFunctionError = "存在相同的功能角色，请检查"
        return false
      } else {
        this.roleFunctionError = ""
      }
      return userIdArray
    },
    // 添加一条
    appendItem() {
      this.roleFunctionForm.roleFunction.push({ value: "", key: Date.now() })
    },

    // 删除一条
    removeItem(item) {
      var index = this.roleFunctionForm.roleFunction.indexOf(item)
      if (index !== -1) this.roleFunctionForm.roleFunction.splice(index, 1)
      this.changeRoleSelect()
    },
    //关闭Tag
    handleCloseTag(tag) {
      this.userRoleList.splice(this.userRoleList.indexOf(tag), 1)
      this.changeRoleSelect()
    },
    submit() {
      this.$refs.roleFunctionForm.validate((valid) => {
        if (valid) {
          this.updateRoleParam.id = this.userId
          var roleSelect = this.changeRoleSelect()
          if (!roleSelect) {
            return false
          }
          if (roleSelect && roleSelect.length > 0) {
            this.updateRoleParam.roleIds = roleSelect.join(",")
          } else {
            this.updateRoleParam.roleIds = ""
          }

          assignRole2User(this.updateRoleParam)
            .then((response) => {
              if (response.data.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "关联功能权限成功",
                  type: "success",
                  duration: 2000
                })
                this.$emit("updateList")
                this.showDialog = false
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("关联功能权限失败")
                return
              }
            })
            .finally(() => {})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
