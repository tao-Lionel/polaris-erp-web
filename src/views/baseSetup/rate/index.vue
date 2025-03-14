<template>
  <div id="accountsPayable">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="rateOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="exportList">导出</el-button>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="workDateTime">
              <el-date-picker
                v-model="searchForm.workDateTime"
                type="month"
                value-format="yyyy-MM"
                :picker-options="pickerOptions"
                placeholder="执行月份"
                size="small"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="currencySource">
              <el-select v-model="searchForm.currencySource" size="small" placeholder="原币" filterable clearable>
                <el-option
                  v-for="item in currency"
                  :key="item.currency"
                  :label="item.currencyName"
                  :value="item.currency"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="currencyTarget">
              <el-select v-model="searchForm.currencyTarget" size="small" placeholder="目标币" filterable clearable>
                <el-option
                  v-for="item in currency"
                  :key="item.currency"
                  :label="item.currencyName"
                  :value="item.currency"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, exportBseCurrencyExchangePage, getCurrency } from "@/api/baseSetup/rate"
import { rateOption } from "@/const/crud/baseSetup/rate"
import { getAll } from "@/api/baseSetup/bsecorporation"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      searchForm: {
        workDateTime: "",
        currencySource: "",
        currencyTarget: ""
      },
      // searchFormConfirm: [],
      // searchFormOperator: [
      //   { key: 'fFeeItem', operator: 'like' }
      // ],
      tableData: [],
      rateOption: rateOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      currency: []
    }
  },
  components: {},
  created() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    month = month < 10 ? "0" + month : month
    this.searchForm.workDateTime = `${year}-${month}`
    this.dataInit()
    // this.searchFormConfirm = this.transformSearchForm()
    this.getList()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    dataInit() {
      getCurrency().then((res) => {
        if (res.data.code === 0) {
          this.currency = res.data.data
        }
      })
    },
    exportList() {
      exportBseCurrencyExchangePage(this.searchForm)
        .then((res) => {
          downloadBlob(res.data, "汇率导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    // 处理搜索条件
    transformSearchForm() {
      let result = []
      console.log(this.searchForm)
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
      // this.searchFormConfirm = this.transformSearchForm()
      this.getList()
    },
    searchReset() {
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
      this.$refs.crud.toggleSelection()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    getList() {
      fetchList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize
            // filtering: this.searchFormConfirm
          },
          this.searchForm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    }
  }
}
</script>

<style lang="scss">
#accountsPayable > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
</style>
