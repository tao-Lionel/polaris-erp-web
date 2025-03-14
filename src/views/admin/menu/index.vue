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
      <div class="filter-container">
        <el-button-group>
          <el-button type="primary" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加 </el-button>
          <el-button type="primary" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑 </el-button>
          <el-button type="primary" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除 </el-button>
        </el-button-group>
      </div>

      <el-row>
        <el-col :span="8" style="margin-top: 15px">
          <el-tree
            class="filter-tree"
            node-key="id"
            highlight-current
            :data="treeData"
            :default-expanded-keys="aExpandedKeys"
            :filter-node-method="filterNode"
            :props="defaultProps"
            @node-click="getNodeData"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          >
          </el-tree>
        </el-col>
        <el-col :span="16" style="margin-top: 15px">
          <el-card class="box-card">
            <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
              <el-form-item label="父级节点" prop="parentId">
                <el-input v-model="form.parentId" :disabled="true" size="small" placeholder="请输入父级节点"></el-input>
              </el-form-item>
              <el-form-item label="节点ID" prop="menuId" style="display: none">
                <el-input
                  v-model="form.menuId"
                  :disabled="formEdit"
                  size="small"
                  placeholder="请输入节点ID"
                  style="display: none"
                ></el-input>
              </el-form-item>
              <el-form-item label="标题" prop="name">
                <el-input v-model="form.name" :disabled="formEdit" size="small" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="权限标识" prop="permission">
                <el-input
                  v-model="form.permission"
                  :disabled="formEdit"
                  size="small"
                  placeholder="请输入权限标识"
                ></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <el-input v-model="form.icon" :disabled="formEdit" size="small" placeholder="请输入图标"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select
                  class="filter-item"
                  size="small"
                  v-model="form.type"
                  :disabled="formEdit"
                  placeholder="请输入资源请求类型"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item"
                    :label="item | typeFilter"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input
                  type="number"
                  v-model="form.sort"
                  size="small"
                  :disabled="formEdit"
                  placeholder="请输入排序"
                ></el-input>
              </el-form-item>
              <el-form-item label="前端组件" prop="component">
                <el-input
                  v-model="form.component"
                  :disabled="formEdit"
                  size="small"
                  placeholder="请输入描述"
                ></el-input>
              </el-form-item>
              <el-form-item label="前端地址" prop="component">
                <el-input v-model="form.path" :disabled="formEdit" size="small" placeholder="iframe嵌套地址"></el-input>
              </el-form-item>
              <el-form-item label="路由缓冲" prop="component">
                <el-switch v-model="form.keepAlive" :disabled="formEdit" :active-value="'1'" :inactive-value="'0'">
                </el-switch>
              </el-form-item>
              <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary" size="small" @click="update">更新 </el-button>
                <el-button size="small" @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary" size="small" @click="create">保存 </el-button>
                <el-button size="small" @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchTree, getObj, putObj } from "@/api/admin/menu"
import { mapGetters } from "vuex"

export default {
  name: "menu",
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      methodOptions: ["GET", "POST", "PUT", "DELETE"],
      listQuery: {
        name: undefined
      },
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      labelPosition: "right",
      form: {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: undefined,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false
    }
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: "菜单",
        1: "按钮"
      }
      return typeMap[type]
    }
  },
  created() {
    this.getList()
    this.menuManager_btn_add = this.permissions["sys_menu_add"]
    this.menuManager_btn_edit = this.permissions["sys_menu_edit"]
    this.menuManager_btn_del = this.permissions["sys_menu_del"]
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then((response) => {
        this.treeData = response.data.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    nodeExpand(data) {
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys() {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },

    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = "update"
      }
      getObj(data.id).then((response) => {
        this.form = response.data.data
      })
      this.currentId = data.id
      this.showElement = true
    },
    handlerEdit() {
      if (this.form.menuId) {
        this.formEdit = false
        this.formStatus = "update"
      }
    },
    handlerAdd() {
      this.resetForm()
      this.formEdit = false
      this.formStatus = "create"
    },
    handleDelete() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(this.currentId).then(() => {
            this.getList()
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            })
          })
        })
        .catch((res) => {})
    },
    update() {
      //菜单的时候，前端组建和地址都需要有
      if (
        this.form.type == "0" &&
        (typeof this.form.component == "undefined" ||
          typeof this.form.path == "undefined" ||
          this.form.component.trim() == "" ||
          this.form.path.trim() == "")
      ) {
        this.$message.error("类型为菜单的时候需要填写组建和地址!")
        return
      }
      putObj(this.form).then(() => {
        this.getList()
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000
        })
      })
    },
    create() {
      //菜单的时候，前端组建和地址都需要有
      if (
        this.form.type == "0" &&
        (typeof this.form.component == "undefined" ||
          typeof this.form.path == "undefined" ||
          this.form.component.trim() == "" ||
          this.form.path.trim() == "")
      ) {
        this.$message.error("类型为菜单的时候需要填写组建和地址!")
        return
      }
      addObj(this.form).then(() => {
        this.getList()
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        })
      })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ""
    },
    resetForm() {
      this.form = {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: this.currentId,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      }
    }
  }
}
</script>
