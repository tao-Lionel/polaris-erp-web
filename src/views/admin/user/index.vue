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
  <div class="user">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"></avue-tree>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19" class="user__main">
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
              <el-button
                v-if="sys_user_add"
                class="filter-item"
                @click="handleCreate"
                size="small"
                type="primary"
                icon="el-icon-edit"
                >添加
              </el-button>
            </template>
            <template slot="username" slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
            <template slot="displayname" slot-scope="scope">
              <span>{{ scope.row.displayname }}</span>
            </template>
            <template slot="role" slot-scope="scope">
              <span v-for="(role, index) in scope.row.roleList" :key="index">
                <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template slot="deptId" slot-scope="scope">
              {{ scope.row.deptName }}
            </template>
            <template slot="lockFlag" slot-scope="scope">
              <el-tag>{{ scope.label }}</el-tag>
            </template>
            <template slot="operate" slot-scope="scope">
              <el-button
                v-if="sys_user_edit"
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row, scope.index)"
                >编辑
              </el-button>
              <el-button
                v-if="sys_user_del"
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="deletes(scope.row, scope.index)"
                >删除
              </el-button>
              <el-button
                v-if="sys_user_rep"
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="handleLogin(scope.row, scope.index)"
                >代登录
              </el-button>
            </template>
            <template slot="deptIdForm">
              <avue-crud-input
                v-model="form.deptId"
                type="tree"
                placeholder="请选择所属部门"
                :node-click="getNodeData"
                :dic="treeDeptData"
                :props="defaultProps"
              ></avue-crud-input>
            </template>
            <template slot="roleForm">
              <avue-crud-select
                v-model="role"
                multiple
                placeholder="请选择角色"
                :dic="rolesOptions"
                :props="roleProps"
              ></avue-crud-select>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, getObj, putObj, getPassCode } from "@/api/admin/user"
import { deptRoleList } from "@/api/admin/role"
import { fetchDeptTree } from "@/api/admin/dept"
import { tableOption } from "@/const/crud/admin/user"
import { mapGetters } from "vuex"
import { constants } from "fs"
import { connect } from "tls"

export default {
  name: "table_user",
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
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: "roleName",
        value: "roleId"
      },
      defaultProps: {
        label: "name",
        value: "id"
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false //是否倒序
      },
      list: [],
      listLoading: true,
      role: [],
      form: {},
      rolesOptions: []
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
  created() {
    this.sys_user_add = this.permissions["sys_user_add"]
    this.sys_user_edit = this.permissions["sys_user_edit"]
    this.sys_user_del = this.permissions["sys_user_del"]
    this.sys_user_rep = this.permissions["sys_user_rep"]
    this.init()
  },
  methods: {
    init() {
      fetchDeptTree().then((response) => {
        this.treeData = response.data.data
      })
    },
    nodeClick(data) {
      this.page.page = 1
      this.getList(this.page, { deptId: data.id })
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then((response) => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
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
    handleFilter(param) {
      this.page.page = 1
      this.getList(this.page, param)
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    handleCreate() {
      this.$refs.crud.rowAdd()
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      this.handleDept()
      if (["edit", "views"].includes(type)) {
        this.role = []
        for (var i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId
        }
        deptRoleList().then((response) => {
          this.rolesOptions = response.data.data
        })
      } else if (type === "add") {
        this.role = []
      }
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
    },
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
    deletes(row, index) {
      this.$confirm("此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(row.userId)
            .then(() => {
              this.list.splice(index, 1)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
            })
            .cache(() => {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 2000
              })
            })
        })
        .catch((res) => {})
    },
    handleLogin(row, index) {
      this.$confirm("确定要代登录该用户(用户名:" + row.username + "), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //后台获取密码和验证码
          getPassCode().then((response) => {
            this.$store.dispatch("LogOut").then(() => {
              this.listLoading = false
              //代登录
              this.$store
                .dispatch("LoginByUsername", {
                  username: row.username,
                  password: response.data.data,
                  code: response.data.data,
                  randomStr: response.data.data
                })
                .then(() => {
                  window.location.href = window.location.origin
                })
            })
          })
        })
        .catch((res) => {})
    }
  }
}
</script>
<style lang="scss">
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
