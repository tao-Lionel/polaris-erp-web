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
  <div class="execution" id="bseplatfromsku">
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
          <el-button type="primary" v-if="permissions.baseSetup_bseplatformsku_add" @click="handleAdd" size="small"
            >新 增</el-button
          >
          <el-button type="primary" v-if="permissions.baseSetup_bseplatformsku_edit" @click="handleEdit" size="small"
            >修改</el-button
          >
          <el-button type="primary" v-if="permissions.baseSetup_bseplatformsku_audit" @click="handleAudit" size="small"
            >审核</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bseplatformsku_enable"
            @click="handleEnable(0)"
            size="small"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bseplatformsku_prohibit"
            @click="handleEnable(1)"
            size="small"
            >禁用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bseplatformsku_export"
            @click="handleExport()"
            size="small"
            >导出</el-button
          >
        </template>

        <template slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="platformSkuCode">
              <el-input
                v-model="searchForm.platformSkuCode"
                size="small"
                placeholder="平台sku,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU,支持多个" v-search-input></el-input>
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
            <el-form-item prop="platformTypeId">
              <el-select
                v-model="searchForm.platformTypeId"
                size="small"
                clearable
                filterable
                placeholder="平台"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOptions"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="bsePlatformSitId">
              <el-select v-model="searchForm.bsePlatformSitId" size="small" clearable filterable placeholder="站点">
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.sitEnName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="storeAccount">
          <!-- <el-tag v-for="item in scope.row.storeList" :key="item.storeId">{{item.storeAccount}}</el-tag> -->
          <span title="点击查看其店铺信息" @click="showbaseStore(scope.row)" class="y-reviews el-row-text"
            >点击查看其店铺信息</span
          >
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.bsePlatformSkuId)"></i>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          class="add_dialog"
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" :rules="addOrUpdateRules" size="small" status-icon>
            <el-form-item label="平台:" prop="platformTypeId">
              <el-select
                v-model="addOrUpdateForm.platformTypeId"
                size="small"
                filterable
                placeholder="请选择"
                :disabled="addOrUpdateDisabled"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOptions"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="站点" prop="bsePlatformSitId">
              <el-select
                v-model="addOrUpdateForm.bsePlatformSitId"
                size="small"
                filterable
                placeholder="请选择"
                :disabled="addOrUpdateDisabled"
                @change="changePlatformSit"
              >
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.sitEnName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="店铺:" prop="storeId">
              <el-select v-model="addOrUpdateForm.storeId" size="small" filterable placeholder="请选择" collapse-tags>
                <el-option
                  v-for="item in baseStoreOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="平台SKU:" prop="platformSkuCode">
              <el-input
                v-model="addOrUpdateForm.platformSkuCode"
                size="small"
                maxlength="50"
                :disabled="addOrUpdateDisabled"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <el-form-item label="SKU:" prop="skuCode">
              <el-select
                v-model="addOrUpdateForm.skuCode"
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
                @visible-change="visibleChange"
                :disabled="addOrUpdateDisabled"
              >
                <el-option
                  v-for="item in skuList"
                  :key="item.skuCode"
                  :label="item.skuCode"
                  :value="item.skuCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="业务组:" prop="salesGroupId">
              <el-input v-model="addOrUpdateForm.salesGroupName" size="small" :disabled="true"></el-input>
              <!-- <el-select v-model="addOrUpdateForm.salesGroupId" size="small" clearable placeholder="请选择">
                <el-option
                  v-for="item in requisitionGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select> -->
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

      <!-- 查看所有店铺信息 -->
      <div>
        <el-dialog title="店铺信息" :visible.sync="storeModal" width="400px" center>
          <avue-crud :option="storeOption" ref="store" :data="storeList" :table-loading="storeLoading"></avue-crud>
        </el-dialog>
      </div>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import { getAll as getAllStore, getDistrict } from "@/api/baseSetup/bsestore"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import {
  fetchList,
  getObj,
  handleSaveOrUpdate,
  stateModify,
  handleAudit,
  getStoreInfoByPSkuId
} from "@/api/baseSetup/bseplatformsku/bseplatformsku"
import { tableOption, addOrUpdateRules, storeOption } from "@/const/crud/baseSetup/bseplatformsku/bseplatformsku"
import { getGroupAllByParamsSpecial } from "@/api/adminUser/adminGroup"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bseplatformsku",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        bsePlatformSitId: null,
        platformTypeId: null,
        platformSkuCode: "",
        skuCode: "",
        delFlag: "",
        approveStatus: ""
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

      addOrUpdateRules: addOrUpdateRules,
      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      addOrUpdateForm: {
        bsePlatformSkuId: null,
        platformTypeId: 1,
        bsePlatformSitId: null,
        platformSkuCode: null,
        storeId: null,
        skuId: null,
        skuCode: "",
        salesGroupId: null,
        salesGroupName: ""
      },

      //店铺
      baseStoreOptions: [],
      //站点
      bsedistrictOptions: [],
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
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null,
      //查询sku相关
      loadingSkuQuery: false,
      skuList: [],
      //业务组相关
      requisitionGroupOptions: [],
      addOrUpdateDisabled: false,
      //平台类型
      plaTypeOptions: [],
      //平台站点
      sitCountryOptions: [],
      //查看店铺信息
      storeModal: false,
      storeLoading: false,
      storeList: [],
      storeOption: storeOption
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

    /**刷新回调 */
    refreshChange(params) {
      this.getList(this.page, params)
    },
    /** 搜索回调*/
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

    /** 打开新增窗口*/
    handleAdd: function () {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true
      //默认选中第一个销售组
      // if(this.requisitionGroupOptions.length > 0){
      //   this.addOrUpdateForm.salesGroupId = this.requisitionGroupOptions[0].groupId
      // }

      //默认选中amazon
      var data = this.plaTypeOptions.filter((obj) => {
        return obj.platformTypeCode == "AMAZON"
      })
      if (data.length > 0) {
        this.addOrUpdateForm.platformTypeId = data[0].platformTypeId
      } else {
        this.addOrUpdateForm.platformTypeId = this.plaTypeOptions[0].platformTypeId
      }

      //根据平台重新获取平台下的站点
      this.getPlatformSit(this.addOrUpdateForm.platformTypeId)

      this.addOrUpdateDisabled = false
    },
    /**修改 */
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
      let existsPSku = this.getPSkuByApproveStatusOk()
      // if(existsPSku && existsPSku.length > 0){
      //   this.$message.warning('平台sku:'+existsPSku + '，已审核过，不能修改');
      //   return;
      // }

      // 获取已禁用平台sku
      existsPSku = this.getPSkuByDelFlagFall()
      if (existsPSku && existsPSku.length > 0) {
        this.$message.warning("平台sku:" + existsPSku + "，已禁用，不能修改")
        return
      }

      let row = this.selectRows[0]
      // var storeIds = [];
      // if(row.storeList){
      //   row.storeList.forEach(obj =>{
      //     storeIds.push(obj.storeId)
      //   })
      // }

      this.addOrUpdateForm = {
        bsePlatformSkuId: row.bsePlatformSkuId,
        platformTypeId: row.platformTypeId,
        bsePlatformSitId: row.bsePlatformSitId,
        platformSkuCode: row.platformSkuCode,
        isShare: row.isShare,
        storeId: row.storeId,
        skuId: row.skuId,
        skuCode: row.skuCode,
        salesGroupId: row.salesGroupId,
        salesGroupName: row.salesGroupName
      }

      //根据平台重新获取平台下的站点
      this.getPlatformSit(this.addOrUpdateForm.platformTypeId)

      //根据平台重新获取平台下面的店铺
      this.getStoreInfo(this.addOrUpdateForm.bsePlatformSitId)

      this.addOrUpdateDisabled = false
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
          bsePlatformSkuId: null,
          platformTypeId: 1,
          bsePlatformSitId: null,
          platformSkuCode: null,
          storeId: null,
          skuId: null,
          skuCode: "",
          salesGroupId: null,
          salesGroupName: ""
        }
        this.sitCountryOptions = []
        this.baseStoreOptions = []
      })
    },
    //获取已审核平台sku
    getPSkuByApproveStatusOk() {
      let existsPSku = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          existsPSku.push(obj.platformSkuCode)
          return obj
        }
      })
      return existsPSku
    },
    //获取已禁用平台sku
    getPSkuByDelFlagFall() {
      let existsPSku = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          existsPSku.push(obj.platformSkuCode)
          return obj
        }
      })
      return existsPSku
    },
    /**审核 */
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //是否已审核
      let existsPSku = this.getPSkuByApproveStatusOk()
      if (existsPSku && existsPSku.length > 0) {
        this.$message.warning("平台sku:" + existsPSku + "，已审核过，不能重新审核")
        return
      }

      // 获取已禁用平台sku
      existsPSku = this.getPSkuByDelFlagFall()
      if (existsPSku && existsPSku.length > 0) {
        this.$message.warning("平台sku:" + existsPSku + "，已禁用，不能审核")
        return
      }
      // this.auditDialog = true;
      this.auditType = "1"
      this.auditTextarea = ""

      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.bsePlatformSkuId)
      })
      var _this = this
      var obj = {
        bsePlatformSkuIds: ids.join(","),
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
    //保存审核
    handleAuditSave() {
      if (this.auditType == "2" && !this.auditTextarea && this.auditTextarea.trim() == "") {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.bsePlatformSkuId)
      })
      var _this = this
      var obj = {
        bsePlatformSkuIds: ids.join(","),
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
    /**启用 禁用 */
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.bsePlatformSkuId)
        if (state == item.delFlag) {
          numberList.push(item.platformSkuCode)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("平台SKU:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        bsePlatformSkuIds: ids.join(","),
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
    /**导出 */
    handleExport() {
      // let par='';
      //    Object.keys(this.searchForm).forEach(key=>{
      //      if(this.searchForm[key]){
      //         par+='&'+key+'='+this.searchForm[key];
      //   }
      // })
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.bsePlatformSkuId)
        })
        par += "&bsePlatformSkuIds=" + keys.join(",")
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
      window.location = getUrlConcatToken(`/api/baseSetup/bseplatformsku/handleExport`) + par
    },
    //sku检索输入
    fetchSuggestions(queryString) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString ? queryString.trim() : queryString,
        codes: "1000"
      }
      this.loadingSkuQuery = true
      getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((response) => {
        this.loadingSkuQuery = false
        this.skuList = response.data.data
      })
    },
    //选中sku
    handleSelectSkuCode(item) {
      var skuInfo = this.skuList.filter((sku) => {
        return sku.skuCode === item
      })
      if (skuInfo.length === 0) {
        return
      }
      this.addOrUpdateForm.skuId = skuInfo[0].skuId
      this.addOrUpdateForm.skuCode = skuInfo[0].skuCode
      this.addOrUpdateForm.salesGroupId = skuInfo[0].salesGroupId
      this.addOrUpdateForm.salesGroupName = skuInfo[0].salesGroupName
    },
    visibleChange(result) {
      if (!result) {
        this.skuList = []
      }
    },
    //加载基础数据等...
    loadAll() {
      //获取站点
      // this.getDistrict();
      //加载请购组（业务组）
      // var params = {
      //   groupFunctionName: "销售类"
      // };
      // getGroupAllByParamsSpecial(params).then(response => {
      //   var data = response.data.data
      //   if (data && data.length > 0) {
      //     this.requisitionGroupOptions = data
      //   }
      // });
      //获取所有平台类型
      getPlaTypeAll().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.plaTypeOptions = data
        }
      })
    },
    //选中平台操作获取该平台下的站点
    changePlatform(val) {
      this.addOrUpdateForm.bsePlatformSitId = ""
      this.getPlatformSit(val)
    },
    //根据平台查询站点
    getPlatformSit(val) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.sitCountryOptions = res.data.data
      })
    },
    //选中站点-过滤出店铺
    changePlatformSit(val) {
      this.addOrUpdateForm.storeId = null
      this.getStoreInfo(val)
    },
    //查询站点下的店铺
    getStoreInfo(val) {
      let param = {
        bsePlatformSitId: val
      }
      getAllStore(param).then((res) => {
        this.baseStoreOptions = res.data.data
      })
    },
    //获取区域
    getDistrict() {
      getDistrict().then((response) => {
        this.bsedistrictOptions = response.data.data
      })
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 5)
    },
    //查看店铺信息
    showbaseStore(row) {
      if (!row) {
        this.$message("数据不存在")
        return
      }
      this.storeList = []
      var param = {
        bsePlatformSkuId: row.bsePlatformSkuId
      }
      getStoreInfoByPSkuId(param).then((res) => {
        this.storeList = res.data.data
      })
      this.storeModal = true
    }
  }
}
</script>

<style lang="scss">
#bseplatfromsku {
  .add_dialog .el-form-item__label {
    width: 124px;
  }
}
</style>
