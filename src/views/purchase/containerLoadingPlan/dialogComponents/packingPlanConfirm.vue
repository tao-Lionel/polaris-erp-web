<template>
  <el-dialog title="装箱方案确认" :visible.sync="dialogVisible" top="5vh" width="70%" append-to-body>
    <AllocateDetails ref="AllocateDetails"></AllocateDetails>

    <div class="dialog-box-content">
      <p>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </p>
      <el-form :inline="true" class="demo-form-inline" :rules="rules">
        <div class="table-group" v-for="(item, index) in confirmData" :key="index">
          <p>
            <el-checkbox @change="checkedChange" v-model="checkedArray[index]">第{{ index + 1 }}组：</el-checkbox>
          </p>
          <p>
            <span class="info-text">起运港口：{{ item.departurePort }}</span>
            <span class="info-text" v-if="type !== 'DI'">目的港口：{{ item.destinationPort }}</span>
            <span class="info-text">预计装柜日期：{{ item.expectedLoadingDate }}</span>
            <span class="info-text">预计上架日期：{{ item.expectedListDate }}</span>
            <span class="info-text">箱型/车型：{{ getBoxCarLabel(boxCarTypeList, item.containerType) }}</span>
            <span class="info-text">装载率：{{ item.loadRate }}%</span>
          </p>

          <el-table
            stripe
            border
            :header-cell-style="{ 'background-color': '#fafafa' }"
            :data="item.groupResultList"
            :key="item.id"
            style="width: 100%; margin-top: 10px"
            :span-method="($event) => objectSpanMethod($event, index)"
          >
            <el-table-column prop="asin" width="150px" label="ASIN" v-if="type === 'DI'"> </el-table-column>
            <el-table-column prop="skuCode" width="150px" label="工厂SKU"> </el-table-column>
            <el-table-column prop="poOrderNo" width="140px" label="采购单号" v-if="type === 'OTHER'"> </el-table-column>
            <el-table-column prop="platformOrderCode" width="120px" label="平台单号" v-if="type === 'DI'">
            </el-table-column>
            <el-table-column prop="platform" width="120px" label="平台"> </el-table-column>
            <el-table-column prop="site" label="站点"> </el-table-column>
            <el-table-column prop="pendingQuantity" label="待排数量"> </el-table-column>
            <el-table-column prop="planQuantity" width="140px" label="本次计划排柜数量"> </el-table-column>
            <el-table-column prop="totalPlanQuantity" width="140px" label="汇总计划排柜数量"> </el-table-column>
            <!-- <el-table-column prop="showRealQuantity" width="120px" label="实际排柜数量" >
            </el-table-column> -->
            <!-- <el-table-column prop="realPlanQuantity" width="140px" label="分配实际排柜数量">
              <template #default="scope">
                <el-form-item
                  :prop="`confirmData[${index}].groupResultList[${scope.$index}].realPlanQuantity`"
                  :rules="[
                    {
                      ...rules.realPlanQuantity[0],
                      row: scope.row
                    }
                  ]"
                >
                  <el-input size="mini" v-model="scope.row.realPlanQuantity" placeholder="请输入"></el-input>
                </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column prop="outerBoxVolume" width="120px" label="总体积（cm³）"> </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" v-if="permissions.purchase_container_save_plan" @click="handleSave"
        >保存装箱方案</el-button
      >
      <el-button size="small" @click="dialogVisible = false">返回上一步</el-button>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AllocateDetails from "../dialogComponents/allocateDetails.vue"
import { saveResult } from "@/api/purchase/containerLoadingPlan/index.js"
import { mapGetters } from "vuex"
export default {
  name: "packingPlanConfirm",
  components: {
    AllocateDetails
  },
  props: {
    boxCarTypeList: {
      type: Array,
      default: () => []
    },
    departureHarbourList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      dialogVisible: false,

      // 校验规则
      rules: {
        realPlanQuantity: [
          {
            validator: (rule, value, callback) => {
              console.log("rule, value,", rule, value)
              const { realPlanQuantity } = rule.row
              if (realPlanQuantity === undefined || realPlanQuantity === null || realPlanQuantity === "") {
                return callback(new Error("请输入数字"))
              }
              if (!/^\d+(\.\d+)?$/.test(realPlanQuantity)) {
                return callback(new Error("请输入有效的数字"))
              }
              if (parseFloat(realPlanQuantity) <= 0) {
                return callback(new Error("请输入大于 0 的数字"))
              }
              callback() // 验证通过
            },
            trigger: "blur"
          },
          { required: true, message: "请输入", trigger: "blur" }
        ]
      },
      checkAll: false,
      isIndeterminate: false,
      checkedArray: [],
      type: "DI",
      confirmData: []
    }
  },
  watch: {},
  methods: {
    handleOpenDialog(data) {
      this.dialogVisible = true
      const { type } = this.$route.query
      this.type = type
      console.log("data===>", data)
      this.confirmData = this.processingSummaryData(data)
      // console.log("   this.confirmData", this.confirmData)
    },
    processingSummaryData(data) {
      const skuTotalsMap = {} // 用对象缓存总量，避免重复计算

      data.forEach((group, index) => {
        const skuRealQuantities = {} // 用来保存每个 skuCode + groupId 的 realQuantity 总和

        group.groupResultList.forEach((item, idx) => {
          // 组合 skuCode 和 groupId 作为唯一键
          const cacheKey = `${item.skuCode}_${item.groupId}`

          // 计算并缓存每个 skuCode + groupId 的总计划数量
          skuTotalsMap[cacheKey] = (skuTotalsMap[cacheKey] || 0) + (item.planQuantity || 0)

          // 初始化 showRealQuantity（当前项的实际数量）
          let showRealQuantity = item.realQuantity || 0

          // 累加每个 skuCode + groupId 的实际数量
          if (skuRealQuantities[cacheKey]) {
            skuRealQuantities[cacheKey] += item.realQuantity
          } else {
            skuRealQuantities[cacheKey] = item.realQuantity
          }

          // 添加 showRealQuantity 字段（暂时赋值为当前项的实际数量）
          item.showRealQuantity = showRealQuantity
        })

        // 统一设置 showRealQuantity 为相同 skuCode + groupId 的总实际数量
        group.groupResultList.forEach((item) => {
          const cacheKey = `${item.skuCode}_${item.groupId}`
          item.showRealQuantity = skuRealQuantities[cacheKey]
        })
      })

      // 返回处理后的数据，添加统计字段
      return data.map((group) => ({
        ...group, // 保留原始数据
        groupResultList: group.groupResultList.map((item) => ({
          ...item, // 保留原始项数据
          totalPlanQuantity: skuTotalsMap[`${item.skuCode}_${item.groupId}`], // 总计划数量（从缓存中读取）
          realPlanQuantity: item.realQuantity, // 实际数量
          showRealQuantity: item.showRealQuantity // 显示的实际数量（相同 skuCode + groupId 的总和）
        }))
      }))
    },
    async handleSave() {
      const postData = this.confirmData
        .map((item) => ({
          ...item,
          groupResultList: item.groupResultList.map(({ id, arrangementBatchCode, planQuantity }) => ({
            id,
            arrangementBatchCode,
            realPlanQuantity: planQuantity
          }))
        }))
        .filter((_, index) => this.checkedArray[index])
      if (postData.length == 0) return this.$message.error("请至少选择一组数据")
      this.$refs.allocateForm?.validate()
      saveResult({
        type: this.type == "DI" ? "DI" : "OTHER",
        data: postData
      }).then(({ data }) => {
        if (data.code == 0) {
          this.$message.success("保存成功")
          this.dialogVisible = false
          // this.$router.$avueRouter.closeTag()
          // this.$router.go(-1)
        }
      })
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedArray = Array.from({ length: this.confirmData.length }, () => true)
      } else {
        this.checkedArray = Array.from({ length: this.confirmData.length }, () => false)
      }
      this.isIndeterminate = false
    },

    checkedChange(val) {
      if (this.checkedArray.every((item) => item == true)) {
        this.checkAll = true
        this.isIndeterminate = false
      } else {
        this.checkAll = false
        this.isIndeterminate = true
      }
    },
    handleAllocate(row) {
      const { arrangementPlanCode, groupId } = row
      this.$refs.AllocateDetails.handleOpenDialog({ arrangementPlanCode, groupId })
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }, index) {
      // 合并逻辑提取到函数
      const getRowspan = (field, row, rowIndex, index) => {
        // 获取上一行的数据，避免 rowIndex = 0 时报错
        const prevRow = rowIndex > 0 ? this.confirmData[index].groupResultList[rowIndex - 1] : null

        // 只有在 asin 和 skuCode 都相同时才合并
        if (prevRow && row[field] === prevRow[field] && row.asin === prevRow.asin && row.skuCode === prevRow.skuCode) {
          return { rowspan: 0, colspan: 0 }
        }

        let rowspan = 1
        for (let i = rowIndex + 1; i < this.confirmData[index].groupResultList.length; i++) {
          const nextRow = this.confirmData[index].groupResultList[i]

          // 只有 asin 和 skuCode 相同时才继续计算 rowspan
          if (row[field] === nextRow[field] && row.asin === nextRow.asin && row.skuCode === nextRow.skuCode) {
            rowspan++
          } else {
            break
          }
        }

        return { rowspan, colspan: 1 }
      }

      // 判断当前列是否为 'asin'
      if (column.property === "asin") {
        return getRowspan("asin", row, rowIndex, index)
      }

      // 判断当前列是否为 'skuCode'
      if (column.property === "skuCode") {
        return getRowspan("skuCode", row, rowIndex, index)
      }
      // // 判断当前列是否为 'totalPlanQuantity'
      // if (column.property === "totalPlanQuantity") {
      //   return getRowspan("totalPlanQuantity", row, rowIndex, index)
      // }

      // 这两个字段合并的前提是 asin 和 skuCode 都要相同，同时字段值不能为空（非 null 和 undefined）
      //  || column.property === "totalOuterBoxVolume"
      if (column.property === "showRealQuantity" || column.property === "totalPlanQuantity") {
        if (row[column.property] || row[column.property] == 0 || row[column.property] == "0") {
          const prevRow = rowIndex > 0 ? this.confirmData[index].groupResultList[rowIndex - 1] : null
          if (
            prevRow &&
            row.asin === prevRow.asin &&
            row.skuCode === prevRow.skuCode &&
            (row[column.property] == null || row[column.property] === "")
          ) {
            return { rowspan: 0, colspan: 0 }
          } else {
            return getRowspan(column.property, row, rowIndex, index)
          }
        }
      }
    },
    getLabel(data, value) {
      return data.find((item) => item.value == value)?.label
    },
    getBoxCarLabel(data, code) {
      return data.find((item) => item.code == code)?.name
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-box-content {
  padding: 20px;
}
::v-deep .el-form .el-table__body-wrapper td {
  padding: 4px 0px !important;
}
.table-group {
  margin-top: 20px;
}
.info-text {
  margin-right: 20px;
}
</style>
<style>
.dialog-box-content .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.dialog-box-content .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(188, 191, 193, 0.3); /* 滚动条颜色 */
  border-radius: 4px; /* 圆角 */
}

.dialog-box-content .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(188, 191, 193, 0.4); /* 鼠标悬浮时的颜色 */
}

.dialog-box-content .el-table__body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道颜色 */
  border-radius: 4px;
}
</style>
