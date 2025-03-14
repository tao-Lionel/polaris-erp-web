<template>
  <div id="accountsPayable-detail">
    <basic-container>
      <div>
        <el-form label-width="90px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="收款单号：" prop="listName">
                  <span>{{ detailForm.fBillNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付款单位：" prop="corporationId">
                  <p>{{ detailForm.fPayUnitName }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务类型：" prop="currency">
                  <span>{{ detailForm.fBusinessTypeName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="PO号：" prop="currency" label-width="95px">
                  <span>{{ detailForm.fOraPo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收款组织：" prop="currency" id="fPayOrgName">
                  <el-tooltip class="item" effect="dark" :content="detailForm.fPayOrgName" placement="top-start">
                    <p class="esclipe">{{ detailForm.fPayOrgName }}</p>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收款日期：" prop="currency">
                  <span>{{ detailForm.fDate }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="来源：" prop="currency">
                  <div style="display: flex">
                    <span>{{ detailForm.sourceMsg }}</span>
                    <router-link
                      style="margin-left: 20px; width: 50px"
                      :to="{
                        path: '/order/orderManages/detail',
                        query: { id: detailForm.sourceId }
                      }"
                      >查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 费用明细 -->
      <div>
        <detail-wrapper :options="{ title: '费用明细' }">
          <div style="padding: 10px">
            <avue-crud
              ref="addSkuCrud"
              :data="detailForm.detail"
              :option="receiptDetailOption"
              :summaryMethod="getSummaries"
            >
            </avue-crud>
          </div>
        </detail-wrapper>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { receiptDetailOption, logOption } from "@/const/crud/financialStatements/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getObjByType } from "@/api/admin/dict"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { finReceiveBillDetail } from "@/api/financialStatements/index"

import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {
        detail: []
      },
      pages: {
        total: 0,
        page: 1, // 当前页数新参数
        pageSize: 20 // 每页显示多少条
      },
      receiptDetailOption: receiptDetailOption,
      logOption: logOption,
      logData: [],
      activeName: "first"
    }
  },
  created() {
    this.getDetailInfo()
    const logParams = {
      bizId: 1,
      className: "getAllBizLog",
      size: 20
    }
    return
    getAllBizLog(logParams).then((res) => {
      if (res.data.code === 0) {
      }
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = ["fAfttaxTotalAmount"]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (amountKey.includes(column.property)) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = "-/-"
          }
        }
      })
      return sums
    },
    sizeChange(val) {
      this.pages.pageSize = val
    },
    getDetailOnload(val) {
      // this.pages.page = val.currentPage
      // this.pages.pageSize = val.pageSize
    },
    toSearchDetail() {
      // this.pages.page = 1
    },
    getDetailInfo() {
      const fBillNo = this.$route.query.fBillNo
      finReceiveBillDetail({ fBillNo: fBillNo }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
#accountsPayable-detail {
  #fPayOrgName .el-form-item__content {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .esclipe {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    line-height: 20px;
  }
  .el-card__body {
    padding: 10px 20px 20px;
  }
  #el-form-item .el-form-item__content {
    line-height: normal;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }
  .el-range-editor.is-disabled input {
    color: #000;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    color: #000;
  }
}
</style>
