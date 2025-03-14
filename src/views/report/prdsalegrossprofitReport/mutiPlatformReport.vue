<template>
  <div class="execution" id="mutiPlatformReport">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="exportReport" size="small" v-if="permissions.purchase_inbound_export"
            >导出</el-button
          >
          <!-- <el-button type="primary" @click="batSearch" size="small">批次查询</el-button> -->
        </template>

        <template slot="search">
          <el-form
            @keyup.enter.native="searchChange"
            :model="searchForm"
            :inline="true"
            ref="searchForm"
            style="float: left"
          >
            <el-form-item prop="spu" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input v-model="searchForm.spu" size="small" placeholder="标准SPU" v-search-input></el-input>
            </el-form-item>

            <el-form-item prop="sku" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input v-model="searchForm.sku" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>

            <el-form-item prop="platform" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <!-- <el-input v-model="searchForm.platform" size="small" placeholder="请选择平台" v-search-input></el-input> -->
              <el-select
                v-model="searchForm.platform"
                size="small"
                filterable
                placeholder="平台"
                @change="changePlatform"
              >
                <el-option
                  v-for="item in plaTypeOption"
                  :key="item.platformTypeId"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="salesSite" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-select
                v-model="searchForm.salesSite"
                size="small"
                filterable
                placeholder="销售站点"
                @change="changePlatformSit"
              >
                <el-option
                  v-for="item in sitCountryOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.sitEnName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="categoryId" class="exclude-label"
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-cascader
                expand-trigger="hover"
                :props="props"
                size="small"
                v-model="categoryId"
                placeholder="品类"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="createName" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input v-model="searchForm.createName" size="small" placeholder="创建人" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="createTime" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-date-picker
                v-model="searchForm.createTime"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="batchId" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input v-model="searchForm.batchId" size="small" placeholder="测算批次号" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="pricingState" label=""
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-select v-model="searchForm.pricingState" size="small" filterable placeholder="定价状态">
                <el-option label="未定价" :value="0"></el-option>
                <el-option label="已定价" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item label="采购组：" prop="purchaseGroupId">
              <el-select v-model="searchForm.purchaseGroupId" size="small" clearable placeholder="请选择">
                <el-option v-for="item in purchaseGroupOptions" :key="item.groupId" :label="item.name"
                  :value="item.groupId"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="销售组：" prop="saleGroupId">
              <el-select v-model="searchForm.saleGroupId" size="small" clearable placeholder="请选择">
                <el-option v-for="item in requisitionGroupOptions" :key="item.groupId" :label="item.name"
                  :value="item.groupId"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </template> -->
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  getAmazonVCReport,
  getBatAmazonVCReport,
  getMutiPlatformReport,
  exportMutiPlatformReport
} from "@/api/report/prdsalegrossprofitReport.js"
// import { fetchList, exportData } from '@/api/report/purchaseInboundReport.js'
// import { tableOption } from '@/const/crud/report/purchaseInboundReport.js'
import { fetchTreeList } from "@/api/product/prdskucategory"
import { tableOption } from "@/const/crud/report/prdsalegrossprofitReport/mutiPlatformReport.js"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getTokenUrl, getTokenUrlFile, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  data() {
    return {
      props: { multiple: true },
      //搜索条件，和前端控件绑定
      searchForm: {
        sku: "",
        spu: "",
        platform: "",
        salesSite: "",
        salesModel: "",
        categoryId: [],
        createName: "",
        createTime: "",
        batchId: "",
        pricingState: ""
      },
      selectList: [], //列表勾选
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      requisitionGroupOptions: [],
      purchaseGroupOptions: [],
      plaTypeOption: [],
      sitCountryOptions: [],
      treeCategoryData: [],
      categoryId: []
    }
  },
  created() {},
  mounted: function () {
    this.loadAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    batSearch() {},

    handleChange() {
      this.searchForm.categoryId = []
      this.categoryId.forEach((item) => {
        this.searchForm.categoryId.push(item[item.length - 1])
      })
    },

    getBatList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      if (!this.searchFormConfirm.batchId) {
        return this.$message.warning("请先输入要查询的批次号")
      }
      this.page.currentPage = page.currentPage
      getBatAmazonVCReport(
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

    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
      getMutiPlatformReport(
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

    /**
     * 页面初始化
     */
    loadAll: function () {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.requisitionGroupOptions = data
        }
      })

      //加载采购组
      params = {
        groupFunctionName: "采购类",
        authority: false
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.purchaseGroupOptions = data
        }
      })
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data
      }),
        //获取品类下拉列表
        fetchTreeList().then((response) => {
          this.treeCategoryData = response.data.data
          console.log("treeCategoryData", this.treeCategoryData)
        })
    },

    //根据平台查询站点
    getPlatformSit(val) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.sitCountryOptions = res.data.data
      })
    },

    //选中平台-获取平台下的所有站点
    changePlatform(val) {
      this.getPlatformSit(val)
    },

    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.searchFormConfirm = {
        ...this.searchForm,
        createTimeBegin: this.searchForm.createTime ? this.searchForm.createTime[0] : "",
        createTimeEnd: this.searchForm.createTime ? this.searchForm.createTime[1] : ""
      }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },

    async exportReport() {
      let res = await exportMutiPlatformReport(this.searchFormConfirm)
      console.log(123, res.data)
      if (res.status === 200) {
        downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        this.$message.success("操作成功")
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
    },

    //导出数据
    exportList() {
      var obj = this.searchFormConfirm
      var param = ""
      var count = 0
      for (var index in obj) {
        if (count == 0) {
          param = "?" + index + "=" + obj[index]
        } else {
          param = param + "&" + index + "=" + obj[index]
        }
        count++
      }
      this.downloadUrl = getTokenUrlFile("/api/purchase/poorder/exportData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },

    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
