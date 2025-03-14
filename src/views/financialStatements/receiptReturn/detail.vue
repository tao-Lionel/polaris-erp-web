<template>
  <div id="accountsPayable-detail">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="详情" name="first">
          <div>
            <el-form label-width="80px" :model="detailForm" ref="detailForm">
              <detail-wrapper :options="{ title: '基本信息' }">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="退款单号" prop="listName">
                      <el-input
                        class="el-input--small"
                        v-model="detailForm.listName"
                        placeholder="请输入"
                        size="mini"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="收款单位" prop="corporationId">
                      <el-input
                        class="el-input--small"
                        v-model="detailForm.listName"
                        placeholder="请输入"
                        size="mini"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="业务类型" prop="currency">
                      <el-select
                        v-model="detailForm.auditStatus"
                        size="small"
                        placeholder="审核状态"
                        disabled
                        clearable
                      >
                        <el-option
                          v-for="item in auditStatus"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="PO号" prop="currency" label-width="95px">
                      <el-input
                        class="el-input--small"
                        v-model="detailForm.listName"
                        placeholder="请输入"
                        size="mini"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="销售组织" prop="currency">
                      <el-select v-model="detailForm.currency" size="small" placeholder="请选择" clearable disabled>
                        <el-option
                          v-for="item in currencyArr"
                          :key="item.currency"
                          :label="item.currency"
                          :value="item.currency"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="退款日期" prop="currency">
                      <el-select v-model="detailForm.currency" size="small" placeholder="请选择" clearable disabled>
                        <el-option
                          v-for="item in currencyArr"
                          :key="item.currency"
                          :label="item.currency"
                          :value="item.currency"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="收款单" prop="currency" label-width="95px">
                      <div style="display: flex">
                        <span style="margin-left: 10px">{{ $route.query.transferId }}</span>
                        <router-link
                          style="margin-left: 20px; width: 50px"
                          :to="{
                            path: '/transfer/fristMileTransfer/detail',
                            query: { id: $route.query.transferId, type: 'detail' }
                          }"
                          >查看</router-link
                        >
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="付款组织" prop="currency">
                      <el-select v-model="detailForm.syncStatus" size="small" placeholder="推送状态" disabled clearable>
                        <el-option v-for="item in syncStatus" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="来源" prop="currency">
                      <div style="display: flex">
                        <span>{{ detailForm.orderType === "CROSS_ORG_TRANSFER" ? "跨组织调拨" : "货权转换" }}</span>
                        <span style="margin-left: 10px">{{ $route.query.transferId }}</span>
                        <router-link
                          style="margin-left: 20px; width: 50px"
                          :to="{
                            path: '/transfer/fristMileTransfer/detail',
                            query: { id: $route.query.transferId, type: 'detail' }
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
                  :page="pages"
                  :data="detailList"
                  :option="receiptReturnDetailOption"
                  @size-change="sizeChange"
                  @on-load="getDetailOnload"
                >
                </avue-crud>
              </div>
            </detail-wrapper>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <!-- 操作日志 -->
          <div>
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '操作日志' }">
                <avue-crud ref="opeCrud" :data="logData" :option="logOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { receiptReturnDetailOption, logOption } from "@/const/crud/financialStatements/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getObjByType } from "@/api/admin/dict"
import { getAll } from "@/api/baseSetup/bsecorporation"
import {} from "@/api/financialStatements/index"

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
      receiptReturnDetailOption: receiptReturnDetailOption,
      logOption: logOption,
      logData: [],
      activeName: "first"
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
    getObjByType("org_settlement_price_audit_status").then((res) => {
      this.auditStatus = res.data.data
    })
    getObjByType("org_settlement_price_sync_status").then((res) => {
      this.syncStatus = res.data.data
    })
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
    getAllBizLog(logParams).then((res) => {
      if (res.data.code === 0) {
      }
    })
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
      this.searchForm.listId = this.$route.query.id
      poOrgSettlementPriceListDetail(
        Object.assign(
          {
            page: this.pages.page,
            pageSize: this.pages.pageSize
          },
          this.searchForm
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.pages.total = res.data.data.total
          this.detailList = res.data.data.records.map((item) => {
            return {
              skuCode: item.skuCode,
              skuName: item.skuName,
              productSize: item.skuSpecification,
              unitPrice: item.unitPrice
            }
          })
        }
      })
    },
    getDetailInfo() {
      return
      const id = this.$route.query.id
      getDetailInfo({ id: id }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
          this.$set(this.detailForm, "timeArr", [this.detailForm.effectiveTime, this.detailForm.failureTime])
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
