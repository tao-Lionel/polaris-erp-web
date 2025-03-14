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
  <div class="execution" id="wmsstocklocation">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" v-if="permissions.baseSetup_wmsstocklocation_add" @click="handleAdd" size="small"
            >新 增</el-button
          >
          <el-button type="primary" v-if="permissions.baseSetup_wmsstocklocation_edit" @click="handleEdit" size="small"
            >修改</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_wmsstocklocation_audit"
            @click="handleAudit"
            size="small"
            >审核</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_wmsstocklocation_enable"
            @click="handleEnable(0)"
            size="small"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_wmsstocklocation_prohibit"
            @click="handleEnable(1)"
            size="small"
            >禁用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_wmsstocklocation_export"
            @click="handleExport()"
            size="small"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="warehouseIds">
              <el-select
                v-model="searchForm.warehouseIds"
                size="small"
                filterable
                placeholder="仓库,多选"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in queryWarehouseList"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="approveStatus">
              <el-select v-model="searchForm.approveStatus" size="small" clearable filterable placeholder="状态">
                <el-option
                  v-for="item in approveStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="delFlag">
              <el-select v-model="searchForm.delFlag" size="small" clearable filterable placeholder="启用/禁用">
                <el-option v-for="item in delFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.stockLocationId)"></i>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form
            ref="addOrUpdateForm"
            :model="addOrUpdateForm"
            label-position="right"
            :rules="addOrUpdateRules"
            size="small"
            status-icon
          >
            <el-form-item label="仓库:" prop="warehouseName">
              <el-select
                v-model="addOrUpdateForm.warehouseName"
                popper-class="y-form-select"
                filterable
                remote
                placement="top-start"
                size="mini"
                reserve-keyword
                placeholder="请检索输入"
                :remote-method="fetchSuggestions"
                :loading="loadingSkuQuery"
                @change="handleSelectSkuCode"
                :disabled="addOrUpdateDisabled"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="库位:" prop="locationCode">
              <el-input
                v-model="addOrUpdateForm.locationCode"
                size="small"
                maxlength="20"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 审核 -->
      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="30%">
        <!-- :before-close="handleClose"> -->
        <!-- <el-radio v-model="auditType" label="1">同意</el-radio>
        <el-radio v-model="auditType" label="2">拒绝</el-radio> -->
        <el-input
          type="textarea"
          :rows="5"
          :maxlength="100"
          placeholder="请填写拒绝原因，不得超过100个字符。拒绝，必填"
          v-model="auditTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleAuditSave">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  handleSaveOrUpdate,
  stateModify,
  handleAudit
} from "@/api/baseSetup/wmsstocklocation/wmsstocklocation"
import { tableOption, addOrUpdateRules } from "@/const/crud/baseSetup/wmsstocklocation/wmsstocklocation"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken } from "@/util/auth"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "wmsstocklocation",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        warehouseIds: [],
        approveStatus: "",
        delFlag: ""
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
      selectRows: [],
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      //禁用下拉数据
      delFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      //仓库相关
      loadingSkuQuery: false,
      warehouseList: [],
      queryWarehouseList: [],
      //新增修改相关
      addOrUpdateRules: addOrUpdateRules,
      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      addOrUpdateDisabled: false,
      addOrUpdateForm: {
        stockLocationId: null,
        warehouseId: null,
        warehouseName: null,
        locationCode: null
      },
      //审核相关
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null
    }
  },
  components: {
    operationlog
  },
  created() {},
  mounted: function () {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
      } else {
        this.auditType = 2
      }
      this.handleAuditSave()
    },

    loadAll() {
      //加载仓库
      let queryParams = {
        funcState: "1",
        delFlag: "0"
      }
      getAllWarehouse(queryParams).then((response) => {
        this.queryWarehouseList = response.data.data
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
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
    //仓库相关
    fetchSuggestions(queryString) {
      let queryParams = {
        funcState: "1",
        delFlag: "0",
        warehouseName: queryString,
        isHideLoading: true
      }
      this.loadingSkuQuery = true
      getAllWarehouse(queryParams).then((response) => {
        this.loadingSkuQuery = false
        this.warehouseList = response.data.data
      })
    },
    handleSelectSkuCode(item) {
      var bean = this.warehouseList.filter((obj) => {
        return obj.warehouseId === item
      })
      if (bean.length === 0) {
        return
      }
      if (bean[0].warehouseId) {
        // this.addOrUpdateForm.warehouseName = bean[0].warehouseName;
        // this.addOrUpdateForm.warehouseId = bean[0].warehouseId;
        this.$set(this.addOrUpdateForm, "warehouseName", bean[0].warehouseName)
        this.$set(this.addOrUpdateForm, "warehouseId", bean[0].warehouseId)
      }
    },
    //已审核数据
    getPSkuByApproveStatusOk() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          exists.push(obj.locationCode)
          return obj
        }
      })
      return exists
    },
    //已禁用数据
    getPSkuByDelFlagFall() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          exists.push(obj.locationCode)
          return obj
        }
      })
      return exists
    },
    /**打开新增窗口**/
    handleAdd: function () {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true
      this.addOrUpdateDisabled = false
    },
    handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请选择一条数据进行修改")
        return
      }

      //是否已审核
      // let exists = this.getPSkuByApproveStatusOk();
      // if(exists && exists.length > 0){
      //   this.$message.warning('库位:'+exists + '，已审核过，不能修改');
      //   return;
      // }

      // 获取已禁用平台sku
      let exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("库位:" + exists + "，已禁用，不能修改")
        return
      }
      let row = this.selectRows[0]
      this.addOrUpdateForm = {
        stockLocationId: row.stockLocationId,
        warehouseId: row.warehouseId,
        warehouseName: row.warehouseName,
        locationCode: row.locationCode
      }
      this.addOrUpdateDisabled = true
      this.handleAddOrUpdateTile = "修改"
      this.addOrUpdateDialog = true
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              handleSaveOrUpdate(_this.addOrUpdateForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success(_this.handleAddOrUpdateTile + "成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.addOrUpdateDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    inputBlur() {
      if (!this.addOrUpdateDialog) {
        this.formReset()
      }
    },
    formReset() {
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          stockLocationId: null,
          warehouseId: null,
          warehouseName: null,
          locationCode: null
        }
      })
    },
    //审核
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //是否已审核
      let exists = this.getPSkuByApproveStatusOk()
      if (exists && exists.length > 0) {
        this.$message.warning("库位:" + exists + "，已审核过，不能重新审核")
        return
      }

      // 获取已禁用
      exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("库位:" + exists + "，已禁用，不能审核")
        return
      }
      // this.auditDialog = true;
      this.auditType = "1"
      this.auditTextarea = ""

      //直接审核
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.stockLocationId)
      })
      var _this = this
      var obj = {
        stockLocationIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        }
      })
    },
    handleAuditSave() {
      if (this.auditType == "2" && !this.auditTextarea && this.auditTextarea.trim() == "") {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.stockLocationId)
      })
      var _this = this
      var obj = {
        stockLocationIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        }
      })
    },
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.stockLocationId)
        if (state == item.delFlag) {
          numberList.push(item.locationCode)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("平台SKU:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        stockLocationIds: ids,
        stateModify: state
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          stateModify(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success(msg + "成功")
                _this.clearSelectClear()
                _this.refreshChange()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error(msg + "失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error(msg + "失败")
              return
            })
        }
      })
    },
    handleExport() {
      // let par='';
      //   Object.keys(this.searchForm).forEach(key=>{
      //     if(this.searchForm[key]){
      //         par+='&'+key+'='+this.searchForm[key];
      //   }
      // })

      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.stockLocationId)
        })
        par += "&stockLocationIds=" + keys.join(",")
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/baseSetup/wmsstocklocation/handleExport`) + par
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 2)
    }
  }
}
</script>

<style lang="scss">
#wmsstocklocation {
  .el-dialog__header {
    line-height: 30px;
  }

  .el-textarea__inner {
    height: 90px;
  }

  .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
  }
}
</style>
