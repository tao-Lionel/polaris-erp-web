<template>
  <el-dialog title="查看" :visible.sync="showCheckDialog" width="80%" center>
    <el-radio-group v-model="radio" @change="changeRadio" class="mb-10">
      <el-radio label="1">只展示每月最新预测销量</el-radio>
      <el-radio label="2">展示所有预测销量</el-radio>
    </el-radio-group>

    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="lockStatus" slot-scope="{ row }">
        <div>{{ row.lockStatus === "1" ? "是" : "否" }}</div>
      </template>
      <template slot="createName" slot-scope="{ row }">
        <div>{{ row.createName }}</div>
        <div>{{ row.createTime }}</div>
      </template>
      <template slot="updateName" slot-scope="{ row }">
        <div>{{ row.updateName }}</div>
        <div>{{ row.updateTime }}</div>
      </template>
    </avue-crud>

    <span slot="footer">
      <el-button size="small" @click="showCheckDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { getCheckDetailList } from "@/api/dataAnalysis/salesForecast"

export default {
  name: "lockingDialog",
  components: {},
  props: {},
  data() {
    return {
      radio: "1",
      tableData: [],
      showCheckDialog: false,
      tableOption: {
        border: true,
        menu: false,
        header: false,
        fixHeight: 450,
        column: [
          { label: "链接SKU", prop: "linkSku", sortable: false },
          { label: "链接SPU", prop: "linkSpu", sortable: false },
          { label: "标准SPU", prop: "spu", sortable: false },
          { label: "标准SKU", prop: "sku", sortable: false },
          { label: "预测时间", prop: "predictedDate", sortable: false },
          { label: "预测销量", prop: "predictedSalesQuantity", sortable: false },
          { label: "锁定状态", prop: "lockStatus", sortable: false, solt: true },
          { label: "运营", prop: "operationsPerson", sortable: false },
          { label: "创建人/创建时间", prop: "createName", width: 180, sortable: false, solt: true },
          { label: "更新人/更新时间", prop: "updateName", width: 180, sortable: false, solt: true }
        ]
      },

      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      ids: [],
      row: null,
      searchForm: {}
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    openDialog(row, searchForm) {
      this.showCheckDialog = true
      this.ids = row?.isEffectiveIds ? row.isEffectiveIds : []
      this.row = row
      this.radio = "1"
      this.resetPage()
      this.searchForm = searchForm
      this.getList(this.page, this.searchForm)
    },
    resetPage() {
      this.page.currentPage = 1
      this.page.pageSize = 20
    },
    changeRadio() {
      this.resetPage()
      if (this.radio === "1") {
        this.ids = this.row?.isEffectiveIds ? this.row.isEffectiveIds : []
      } else if (this.radio === "2") {
        this.ids = this.row?.allItemIds ? this.row.allItemIds : []
      }
      this.getList(this.page, this.searchForm)
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.searchForm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchForm)
    },
    async getList(page, params) {
      page.current = page.currentPage
      page.size = page.pageSize
      const { data } = await getCheckDetailList(
        Object.assign(page, params, { ids: this.ids?.length == 0 ? [-1] : this.ids })
      )

      this.tableData = data.data.records
      this.page.total = data.data.total
    }
  }
}
</script>

<style lang="scss" scoped></style>
