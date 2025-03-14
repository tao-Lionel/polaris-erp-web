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
  <div class="execution" id="posupplierskuperiodBox">
    <basic-container>
      <!-- 未使用 -->
      <!-- @row-del="rowDel" -->
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @search-change="searchChange"
        @search-reset="searchReset"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.purchase_posupplierskuperiod_add"
            >新 增</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.purchase_posupplierskuperiod_edit"
            size="small"
            @click="handleEdit"
            >编辑</el-button
          >
          <!-- <el-button type="primary" size="small" @click="showImport">导入采购周期</el-button> -->
        </template>

        <!-- 未使用 -->
        <!-- <template slot-scope="scope"
                  slot="menu">
          
          <el-button type="text"
                     v-if="permissions.purchase_posupplierskuperiod_del"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template> -->

        <template slot="search">
          <el-form @submit.prevent.native :model="formSearch" ref="formSearch" :inline="true" class="demo-form-inline">
            <el-form-item prop="skuCode">
              <avue-crud-input v-model="formSearch.skuCode" size="small" placeholder="SKU"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="skuName">
              <avue-crud-input v-model="formSearch.skuName" size="small" placeholder="产品名称"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <!-- <avue-crud-input
                v-model="formSearch.supplierName"
                @change="modifySupplier"
                size="small"
                placeholder="请输入供应商"
              ></avue-crud-input> -->
              <el-select v-model="formSearch.supplierName" size="small" placeholder="供应商" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot="modelName" slot-scope="scope">
          <span v-if="scope.row.skuLength && scope.row.skuWidth && scope.row.skuHeight">
            {{ scope.row.skuLength }}*{{ scope.row.skuWidth }}*{{ scope.row.skuHeight }}
          </span>
        </template>

        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click.stop="getOperateLog(scope.row)"></i>
        </template>
      </avue-crud>

      <el-dialog
        class="mydialog-add"
        :title="dialogTitle"
        :visible.sync="addOrUpdateDialogVisible"
        width="520px"
        @open="addOrUpdateDialogOpen"
      >
        <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" status-icon>
          <el-form-item
            label="供应商名称:"
            prop="supplierNo"
            :rules="[{ required: true, message: '请选择供应商名称', trigger: 'change' }]"
          >
            <el-select
              size="small"
              v-model.trim="addOrUpdateForm.supplierNo"
              filterable
              remote
              :remote-method="getSupplier"
              :disabled="selectDisabled"
            >
              <el-option
                v-for="item in poSupplierList"
                :key="item.supplierNo"
                :label="item.supplierName"
                :value="item.supplierNo"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="SKU:"
            prop="skuId"
            :rules="[{ required: true, message: '请选择SKU', trigger: 'change' }]"
          >
            <el-select
              size="small"
              v-model="addOrUpdateForm.skuId"
              filterable
              remote
              :remote-method="getSku"
              :disabled="selectDisabled"
            >
              <el-option
                v-for="item in skuFilterList"
                :key="item.skuId"
                :label="item.skuCode"
                :value="item.skuId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="采购周期:"
            prop="period"
            :rules="[
              { required: true, message: '采购周期不能为空' },
              { type: 'number', min: 1, max: 1000, message: '采购周期必须是小于等于1000的正整数', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model.trim.number="addOrUpdateForm.period"
              size="small"
              placeholder="请输人采购周期"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="操作日志" center :visible.sync="operateLogDialogVisible" width="600px">
        <el-table
          ref="operateLogTable"
          border
          :data="operateLogData"
          highlight-current-row
          max-height="400"
          class="dialog_riz"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
          <el-table-column property="logRemark" label="操作内容" width="200" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="createUserName" label="操作人" width="120" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作时间" align="center" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="operateLogDialogVisible = false" size="small">关闭</el-button>
        </span>
      </el-dialog>

      <commonImport
        ref="commonImport"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
      >
      </commonImport>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  getOperateLog,
  importPreview
} from "@/api/purchase/posupplierskuperiod"
import { tableOption } from "@/const/crud/purchase/posupplierskuperiod"
import { mapGetters } from "vuex"
import { fetchList as getSkuList, getByLikeSkuCodeAndAuditOkPage } from "@/api/product/prdsku"
import { getAll as getAllSupplierApi, getSupplierLikeName } from "@/api/supplier/posupplier"
import { deepCloneIgnoreNull, deepClone } from "../../../components/avue/utils/util"
import commonImport from "@/views/cockpit/commonImport"
import { downloadBlob } from "@/util/auth"

export default {
  name: "posupplierskuperiod",
  components: {
    commonImport
  },
  data() {
    return {
      downloadUrl: "/purchase/posupplierskuperiod/purchaseCycleDownload",
      fileSuffix: ".xlsx",
      excelDangerStatus: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      addOrUpdateDialogVisible: false,
      dialogTitle: "",
      poSupplierList: [],
      skuFilterList: [],
      addOrUpdateForm: {
        supplierNo: "",
        period: "",
        skuId: ""
      },
      isAdd: true,
      selectRow: {},
      selectList: [],
      selectDisabled: false,
      formSearch: {
        skuCode: "",
        skuName: "",
        supplierName: ""
      },
      formSearchConfirm: {
        skuCode: "",
        skuName: "",
        supplierName: ""
      },
      // 操作日志相关
      operateLogDialogVisible: false,
      operateLogData: [],
      supplierOptions: []
    }
  },
  created() {
    // getAll().then(({data})=>{
    //   if(data.code===0){
    //     this.poSupplierList = data.data;
    //   }
    // })
    this.getSupplierAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    modifySupplier(val) {
      this.formSearch.supplierName = val.replace(/,/g, " ")
      if (this.formSearch.supplierName.indexOf("BEAUTIFUL") !== -1) {
        this.formSearch.supplierName = this.formSearch.supplierName.replace(".", ".,")
      }
    },
    showImport() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      importPreview(formdata).then(({ data }) => {
        console.log(11111, data)
        if (data.code == 0) {
          this.$refs.commonImport.syncFn()
          this.excelDangerStatus = false
          this.$message.success("导入成功")
          this.getList(this.page)
        } else if (data.code == 1) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("导入失败")
        }
        this.$refs.commonImport.closeFullScreen()
      })
    },

    getSupplier(query) {
      if (query.trim() == "") {
        this.poSupplierList = []
        return
      }
      getSupplierLikeName({ supplierName: query.trim(), isHideLoading: true }).then(({ data }) => {
        if (data.code == 0) {
          this.poSupplierList = data.data
        }
      })
    },
    // 查看操作日志
    getOperateLog(row) {
      getOperateLog(row.supplierNo, row.skuId).then(({ data }) => {
        if (data.code === 0) {
          if (!data.data || data.data.length === 0) {
            this.$notify({ type: "info", message: "查询不到日志记录" })
            return
          } else {
            this.operateLogData = data.data
            this.operateLogDialogVisible = true
          }
        } else {
          this.$notify({ type: "error", message: "查询日志失败" })
          return
        }
      })
    },
    // 改变勾选
    selectionChange(list) {
      this.selectList = list
    },
    addOrUpdateDialogOpen() {
      this.$nextTick(() => {
        this.$refs["addOrUpdateForm"].resetFields()
        if (!this.isAdd) {
          this.addOrUpdateForm = {
            supplierNo: this.selectRow.supplierNo,
            period: this.selectRow.period,
            skuId: this.selectRow.skuId
          }
        }
      })
    },
    addOrUpdateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            addObj(this.addOrUpdateForm).then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$notify({ type: "success", message: "新增成功" })
                this.addOrUpdateDialogVisible = false
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "新增失败" })
              }
            })
          } else {
            putObj(this.addOrUpdateForm).then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$notify({ type: "success", message: "修改成功" })
                this.addOrUpdateDialogVisible = false
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$notify({ type: "error", message: data.msg })
              } else {
                this.$notify({ type: "error", message: "修改失败" })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    getSku(query) {
      if (query && query !== "") {
        // this.skuFilterList=this.skuList.filter(item=>{return item.skuCode.toLowerCase()
        //       .indexOf(query.toLowerCase())>-1})
        getByLikeSkuCodeAndAuditOkPage({ skuCode: query.trim(), isHideLoading: true, codes: 6000 }).then(({ data }) => {
          if (data.code === 0) {
            this.skuFilterList = data.data.records
          }
        })
      }
    },
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
          this.formSearchConfirm
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
      this.selectDisabled = false
      this.isAdd = true
      this.skuFilterList = []
      this.poSupplierList = []
      this.dialogTitle = "新增采购周期"
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
      this.selectDisabled = true
      this.selectRow = this.selectList[0]
      this.poSupplierList = [
        {
          supplierNo: this.selectRow.supplierNo,
          supplierName: this.selectRow.supplierName
        }
      ]
      this.skuFilterList = [
        {
          skuId: this.selectRow.skuId,
          skuCode: this.selectRow.skuCode
        }
      ]
      this.isAdd = false
      this.dialogTitle = "编辑采购周期"
      this.addOrUpdateDialogVisible = true
      //this.$refs.crud.rowEdit(row, index)
    },

    // 未使用
    // handleDel(row, index) {
    //   this.$refs.crud.rowDel(row, index)
    // },
    // rowDel: function(row, index) {
    //   var _this = this
    //   this.$confirm('是否确认删除ID为' + row.supplierNo, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(function() {
    //       return delObj(row.supplierNo)
    //     }).then(data => {
    //     _this.tableData.splice(index, 1)
    //     _this.$message({
    //       showClose: true,
    //       message: '删除成功',
    //       type: 'success'
    //     })
    //     this.getList(this.page)
    //   }).catch(function(err) { })
    // },

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
      this.formSearchConfirm = deepCloneIgnoreNull(this.formSearch)
      this.getList(this.page)
    },
    // 搜索
    searchChange(params, page) {
      this.formSearchConfirm = deepCloneIgnoreNull(this.formSearch)
      this.getList(page, params)
    },
    // 页大小回调
    sizeChange(size) {
      this.$refs.crud.selectClear()
      this.page.pageSize = size
    },
    // 搜索条件重置
    searchReset() {
      this.$refs["formSearch"].resetFields()
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
#posupplierskuperiodBox {
  .mydialog-add .el-form-item__label {
    width: 124px;
  }
  .dialog_riz {
    th {
      word-break: break-word;
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
    }
  }
}
</style>
