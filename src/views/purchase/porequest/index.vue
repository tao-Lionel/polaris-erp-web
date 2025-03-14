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
  <!-- 采购请款单 -->
  <div class="execution" id="porequest">
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
        @row-update="handleUpdate"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="handleDel" v-if="permissions.purchase_porequest_del"
            >删 除</el-button
          >
          <el-dropdown-button
            @command="submitVerify"
            type="primary"
            size="small"
            buttonText="提交"
            command="10"
            v-if="permissions.purchase_porequest_submit"
          >
            <el-dropdown-item command="20">撤销提交</el-dropdown-item>
          </el-dropdown-button>

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="采购审核"
            command="1"
            style="margin-right: 10px"
            @command="changeStatus"
            v-if="permissions.purchase_porequest_purchase"
          >
            <el-dropdown-item command="-1">反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button type="primary" size="small" @click="changeStatus(2)" v-if="permissions.purchase_porequest_verify"
            >财务审核</el-button
          >

          <el-button type="primary" size="small" @click="print" v-if="permissions.purchase_porequest_print"
            >打印付款申请书</el-button
          >

          <el-button type="primary" size="small" @click="batSetPayTime" v-if="permissions.purchase_porequest_print"
            >批量设置期望付款时间</el-button
          >

          <el-button type="primary" size="small" @click="exportData" v-if="permissions.purchase_porequest_print"
            >导出</el-button
          >

          <el-button
            type="primary"
            size="small"
            @click="removeRequest"
            v-if="permissions.purchase_porequest_print && false"
            >作废</el-button
          >
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="requestAccountNo">
              <avue-crud-input
                v-model="searchForm.requestAccountNo"
                size="small"
                placeholder="单据编号"
              ></avue-crud-input>
            </el-form-item>

            <!-- <el-form-item prop="status" label="请款状态">
              <el-select size="small" v-model="searchForm.status" multiple collapse-tags clearable filterable
                placeholder="请款状态">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="supplierNo">
              <el-select
                v-model="searchForm.supplierNo"
                size="small"
                popper-class="y-form-select"
                placeholder="往来单位(供应商)"
                filterable
                clearable
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationId">
              <el-select
                size="small"
                v-model="searchForm.corporationId"
                clearable
                filterable
                placeholder="结算组织(法人主体)"
              >
                <el-option
                  v-for="item in bsecorporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <!-- <el-form-item prop="supplierName" label="供应商名称">
              <avue-crud-input v-model="searchForm.supplierName" size="small" placeholder="请输入供应商名称搜索"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="corporationName" label="法人主体">
              <avue-crud-input v-model="searchForm.corporationName" size="small"
                placeholder="请输入法人主体搜索"></avue-crud-input>
            </el-form-item> -->

            <el-form-item prop="purchaseOrderNo">
              <avue-crud-input
                v-model="searchForm.purchaseOrderNo"
                v-search-input
                size="small"
                placeholder="采购单号,支持多个"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="docNo">
              <el-input
                v-model="searchForm.docNo"
                size="small"
                placeholder="入库单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="settleaccountName">
              <!-- <el-select v-model="searchForm.settleaccountId" filterable collapse-tags remote clearable size="small"
                reserve-keyword placeholder="结算方式" :remote-method="remoteMethod">
                <el-option v-for="item in settleaccountOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
              <el-input v-model="searchForm.settleaccountName" size="small" placeholder="结算方式" clearable></el-input>
            </el-form-item>
            <el-form-item prop="poPaymentNo">
              <avue-crud-input v-model="searchForm.poPaymentNo" size="small" placeholder="付款单编号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="createName">
              <avue-crud-input
                v-model="searchForm.createName"
                v-search-input
                size="small"
                placeholder="请款人"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <avue-crud-input v-model="searchForm.poContractNo" size="small" placeholder="合同编号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="currency">
              <el-select
                size="small"
                v-model="searchForm.currency"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="币种"
              >
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.currency"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-select
                size="small"
                v-model="searchForm.requestAccountType"
                collapse-tags
                clearable
                filterable
                placeholder="单据类型"
              >
                <el-option
                  v-for="item in requestTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createName">
              <avue-crud-input v-model="searchForm.createName" size="small" placeholder="制单员"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="expertTime">
              <el-date-picker
                v-model="searchForm.expertTime"
                type="daterange"
                size="small"
                start-placeholder="期望付款开始日期"
                end-placeholder="期望付款结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item prop="payStatus" label="支付状态">
              <el-select size="small" v-model="searchForm.payStatus" collapse-tags clearable multiple filterable
                placeholder="支付状态">
                <el-option label="未支付" value="0"></el-option>
                <el-option label="已支付" value="1"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item prop="inboundDate" label="入库时间">
                <el-date-picker size="small" v-model="searchForm.inboundDate" type="daterange" value-format="yyyy-MM-dd"
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item> -->
          </el-form>
        </template>
        <!-- 操作列表中的某一列 -->
        <template slot="requestAccountNo" slot-scope="scope">
          <span class="el-row-text">
            <copy-text hoverToShow>
              <router-link :to="{ path: '/requestDetail', query: { id: scope.row.requestAccountNo } }">{{
                scope.row.requestAccountNo
              }}</router-link>
            </copy-text>
          </span>
        </template>
        <template slot="status" slot-scope="scope">
          <a class="el-row-text" @click="showOperateLog(scope.row.requestAccountNo)">{{
            statusOptions[scope.row.status].label
          }}</a>
        </template>
        <template slot="payStatus" slot-scope="scope">
          <span>{{ scope.row.payStatus == 0 ? "未支付" : "已支付" }}</span>
        </template>

        <template slot="requestAccountType" slot-scope="scope">
          <span>{{ requestTypeObj[scope.row.requestAccountType] }}</span>
        </template>

        <template slot="purchaseOrderNo" slot-scope="scope">
          <span v-if="scope.row.purchaseOrderNoCount == 1">
            <copy-text :text="scope.row.purchaseOrderNo" hoverToShow></copy-text>
          </span>
          <a v-if="scope.row.purchaseOrderNoCount > 1" @click="showPurchaseOrderNos(scope.row.purchaseOrderNo)">查看</a>
        </template>
        <template slot="tableBeforeSlot">
          <div style="position: relative; font-size: 13px">
            <div style="position: absolute; top: 7px; left: 300px; z-index: 100">
              <!-- <span>汇总数量：</span><span>{{ quantityTotal }}</span> -->
              <span style="margin-left: 30px">汇总金额：</span><span>{{ amountTotal }}</span>
            </div>
          </div>
        </template>
      </avue-crud>
      <!-- 审核弹出框 -->
      <el-dialog :title="verifyTitle" width="35%" :visible.sync="verifyModel" @close="cancelReason = ''">
        <el-input
          maxlength="100"
          type="textarea"
          :rows="3"
          placeholder="请填写原因，不得超过100个字符。(拒绝必填)"
          v-model="cancelReason"
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button size="small" @click="verifyModel = false">拒 绝</el-button>
            <el-button size="small" type="primary" @click="sureCancel">通过</el-button>-->
          <el-button size="small" @click="refuseOrPass(1)">拒 绝</el-button>
          <el-button size="small" type="primary" @click="refuseOrPass(2)">通过</el-button>
        </div>
      </el-dialog>

      <el-dialog title="查看采购单号" :visible.sync="purchaseOrderNoModel">
        <span>{{ purchaseOrderNoContent }}</span>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button size="small" @click="verifyModel = false">拒 绝</el-button>
            <el-button size="small" type="primary" @click="sureCancel">通过</el-button>-->
          <el-button width="100%" size="small" @click="purchaseOrderNoModel = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="设置期望付款时间" :visible.sync="setTimeDialog">
        <span>期望付款时间：</span>
        <el-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          v-model="expectePaymentTime"
          :picker-options="pickerOptions"
          placeholder="选择日期"
        >
        </el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="setTimeDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="setTimeConfirm">确 定</el-button>
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
  deleteBatch,
  submitDataBatch,
  cancelSubmitBatch,
  purchaseVerify,
  financeVerify,
  exportRequestData,
  updateExpertTime
} from "@/api/purchase/request/porequest"
import { downloadBlob } from "@/util/auth"
import { getSettleaccountTypeByName } from "@/api/purchase/posettleaccounttype"
import { tableOption } from "@/const/crud/purchase/request/porequest"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { getAll as getAllBsecorporation } from "@/api/baseSetup/bsecorporation"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getObjByType } from "@/api/admin/dict"
import operationlog from "@/views/finance/log/index"
let tip = {
  t1: "请勾选数据操作",
  t2: "检测到单据编号:",
  t3: "为"
}
export default {
  name: "porequest",
  data() {
    return {
      setTimeDialog: false,
      expectePaymentTime: "",
      //搜索条件，和前端控件绑定
      settleaccountOptions: [], //计算方式 选项
      searchForm: {
        time: [],
        requestAccountNo: "",
        supplierName: "",
        expertTime: [],
        corporationName: "",
        settleaccountId: [],
        status: "",
        payStatus: "",
        currency: "",
        poContractNo: ""
      },
      requestTypeOptions: [],
      currencyOptions: [],
      //处理环节
      statusOptions: [
        {
          value: 0,
          label: "未处理"
        },
        {
          value: 1,
          label: "采购审核"
        },
        {
          value: 2,
          label: "财务审核"
        },
        {
          value: 3,
          label: "审核完成"
        },
        {
          value: 4,
          label: "作废"
        }
      ],
      verifyTitle: "",
      verifyModel: false,
      cancelReason: "",
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
      purchaseOrderNoModel: false,
      purchaseOrderNoContent: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      supplierOptions: [],
      bsecorporationList: [],
      quantityTotal: 0,
      amountTotal: 0
    }
  },
  created() {
    //获取供应商
    getAllSupplier().then((res) => {
      if (res.data.code === 0) {
        res.data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    })
    getAllBsecorporation().then((res) => {
      if (res.data.code === 0) {
        this.bsecorporationList = res.data.data
      }
    })
  },
  mounted: function () {
    this.getCurrencyAll()
    this.init()
  },
  computed: {
    ...mapGetters(["permissions"]),
    requestTypeObj() {
      const result = {}
      this.requestTypeOptions.forEach((item) => {
        result[item.value] = item.label
      })
      return result
    }
  },
  components: {
    operationlog
  },
  methods: {
    setTimeConfirm() {
      if (!this.expectePaymentTime) {
        this.$message.error("期望付款时间不能为空")
        return
      }
      let requestAccountNos = this.selectRows.map((item) => item.requestAccountNo)
      let param = {
        requestAccountNos,
        expertTime: this.expectePaymentTime
      }
      updateExpertTime(param).then((res) => {
        if (res.data.code == 0) {
          this.$message.success("操作成功！")
          this.setTimeDialog = false
          this.refreshChange()
        }
      })
    },
    batSetPayTime() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      this.setTimeDialog = true
    },
    init() {
      //获取单据类型
      getObjByType("request_account_type").then((res) => {
        this.requestTypeOptions = res.data.data
      })
    },

    //作废
    removeRequest() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      this.$confirm("此操作将作废请款单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = this.selectRows.map((item) => item.requestAccountNo)
          removeRequestAccount(params)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                })
                this.refreshChange()
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch((err) => console.log(err))
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          })
        })
    },
    exportData() {
      exportRequestData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "请款单导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //打印
    print() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("只能勾选一条数据操作")
        return
      }
      this.$router.push({
        path: "/print",
        query: {
          requestAccountNo: this.selectRows[0].requestAccountNo
        }
      })
    },
    // 查看采购单号
    showPurchaseOrderNos(purchaseOrderNos) {
      this.purchaseOrderNoContent = purchaseOrderNos
      this.purchaseOrderNoModel = true
    },
    // 查看日志
    showOperateLog(requestAccountNo) {
      this.$refs.operationlog.showOperateLogDialog(requestAccountNo, 6)
    },
    remoteMethod(val) {
      // console.log(val)
      val = val.replace(/\s/g, "")
      if (val !== "" && val !== undefined && val !== null) {
        getSettleaccountTypeByName({
          settleaccountName: val
        }).then((res) => {
          if (res.data.code === 0) {
            let result = res.data.data

            this.settleaccountOptions = result.map((item) => {
              return {
                value: item.settleaccountTypeId,
                label: item.settleaccountName
              }
            })
          }
        })
      }
    },
    selectionChange(selected) {
      this.selectRows = selected
      this.quantityTotal = this.selectRows.reduce((prev, cuv) => {
        return prev + (cuv.quantity ? cuv.quantity : 0)
      }, 0)

      let amountTotal = this.selectRows.reduce((prev, cuv) => {
        return prev + (cuv.requestAccount ? cuv.requestAccount : 0)
      }, 0)
      this.amountTotal = amountTotal.toFixed(2)
    },
    /**
     * 查询国家地区
     */
    getCurrencyAll() {
      getAll().then((response) => {
        this.currencyOptions = response.data.data
      })
    },
    handleStatus(status) {
      const obj = {
        0: "未处理",
        1: "采购审核",
        2: "财务审核",
        3: "审核完成",
        4: "作废"
      }
      return obj[status]
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      this.page.currentPage = page.currentPage
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.startTime = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endTime = this.searchFormConfirm.time[1]
      }
      if (this.searchFormConfirm.expecteTime && this.searchFormConfirm.expecteTime.length == 2) {
        this.searchFormConfirm.expertStartTime = this.searchFormConfirm.expecteTime[0]
        this.searchFormConfirm.expertEndTime = this.searchFormConfirm.expecteTime[1]
      }

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
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
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

    locationVerify(tip, status) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning(tip.t1)
        return {
          isOk: false,
          contractNoList: null
        }
      }
      let contractNoList = []
      let canDelect = true
      this.selectRows.forEach((item) => {
        //仅 未审核 可删除
        if (item.status !== status) {
          canDelect = false
          this.$message({
            type: "error",
            message: tip.t2 + item.requestAccountNo + tip.t3 + this.handleStatus(item.status) + tip.t4,
            duration: 5000
          })
        }
        contractNoList.push(item.requestAccountNo)
      })
      if (!canDelect) {
        return {
          isOk: false,
          contractNoList: null
        }
      }

      return {
        isOk: true,
        contractNoList: contractNoList
      }
    },
    handleDel() {
      tip.t4 = ",仅未处理状态可删除"

      let v = this.locationVerify(tip, 0)
      if (v.isOk) {
        this.$confirm("即将删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteBatch({ requestAccountNos: v.contractNoList }).then((response) => {
              if (response.data.code === 0) {
                // 手动调用清除选择
                this.$refs.crud.selectClear()
                this.getList(this.page)
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                })
              } else if (response.data.code === 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("删除失败")
                return
              }
              // this.getList(this.page);
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            })
          })
      }
    },
    submitSuccessTip(str) {
      this.$refs.crud.selectClear()
      this.searchChange(undefined, this.page)
      this.$notify({
        title: "提示",
        message: str,
        type: "success",
        duration: 5000
      })
    },
    submitVerify(id) {
      // 提交审核,撤销审核

      id = Number(id)
      if (id === 10) {
        tip.t4 = ",仅状态为未处理状态可操作"
        let v = this.locationVerify(tip, 0)
        if (v.isOk) {
          submitDataBatch({
            requestAccountNos: v.contractNoList
          }).then((res) => {
            if (res.data.code == 0) {
              this.submitSuccessTip("提交审核通过，当前状态为：采购审核")
            } else if (res.data.code == 1) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.error("修改失败")
            }
          })
        }
      } else if (id === 20) {
        tip.t4 = ",仅状态为采购审核态可操作"
        let v = this.locationVerify(tip, 1)
        if (v.isOk) {
          cancelSubmitBatch({
            requestAccountNos: v.contractNoList
          }).then((res) => {
            if (res.data.code == 0) {
              this.submitSuccessTip("撤销成功，当前状态为：未处理")
            } else if (res.data.code == 1) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.error("修改失败")
            }
          })
        }

        // alert("待提供:提交审核，撤销审核");
      }
    },
    changeStatus(id) {
      id = Number(id)
      let v = null
      if (id === 1) {
        // 采购审核
        tip.t4 = ",仅状态为采购审核可操作"
        v = this.locationVerify(tip, id)
        if (v.isOk) {
          this.verifyTitle = "采购审核"
          this.verifyModel = true
        }
      } else if (id === -1) {
        // 反审核
        this.verifyTitle = "反审核"
        tip.t4 = ",仅状态为财务审核可操作"

        v = this.locationVerify(tip, 2)
        if (v.isOk) {
          this.requestServive(
            {
              tip: "审核成功，当前状态：未处理",
              type: 2
            },
            v
          )
        }
        return
      } else if (id === 2) {
        // 财务审核
        tip.t4 = ",仅状态为财务审核可操作"
        this.verifyTitle = "财务审核"
        v = this.locationVerify(tip, id)
        if (v.isOk) {
          this.verifyModel = true
        }
      }
    },
    refuseOrPass(reasonId) {
      let v = {
        contractNoList: []
      }
      this.selectRows.forEach((val) => {
        v.contractNoList.push(val.requestAccountNo)
      })

      if (reasonId === 1) {
        // 拒绝
        if (!this.cancelReason.trim()) {
          this.$message.error("拒绝原因必填")
          return
        }
        this.requestServive(
          {
            tip: "已拒绝",
            type: 1
          },
          v,
          this.cancelReason
        )
      } else if (reasonId === 2) {
        // 通过

        this.requestServive(
          {
            tip: "审核通过",
            type: 0
          },
          v
        )
      }
    },
    requestServive(obj, v, reason) {
      let par = {
        requestAccountNos: v.contractNoList,
        type: obj.type
      }

      if (reason) {
        par.rejectReason = reason
      }

      let purchaseOrFinance = this.verifyTitle === "财务审核" ? financeVerify : purchaseVerify
      purchaseOrFinance(par).then((response) => {
        if (response.data.code == 0) {
          // 手动调用清除选择
          this.$refs.crud.selectClear()
          this.verifyModel = false
          this.searchChange(undefined, this.page)
          this.$notify({
            title: "提示",
            message: obj.tip,
            type: "success",
            duration: 5000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }
      })
    }
  }
}
</script>
