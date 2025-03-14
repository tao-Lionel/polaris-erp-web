<template>
  <div id="accountsPayable">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="accountsPayableOption"
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

            <el-form-item prop="fSupplierId" label="">
              <el-select v-model="searchForm.fSupplierId" size="small" placeholder="供应商" clearable filterable>
                <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fSettleOrgId" label="">
              <el-select v-model="searchForm.fSettleOrgId" size="small" placeholder="结算组织" clearable filterable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fSetAccountType" label="" filterable>
              <el-select v-model="searchForm.fSetAccountType" size="small" placeholder="立项类型" filterable>
                <el-option v-for="item in financePayable" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fFeeItem" label="" filterable>
              <el-select v-model="searchForm.fFeeItem" size="small" placeholder="费用项目" filterable>
                <el-option
                  v-for="item in costAll"
                  :key="item.tmsLogisticsCostTypeCode"
                  :label="item.tmsLogisticsCostTypeName"
                  :value="item.tmsLogisticsCostTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fAllocationStatus" label="" filterable>
              <el-select v-model="searchForm.fAllocationStatus" size="small" placeholder="成本分配" filterable>
                <el-option v-for="item in allocation" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="fBillNo">
          <router-link
            v-if="scope.row.fSetAccountType === 'ESTIMATED_PAYABLE'"
            :to="{
              path: '/financialStatements/cost/accountsPayableDetail/psdetail/',
              query: { fBillNo: scope.row.fBillNo }
            }"
          >
            {{ scope.row.fBillNo }}</router-link
          >
          <router-link
            v-else
            :to="{
              path: '/financialStatements/cost/accountsPayableDetail/detail/',
              query: { fBillNo: scope.row.fBillNo }
            }"
          >
            {{ scope.row.fBillNo }}</router-link
          >
        </template>

        <template slot-scope="scope" slot="fPayableBillNo">
          <router-link
            :to="{
              path: '/financialStatements/cost/accountsPayableDetail/detail/',
              query: { fBillNo: scope.row.fPayableBillNo }
            }"
          >
            {{ scope.row.fPayableBillNo }}</router-link
          >
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { getObjByType, getcostAll, finPayableList } from "@/api/financialStatements/index"
import { accountsPayableOption } from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
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
        fSettleOrgId: "",
        fSetAccountType: "",
        fFeeItem: "",
        fAllocationStatus: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [
        // { key: 'fFeeItem', operator: 'like' }
      ],
      tableData: [
        // {fBillNo: 11212, fSetAccountType: 1, fSetAccountTypeName: '财务暂估'},
        // {fBillNo: 11212, fSetAccountType: 2, fSetAccountTypeName: '暂估应付'}
      ],
      accountsPayableOption: accountsPayableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      corporationArr: [],
      financePayable: [],
      costAll: [],
      allocation: [],
      supplierOptions: [],
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
    dataInit() {
      // 法人主体
      getAll().then((res) => {
        if (res.data.code === 0) {
          this.corporationArr = res.data.data
        }
      })
      // 供应商
      getAllSupplier().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.supplierOptions.push({
              value: item.supplierNo,
              label: item.supplierName
            })
          })
        }
      })
      getObjByType("finance_payable_type").then((res) => {
        if (res.data.code === 0) {
          this.financePayable = res.data.data
        }
      })
      getObjByType("finance_allocation_status").then((res) => {
        if (res.data.code === 0) {
          this.allocation = res.data.data
        }
      })
      getcostAll().then((res) => {
        if (res.data.code === 0) {
          this.costAll = res.data.data
        }
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
    searchChange() {
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
      finPayableList(
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
#accountsPayable > .basic-container > .el-card > .el-card__body {
  padding: 5px 20px;
}
</style>
