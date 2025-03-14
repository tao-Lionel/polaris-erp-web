<template>
  <div id="containerLoadingPlanDetails">
    <basic-container>
      <h2 style="font-size: 18px; font-weight: bold; padding-bottom: 10px">排柜详情</h2>

      <detail-wrapper
        :options="{
          title: `基本信息`
        }"
      >
        <div class="details-box">
          <el-form :inline="true" :model="detailsData" class="demo-form-inline">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label-width="140px" label="采购单属性：">
                  <span>{{ detailsData.purchaseOrderAttribute == "DI" ? "DI订单" : "非DI订单" }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="排柜号：">
                  <span>{{ detailsData.deliveryPlanCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="状态：">
                  <span>{{ detailsData.documentStatusName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="出货柜号：">
                  <span>{{ detailsData.shippingContainerNo }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="type == 'DI'">
                <el-form-item label-width="140px" label="vendor code：">
                  <span>{{ detailsData?.vendorCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="起运港口：">
                  <span>{{ detailsData.departurePortName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" v-if="type == 'OTHER'" label="目的港口：">
                  <span>{{ detailsData.destinationPortName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="type == 'DI'">
                <el-form-item label-width="140px" label="目的地：">
                  <span>{{ detailsData.shipToParty }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="type == 'OTHER'">
                <el-form-item label-width="140px" label="采购单入库仓库：">
                  <span>{{ detailsData.warehouse }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="供应商送货单号：">
                  <span>{{ detailsData.deliveryNo }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label-width="140px" label="出货通知单号：">
                  <span>{{ detailsData.shippingNoticeNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="type == 'OTHER'">
                <el-form-item label-width="140px" label="头程调拨单号：">
                  <span>{{ detailsData.transferNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="预计装柜日期：">
                  <span>{{ detailsData.expectedLoadingDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="140px" label="期望上架日期：">
                  <span>{{ detailsData.expectedListDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="type == 'OTHER'">
                <el-form-item label-width="140px" label="海外仓所属区域：">
                  <span>{{ detailsData.overseasWarehouseRegionName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </detail-wrapper>

      <detail-wrapper
        :options="{
          title: `装载信息`
        }"
      >
        <div class="details-box">
          <el-form :inline="true" :model="detailsData" class="demo-form-inline">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label-width="140px" label="箱型/车型：">
                  <span>{{ detailsData.containerTypeName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="140px" label="SKU总数：">
                  <span>{{ detailsData.skuTypes }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="140px" label="SKU总件数：">
                  <span>{{ detailsData.skuQuantity }}</span>
                </el-form-item> </el-col
              ><el-col :span="6">
                <el-form-item label-width="140px" label="货物总体积：">
                  <span>{{ Math.ceil((detailsData.totalVolume / 1000000) * 100) / 100 }}m³</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="type == 'OTHER'">
                <el-form-item label-width="140px" label="是否加急：">
                  <span>{{ detailsData.urgentFlagName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="140px" label="装载率：">
                  <span>{{ detailsData.loadRate }}%</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="140px" label="装箱方案链接：">
                  <span>{{ detailsData.planUrl }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </detail-wrapper>

      <detail-wrapper
        :options="{
          title: `产品信息`
        }"
      >
        <div class="details-box">
          <avue-crud
            ref="crud"
            :data="detailsData.planDetailVOList"
            :option="tableOption"
            :summary-method="getSummaries"
          >
            <template slot="urgentFlag" scope="scope">
              <span>{{ scope.row.urgentFlag == 1 ? "是" : "否" }}</span>
            </template>
          </avue-crud>
        </div>
      </detail-wrapper>
      <detail-wrapper
        :options="{
          title: `操作日志`
        }"
      >
        <div class="details-box">
          <avue-crud ref="crud" :data="tableDataOperationLog" :option="detailsLogTableOption"> </avue-crud>
        </div>
      </detail-wrapper>
      <div class="btn-box" style="padding-bottom: 40px">
        <el-button size="small" @click="handleCancel">关 闭</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { diDetailsTableOption, notDiDetailsTableOption, detailsLogTableOption } from "./index.js"
import { getShipmentPlanDetail, containerLoadingLogPage } from "@/api/purchase/containerLoadingPlan/index.js"
import { getObjByType } from "@/api/admin/dict.js"
import { listPage } from "@/api/logistics/boxCarManage/index.js"
import { type } from "os"

export default {
  name: "containerLoadingPlanDetails",
  components: {},
  props: {},
  data() {
    return {
      tableOption: diDetailsTableOption,
      detailsLogTableOption: detailsLogTableOption,
      detailsData: {},
      type: "DI",
      shippingPlanList: [],
      tableDataOperationLog: [],
      relateId: "",
      boxCarTypeList: [],
      departureHarbourList: [],
      deliveryPlanCode: ""
    }
  },
  async created() {
    const { type, deliveryPlanCode, id } = this.$route.query
    this.relateId = id
    this.type = type
    this.deliveryPlanCode = deliveryPlanCode
    type === "DI" ? (this.tableOption = diDetailsTableOption) : (this.tableOption = notDiDetailsTableOption)
    this.getDetailsData()
    getObjByType("po_shipping_plan_status").then((res) => {
      if (res.data.code === 0) {
        this.shippingPlanList = res.data.data
      }
    })
    if (deliveryPlanCode) {
      const params = {
        size: 9999,
        current: 1,
        logType: 20,
        relateId: this.deliveryPlanCode
      }

      // 构造查询字符串
      const queryString = new URLSearchParams(params).toString()
      // return
      const { data } = await containerLoadingLogPage(queryString)
      if (data.code === 0) {
        this.tableDataOperationLog = data.data.records
      }
    }
    getObjByType("departure_harbour").then((res) => {
      if (res.data.code === 0) {
        this.departureHarbourList = res.data.data
      }
    })
    this.getBoxCarList()
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getBoxCarList() {
      listPage({
        page: 1,
        pageSize: 9999,
        filtering: [
          {
            field: "disabled",
            operator: "IN",
            value: [0]
          }
        ]
      }).then((res) => {
        if (res.data.code === 0) {
          this.boxCarTypeList = res.data.data.records
        }
      })
    },
    async getDetailsData() {
      const { deliveryPlanCode } = this.$route.query
      if (!deliveryPlanCode) return
      const { data } = await getShipmentPlanDetail(deliveryPlanCode)
      if (data.code == 0) {
        this.detailsData = data.data
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // 用于累加的函数，避免重复代码
      const calculateSum = (property) => {
        return data.reduce((sum, row) => {
          const value = row[property]
          const numericValue = value ? Number(value) : 0
          return sum + numericValue
        }, 0)
      }

      columns.forEach((column, index) => {
        switch (column.property) {
          case "skuOuterSize":
            sums[index] = "总计："
            break
          case "skuOuterVolume":
            sums[index] = calculateSum("skuOuterVolume")
            break
          case "skuOuterWeight":
            sums[index] = calculateSum("skuOuterWeight")
            break
          case "loadedQuantity":
            sums[index] = calculateSum("loadedQuantity")
            break
          case "inQuantity":
            sums[index] = calculateSum("inQuantity")
            break
          case "diffQuantity":
            sums[index] = calculateSum("diffQuantity")
            break
          default:
            sums[index] = ""
        }
      })
      return sums
    },

    handleCancel() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    getLabel(value, list) {
      const item = list.find((item) => item.value === value)
      return item ? item.label : ""
    },
    getNameByCode(code, list) {
      const item = list.find((item) => item.code === code)
      return item ? item.name : ""
    }
  }
}
</script>

<style lang="scss" scoped>
.group-condition {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}
.group-detail-table {
  padding: 20px;
  margin-bottom: 20px;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
  .group-title {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 10px;
  }
}
.el-form--inline .el-form-item {
  margin-bottom: 6px;
}
.btn-box {
  display: flex;
  justify-content: flex-end;
}
.details-box {
  padding: 20px;
  .det-content.el-row .el-col {
    border-right: none;
  }
}
#containerLoadingPlanDetails .avue-crud__menu {
  display: none;
}
</style>

<style lang="scss">
#containerLoadingPlanDetails .avue-crud__menu {
  display: none;
}
#containerLoadingPlanDetails .el-row .el-col {
  border-right: none !important;
}
</style>
