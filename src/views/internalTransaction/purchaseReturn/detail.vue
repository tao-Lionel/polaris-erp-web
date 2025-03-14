<template>
  <div id="accountsPayable-detail">
    <basic-container>
      <div>
        <el-form label-width="85px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="8">
                <el-form-item label="单据单号:">
                  <p>{{ detailForm.orderNo }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商:">
                  <p>{{ detailForm.supplierName }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收货仓:">
                  <p>{{ detailForm.warehouseName }}</p>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="来源:">
                  <div style="display: flex">
                    <!-- <span>{{detailForm.orderType === 'CROSS_ORG_TRANSFER' ? '跨组织调拨' : '货权转换'}}</span> -->
                    <span style="margin-left: 10px">{{ detailForm.orderTypeName }}</span>
                    <!-- <router-link style="margin-left:20px;width:50px;" 
                      :to="{
                        path: '/transfer/fristMileTransfer/detail',
                        query: { id: $route.query.transferId, type: 'detail'}
                      }">查看</router-link> -->
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退货组织:">
                  <p>{{ detailForm.inOrgName }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退货仓:">
                  <p>{{ detailForm.warehouseName }}</p>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="退货时间:">
                  <p>{{ detailForm.transactionDate }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="内部采购订单:" label-width="105px">
                  <div style="display: flex">
                    <span style="margin-right: 10px">{{ detailForm.orderNo }}</span>
                    <router-link
                      :to="{
                        path: '/transaction/purchaseDetail/detail',
                        query: { internalTransactionOrderNo: detailForm.orderNo }
                      }"
                    >
                      查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 商品明细 -->
      <div>
        <detail-wrapper :options="{ title: '商品明细' }">
          <div style="padding: 10px">
            <avue-crud
              ref="addSkuCrud"
              :data="detailList"
              :option="purchaseReturnDetailOption"
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
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { purchaseReturnDetailOption } from "@/const/crud/internalTransaction/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getObjByType } from "@/api/admin/dict"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getReturnDetail } from "@/api/internalTransaction/index"

import { getAll as getAllSupplier } from "@/api/supplier/posupplier"

import { deepClone } from "../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {},
      searchForm: {
        category: "",
        skuCode: "",
        skuName: ""
      },
      detailList: [],
      categoryId: [],
      treeCategoryData: [],
      purchaseReturnDetailOption: purchaseReturnDetailOption
    }
  },
  created() {
    // 品类
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
    })
    // getAll().then(res => {
    //   if (res.data.code === 0) {
    //     this.corporationArr = res.data.data
    //   }
    // })
    this.getDetailInfo()
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
      const amountKey = ["oriPurchaseCount", "receivedCount", "returnAmount"]
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
    getDetailInfo() {
      const orderNo = this.$route.query.orderNo
      getReturnDetail({ orderNo: orderNo }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
          this.detailList = deepClone(this.detailForm.detail)
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
#accountsPayable-detail {
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
