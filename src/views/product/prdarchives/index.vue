<template>
  <div id="prdarchives">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="data"
        :option="tableOption"
        @search-change="handleSubmit"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @selection-change="selectionChange"
        :cell-class-name="getCellClass"
      >
        <template slot="menuLeft">
          <el-tabs v-model="selectTab" @tab-click="changeTab">
            <el-tab-pane
              v-for="item in tabList"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>

          <el-button @click="handleCreate" type="primary" size="small">新品创建</el-button>
          <el-button
            v-show="selectTab !== 'FINISH'"
            @click="handleClose"
            :disabled="!selectRows.length"
            type="primary"
            size="small"
            >封样</el-button
          >
          <el-button
            @click="exportSearch"
            :disabled="exportObj.flag && permissions.prdarchives_export"
            type="primary"
            size="small"
            >导出</el-button
          >
          <el-button @click="handleSyncSku" v-if="permissions.prdarchives_sync_sku" type="primary" size="small"
            >同步SKU</el-button
          >
          <el-button
            v-if="permissions.prdlist_remove && selectTab === 'UN_FINISH'"
            type="primary"
            size="small"
            @click="handleDel"
            >删除</el-button
          >
        </template>

        <template slot="search">
          <el-form>
            <el-form-item prop="spuCode">
              <el-input
                v-model="archivesForm.spuCode"
                size="small"
                placeholder="标准SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input
                v-model="archivesForm.skuCode"
                size="small"
                placeholder="工厂SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="standardSkuCode">
              <el-input
                v-model="archivesForm.standardSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="skuName">
              <el-input v-model="archivesForm.skuName" size="small" placeholder="产品名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="brand">
              <el-select v-model="archivesForm.brand" size="small" placeholder="品牌" clearable>
                <el-option
                  v-for="item in brandOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form inline="true">
            <el-form-item class="exclude-label" prop="categoryId">
              <el-cascader
                placeholder="品类"
                size="small"
                expand-trigger="hover"
                :props="props"
                v-model="categoryId"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleChange"
                clearable
                collapse-tags
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="productPositioning">
              <el-select
                v-model="archivesForm.productPositioning"
                size="small"
                placeholder="产品定位"
                clearable
                @change="handleChangePosi"
              >
                <el-option
                  v-for="item in productPositionOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="saleStatus">
              <el-select v-model="archivesForm.saleStatus" size="small" placeholder="销售状态" clearable>
                <el-option
                  v-for="item in saleStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseStatus">
              <el-select v-model="archivesForm.purchaseStatus" size="small" placeholder="采购状态" clearable>
                <el-option label="允许采购" :value="0"></el-option>
                <el-option label="禁止采购" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="sealSampleStatus">
              <el-select v-model="archivesForm.sealSampleStatus" size="small" placeholder="封样状态" clearable>
                <el-option label="未处理" value="UN_HANDLE"></el-option>
                <el-option label="封样完成" value="FINISH"></el-option>
                <el-option label="待质量审核" value="WAIT_QUALITY_REVIEW"></el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <template slot="skuCode" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              :to="`/product/detail/index?skuCode=${scope.row.skuCode}`"
              :title="scope.row.skuCode"
            >
              {{ scope.row.skuCode }}
            </router-link>
          </copy-text>
        </template>
        <template slot="spuCodeHeader" slot-scope="scope">
          <span>标准SPU</span>
          <el-popover width="300" trigger="click" v-model="popoverVisibleMap.spuCode">
            <div class="popover-search-box">
              <el-input
                size="mini"
                placeholder="搜索"
                v-model="filterText"
                clearable
                @change="handleFilterText"
                @input="handleFilterText"
              >
                <el-button slot="append" icon="el-icon-search" @click="handleFilterText('spuCode')"></el-button
              ></el-input>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group class="checkbox-list" v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
              </el-checkbox-group>
              <div style="padding-top: 10px">
                <p>已选{{ checkedCities.length }}项</p>
                <el-button size="mini" type="primary" @click="handleConfirmFilter('spuCode')">确定</el-button>
                <el-button size="mini" @click="handleClear('spuCode')">清除</el-button>
              </div>
            </div>
            <i slot="reference" class="icon-loudou head-search-icon" @click.stop.self="handleFilter('spuCode')"></i>
          </el-popover>
        </template>
        <template slot="standardSkuCodeHeader" slot-scope="scope">
          <span>标准SKU</span>
          <el-popover width="300" trigger="click" v-model="popoverVisibleMap.standardSkuCode">
            <div class="popover-search-box">
              <el-input
                size="mini"
                placeholder="搜索"
                v-model="filterText"
                clearable
                @change="handleFilterText"
                @input="handleFilterText"
              >
                <el-button slot="append" icon="el-icon-search"></el-button
              ></el-input>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group class="checkbox-list" v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
              </el-checkbox-group>
              <div style="padding-top: 10px">
                <p>已选{{ checkedCities.length }}项</p>
                <el-button size="mini" type="primary" @click="handleConfirmFilter('standardSkuCode')">确定</el-button>
                <el-button size="mini" @click="handleClear('standardSkuCode')">清除</el-button>
              </div>
            </div>
            <i
              slot="reference"
              class="icon-loudou head-search-icon"
              @click.stop.self="handleFilter('standardSkuCode')"
            ></i>
          </el-popover>
        </template>

        <template slot="skuCodeHeader" slot-scope="scope">
          <span>工厂SKU</span>
          <el-popover width="300" trigger="click" v-model="popoverVisibleMap.skuCode">
            <div class="popover-search-box">
              <el-input
                size="mini"
                placeholder="搜索"
                v-model="filterText"
                clearable
                @change="handleFilterText"
                @input="handleFilterText"
              >
                <el-button slot="append" icon="el-icon-search"></el-button
              ></el-input>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group class="checkbox-list" v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
              </el-checkbox-group>
              <div style="padding-top: 10px">
                <p>已选{{ checkedCities.length }}项</p>
                <el-button size="mini" type="primary" @click="handleConfirmFilter('skuCode')">确定</el-button>
                <el-button size="mini" @click="handleClear('skuCode')">清除</el-button>
              </div>
            </div>
            <i slot="reference" class="icon-loudou head-search-icon" @click.stop.self="handleFilter('skuCode')"></i>
          </el-popover>
        </template>
        <template slot="skuNameHeader" slot-scope="scope">
          <span>产品名称</span>
          <el-popover width="300" trigger="click" v-model="popoverVisibleMap.skuNameHeader">
            <div class="popover-search-box">
              <el-input
                size="mini"
                placeholder="搜索"
                v-model="filterText"
                clearable
                @change="handleFilterText"
                @input="handleFilterText"
              >
                <el-button slot="append" icon="el-icon-search"></el-button
              ></el-input>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group class="checkbox-list" v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
              </el-checkbox-group>
              <div style="padding-top: 10px">
                <p>已选{{ checkedCities.length }}项</p>
                <el-button size="mini" type="primary" @click="handleConfirmFilter('skuName')">确定</el-button>
                <el-button size="mini" @click="handleClear('skuName')">清除</el-button>
              </div>
            </div>
            <i slot="reference" class="icon-loudou head-search-icon" @click.stop.self="handleFilter('skuName')"></i>
          </el-popover>
        </template>
        <template slot="skuName" slot-scope="scope">
          <p class="prd-skuname" :title="scope.row.skuName">{{ scope.row.skuName }}</p>
        </template>
        <template slot="imageUrl" slot-scope="scope">
          <el-popover placement="right" title="" width="300" trigger="hover">
            <img v-if="scope.row.imageUrl" class="mini-img" :src="scope.row.imageUrl" alt="暂无图片" slot="reference" />
            <img class="big-img" :src="scope.row.imageUrl" :alt="scope.row.imageUrl" />
          </el-popover>
        </template>
        <template slot="createName" slot-scope="{ row }">
          <div>{{ row.createName }}</div>
          <div>{{ row.createTime }}</div>
        </template>
        <template slot="updateName" slot-scope="{ row }">
          <div>{{ row.updateName }}</div>
          <div>{{ row.updateTime }}</div>
        </template>
        <!-- 托盘规格 -->
        <!-- <template slot="palletSpec" slot-scope="{ row }">
          <div>{{ row.palletSpec }}</div>
        </template> -->
        <template slot="operation" slot-scope="{ row }">
          <avue-crud-ctrl :list="getCtrlList(row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>
<script>
import { tableOption, saleStatusOption } from "../../../const/crud/product/prdarchives"
import {
  fetchList,
  exportPrdchives,
  getSkuStatusCount,
  delPrdarchivesApi,
  plmSyncAllSku
} from "@/api/product/prdarchives_detail"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getObjByType } from "@/api/admin/dict"
import { mapGetters } from "vuex"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import { deepClone } from "@/util/util"
export default {
  name: "prdArchives",
  data() {
    return {
      props: { multiple: true },
      exportObj: {
        flag: true,
        url: String
      },
      data: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      archivesForm: {
        //搜索条件
        spuCode: "",
        skuName: "", //产品名称
        skuCode: "",
        brand: "",
        categoryId: [],
        saleStatus: "",
        productPositioning: null,
        createName: "",
        createTime: [],
        updateName: "",
        updateTime: [],
        skuCode: "",
        standardSkuCode: "",
        purchaseStatus: "",
        sealSampleStatus: ""
      },
      searchFormConfirm: {}, //确定的搜索条件
      treeCategoryData: [],
      categoryId: [], //类别id中间变量
      brandOption: [],
      productPositionOption: [],
      tabList: [
        { statusName: "全部", key: "ALL", countKey: "" },
        { statusName: "封样完成", key: "FINISH", countKey: "finish" },
        { statusName: "未完成", key: "UN_FINISH", countKey: "unFinish" }
      ],
      selectTab: "ALL",
      selectRows: [],
      searchFields: [
        { label: "创建时间", value: "createTime", type: "datetimerange", default: true },
        { label: "更新时间", value: "updateTime", type: "datetimerange" }
      ],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: false,
      initData: [],
      filterText: "",
      initCities: [],
      popoverVisibleMap: {
        spuCode: false,
        skuCode: false,
        standardSkuCode: false,
        skuName: false
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },

  created() {
    this.init()
  },
  mounted() {
    this.getList(this.page, this.searchFormConfirm)
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handleFilter(key) {
      this.checkedCities = []
      this.checkAll = false
      this.isIndeterminate = false

      this.cities = [...new Set(this.data.map((i) => i[key]))]
      this.initCities = this.cities
      this.filterText = ""
      this.initData = deepClone(this.data)
      for (let prop in this.popoverVisibleMap) {
        if (this.popoverVisibleMap.hasOwnProperty(prop) && prop !== key) {
          this.popoverVisibleMap[prop] = false
        }
      }
    },

    handleFilterText(key) {
      if (!this.filterText) return (this.cities = this.initCities)

      this.cities = this.initCities.filter((str) => str.toLowerCase().includes(this.filterText.toLowerCase()))
    },
    handleConfirmFilter(key) {
      if (this.filterText == "" && this.checkedCities.length == 0) return (this.data = this.initData)
      this.data = this.initData.filter((item) => this.checkedCities.includes(item[key]))
    },
    handleClear(key) {
      this.filterText = ""
      this.checkedCities = []
      this.checkAll = false
      this.isIndeterminate = false
      this.handleFilterText()
      this.data = this.initData
    },
    getCellClass({ row }) {
      if (row.exceptionFlag) {
        return "isAbnormalFlag"
      }
    },
    handleChangePosi() {
      if (this.archivesForm.productPositioning == "") {
        this.archivesForm.productPositioning = null
      }
    },
    handleChange() {
      this.archivesForm.categoryId = []
      this.categoryId.forEach((item) => {
        this.archivesForm.categoryId.push(item[item.length - 1])
      })
    },
    init() {
      // tab数量
      getSkuStatusCount().then((res) => {
        this.tabList.forEach((item) => {
          if (res.data.data[item.countKey] !== undefined) {
            item.statusName = item.statusName + "(" + res.data.data[item.countKey] + ")"
          }
        })
      })
      //销售状态
      getObjByType("sale_status").then((res) => {
        this.saleStatusOption = res.data.data
      })
      //产品定位
      getObjByType("product_positioning").then((res) => {
        this.productPositionOption = res.data.data
      })
      //品类
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
      //品牌
      fetchBrandAll().then((res) => {
        res.data.data.records.forEach((item) => {
          if (res.data.code === 0) {
            this.brandOption.push({
              value: item.brandId,
              label: item.brandName
            })
          }
        })
      })
    },
    async exportSearch() {
      let sealSampleStatus = this.archivesForm.sealSampleStatus
      // 过滤掉‘全部’的tab
      if (this.selectTab !== "ALL") {
        sealSampleStatus = this.selectTab
      }
      let res = await exportPrdchives({ ...this.searchFormConfirm, sealSampleStatus })
        .then((res) => {
          downloadBlob(res.data, "产品档案信息.xlsx", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSyncSku() {
      this.$confirm("是否同步产品档案数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await plmSyncAllSku()
        if (data.code == 0) {
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    sizeChange(val) {
      //切换每页显示数量
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
    },
    getList(page, params) {
      //查询请求
      page.current = page.currentPage
      page.size = page.pageSize
      let sealSampleStatus = this.archivesForm.sealSampleStatus
      // 过滤掉‘全部’的tab
      if (this.selectTab !== "ALL") {
        sealSampleStatus = this.selectTab
      }
      fetchList({ ...page, ...params, sealSampleStatus }).then((res) => {
        if (res.data.code === 0) {
          this.exportObj = true
          let data_res = res.data.data
          let records = data_res.records || []
          records.forEach((val) => {
            if (val.productWeight) {
              let arr = val.productWeight.split("/")
              if (arr.length === 2) {
                val.productWeight = arr[0]
                val.grossWeight = arr[1]
              }
            }
            val.imageUrl = val.imageUrl ? getTokenUrl([val.imageUrl]) : ""
          })
          this.data = records
          this.page.total = data_res.total
          this.page.pageSize = data_res.size
          this.page.currentPage = data_res.current
        }
      })
    },
    refreshChange() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
      this.getList(this.page, this.searchFormConfirm)
    },
    handleSubmit(val) {
      this.searchFormConfirm = {
        ...val,
        createName: this.archivesForm.createName,
        updateName: this.archivesForm.updateName,
        brand: this.archivesForm.brand,
        category: this.archivesForm.categoryId,
        saleStatus: this.archivesForm.saleStatus,
        productPositioning: this.archivesForm.productPositioning,
        skuName: this.archivesForm.skuName,
        spuCode: this.archivesForm.spuCode,
        brand: this.archivesForm.brand,
        skuCode: this.archivesForm.skuCode,
        standardSkuCode: this.archivesForm.standardSkuCode,
        beginCreateTime: this.archivesForm.beginCreateTime,
        endCreateTime: this.archivesForm.endCreateTime,
        beginUpdateTime: this.archivesForm.beginUpdateTime,
        endUpdateTime: this.archivesForm.endUpdateTime,
        purchaseStatus: this.archivesForm.purchaseStatus,
        sealSampleStatus: this.archivesForm.sealSampleStatus
      }

      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
      this.clearSelectClear()
    },

    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    searchReset() {
      this.searchFormConfirm = {}
      this.archivesForm = {}
      this.categoryId = []
      this.$refs.searchCrudItemRef.resetField()
    },
    // 升级操作
    async handleUpgrade(row) {
      // 只允许在一代SKU上进行产品升级
      if (row.parentSkuId) {
        this.$message.error("不允许二代产品作为父级升级")
        return
      }
      this.$router.push({
        path: `/product/openTag/edit/${row.invoiceId}`,
        query: {
          isUpGrade: 1,
          skuCode: row.skuCode
        }
      })
    },
    // 切换标签页
    changeTab() {
      this.clearSelectClear()
      this.page.page = 1
      if (this.selectTab !== "ALL" && this.selectTab !== "UN_FINISH") {
        this.archivesForm.sealSampleStatus = this.selectTab
      } else {
        this.archivesForm.sealSampleStatus = ""
      }
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    // 新品创建 跳转到新品编辑页
    handleCreate() {
      this.$router.push({
        path: `/product/openTag/index/-1`
      })
    },
    // 封样 跳转到封样详情页面
    handleClose() {
      if (this.selectRows.length >= 2) {
        this.$message.error("只能勾选一条数据")
        return
      }
      const { skuId, skuCode } = this.selectRows[0]
      this.$router.push({
        path: `/sealSampleTable/index`,
        query: {
          skuId,
          skuCode,
          disabled: false
        }
      })
    },
    handleDel() {
      if (this.selectRows.length !== 1) {
        this.$message.error("请勾选一条数据")
        return
      }
      this.$confirm("是否确认删除该SKU？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let skuCode = this.selectRows[0].skuCode
        const { data } = await delPrdarchivesApi(skuCode)
        if (data.code === 0) {
          this.$message.success("删除成功")
          this.clearSelectClear()
          this.refreshChange()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getCtrlList(row) {
      return [
        {
          title: "升级",
          item: row,
          clickFn: (row) => {
            this.handleUpgrade(row)
          },
          show: true
        }
      ]
    },
    updateField(obj) {
      let beginCreateTime,
        endCreateTime,
        beginUpdateTime,
        endUpdateTime = undefined

      if (obj.createTime) {
        beginCreateTime = obj.createTime[0]
        endCreateTime = obj.createTime[1]
      } else {
        beginCreateTime = undefined
        endCreateTime = undefined
      }

      if (obj.updateTime) {
        beginUpdateTime = obj.updateTime[0]
        endUpdateTime = obj.updateTime[1]
      } else {
        beginUpdateTime = undefined
        endUpdateTime = undefined
      }

      Object.assign(this.archivesForm, { beginCreateTime, endCreateTime, beginUpdateTime, endUpdateTime })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";

.mini-img {
  height: 40px;
  width: 80px;
  object-fit: cover;
}

.big-img {
  height: 300px;
  width: 300px;
  object-fit: cover;
}
::v-deep .isAbnormalFlag {
  background: rgba(244, 201, 51, 0.1) !important;
}
.head-search-icon {
  font-size: 12px !important;
  padding: 0 4px;
}
.popover-search-box {
}
.checkbox-list {
  height: 200px;
  max-height: 250px;
  overflow-y: auto;
  /* 自定义滚动条 */
  /* 整个滚动条 */
  &::-webkit-scrollbar {
    width: 8px; /* 滚动条的宽度 */
    height: 8px; /* 滚动条的高度（对于水平滚动条） */
  }

  /* 滚动条的轨道 */
  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 轨道的背景色 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background: #939393; /* 滑块的背景色 */
    border-radius: 4px; /* 滑块的圆角 */
  }

  /* 滚动条滑块在悬停时 */
  &::-webkit-scrollbar-thumb:hover {
    background: #939393; /* 滑块在悬停时的背景色 */
  }
  .el-checkbox {
    display: block;
  }
}
</style>
