<template>
  <div>
    <basic-container>
      <div>
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '采购订单',
            list: [
              { label: '采购单号', value: form.purchaseOrderNo },
              { label: '单据状态', value: form.poOrderStatusName },
              { label: '单据时间', value: form.createTime },
              { label: '采购员', value: form.createName }
            ]
          }"
        >
        </detail-template>

        <detail-wrapper :options="{ title: '基本信息' }">
          <el-form :model="form" label-suffix=":">
            <el-row>
              <el-col :span="8">
                <el-form-item label="单据类型">
                  {{ form.purchaseDocumentTypeName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单据属性">
                  {{ form.purchaseAttributesName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否下发数夫">
                  {{ form.needPushShufuFlag ? "是" : "否" }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="采购组织">
                  {{ form.corporationName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="价格模式">
                  {{ priceModelOptions?.find((item) => item.value === form.priceModel)?.label }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算方式">
                  {{ form.settleaccountTypeName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="入库仓库">
                  {{ form.warehouseName }}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注">
                  {{ form.remarks }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '供应商交期' }">
          <el-form :model="form" label-suffix=":">
            <el-row>
              <el-col :span="8">
                <el-form-item label="供应商" prop="type">
                  {{ form.supplierName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售期望交期">
                  {{ form.planDelivery }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工厂预计交期(变更前)">
                  {{ form.factoryEstimatedDeliveryDateBefore }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="工厂预计交期(变更后)">
                  {{ form.factoryEstimatedDeliveryDate }}
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="变更原因">
                  {{ form.changeReason }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '产品信息', customContentStyle: { padding: '8px' } }">
          <avue-crud :data="tableData" :option="detailTableOption" :summaryMethod="getSummaries"> </avue-crud>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '操作日志', customContentStyle: { padding: '8px' } }">
          <avue-crud
            :data="logTableData"
            :option="logTableOption"
            :page="logPage"
            @current-change="currentChangeLog"
            @size-change="sizeChangeLog"
          >
          </avue-crud>
        </detail-wrapper>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { detailTableOption, logTableOption } from "./list"
import { fetchList as getLogListApi } from "@/api/purchase/log/purchaselog"
import { getPoOrderDetailApi } from "@/api/purchase/order/poorder"
import { getDictByType } from "@/util/auth"

export default {
  name: "purchasePoOrderDetail",
  components: {},
  data() {
    return {
      form: {},
      detailTableOption,
      tableData: [],
      logTableOption,
      logTableData: [],
      logPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      purchaserOrderNo: this.$route.query.purchaserOrderNo,
      priceModelOptions: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: async function () {
    this.getDetail()
    this.getLogList()
    this.priceModelOptions = await getDictByType("price_model")
  },
  activated() {},
  methods: {
    // 获取日志
    async getLogList() {
      const { data } = await getLogListApi({
        current: this.logPage.currentPage,
        size: this.logPage.pageSize,
        logType: 7,
        relateId: this.purchaserOrderNo
      })

      this.logTableData = data.data.records
      this.logPage.total = data.data.total
    },
    //当前第几页
    currentChangeLog(val) {
      this.logPage.currentPage = val
      this.getLogList()
    },
    //每页显示几条
    sizeChangeLog(val) {
      this.logPage.pageSize = val
      this.logPage.currentPage = 1
      this.getLogList()
    },
    // 获取详情
    async getDetail() {
      const { data } = await getPoOrderDetailApi({ purchaserOrderNo: this.purchaserOrderNo })
      if (data.code === 0) {
        this.form = data.data
        this.form.needPushShufuFlag = data.data.saleOrderIssuedSoonforStatus === 5 ? false : true // 5: 无需下发数夫
        this.tableData = data.data.list.map((item) => {
          return {
            ...item,
            totalAmount: (item.purchaseQuantity * item.noTaxPrice).toFixed(2)
          }
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const fields = ["plannedQuantity", "purchaseQuantity", "totalAmount"]
      columns?.forEach((column, index) => {
        if (column?.property === "noTaxPrice") {
          sums[index] = "汇总："
        }
        if (fields.includes(column?.property)) {
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
            if (column?.property === "totalAmount") {
              sums[index] = sums[index].toFixed(2)
            }
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
