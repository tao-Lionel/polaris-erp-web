<template>
  <div>
    <basic-container>
      <div>
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '采购计划单',
            list: [
              { label: '采购计划号', value: form.purchasePlanCode },
              { label: '单据状态', value: form.documentStatusName },
              { label: '单据时间', value: form.documentTime },
              { label: '采购计划员', value: form.purchasePlanner }
            ]
          }"
        >
        </detail-template>

        <detail-wrapper :options="{ title: '基本信息' }">
          <el-form ref="formRef" :model="form" inline :rules="rules" label-suffix=":">
            <el-row>
              <el-col :span="8">
                <el-form-item label="单据类型">
                  {{ form.documentTypeName }}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="供应商">
                  {{ form.supplierName }}
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="计划单属性">
                  {{ form.planAttributesName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否下发数夫">
                  {{ form.needPushShufuFlag ? "是" : "否" }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="16">
                <el-form-item label="备注" prop="remark">
                  <div style="display: inline-flex; align-items: flex-end">
                    <el-input type="textarea" :rows="1" placeholder="备注" v-model="form.remark"> </el-input>

                    <el-button type="primary" size="small" @click="handleSaveRemarks" style="margin-left: 20px">
                      保存备注
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '产品信息', customContentStyle: { padding: '8px' } }">
          <avue-crud :data="tableData" :option="detailTableOption" :summaryMethod="getSummaries">
            <template slot="overseasWarehouseRegion" slot-scope="scope">
              {{ scope.row.overseasWarehouseRegionText }}
            </template>
          </avue-crud>
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
import { getPurchasePlanDetailApi, addPurchasePlanApi } from "@/api/purchase/procurementPlan"
import { getDictByType } from "@/util/auth.js"

export default {
  name: "procurementPlanDetail",
  components: {},
  data() {
    return {
      form: {
        purchasePlanCode: this.$route.query?.purchasePlanCode,
        documentType: "",
        supplierCode: "",
        planAttributes: "",
        remark: "",
        saveOperateType: "",
        id: undefined,
        needPushShufuFlag: ""
      },
      detailTableOption,
      tableData: [],
      logTableOption,
      logTableData: [],
      logPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      warehouseRegion: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {},
  activated() {
    this.getDetail()
    this.getLogList()
  },
  methods: {
    async getDetail() {
      this.warehouseRegion = await getDictByType("warehouse_region")
      const { data } = await getPurchasePlanDetailApi(this.form.purchasePlanCode)
      if (data.code === 0) {
        this.form = data.data
        this.form.needPushShufuFlag = data.data.issuedSoonforStatus === 5 ? false : true // 5: 无需下发数夫
        this.tableData = data.data.poPurchasePlanDetailList.map((item) => {
          return {
            ...item,
            overseasWarehouseRegionText: this.getOverseas(item)?.find(
              (f) => f.mappingCode === item.overseasWarehouseRegion
            )?.mappingName
          }
        })
      }
    },
    // 获取海外仓所属区域
    getOverseas(row) {
      return this.warehouseRegion.find((item) => item.value === row.site)?.dictMappings || []
    },

    // 获取日志
    async getLogList() {
      const { data } = await getLogListApi({
        current: this.logPage.currentPage,
        size: this.logPage.pageSize,
        logType: 22,
        relateId: this.form.purchasePlanCode
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
    // 保存备注
    async handleSaveRemarks() {
      const { data } = await addPurchasePlanApi({ ...this.form })
      if (data.code === 0) {
        this.$message.success("保存成功")
        this.getDetail()
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns?.forEach((column, index) => {
        if (column?.property === "linkSkuCode") {
          sums[index] = "汇总："
        }
        if (column?.property === "plannedQuantity") {
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
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
