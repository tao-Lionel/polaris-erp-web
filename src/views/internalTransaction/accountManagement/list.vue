<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-dropdown trigger="hover">
            <el-button type="primary" size="small">批量下载</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDownload(null, 1)"> 下载对账单 </el-dropdown-item>
              <el-dropdown-item @click.native="handleDownload(null, 2)"> 下载发票 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="dataMonth">
              <el-date-picker
                v-model="searchForm.dataMonth"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                size="small"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="saleOrg">
              <el-select
                v-model="searchForm.saleOrg"
                size="small"
                filterable
                clearable
                placeholder="供应商"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseOrg">
              <el-select
                v-model="searchForm.purchaseOrg"
                size="small"
                clearable
                filterable
                placeholder="采购商"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="actualAmount" slot-scope="scope">
          <span>{{ scope.row.actualAmount }} {{ scope.row.currency }}</span>
        </template>

        <template slot="operate" slot-scope="scope">
          <div style="display: flex; gap: 10px">
            <el-dropdown trigger="hover">
              <el-button type="text" size="small">查看</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handlePreview(scope.row, 1)"> 查看对账单 </el-dropdown-item>
                <el-dropdown-item @click.native="handlePreview(scope.row, 2)"> 查看发票 </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown trigger="hover">
              <el-button type="text" size="small">下载</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleDownload(scope.row, 1)"> 下载对账单 </el-dropdown-item>
                <el-dropdown-item @click.native="handleDownload(scope.row, 2)"> 下载发票 </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import { getAll as getAllBsecorporation } from "@/api/baseSetup/bsecorporation"
import {
  getReconciliationPageApi,
  singleDownloadApi,
  batchDownloadApi
} from "@/api/internalTransaction/accountManagement.js"
import { getTokenUrl, downloadBlob } from "@/util/auth"
import { getStore as getSession } from "@/util/store"

export default {
  name: "accountManagementList",
  components: {},
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        purchaseOrg: [],
        saleOrg: [],
        dataMonth: []
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      corporationList: []
    }
  },
  created() {},
  mounted: async function () {
    await Promise.all([this.getList(), this.getCorporationList()])
  },
  methods: {
    //加载列表数据
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }

      const { data } = await getReconciliationPageApi(params)

      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
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
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    // 下载
    async handleDownload(row, type) {
      let relationNos = []
      const hasSearchForm = Object.keys(this.searchForm).filter(
        (key) => this.searchForm[key] && this.searchForm[key].length > 0
      )

      let params = {
        type
      }

      // 批量下载
      if (!row) {
        if (this.selectList.length <= 0 && hasSearchForm?.length <= 0) {
          this.$message.warning("请选择数据或者选择搜索条件")
          return
        }
        relationNos = this.selectList.map((item) => item.invoiceNo)
        if (this.selectList.length > 0) {
          params.relationNos = relationNos
        } else if (hasSearchForm?.length > 0) {
          params.dataMonth = this.searchForm.dataMonth
          params.saleOrg = this.searchForm.saleOrg
          params.purchaseOrg = this.searchForm.purchaseOrg
        }

        const { data } = await batchDownloadApi(params)

        if (data?.code === 0) {
          let count = getSession({ name: "downloadCount" })
          this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
          this.$message.success(`异步下载中，请点击右上角【下载列表】图标进行查看！`)
        }
      } else {
        // 单个下载
        console.log(row)

        const res = await singleDownloadApi({ relationNo: row.invoiceNo, type })
        const filename = res?.headers["content-disposition"].split("=")[1]
        downloadBlob(res.data, decodeURI(filename), "application/pdf")
        this.$message.success("下载成功")
      }
    },
    // 预览
    handlePreview(row, type) {
      window.open(getTokenUrl(type === 1 ? row.settlementUrl : row.invoiceUrl) + "&type=previewPdf")
    },
    // 获取法人主体
    async getCorporationList() {
      const { data } = await getAllBsecorporation()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table .el-button {
  padding: 0;
}
</style>
