<template>
  <div id="restoreIndonesianFactoryCost">
    <basic-container>
      <avue-crud
        ref="restoreCostCrud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        :summaryMethod="getSummaries"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="generateAction">生成单据</el-button>

          <el-dropdown-button type="primary" size="small" buttonText="审核" :command="true" @command="handleCommand">
            <el-dropdown-item :command="false">反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button type="primary" size="small" @click="pushAction">推送金蝶</el-button>
          <el-button type="primary" size="small" @click="showRecord">操作日志 </el-button>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="month">
              <el-date-picker
                size="small"
                v-model="searchForm.month"
                type="month"
                value-format="yyyy-MM"
                :picker-options="pickerOptions"
                placeholder="选择月份"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                placeholder="SKU，支持多个"
                size="small"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="ptcSkuCode">
              <el-input
                v-model="searchForm.ptcSkuCode"
                placeholder="印尼SKU，支持多个"
                size="small"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="fPushStatus">
              <el-select size="small" placeholder="推送金蝶" filterable clearable v-model="searchForm.fPushStatus">
                <el-option v-for="item in sendArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="fAuditStatus" slot-scope="scope">
          <span class="show-status">
            <i class="dot" :class="matchState('fAuditStatus', scope.row.fAuditStatus).color"></i>
            <span>{{ matchState("fAuditStatus", scope.row.fAuditStatus).text }}</span>
          </span>
        </template>

        <template slot="fPushStatus" slot-scope="scope">
          <span class="show-status">
            <i class="dot" :class="matchState('fPushStatus', scope.row.fPushStatus).color"></i>
            <span>{{ matchState("fPushStatus", scope.row.fPushStatus).text }}</span>
          </span>
        </template>
      </avue-crud>

      <el-dialog title="工厂成本还原-操作日志" :visible.sync="psiStatus" width="65%" :close-on-click-modal="false">
        <avue-crud
          ref="logCrud"
          :page="logPage"
          :data="logData"
          id="purchaseSalesInventoryIndex"
          :option="purchaseSalesInventoryLogOption"
          @current-change="logCurrentChange"
        >
          <template slot="tableBeforeSlot">
            <el-form :inline="true">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-date-picker
                      v-model="logForm.bizId"
                      type="month"
                      value-format="yyyyMM"
                      :picker-options="pickerOptions"
                      placeholder="选择月份"
                      @change="bizIdChange"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item size="small" style="margin-bottom: 10px">
                    <el-select
                      size="small"
                      placeholder="请选择操作类型"
                      clearable
                      v-model="logForm.operateType"
                      @change="operateTypeChange"
                    >
                      <el-option v-for="item in typeArr" :key="item.label" :label="item.label" :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- <el-form-item size="small" style="margin-bottom: 10px">
                <el-button type="primary" @click="logToSearch" size="small">搜索</el-button>
              </el-form-item> -->
            </el-form>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="psiStatus = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { tableData } from "@/const/crud/data"
import { restoreIndonesianFactoryCostOption } from "./index"
import { purchaseSalesInventoryLogOption } from "@/const/crud/financialStatements/index"

import { mapGetters } from "vuex"
import { getBizLogPage, getObjByType } from "@/api/financialStatements/index"
import {
  getIndonesianFactoryCost,
  generate,
  audit,
  revertAudit,
  push
} from "@/api/financialStatements/restoreIndonesianFactoryCost.js"
import _ from "lodash"

export default {
  name: "restoreIndonesianFactoryCost",
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      tableOption: restoreIndonesianFactoryCostOption,
      purchaseSalesInventoryLogOption: purchaseSalesInventoryLogOption,
      psiStatus: false,
      searchForm: {
        month: "",
        skuCode: "",
        ptcSkuCode: "",
        fPushStatus: ""
      },
      logData: [],
      logPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20]
      },
      logForm: {
        bizId: "",
        className: "FinRestoreAdjust",
        operateType: ""
      },
      sendArr: [],
      auditArr: [],
      typeArr: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      // 总数量
      totalQuantity: 0
    }
  },
  components: {},
  created() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()
    month = month < 10 ? "0" + month : month
    this.searchForm.month = `${year}-${month}`
    this.logForm.bizId = `${year}${month}`

    getObjByType("finance_restore_adjust_log_type").then((res) => {
      if (res.data.code === 0) {
        this.typeArr = res.data.data
      }
    })
    getObjByType("kingdee_audit_status").then((res) => {
      if (res.data.code === 0) {
        this.auditArr = res.data.data
      }
    })
    getObjByType("kingdee_push_status").then((res) => {
      if (res.data.code === 0) {
        this.sendArr = res.data.data
      }
    })
    this.getList()
  },

  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async getList() {
      const postData = this.convertToFiltering(this.searchForm)

      const { data } = await getIndonesianFactoryCost({
        filtering: postData,
        page: this.page.currentPage,
        pageSize: this.page.pageSize
      })
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.currentPage = data.data.page
        this.page.total = data.data.total
        this.page.pageSize = data.data.size
        this.totalQuantity = data.data.totalQuantity
      }
    },
    convertToFiltering(searchForm) {
      const filtering = []
      for (const field in searchForm) {
        if (searchForm[field] !== "") {
          if (field === "skuCode" || field === "ptcSkuCode") {
            filtering.push({
              operator: "EQUAL",
              field: field,
              value: searchForm[field].split(",").filter((item) => item !== "")
            })
          } else {
            filtering.push({
              operator: "EQUAL",
              field: field,
              value: searchForm[field]
            })
          }
        }
      }
      return filtering
    },

    async generateAction() {
      const { data } = await generate(this.searchForm.month)
      if (data.code === 0) {
        this.$message({
          message: "生成单据成功",
          type: "success"
        })
        this.logPage.currentPage = 1
        this.getList()
      }
    },
    async auditAction() {
      const { data } = await audit(this.searchForm.month)
      if (data.code === 0) {
        this.$message({
          message: "审核成功",
          type: "success"
        })
        this.logPage.currentPage = 1
        this.getList()
      }
    },

    async revertAuditAction() {
      const { data } = await revertAudit(this.searchForm.month)
      if (data.code === 0) {
        this.$message({
          message: "反审核成功",
          type: "success"
        })
        this.logPage.currentPage = 1
        this.getList()
      }
    },

    async pushAction() {
      const { data } = await push(this.searchForm.month)
      if (data.code === 0) {
        this.$message({
          message: "推送金蝶成功",
          type: "success"
        })
        this.logPage.currentPage = 1
        this.getList()
      }
    },

    matchState(keyName, val) {
      let obj = {
        text: "",
        color: ""
      }
      const getTypeValue = (value) => {
        const fItem = this.sendArr.find((item) => {
          return item.value === value
        })
        return fItem.label
      }
      const getAuditTypeValue = (value) => {
        const fItem = this.auditArr.find((item) => {
          return item.value === value
        })
        return fItem.label
      }
      if (keyName === "fAuditStatus") {
        obj.text = getAuditTypeValue(val)

        switch (val) {
          case "AUDITED":
            obj.color = "dot-green"
            break
          case "UNAUDITED":
            obj.color = "dot-red"
            break
        }
      } else {
        obj.text = getTypeValue(val)
        switch (val) {
          case "SUCCESS":
            obj.color = "dot-green"
            break
          case "PUSHING":
            obj.color = "dot-yellow"
            break
          case "FAIL":
            obj.color = "dot-red"
            break
          default:
            obj.color = "dot-gray"
        }
      }
      return obj
    },
    // 搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      console.log(2222, this.$refs.searchForm)
      this.$refs.searchForm.resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getList()
    },

    clearSelectClear() {
      this.$refs.Crud.toggleSelection()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    // 操作日志
    showRecord() {
      this.psiStatus = true
      this.toSearch()
    },
    async handleCommand(val) {
      if (val) {
        this.auditAction()
      } else {
        this.revertAuditAction()
      }
    },
    logCurrentChange(val) {
      this.logPage.currentPage = val
      this.toSearch()
    },
    logToSearch() {
      if (!this.logForm.bizId) {
        this.$message.warning("月份不能为空！")
        return
      }
      this.logPage.currentPage = 1
      this.toSearch()
    },
    toSearch() {
      let obj = _.cloneDeep(this.logForm)
      getBizLogPage(
        Object.assign(
          {
            current: this.logPage.currentPage,
            size: this.logPage.pageSize
          },
          obj
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.logData = res.data.data.records
          this.logPage.total = res.data.data.total
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = ["quantity"]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "全部合计"
          return
        }
        if (amountKey.includes(column.property)) {
          sums[index] = this.totalQuantity
        }
      })
      return sums
    },
    operateTypeChange(val) {
      this.logToSearch()
    },
    bizIdChange(val) {
      this.logToSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
#restoreIndonesianFactoryCost {
  .show-status {
    display: flex;
    align-items: center;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%; /* 圆形 */
    display: inline-block; /* 保持圆点的大小，不受其他元素影响 */
    margin-right: 2px;
    &-green {
      background-color: green; /*  */
    }
    &-red {
      background-color: rgb(215, 60, 60); /*  */
    }
    &-yellow {
      background-color: orange; /*  */
    }
    &-gray {
      background-color: #888; /*  */
    }
  }
}
</style>
