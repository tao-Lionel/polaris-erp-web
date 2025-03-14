<template>
  <basic-container>
    <el-row>
      <!-- <el-col :xs="24" :sm="24" :md="5">
        <avue-tree></avue-tree>
      </el-col> -->
      <!-- <el-col :span="8" style='margin-top:15px'> -->
      <el-col :xs="24" :sm="24" :md="5">
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          @node-click="getNodeData"
          default-expand-all
        >
        </el-tree>
      </el-col>
      <!-- </el-col> -->
      <el-col :xs="24" :sm="24" :md="19">
        <div style="padding: 0 10px">
          <div style="float: left">
            <el-button size="mini" type="primary" @click="handleCreatePloyee">+ 新建员工</el-button>
            <el-button size="mini" type="primary" @click="handleRelevantFunctionRole">关联功能角色</el-button>
            <el-button size="mini" type="primary" @click="handleRelevantDataRole">关联数据角色</el-button>
            <!-- <el-button size="mini" type="primary" @click="handleAuthorizedCategory">授权品类</el-button>
            <el-button size="mini" type="primary" @click="handleAuthorizedShop">授权店铺</el-button>
            <el-button size="mini" type="primary" @click="handleAuthorizedWarehouse">授权仓库</el-button>
            <el-button size="mini" type="text" @click="handleBatchImport">批量导入</el-button> -->
          </div>
          <div style="float: right">
            <el-button size="mini" type="primary" @click="handleLogin">登录</el-button>
            <el-button size="mini" type="primary" @click="handleEnable">启用</el-button>
            <el-button size="mini" type="primary" @click="handleDisable">禁用</el-button>
          </div>
        </div>
        <avue-crud
          :option="option"
          ref="crud"
          v-model="form"
          :page="page"
          @on-load="getList"
          :table-loading="listLoading"
          @search-change="handleFilter"
          @refresh-change="handleRefreshChange"
          @row-update="update"
          @row-save="create"
          :before-open="handleOpenBefore"
          :data="list"
        >
          <template slot="menuLeft">
            <el-form :model="formInline" ref="formInline" :inline="true" class="demo-form-inline">
              <el-form-item label="用户账号">
                <el-input v-model="formInline.userAccount" size="mini" placeholder="请输入账号"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="formInline.name" size="mini" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="formInline.status" size="mini" placeholder="选择启用状态">
                  <el-option label="已启用" value="1"></el-option>
                  <el-option label="已禁用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm('formInline')" type="primary" size="mini">重置</el-button>
                <el-button @click="submitForm('formInline')" type="primary" size="mini">搜索</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button @click="handleUpdate(scope.row, scope.index)" size="small" type="text" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button @click="handleDelete(scope.row, scope.index)" size="small" type="text" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </avue-crud>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getRecord, fetchList } from "@/api/adminUser/adminPloyee"
import { tableOption } from "@/const/crud/adminUser/adminPloyee"
import { deptRoleList } from "@/api/admin/role"
import { fetchDeptTree } from "@/api/admin/dept"
import { mapGetters } from "vuex"
import { Object } from "tcomb"

export default {
  data() {
    return {
      treeOption: {
        nodeKey: "id",
        addBtn: false,
        menu: false,
        props: {
          label: "name",
          value: "id"
        }
      },
      treeData: [],
      option: tableOption,
      list: [],
      listLoading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序
      },
      form: {},
      formInline: {
        userAccount: "",
        name: "",
        status: ""
      }
    }
  },

  computed: {
    ...mapGetters(["permissions"])
  },

  watch: {
    role() {
      this.form.role = this.role
    }
  },

  created() {},

  mounted() {
    console.log(this.option)
  },

  methods: {
    init() {
      fetchDeptTree().then((response) => {
        this.treeData = response.data.data
      })
    },
    getNodeData(data) {
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data
      })
    },
    handleDept() {
      fetchDeptTree().then((response) => {
        this.treeDeptData = response.data.data
      })
    },

    // 新建员工
    handleCreatePloyee() {
      this.$refs.crud.rowAdd()
    },
    // 关联功能角色
    handleRelevantFunctionRole() {
      alert("关联功能角色")
    },
    // 关联数据角色
    handleRelevantDataRole() {
      alert("关联数据角色")
    },
    // // 授权品类
    // handleAuthorizedCategory(){
    //   alert('授权品类')
    // },
    // // 授权店铺
    // handleAuthorizedShop(){
    //   alert('授权店铺')
    // },
    // // 授权仓库
    // handleAuthorizedWarehouse(){
    //   alert('授权仓库')
    // },
    // 批量导入
    handleBatchImport() {
      alert("批量导入")
    },
    // 登录
    handleLogin() {
      alert("登录")
    },
    // 启动
    handleEnable() {
      alert("启用")
    },
    // 禁用
    handleDisable() {
      alert("禁用")
    },
    // 查询
    search(data) {
      alert("查询")
    },
    // 提交表单(搜索栏)
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("提交!")
        } else {
          console.log("提交错误!!")
          return false
        }
      })
    },
    // 重置表单(搜索栏)
    resetForm(formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
      // alert('重置表单')
    },
    // 创建
    create(row, done, loading) {
      addObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          })
        })
        .catch(() => {
          loading()
        })
    },
    nodeClick(data) {
      // this.page.page = 1;
      // this.getList(this.page, {deptId: data.id});
      console.log(data)
    },
    // getList(page, params) {
    //   this.listLoading = false;
    //   // fetchList(Object.assign({ current: page.currentPage, size: page.pageSize}, params)).then(response => {
    //   //   this.list = response.data.data.records;
    //   //   this.page.total = response.data.data.total
    //   //   this.listLoading = false;
    //   // });
    //   fetchList(Object.assign({current:page.currentPage, size:page.pageSize}, params)).then((response)=>{
    //     console.log(response)
    //   });
    // },
    getList(page, params) {
      this.listLoading = true
      fetchList(params).then((response) => {
        console.log(response)
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      // this.handleDept();
      // if (['edit', 'views'].includes(type)) {
      //   this.role = [];
      //   for (var i = 0; i < this.form.roleList.length; i++) {
      //     this.role[i] = this.form.roleList[i].roleId;
      //   }
      //   deptRoleList().then(response => {
      //     this.rolesOptions = response.data.data;
      //   });
      // } else if (type === 'add') {
      //   this.role = [];
      // }
      // show();
      console.log(show)
    },
    // 更新
    update(row, index, done, loading) {
      putObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
        })
        .catch(() => {
          loading()
        })
    },
    // 刷新
    handleRefreshChange() {
      // this.getList(this.page)
    },
    handleFilter(param) {
      // this.page.page = 1;
      // this.getList(this.page, param);
    }
  }
}
</script>
