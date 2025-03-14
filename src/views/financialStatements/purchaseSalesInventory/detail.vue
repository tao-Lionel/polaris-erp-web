<template>
  <div id="purchaseSalesInventory">
    <basic-container>
      <avue-crud
        ref="markedCrud"
        :page="page"
        :data="tableData"
        :option="purchaseSalesInventoryDetailOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="月份统计" name="first"></el-tab-pane>
            <el-tab-pane label="月份明细" name="second"></el-tab-pane>
          </el-tabs>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="month" label="">
              <el-date-picker
                v-model="searchForm.month"
                type="month"
                value-format="yyyy-MM"
                :picker-options="pickerOptions"
                placeholder="选择月份"
                size="small"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="corporationCode" label="">
              <el-select v-model="searchForm.corporationCode" size="small" placeholder="库存组织" filterable clearable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseCode" label="">
              <el-select v-model="searchForm.warehouseCode" size="small" placeholder="仓库" filterable clearable>
                <el-option
                  v-for="item in warehouseArr"
                  :key="item.warehouseCode"
                  :label="item.warehouseName"
                  :value="item.warehouseCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="商品编码" clearable=""></el-input>
            </el-form-item>
            <el-form-item prop="isDifferent" label="差异">
              <el-radio-group v-model="searchForm.isDifferent">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">有差异</el-radio>
                <el-radio :label="0">无差异</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item prop="aa" label="审核状态">
              <el-select v-model="searchForm.aa" size="small" placeholder="请选择" filterable clearable>
                <el-option v-for="item in examineArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="bb" label="推送金蝶">
              <el-select v-model="searchForm.bb" size="small" placeholder="请选择" filterable clearable>
                <el-option v-for="item in sendArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </template>

        <template slot-scope="scope" slot="inTravelCountDiff">
          <span style="color: #f56c6c" v-if="scope.row.inTravelCountDiff > 0">{{ scope.row.inTravelCountDiff }}</span>
          <span v-else-if="scope.row.inTravelCountDiff === 0">{{ scope.row.inTravelCountDiff }}</span>
          <span style="color: #67c23a" v-else>{{ scope.row.inTravelCountDiff }}</span>
        </template>
        <template slot-scope="scope" slot="stockCountDiff">
          <span style="color: #f56c6c" v-if="scope.row.stockCountDiff > 0">{{ scope.row.stockCountDiff }}</span>
          <span v-else-if="scope.row.stockCountDiff === 0">{{ scope.row.stockCountDiff }}</span>
          <span style="color: #67c23a" v-else>{{ scope.row.stockCountDiff }}</span>
        </template>
        <template slot-scope="scope" slot="brandSolt">
          <router-link
            :to="{ path: '/financialStatements/purchaseSalesInventoryDetail/detail', query: { id: scope.row.id } }"
            >明细</router-link
          >
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { finEnterSaleStoreDetail, bsewarehouseAll } from "@/api/financialStatements/index"
import {
  purchaseSalesInventoryDetailOption,
  purchaseSalesInventoryLogOption
} from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getObjByType } from "@/api/admin/dict"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      psiStatus: false,
      searchForm: {
        month: "",
        corporationCode: "",
        warehouseCode: "",
        skuCode: "",
        isDifferent: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [{ key: "skuCode", operator: "LIKE" }],
      tableData: [],
      purchaseSalesInventoryDetailOption: purchaseSalesInventoryDetailOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      corporationArr: [],
      examineArr: [],
      sendArr: [],
      warehouseArr: [],
      treeCategoryData: [], // 品类
      categoryIdArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      activeName: "second"
    }
  },
  components: {},
  created() {
    let obj = this.$route.query
    this.searchForm.month = obj.month
    this.searchForm.corporationCode = obj.corporationCode
    this.searchForm.warehouseCode = obj.warehouseCode
    this.dataInit()
    this.searchFormConfirm = this.transformSearchForm()
    this.getList()
  },
  activated() {
    this.activeName = "second"
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 数据初始化
    dataInit() {
      getAll().then((res) => {
        if (res.data.code === 0) {
          this.corporationArr = res.data.data
          this.searchForm.corporationCode = this.$route.query.corporationCode
        }
      })
      bsewarehouseAll().then((res) => {
        if (res.data.code === 0) {
          this.warehouseArr = res.data.data.filter((item) => item.funcState === "1")
          this.searchForm.warehouseCode = this.$route.query.warehouseCode
        }
      })
    },
    handleClick() {
      if (this.activeName === "first") {
        this.$router.push({
          path: `/financialStatements/purchaseSalesInventory`,
          query: {}
        })
      }
    },

    // 刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    // 处理搜索条件
    transformSearchForm() {
      let result = []
      for (let key in this.searchForm) {
        let value = this.searchForm[key]
        if (typeof value === "string" && value) {
          value = value.split(",")
        }
        if (typeof value === "number") {
          value = String(value).split(",")
        }
        if (value && value.length) {
          result.push({
            field: key,
            value: value
          })
        }
      }
      for (let i = 0; i < this.searchFormOperator.length; i++) {
        result.forEach((item) => {
          if (this.searchFormOperator[i].key === item.field) {
            item.operator = this.searchFormOperator[i].operator
          }
        })
      }
      return result
    },
    // 搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.searchFormConfirm = this.transformSearchForm()
      this.getList()
    },
    searchReset() {
      this.searchForm.corporationCode = ""
      this.searchForm.warehouseCode = ""
      this.searchForm.skuCode = ""
      this.searchForm.isDifferent = ""
      this.$refs["searchForm"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.Crud.toggleSelection()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    getList() {
      finEnterSaleStoreDetail(
        Object.assign({
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          isDifferent: this.searchForm.isDifferent,
          filtering: this.searchFormConfirm
        })
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    }
  }
}
</script>

<style lang="scss">
#purchaseSalesInventory > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
#purchaseSalesInventory {
  .brandSolt_ope {
    margin-right: 10px;
  }
  .el-select .el-input__inner {
    height: auto !important;
  }
  .el-dialog .el-form-item {
    display: inline-block;
  }
}
</style>
