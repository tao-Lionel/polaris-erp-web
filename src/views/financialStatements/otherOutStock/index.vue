<template>
  <div id="otherOutStock">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="otherOutStockOption"
        @on-load="onload"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @current-change="currentChange"
      >
        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="">
              <el-date-picker
                v-model="searchForm.month"
                :picker-options="pickerOptions"
                value-format="yyyy-MM"
                size="small"
                type="month"
                placeholder="选择月份"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="">
              <el-input
                v-model="searchForm.fBillNo"
                v-search-input
                size="small"
                placeholder="单号,支持多个"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="fStockId" label="">
              <el-select v-model="searchForm.fStockId" size="small" placeholder="仓库" clearable>
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseCode"
                  :label="item.warehouseName"
                  :value="item.warehouseCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fStockOrgId" label="">
              <el-select v-model="searchForm.fStockOrgId" size="small" placeholder="库存组织" clearable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="fBillNo">
          <router-link
            :to="{ path: '/financialStatements/psi/otherOutStockDetail/detail', query: { fBillNo: scope.row.fBillNo } }"
            >{{ scope.row.fBillNo }}</router-link
          >
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
// import {

// } from '@/api/financialStatements/index'
import { otherOutStockOption } from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getObjByType } from "@/api/admin/dict"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getList } from "@/api/financialStatements/psiStatements/otherOutStock"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      searchForm: {
        month: "",
        fBillNo: "",
        fSupplierId: "",
        fStockOrgId: "",
        fStockId: ""
      },
      tableData: [],
      otherOutStockOption: otherOutStockOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],
      searchFormConfirm: {
        filtering: []
      },
      corporationArr: [],
      supplierOptions: [],
      warehouseOptions: [],
      treeCategoryData: [], // 品类
      categoryIdArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  components: {},
  created() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()
    month = month < 10 ? "0" + month : month
    this.searchForm.month = `${year}-${month}`
    this.dataInit()
    this.handleSearchFilter()
    this.getList()
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
        }
      })
      getAllSupplier().then((res) => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          res.data.data.forEach((item) => {
            this.supplierOptions.push({
              value: item.supplierNo,
              label: item.supplierName
            })
          })
        }
      })
      getAllWarehouse({
        funcState: "1",
        delFlag: "0",
        isFba: false
      }).then((res) => {
        if (res.data.code === 0) {
          this.warehouseOptions = res.data.data
        }
      })
    },
    //搜索条件处理
    handleSearchFilter() {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.searchFormConfirm.filtering = this.transformSearchForm(this.searchFormConfirm)
      console.log("搜索条件", this.searchFormConfirm)
    },
    //处理搜索条件
    transformSearchForm(searchForm) {
      let result = []
      for (let key in searchForm) {
        let value = searchForm[key]
        if (typeof value === "string") {
          value = value.split(",")
        }
        result.push({
          field: key,
          value: value
        })
      }
      return result
    },
    // 刷新回调
    refreshChange() {
      this.getList(this.page, this.searchFormConfirm)
    },
    // 搜索回调
    searchChange(params, page) {
      this.handleSearchFilter()
      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
    },
    searchReset() {
      this.searchForm = {}
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.crud.toggleSelection()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    getList() {
      getList({
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchFormConfirm
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.page.pageSize = res.data.data.size
          this.page.currentPage = res.data.data.page
        }
      })
    }
  }
}
</script>

<style lang="scss">
#otherOutStock > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
</style>
