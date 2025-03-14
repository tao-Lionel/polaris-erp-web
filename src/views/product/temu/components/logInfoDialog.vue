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
import { getTemuLogPageApi } from "@/api/product/temu"

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
        pageFlag: true, //是否显示分页器

        column: [
          { label: "店铺名称", prop: "storeAccount", sortable: false },
          { label: "链接SKU", prop: "linkSku", sortable: false },
          { label: "操作时间", prop: "modifyTime", sortable: false },
          { label: "操作人", prop: "modifyUserName", sortable: false },
          { label: "操作事项", prop: "modifyContent", sortable: false }
        ]
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog({ storeId, linkSku, storeAccount }) {
      this.showDialog = true
      this.getList(storeId, linkSku, storeAccount)
    },
    //加载列表数据
    async getList(storeId, linkSku, storeAccount) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        storeId,
        linkSku
      }

      const { data } = await getTemuLogPageApi(params)
      this.tableData = data?.data.records
      this.tableData.forEach((item) => {
        item.storeAccount = storeAccount
      })
      this.page.total = data.data.total
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
