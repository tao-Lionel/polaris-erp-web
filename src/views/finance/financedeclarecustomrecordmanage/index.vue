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
  <div
    class="execution"
    id="financedeclarecustomrecordmanage"
    v-loading.fullscreen.lock="loading"
    element-loading-text="正在处理中"
  >
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
          <el-button type="primary" @click="handleExport" size="small" v-if="permissions.keeponrecord_export"
            >导 出</el-button
          >
          <!-- <el-button type="primary"
                     @click="uploadDesignFileHandle"
                     size="small"
                     v-if="permissions.keeponrecord_import">导 入</el-button> -->
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="declareCustomNo" label="">
              <el-input
                v-model="searchForm.declareCustomNo"
                size="small"
                placeholder="报关单号"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="customsNumber" label="">
              <el-input
                v-model="searchForm.customsNumber"
                size="small"
                placeholder="海关单号"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="contractStateList" label="">
              <el-select
                v-model="searchForm.contractStateList"
                size="small"
                placeholder="合同状态"
                collapse-tags
                multiple
              >
                <el-option
                  v-for="item in contractStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="invoiceStatusList" label="">
              <el-select
                v-model="searchForm.invoiceStatusList"
                size="small"
                placeholder="开票状态"
                collapse-tags
                multiple
              >
                <el-option
                  v-for="item in invoiceStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="haveAttach" label="">
              <el-select v-model="searchForm.haveAttach" size="small" placeholder="物流单据" collapse-tags>
                <el-option v-for="item in haveAttachOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- 物流单据附件 -->
        <template slot="fileAttach" slot-scope="scope">
          <el-upload
            ref="uploadBean"
            class="upload-inq inline-class"
            accept=".zip,.rar,.gz"
            action="String"
            :auto-upload="false"
            :on-change="signFileChange"
            :show-file-list="false"
            v-if="permissions.keeponrecord_import"
          >
            <i
              class="icon-shangchuan y-icon-edit"
              v-if="permissions.keeponrecord_import"
              @click="uploadTransfer(scope.row)"
            ></i>
            <!-- <el-button size="small" type="primary" :disabled="canUpload">导 入</el-button> -->
          </el-upload>

          <el-badge :is-dot="scope.row.attachFile != null">
            <i class="icon-xiazai y-icon-edit" @click="download(scope.row.attachFile)"></i>
          </el-badge>
        </template>

        <template slot-scope="scope" slot="contractState">
          <a @click="showContractInfo(scope.row.declareCustomNo)"> {{ scope.row.contractState }}</a>
        </template>

        <template slot-scope="scope" slot="invoiceStatus">
          <a @click="showInvoiceInfo(scope.row.declareCustomNo)"> {{ scope.row.invoiceStatus }}</a>
        </template>
      </avue-crud>
      <!-- 合同关联信息 -->
      <div>
        <el-dialog title="关联信息" :visible.sync="contractDialog" width="50%" height="60%" center>
          <el-table :data="contractTableData" height="260" border>
            <el-table-column property="itemNo" width="50" label="项号"></el-table-column>
            <el-table-column property="skuCode" label="SKU"></el-table-column>
            <el-table-column property="purchaseOrderNo" label="采购单号"></el-table-column>
            <el-table-column property="poContractNo" label="合同编号"></el-table-column>
            <el-table-column property="poContractNo" label="下载">
              <template slot-scope="scope">
                <el-badge :is-dot="scope.row.contractAttachFile != null">
                  <i class="icon-xiazai y-icon-edit" @click="download(scope.row.contractAttachFile)"></i>
                </el-badge>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="contractDialog = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 发票关联信息 -->
      <div>
        <el-dialog title="关联信息" :visible.sync="invoiceDialog" width="50%" height="60%" center>
          <el-table :data="invoiceTableData" height="260" border>
            <el-table-column property="itemNo" width="50" label="项号"></el-table-column>
            <el-table-column property="skuCode" label="SKU"></el-table-column>
            <el-table-column property="purchaseOrderNo" label="采购单号"></el-table-column>
            <el-table-column property="invoiceNumber" label="发票号"></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="invoiceDialog = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  uploadDesignFile,
  handleExport,
  getInvoiceInfoByDCN,
  getContractInfoByDCN
} from "@/api/finance/financedeclarecustomrecordmanage/financedeclarecustomrecordmanage"
import { tableOption } from "@/const/crud/finance/financedeclarecustomrecordmanage/financedeclarecustomrecordmanage"
import { getTokenUrl } from "@/util/auth"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "financedeclarecustomrecordmanage",
  data() {
    return {
      //查询相关
      contractStatusOptions: [
        { value: "全部配齐", label: "全部配齐" },
        { value: "部分配齐", label: "部分配齐" },
        { value: "未齐", label: "未齐" }
      ],
      invoiceStatusOptions: [
        { value: "未开票", label: "未开票" },
        { value: "部分开票", label: "部分开票" },
        { value: "全部开票", label: "全部开票" }
      ],
      haveAttachOption: [
        { value: 1, label: "有" },
        { value: 2, label: "无" }
      ],

      //搜索条件，和前端控件绑定
      searchForm: {
        declareCustomNo: "",
        customsNumber: "",
        contractStateList: [],
        invoiceStatusList: [],
        haveAttach: ""
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
      //上传相关
      loading: false,
      uploadDeclareCustomNo: "",
      //合同关联信息
      contractDialog: false,
      contractTableData: [],
      //发票信息
      invoiceDialog: false,
      invoiceTableData: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
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
    uploadDesignFileHandle() {
      if (this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请选择一条报关单进行导入")
        return
      }
      this.$refs.uploadBean.click()
    },
    uploadTransfer(row) {
      this.uploadDeclareCustomNo = row.declareCustomNo
    },
    signFileChange(file, fileList) {
      if (!/^.*(.zip|.rar|.gz)/.test(file.raw.name)) {
        this.$message.warning("请选择zip，rar，gz文件")
        return
      }

      if (file.size / 1024 / 1024 > 30) {
        this.$message.warning("不允许上传大于30M文件")
        return
      }

      let formdata = new FormData()
      formdata.append("declareCustomNo", this.uploadDeclareCustomNo)
      formdata.append("file", file.raw)

      var _this = this
      this.loading = true
      uploadDesignFile(formdata)
        .then((res) => {
          _this.loading = false
          if (res.data.code == 0) {
            _this.clearSelectClear()
            _this.refreshChange()
            _this.$message.success("上传成功")
            _this.uploadDeclareCustomNo = ""
          } else if (res.data.code == 1) {
            _this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          _this.$message.error("上传失败")
          return
        })
    },
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.declareCustomNo)
        })
        par += "&selectDeclareCustomNos=" + keys
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
      window.location = getUrlConcatToken(`/api/finance/financedeclarecustomrecordmanage/handleExport`) + par
    },
    download(attachFile) {
      if (!attachFile) {
        this.$message.warning("该单据未上传附件")
        return
      }
      window.location = getTokenUrl(attachFile)
    },
    showContractInfo(dno) {
      getContractInfoByDCN({ declareCustomNo: dno }).then((response) => {
        this.contractTableData = response.data.data
        this.contractDialog = true
      })
    },
    showInvoiceInfo(dno) {
      getInvoiceInfoByDCN({ declareCustomNo: dno }).then((response) => {
        this.invoiceTableData = response.data.data
        this.invoiceDialog = true
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
