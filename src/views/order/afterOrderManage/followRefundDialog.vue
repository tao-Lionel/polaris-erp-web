<template>
  <div>
    <div>
      <el-dialog
        class="followRefund"
        title="跟进退款"
        :visible="value"
        width="70%"
        @close="handleClose"
        @closed="formReset"
        @open="open"
      >
        <el-form ref="followRefundForm" :model="followRefundData" :rules="addOrUpdateRules" status-icon>
          <div class="iod-target-top border-rang y-prd-info" style="margin-bottom: 20px">
            <p class="iod-target target-title">工单信息</p>

            <div style="padding: 20px" class="flex4">
              <el-form-item class="f4-item" label="工单类型" prop="workOrderTypeName">
                <el-input size="small" v-search-input-trim readonly v-model="refundDetail.workOrderTypeName"></el-input>
              </el-form-item>
              <el-form-item class="f4-item" prop="reason" label="售后原因">
                <el-input size="small" v-search-input-trim readonly v-model="refundDetail.reason"></el-input>
              </el-form-item>
              <el-form-item class="f4-item" label="投诉原文" prop="complainOriginalText">
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="refundDetail.complainOriginalText"
                ></el-input>
              </el-form-item>
              <el-form-item class="f4-item" label="要点提取" prop="exchangeRate">
                <el-input
                  size="small"
                  v-search-input-trim
                  readonly
                  v-model="refundDetail.keyPointsExtractionText"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="iod-target-top border-rang y-prd-info">
            <p class="iod-target target-title">备注信息</p>

            <div style="padding: 20px" class="flex4">
              <avue-crud ref="crud" :data="refundDetail.remarkList" :option="remarkOption"> </avue-crud>
            </div>
          </div>

          <div class="iod-target-top border-rang y-prd-info" style="margin-top: 20px">
            <p class="iod-target target-title">原订单工单明细</p>
            <div style="padding: 20px">
              <div class="flex5" style="padding-bottom: 20px">
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="平台订单号"
                  prop="sourceCode"
                >
                  <el-input size="small" v-search-input-trim readonly v-model="refundDetail.sourceCode"></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="订单号"
                  prop="exchangeRate"
                >
                  <el-input size="small" v-search-input-trim readonly v-model="refundDetail.soOrderCode"></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="店铺"
                  prop="exchangeRate"
                >
                  <el-input size="small" v-search-input-trim readonly v-model="refundDetail.shopAccount"></el-input>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="交货模式"
                  prop="exchangeRate"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    readonly
                    v-model="refundDetail.soOrderBusinessType"
                  ></el-input>
                </el-form-item>
              </div>

              <avue-crud ref="refundCrud" :data="refundDetail.omsAfterSaleMainDetailMsgVos" :option="refundOption">
              </avue-crud>
            </div>
          </div>

          <div class="iod-target-top border-rang y-prd-info" style="margin-top: 20px">
            <p class="iod-target target-title">退款信息</p>

            <div style="padding: 20px" class="flex4">
              <el-form-item class="f4-item" label="总退款金额" prop="exchangeRate">
                <el-input size="small" v-search-input-trim disabled v-model="refundDetail.totalRefundAmount"></el-input>
              </el-form-item>
              <el-form-item class="f4-item" prop="refundMethod" label="退款方式">
                <el-select
                  v-model="followRefundData.refundMethod"
                  size="small"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option v-for="item in refundMethodList" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="f4-item" label="收款人姓名" prop="exchangeRate">
                <el-input size="small" v-search-input-trim clearable v-model="followRefundData.receiverName"></el-input>
              </el-form-item>
              <el-form-item class="f4-item" label="收款账号" prop="exchangeRate">
                <el-input
                  size="small"
                  v-search-input-trim
                  clearable
                  v-model="followRefundData.receiverAccount"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center">
          <el-button style="padding: 9px 30px" size="small" @click="handleClose">取 消</el-button>

          <el-button type="primary" size="small" style="padding: 9px 30px" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { tableOption, addDetailOption, refundOption, remarkOption } from "./index"

import { getRefundMsg, followUpOnRefund, listAllRefundMethod } from "@/api/order/afterOrderManage"
export default {
  name: "addDialog",
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },
    workOrderCode: {
      required: true,
      default: "",
      type: String
    }
  },

  data() {
    return {
      searchForm: {},
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      addOrderSearchForm: {
        skuCode: ""
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableOption: tableOption,
      addDetailOption: addDetailOption,
      refundOption: refundOption,
      remarkOption: remarkOption,
      refundDetail: {},
      followRefundData: {
        workOrderCode: "",
        refundMethod: "",
        receiverName: "",
        receiverAccount: ""
      },
      refundMethodList: [],
      addOrUpdateRules: {
        refundMethod: [{ required: true, message: "请选择退款方式", trigger: "blur" }]
      }
    }
  },
  created() {
    this.listAllRefundMethod()
  },

  methods: {
    open() {
      this.followRefundData.workOrderCode = this.workOrderCode
      this.getDetail(this.workOrderCode)
    },
    handleClose() {
      this.$emit("input", false)
    },
    formReset() {
      //方法2
      ;(this.followRefundData = {
        workOrderCode: "",
        refundMethod: "",
        receiverName: "",
        receiverAccount: ""
      }),
        this.$emit("input", false)
    },
    async listAllRefundMethod() {
      const { data } = await listAllRefundMethod()
      if (data.code === 0) {
        this.refundMethodList = data.data
      }
    },
    async getDetail(val) {
      const { data } = await getRefundMsg({
        workOrderCode: val
      })

      console.log("跟进退款数据", data.data)
      if (data.code == 0) {
        this.refundDetail = data.data
      }
    },
    async handleConfirm() {
      await this.$refs.followRefundForm.validate()
      const { data } = await followUpOnRefund(this.followRefundData)
      if (data.code == 0) {
        this.$message.success("提交成功")
        this.$emit("input", false)
        this.$emit("success")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex4 {
  display: flex;
  flex-wrap: wrap;
  .f4-item {
    width: 25%;
  }
}
.flex5 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
