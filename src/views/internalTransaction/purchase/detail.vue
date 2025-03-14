<template>
  <div id="internalPurchaseDetail">
    <basic-container>
      <div>
        <el-form label-width="85px" :model="detailForm" ref="detailForm">
          <detail-wrapper :options="{ title: '基本信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="单据单号：" label-width="85px" prop="listName">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.orderNo"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商：" prop="corporationId">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.supplierName"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态：" prop="currency" label-width="55px">
                  <el-select size="small" v-model="detailForm.orderStatus" placeholder="暂无数据" disabled>
                    <el-option
                      v-for="item in internalStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来源：" prop="currency" label-width="55px">
                  <div style="display: flex; flex-wrap: wrap">
                    <span>{{ detailForm.orderType === "CROSS_ORG_TRANSFER" ? "跨组织调拨" : "货权转换" }}</span>
                    <span style="margin-left: 10px">{{ detailForm.relationNo ? detailForm.relationNo : "" }}</span>
                    <a style="margin-left: 20px; width: 50px" @click="handleViewTransfer">查看</a>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="采购组织：" prop="currency">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.inOrgName"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓库：" prop="currency">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.warehouseName"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="交易日期：" prop="currency">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.transactionDate"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求组织：" prop="currency">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.outOrgName"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="应收金额：" prop="currency">
                  <el-input
                    class="el-input--small"
                    v-model="detailForm.amount"
                    placeholder="暂无数据"
                    size="small"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 商品信息 -->
      <div>
        <detail-wrapper :options="{ title: '商品明细' }">
          <div style="padding: 10px">
            <avue-crud
              ref="addSkuCrud"
              :page="pages"
              :data="detailList"
              :option="purchaseDetailOption"
              :summaryMethod="getSummaries"
              @size-change="sizeChange"
              @on-load="getDetailOnload"
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
                  <el-form-item style="margin-bottom: 10px">
                    <el-input
                      v-model="searchForm.skuCode"
                      clearable
                      placeholder="请输入商品编码"
                      size="small"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 10px">
                    <el-input
                      v-model="searchForm.skuName"
                      clearable
                      placeholder="请输入商品名称"
                      size="small"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 10px">
                    <el-button type="primary" @click="toSearchDetail" size="small">搜索</el-button>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="indexNum" slot-scope="scope">
                {{ scope.row.$index + 1 }}
              </template>
            </avue-crud>
          </div>
        </detail-wrapper>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { purchaseDetailOption } from "@/const/crud/internalTransaction/index"
import { getInternalDetailInfo, listPageDetail } from "@/api/internalTransaction/index"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getObjByType } from "@/api/admin/dict"

export default {
  name: "prdlcreate",
  data() {
    return {
      detailForm: {},
      searchForm: {},
      pages: {
        total: 0,
        page: 1, // 当前页数新参数
        pageSize: 20 // 每页显示多少条
      },
      detailList: [],
      categoryId: [],
      treeCategoryData: [],
      purchaseDetailOption: purchaseDetailOption,
      internalStatus: []
    }
  },
  created() {
    // 品类
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
    })
    getObjByType("internal_transaction_order_stats").then((res) => {
      if (res.data.code === 0) {
        this.internalStatus = res.data.data
      }
    })
    this.getDetailInfo()
  },
  computed: {},
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = ["planCount", "receivedCount", "amount", "taxAmount", "noneTaxAmount"]
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
    handleChange() {
      this.searchForm.categoryId = this.categoryId[this.categoryId.length - 1]
    },
    sizeChange(val) {
      this.pages.pageSize = val
    },
    getDetailOnload(val) {
      this.pages.page = val.currentPage
      this.pages.pageSize = val.pageSize
      if (this.searchForm.orderId) {
        this.getDetailList()
      }
    },
    toSearchDetail() {
      this.pages.page = 1
      this.getDetailList()
    },
    getDetailList() {
      listPageDetail(
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
          this.detailList = res.data.data.records
        }
      })
    },
    getDetailInfo() {
      const internalTransactionOrderNo = this.$route.query.internalTransactionOrderNo
      getInternalDetailInfo({ orderNo: internalTransactionOrderNo }).then((res) => {
        if (res.data.code === 0) {
          this.detailForm = res.data.data
          this.searchForm.orderId = this.detailForm.id
          this.getDetailList()
        }
      })
    },
    handleViewTransfer() {
      if (["SALE_RETURN", "SALE"].includes(this.detailForm.orderType)) {
        this.$router.push({
          path: "/order/invoiceManage/detail",
          query: {
            id: this.detailForm.relationId
          }
        })
      } else if (["PURCHASE_RETURN", "PURCHASE"].includes(this.detailForm.orderType)) {
        this.$router.push({
          path: "/transfer/fristMileTransfer/detail",
          query: {
            id: this.detailForm.relationId,
            type: "detail"
          }
        })
      }
    }
  }
}
</script>
