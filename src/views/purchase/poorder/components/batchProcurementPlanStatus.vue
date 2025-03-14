<template>
  <el-dialog title="状态" :visible.sync="showDialog" width="900px">
    <div>
      <avue-crud :data="tableData" :option="tableOption">
        <template slot="success" slot-scope="scope">
          <span :style="{ color: scope.row.success ? '#67C23A' : '#F56C6C' }">
            {{ scope.row.success ? "成功" : "失败" }}
          </span>
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" type="primary" @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "batchProcurementPlanStatus",
  components: {},
  data() {
    return {
      showDialog: false,
      tableOption: {
        border: true,
        selection: false,
        stripe: true,
        menu: false,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        header: false,
        index: true,
        indexLabel: "序号",
        column: [
          { label: "单号", prop: "code", sortable: false, width: 150 },
          { label: "状态", prop: "success", sortable: false, solt: true, width: 100 },
          { label: "失败原因", prop: "error", sortable: false }
        ]
      },
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(list) {
      this.tableData = list
      this.showDialog = true
    },
    close() {
      this.$emit("updateList")
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
