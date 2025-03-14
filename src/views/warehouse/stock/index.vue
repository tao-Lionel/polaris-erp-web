<template>
  <div class="execution" id="stock">
    <basic-container>
      <avue-crud
        class="handle-cell-hidden"
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        :summaryMethod="getSummaries"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-tabs v-model="tabValue" @tab-click="handleTabClick">
            <el-tab-pane label="明细维度" name="0"></el-tab-pane>
            <el-tab-pane label="汇总维度" name="1"></el-tab-pane>
          </el-tabs>
          <el-button
            v-if="permissions.warehouse_transfer_goods && tabValue === '0'"
            type="primary"
            @click="handelTransferGoodsBatch"
            size="small"
          >
            转 货
          </el-button>
          <el-button type="primary" v-if="permissions.wms_stock_export" @click="exportExcel" size="small">
            导 出
          </el-button>
        </template>
        <template slot="actualQuantity" slot-scope="scope">
          <el-button type="text" @click="showBatchTable(scope.row)">{{ scope.row.actualQuantity }}</el-button>
        </template>

        <template slot="lockQuantity" slot-scope="scope">
          <el-button type="text" @click="showOccupyTable(scope.row)">{{ scope.row.lockQuantity }}</el-button>
        </template>

        <template slot="stockRecordLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="stockRecordLog(scope.row)"></i>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="warehouseTypeId">
              <el-select
                size="small"
                v-model="searchForm.warehouseTypeId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="仓库类型"
                @change="getWarehouseTypeId"
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
            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="仓库"
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="corporationId">
              <el-select
                v-model="searchForm.corporationId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="法人主体"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="skuCode">
              <el-input
                clearable
                v-model="searchForm.skuCode"
                size="small"
                placeholder="工厂SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="standardSkuCode">
              <el-input
                clearable
                v-model="searchForm.standardSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item label="" prop="platform">
              <el-select
                v-model="searchForm.platform"
                size="small"
                multiple
                collapse-tags
                filterable
                placeholder="平台"
                clearable
                @change="changePlatform"
              >
                <el-option v-for="item in plaTypeOption" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="site">
              <el-select
                v-model="searchForm.site"
                size="small"
                multiple
                collapse-tags
                filterable
                placeholder="站点"
                clearable
                @change="changeSite"
              >
                <el-option v-for="item in sitOptions" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isGtZero">
              <el-switch
                v-model="searchForm.isGtZero"
                active-text="显示非0库存"
                inactive-text="显示所有库存"
              ></el-switch>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="operation">
          <a v-if="permissions.warehouse_transfer_goods" @click="handelTransferGoods(scope.row)">转货</a>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog title="入库批次明细" :visible.sync="showBatchTableVisible" width="70%">
      <div class="el-tag dialog-header instore-detail-dialog">
        <p class="instore-item"><strong class="avue-tip__name dialog-text">SKU:</strong>{{ showMainTitle.skuCode }}</p>
        <p class="instore-item">
          <strong class="avue-tip__name dialog-text">产品名称:</strong>{{ showMainTitle.skuName }}
        </p>
        <p class="instore-item">
          <strong class="avue-tip__name dialog-text">小组名称:</strong>{{ showMainTitle.groupName }}
        </p>
      </div>

      <el-table :data="batchTableData" class="cancelFixedTop" border style="min-height: 200px">
        <el-table-column width="100" property="platform" label="平台"></el-table-column>
        <el-table-column width="100" property="site" label="站点"></el-table-column>
        <el-table-column width="200" property="wmsInboundNo" label="关联入库单编号"></el-table-column>
        <el-table-column property="currency" label="交易币别"></el-table-column>
        <el-table-column property="taxTypeDescribe" label="交易税别"></el-table-column>
        <el-table-column property="taxRate" label="增值税率"></el-table-column>
        <el-table-column property="poPrice" label="采购单价"></el-table-column>
        <el-table-column property="locationCode" label="库位"></el-table-column>
        <el-table-column property="actualQuantity" label="数量"></el-table-column>
      </el-table>
      <div class="dialog-wp">
        <div class="avue-tip__name dialog-text mg-b-10 pull-left">
          <strong class="avue-tip__name dialog-text">仓库:</strong>{{ showMainTitle.warehouseName }}
        </div>
        <div class="avue-tip__name dialog-text pull-right">
          <strong class="avue-tip__name dialog-text">法人主体:</strong>{{ showMainTitle.corporationName }}
        </div>
      </div>
    </el-dialog>

    <el-dialog title="占用库存记录" :visible.sync="showOccupyTableVisible" width="70%">
      <div class="el-tag dialog-header">
        <span style="width: 30%; float: left">
          <strong class="avue-tip__name dialog-text">SKU:</strong>{{ showMainTitle.skuCode }}
        </span>
        <span style="width: 30%; float: right">
          <strong class="avue-tip__name dialog-text">小组名称:</strong>{{ showMainTitle.groupName }}
        </span>
      </div>
      <el-table :data="occupyTableData" class="cancelFixedTop" border style="min-height: 200px">
        <el-table-column property="recordTypeName" label="占用类型"></el-table-column>
        <el-table-column property="relationNo" label="关联单号"></el-table-column>
        <el-table-column property="quantity" label="占用数量"></el-table-column>
        <el-table-column property="createByName" label="操作人"></el-table-column>
        <el-table-column property="createTime" label="创建时间"></el-table-column>
      </el-table>
      <div class="dialog-wp">
        <div class="avue-tip__name dialog-text pull-left">
          <strong class="avue-tip__name dialog-text">仓库:</strong>{{ showMainTitle.warehouseName }}
        </div>
        <div class="avue-tip__name dialog-text pull-right">
          <strong class="avue-tip__name dialog-text">法人主体:</strong>{{ showMainTitle.corporationName }}
        </div>
      </div>
    </el-dialog>

    <!-- 出入库记录 -->
    <wmsstockrecordlog ref="wmsstockrecordlog"></wmsstockrecordlog>
  </div>
</template>

<script>
import wmsstockrecordlog from "@/views/warehouse/wmsstockrecord"
import { getUrlConcatToken } from "@/util/auth"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitAll as getSitAllApi, getPlatformAllBySitApi } from "@/api/baseSetup/bseplatformsit"
import { getBseWarehouseType } from "@/api/baseSetup/bsewarehousetype"
import { fetchListPost, showBatch, showOccupy } from "@/api/warehouse/wmsstock"
import { getSit } from "@/api/order/orderManage"
import { tableOption, allTableOption } from "@/const/crud/warehouse/wmsstock"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "wmsstock",
  components: {
    wmsstockrecordlog
  },
  data() {
    return {
      warehouseOptionsAll: [],
      warehouseOptions: [],
      corporationOptions: [],
      salesGroupOptions: [],
      showMainTitle: {
        warehouseName: "",
        corporationName: "",
        skuCode: "",
        platformSkuCode: "",
        groupName: ""
      },
      batchTableData: [],
      occupyTableData: [],
      showOccupyTableVisible: false,
      showBatchTableVisible: false,
      // selectRows: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        isGtZero: true,
        warehouseId: [],
        corporationId: [],
        groupId: [],
        skuCode: "",
        platform: [],
        site: "",
        storeAccount: "",
        countryShortName: "",
        type: "0",
        warehouseTypeId: [],
        standardSkuCode: ""
      },
      //确定的搜索条件
      searchFormConfirm: {
        isGtZero: true
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tabValue: 0,
      plaTypeOption: [],
      sitOptions: [],
      bseWarehouseTypeOptions: [],
      selectTableList: []
    }
  },
  created() {
    this.initInfo()
    this.getAllWarehouse()
    this.getCorporation()
    this.getGroupAll()
    this.handleTabClick()
    this.getBseWarehouseType()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getWarehouseTypeId(val) {
      this.searchForm.warehouseId = []
      if (val && val.length) {
        let warehouseOptions = []
        this.searchForm.warehouseTypeId.forEach((item) => {
          warehouseOptions.push(
            ...warehouseOptions,
            ...this.warehouseOptionsAll.filter((items) => items.warehouseTypeId === item)
          )
        })
        console.log(warehouseOptions)
        this.warehouseOptions = warehouseOptions
      } else {
        this.warehouseOptions = this.warehouseOptionsAll
      }
    },
    getBseWarehouseType() {
      getBseWarehouseType().then((response) => {
        this.bseWarehouseTypeOptions = response.data.data
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = ["actualQuantity", "availableQuantity", "lockQuantity"]
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "汇总："
          return
        }
        if (amountKey.includes(column.property)) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = "-/-"
          }
        }
      })
      return sums
    },
    initInfo() {
      getPlaTypeAll().then((res) => {
        this.plaTypeOption = res.data.data.map((item) => {
          return item.platformTypeCode
        })
      })
      getSitAllApi().then((res) => {
        this.sitOptions = res.data.data
      })
    },
    // 选择站点
    async changeSite(val) {
      const { data } = await getPlatformAllBySitApi(val)
      this.plaTypeOption = data.data
    },
    changePlatform(val) {
      //清空站点值
      this.sitOptions = []
      this.searchForm.sit = ""
      if (!this.searchForm.platform.length) return
      getSit(this.searchForm.platform).then((res) => {
        if (res.status === 200) {
          this.sitOptions = res.data.map((item) => {
            return item.sitEnName
          })
        }
      })
    },

    /**
     * tabs切换
     */
    handleTabClick() {
      if (this.tabValue === "1") {
        this.searchForm.type = null
        this.searchFormConfirm.type = null
        this.tableOption = allTableOption
      }
      if (this.tabValue === "0") {
        this.searchForm.type = this.tabValue
        this.searchFormConfirm.type = this.tabValue
        this.tableOption = tableOption
      }
      if (this.searchForm.platform) {
        console.log(123)
        this.searchForm.platform = ""
      }
      if (this.searchForm.site) {
        this.searchForm.site = ""
      }
      console.log(this.searchForm, 1023)
      this.initInfo()
      this.getList(this.page, this.searchForm)
    },

    /**
     * 导出
     */
    exportExcel() {
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      var param = ""
      //   if (this.selectRows && this.selectRows.length > 0) {
      //   this.selectRows.forEach(item => {
      //     param = param + "&selectStockId=" + item.stockId;
      //   });
      // }
      if (this.searchFormConfirm.corporationId) {
        this.searchFormConfirm.corporationId.forEach((item) => {
          param = param + "&corporationId=" + item
        })
      }
      if (this.searchFormConfirm.warehouseId) {
        this.searchFormConfirm.warehouseId.forEach((item) => {
          param = param + "&warehouseId=" + item
        })
      }
      if (this.searchFormConfirm.groupId) {
        this.searchFormConfirm.groupId.forEach((item) => {
          param = param + "&groupId=" + item
        })
      }
      if (this.searchFormConfirm.skuCode) {
        param = param + "&skuCode=" + this.searchFormConfirm.skuCode
      }
      if (this.searchFormConfirm.standardSkuCode) {
        param = param + "&standardSkuCode=" + this.searchFormConfirm.standardSkuCode
      }
      if (this.searchFormConfirm.platformSkuCode) {
        param = param + "&platformSkuCode=" + this.searchFormConfirm.platformSkuCode
      }
      if (this.searchFormConfirm.storeAccount) {
        param = param + "&storeAccount=" + this.searchFormConfirm.storeAccount
      }
      if (this.searchFormConfirm.countryShortName) {
        param = param + "&countryShortName=" + this.searchFormConfirm.countryShortName
      }
      if (typeof this.searchFormConfirm.isGtZero != "undefined") {
        param = param + "&isGtZero=" + this.searchFormConfirm.isGtZero
      }
      if (this.searchForm.type) {
        param = param + "&type=" + this.searchForm.type
      }
      if (this.searchForm.platform) {
        param = param + "&platform=" + this.searchForm.platform
      }
      if (this.searchForm.site) {
        param = param + "&site=" + this.searchForm.site
      }
      if (this.searchForm.warehouseTypeId) {
        param = param + "&warehouseTypeId=" + this.searchForm.warehouseTypeId
      }

      console.log(this.tabValue)
      console.log(this.searchForm.type)
      console.log(param)
      window.location = getUrlConcatToken("/api/warehouse/wmsstock/exportExcel") + param
    },
    /**
     * 查询销售组
     */
    getGroupAll: function () {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
        }
      })
    },
    /**
     * 查法人
     */
    getCorporation() {
      getCorporationList().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
        }
      })
    },
    /**
     * 查询仓库
     */
    getAllWarehouse: function () {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptionsAll = data
          this.warehouseOptions = data
        }
      })
    },
    /**
     * 查日志
     */
    stockRecordLog(row) {
      this.showMainTitle = {
        warehouseName: row.warehouseName,
        corporationName: row.corporationName,
        skuCode: row.skuCode,
        platformSkuCode: row.platformSkuCode,
        groupName: row.groupName
      }
      let newRow = deepCloneIgnoreNull(row)
      if (this.tabValue === "1") {
        newRow.platform = ""
        newRow.site = ""
      }
      this.$refs.wmsstockrecordlog.showLog(newRow)
    },
    //查占用记录
    showOccupyTable(row) {
      this.showMainTitle = {
        warehouseName: row.warehouseName,
        corporationName: row.corporationName,
        skuCode: row.skuCode,
        skuName: row.skuName,
        // platformSkuCode: row.platformSkuCode,
        groupName: row.groupName,
        platform: this.searchForm.type == 0 ? row.platform : "",
        site: this.searchForm.type == 0 ? row.site : ""
      }
      var param = {
        warehouseId: row.warehouseId,
        corporationId: row.corporationId,
        skuId: row.skuId,
        // bsePlatformSkuId: row.bsePlatformSkuId,
        // groupId: row.groupId
        platform: this.searchForm.type == 0 ? row.platform : "",
        site: this.searchForm.type == 0 ? row.site : ""
      }
      showOccupy(param).then((response) => {
        this.occupyTableData = []
        if (response.data.code == 0) {
          this.occupyTableData = response.data.data
          this.showOccupyTableVisible = true
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    //查看批次
    showBatchTable(row) {
      console.log("tabvalue", this.searchForm.type)
      this.showMainTitle = {
        warehouseName: row.warehouseName,
        corporationName: row.corporationName,
        skuCode: row.skuCode,
        skuName: row.skuName,
        // platformSkuCode: row.platformSkuCode,
        // groupName: row.groupName
        platform: this.searchForm.type == 0 ? row.platform : "",
        site: this.searchForm.type == 0 ? row.site : ""
      }
      var param = {
        warehouseId: row.warehouseId,
        corporationId: row.corporationId,
        skuId: row.skuId,
        // bsePlatformSkuId: row.bsePlatformSkuId,
        // groupId: row.groupId
        platform: this.searchForm.type == 0 ? row.platform : "",
        site: this.searchForm.type == 0 ? row.site : ""
      }

      showBatch(param).then((response) => {
        this.batchTableData = []
        if (response.data.code == 0) {
          this.batchTableData = response.data.data
          this.batchTableData.forEach((item) => {
            if (typeof item.taxRate != "undefined") {
              item.taxRate = item.taxRate * 100 + "%"
            }
          })
          this.showBatchTableVisible = true
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("查询失败")
          return
        }
      })
    },
    getList(page, params) {
      if (!params) {
        params = this.searchForm
      }
      page = page || { currentPage: 1 }
      this.tableLoading = true
      this.page.currentPage = page.currentPage
      if (this.tabValue == 0) {
        params.type = "0"
      }
      console.log(this.searchFormConfirm, params)
      fetchListPost(
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
        this.tableLoading = false
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      // console.log(params)
      if (this.searchFormConfirm.platform) {
        this.searchFormConfirm.platform = this.searchFormConfirm.platform.join(",")
      }
      if (this.searchFormConfirm.site) {
        this.searchFormConfirm.site = this.searchFormConfirm.site.join(",")
      }
      this.getList(page, this.searchFormConfirm)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) {
        this.$refs["searchFormAdvance"].resetFields()
      }
      this.initInfo()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    /**
     * 选中数据
     */
    selectionChange(tableData) {
      this.selectTableList = tableData
    },
    // 转货
    handelTransferGoods(row) {
      this.goToStockChange(row)
    },
    // 批量转货
    handelTransferGoodsBatch() {
      if (this.selectTableList.length === 0) {
        this.$message({
          message: "请选择要转货的库存",
          type: "warning"
        })
        return
      }

      const keys = ["corporationId", "site", "warehouseId"]
      let set = new Set()
      for (let obj of this.selectTableList) {
        let compositeKey = keys.map((key) => obj[key]).join("/")
        set.add(compositeKey)
      }
      if (set.size > 1) {
        this.$message({
          message: "请选择法人主体，站点，仓库一样的数据",
          type: "warning"
        })
        return
      }
      this.goToStockChange(this.selectTableList)
    },

    // 跳到转货管理新增页面
    goToStockChange(data) {
      let arr = []
      if (Array.isArray(data)) {
        arr = data
      } else {
        arr.push(data)
      }
      const warehouseStockChangeList = arr.map((item) => {
        return {
          // corporationId: item.corporationId,
          // warehouseId: item.warehouseId,
          platform: item.platform,
          site: item.site,
          skuCode: item.skuCode
        }
      })

      this.$store.commit("WAREHOUSE_STOCK_CHANGE", warehouseStockChangeList)

      this.$router.push({
        path: `/warehouse/stockchange/create`,
        query: {
          corporationId: arr[0].corporationId,
          warehouseId: arr[0].warehouseId
        }
      })
    }
  }
}
</script>

<style lang="scss">
#stock {
  .dialog-header {
    width: 100%;
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 14px;
  }

  .dialog-text {
    font-size: 14px;
  }

  .dialog-wp {
    overflow: hidden;
    padding: 10px;
  }

  .instore-detail-dialog {
    display: flex;

    .instore-item {
      flex: 1;
    }

    .instore-item:nth-child(2) {
      padding: 0 10px;
    }
  }
}
</style>
