<template>
  <el-dialog title="分配明细" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div class="dialog-box-content">
      <p>第1组：</p>
      <div>
        <el-form ref="allocateForm" :model="tableData" :rules="rules" label-width="0">
          <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="skuCode" label="工厂SKU"> </el-table-column>
            <el-table-column prop="poOrderNo" width="120px" label="采购单号"> </el-table-column>
            <el-table-column prop="platform" label="平台"> </el-table-column>
            <el-table-column prop="site" label="站点"> </el-table-column>
            <el-table-column prop="planQuantity" width="140px" label="本次计划排柜数量"> </el-table-column>
            <el-table-column prop="totalPlanQuantity" width="140px" label="汇总计划排柜数量"> </el-table-column>
            <el-table-column prop="realQuantity" width="120px" label="实际排柜数量"> </el-table-column>
            <el-table-column prop="allocationQuantity" width="140px" label="分配实际排柜数量">
              <template #default="scope">
                <el-form-item :prop="`${scope.$index}.allocationQuantity`" :rules="rules.allocationQuantity">
                  <el-input size="mini" v-model="scope.row.allocationQuantity" placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSave">保 存</el-button>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listAllocationPlanResult } from "@/api/purchase/containerLoadingPlan/index.js"

export default {
  name: "allocateDetails",
  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          id: "12987122",
          name: "王小虎",
          amount1: "234",
          amount2: "3.2",
          amount3: 10,
          allocationQuantity: ""
        }
      ],
      // 校验规则
      rules: {
        allocationQuantity: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === "") {
                return callback(new Error("请输入数字"))
              }
              if (!/^\d+(\.\d+)?$/.test(value)) {
                return callback(new Error("请输入有效的数字"))
              }
              if (parseFloat(value) <= 0) {
                return callback(new Error("请输入大于 0 的数字"))
              }
              callback() // 验证通过
            },
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    handleOpenDialog(data) {
      this.dialogVisible = true
      this.getAllocationPlanResult(data)
    },
    async getAllocationPlanResult() {
      const { data } = await listAllocationPlanResult(
        data
        // {
        // arrangementPlanCode: '',
        // groupId:''
        // }
      )
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log("fdsf ", row, column)
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleSave() {
      this.$refs.allocateForm.validate()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-box-content {
  padding: 20px;
  max-height: 800px;
  overflow-y: auto;
}
</style>
