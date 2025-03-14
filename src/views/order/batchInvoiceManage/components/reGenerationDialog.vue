<template>
  <el-dialog title="重新生成" :visible.sync="showDialog" width="700px">
    <div>
      <avue-crud ref="crud" :data="tableData" :option="reGenerationTableOption">
        <template slot="requirePickUpDateVOList" slot-scope="scope">
          <el-select
            v-model="scope.row.requestPickUpDate"
            size="small"
            placeholder="请选择要求提货时间"
            clearable
            :disabled="scope.row.isEditRequestPickUpDate"
          >
            <el-option
              v-for="item in scope.row.requirePickUpDateVOList"
              :key="item.requireTime"
              :label="item.requireTime"
              :value="item.requireTime"
              :class="{ 'high-light': item.onTimeFlag }"
            >
            </el-option>
          </el-select>
        </template>
        <template slot="message" slot-scope="scope">
          <span :style="{ color: scope.row.message === '成功' ? '#67C23A' : '#F56C6C' }">{{ scope.row.message }}</span>
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">重新生成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reGenerationApi, reGenerationOperateInfoV2Api } from "@/api/order/batchInvoiceManage"
import { reGenerationTableOption } from "../list"

export default {
  name: "reGenerationDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      reGenerationTableOption,
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(ids) {
      this.showDialog = true
      await this.getTimeList(ids)
    },

    async getTimeList(ids) {
      const { data } = await reGenerationOperateInfoV2Api({ foBatchOrderIds: ids })
      this.tableData = data.data?.operateInfos.map((item) => {
        return {
          ...item,
          requestPickUpDate: item.defaultPickupTime,
          isEditRequestPickUpDate: item.requirePickUpDateVOList.find((i) => i.defaultFlag)?.defaultFlag
        }
      })
    },

    async submit() {
      let paramsArr = this.tableData.map((item) => {
        return {
          foBatchOrderId: item.foBatchOrderId,
          requestPickUpDate: item.requestPickUpDate,
          onTimeFlag: item.requirePickUpDateVOList.find((i) => i.requireTime === item.requestPickUpDate)?.onTimeFlag
        }
      })

      console.log("paramsArr", paramsArr)

      for (const params of paramsArr) {
        try {
          const { data } = await reGenerationApi(params)
          const index = this.tableData.findIndex((item) => item.foBatchOrderId === params.foBatchOrderId)
          this.$set(this.tableData[index], "message", "成功")
        } catch (error) {
          const index = this.tableData.findIndex((item) => item.foBatchOrderId === params.foBatchOrderId)
          this.$set(this.tableData[index], "message", "失败")
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.high-light {
  background: #93d671;
}
</style>
