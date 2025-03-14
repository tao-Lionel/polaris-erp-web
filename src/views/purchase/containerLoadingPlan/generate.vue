<template>
  <div id="containerLoadingPlanGenerate">
    <basic-container>
      <h2 style="font-size: 18px; font-weight: bold; padding-bottom: 10px">生成排柜计划</h2>

      <detail-wrapper
        :options="{
          title: `分组条件`,
          subTitle: `(系统会根据分组条件，拆分为不同的组别。同一组的商品才会装在同一柜子里，不同组的商品会装在不同的柜子里)`
        }"
      >
        <div class="group-condition">
          <div v-if="type === 'OTHER'">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :disabled="type === 'OTHER'" label="purchaseOrderAttribute">采购单属性 </el-checkbox>
              <el-checkbox :disabled="type === 'OTHER'" label="site">站点</el-checkbox>
              <el-checkbox :disabled="type === 'OTHER'" label="purchaseOrganizationName">采购组织</el-checkbox>
              <el-checkbox :disabled="type === 'OTHER'" label="warehouseId">入库仓库</el-checkbox>
              <el-checkbox label="platform">平台</el-checkbox>
              <el-checkbox label="factoryEstimatedDeliveryDate">工厂预计交期</el-checkbox>
              <el-checkbox label="skuCategoryName">产品分类</el-checkbox>
              <el-checkbox label="skuCode">工厂SKU</el-checkbox>
              <el-checkbox label="supplierName">供应商</el-checkbox>
              <el-checkbox label="overseasWarehouseRegion">海外仓所属区域</el-checkbox>
              <el-checkbox label="urgentFlag">是否加急</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else>
            <el-checkbox-group v-model="checkList">
              <el-checkbox :disabled="type === 'DI'" label="purchaseOrderAttribute">采购单属性 </el-checkbox>
              <el-checkbox :disabled="type === 'DI'" label="site">站点</el-checkbox>
              <el-checkbox label="skuCategoryName">产品分类</el-checkbox>
              <el-checkbox label="skuCode">工厂SKU</el-checkbox>
              <el-checkbox label="asin">ASIN</el-checkbox>
              <el-checkbox label="platformOrderCode">平台订单号</el-checkbox>
              <el-checkbox label="shipWindowLeft">最早发货窗口</el-checkbox>
              <el-checkbox label="vendorCode">vendor code</el-checkbox>
              <el-checkbox label="destination">目的地</el-checkbox>
            </el-checkbox-group>
          </div>

          <el-button style="margin-left: 20px" type="primary" size="small" @click="confirmGroupCondition(true)"
            >确定分组条件</el-button
          >
        </div>
      </detail-wrapper>

      <detail-wrapper
        :options="{
          title: `分组详情`
        }"
      >
        <div style="padding: 20px">
          <el-form ref="generateForm" :inline="true" :model="{ groupsData }" class="demo-form-inline" :rules="rules">
            <div class="group-detail-table" v-for="(group, index) in groupsData" :key="index">
              <p class="group-title">第{{ index + 1 }}组：</p>

              <div class="group-from">
                <el-form-item label-width="120px" label="起运港口">
                  <el-select size="small" clearable filterable v-model="group.departurePort" placeholder="起运港口">
                    <el-option
                      v-for="item in departureHarbourList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="120px" label="目的港口" v-if="type === 'OTHER'">
                  <el-select size="small" clearable filterable v-model="group.destinationPort" placeholder="目的港口">
                    <el-option
                      v-for="item in departureHarbourList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="预计装柜日期"
                  :prop="`groupsData[${index}].expectedLoadingDate`"
                  :rules="rules.expectedLoadingDate"
                >
                  <el-date-picker
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="group.expectedLoadingDate"
                    type="date"
                    clearable
                    placeholder="预计装柜日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="期望上架日期"
                  :prop="`groupsData[${index}].expectedListDate`"
                  :rules="rules.expectedListDate"
                >
                  <el-date-picker
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="group.expectedListDate"
                    type="date"
                    clearable
                    placeholder="期望上架日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="箱型/车型"
                  :prop="`groupsData[${index}].containerType`"
                  :rules="rules.containerType"
                >
                  <el-select size="small" clearable filterable v-model="group.containerType" placeholder="箱型/车型">
                    <el-option
                      v-for="item in boxCarTypeList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  :prop="`groupsData[${index}].loadRate`"
                  label="装载率"
                  :rules="rules.loadRate"
                >
                  <el-input size="small" clearable v-model="group.loadRate" placeholder="">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>

                <avue-crud
                  ref="crud"
                  :data="group.groupResultList"
                  :option="tableOption"
                  :summary-method="getSummaries"
                >
                  <template slot="urgentFlag" scope="scope">
                    <span>{{ scope.row.urgentFlag == "0" ? "正常" : "加急" }}</span>
                  </template>
                  <template slot="purchaseOrderAttribute" scope="scope">
                    <span>{{ scope.row.purchaseOrderAttribute == "OTHER" ? "非DI" : "DI" }}</span>
                  </template>
                  <template slot="planQuantity" scope="scope">
                    <el-form-item
                      :prop="`groupsData[${index}].groupResultList[${scope.row.$index}].planQuantity`"
                      :rules="[
                        {
                          ...rules.planQuantity[0],
                          row: scope.row
                        }
                      ]"
                    >
                      <el-input size="mini" clearable v-model="scope.row.planQuantity" placeholder="请输入"></el-input>
                    </el-form-item>
                  </template>
                  <template slot="action" scope="scope">
                    <a @click="handleDelete(scope.row, index, scope.row.$index)"> 删除 </a>
                  </template>
                </avue-crud>
              </div>
            </div>
          </el-form>
        </div>
      </detail-wrapper>
      <p class="btn-box" style="padding-bottom: 20px">
        <el-button size="small" type="primary" @click="downloadTemplate">下载模版文件</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="permissions.purchase_container_import_plan"
          @click="handleImportPlan"
        >
          导入装箱方案
        </el-button>
        <!-- <el-button type="primary" size="small" @click="handleGeneratePlan"> 生成装箱方案 </el-button> -->
        <el-button size="small" @click="handleCancel"> 取消 </el-button>
      </p>
    </basic-container>
    <!-- <PackingPlanConfirm
      ref="PackingPlanConfirm"
      :boxCarTypeList="boxCarTypeList"
      :shippingPlanList="shippingPlanList"
    ></PackingPlanConfirm> -->

    <ImportPlan ref="ImportPlan"></ImportPlan>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { notDiGenerateTableOption, diGenerateTableOption } from "./index.js"
import {
  getNormalPlanGroupList,
  getDiPlanGroupList,
  calculateVehicle
} from "@/api/purchase/containerLoadingPlan/index.js"
import ImportPlan from "./dialogComponents/importPlan.vue"
import { getObjByType } from "@/api/admin/dict.js"
import { listPage } from "@/api/logistics/boxCarManage/index.js"
import { cloneDeep } from "lodash"
import { exportGroupList } from "@/api/purchase/containerLoadingPlan/index.js"
import { downloadBlob } from "@/util/auth"

export default {
  name: "containerLoadingPlanGenerate",
  components: { ImportPlan },
  data() {
    return {
      //确定的搜索条件
      tableData: [],

      tableOption: diGenerateTableOption,
      activeName: "first",
      checkList: [],
      formInline: {
        user: "",
        region: ""
      },
      type: "",
      groupsData: [],
      ids: [],
      initGroupData: [],
      boxCarTypeList: [],
      departureHarbourList: [],
      shippingPlanList: [],
      rules: {
        expectedLoadingDate: [
          {
            required: true,
            message: "请输入预计装柜日期",
            trigger: "blur"
          }
        ],
        expectedListDate: [
          {
            required: true,
            message: "请输入期待上架日期",
            trigger: "blur"
          }
        ],
        containerType: [
          {
            required: true,
            message: "请选择箱型/车型",
            trigger: "blur"
          }
        ],
        loadRate: [
          {
            required: true,
            message: "请输入装载率",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value !== undefined && value !== null && value !== "") {
                const numValue = Number(value)
                if (isNaN(numValue)) {
                  callback(new Error("装载率必须是数字"))
                } else if (numValue <= 0) {
                  callback(new Error("装载率必须大于0"))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: ["blur", "change"]
          }
        ],
        planQuantity: [
          {
            validator: (rule, value, callback) => {
              const pendingQuantity = rule.row.pendingQuantity // 获取当前行的待排数量
              if (value !== undefined && value !== null && value !== "") {
                const numValue = Number(value)
                if (isNaN(numValue)) {
                  callback(new Error("请输入数字"))
                } else if (numValue <= 0) {
                  callback(new Error("数量必须大于0"))
                } else if (numValue > pendingQuantity) {
                  callback(new Error(`数量不能超过待排数量 (${pendingQuantity})`))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: ["blur", "change"]
          },
          {
            required: true,
            message: "请输入本次计划排柜数量",
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    const { type } = this.$route.query

    this.ids = JSON.parse(localStorage.getItem("containerIds"))
    this.type = type
    if (type === "OTHER") {
      this.tableOption = notDiGenerateTableOption
      this.checkList = ["purchaseOrderAttribute", "site", "purchaseOrganizationName", "warehouseId"]
      this.getNotDiGroupList(this.ids)
    } else {
      this.tableOption = diGenerateTableOption
      this.checkList = ["purchaseOrderAttribute", "site"]
      this.getDiGroupList(this.ids)
    }
    // getObjByType("box_car_type_manage").then((res) => {
    //   if (res.data.code === 0) {
    //     this.boxCarTypeList = res.data.data
    //   }
    // })
    getObjByType("departure_harbour").then((res) => {
      if (res.data.code === 0) {
        this.departureHarbourList = res.data.data
      }
    })
    getObjByType("po_shipping_plan_status").then((res) => {
      if (res.data.code === 0) {
        this.shippingPlanList = res.data.data
      }
    })
    this.getBoxCarList()
  },
  mounted() {},
  destroyed() {
    localStorage.removeItem("containerIds")
  },
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
          this.boxCarTypeList = res.data.data.records.filter(
            (record, index, self) => self.findIndex((r) => r.code === record.code) === index
          )
        }
      })
    },
    async calculateVehicle() {
      const postData = this.groupsData.map((item) => {
        return {
          groupId: item.groupId,
          site: item.site,
          volume: item.groupResultList.reduce((sum, row) => sum + (row.outerBoxVolume || 0), 0),
          weight: item.groupResultList.reduce((sum, row) => sum + (row.boxGrossWeight || 0), 0)
        }
      })
      console.log("postData", postData)
      if (postData.length === 0) return
      calculateVehicle(postData).then((res) => {
        if (res.data.code === 0) {
          console.log("res", res.data.data)
          const boxCarTypeData = res.data.data
          this.groupsData = this.groupsData.map((item, index) => {
            return {
              ...item,
              containerType: boxCarTypeData.find((i) => i.groupId == item.groupId)?.code
            }
          })
        }
      })
    },
    async getNotDiGroupList(ids) {
      const { data } = await getNormalPlanGroupList({
        poOrderDetailExtensionIdList: ids || []
      })
      if (data.code == 0) {
        this.initGroupData = data.data.map((item) => {
          return {
            ...item,
            planQuantity: item.pendingQuantity
          }
        })
        this.groupsData = [
          {
            groupId: 0,
            departurePort: "",
            destinationPort: "",
            expectedLoadingDate: "",
            expectedListDate: "",
            containerType: "",
            loadRate: 0,
            groupResultList: data.data.map((item) => {
              return {
                ...item,
                planQuantity: item.pendingQuantity
              }
            })
          }
        ]

        this.confirmGroupCondition()
      }
    },
    async getDiGroupList(ids) {
      const { data } = await getDiPlanGroupList({
        diOrderItemIdList: ids || []
      })
      if (data.code == 0) {
        this.initGroupData = data.data.map((item) => {
          return {
            ...item,
            planQuantity: item.pendingQuantity
          }
        })

        this.groupsData = [
          {
            groupId: 0,
            departurePort: "",
            destinationPort: "",
            expectedLoadingDate: "",
            expectedListDate: "",
            containerType: "",
            groupResultList: data.data.map((item) => {
              return {
                ...item,
                planQuantity: item.pendingQuantity
              }
            })
          }
        ]
        this.confirmGroupCondition()
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let totalPendingQuantity = 0
      let totalPlanQuantity = 0
      let totalOuterBoxVolume = 0
      let totalBoxGrossWeight = 0
      columns.forEach((column, index) => {
        if (column.property === "urgentFlag") {
          sums[index] = "总计："
        } else if (column.property === "pendingQuantity") {
          totalPendingQuantity = data.reduce((sum, row) => sum + (row.pendingQuantity || 0), 0)
          sums[index] = totalPendingQuantity
        } else if (column.property === "planQuantity") {
          totalPlanQuantity = data.reduce((sum, row) => {
            const value = row.planQuantity
            const numericValue = value ? Number(value) : 0
            return sum + numericValue
          }, 0)
          sums[index] = totalPlanQuantity
        } else if (column.property === "outerBoxVolume") {
          // 累加 outerBoxVolume 的值，并确保转换为数字
          totalOuterBoxVolume = data.reduce((sum, row) => {
            const value = row.outerBoxVolume
            const numericValue = value ? Number(value) : 0
            return sum + numericValue
          }, 0)
          const m3Volume = (totalOuterBoxVolume / 1000000).toFixed(5)
          const roundedM3Volume = Math.ceil(m3Volume * 10000) / 10000
          sums[index] = `${totalOuterBoxVolume}cm³ / ${roundedM3Volume.toFixed(4)}m³`
        } else if (column.property === "boxGrossWeight") {
          // 累加 boxGrossWeight 的值，并确保转换为数字
          totalBoxGrossWeight = data.reduce((sum, row) => {
            const value = row.boxGrossWeight
            const numericValue = value ? Number(value) : 0
            return sum + numericValue
          }, 0)
          sums[index] = `${totalBoxGrossWeight.toFixed(4)}kg`
        }
      })

      return sums
    },
    confirmGroupCondition(check) {
      const groupedData = this.groupBy(this.initGroupData, this.checkList)
      console.log("groupedDatagroupedData", groupedData)
      const groupedArray = Object.values(groupedData)
      console.log("groupedArray", groupedArray)
      this.groupsData = groupedArray.map((item, index) => {
        console.log("===>", item?.[0]?.containerType)
        return {
          groupId: index + 1,
          departurePort: "",
          destinationPort: "",
          expectedLoadingDate: "",
          expectedListDate: "",
          containerType: item?.[0]?.containerType || "",
          site: item[0].site || "",
          groupResultList: item
        }
      })
      check && this.$message.success("分组成功！")
      this.calculateVehicle()
    },
    groupBy(data, groupFields) {
      return data.reduce((result, item) => {
        const groupKey = groupFields.map((field) => item[field]).join("&")
        if (!result[groupKey]) {
          result[groupKey] = []
        }
        result[groupKey].push(item)
        return result
      }, {})
    },
    handleCancel() {
      localStorage.removeItem("containerIds")
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    async downloadTemplate() {
      // await this.$refs.generateForm?.validate()
      const postData = cloneDeep(this.groupsData)
      postData.forEach((item) => {
        item.loadRate = Number(item.loadRate)
        item.containerType = this.boxCarTypeList.find((i) => i.code == item.containerType)?.name
      })
      const { data } = await exportGroupList(postData)
      console.log("data")
      downloadBlob(data, "排柜分组信息.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    handleImportPlan() {
      this.$refs.ImportPlan?.handleOpenDialog(this.groupsData, this.boxCarTypeList, this.departureHarbourList)
    },
    // 打开确认方案
    handleGeneratePlan() {
      this.$refs.PackingPlanConfirm?.handleOpenDialog(this.groupsData)
    },
    handleDelete(row, fIndex, index) {
      const groupList = this.groupsData[fIndex].groupResultList
      if (groupList.length === 1) {
        this.$message.warning("最后一条记录无法删除！")
        return
      }
      groupList.splice(index, 1)
      this.$message.success("删除成功！")
    }
  }
}
</script>

<style lang="scss" scoped>
#containerLoadingPlanGenerate {
  margin-bottom: 40px;
  .el-table__body-wrapper td {
    padding: 0px 2px !important;
  }
  .el-table .el-table__body-wrapper .el-form-item {
    margin-bottom: 0px;
  }
}
.header {
  position: fixed;
  background: #fff;
  z-index: 666;
  width: calc(100% - 260px);
  left: 230px;
  top: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #efefef;
  padding: 20px;
  box-sizing: border-box;

  .header-main {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
.group-condition {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}
.group-detail-table {
  border: 1px solid #ccc;
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
</style>

<style lang="scss">
#containerLoadingPlanGenerate {
  margin-bottom: 40px;
  .el-table__body-wrapper td {
    padding: 6px 2px !important;
  }
}
</style>
