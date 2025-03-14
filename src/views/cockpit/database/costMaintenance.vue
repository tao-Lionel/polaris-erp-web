<template>
  <div class="execution" id="costmaintenance">
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
          <el-button v-if="permissions.cocfeemaintain_import" type="primary" size="small" @click="showDailog"
            >导入</el-button
          >
        </template>

        <!-- 搜索1 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="storeAccount" label="店铺名称">
              <el-input
                v-model="searchForm.storeAccount"
                size="small"
                placeholder="请输入店铺名称"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="sitIdList" label="站点">
              <el-select
                clearable
                v-model="searchForm.sitIdList"
                size="small"
                placeholder="请选择"
                collapse-tags
                filterable
                multiple
              >
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.platformCountryCode"
                  :value="item.bsePlatformSitId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="childItemName" label="费用名称">
              <el-input
                v-model="searchForm.childItemName"
                size="small"
                placeholder="请输入费用名称检索"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <!-- 搜索2 -->
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="yearMonthDateList" label="月份">
              <el-select
                clearable
                v-model="searchForm.yearMonthDateList"
                size="small"
                placeholder="请选择"
                collapse-tags
                filterable
                multiple
              >
                <el-option
                  v-for="item in yearMonthDateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="importDateStr" label="导入日期">
              <el-date-picker
                size="small"
                v-model="searchForm.importDateStr"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="createUserName" label="操作人">
              <el-input v-model="searchForm.createUserName" size="small" placeholder="" v-search-input></el-input>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>

      <commonImport
        ref="commonImport"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        @import="importExcelBtn"
      ></commonImport>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, handleImport } from "@/api/cockpit/database/costMaintenance"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import { tableOption } from "@/const/crud/cockpit/database/costMaintenance"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken, getTokenUrl } from "@/util/auth"
import commonImport from "@/views/cockpit/commonImport"
import { mapGetters } from "vuex"
export default {
  name: "costmaintenance",
  components: { commonImport },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchFormConfirm: {},
      searchForm: {
        storeAccount: "",
        sitIdList: [],
        childItemName: "",
        yearMonthDateList: [],
        importDateStr: "",
        createUserName: ""
      },
      tableOption: tableOption,
      selectRows: [],
      tableData: [],
      baseStoreOptions: [],
      sitCountryOptions: [],
      yearMonthDateOption: [],
      form: {},
      tabPositionModel: "0",
      //导入相关
      downloadUrl: "/yiyuan/template/费用维护导入模板.xlsx",
      fileSuffix: ".xlsx"
    }
  },
  created() {},
  mounted: function () {
    this.initInfo()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
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
    selectionChange(selected) {
      this.selectRows = selected
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    initInfo() {
      //更新月份下拉框
      var ymArr = []
      var now = new Date()
      let nowYear = now.getFullYear()
      let nowMonth = now.getMonth() + 1
      for (var year = nowYear; year >= 2019; year--) {
        if (nowYear != year) {
          nowMonth = 12
        }
        for (var month = nowMonth; month >= 1; month--) {
          let obj = "" + year + (month < 10 ? "0" + month : month)
          ymArr.push({
            label: obj,
            value: obj
          })
        }
      }
      this.yearMonthDateOption = ymArr

      //站点
      getSitInfo().then((res) => {
        this.sitCountryOptions = res.data.data
      })
    },
    importFormReset() {
      this.$refs["cockpitImportForm"].resetFields()
      this.cockpitImportForm = {
        file: {},
        attachmentFileName: "未选择任何文件"
      }
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      var arr = file.name.split(".")
      if (arr[arr.length - 1] != "xlsx") {
        this.$message.warning("请选：xlsx文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 6) {
        this.$message.warning("文件文件限制为6M以内!!")
        return
      }
      this.cockpitImportForm.file = file
      this.cockpitImportForm.attachmentFileName = file.name
    },
    showDailog() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        var _this = this
        let formdata = new FormData()
        formdata.append("file", file.raw)
        handleImport(formdata)
          .then((res) => {
            if (res.data.code == 0) {
              _this.clearSelectClear()
              _this.refreshChange()
              _this.$message.success("导入成功")
              _this.$refs.commonImport.syncFn()
            } else if (res.data.code == 1) {
              _this.$message.warning(res.data.msg)
            } else {
              _this.$message.error("导入失败")
            }
            _this.$refs.commonImport.closeFullScreen()
          })
          .catch(() => {
            _this.$message.error("导入失败")
            _this.$refs.commonImport.closeFullScreen()
            return
          })
      }
    }
  }
}
</script>

<style lang="scss">
// @import "./reviewRefund.scss";
</style>
