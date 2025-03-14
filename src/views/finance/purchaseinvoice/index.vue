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
  <div class="execution" id="purchaseinvoice">
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
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="entryInvoice"
            size="small"
            v-if="permissions.finance_purchaseinvoice_entry_invoice"
            >录入发票</el-button
          >
          <el-button type="primary" @click="exportList" size="small" v-if="permissions.finance_purchaseinvoice_export"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="purchaseOrderNo" label="">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="invoiceNumber" label="">
              <el-input v-model="searchForm.invoiceNumber" size="small" placeholder="发票号" v-search-input></el-input>
            </el-form-item>
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
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="skuCode" label="">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="categoryName" label="">
              <el-input v-model="searchForm.categoryName" size="small" placeholder="品名" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="supplierName" label="">
              <el-input v-model="searchForm.supplierName" size="small" placeholder="供应商" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="purchaseGroupIds" label="">
              <el-select
                v-model="searchForm.purchaseGroupIds"
                size="small"
                clearable
                placeholder="采购组"
                collapse-tags
                multiple
              >
                <el-option
                  v-for="item in requisitionGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="poContractNo" label="">
              <el-input v-model="searchForm.poContractNo" size="small" placeholder="合同编号" v-search-input></el-input>
            </el-form-item>
          </el-form>
        </template>

        <!-- 开票数量 编辑 -->
        <template slot-scope="scope" slot="quantityOfInvoice">
          <!-- <el-tag > -->
          <a class="el-row-text" @click="editInvoice(scope.row)"> {{ scope.row.quantityOfInvoice }}</a>
          <!-- </el-tag>     -->
        </template>

        <!-- 报关数量 -->
        <template slot-scope="scope" slot="outQuantity">
          <!-- <el-tag > -->
          <a class="el-row-text" @click="outQuantityShow(scope.row)"> {{ scope.row.outQuantity }}</a>
          <!-- </el-tag>     -->
        </template>

        <!-- 查看日志 -->
        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row)"></i>
        </template>
      </avue-crud>

      <!-- 录入发票 -->
      <div>
        <el-dialog
          title="录入发票"
          :visible.sync="entryInvoiceDialog"
          width="60%"
          height="60%"
          @close="formReset"
          center
        >
          <el-form ref="entryInvoiceForm" :model="entryInvoiceForm" label-position="right">
            <el-form-item label="发票号" prop="invoiceNumber" :rules="entryInvoiceFormRules.invoiceNumber">
              <el-input
                :maxlength="20"
                v-model="entryInvoiceForm.invoiceNumber"
                size="small"
                placeholder="输入发票号，限制20位数字"
                v-search-input-trim
              ></el-input>

              <!-- <avue-crud-input :maxlength="20" v-model="entryInvoiceForm.invoiceNumber"
                  size="small"  onlyTrim
              ></avue-crud-input> -->
            </el-form-item>

            <el-form-item label="发票代码" prop="invoiceCode" :rules="entryInvoiceFormRules.invoiceCode">
              <el-input
                :maxlength="20"
                v-model="entryInvoiceForm.invoiceCode"
                size="small"
                placeholder="输入发票代码，限制20位数字"
                v-search-input-trim
              ></el-input>

              <!-- <avue-crud-input :maxlength="20" v-model="entryInvoiceForm.invoiceCode"
                  size="small"  onlyTrim
              ></avue-crud-input> -->
            </el-form-item>

            <avue-crud
              class="app-container close-table-select"
              :data="entryInvoiceForm.invoiceTableData"
              :option="invoiceTableOption"
              @row-click="rowClick"
            >
              <!-- 开票数量 -->
              <template slot="quantityOfInvoice" slot-scope="scope">
                <el-form-item
                  :prop="'invoiceTableData.' + scope.row.$index + '.quantityOfInvoice'"
                  :rules="entryInvoiceFormRules.quantityOfInvoice"
                >
                  <el-input
                    :maxlength="7"
                    clearable
                    v-model="scope.row.quantityOfInvoice"
                    size="small"
                    @blur="computeTaxPriceSum(scope.row.$index)"
                  ></el-input>

                  <!-- <avue-crud-input
                    :maxlength="7"
                    clearable
                    v-model="scope.row.quantityOfInvoice"
                    @blur="computeTaxPriceSum(scope.row.$index)"
                    @focus="setCurrentIndex(scope.row.$index)"
                  ></avue-crud-input> -->
                </el-form-item>
              </template>
            </avue-crud>

            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="entryInvoiceForm.remark"
                clearable
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                placeholder="输入备注信息，限制50字符以内"
                :maxlength="50"
                v-search-input-trim
              ></el-input>

              <!-- <avue-crud-input
                v-model="entryInvoiceForm.remark"
                clearable
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3}"
                placeholder="输入备注信息，限制50字符以内"
                :maxlength="50"
                onlyTrim
              ></avue-crud-input> -->
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="entryInvoiceDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 发票详情 -->
      <div>
        <el-dialog
          title="录入发票"
          :visible.sync="invoiceDetailDialog"
          width="60%"
          height="60%"
          center
          @close="isRelaodData"
        >
          <avue-crud
            class="app-container close-table-select"
            :data="invoiceDetailTableData"
            :option="invoiceDetailTableOption"
          >
            <!-- 开票数量 -->
            <template slot="oprateDetail" slot-scope="scope">
              <a v-if="scope.row.approveStatus == 1" @click="delInvoiceDetail(scope.row)"> 删除 </a>
            </template>
          </avue-crud>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="invoiceDetailDialog = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 关联单据的报关单号详情 -->
      <outQuantityInfo :is-show-out-quantity="true" ref="outQuantityInfo"></outQuantityInfo>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  entryInvoiceSave,
  getInvoiceDetailByPurnoAndSkuAndPrice,
  delInvoiceDetail
} from "@/api/finance/purchaseinvoice/purchaseinvoice"
import {
  tableOption,
  invoiceTableOption,
  entryInvoiceFormRules,
  invoiceDetailTableOption,
  outQuantityOption
} from "@/const/crud/finance/purchaseinvoice/purchaseinvoice"
import outQuantityInfo from "@/views/finance/purchaseinvoice/outQuantityInfo"
import operationlog from "@/views/finance/log/index"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "purchaseinvoice",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        purchaseOrderNo: "",
        invoiceNumber: "",
        invoiceStatusList: [],
        skuCode: null,
        categoryName: null,
        supplierName: null,
        purchaseGroupIds: [],
        poContractNo: ""
      },
      //查询相关
      invoiceStatusOptions: [
        { value: "待开票", label: "待开票" },
        { value: "未开票", label: "未开票" },
        { value: "部分开票", label: "部分开票" },
        { value: "全部开票", label: "全部开票" }
      ],
      requisitionGroupOptions: [],
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
      //录入发票相关
      entryInvoiceDialog: false,
      entryInvoiceForm: {
        invoiceNumber: null,
        invoiceCode: null,
        remark: null,
        supplierNo: null,
        invoiceTableData: []
      },
      invoiceTableIndex: -1,
      invoiceTableOption: invoiceTableOption,
      entryInvoiceFormRules: entryInvoiceFormRules,
      //发票详情相关
      invoiceDetailDialog: false,
      invoiceDetailTableOption: invoiceDetailTableOption,
      invoiceDetailTableData: [],
      isReload: false
    }
  },
  components: {
    outQuantityInfo,
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
    loadAll() {
      //加载请购组（业务组）
      var params = {
        groupFunctionName: "采购类",
        authority: false
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.requisitionGroupOptions = data
        }
      })
    },
    //选中行事件
    rowClick: function (row, column, event) {
      this.setCurrentIndex(row.$index)
    },
    setCurrentIndex(currentIndex) {
      //当前选中行
      this.invoiceTableIndex = currentIndex
    },
    /** 录入发票*/
    entryInvoice() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      // if(this.selectRows.length != 1){
      //   this.$message.warning('请选择一条数据进行录入');
      //   return;
      // }
      //验证是否选中同一个供应商
      var supplierArr = []
      var failSupplier = []
      this.selectRows.forEach((o) => {
        if (!supplierArr.includes(o.supplierNo)) {
          supplierArr.push(o.supplierNo)
          failSupplier.push(o.supplierName)
        }
      })
      if (supplierArr.length > 1) {
        this.$message.warning("请选择同一个供应商：" + failSupplier.join(","))
        return
      }
      //验证是否存在全部开票的数据
      var fallInvoce = []
      this.selectRows.forEach((o) => {
        if (o.invoiceStatus == "全部开票") {
          fallInvoce.push(o.purchaseOrderNo)
        }
      })
      if (fallInvoce.length > 0) {
        this.$message.warning("不能选择已全部开票的数据")
        return
      }
      //验证报告数量是否为0，是不可选择
      fallInvoce = []
      this.selectRows.forEach((o) => {
        if (o.outQuantity == 0) {
          fallInvoce.push(o.purchaseOrderNo)
        }
      })
      if (fallInvoce.length > 0) {
        this.$message.warning("不能选择报关数量为0的数据")
        return
      }

      var invoiceTableData = []
      this.selectRows.forEach((val) => {
        invoiceTableData.push({
          purchaseOrderNo: val.purchaseOrderNo,
          skuCode: val.skuCode,
          categoryName: val.categoryName,
          quantityOfInvoice: val.outQuantity - val.quantityOfInvoice,
          oldQuantityOfInvoice: val.quantityOfInvoice,
          outQuantity: val.outQuantity,
          taxPrice: val.taxPrice,
          taxPriceSum: ((val.outQuantity - val.quantityOfInvoice) * val.taxPrice).toFixed(2),
          skuId: val.skuId,
          unitName: val.unitName
        })
        // val.quantityOfInvoice=typeof val.quantityOfInvoice==='number'?JSON.stringify(val.quantityOfInvoice):val.quantityOfInvoice
      })

      this.$set(this.entryInvoiceForm, "supplierNo", supplierArr[0])
      this.$set(this.entryInvoiceForm, "invoiceTableData", invoiceTableData)
      this.entryInvoiceDialog = true
    },
    saveClickValidate() {
      let flag = true
      // this.$nextTick(function() {
      this.$refs["entryInvoiceForm"].validate((valid, rules) => {
        if (!valid) {
          flag = valid
          Object.keys(rules).forEach((item, index) => {
            if (index === 0) {
              this.$message.error(rules[item][0].message)
            }
          })
        }
      })
      // });
      return flag
    },
    /**保存 */
    submitForm() {
      let _this = this
      if (this.saveClickValidate()) {
        preventShake.preventShake((bool) => {
          if (bool) {
            entryInvoiceSave(_this.entryInvoiceForm)
              .then((response) => {
                if (response.data.code == 0) {
                  _this.$message.success("录入成功")
                  _this.clearSelectClear()
                  _this.refreshChange()
                  _this.entryInvoiceDialog = false
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
    },
    /**计算价税合计 */
    computeTaxPriceSum(currentRowIndex) {
      //得到当前行数据
      var row = this.entryInvoiceForm.invoiceTableData[currentRowIndex]
      if (!row) {
        return
      }
      //验证开票数量不能大于 报关数量-已开票数量
      if (
        row.quantityOfInvoice &&
        /^\d{0,7}$/g.test(row.quantityOfInvoice) &&
        row.quantityOfInvoice > row.outQuantity - row.oldQuantityOfInvoice
      ) {
        this.$message.warning("开票数量不能超过 报关数量减去已开票数量")
        return
      }

      if (!row.quantityOfInvoice) {
        row.taxPriceSum = ""
      } else {
        //含税单价
        let taxPrice = row.taxPrice
        row.taxPriceSum = (taxPrice * row.quantityOfInvoice).toFixed(2)
        if (row.taxPriceSum == "NaN") {
          row.taxPriceSum = ""
        }
      }
      this.$set(this.entryInvoiceForm.invoiceTableData, currentRowIndex, row)
    },
    formReset() {
      this.$refs["entryInvoiceForm"].resetFields()
    },
    //开票数量详情，可以删除
    editInvoice(row) {
      if (!row) {
        this.$message.warning("选择数据不存在")
        return
      }
      var param = {
        purchaseOrderNo: row.purchaseOrderNo,
        skuId: row.skuId,
        taxPrice: row.taxPrice
      }
      this.isReload = false
      //根据采购单号 sku 含税单价查询 发票详情
      getInvoiceDetailByPurnoAndSkuAndPrice(param).then((response) => {
        this.invoiceDetailTableData = response.data.data
        this.invoiceDetailDialog = true
      })
    },
    //删除发票详情
    delInvoiceDetail(row) {
      var detailId = row.purchaseInvoiceDetailId
      var _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          delInvoiceDetail(detailId)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("删除成功")
                _this.invoiceDetailTableData.splice(row.$index, 1)
                _this.isReload = true
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
    isRelaodData() {
      if (this.isReload) {
        this.refreshChange()
      }
    },
    //报关数量
    outQuantityShow(row) {
      if (!row) {
        this.$message.warning("选择数据不存在")
        return
      }
      var param = {
        purchaseOrderNo: row.purchaseOrderNo,
        skuId: row.skuId,
        taxPrice: row.taxPrice
      }
      this.$refs.outQuantityInfo.findOutQuantityView(param)
    },
    /**列表导出 */
    exportList() {
      let par = ""
      if (this.selectRows.length > 0) {
        var arr = []
        this.selectRows.forEach((row) => {
          var obj = []
          obj.push(row.purchaseOrderNo)
          obj.push(row.skuId)
          obj.push(row.taxPrice)
          arr.push(obj.join("/"))
        })
        par += "&selectDetailStrJoin=" + arr
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
      window.location = getUrlConcatToken(`/api/finance/purchaseinvoice/handleExport`) + par
    },
    // 查看日志
    showOperateLog(row) {
      var purchaseOrderNo = row.purchaseOrderNo
      var skuCode = row.skuCode
      var taxPrice = row.taxPrice
      if (taxPrice) {
        taxPrice = parseFloat(taxPrice)
      } else {
        taxPrice = 0
      }
      this.$refs.operationlog.showOperateLogDialog(purchaseOrderNo + "-" + skuCode + "-" + taxPrice, 1)
    }
  }
}
</script>
