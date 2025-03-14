<template>
  <div id="accountsPayable">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="purchaseReturnOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <!-- <template slot="menuLeft">
          <div class="tableBeforeSlot-elbutton">
            <el-button type="primary" size="small" >下载发票</el-button>
          </div>
        </template> -->

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="" prop="transactionDate">
              <el-date-picker
                v-model="searchForm.transactionDate"
                type="daterange"
                range-separator="至"
                start-placeholder="业务开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="业务结束日期"
                size="small"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="" prop="orderNo">
              <el-input
                v-model="searchForm.orderNo"
                v-search-input
                size="small"
                placeholder="采购单号,支持多个"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="supplierNo" label="">
              <el-select v-model="searchForm.supplierNo" size="small" placeholder="供应商" clearable>
                <el-option v-for="item in supplierArr" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inOrgId" label="">
              <el-select v-model="searchForm.inOrgId" size="small" placeholder="采购组织" clearable>
                <el-option
                  v-for="item in corporationArr"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderType" label="">
              <el-select v-model="searchForm.orderType" size="small" placeholder="源单类型" clearable multiple>
                <el-option v-for="item in orderTypeArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="relationNo" label="">
              <el-input
                v-model="searchForm.relationNo"
                v-search-input
                size="small"
                placeholder="源单号,支持多个"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="orderNo">
          <router-link
            :to="{ path: '/transaction/purchaseReturnDetail/detail', query: { orderNo: scope.row.orderNo } }"
            >{{ scope.row.orderNo }}</router-link
          >
        </template>

        <template slot-scope="scope" slot="relationNo">
          <router-link :to="{ path: '/transfer/fristMileTransfer/detail', query: { id: scope.row.id } }">{{
            scope.row.relationNo
          }}</router-link>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { listPage, getAllSupplier } from "@/api/internalTransaction/index"
import { purchaseReturnOption } from "@/const/crud/internalTransaction/index"
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
        transactionDate: [],
        orderNo: "",
        supplierNo: "",
        inOrgId: "",
        orderType: "",
        relationNo: ""
      },
      searchFormConfirm: [],
      searchFormOperator: [
        // { key: 'fFeeItem', operator: 'like' }
      ],
      tableData: [],
      purchaseReturnOption: purchaseReturnOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectRows: [],

      corporationArr: [],
      orderTypeArr: [],
      supplierArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  components: {},
  created() {
    this.dataInit()
    this.searchChange()
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
          this.supplierArr = res.data.data
        }
      })
      getObjByType("inter_transaction_order_type").then((res) => {
        this.orderTypeArr = res.data.data.filter((item) => {
          return item.value === "PURCHASE_RETURN" || item.value === "SALE_RETURN"
        })
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
        if (key === "orderType" && !value.length) {
          value = ["PURCHASE_RETURN", "SALE_RETURN"]
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
      result.unshift({ field: "orderType", value: ["PURCHASE_RETURN", "SALE_RETURN"] })
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
      listPage(
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
