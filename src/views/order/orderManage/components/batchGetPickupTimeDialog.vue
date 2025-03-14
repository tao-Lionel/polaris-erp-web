<template>
  <el-dialog title="获取提货时间" :visible.sync="showDialog" width="80%" :before-close="handleClose">
    <div>
      <p style="color: red; font-size: 15px; margin-bottom: 10px">
        <span v-if="loading">正在处理数据，请不要进行任何操作，不要关闭此页面，谢谢！</span>
        <span v-else>获取提货时间已处理完毕！</span>
      </p>
      <div style="font-size: 14px; padding: 6px 0; display: flex">
        <p>
          <span>总条数：</span><span>{{ tableData.length }}</span>
        </p>
        <p style="margin: 0 20px">
          <span>成功条数：</span><span>{{ successCount }}</span>
        </p>
        <p>
          <span>失败条数：</span><span style="color: red">{{ errorCount }}</span>
        </p>
      </div>
      <avue-crud :data="tableData" :option="tableOptions">
        <template slot="code" slot-scope="scope">
          <div :style="{ color: scope.row.code === 1 ? 'red' : 'green' }">
            {{ scope.row.code === 1 ? "失败" : "成功" }}
          </div>
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="handleClose" :loading="loading">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSoOrderRequireTimeApi } from "@/api/order/orderManage"

export default {
  name: "batchGetPickupTimeDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableData: [],
      tableOptions: {
        fixHeight: 400,
        index: true,
        indexLabel: "序号",
        border: true,
        menu: false,
        header: false,
        column: [
          { label: "订单号", prop: "orderCode", sortable: false },
          { label: "成功/失败", prop: "code", sortable: false, solt: true },
          { label: "失败原因", prop: "msg", sortable: false }
        ]
      },
      successList: [],
      loading: true
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    successCount() {
      return this.tableData.filter((item) => item.code === 0).length
    },
    errorCount() {
      return this.tableData.filter((item) => item.code === 1).length
    }
  },
  methods: {
    async openDialog(list, batchSize = 5) {
      try {
        this.showDialog = true
        this.tableData = []
        this.loading = true
        // 延迟的时间，单位为毫秒
        const delay = 500 // 500ms 延迟

        // 将列表拆分为多个批次
        const batches = []
        for (let i = 0; i < list.length; i += batchSize) {
          batches.push(list.slice(i, i + batchSize))
        }

        // 处理每个批次
        for (const batch of batches) {
          const promises = batch.map(async (item) => {
            try {
              const { data } = await getSoOrderRequireTimeApi({
                soOrderCode: item.orderCode
              })
              return {
                orderCode: item.orderCode,
                code: data.code,
                msg: data.code === 0 ? "" : data.msg
              }
            } catch (error) {
              return {
                orderCode: item.orderCode,
                code: 1,
                msg: error.message || "请求失败"
              }
            }
          })

          // 等待当前批次的请求完成
          const results = await Promise.all(promises)

          // 将当前批次的结果放到前面的失败项之后
          this.tableData.push(
            ...results.filter((item) => item.code !== 0),
            ...results.filter((item) => item.code === 0)
          )

          // 每处理完一个批次后等待一段时间
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      } catch (error) {
        console.log("error", error)
      } finally {
        this.loading = false
      }
    },

    handleClose() {
      this.$emit("updateList")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
