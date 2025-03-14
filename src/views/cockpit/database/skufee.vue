<template>
  <div class="execution" id="skufee">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <!-- 按钮 -->
        <template slot-scope="scope" slot="menuLeft">
          <!-- <el-button  v-if="permissions.cusDeclare_declare_customs" type="primary" size="small" @click="showDeclareAtCustoms">更换SKU</el-button> -->
          <el-button type="primary" size="small" v-if="permissions.sku_fee_import" @click="showDailog">导入</el-button>
        </template>

        <!-- 搜索1 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="sellerSku" label="平台销售SKU">
              <el-input
                v-model="searchForm.sellerSku"
                size="small"
                placeholder="请输入平台销售SKU检索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="工厂SKU">
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                placeholder="请输入工厂SKU检索"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="platformTypeId" label="平台">
              <el-select
                clearable
                v-model="searchForm.platformTypeId"
                multiple
                collapse-tags
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in plaTypeOptions"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- 搜索2 -->
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance"> </el-form>
        </template>
      </avue-crud>
      <commonImport
        ref="commonImport"
        :fileSuffix="fileSuffix"
        :downloadUrl="downloadUrl"
        @import="importExcelBtn"
      ></commonImport>
    </basic-container>
  </div>
</template>

<script>
import { getCocSkuCosting, importExcel } from "@/api/cockpit/database/skufee"
import { tableOption } from "@/const/crud/cockpit/database/skufee"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { mapGetters } from "vuex"
import commonImport from "@/views/cockpit/commonImport"
export default {
  name: "tradereport",
  components: { commonImport },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchFormConfirm: {},
      searchForm: {},
      tableOption: tableOption,
      selectRows: [],
      tableData: [],
      form: {},
      tabPositionModel: "0",
      plaTypeOptions: [], //平台
      downloadUrl: "/yiyuan/template/SKU成本信息模板.xlsx",
      fileSuffix: ".xlsx"
    }
  },
  created() {},
  mounted: function () {
    this.initData()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    initData() {
      //获取所有平台类型
      getPlaTypeAll().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.plaTypeOptions = data
        }
      })
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    refreshChange(params) {
      this.getList(this.page, params)
    },
    getList(page, params) {
      getCocSkuCosting(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      )
        .then((response) => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
        })
        .catch(() => {})
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    closedFn() {
      this.uploadFile = {}
    },
    showDailog() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        if (file.size <= 1024 * 1024 * 6) {
          this.importExcelQD(file.raw)
        } else {
          this.$message.warning("文件大小不得超过6M")
        }
      }
    },
    downloadTemplate() {
      window.location = getTokenUrl("/yiyuan/template/SKU成本信息模板.xls")
    },
    importExcelQD(file) {
      let formData = new FormData()
      formData.append("file", file)
      importExcel(formData)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success("导入成功!!")
            this.getList(this.page, null)
            this.exportExcelDialog = false
            this.$refs.commonImport.syncFn()
          } else {
            this.$message.warning(res.data.msg)
          }
          this.$refs.commonImport.closeFullScreen()
        })
        .catch(() => {
          this.$refs.commonImport.closeFullScreen()
        })
    }
  }
}
</script>

<style lang="scss">
@import "./skufee.scss";
</style>
