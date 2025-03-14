<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
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
  - Author: wangxiaowen (AukeyIT@aukeys.com) 
  node-key="categoryId"
  
  -->

<template>
  <div class="execution" id="prdskucategory">
    <!-- <basic-container> -->
    <el-row :span="24">
      <el-col :xs="24" :sm="24" :md="5" class="user__tree">
        <el-tree
          lazy
          highlight-current
          node-key="categoryId"
          ref="eventCategoryTree"
          :props="categoryOption"
          :load="loadCategory"
          :data="categoryCacheData"
          @node-click="nodeClick"
          :render-content="renderContent"
        ></el-tree>
        <!-- <avue-tree :option="treeOption" :data="treeCategoryData" @node-click="nodeClick"></avue-tree> -->
      </el-col>
      <el-col :xs="24" :sm="24" :md="19" class="user__main">
        <avue-crud
          ref="crud"
          v-model="form"
          :page="page"
          :data="tableData"
          :option="tableOption"
          :before-open="handleOpenBefore"
          :before-close="beforeOpen"
          @search-change="handleFilter"
          @selection-change="selectionChange"
          @on-load="getList"
          @refresh-change="refreshChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel"
          @search-reset="searchReset"
        >
          <template slot="menuLeft">
            <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.product_prdskucategory_add"
              >新 增</el-button
            >
          </template>
          <template slot="search">
            <el-form :model="searchForm" ref="searchFormRef" :inline="true">
              <el-form-item prop="categoryCode">
                <el-input
                  v-model="searchForm.categoryCode"
                  placeholder="品类代码"
                  clearable
                  v-search-input
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item prop="categoryName">
                <el-input
                  v-model="searchForm.categoryName"
                  placeholder="品类名称"
                  clearable
                  v-search-input
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>

          <template slot-scope="scope" slot="operation">
            <i
              class="icon-bianji y-icon-edit"
              @click="handleEdit(scope.row, scope.index)"
              v-if="scope.row.delFlag === '0' && permissions.product_prdskucategory_edit"
            ></i>
            <i
              class="icon-shanchu y-icon-delect"
              @click="handleDel(scope.row, scope.index)"
              v-if="scope.row.delFlag === '0' && permissions.product_prdskucategory_del"
            ></i>
          </template>
          <!-- slot-scope="scope" -->
          <template slot="categoryPidNameForm" slot-scope="scope">
            <avue-crud-input v-model="checkCp.categoryPidName" size="small" :disabled="true"></avue-crud-input>
          </template>
        </avue-crud>
      </el-col>
    </el-row>

    <!--新增-->
    <div>
      <el-dialog :title="categoryDialogTitle" :visible.sync="categoryDialog" width="660px" @close="clearData" center>
        <el-form
          class="my-from"
          ref="categoryForm"
          :model="categoryForm"
          label-position="right"
          size="small"
          status-icon
          :rules="categoryRules"
        >
          <el-form-item label="品类代码:" prop="categoryCode">
            <el-input v-model.trim="categoryForm.categoryCode" size="small" :maxlength="15" onlyTrim></el-input>
          </el-form-item>

          <el-form-item label="品类名称:" prop="categoryName">
            <el-input
              v-model.trim="categoryForm.categoryName"
              size="small"
              maxlength="30"
              v-search-input-trim
            ></el-input>
          </el-form-item>

          <el-form-item label="选中节点:" prop="selectNodeName">
            <el-input v-model="categoryForm.selectNodeName" size="small" disabled></el-input>
          </el-form-item>

          <el-form-item label="层级关系:" prop="levelType">
            <el-radio-group v-model="categoryForm.levelType">
              <el-radio label="1">同级</el-radio>
              <el-radio label="2">子级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="categoryDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('categoryForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- </basic-container> -->
  </div>
</template>

<script>
import {
  fetchList,
  fetchTreeList,
  fetchTreeListByPid,
  getObj,
  addObj,
  putObj,
  delObj,
  getDetail,
  checkCategoryNoRelation,
  addRootNode
} from "@/api/product/prdskucategory"
import { tableOption } from "@/const/crud/product/prdskucategory"
import { mapGetters } from "vuex"
export default {
  name: "prdskucategory",
  data() {
    return {
      categoryRules: {
        categoryCode: [
          { required: true, message: "请输入品类代码", trigger: "blur" },
          { max: 15, message: "最大长度15个字符", trigger: "blur" },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: "不允许输入中文", trigger: "blur" }
        ],
        categoryName: [{ required: true, message: "请输入品类名称", trigger: "blur" }]
      },
      categoryOption: {
        label: "categoryName",
        children: "children",
        isLeaf: "leaf"
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      form: {},
      treeCategoryData: [],
      defaultProps: {
        label: "name",
        value: "id"
      },
      categoryCacheData: [],

      //表单
      categoryDialogTitle: "",
      categoryDialog: false,
      categoryForm: {
        categoryCode: "",
        categoryName: "",
        levelType: "1"
      },
      checkCp: {},
      currentTreeNodeData: {},
      triggerCurrenNode: {},
      categoryTree: {},
      searchForm: {
        categoryCode: "",
        categoryName: ""
      }
    }
  },
  created() {},
  mounted: function () {
    // console.log(this.tableOption);
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {},
  methods: {
    // validateCN (rule, value, callback) {
    //   const pattern = new RegExp("[\\u4e00-\\u9fa5]+")
    //   if (pattern.test(value)) {
    //     callback()
    //   } else {
    //     callback(new Error('品类代码不允许输入中文'))
    //   }
    // },
    loadCategory(node, resolve) {
      //第一层父节点默认值，与数据库对应
      let pid = -1
      if (node.level > 0) {
        pid = node.data.categoryId
      }
      fetchTreeListByPid(pid).then((response) => {
        resolve(response.data.data)
        if (pid === -1) {
          if (this.categoryCacheData) {
            this.categoryCacheData = this.categoryCacheData.concat(response.data.data)
          }
        }
      })
    },
    nodeClick(data, node, tree) {
      this.currentTreeNodeData = data
      this.triggerCurrenNode = node
      this.categoryTree = tree
      this.checkCp = {
        categoryPidName: data.categoryName,
        categoryPid: data.categoryId
      }
      this.getList(this.page, { categoryId: data.categoryId })
    },
    handleFilter(param) {
      this.page.currentPage = 1
      this.getList(this.page, param)
    },
    /** 刷新回调 */
    refreshChange(obj) {
      this.getList(this.page, obj.searchForm)
    },
    selectionChange(selectedList) {},
    getList(page, params) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.searchForm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      show()
    },
    beforeOpen(done, type) {},
    clearData() {
      this.categoryForm = {
        categoryId: null,
        categoryCode: "",
        categoryName: "",
        levelType: "1",
        categoryPid: null
      }
      if (this.$refs["categoryForm"]) {
        this.$refs["categoryForm"].resetFields()
      }
      if (this.$refs["rootOrEditForm"]) {
        this.$refs["rootOrEditForm"].resetFields()
      }
    },
    /** 打开新增窗口 **/
    handleAdd: function () {
      // if (!this.checkCp || !this.checkCp.categoryPid) {
      // this.$message.warning("请选择一个节点");
      // return;
      //新增根节点
      // this.rootOrEditDialog = true;
      // this.rootOrEditDialogTitle = "新增根类目";
      //新增根类目
      //   this.$refs.crud.rowAdd()
      // } else {
      //新增 同级或子级类目
      this.categoryForm.levelType = "1"
      this.categoryForm.selectNodeName = this.checkCp.categoryPidName
      this.categoryDialog = true
      this.categoryDialogTitle = "新增"
      // }
    },
    submitForm: function (formName) {
      //确定提交
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          //新增保存
          this.categoryForm = Object.assign(this.categoryForm, this.checkCp)
          let _this = this
          getDetail(this.categoryForm).then((data) => {
            const res = data.data.data.data
            if (res == "dulicateErr") {
              debugger
              this.$message.warning("品类代码不可重复")
              return false
            } else if (res == "treeFail") {
              this.$message.warning("父级品类不可选择自己或子级")
            } else {
              addObj(this.categoryForm).then((data) => {
                if (data.data.code == 0) {
                  _this.$message.success("新增成功")
                  var data = data.data.data
                  if (data.categoryPid === -1) {
                    //根节点
                    _this.categoryCacheData.push(data)
                  } else {
                    if (_this.categoryForm.levelType == "1") {
                      //添加同级
                      var parentNode = _this.$refs.eventCategoryTree.getNode({
                        categoryId: data.categoryPid
                      })
                      _this.$refs.eventCategoryTree.insertAfter(data, _this.currentTreeNodeData)
                    } else {
                      //添加子级
                      _this.$refs.eventCategoryTree.append(data, _this.currentTreeNodeData)
                    }
                  }
                  _this.getList(_this.page)
                  _this.categoryDialog = false
                } else if (data.data.code == 1) {
                  this.$message.error(data.data.msg)
                  return
                } else {
                  this.$message.error("新增失败")
                  return
                }
              })
            }
          })
        }
      })
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    /** 数据更新 */
    handleUpdate: function (row, index, done, cancel) {
      getDetail(row).then((data) => {
        const res = data.data.data.data
        if (res == "dulicateErr") {
          this.$message.warning("品类代码不可重复")
          cancel()
        } else if (res == "treeFail") {
          this.$message.warning("父级品类不可选择自己或子级")
          cancel()
        } else {
          row.categoryName = row.categoryName.replace(/(^\s*)|(\s*$)/g, "")
          putObj(row).then((data) => {
            if (data.data.code == 0) {
              this.currentTreeNodeData.categoryName = row.categoryName
              this.tableData.splice(index, 1, Object.assign({}, row))
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              })
              done()
              this.getList(this.page)
              // this.init();
            } else if (data.data.code == 1) {
              this.$message.error(data.data.msg)
              cancel()
              return
            } else {
              this.$message.error("修改失败")
              cancel()
              return
            }
          })
        }
      })
    },
    /** 数据添加 **/
    handleSave: function (row, done, cancel) {
      row.categoryPid = this.checkCp.categoryPid
      let _this = this
      getDetail(row).then((data) => {
        const res = data.data.data.data
        if (res == "dulicateErr") {
          this.$message.warning("品类代码不可重复")
          cancel()
        } else if (res == "treeFail") {
          this.$message.warning("父级品类不可选择自己或子级")
          cancel()
        } else {
          addRootNode(row).then((data) => {
            this.$message.success("添加成功")
            var data = data.data.data
            if (data.categoryPid === -1) {
              //根节点
              _this.categoryCacheData.push(data)
            }
            done()
            _this.getList(_this.page)

            //手动添加节点
            // _this.categoryTree.tree.append(data, _this.currentTreeNodeData); insertAfter
            // if (_this.currentTreeNodeData.categoryId) {
            //   //添加子级
            //   _this.$refs.eventCategoryTree.append(data, _this.currentTreeNodeData );
            // } else {
            //   //添加根目录
            //   var root = _this.$refs.eventCategoryTree.getNode({
            //     categoryPid: -1
            //   });
            //   _this.$refs.eventCategoryTree.insertAfter( data, _this.currentTreeNodeData );
            // }
          })
        }
      })
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.categoryId)
        })
        .then((data) => {
          if (data.data.data == "delOfUse") {
            _this.$message.error("该品类下有子类或已被SKU使用")
          } else {
            if (data.data.code == 0) {
              _this.$message.success("删除成功")
              _this.tableData.splice(index, 1)
              _this.$refs.eventCategoryTree.remove(row)
              //清空选中节点
              _this.checkCp = {}
              this.getList(this.page)
              this.init()
            } else if (data.data.code == 1) {
              this.$message.error(data.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }
          }
        })
        .catch(function (err) {})
    },

    renderContent(h, { node, data, store }) {
      let ele = (
        <span class="el-row-text" title="">
          {node.label}
        </span>
      )
      ele.data.attrs.title = node.label
      return ele
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields()
    }
  }
}
</script>

<style lang="scss">
#prdskucategory {
  .user__tree {
    height: 75vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .user__main {
    padding-left: 20px;
  }

  .my-from {
    .el-form-item__label {
      width: 100px;
    }
  }
}
</style>
