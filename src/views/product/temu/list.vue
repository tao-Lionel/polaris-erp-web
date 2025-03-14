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
          <el-button v-if="permissions.product_temu_add" type="primary" @click="handleAdd" size="small">
            新增
          </el-button>
          <el-button v-if="permissions.product_temu_edit" type="primary" @click="handleEdit" size="small">
            修改
          </el-button>
          <el-button v-if="permissions.product_temu_import" type="primary" @click="handleImport" size="small">
            导入
          </el-button>
          <el-button v-if="permissions.product_temu_export" type="primary" @click="handleExport" size="small">
            导出
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="storeId">
              <el-select size="small" v-model="searchForm.storeId" filterable placeholder="店铺" clearable>
                <el-option
                  v-for="item in storeIdOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 
            <el-form-item prop="itemId" label="SKU ID">
              <el-input v-model="searchForm.itemId" size="small" placeholder="输入SKU ID" clearable></el-input>
            </el-form-item> -->
            <el-form-item prop="linkSku">
              <el-input
                v-model="searchForm.linkSku"
                size="small"
                placeholder="链接SKU"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="isEffective">
              <el-select size="small" v-model="searchForm.isEffective" clearable filterable placeholder="生效状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true">
            <el-form-item class="needChangeSelect" :prop="selectNameLabel">
              <el-input placeholder="请输入内容" v-model="selectNameValue" size="small" v-search-input>
                <el-select v-model="selectNameLabel" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="item in searchNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item :prop="selectTimeLabel" class="needChangeTime">
              <el-select v-model="selectTimeLabel" size="small" placeholder="请选择">
                <el-option v-for="item in searchTimeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="selectTimeValue"
                size="small"
                value-format="yyyy-MM-dd"
                type="daterange"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>

        <!-- 创建人/创建时间 -->
        <template slot="createUserName" slot-scope="{ row }">
          <div>{{ row.createUserName }}</div>
          <div>{{ row.createTime }}</div>
        </template>

        <!-- 更新人/更新时间 -->
        <template slot="updateUserName" slot-scope="{ row }">
          <div>{{ row.updateUserName }}</div>
          <div>{{ row.createTime }}</div>
        </template>

        <template slot="operate" slot-scope="{ row }">
          <i class="el-icon-tickets check-log" @click="showOperateLog(row)"></i>
        </template>
      </avue-crud>
    </basic-container>

    <commonImport
      ref="commonImport"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
      @export="exportDangerExcel"
      :customDownload="customDownload"
    >
    </commonImport>

    <addDialog ref="addDialogRef" @updateList="updateList"></addDialog>
    <editDialog ref="editDialogRef" @updateList="updateList"></editDialog>

    <!-- 日志 -->
    <logInfoDialog ref="logInfoDialogRef"></logInfoDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getDictByType, downloadFileByUrl } from "@/util/auth"
import { tableOption } from "./list"
import { downloadBlob } from "@/util/auth"
import { getStore } from "@/api/order/orderManage"
import addDialog from "./components/addDialog"
import editDialog from "./components/editDialog"
import logInfoDialog from "./components/logInfoDialog"
import { getTemuListApi, temuDownloadUrlApi, exportTempApi, importTempApi } from "@/api/product/temu"
import commonImport from "@/views/cockpit/commonImport"

export default {
  name: "temuList",
  components: {
    commonImport,
    addDialog,
    editDialog,
    logInfoDialog
  },
  data() {
    return {
      storeIdOptions: [],
      //搜索条件
      searchForm: {
        storeId: "",
        itemId: "",
        isEffective: undefined
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption,
      tableData: [],
      searchNameList: [
        { label: "创建人", value: "createUserName" },
        { label: "更新人", value: "updateUserName" }
      ],
      selectNameLabel: "createUserName",
      selectNameValue: "",
      searchTimeList: [
        { label: "创建时间", value: "createTime" },
        { label: "更新时间", value: "updateTime" }
      ],
      selectTimeLabel: "createTime",
      selectTimeValue: null,
      selectList: [],
      statusOptions: [
        { label: "待生效", value: "0" },
        { label: "生效中", value: "1" },
        { label: "已失效", value: "2" }
      ],
      excelDangerStatus: false,
      importData: null
    }
  },
  created() {
    this.init()
  },
  mounted: function () {
    this.getList()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async init() {
      this.getStoreAll()
    },
    // 获取店铺
    async getStoreAll() {
      const { data } = await getStore([])
      this.storeIdOptions = data.filter(
        (item) => (item.state === "0" && item.platformTypeCode === "TEMU") || item.platformTypeCode === "WALMARTDSV"
      )
    },

    //加载列表数据
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }
      const { data } = await getTemuListApi(params)
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }

      console.log("params====", params)
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange(params, page) {
      console.log("selectTimeValue====", this.selectTimeValue)

      if (this.selectTimeValue && this.selectTimeLabel === "createTime") {
        this.searchForm.beginCreateDate = this.selectTimeValue[0]
        this.searchForm.endCreateDate = this.selectTimeValue[1]
      } else {
        this.searchForm.beginCreateDate = undefined
        this.searchForm.endCreateDate = undefined
      }
      if (this.selectTimeValue && this.selectTimeLabel === "updateTime") {
        this.searchForm.beginUpdateDate = this.selectTimeValue[0]
        this.searchForm.endUpdateDate = this.selectTimeValue[1]
      } else {
        this.searchForm.beginUpdateDate = undefined
        this.searchForm.endUpdateDate = undefined
      }

      if (this.selectNameValue && this.selectNameLabel === "createUserName") {
        this.searchForm.createUserName = this.selectNameValue
      } else {
        this.searchForm.createUserName = undefined
      }

      if (this.selectNameValue && this.selectNameLabel === "updateUserName") {
        this.searchForm.updateUserName = this.selectNameValue
      } else {
        this.searchForm.updateUserName = undefined
      }

      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
      this.selectTimeValue = null
      this.selectNameValue = ""
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
      this.$refs.addDialogRef.openDialog(false)
    },
    handleEdit() {
      if (this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }

      this.$refs.editDialogRef.openDialog(this.selectList)
    },
    // 下载模板
    async customDownload() {
      const { data } = await temuDownloadUrlApi()
      downloadBlob(data, "Temu导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 导入数据
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      importTempApi(formData).then((res) => {
        console.log(res)
        this.importData = res.data.data
        if (res.data.code == 0 && !res.data.data) {
          this.excelDangerStatus = false
          this.$message.success("导入成功")
        } else {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatus = true
        }
        this.updateDate()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    // 下载错误文件
    async exportDangerExcel(file) {
      downloadFileByUrl(this.importData, "异常文件.xlsx")
    },
    // 导入
    handleImport() {
      this.$refs.commonImport.syncFn({
        downloadParams: {},
        uploadParams: {}
      })
    },
    // 导出
    async handleExport() {
      const { data } = await exportTempApi({
        ...this.searchForm
      })
      downloadBlob(data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    // 打开日志
    showOperateLog(row) {
      this.$refs.logInfoDialogRef.openDialog(row)
    },
    updateList() {
      this.$refs.crud.selectClear()
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.check-log {
  font-size: 16px;
  color: #46b1b0;
  cursor: pointer;
}
</style>
