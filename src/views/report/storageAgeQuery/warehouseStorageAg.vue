<template>
  <div id="warehouseStorageAgeQuery">
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="warehouseTableOption"
      @size-change="sizeChange"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="handleFilter"
      @search-reset="searchReset"
      @sort-change="sortChange"
    >
      <template slot="menuLeft">
        <el-button size="small" type="primary" @click="handleExportList">导出汇总数据</el-button>
        <el-button size="small" type="primary" @click="handleExportDetail">导出明细数据</el-button>
      </template>

      <template slot="search">
        <el-form @submit.prevent.native :model="queryParam" :inline="true" ref="warehouseQueryParamForm">
          <el-form-item label="">
            <el-input
              prop="spu"
              placeholder="标准SPU,支持多个"
              size="small"
              v-search-input
              clearable
              v-model="queryParam.spu"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="标准SKU"
              size="small"
              v-search-input
              v-model="queryParam.standardSku"
              clearable
              prop="sku"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="工厂SKU"
              size="small"
              v-search-input
              v-model="queryParam.sku"
              clearable
              prop="sku"
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
              size="small"
              v-model="queryParam.warehouseTypeIdList"
              multiple
              collapse-tags
              clearable
              filterable
              placeholder="仓库类型"
              prop="warehouseTypeIdList"
              @change="warehouseTypeChange"
            >
              <el-option
                v-for="item in bseWarehouseTypeOptions"
                :key="item.value"
                :label="item.warehouseTypeName"
                :value="item.warehouseTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="searchAdvanced">
        <el-form @submit.prevent.native :model="queryParam" :inline="true" ref="warehouseQueryParamForm">
          <el-form-item label="">
            <el-select
              v-model="queryParam.warehouseId"
              size="small"
              multiple
              collapse-tags
              filterable
              clearable
              prop="warehouseId"
              placeholder="仓库"
            >
              <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="" class="age-item">
            <el-input-number
              v-model="queryParam.minWarehouseAge"
              :min="0"
              :max="queryParam.maxWarehouseAge"
              :controls="false"
              placeholder="仓库库龄段最小值"
              size="small"
            ></el-input-number>
            <div style="display: inline-flex; justify-content: center; width: 40px">~</div>
            <el-input-number
              v-model="queryParam.maxWarehouseAge"
              :min="queryParam.minWarehouseAge"
              :controls="false"
              placeholder="仓库库龄段最大值"
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

      <template slot="warehouseStockAgeHeader" slot-scope="scope">
        <div style="display: flex; align-items: center">
          <div style="line-height: 21px">{{ scope.column.label }}</div>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">
              以【SKU+入库时间+仓库】维度统计仓库库龄，库龄天数=当前时间-入库时间。<br />
              首次入库仓库，开始计算仓库库龄（不区分仓库类型，含入库到中转仓）。<br />
              后续SKU 发生移仓，新仓的SKU仓库库龄重新计算，如果是转货到其他平台站点，仓库库龄不变。
            </div>
            <div class="badge-item">?</div>
          </el-tooltip>
        </div>
      </template>

      <template slot="warehouseStockAge" slot-scope="scope">
        <a style="margin-right: 10px" @click="handleCheckDetail(scope.row.warehouseStockAge, 'warehouse', scope.row)">{{
          scope.row.warehouseStockAge
        }}</a>
      </template>

      <template slot="warehouseId" slot-scope="scope">
        <div>
          {{ getWarehouseName(scope.row.warehouseId) }}
        </div>
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
import { warehouseTableOption } from "./index"
import detailDialog from "./detailDialog.vue"
import * as API from "@/api/storageAgeQuery"
import { getAllWarehouse as getAllWarehouseApi } from "@/api/baseSetup/bsewarehouse"
import { downloadBlob } from "@/util/auth"
import { fetchTreeList } from "@/api/product/prdskucategory"

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
      warehouseTableOption: warehouseTableOption,
      queryParam: {
        warehouseTypeIdList: [], //仓库类型 传参不需要传过去
        warehouseId: [],
        minWarehouseAge: undefined,
        maxWarehouseAge: undefined,
        spu: "",
        sku: "",
        // skuList: [],
        // spuList: [],
        orderBy: {
          orderByEnumMap: {}
        },
        rows: "",
        sort: "",
        order: "",
        categoryList: []
      },
      detailVisible: false,
      detailId: "",
      detailType: "",
      detailItem: {},
      bseWarehouseTypeOptions: [],
      warehouseOptions: [],
      warehouseOptionsAll: [],
      categoryId: [],
      treeCategoryData: []
    }
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
  created() {
    this.init()
  },
  methods: {
    init() {
      API.getBseWarehouseType().then((response) => {
        this.bseWarehouseTypeOptions = response.data.data
      })
      this.getAllWarehouse()
      this.getList()
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
    },
    async getList() {
      const opt = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.queryParam
      }
      if (this.queryParam.warehouseId.length == 0) {
        delete opt.warehouseId
      }
      if (this.queryParam.warehouseTypeIdList.length == 0) {
        delete opt.warehouseTypeIdList
      }
      if (!opt.orderBy.orderByEnumMap || Object.keys(opt.orderBy.orderByEnumMap).length === 0) {
        delete opt.orderBy
      }
      opt.categoryList.length === 0 && delete opt.categoryList
      this.tableLoading = true
      try {
        const { data } = await API.getWarehouseStorageAgeList(opt)
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
    },
    sizeChange(val) {
      this.page.pageSize = val
      his.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    refreshChange() {
      this.getList()
    },
    handleFilter() {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.queryParam = {
        warehouseTypeIdList: [], //仓库类型 传参不需要传过去
        warehouseId: [],
        minWarehouseAge: undefined,
        maxWarehouseAge: undefined,
        spu: "",
        sku: "",
        // skuList: [],
        // spuList: [],
        orderBy: {
          orderByEnumMap: {}
        },
        rows: "",
        sort: "",
        order: "",
        categoryList: []
      }
    },

    handleCheckDetail(id, type, row) {
      this.detailVisible = true
      this.detailId = id
      this.detailType = type
      this.detailItem = row
    },
    /**
     * 查询仓库
     */
    getAllWarehouse() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouseApi(query).then((response) => {
        console.log(response.data.data)
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptionsAll = data
          this.warehouseOptions = data.map((item) => {
            return {
              value: item.warehouseId,
              label: item.warehouseName
            }
          })
        }
      })
    },
    warehouseTypeChange(val) {
      let emptyArray = []
      val.forEach((item) => {
        let filterArr = this.warehouseOptionsAll
          .filter((ele) => {
            return ele.warehouseTypeId === item
          })
          .map((i) => {
            return {
              value: i.warehouseId,
              label: i.warehouseName
            }
          })
        emptyArray = [...emptyArray, ...filterArr]
      })
      this.warehouseOptions = emptyArray
      this.queryParam.warehouseId = []
    },
    // 按时间排序
    sortChange(val) {
      let objItem = {
        [val.prop]: val.order === "descending" ? "DESC" : "ASC"
      }
      this.queryParam.orderBy.orderByEnumMap = objItem
      if (val.order == null) {
        this.queryParam.orderBy.orderByEnumMap = {}
      }
      this.getList()
    },
    getWarehouseName(id) {
      let findWarehouseItem = this.warehouseOptionsAll.find((item) => item.warehouseId === id)
      return (findWarehouseItem && findWarehouseItem.warehouseName) || ""
    },
    /**
     *    COMPANY, // 公司维度
     *    WAREHOUSE, // 仓库维度
     *    PLATFORM_AND_SITE, //平台站点维度
     *    DETAIL // 明细维度
     */
    handleExportList() {
      let opt = { ...this.queryParam, stockAgeExportTypeEnum: "WAREHOUSE" }
      if (opt.warehouseId.length == 0) {
        delete opt.warehouseId
      }
      if (opt.warehouseTypeIdList.length == 0) {
        delete opt.warehouseTypeIdList
      }
      opt.categoryList.length === 0 && delete opt.categoryList
      API.exportListExportCk(opt)
        .then((res) => {
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
      let opt = { ...this.queryParam, stockAgeExportTypeEnum: "DETAIL" }
      if (opt.warehouseId.length == 0) {
        delete opt.warehouseId
      }
      if (opt.warehouseTypeIdList.length == 0) {
        delete opt.warehouseTypeIdList
      }
      opt.categoryList.length === 0 && delete opt.categoryList
      const res = await API.exportDetail(opt)
      if (res.status == 200) {
        this.$message.success(`导出成功`)
        downloadBlob(res.data, "导出明细数据.xls", "application/vnd.ms-excel;charset=utf-8")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#warehouseStorageAgeQuery {
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
