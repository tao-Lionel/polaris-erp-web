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
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <div class="posettleaccounttype" id="posettleaccounttype">
    <basic-container>
      <avue-crud
        ref="crud"
        class="handle-cell-hidden"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @selection-change="selectionChange"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.purchase_posettleaccounttype_add"
            >新 增</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.purchase_posettleaccounttype_edit"
            size="small"
            @click="handleEdit()"
            >编辑</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.purchase_posettleaccounttype_del"
            size="small"
            @click="handleDel()"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="modifyState(0)"
            v-if="permissions.purchase_posettleaccounttype_enable"
            >启用</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="modifyState(1)"
            v-if="permissions.purchase_posettleaccounttype_unable"
            >禁用</el-button
          >
        </template>
        <!-- <template slot="menuRight">
          <el-button type="primary"                    
                     size="small"
                     v-if="permissions.purchase_posettleaccounttype_export">导出</el-button> 
        </template> -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="settleaccountName">
              <avue-crud-input
                v-model.trim="searchForm.settleaccountName"
                size="small"
                placeholder="结算方式"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="状态" clearable>
                <el-option label="启用中" value="0"></el-option>
                <el-option label="禁用中" value="1"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item prop="supplierNo" label="供应商">
              <el-select v-model="searchForm.supplierNo" size="small" filterable clearable>
                <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot="status" slot-scope="scope">
          <!-- status -->
          <el-tag size="small" :type="scope.row.status === 1 ? 'danger' : 'success'">{{
            handleStatus(scope.row.status)
          }}</el-tag>
        </template>
      </avue-crud>

      <el-dialog
        :title="dialogTitle"
        center
        :visible.sync="addOrUpdateDialogVisible"
        width="520px"
        @open="addOrUpdateDialogOpen"
      >
        <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" inline :rules="addOrUpdateFormRules" status-icon>
          <!-- <el-form-item label="供应商：" prop="supplierNo">
            <el-select v-model="addOrUpdateForm.supplierNo" size="small" filterable clearable>
              <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="结算方式名称:" prop="settleaccountName">
            <el-input
              style="width: 100%"
              size="small"
              v-model.trim="addOrUpdateForm.settleaccountName"
              placeholder="不得超过50个字符"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="预付:" prop="prepay">
            <el-input
              class="dialog-account-input"
              size="small"
              v-model.trim.number="addOrUpdateForm.prepay"
              placeholder=""
              maxlength="3"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <!-- <span style="line-height:38px">%</span> -->
          <el-form-item label="尾款:" prop="willPay">
            <el-input
              class="dialog-account-input"
              size="small"
              v-model.trim.number="addOrUpdateForm.willPay"
              placeholder=""
              maxlength="3"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <!-- <span style="line-height:38px">%</span> -->
          <el-form-item label="账期天数:" prop="accountDays">
            <el-input
              class="dialog-account-input"
              v-model.trim.number="addOrUpdateForm.accountDays"
              size="small"
              placeholder=""
              maxlength="4"
            >
              <template slot="append">d</template>
            </el-input>
          </el-form-item>
          <!-- <span style="line-height:38px">d</span> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  delBatchObj,
  modifyStateByIds,
  checkUsedByPurchaseOrder
} from "@/api/purchase/posettleaccounttype"
import { tableOption } from "@/const/crud/purchase/posettleaccounttype"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "posettleaccounttype",
  data() {
    var validatePrepay = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("预付不能为空"))
      } else if (value % 1 !== 0) {
        callback(new Error("预付只能为整数"))
      } else if (this.addOrUpdateForm.willPay) {
        if (this.addOrUpdateForm.willPay + value != 100) {
          callback(new Error("预付+尾款 不等于100"))
        }
      }
      callback()
    }

    var validateWillPay = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("尾款不能为空"))
      } else if (value % 1 !== 0) {
        callback(new Error("尾款只能为整数"))
      } else if (this.addOrUpdateForm.prepay) {
        this.$refs.addOrUpdateForm.validateField("prepay")
      }
      callback()
    }

    var validateAccount = (rule, value, callback) => {
      if (value % 1 !== 0) {
        callback(new Error("账期天数只能为整数"))
      }
      callback()
    }

    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        settleaccountName: "",
        status: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      selectList: [],
      // 新增或删除结算方式数据
      dialogTitle: "",
      addOrUpdateDialogVisible: false,
      selectRow: {},
      supplierOptions: [],
      isAdd: true,
      addOrUpdateForm: {
        settleaccountName: "",
        prepay: null,
        willPay: null,
        accountDays: "",
        status: 0
        // supplierNo: ''
      },
      addOrUpdateFormRules: {
        settleaccountName: [
          { required: true, message: "结算方式名称不能为空", trigger: "blur" },
          { max: 50, message: "结算方式名称不得超过50个字符", trigger: "blur" }
        ],
        prepay: [
          { required: true, message: "预付不能为空", trigger: "blur" },
          { type: "number", min: 0, max: 100, message: "预付是0-100的整数", trigger: "blur" },
          { validator: validatePrepay, trigger: "blur" }
        ],
        willPay: [
          { required: true, message: "尾款不能为空", trigger: "blur" },
          { type: "number", min: 0, max: 100, message: "账期是0-100的整数", trigger: "blur" },
          { validator: validateWillPay, trigger: "blur" }
        ],
        accountDays: [
          { required: true, message: "账期天数不能为空", trigger: "blur" },
          { type: "number", min: 0, max: 1000, message: "账期天数需要是0-1000的整数", trigger: "blur" },
          { validator: validateAccount, trigger: "blur" }
        ]
        // supplierNo: [
        //   { required: true, message: '供应商不能为空', trigger: 'blur' },
        // ]
      }
    }
  },
  created() {
    this.init()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      //获取供应商
      getAllSupplier().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.supplierOptions.push({
              value: item.supplierNo,
              label: item.supplierName
            })
          })
          console.log("供应商", res.data.data)
        }
      })
    },
    handleStatus(val) {
      const obj = {
        0: "启用中",
        1: "禁用中"
      }
      return obj[val]
    },
    // 禁用or启用
    modifyState(state) {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      let error = false
      let settleaccountTypeIds = []
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status == state) {
          error = true
          if (state == 0) {
            this.$message.error("存在已经是启用中的数据")
          }
          if (state == 1) {
            this.$message.error("存在已经是禁用中的数据")
          }
          return false
        }
        settleaccountTypeIds.push(this.selectList[i].settleaccountTypeId)
      }
      modifyStateByIds({ settleaccountTypeIds: settleaccountTypeIds.join(","), state: state + "" }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          if (state == 0) {
            this.$message({ type: "success", message: "启用成功" })
          } else {
            this.$message({ type: "success", message: "禁用成功" })
          }
          this.getList(this.page)
        } else if (data.code === 1 && data.msg) {
          this.$message({ type: "error", message: data.msg })
        } else {
          this.$message({ type: "error", message: "操作失败" })
        }
      })
    },
    // 改变勾选条件
    selectionChange(list) {
      this.selectList = list
    },
    // 打开新增或删除表单事件
    addOrUpdateDialogOpen() {
      this.$nextTick(() => {
        this.$refs["addOrUpdateForm"].resetFields()
        if (!this.isAdd) {
          this.addOrUpdateForm = {
            settleaccountTypeId: this.selectRow.settleaccountTypeId,
            settleaccountName: this.selectRow.settleaccountName,
            prepay: this.selectRow.prepay,
            willPay: this.selectRow.willPay,
            accountDays: this.selectRow.accountDays
          }
        }
      })
    },
    // 提交新增或者编辑表单
    addOrUpdateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.addOrUpdateForm.status = 0
            addObj(this.addOrUpdateForm).then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$message({ type: "success", message: "新增成功" })
                this.addOrUpdateDialogVisible = false
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$message({ type: "error", message: data.msg })
              } else {
                this.$message({ type: "error", message: "新增失败" })
              }
            })
          } else {
            putObj(this.addOrUpdateForm).then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$message({ type: "success", message: "修改成功" })
                this.addOrUpdateDialogVisible = false
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$message({ type: "error", message: data.msg })
              } else {
                this.$message({ type: "error", message: "修改失败" })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 关闭弹框事件
    addOrUpdateDialogClose() {},
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.isAdd = true
      this.dialogTitle = "新建结算方式"
      this.addOrUpdateDialogVisible = true
      //this.$refs.crud.rowAdd()
    },
    handleEdit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      this.selectRow = this.selectList[0]
      var settleaccountTypeId = this.selectRow.settleaccountTypeId
      checkUsedByPurchaseOrder({ settleaccountTypeIds: settleaccountTypeId }).then(({ data }) => {
        if (data.code == 0) {
          this.isAdd = false
          this.dialogTitle = "编辑结算方式"
          this.addOrUpdateDialogVisible = true
        } else if (data.code == 1 && data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("查询结算方式是否被采购订单使用失败，请稍后再试")
        }
      })

      //this.$refs.crud.rowEdit(row, index)
    },
    handleDel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message({ type: "error", message: "请勾选数据" })
        return
      }
      var settleaccountTypeIds = []
      for (var i = 0; i < this.selectList.length; i++) {
        settleaccountTypeIds.push(this.selectList[i].settleaccountTypeId)
      }
      checkUsedByPurchaseOrder({ settleaccountTypeIds: settleaccountTypeIds.join(",") }).then(({ data }) => {
        if (data.code == 0) {
          this.$confirm("是否确认删除?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              delBatchObj({ settleaccountTypeIds: settleaccountTypeIds.join(",") }).then(({ data }) => {
                if (data.code === 0) {
                  this.$refs.crud.selectClear()
                  this.$message({ type: "success", message: "删除成功" })
                  this.page.currentPage = 1
                  this.getList(this.page)
                } else if (data.code === 1 && data.msg) {
                  this.$message({ type: "error", message: data.msg })
                } else {
                  this.$message({ type: "error", message: "删除失败" })
                }
              })
            })
            .catch((res) => {})
        } else if (data.code == 1 && data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("查询结算方式是否被采购订单使用失败，请稍后再试")
        }
      })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.settleaccountTypeId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.settleaccountTypeId)
        })
        .then((data) => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          this.getList(this.page)
        })
        .catch(function (err) {})
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row).then((data) => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      addObj(row).then((data) => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.$refs.crud.selectClear()
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      this.searchForm.status = ""
      console.info(this.searchForm)
    },
    // 页大小回调
    sizeChange(val) {
      this.$refs.crud.selectClear()
      this.page.pageSize = val
    }
  }
}
</script>

<style lang="scss">
#posettleaccounttype {
  .el-dialog__body .el-form-item__label {
    width: 140px;
  }

  .dialog-account-input {
    width: 100%;
  }
}
</style>
