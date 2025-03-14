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
          <el-button v-if="permissions.product_palletsManage_add" type="primary" size="small" @click="handleAdd">
            新 增
          </el-button>
          <el-button v-if="permissions.product_palletsManage_import" type="primary" size="small" @click="handleImport">
            导 入
          </el-button>
          <export-btn
            v-if="permissions.product_palletsManage_export"
            pageName="打托数管理"
            pageUrl="prdSealSamplePallet/listPage"
            moduleName="product"
            :columns="tableOption.column"
            :pageReq="searchForm"
          ></export-btn>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="sku">
              <el-input v-model="searchForm.sku" placeholder="工厂SKU,支持多个" clearable v-search-input size="small" />
            </el-form-item>
            <el-form-item prop="palletSpec">
              <el-select v-model="searchForm.palletSpec" size="small" placeholder="托盘尺寸" clearable multiple>
                <el-option
                  v-for="item in palletSpecList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="operate" slot-scope="scope">
          <a v-if="permissions.product_palletsManage_edit" @click="handleEdit(scope.row)">编辑</a>
        </template>
      </avue-crud>
    </basic-container>

    <commonImport
      ref="commonImportRef"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatusDistribute"
      @import="importExcelBtnDistribute"
      :customDownload="customDownloadDistribute"
    >
    </commonImport>

    <addDialog ref="addDialog" @updateList="getList"></addDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import addDialog from "./components/addDialog.vue"
import { getPageListApi, importPalletsManageApi } from "@/api/product/palletsManage"
import commonImport from "@/views/cockpit/commonImport.vue"
import { getDictByType, downloadBlob } from "@/util/auth"
import { productDownloadTemplateApi } from "@/api/product/pricing"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { exportDataComApi } from "@/api/common/index"

export default {
  name: "palletsManageList",
  components: { addDialog, commonImport },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        sku: "",
        palletSpec: []
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      palletSpecList: [],
      excelDangerStatusDistribute: false // 是否可下载错误文件
    }
  },
  created() {},
  mounted: async function () {
    this.palletSpecList = await getDictByType("product_pallet_spec")

    this.getList()
  },
  methods: {
    //加载列表数据
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }
      const { data } = await getPageListApi(params)

      this.tableData = data.data.records
      this.page.total = data.data.total
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
      console.log("重置")
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
    // 新增
    handleAdd() {
      this.$refs.addDialog.openDialog(null)
    },
    handleEdit(row) {
      this.$refs.addDialog.openDialog(row)
    },
    // 导入
    handleImport() {
      this.$refs.commonImportRef.syncFn()
    },

    // 下载模板
    async customDownloadDistribute() {
      const { data } = await productDownloadTemplateApi({ templateName: "打托数维护导入模板" })
      downloadBlob(data, "打托数维护导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 导入数据
    async importExcelBtnDistribute(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImportRef.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      const { data } = await importPalletsManageApi(formData)
      if (data.code === 0) {
        this.$message.success(data.data)
        this.getList()
        this.$refs.commonImportRef.closeFullScreen()
        this.$refs.commonImportRef.syncFn()
      } else {
        this.$message.error(data.data)
      }
    },

    // 导出
    async handleExport() {
      const exportParams = []
      const obj = deepCloneIgnoreNull(this.searchForm)

      Object.keys(obj).forEach((item) => {
        if (Array.isArray(obj[item])) {
          exportParams.push({ code: item, value: obj[item].join(",") })
        } else {
          exportParams.push({ code: item, value: obj[item] })
        }
      })

      const { data } = await exportDataComApi({
        id: 37,
        param: exportParams,
        exportModel: "SYNC"
      })
      downloadBlob(data, "打托数管理导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>

<style lang="scss" scoped></style>
