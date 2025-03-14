<template>
  <el-dialog title="操作日志" :visible.sync="showDialog" width="80%">
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @refresh-change="refreshChange"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
    </avue-crud>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLogisticsMappingLogInfoApi } from "@/api/baseSetup/logisticsChannelMapping"

export default {
  name: "logInfoDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableOption: {
        maxHeight: document.body.clientHeight - 320, //固定标题
        page: false,
        align: "center",
        menuAlign: "center",
        border: true, //是否显示边框
        editBtn: false,
        delBtn: false,
        addBtn: false,
        // dialogDisable: [0, 1, 2], //dialog是否可选
        dic: [],
        fixed: false,
        searchShow: false,
        showSearchBtn: true,
        showEmptyBtn: true,
        searchFlag: true,
        searchAdvanced: false, //高级搜索
        // index: true,
        selection: false,
        selectionFixed: false,
        index: true,
        indexLabel: "序号",
        stripe: true,
        menu: false,
        viewBtn: false,
        header: false, //是否显示头部
        pageFlag: false, //是否显示分页器

        column: [
          { label: "操作时间", prop: "modifyTime", sortable: false },
          { label: "操作人", prop: "modifyUser", sortable: false },
          { label: "操作类型", prop: "modifyTime", sortable: false },
          { label: "操作事项", prop: "modifyContent", sortable: false }
        ]
      },
      tableData: [],
      page: {
        total: null, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog({ bseWarehouseCode, providerCode, platform, orderBusinessType }) {
      this.showDialog = true
      this.getList(bseWarehouseCode, providerCode, platform, orderBusinessType)
    },
    //加载列表数据
    async getList(bseWarehouseCode, providerCode, platform, orderBusinessType) {
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        warehouseCode: bseWarehouseCode,
        providerCode,
        platform,
        orderBusinessType
      }

      const { data } = await getLogisticsMappingLogInfoApi(params)

      this.tableData = data?.data
      // this.page.total = data.data.total
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("updateList")
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
