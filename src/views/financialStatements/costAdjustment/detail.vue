<template>
  <div id="accountsPayable-detail">
    <basic-container>
      <div>
        <el-form label-width="80px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="调整单号">
                  <span>{{ detailForm.fBillNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="库存组织" id="fPayOrgName">
                  <el-tooltip class="item" effect="dark" :content="detailForm.fCreateOrgName" placement="top-start">
                    <p class="esclipe">{{ detailForm.fCreateOrgName }}</p>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="调整金额(结算币)" label-width="120px">
                  <span>{{ detailForm.fSettleCurrencySymbol }}{{ detailForm.fPrice }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="应付单" label-width="95px">
                  <div style="display: flex">
                    <span style="margin-left: 10px">{{ detailForm.fPayableBillNo }}</span>
                    <router-link
                      style="margin-left: 20px; width: 50px"
                      :to="{
                        path: '/financialStatements/cost/accountsPayableDetail/psdetail',
                        query: { fBillNo: detailForm.fPayableBillNo, type: 'detail' }
                      }"
                      >查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓库">
                  <span>{{ detailForm.fStockName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="调整金额(本位币)" label-width="120px">
                  <span>{{ detailForm.fLocalCurrencySymbol }}{{ detailForm.fCurrPrice }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="来源">
                  <div style="display: flex">
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
                <el-form-item label="业务日期">
                  <span>{{ detailForm.fDate }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 调整明细 -->
      <div>
        <detail-wrapper :options="{ title: '调整明细' }">
          <div style="padding: 10px">
            <avue-crud
              ref="addSkuCrud"
              :data="detailList"
              :option="costAdjustmentDetailOption"
              :summaryMethod="getSummaries"
            >
              <template slot="tableBeforeSlot">
                <el-form inline>
                  <el-form-item class="rig-ali" prop="categoryId" id="el-form-item" style="margin-bottom: 10px">
                    <el-cascader
                      expand-trigger="hover"
                      v-model="categoryId"
                      :show-all-levels="false"
                      :options="treeCategoryData"
                      @change="handleChange"
                      clearable
                      size="small"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-input v-model="searchForm.skuCode" clearable placeholder="请输入商品编码"></el-input>
                  </el-form-item>
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-input v-model="searchForm.skuName" clearable placeholder="请输入商品名称"></el-input>
                  </el-form-item>
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-button type="primary" @click="toSearchDetail" size="small">搜索</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </avue-crud>
          </div>
        </detail-wrapper>
      </div>

      <!-- 操作日志 -->
      <!-- <div>
        <el-form
          label-width="70px"
          class="demo-form-inline"
        >
          <detail-wrapper :options="{title:'操作日志'}">
            <avue-crud ref="opeCrud" :data="logData" :option="logOption">
            </avue-crud>  
          </detail-wrapper> 
        </el-form>
      </div> -->
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { costAdjustmentDetailOption, logOption } from "@/const/crud/financialStatements/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getObjByType } from "@/api/admin/dict"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { finStockCostAdjustmentDetail } from "@/api/financialStatements/index"
import { deepClone } from "../../../util/util"

export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {
        detail: []
      },
      searchForm: {
        category: "",
        skuCode: "",
        skuName: ""
      },
      pages: {
        total: 0,
        page: 1, // 当前页数新参数
        pageSize: 20 // 每页显示多少条
      },
      amountKey: [],
      categoryId: [],
      detailList: [],
      treeCategoryData: [],
      costAdjustmentDetailOption: costAdjustmentDetailOption,
      logOption: logOption,
      logData: [],
      activeName: "first"
    }
  },
  created() {
    // 品类
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
    })
    // 币种
    const params = {
      size: -1,
      current: -1
    }
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
    handleChange(value) {
      this.searchForm.category = value[value.length - 1]
    },
    toSearchDetail() {
      let index = 0
      for (let key in this.searchForm) {
        if (this.searchForm[key]) {
          let detail = index > 0 ? this.detailList : this.detailForm.detail
          this.detailList = detail.filter((item) => {
            return item[key] == this.searchForm[key]
          })
          index++
        }
      }
      if (!index) {
        this.detailList = this.detailForm.detail
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
          return
        }
        if (this.amountKey.includes(column.property)) {
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
    getDetailInfo() {
      const fBillNo = this.$route.query.fBillNo
      finStockCostAdjustmentDetail({ fBillNo: fBillNo }).then((res) => {
        if (res.data.code === 0) {
          let detailForm = res.data.data
          let arr = detailForm.detail
          let columnArr = []
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].costAdjustmentDetail.length; j++) {
              arr[i][arr[i].costAdjustmentDetail[j].fExpenseId] = arr[i].costAdjustmentDetail[j].fAdjustmentAmount
              const status = columnArr.some((item) => item.prop === arr[i].costAdjustmentDetail[j].fExpenseId)
              if (!status) {
                columnArr.push({
                  label: arr[i].costAdjustmentDetail[j].fExpenseName,
                  prop: arr[i].costAdjustmentDetail[j].fExpenseId,
                  sortable: false
                })
              }
            }
          }
          this.costAdjustmentDetailOption.column[4].children = columnArr
          this.amountKey = columnArr.map((item) => item.prop)
          this.detailForm = detailForm
          this.detailList = deepClone(detailForm.detail)
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
