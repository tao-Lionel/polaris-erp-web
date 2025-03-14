<template>
  <div class="contract">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        class="handle-cell-hidden"
      >
        <template slot="menuLeft">
          <el-button v-if="permissions.contract_audit" type="primary" size="small" @click="handleAudit()">
            财务审核
          </el-button>
          <el-button
            v-if="permissions.internalContract_contract_download"
            type="primary"
            size="small"
            @click="downLoadFile()"
          >
            下载合同
          </el-button>
        </template>
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item class="form-label" label="" prop="searchDate">
              <el-date-picker
                style="width: 250px"
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="合同开始日期"
                end-placeholder="合同结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="contractNo" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.contractNo"
                placeholder="合同编号"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="supplierNo" label="">
              <el-select
                class="custom-select"
                size="small"
                clearable
                v-model="searchForm.supplierNo"
                filterable
                placeholder="供货方(乙方)"
              >
                <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inOrgId" label="">
              <el-select
                class="custom-select"
                size="small"
                clearable
                v-model="searchForm.inOrgId"
                filterable
                placeholder="采购方(甲方)"
              >
                <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderNo" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.orderNo"
                placeholder="内部采购订单"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="contractStatus">
              <el-select size="small" clearable v-model="searchForm.contractStatus" filterable placeholder="合同状态">
                <el-option
                  v-for="item in contractStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <!-- <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance" @submit.native.prevent>
            <el-form-item prop="settleaccountTypeId" label="结算方式" v-if="false">
              <el-select
                multiple
                filterable
                collapse-tags
                style="width: 160px"
                v-model="searchForm.settleaccountTypeId"
                size="small"
                placeholder="选择结算方式"
              >
                <el-option
                  v-for="(item, index) in settleaccountTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="currency" label="币别" v-if="false">
              <el-select
                multiple
                filterable
                collapse-tags
                style="width: 150px"
                v-model="searchForm.currency"
                size="small"
                placeholder="选择币别"
              >
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode" label="sku" v-if="false">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.skuCode"
                placeholder="请输入sku编码"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="spuCode" label="spu" v-if="false">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.spuCode"
                placeholder="请输入spu编码"
                size="small"
              ></el-input>
            </el-form-item>
            <el-button native-type="submit" @click="searchChange" v-show="false"></el-button>
          </el-form>
        </template> -->
        <template slot="contractNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link :to="'/purchase/internalContract/detail?contractNo=' + scope.row.contractNo">{{
              scope.row.contractNo
            }}</router-link>
          </copy-text>
        </template>
        <template slot="contractStatus" slot-scope="scope">
          <div v-if="scope.row.contractStatus === 1">财务审核</div>
          <div v-else style="color: #67c23a">审核通过</div>
        </template>
        <template slot="orderNo" slot-scope="scope">
          <router-link
            :to="'/transfer/fristMileTransfer/internalOrderDetail?internalTransactionOrderNo=' + scope.row.orderNo"
            >{{ scope.row.orderNo }}</router-link
          >
        </template>
      </avue-crud>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getSettleaccountTypeOptions,
  financialOperateBatchApi
} from "@/api/purchase/internalContract/contract"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { tableOption } from "@/const/crud/purchase/internalContract/contract"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getTokenUrlFile, getTokenUrl } from "@/util/auth"

export default {
  name: "pocontract",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      currencyOptions: [],
      settleaccountTypeOptions: [],
      fileList: [],
      selectRows: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        contractNo: "", //合同编号
        supplierName: "", //供应商
        searchDate: "",
        status: "",
        corporationName: "",
        settleaccountTypeId: "",
        currency: "",
        contractStatus: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      corporationOptions: [],
      contractStatusOptions: [
        { label: "财务审核", value: 1 },
        { label: "审核通过", value: 2 }
      ]
    }
  },
  created() {
    //获取结算方式下拉列表
    getSettleaccountTypeOptions().then((response) => {
      if (response.data.code == 0) {
        response.data.data.forEach((item) => {
          this.settleaccountTypeOptions.push({
            value: item.settleaccountTypeId,
            label: item.settleaccountName
          })
        })
      }
    })
    //获取币别下拉列表
    getAll().then((response) => {
      if (response.data.code == 0) {
        response.data.data.forEach((item) => {
          this.currencyOptions.push({
            value: item.currency,
            label: item.currency
          })
        })
      }
    })
    getBsecorporationAll().then((res) => {
      res.data.data.forEach((item) => {
        this.corporationOptions.push({
          label: item.corporationName,
          value: item.corporationId
        })
      })
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {},
  methods: {
    selectionChange(selected) {
      this.selectRows = selected
    },
    getList(page, params) {
      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      page = page
        ? page
        : {
            currentPage: 1
          }
      //将搜索的条件放入到确认的搜索条件中
      if (this.searchForm.searchDate) {
        this.searchForm.contractStartDate = this.searchForm.searchDate[0]
        this.searchForm.contractEndDate = this.searchForm.searchDate[1]
        delete this.searchForm.searchDate
      }
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //下载文件
    downLoadFile() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }

      for (let item of this.selectRows) {
        if (item.contractStatus !== 2) {
          this.$message.warning("只能下载审核通过的合同")
          return
        }
      }

      if (this.selectRows.length > 50) {
        this.$message.warning("一次批量最多只能下载50份合同")
        return
      }

      let contractNo = ""
      this.selectRows.forEach((item, index) => {
        contractNo += "contractNoList=" + item.contractNo + "&"
      })
      contractNo = contractNo.substring(0, contractNo.length - 1)
      this.downloadUrl = getTokenUrlFile("/api/warehouse/wmsInternalTransactionOrderContract/download?" + contractNo)
      window.location.href = this.downloadUrl
      this.$message.success("下载成功!")
    },
    // 财务审核
    async handleAudit() {
      if (!this.selectRows && this.selectRows.length === 0) {
        this.$message.warning("请选择数据")
        return
      }

      for (let item of this.selectRows) {
        if (item.contractStatus !== 1) {
          this.$message.warning("只能勾选状态是财务审核的数据")
          return
        }
      }

      const contractNoArr = this.selectRows.map((item) => item.contractNo)

      const { data } = await financialOperateBatchApi(contractNoArr)
      if (data.code === 0) {
        this.$message.success("操作成功")
        this.$refs.crud.selectClear()
        this.getList(this.page)
      } else {
        this.$message.error("操作失败")
      }
    }
  }
}
</script>

<style lang="scss"></style>
