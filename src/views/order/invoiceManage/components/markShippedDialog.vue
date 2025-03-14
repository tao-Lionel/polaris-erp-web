<template>
  <el-dialog title="标记发货提示" :visible.sync="showDialog" width="80%" :before-close="handleClose">
    <div>
      <p style="color: red; font-size: 15px; margin-bottom: 10px">
        <span v-if="loading">正在处理数据，请不要进行任何操作，不要关闭此页面，谢谢！</span>
        <span v-else>标记发货已处理完毕！</span>
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
      <el-button size="small" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { markShipment } from "@/api/order/invoiceManage"

export default {
  name: "markShippedDialog",
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
          {
            label: "发货单号",
            prop: "orderCode",
            sortable: false
          },
          {
            label: "成功/失败",
            prop: "code",
            sortable: false,
            solt: true
          },
          {
            label: "失败原因",
            prop: "msg",
            sortable: false
          }
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
    async openDialog(list) {
      this.showDialog = true
      this.tableData = []
      this.loading = true
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const { data } = await markShipment([item])
        if (data.code === 0) {
          this.tableData.push({ orderCode: item.orderCode, code: data.code, msg: "" })
        } else {
          this.tableData.unshift({ orderCode: item.orderCode, code: data.code, msg: data.msg })
        }
      }
      this.loading = false
    },
    handleClose() {
      this.$emit("updateDate")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
