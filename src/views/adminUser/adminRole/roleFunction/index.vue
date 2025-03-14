<template>
  <basic-container class="roleFunction">
    <el-row class="role-wrapper">
      <el-col :xs="24" :sm="24" :md="13">
        <div>
          <div style="float: left">
            <el-button size="mini" type="primary" v-if="permissions.sys_role_add" @click="addRole()"
              >新建角色</el-button
            >
          </div>
        </div>
        <avue-crud
          row-class-name="role-row-style"
          ref="crud"
          :data="list"
          :page="page"
          :option="option"
          @on-load="getList"
          @search-change="search"
          @size-change="sizeChange"
          @search-reset="reset"
          @current-row-change="handleCurrentChange"
        >
          <template slot="search">
            <el-form
              @submit.prevent.native
              :model="roleFunctionForm"
              ref="roleFunctionForm"
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item label prop="roleName">
                <el-input
                  placeholder="角色名称"
                  v-model.trim="roleFunctionForm.roleName"
                  size="small"
                  class="searchInput"
                  v-search-input
                ></el-input>
              </el-form-item>
              <el-form-item label prop="roleDesc">
                <el-input
                  placeholder="备注"
                  v-model.trim="roleFunctionForm.roleDesc"
                  size="small"
                  v-search-input
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template slot="colOperation" slot-scope="scope">
            <!-- <button type="button" v-if="permissions.sys_role_del" class="el-button el-button--text el-button--small" @click="handleDelete(scope.row)">
            <i class="el-icon-delete"></i><span>删 除</span>
            </button>-->
            <i class="icon-shanchu y-icon-delect" v-if="permissions.sys_role_del" @click="handleDelete(scope.row)"></i>
          </template>
        </avue-crud>
      </el-col>
      <el-col class="role-detail" :xs="24" :sm="24" :md="7">
        <div class="role-detail-1">
          查看/修改该角色下的功能点:
          <div class="maxOver">
            <el-input placeholder="关键字过滤" v-model="filterText" size="small" style="width: 60%" />
            <div class="cus-tree-wrapper">
              <el-tree
                highlight-current
                :props="treeDataProps"
                :data="treeData"
                node-key="id"
                show-checkbox
                ref="menuTree"
                :render-content="renderContent"
                :current-node-key="currentNode"
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
              ></el-tree>
            </div>
          </div>
          <div class="fonfirm-btn">
            <el-button
              type="primary"
              @click="updateRoleFunction"
              v-if="roleDataId && permissions.sys_role_perm"
              size="small"
              class="submitButton"
              :disabled="isVisible"
              >确认</el-button
            >
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="4">
        <div style="padding: 35px 0px">
          拥有该功能角色的用户有:
          <div style="padding: 20px 0">
            <div v-if="roleDataId !== '' && roleDataId" style="font-size: 14px">
              <font v-if="!roleAuthorityNames || roleAuthorityNames.length === 0" color="orange"
                >暂无拥有该角色的用户...</font
              >
              <font v-else>
                <el-tag v-for="item in roleAuthorityNames" :key="item.index">{{ item }}</el-tag>
              </font>
            </div>
            <div style="font-size: 14px; color: gray" v-else>请选择数据角色.</div>
            <!-- <font v-if="!roleAuthorityNames || roleAuthorityNames.length===0" >请选择功能角色</font>
            <font v-else>
              <el-tag v-for="item in roleAuthorityNames" :key="item.index">{{item}}</el-tag>
            </font>-->
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="新建功能角色"
      center
      :visible.sync="addRoleDialogVisible"
      width="500px"
      @close="addRoleDialogClose"
    >
      <el-form ref="addRoleForm" :model="addRoleForm" status-icon>
        <el-form-item
          label="角色名称:"
          prop="roleName"
          :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]"
        >
          <el-input v-model.trim="addRoleForm.roleName" size="small" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="备　 　  注:" prop="roleDesc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            v-model.trim="addRoleForm.roleDesc"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addRoleSubmit('addRoleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { searchFunction, deleteFunction, select, getRoleInfoById, putRoleFunction } from "@/api/adminUser/adminRole"
import { tableOption } from "@/const/crud/adminUser/adminRole/roleFunction"
import { manageResponse, deleteEmptyProps } from "@/util/util"
import { fetchTree } from "@/api/admin/menu"
import { fetchRoleTree, addObj } from "@/api/admin/role"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "../../../../components/avue/utils/util"

export default {
  data() {
    return {
      option: tableOption,
      list: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序
      },

      roleFunctionForm: {
        roleName: "",
        roleDesc: ""
      },
      roleFunctionFormConfirm: {
        roleName: "",
        roleDesc: ""
      },
      treeDataProps: {
        label: "name",
        children: "children"
      },
      treeData: [],
      checkedKeys: [],
      roleAuthorityNames: [],
      currentNode: "",
      currentSelectNode: "",
      roleDataId: "",
      menuIds: "",
      //timer:null,
      //flag:false,
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      addRoleDialogVisible: false,
      isVisible: true,
      filterText: ""
    }
  },
  created() {
    fetchTree().then((data) => {
      this.treeData = data.data.data
      console.log("data", data.data.data)
    })
  },
  mounted() {},
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
    },
    // 改变分页大小
    sizeChange(size) {
      this.$refs.crud.selectClear()
      this.page.pageSize = size
    },
    // 重置
    reset() {
      this.$refs["roleFunctionForm"].resetFields()
    },
    // 搜索
    search(params, page) {
      page = page || this.page
      params = params || this.roleFunctionForm
      //this.$refs.crud.selectClear();
      this.roleFunctionFormConfirm = deepCloneIgnoreNull(this.roleFunctionForm)
      this.getList(page, params)
    },
    //关闭新增功能角色对话框
    addRoleDialogClose() {
      this.$refs["addRoleForm"].resetFields()
    },
    //确定新增角色
    addRoleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addObj(this.addRoleForm)
            .then((response) => {
              if (response.data.code === 0) {
                this.$notify({ type: "success", message: "新增成功" })
                this.addRoleDialogVisible = false
                this.getList(this.page)
              } else if (response.data.code === 1) {
                this.$notify({ type: "error", message: response.data.msg })
              } else {
                this.$notify({ type: "error", message: "新增失败" })
              }
            })
            .finally(() => {})
        } else {
          return false
        }
      })
    },
    //新增角色按钮
    addRole() {
      this.addRoleForm = {
        roleName: "",
        roleDesc: ""
      }
      this.addRoleDialogVisible = true
    },
    // 表格查询
    getList(page, params) {
      // var roleName = this.roleFunctionForm.roleName;
      // var roleDesc = this.roleFunctionForm.roleDesc;
      // if(roleName){
      //   this.roleFunctionForm.roleName = roleName.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }
      // if(roleDesc){
      //   this.roleFunctionForm.roleDesc = roleDesc.trim().replace(/\s+/g,',').replace(/,{2,}/g,',');
      // }

      this.page.currentPage = page.currentPage
      //params=Object.assign(params  || {},this.roleFunctionForm) ;

      searchFunction(
        Object.assign({ current: page.currentPage, size: page.pageSize }, params, this.roleFunctionFormConfirm)
      ).then(({ data }) => {
        this.list = data.data.records
        this.page.total = data.data.total
      })
      if (this.$refs.crud) {
        this.$refs.crud.setCurrentRow()
      }
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedKeys([])
      }
      //this.fetchTreeData();
      this.roleDataId = ""
      ;(this.checkedKeys = []), (this.roleAuthorityNames = [])
    },

    //行选择改变
    handleCurrentChange(row) {
      if (row) {
        this.isVisible = true
        this.roleDataId = row.roleId
        //拥有该功能角色的权限和用户有
        getRoleInfoById(row.roleId)
          .then((response) => {
            if (response.data.code == 0) {
              this.checkedKeys = response.data.data.roleMenuIds
              this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
              this.roleAuthorityNames = response.data.data.userNames
              this.$refs.menuTree.setCheckedKeys(this.checkedKeys)
              this.isVisible = false
            }
          })
          .catch(() => {
            this.$notify({
              type: "error",
              message: "查询功能角色权限和用户失败"
            })
          })
      }
    },

    // 删除记录
    handleDelete(row) {
      this.$confirm("是否确认删除ID为 " + row.roleId + " 功能角色名称为 " + row.roleName + " 的小组?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFunction(row.roleId)
            .then(({ data }) => {
              if (data.code === 0) {
                this.$notify({ type: "success", message: "删除成功" })
                this.getList(this.page)
              } else if (data.code === 1) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "删除失败" })
              }
            })
            .finally(() => {})
        })
        .catch((res) => {})
    },

    // 勾选权限节点
    handleCheckChange(node) {
      this.currentSelectNode = node.id
    },

    //根据角色id,更新功能
    updateRoleFunction() {
      this.menuIds = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys())
      // if (!this.menuIds || this.menuIds.trim() == "" || this.menuIds.trim() == ",") {
      //   this.$message.error("未选择任何功能点，请选择功能点")
      //   return
      // }

      if (this.menuIds.length <= 0) {
        this.$message.error("未选择任何功能点，请选择功能点")
        return
      }

      putRoleFunction({ roleId: this.roleDataId, menuIds: this.menuIds })
        .then((response) => {
          if (response.data.code === 0) {
            this.$notify({ type: "success", message: "更新成功" })
            this.addRoleDialogVisible = false
            this.getList(this.page)
          } else if (response.data.code === 1) {
            this.$notify({ type: "error", message: response.data.msg })
          } else {
            this.$notify({ type: "error", message: "更新失败" })
          }
        })
        .finally(() => {})
    },

    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter((id) => id === item.id))
        }
      }
      return temp
    },
    renderContent(h, { node, data, store }) {
      let ele = (
        <span class="el-row-text" title="">
          {node.label}
        </span>
      )
      ele.data.attrs.title = node.label
      return ele
    }
  }
}
</script>

<style lang="scss">
.roleFunction {
  .maxOver {
    overflow: hidden;
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .fonfirm-btn {
    position: absolute;
    bottom: 0;
    z-index: 5;
    background: #fff;
    width: 80%;
    text-align: right;
  }

  .cus-tree-wrapper {
    position: absolute;
    height: calc(100% - 142px);
    overflow-y: auto;
    margin: 15px 0;
    width: 80%;
    border-top: 1px solid #fafafa;
    border-bottom: 1px solid #fafafa;
  }

  .form div input {
    width: 8rem;
  }

  .submitButton {
    margin: 1rem;
  }

  .role-row-style {
    cursor: pointer;
  }

  .role-wrapper {
    display: flex;

    .role-detail {
      min-height: 450px;
      position: relative;
    }

    .role-detail-1 {
      position: absolute;
      top: 40px;
      left: 0;
      height: calc(100% - 80px);
      width: 100%;
      overflow: hidden;
      padding: 0 30px;
      box-sizing: border-box;
    }
  }
}
</style>
