<template>
  <div id="receipt">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="receiptOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
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

            <el-form-item prop="fBillNo" label="">
              <el-input
                v-model="searchForm.fBillNo"
                v-search-input
                size="small"
                placeholder="单号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="fPayUnit" label="">
              <el-select v-model="searchForm.fPayUnit" size="small" placeholder="付款单位" clearable>
                <el-option
                  v-for="item in storeAll"
                  :key="item.kingdeeCustCode"
                  :label="item.kingdeeCustName"
                  :value="item.kingdeeCustCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fPayOrgId" label="">
              <el-select v-model="searchForm.fPayOrgId" size="small" placeholder="收款组织" clearable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationCode"
                  :label="item.corporationName"
                  :value="item.corporationCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fOraPo" label="">
              <el-input v-model="searchForm.fOraPo" v-search-input size="small" placeholder="PO号" clearable></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="fBillNo">
          <router-link
            :to="{ path: '/financialStatements/cost/receiptDetail/detail/', query: { fBillNo: scope.row.fBillNo } }"
            >{{ scope.row.fBillNo }}</router-link
          >
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { finReceiveBillList, bsestoreAll } from "@/api/financialStatements/index"
import { receiptOption } from "@/const/crud/financialStatements/index"
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
      searchForm: {
        month: "",
        fOraPo: "",
        fBillNo: "",
        fPayUnit: "",
        fPayOrgId: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [
        // { key: 'tmsLogisticsCostTypeName', operator: 'like' }
      ],
      tableData: [],
      receiptOption: receiptOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],
      corporationArr: [],
      storeAll: [],
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
    this.searchFormConfirm = this.transformSearchForm()
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
      bsestoreAll().then((res) => {
        this.storeAll = res.data.data
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
      this.searchFormConfirm = this.transformSearchForm()
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
      finReceiveBillList(
        Object.assign({
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
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
#receipt > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
</style>
