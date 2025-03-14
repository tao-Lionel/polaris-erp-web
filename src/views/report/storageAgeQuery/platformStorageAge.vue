<template>
  <div id="platformStorageAgeQuery">
    <avue-crud
      ref="platformCrud"
      :page="page"
      :data="tableData"
      :option="platformTableOption"
      @size-change="sizeChange"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="handleSearch"
      @search-reset="searchReset"
      @sort-change="sortChange"
    >
      <!--  -->
      <template slot="menuLeft">
        <el-button size="small" type="primary" @click="handleExportAll">导出汇总数据</el-button>
        <el-button size="small" type="primary" @click="handleExportDetail">导出明细数据</el-button>
      </template>

      <template slot="search">
        <el-form
          @submit.prevent.native
          :model="queryParam"
          :inline="true"
          ref="platformQueryParamForm"
          style="float: left"
        >
          <el-form-item label="">
            <el-input
              placeholder="标准SPU，支持多个"
              size="small"
              v-search-input
              clearable
              v-model="queryParam.spu"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="标准SKU,支持多个"
              size="small"
              v-search-input
              clearable
              v-model="queryParam.standardSku"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="工厂SKU，支持多个"
              size="small"
              v-search-input
              clearable
              v-model="queryParam.sku"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-cascader
              placeholder="品类"
              size="small"
              expand-trigger="hover"
              :props="{ multiple: true }"
              v-model="categoryId"
              :show-all-levels="false"
              :options="treeCategoryData"
              @change="handleChange"
              clearable
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-select
              clearable
              placeholder="平台"
              multiple
              collapse-tags
              v-model="queryParam.platform"
              size="small"
              @change="platformChange"
            >
              <el-option
                v-for="item in platform"
                :key="item.platformTypeCode"
                :label="item.platformTypeName"
                :value="item.platformTypeCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable placeholder="站点" collapse-tags multiple v-model="queryParam.site" size="small">
              <el-option v-for="item in sitList" :key="item.sitName" :label="item.sitName" :value="item.sitName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form inline>
          <el-form-item label="" class="age-item">
            <el-input-number
              v-model="queryParam.minCompanyStockAge"
              @change="handleChange"
              :min="0"
              :max="queryParam.maxCompanyStockAge"
              :controls="false"
              placeholder="公司库龄段最小值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">~</div>
            <el-input-number
              v-model="queryParam.maxCompanyStockAge"
              @change="handleChange"
              :min="queryParam.minCompanyStockAge || 0"
              :controls="false"
              placeholder="公司库龄段最大值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">天</div>
          </el-form-item>
          <el-form-item label="" class="age-item">
            <el-input-number
              v-model="queryParam.minOverseaStockAge"
              @change="handleChange"
              :min="0"
              :max="queryParam.maxOverseaStockAge"
              :controls="false"
              placeholder="海外库龄段最小值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">~</div>
            <el-input-number
              v-model="queryParam.maxOverseaStockAge"
              @change="handleChange"
              :min="queryParam.minOverseaStockAge || 0"
              :controls="false"
              placeholder="海外库龄段最大值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">天</div>
          </el-form-item>
          <el-form-item label="" class="age-item">
            <el-input-number
              v-model="queryParam.minPlatformSiteStockAge"
              @change="handleChange"
              :min="0"
              :max="queryParam.maxPlatformSiteStockAge"
              :controls="false"
              placeholder="平台站点库龄段最小值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">~</div>
            <el-input-number
              v-model="queryParam.maxPlatformSiteStockAge"
              @change="handleChange"
              :min="queryParam.minPlatformSiteStockAge"
              :controls="false"
              placeholder="平台站点库龄段最大值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">天</div>
          </el-form-item>
        </el-form>
      </template>
      <template slot="categoryName" slot-scope="scope">
        <div>{{ scope.row.categoryName }}</div>
      </template>
      <template slot="skuName" slot-scope="scope">
        <div>{{ scope.row.skuName }}</div>
      </template>

      <template slot="companyStockAgeHeader" slot-scope="scope">
        <div style="display: flex; align-items: center">
          <div style="line-height: 21px">{{ scope.column.label }}</div>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              以【SKU+入库时间】维度统计公司库龄，库龄天数=当前时间-入库时间。<br />
              首次入库仓库，开始计算公司库龄（不区分仓库类型，含入库到中转仓）。<br />
              后续SKU发生移仓或者转货到其他平台站点，公司库龄是累计计算的。
            </div>
            <div class="badge-item">?</div>
          </el-tooltip>
        </div>
      </template>

      <template slot="overseaStockAgeHeader" slot-scope="scope">
        <div style="display: flex; align-items: center">
          <div style="line-height: 21px">{{ scope.column.label }}</div>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              以【SKU+入库时间+仓库】维度统计海外库龄，库龄天数=当前时间-入库时间。<br />
              首次入库海外仓或平台仓，开始计算海外库龄。<br />
              后续SKU 发生移仓或者转货到其他平台站点，海外库龄是累计计算的。
            </div>
            <div class="badge-item">?</div>
          </el-tooltip>
        </div>
      </template>

      <template slot="platformSiteStockAgeHeader" slot-scope="scope">
        <div style="display: flex; align-items: center">
          <div style="line-height: 21px">{{ scope.column.label }}</div>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              以【SKU+入库时间+平台+站点】维度统计平台站点库龄，库龄天数=当前时间-入库时间。<br />
              首次入库仓库，开始计算平台站点库龄（不区分仓库类型，含入库到中转仓）。<br />
              后续SKU转货到其他平台站点，新平台站点的SKU平台站点库龄是重新计算的。
            </div>
            <div class="badge-item">?</div>
          </el-tooltip>
        </div>
      </template>

      <template slot="companyStockAge" slot-scope="scope">
        <a style="margin-right: 10px" @click="handleCheckDetail(scope.row.companyStockAge, 'company', scope.row)">{{
          scope.row.companyStockAge
        }}</a>
      </template>
      <!-- 海外库龄 缺字段 -->
      <template slot="overseaStockAge" slot-scope="scope">
        <a style="margin-right: 10px" @click="handleCheckDetail(scope.row.overseaStockAge, 'overseas', scope.row)">{{
          scope.row.overseaStockAge
        }}</a>
      </template>
      <template slot="platformSiteStockAge" slot-scope="scope">
        <a
          style="margin-right: 10px"
          @click="handleCheckDetail(scope.row.platformSiteStockAge, 'platform', scope.row)"
          >{{ scope.row.platformSiteStockAge }}</a
        >
      </template>
    </avue-crud>

    <detailDialog
      v-model="detailVisible"
      :id="detailId"
      :detail-type="detailType"
      :detailItem="detailItem"
    ></detailDialog>
  </div>
</template>

<script>
import { platformTableOption } from "./index"
import detailDialog from "./detailDialog.vue"
import * as API from "@/api/storageAgeQuery"
import { downloadBlob } from "@/util/auth"
import { fetchTreeList } from "@/api/product/prdskucategory"
import _ from "lodash"

export default {
  components: { detailDialog },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      platformTableOption: platformTableOption,
      platform: [],
      platformTypeCodeList: [],
      sitList: [],
      queryParam: {
        platform: [],
        site: [],
        minCompanyStockAge: undefined,
        maxCompanyStockAge: undefined,
        minPlatformSiteStockAge: undefined,
        maxPlatformSiteStockAge: undefined,
        orderBy: {
          orderByEnumMap: {}
        },
        spu: "",
        sku: "",
        // skuList: [],
        // spuList: [],
        rows: "",
        sort: "", //seq
        order: "", //asc,
        categoryList: []
      },
      detailVisible: false,
      detailId: "",
      detailType: "",
      detailItem: {},
      treeCategoryData: [],
      categoryId: []
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    categoryId: {
      handler(val) {
        console.log("val", val)
        if (val.length) {
          this.queryParam.categoryList = []
          val.forEach((item) => {
            this.queryParam.categoryList.push(item[item.length - 1])
          })
        } else {
          this.queryParam.categoryList = []
        }
      }
    }
  },
  methods: {
    init() {
      API.getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = res.data.data
        }
      })
      this.getSitList()
      this.getList()

      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
    },
    getSitList() {
      API.getSit(this.queryParam.platform).then((res) => {
        if (res.status === 200) {
          this.sitList = res.data
        }
      })
    },
    async getList() {
      const opt = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.queryParam,
        platform: this.queryParam.platform
      }
      !opt.sku && delete opt.sku
      !opt.spu && delete opt.spu
      opt.categoryList.length === 0 && delete opt.categoryList
      if (!opt.orderBy.orderByEnumMap || Object.keys(opt.orderBy.orderByEnumMap).length === 0) {
        delete opt.orderBy
      }
      this.tableLoading = true

      try {
        const { data } = await API.getPlatformStorageAgeList(opt)
        this.tableLoading = false

        this.tableData = data.data.records || []
        this.page = {
          total: data.data.total,
          currentPage: data.data.page,
          pageSize: data.data.size
        }
      } catch (error) {
        this.tableLoading = false
      }
    }, //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      console.log("页码改变", val)
      this.page.currentPage = val
      this.getList()
    },
    refreshChange() {
      this.getList()
    },
    handleSearch() {
      this.page.currentPage = 1
      this.getList()
    },

    handleCheckDetail(id, type, row) {
      this.detailVisible = true
      this.detailId = id
      this.detailType = type
      this.detailItem = row
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.queryParam = {
        platform: [],
        site: [],
        minCompanyStockAge: undefined,
        maxCompanyStockAge: undefined,
        minPlatformSiteStockAge: undefined,
        maxPlatformSiteStockAge: undefined,
        orderBy: {
          orderByEnumMap: {}
        },
        spu: "",
        sku: "",
        // skuList: [],
        // spuList: [],
        // page: 1,
        rows: "",
        // pageSize: 20,
        sort: "",
        order: "",
        categoryList: []
      }
      this.clearSort()
    },

    platformChange() {
      this.getSitList()
    },
    // 按时间排序
    sortChange(val) {
      let objItem = {
        [val.prop]: val.order === "descending" ? "DESC" : "ASC"
      }
      this.queryParam.orderBy.orderByEnumMap = objItem
      this.getList()
    },
    clearSort() {
      this.$refs.platformCrud.clearSort()
    },

    /**
     *    COMPANY, // 公司维度
     *    WAREHOUSE, // 仓库维度
     *    PLATFORM_AND_SITE, //平台站点维度
     */
    handleExportAll() {
      const postData = _.cloneDeep({
        ...this.queryParam,
        stockAgeExportTypeEnum: "PLATFORM_AND_SITE"
      })
      postData.categoryList.length === 0 && delete postData.categoryList
      API.exportListExportPt(postData)
        .then((res) => {
          console.log("导出", res)
          if (res.status == 200) {
            this.$message.success(`导出成功`)
            downloadBlob(res.data, "导出汇总数据.xls", "application/vnd.ms-excel;charset=utf-8")
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async handleExportDetail() {
      const postData = _.cloneDeep({
        ...this.queryParam,
        stockAgeExportTypeEnum: "DETAIL"
      })
      postData.categoryList.length === 0 && delete postData.categoryList
      const res = await API.exportDetail(postData)
      console.log(res)
      if (res.status == 200) {
        this.$message.success(`导出成功`)
        downloadBlob(res.data, "导出明细数据.xls", "application/vnd.ms-excel;charset=utf-8")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#platformStorageAgeQuery {
  ::v-deep .age-item .el-input-number.is-without-controls {
    width: 130px !important;
  }
  .age-item {
    ::v-deep .el-form-item__content {
      display: flex;
      align-items: center;
    }
    ::v-deep .el-input {
      width: 130px !important;
    }
  }
  .badge-item {
    height: 16px;
    line-height: 16px;
    border-radius: 10px;
    background: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 10px;
    padding: 0 5px;
  }
  ::v-deep .el-table .cell {
    display: flex;
  }
}
</style>
