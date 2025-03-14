<template>
  <div id="accountsPayable-detail">
    <basic-container>
      <div>
        <el-form label-width="100px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="应付单号：">
                  <span>{{ detailForm.fBillNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商：" id="fPayOrgName">
                  <el-tooltip class="item" effect="dark" :content="detailForm.fSupplierName" placement="top-start">
                    <p>{{ detailForm.fSupplierName }}</p>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="立账类型：">
                  <span>{{ detailForm.fSetAccountTypeName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="来源：" prop="currency">
                  <div style="display: flex">
                    <!-- <span>{{detailForm.orderType === 'CROSS_ORG_TRANSFER' ? '跨组织调拨' : '货权转换'}}</span>
                    <span style="margin-left:10px;">{{$route.query.transferId}}</span> -->
                    <span>{{ detailForm.sourceMsg }}</span>
                    <router-link
                      style="margin-left: 20px; width: 50px"
                      :to="{
                        path: '/transfer/fristMileTransfer/detail',
                        query: { id: detailForm.sourceId, type: 'detail' }
                      }"
                      >查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算组织：" id="fPayOrgName">
                  <el-tooltip class="item" effect="dark" :content="detailForm.fSettleOrgName" placement="top-start">
                    <p>{{ detailForm.fSettleOrgName }}</p>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="到期日：">
                  <span>{{ detailForm.fEndDateH }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="成本调整：">
                  <span>{{ detailForm.fAllocationStatusName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务日期：">
                  <span>{{ detailForm.fDate }}</span>
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
              :option="accountsPayablePsdetailOption"
              @size-change="sizeChange"
              @on-load="getDetailOnload"
              :summaryMethod="getSummaries"
            >
              <template slot-scope="scope" slot="fFinancialBillNoList">
                <p v-for="item in scope.row.fFinancialBillNoList" :key="item">
                  <router-link
                    :to="{ path: '/financialStatements/cost/accountsPayableDetail/detail/', query: { fBillNo: item } }"
                  >
                    {{ item }}
                  </router-link>
                </p>
              </template>
              <template slot-scope="scope" slot="costBillNoList">
                <p v-for="item in scope.row.costBillNoList" :key="item">
                  <router-link
                    :to="{ path: '/financialStatements/cost/costAdjustmentDetail/detail/', query: { fBillNo: item } }"
                  >
                    {{ item }}
                  </router-link>
                </p>
              </template>
            </avue-crud>
          </div>
        </detail-wrapper>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { accountsPayablePsdetailOption, logOption } from "@/const/crud/financialStatements/index"
import { getDetail } from "@/api/financialStatements/index"
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
      accountsPayablePsdetailOption: accountsPayablePsdetailOption,
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
      const amountKey = ["fTaxPrice", "fFinancialPrice", "unadjustedCost", "adjustedCost"]
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
      // this.pages.pageSize = val
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
      getDetail({ fBillNo: fBillNo }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data.estimatedPayAbleDetailVo
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
#accountsPayable-detail {
  .esclipe {
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
