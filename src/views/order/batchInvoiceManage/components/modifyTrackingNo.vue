<template>
  <el-dialog
    title="修改跟踪号"
    :visible.sync="showDialog"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div>
      <el-form :model="formData" ref="modifyTrackingNoForm" label-width="100px" class="mark-ruleForm">
        <el-table :data="formData.sendTableData" :border="true" :max-height="400" style="width: 100%">
          <el-table-column prop="batchOrderCode" label="发货批次单号"></el-table-column>
          <el-table-column prop="extendCode" label="ARN/排柜号"></el-table-column>
          <el-table-column prop="orderCode" label="发货单号"></el-table-column>
          <el-table-column prop="soOrderCode" label="系统单号"></el-table-column>
          <el-table-column prop="sourceCode" label="平台单号"></el-table-column>
          <el-table-column prop="warehouse" label="发货仓库"> </el-table-column>
          <el-table-column prop="platformTransportCarrierCode" label="平台物流商code" width="160"> </el-table-column>
          <el-table-column prop="platformTransportCarrierName" label="平台物流商"> </el-table-column>
          <el-table-column label="跟踪号">
            <template slot-scope="scope">
              <el-form-item
                :prop="`sendTableData[${scope.$index}].truckingNo`"
                :rules="[{ required: true, message: '跟踪号不能为空' }]"
              >
                <el-input size="small" v-model="scope.row.truckingNo" placeholder="请输入内容"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" @click="sendConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadOmsFoBatchTruckingNumber } from "@/api/order/batchInvoiceManage"

export default {
  name: "modifyTrackingNo",
  components: {},
  data() {
    return {
      showDialog: false,
      formData: {
        truckingNo: "",
        platformFoOrder: [],
        sendTableData: []
      },
      selectRows: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows) {
      this.showDialog = true
      this.selectRows = selectRows
      this.formData.sendTableData = selectRows.map((item) => {
        return {
          ...item,
          truckingNo: ""
        }
      })
    },

    removeSend(index, row) {
      this.sendTableData.splice(index, 1)
    },
    async sendConfirm() {
      if (this.selectRows.some((item) => !item.extendCode)) {
        this.$message.warning("选中的数据中有ARN/排柜号为空的")
        return
      }
      await this.$refs["modifyTrackingNoForm"].validate()
      console.log("提交")

      try {
        const results = await Promise.allSettled(
          this.formData.sendTableData.map(async (item) => {
            return uploadOmsFoBatchTruckingNumber({
              truckingNo: item.truckingNo,
              platformFoOrder: [item.extendCode]
            })
          })
        )

        console.log("results===》", results)
        const hasFailed = results.some((result) => result.status == "rejected" || result?.value?.data.code !== 0)
        if (hasFailed) {
          this.$message.warning("部分跟踪号更新失败")
        } else {
          this.$message.success("所有跟踪号更新成功")
          this.$emit("success")
        }
        this.$refs["modifyTrackingNoForm"].resetFields()

        this.showDialog = false
      } catch (error) {
        this.$message.error("更新跟踪号时发生错误")
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .mark-ruleForm .el-form-item__content {
  margin-left: 0 !important;
}
</style>
