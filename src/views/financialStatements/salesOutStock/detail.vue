<template>
  <div id="purchaseInStock-detail">
    <basic-container>
      <div>
        <el-form label-width="80px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="出库单号" prop="fBillNo">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.fBillNo"
                    placeholder="暂无数据"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户" prop="fCustomerName">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.fCustomerName"
                    placeholder="暂无数据"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库日期" prop="fDate">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.fDate"
                    placeholder="暂无数据"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="PO号" prop="fOraPO" label-width="95px">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.fOraPO"
                    placeholder="暂无数据"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售组织" prop="fSaleOrgName">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.fSaleOrgName"
                    placeholder="暂无数据"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="来源" prop="source">
                  <div style="display: flex">
                    <span>{{ detailForm.sourceMsg }}</span>
                    <router-link
                      v-if="detailForm.sourceType === 'SALE'"
                      style="margin-left: 20px; width: 50px"
                      :to="{ path: '/order/invoiceManage/detail', query: { id: detailForm.sourceId } }"
                      >查看</router-link
                    >
                    <router-link
                      v-if="detailForm.sourceType === 'INNER_SALE'"
                      style="margin-left: 20px; width: 50px"
                      :to="{
                        path: '/transfer/fristMileTransfer/internalOrderDetail',
                        query: { internalTransactionOrderNo: detailForm.sourceNo }
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
            <div class="search">
              <el-cascader
                v-model="categoryId"
                size="small"
                :options="treeCategoryData"
                :props="{ checkStrictly: true }"
                :show-all-levels="false"
                placeholder="品类"
                clearable
              ></el-cascader>
              <el-input
                size="small"
                v-search-input-trim
                v-model="searchForm.skuCode"
                placeholder="商品编码"
                clearable
              ></el-input>
              <el-input
                size="small"
                v-search-input-trim
                v-model="searchForm.skuName"
                placeholder="商品名字"
                clearable
              ></el-input>
              <el-button type="primary" @click="searchChange" size="small">搜索</el-button>
            </div>
            <avue-crud ref="addSkuCrud" :data="detailList" :option="salesOutStockDetailOption">
              <template slot="fTaxPrice" slot-scope="scope">
                {{ detailForm.fSettleCurrSymbol + " " + scope.row.fTaxPrice }}
              </template>
              <template slot="fTaxAmount" slot-scope="scope">
                {{ detailForm.fSettleCurrSymbol + " " + scope.row.fTaxAmount }}
              </template>
              <template slot="fEntryTaxRate" slot-scope="scope">
                {{ scope.row.fEntryTaxRate.toFixed(2) * 100 + "%" }}
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
import { salesOutStockDetailOption, logOption } from "@/const/crud/financialStatements/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getDetail } from "@/api/financialStatements/psiStatements/salesOutStock"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getObjByType } from "@/api/admin/dict"
import { getAll } from "@/api/baseSetup/bsecorporation"
// import {

// } from '@/api/financialStatements/index'

import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {
        timeArr: []
      },
      pages: {
        total: 0,
        page: 1, // 当前页数新参数
        pageSize: 20 // 每页显示多少条
      },
      detailList: [],
      categoryId: [],
      treeCategoryData: [],
      currencyArr: [],
      corporationArr: [],
      auditStatus: [],
      syncStatus: [],
      salesOutStockDetailOption: salesOutStockDetailOption,
      logOption: logOption,
      logData: [],
      activeName: "first",
      searchForm: {
        category: "",
        skuCode: "",
        skuName: ""
      }
    }
  },
  created() {
    // 品类
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
      console.log("品类", this.treeCategoryData)
    })
    // 币种
    const params = {
      size: -1,
      current: -1
    }
    getCurrency(params).then((res) => {
      if (res.data.code === 0) {
        this.currencyArr = res.data.data.records
      }
    })
    getAll().then((res) => {
      if (res.data.code === 0) {
        this.corporationArr = res.data.data
      }
    })
    this.getDetailInfo()
    // this.getDetailList()
    const logParams = {
      bizId: 1,
      className: "getAllBizLog",
      size: 20
    }
    return
  },
  activated() {
    this.fBillNo = this.$route.query.fBillNo
    this.getDetail()
  },
  computed: {
    ...mapGetters(["permissions"]),
    supplierObj() {
      const result = {}
      this.supplierOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  methods: {
    removeEmptyProperties(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
            delete obj[key]
          }
        }
      }
    },
    fuzzyFilter(array, key, pattern) {
      const regex = new RegExp(pattern, "i")
      return array.filter((obj) => regex.test(obj[key]))
    },

    getDetail(params) {
      getDetail({
        fBillNo: this.fBillNo,
        ...params
      }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
          this.removeEmptyProperties(this.searchForm)
          let dataList = res.data.data.detailList
          if (this.searchForm.category) {
            dataList = dataList.filter((obj) => obj.category === this.searchForm.category)
          }
          if (this.searchForm.skuCode) {
            dataList = this.fuzzyFilter(dataList, "skuCode", this.searchForm.skuCode)
          }
          if (this.searchForm.skuName) {
            dataList = this.fuzzyFilter(dataList, "skuName", this.searchForm.skuName)
          }
          this.detailList = dataList
        }
      })
    },
    goEdit() {
      this.$router.push({
        path: `/purchase/organizeSettlement/edit`,
        query: {
          id: this.$route.query.id
        }
      })
    },
    sizeChange(val) {
      this.pages.pageSize = val
    },
    searchChange() {
      if (this.categoryId) {
        this.searchForm.category = this.categoryId[0]
      }
      this.getDetail(this.searchForm)
      console.log(this.searchForm)
    },
    searchReset() {},
    getDetailOnload(val) {
      this.pages.page = val.currentPage
      this.pages.pageSize = val.pageSize
      this.getDetailList()
    },
    toSearchDetail() {
      this.pages.page = 1
      this.getDetailList()
    },
    getDetailList() {
      return
    },
    getDetailInfo() {
      return
    }
  },
  components: {}
}
</script>

<style lang="scss">
#purchaseInStock-detail {
  .search {
    display: flex;

    .el-input {
      width: 150px;
      margin-right: 5px;
    }

    .el-button {
      margin-left: 5px;
    }
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
