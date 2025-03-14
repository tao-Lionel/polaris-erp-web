<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="handleFilter"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="changeSelect"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleRuleDialog({}, 1)"
            size="small"
            v-if="permissions.product_prdCalculateRule_add"
            >新增</el-button
          >
          <!-- <el-button type="primary" @click="showAuditDialog" size="small"
              v-if="permissions.product_prdCalculateRule_audit">批量审核</el-button> -->
          <el-button
            type="primary"
            @click="statusBatchEnbale"
            size="small"
            v-if="permissions.product_prdCalculateRule_enable"
            >批量启用</el-button
          >
          <el-button
            type="primary"
            @click="statusBatchDisabale"
            size="small"
            v-if="permissions.product_prdCalculateRule_prohibit"
            >批量禁用</el-button
          >
          <!-- <el-button type="primary" @click="exportDataRule" size="small"
              v-if="permissions.product_prdCalculateRule_export">导出数据</el-button>
            <el-button type="primary" @click="exportDataRuleById" size="small"
              v-if="permissions.product_prdCalculateRule_export">导出选中数据</el-button> -->
        </template>

        <template slot-scope="{ row }" slot="btnGroup">
          <a class="mr-10" @click="handleRuleDialog(row, 3)">查看详情</a>
          <a class="mr-10" v-if="row.status == 0" @click="handleRuleDialog(row, 2)">复制规则 </a>
          <a class="mr-10" v-if="permissions.product_prdCalculateRule_remove" @click="deleteRule(row.id)"> 删除 </a>
          <a
            class="mr-10"
            @click="statusEnbale(row)"
            v-if="permissions.product_prdCalculateRule_enable && row.checkStatus === 1"
          >
            启用
          </a>
          <a
            class="mr-10"
            @click="statusDisabale(row)"
            v-if="
              permissions.product_prdCalculateRule_prohibit &&
              row.checkStatus != 3 &&
              row.checkStatus != 4 &&
              row.status == 0
            "
            >禁用
          </a>
        </template>
        <template slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="code">
              <el-input v-model="searchForm.code" size="small" placeholder="规则ID" clearable></el-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="规则状态" clearable>
                <el-option
                  v-for="item in statusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="districtId">
              <el-select
                v-model="searchForm.districtId"
                collapse-tags
                clearable
                size="small"
                filterable
                placeholder="区域"
              >
                <el-option v-for="item in bsedistrictOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="platformId">
              <el-select
                v-model="searchForm.platformId"
                size="small"
                placeholder="平台"
                @change="changePlatform"
                clearable
              >
                <el-option
                  v-for="item in platformOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="salesSite">
              <el-select v-model="searchForm.salesSite" size="small" placeholder="站点" clearable>
                <el-option
                  v-for="item in salesSiteOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchForm">
            <el-form-item prop="name">
              <el-input v-model="searchForm.name" size="small" placeholder="规则名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="supplierNo">
              <el-select
                v-model="searchForm.supplierNo"
                size="small"
                popper-class="y-form-select"
                placeholder="供应商"
                filterable
                clearable
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="needChangeTime">
              <el-select v-model="timeLabel" size="small" placeholder="请选择">
                <el-option v-for="item in serarchTime" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="timeValue"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>

        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status ? "禁用" : "启用" }}</span>
        </template>
        <template slot="tariffRate" slot-scope="scope">
          <span>{{ (scope.row.tariffRate * 100).toFixed(2) }}%</span>
        </template>
        <!-- 净利率 -->
        <template slot="grossProfitRate" slot-scope="scope">
          <span>{{ (scope.row.grossProfitRate * 100).toFixed(2) }}%</span>
        </template>
        <template slot="promotionExpensesRateList" slot-scope="scope">
          <p v-if="scope.row.promotionExpensesRateList[0]">
            A:{{ (scope.row.promotionExpensesRateList[0].promotionExpensesRate * 100).toFixed(2) }}%
          </p>
          <p v-if="scope.row.promotionExpensesRateList[2]">
            S:{{ (scope.row.promotionExpensesRateList[2].promotionExpensesRate * 100).toFixed(2) }}%
          </p>
          <p v-if="scope.row.promotionExpensesRateList[1]">
            N:{{ (scope.row.promotionExpensesRateList[1].promotionExpensesRate * 100).toFixed(2) }}%
          </p>
        </template>
        <template slot="refundFeeRate" slot-scope="scope">
          <span>{{ (scope.row.refundFeeRate * 100).toFixed(2) }}%</span>
        </template>
        <template slot="managementFeeRate" slot-scope="scope">
          <span>{{ (scope.row.managementFeeRate * 100).toFixed(2) }}%</span>
        </template>
        <template slot="brand" slot-scope="scope">
          <span>{{ brandNameObj[scope.row.brand] }}</span>
        </template>
        <!-- <template slot="checkStatus" slot-scope="scope">
            <p>{{ checkStatusObj[scope.row.checkStatus] }}</p>
          </template> -->
        <template slot="platformId" slot-scope="scope">
          <span>{{ platformObj[scope.row.platformId] }}</span>
        </template>
        <!-- <template slot="districtId" slot-scope="scope">
            <p>{{ districtObj[scope.row.districtId] }}</p>
          </template> -->
        <template slot="supplierNo" slot-scope="scope">
          <span>{{ supplierObj[scope.row.supplierNo] }}</span>
        </template>
        <!-- 创建人/创建时间 -->
        <template slot="createrName" slot-scope="{ row }">
          <div>{{ row.createrName }}</div>
          <div>{{ row.createTime }}</div>
        </template>
        <!-- 更新人/更新时间 -->
        <template slot="updaterName" slot-scope="{ row }">
          <div>{{ row.updaterName }}</div>
          <div>{{ row.updateTime }}</div>
        </template>
        <!-- 操作日志 -->
        <template slot="operationLog" slot-scope="{ row }">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(row)"></i>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 批量审核 -->
    <el-dialog title="批量审核" :visible.sync="auditRadioVisible" width="30%" :before-close="handleClose">
      <el-radio-group v-model="confirmType" @input="change">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">审核不通过</el-radio>
        <el-radio :label="3">审核通过并启用</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditRadioVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditComfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 流程编辑 -->
    <CommonEditDialog
      :title="title"
      :formFiled="commonFormFiled"
      :formDataList="commonFormData"
      :visible.sync="commonDialogVisible"
      @getSonData="getSonData"
      @changePlat="handleChangePlat"
      @clearSiteOptions="clearSiteOptions"
      @clearData="clearData"
    >
    </CommonEditDialog>

    <!-- 操作日志 -->
    <operationlog ref="operationlog"></operationlog>

    <addDialog ref="addDialogRef" @updateData="updateData"></addDialog>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  delObj,
  updateObj,
  auditSubmit,
  exportData,
  statusModifyEnbale,
  statusModifyDisabale,
  exportDataById
} from "@/api/ruleConfig/prdCalcRule/prdCalcRule"
import { getObjByType } from "@/api/admin/dict"
import { getDistrict } from "@/api/baseSetup/bsestore"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getPlaTypeAll } from "../../../api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { downloadBlob } from "@/util/auth"

import { tableOption } from "@/const/crud/ruleConfig/prdCalcRule/prdCalcRule"

import operationlog from "@/views/ruleConfig/prdCalcRule/prdCalcRuleOperateLog/index"
import CommonEditDialog from "./commonEditDialog/commonEditDialog.vue"
import { mapGetters } from "vuex"
import addDialog from "./components/addDialog.vue"

export default {
  name: "ruleConfig",
  components: {
    operationlog,
    CommonEditDialog,
    addDialog
  },
  data() {
    return {
      props: { multiple: true },
      categoryValue: [],
      savename: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        id: "",
        status: "",
        districtId: "",
        supplierNo: "",
        checkStatus: "",
        platformId: "",
        salesSite: "",
        name: "",
        createrName: "",
        createTime: [],
        updaterName: "",
        updateTime: [],
        categoryId: []
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      platformOption: [],
      salesSiteOption: [],
      statusOption: [
        { value: 0, label: "启用" },
        { value: 1, label: "禁用" }
      ],
      confirmType: 1,
      auditRadioVisible: false,
      prdCalculateRuleIds: [],
      stateModify: 0,
      title: "dialog",
      commonDialogVisible: false,
      commonFormFiled: {},
      commonFormData: [],
      salesModelOption: [],
      checkStatusOption: [],
      currencyOption: [],
      prdCalcRuleformData: {
        brand: null,
        platformId: null
      },
      brandOption: [],
      treeCategoryData: [],
      bsedistrictOptions: [],
      supplierOptions: [],
      categoryId: [],
      serarchTime: [
        { label: "创建时间", value: "createTime" },
        { label: "更新时间", value: "updateTime" }
      ],
      timeLabel: "createTime",
      timeValue: ""
    }
  },
  created() {
    //获取供应商
    getAllSupplier().then((res) => {
      if (res.data.code === 0) {
        res.data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
        console.log("供应商", res.data.data)
      }
    })
    //获取区域
    getDistrict().then((res) => {
      res.data.data.forEach((item) => {
        if (res.data.code === 0) {
          this.bsedistrictOptions.push({
            value: item.districtId,
            label: item.districtName
          })
        }
      })
      console.log(this.bsedistrictOptions)
    })
    //获取审核状态
    getObjByType("calculate_rule_manage_check_status").then((res) => {
      this.checkStatusOption = res.data.data
      this.checkStatusOption.sort(function (a, b) {
        return a.sort - b.sort
      })
      console.log("checkStatusOption", this.checkStatusOption)
    })
    //获取规则状态列表
    getObjByType("enable_status").then((res) => {
      this.statusOption = res.data.data
    })
    //获取品类下拉列表
    fetchTreeList().then((response) => {
      this.treeCategoryData = response.data.data
      console.log("treeCategoryData", this.treeCategoryData)
    })
    this.getPlatform()
    //获取模式下拉列表
    getObjByType("sale_model").then((res) => {
      this.salesModelOption = res.data.data
    })
    //获取币别下拉列表
    getAll().then((response) => {
      response.data.data.forEach((item) => {
        if (response.data.code === 0) {
          this.currencyOption.push({
            value: item.currency,
            label: item.currency
          })
        }
      })
      console.log(this.currencyOption)
    })
    //获取品牌下拉列表
    fetchBrandAll().then((res) => {
      res.data.data.records.forEach((item) => {
        if (res.data.code === 0) {
          this.brandOption.push({
            value: item.brandId,
            label: item.brandName
          })
        }
      })
      console.log(this.brandOption)
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    supplierObj() {
      const result = {}
      this.supplierOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    districtObj() {
      const result = {}
      this.bsedistrictOptions.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    brandNameObj() {
      const result = {}
      this.brandOption.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    checkStatusObj() {
      const result = {}
      this.checkStatusOption.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    },
    platformObj() {
      const result = {}
      this.platformOption.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  methods: {
    handleChange() {
      this.searchForm.categoryId = []
      console.log(this.searchForm.categoryId)
      console.log(this.categoryId)
      this.categoryId.forEach((item) => {
        this.searchForm.categoryId.push(item[item.length - 1])
      })
      console.log("处理后的数组", this.searchForm.categoryId)
    },

    exportDataRuleById() {
      if (!this.prdCalculateRuleIds.length) {
        return this.$message.error("请先选择要导出的数据！")
      }
      this.$confirm(`您勾选了${this.prdCalculateRuleIds.length}条数据,确定导出所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await exportDataById(this.prdCalculateRuleIds)
        if (res.status === 200) {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
          this.$message.success("操作成功")
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // let res = await exportDataById(this.searchFormConfirm).then(res => {
      //   downloadBlob(res.data, '导出数据.xls', 'application/vnd.ms-excel;charset=utf-8')
      // }).catch(err => {
      //   console.log(err)
      // })
    },

    async deleteRule(val) {
      this.$confirm(`确定要删除所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delObj([val])
          console.log("delete", res.data)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.info("已取消操作")
        })
      this.clearSelectClear()
    },
    clearData(val) {
      this.prdCalcRuleformData = val
    },
    clearSiteOptions(val) {
      this.salesSiteOption = val
    },
    //二选一必填
    // validateFields (rule, value, callback) {
    //   if (!this.newFormFiled.salesSite && !this.newFormFiled.districtId) {
    //     callback(new Error('区域和站点必须至少填写一个'))
    //   }
    //   callback()
    // },
    //非空验证
    validateIsZero(rule, value, callback) {
      if (value === 0 || value === "0" || /^\d+(\.\d+)?$/.test(value)) {
        callback()
      } else {
        callback(new Error("必须填写关税率"))
      }
    },
    //负数输入验证
    validateNumber(rule, value, callback) {
      if (value < 0) {
        callback(new Error("只能输入大于或等于0的数字！"))
      } else {
        callback()
      }
    },
    //查看详情
    showDetail(id) {
      console.log(id)
      this.$router.push({
        path: `/product/prdsalegrossprofits/rule/${id ? id : ""}`
      })
    },
    //导出规则
    async exportDataRule() {
      console.log(this.searchFormConfirm)
      let res = await exportData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //回显品类
    echoSelectedOptionById(id) {
      const option = this.findOptionById(this.treeCategoryData, id)
      if (option) {
        this.categoryValue = option.valuePath
      }
    },
    //查找品类父级id
    findOptionById(options, id) {
      for (const option of options) {
        if (option.value === id) {
          return option
        } else if (option.children) {
          const childOption = this.findOptionById(option.children, id)
          if (childOption) {
            childOption.valuePath = [option.value, childOption.value]
            return childOption
          }
        }
      }
      return null
    },

    handleChangeCategory(value) {
      this.categoryValue = value
      console.log("categoryValue", this.categoryValue)
      console.log("value", value)
      this.prdCalcRuleformData.category = value[value.length - 1]
    },
    handleChangePlat(obj) {
      console.log("obj", obj)
      if (obj.name === "platformId") {
        this.getSite(obj.val)
      }
      if (obj.name === "category") {
        this.$set(this.prdCalcRuleformData, obj.name, String(obj.val[obj.val.length - 1]))
        console.log("改变的值", this.prdCalcRuleformData[obj.name])
      } else {
        this.$set(this.prdCalcRuleformData, obj.name, obj.val)
        console.log("改变的值", this.prdCalcRuleformData[obj.name])
      }
    },
    statusEnbale(row) {
      this.$confirm(`确定要启用所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await statusModifyEnbale([row.id])
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.info("已取消操作")
        })
    },
    statusDisabale(row) {
      this.$confirm(`确定要启用所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await statusModifyDisabale([row.id])
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.info("已取消操作")
        })
    },
    statusBatchEnbale() {
      if (!this.prdCalculateRuleIds.length) {
        return this.$message.error("请先选择操作项！！！")
      }
      this.$confirm(`您勾选了${this.prdCalculateRuleIds.length}条数据,确定批量启用所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await statusModifyEnbale(this.prdCalculateRuleIds)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.info("已取消操作")
        })
    },
    statusBatchDisabale() {
      if (!this.prdCalculateRuleIds.length) {
        return this.$message.error("请先选择操作项！！！")
      }
      this.$confirm(`您勾选了${this.prdCalculateRuleIds.length}条数据,确定批量禁用所选规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await statusModifyDisabale(this.prdCalculateRuleIds)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.info("已取消操作")
        })
    },
    getSonData(data) {
      if (this.title === "新增" || this.title === "复制规则") {
        this.prdCalcRuleformData = { ...data, checkStatus: "3" }
        this.$confirm("确认提交吗？")
          .then(async (_) => {
            let res = await addObj(this.prdCalcRuleformData)
            console.log(res.data)
            if (res.data.data.code === 0) {
              this.commonDialogVisible = false
              this.salesSiteOption = []
              this.$message({
                message: "操作成功",
                type: "success"
              })
              this.refreshChange()
              this.prdCalcRuleformData = {
                name: "",
                districtId: "",
                platformId: "",
                salesSite: "",
                currency: "",
                salesModel: "",
                status: "0"
              }
              done()
            } else {
              this.$message.error(res.data.data.msg)
            }
          })
          .catch((_) => {})
      } else {
        if (this.title === "物流配置") {
          if (data.checkStatus == 1 || data.checkStatus == 2) {
            this.prdCalcRuleformData = { ...data, id: this.prdCalculateRuleIds, checkStatus: "0", status: "1" }
          } else {
            this.prdCalcRuleformData = { ...data, id: this.prdCalculateRuleIds, checkStatus: "4" }
          }
        } else if (this.title === "财务配置") {
          if (data.checkStatus == 1 || data.checkStatus == 2) {
            this.prdCalcRuleformData = { ...data, id: this.prdCalculateRuleIds, checkStatus: "0", status: "1" }
          }
          this.prdCalcRuleformData = { ...data, id: this.prdCalculateRuleIds, checkStatus: "0" }
        } else {
          this.prdCalcRuleformData = { ...data, id: this.prdCalculateRuleIds }
        }
        this.$confirm("确认提交吗？")
          .then(async (_) => {
            let res = await updateObj(this.prdCalcRuleformData)
            console.log(res.data)
            if (res.data.code === 0) {
              this.commonDialogVisible = false
              this.salesSiteOption = []
              this.$message({
                message: "操作成功",
                type: "success"
              })
              this.refreshChange()
              this.prdCalcRuleformData = {
                name: "",
                platformId: "",
                salesSite: "",
                currency: "",
                salesModel: "",
                status: "0"
              }
              done()
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch((_) => {})
      }
    },
    showOperateLog(row) {
      this.$refs.operationlog.showOperateLogDialog(row.id, "prdCalculateRule", true)
    },
    async showCommonDialog(row, state) {
      switch (state) {
        case 1:
          this.title = "新增"
          this.commonFormData = [
            {
              label: "平台",
              type: "select",
              name: "platformId",
              option: this.platformOption,
              rule: [
                {
                  required: true,
                  message: "必须选择平台",
                  triger: "blur",
                  type: "number"
                }
              ]
            },
            {
              label: "区域",
              type: "select",
              name: "districtId",
              option: this.bsedistrictOptions,
              rule: [
                {
                  validator: this.validateFields,
                  triger: "blur",
                  type: "string"
                }
              ]
            },
            {
              label: "销售站点",
              type: "select",
              name: "salesSite",
              option: this.salesSiteOption,
              rule: [
                {
                  validator: this.validateFields,
                  triger: "blur",
                  type: "number"
                }
              ]
            },
            {
              label: "模式",
              type: "select",
              name: "salesModel",
              option: this.salesModelOption,
              rule: [
                {
                  required: true,
                  message: "必须选择模式",
                  triger: "blur"
                }
              ]
            },
            // {
            //   label: '品牌',
            //   type: 'select',
            //   name: 'brand',
            //   option: this.brandOption,
            //   rule: [{
            //     required: true, message: '必须选择品牌', triger: 'blur', type: 'number'
            //   }]
            // },
            // {
            //   label: '品类',
            //   type: 'cascader',
            //   name: 'category',
            //   option: this.treeCategoryData,
            //   rule: [{
            //     required: true, message: '必须选择品类', triger: 'blur', type: 'array'
            //   }]
            // },
            {
              label: "供应商",
              type: "select",
              name: "supplierNo",
              option: this.supplierOptions,
              rule: [
                {
                  required: true,
                  message: "必须填写供应商",
                  triger: "blur"
                }
              ]
            },
            {
              label: "币种",
              type: "select",
              name: "currency",
              option: this.currencyOption,
              rule: [
                {
                  required: true,
                  message: "必须填写币种",
                  triger: "blur"
                }
              ]
            },
            {
              label: "关税率",
              type: "input",
              name: "tariffRate",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写关税率",
                  type: "number",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "管理费用费比",
              type: "input",
              name: "managementFeeRate",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写管理费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "品牌A-推广费用费比",
              type: "input",
              name: "54",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "品牌S-推广费用费比",
              type: "input",
              name: "57",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "品牌N-推广费用费比",
              type: "input",
              name: "56",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "供货价折扣率",
              type: "input",
              name: "56",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写供货价折扣率",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "退款费费比",
              type: "input",
              name: "56",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写退款费费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "净利率",
              type: "input",
              name: "56",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写净利率",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "规则名称",
              type: "input",
              name: "name",
              rule: [{ required: true, message: "规则名称不能为空" }]
            }
          ]
          this.commonFormFiled = {
            name: "",
            salesModel: "",
            platformId: "",
            brand: "",
            supplierNo: "",
            districtId: null,
            category: [],
            salesSite: "",
            currency: ""
          }
          break
        case 2:
          this.prdCalculateRuleIds = row.id
          await this.getSite(row.platformId)
          this.title = "财务配置"
          this.commonFormData = [
            {
              label: "规则ID",
              type: "tag",
              name: "code"
            },
            {
              label: "规则名称",
              type: "tag",
              name: "name"
            },
            {
              label: "平台",
              type: "select",
              name: "platformId",
              option: this.platformOption
            },
            {
              label: "销售站点",
              type: "select",
              name: "salesSite",
              option: this.salesSiteOption
            },
            {
              label: "模式",
              type: "select",
              name: "salesModel",
              option: this.salesModelOption
            },
            {
              label: "币种",
              type: "select",
              name: "currency",
              option: this.currencyOption
            },
            {
              label: "管理费用费比",
              type: "input",
              name: "managementFeeRate",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写管理费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            }
          ]
          this.commonFormFiled = {
            ...row,
            managementFeeRate: row.managementFeeRate * 100,
            salesSite: Number(row.salesSite)
          }

          break
        case 3:
          this.prdCalculateRuleIds = row.id
          await this.getSite(row.platformId)
          this.title = "产品编辑"
          this.commonFormData = [
            {
              label: "规则ID",
              type: "tag",
              name: "code"
            },
            // {
            //   label: '品牌',
            //   type: 'select',
            //   name: 'brand',
            //   option: this.brandOption,
            // },
            {
              label: "品牌A-推广费用费比",
              type: "input",
              name: "54",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "品牌S-推广费用费比",
              type: "input",
              name: "57",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "品牌N-推广费用费比",
              type: "input",
              name: "56",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写推广费用费比",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            },
            {
              label: "规则名称",
              type: "input",
              name: "name",
              rule: [
                {
                  required: true,
                  message: "必须输入规则名称",
                  triger: "blur"
                }
              ]
            }
          ]
          this.commonFormFiled = {
            ...row,
            [row.promotionExpensesRateList[0] ? row.promotionExpensesRateList[0].brandId : ""]: row
              .promotionExpensesRateList[0]
              ? row.promotionExpensesRateList[0].promotionExpensesRate * 100
              : "",
            [row.promotionExpensesRateList[1] ? row.promotionExpensesRateList[1].brandId : ""]: row
              .promotionExpensesRateList[1]
              ? row.promotionExpensesRateList[1].promotionExpensesRate * 100
              : "",
            [row.promotionExpensesRateList[2] ? row.promotionExpensesRateList[2].brandId : ""]: row
              .promotionExpensesRateList[2]
              ? row.promotionExpensesRateList[2].promotionExpensesRate * 100
              : ""
          }
          console.log(this.commonFormFiled)
          break
        case 4:
          this.prdCalculateRuleIds = row.id
          await this.getSite(row.platformId)
          this.title = "运营编辑"
          this.commonFormData = [
            {
              label: "规则ID",
              type: "tag",
              name: "code"
            },
            {
              label: "规则名称",
              type: "input",
              name: "name",
              rule: [
                {
                  required: true,
                  message: "必须输入规则名称",
                  triger: "blur"
                }
              ]
            },
            {
              label: "平台",
              type: "select",
              name: "platformId",
              option: this.platformOption
            },
            {
              label: "销售站点",
              type: "select",
              name: "salesSite",
              option: this.salesSiteOption
            },
            {
              label: "模式",
              type: "select",
              name: "salesModel",
              option: this.salesModelOption
            },
            {
              label: "币种",
              type: "select",
              name: "currency",
              option: this.currencyOption
            }
          ]
          this.commonFormFiled = {
            ...row,
            salesSite: Number(row.salesSite)
          }
          break
        case 5:
          await this.getSite(row.platformId)
          this.echoSelectedOptionById(row.category)
          this.title = "复制规则"
          this.commonFormData = [
            {
              label: "平台",
              type: "select",
              name: "platformId",
              option: this.platformOption,
              rule: [
                {
                  required: true,
                  message: "必须选择平台",
                  triger: "blur",
                  type: "number"
                }
              ]
            },
            {
              label: "区域",
              type: "select",
              name: "districtId",
              option: this.bsedistrictOptions
              // rule: [{
              //   validator: this.validateFields, triger: 'blur', type: 'string'
              // }]
            },
            {
              label: "销售站点",
              type: "select",
              name: "salesSite",
              option: this.salesSiteOption
              // rule: [{
              //   validator: this.validateFields, triger: 'blur', type: 'number'
              // }]
            },
            {
              label: "模式",
              type: "select",
              name: "salesModel",
              option: this.salesModelOption,
              rule: [
                {
                  required: true,
                  message: "必须选择模式",
                  triger: "blur"
                }
              ]
            },
            // {
            //   label: '品牌',
            //   type: 'select',
            //   name: 'brand',
            //   option: this.brandOption,
            //   rule: [{
            //     required: true, message: '必须选择品牌', triger: 'blur', type: 'number'
            //   }]
            // },
            // {
            //   label: '品类',
            //   type: 'cascader',
            //   name: 'category',
            //   option: this.treeCategoryData,
            //   rule: [{
            //     required: true, message: '必须选择品类', triger: 'blur', type: 'array'
            //   }]
            // },
            {
              label: "供应商",
              type: "select",
              name: "supplierNo",
              option: this.supplierOptions,
              rule: [
                {
                  required: true,
                  message: "必须填写供应商",
                  triger: "blur"
                }
              ]
            },
            {
              label: "币种",
              type: "select",
              name: "currency",
              option: this.currencyOption,
              rule: [
                {
                  required: true,
                  message: "必须填写币种",
                  triger: "blur"
                }
              ]
            },
            {
              label: "规则名称",
              type: "input",
              name: "name",
              rule: [{ required: true, message: "规则名称不能为空" }]
            }
          ]
          this.commonFormFiled = {
            ...row,
            salesSite: Number(row.salesSite)
          }
          break
        case 6:
          this.prdCalculateRuleIds = row.id
          await this.getSite(row.platformId)
          this.echoSelectedOptionById(row.category)
          this.title = "物流配置"
          this.commonFormData = [
            {
              label: "规则ID",
              type: "tag",
              name: "code"
            },
            {
              label: "规则名称",
              type: "tag",
              name: "name"
            },
            {
              label: "模式",
              type: "select",
              name: "salesModel",
              option: this.salesModelOption
            },
            {
              label: "平台",
              type: "select",
              name: "platformId",
              option: this.platformOption
            },
            {
              label: "销售站点",
              type: "select",
              name: "salesSite",
              option: this.salesSiteOption
            },
            {
              label: "币种",
              type: "select",
              name: "currency",
              option: this.currencyOption
            },
            // {
            //   label: '品类',
            //   type: 'cascader',
            //   name: 'category',
            //   option: this.treeCategoryData,
            // },
            {
              label: "关税率",
              type: "input",
              name: "tariffRate",
              rule: [
                {
                  required: true,
                  validator: this.validateIsZero,
                  message: "必须填写关税率",
                  type: "number",
                  triger: "blur"
                },
                {
                  validator: this.validateNumber,
                  message: "只能输入大于或等于0的数字！",
                  triger: "blur"
                }
              ]
            }
          ]
          this.commonFormFiled = {
            ...row,
            category: this.categoryValue,
            tariffRate: row.tariffRate * 100,
            salesSite: Number(row.salesSite)
          }
          console.log("平台", this.platformOption, typeof row.platformId)

          console.log("销售站点", this.salesSiteOption)

          console.log(this.commonFormFiled)
          break
        default:
          break
      }
      this.commonDialogVisible = true
    },
    async statusComfirm() {
      let res = await statusModify({ prdCalculateRuleIds: this.prdCalculateRuleIds, stateModify: this.stateModify })
      console.log("status", res.data)
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.refreshChange()
      } else {
        this.$message.error(res.data.msg)
      }
      this.statusVisible = !this.statusVisible
    },
    //审核确定
    auditComfirm() {
      this.$confirm("确定要提交审核吗？")
        .then(async (_) => {
          let res = {}
          // debugger
          // console.log(this.prdCalculateRuleIds)
          //判断如果不是数组，则转换为数组
          if (!(this.prdCalculateRuleIds instanceof Array)) {
            this.prdCalculateRuleIds = [this.prdCalculateRuleIds]
          }
          console.log(this.prdCalculateRuleIds)
          if (this.confirmType === 3) {
            res = await auditSubmit({ prdCalculateRuleIds: this.prdCalculateRuleIds, confirmType: 1, status: 0 })
          } else {
            res = await auditSubmit({ prdCalculateRuleIds: this.prdCalculateRuleIds, confirmType: this.confirmType })
          }
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.refreshChange()
          } else {
            this.$message.error(res.data.msg)
          }
          this.auditRadioVisible = !this.auditRadioVisible
          this.refreshChange()
          // done()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    changeSelect(value) {
      this.prdCalculateRuleIds = value.map((item) => item.id)
      console.log("se", this.prdCalculateRuleIds)
      console.log(111, this.platformObj)
    },
    async getPlatform() {
      let res = await getPlaTypeAll()
      res.data.data.forEach((item) => {
        this.platformOption.push({
          value: item.platformTypeId,
          label: item.platformTypeName
        })
      })
    },

    async getSite(val) {
      this.searchForm.salesSite = ""
      this.salesSiteOption.splice(0, this.salesSiteOption.length)
      let res = await getSitInfoByPlatformId({ platformTypeId: val })
      if (res.data.code === 0) {
        let options = []
        res.data.data.forEach((item) => {
          options.push({
            value: item.bsePlatformSitId,
            label: item.sitEnName
          })
        })
        for (let i = 0; i < options.length; i++) {
          this.$set(this.salesSiteOption, i, options[i])
        }
      }
    },
    changePlatform(val) {
      this.searchForm.salesSite = ""
      this.getSite(val)
    },
    handleAdd() {
      // this.$refs.crud.rowAdd()
      this.editDialogVisible = !this.editDialogVisible
    },
    showAuditDialog() {
      if (this.prdCalculateRuleIds.length === 0) {
        return this.$message.error("请先选择要审核的项目")
      }
      this.auditRadioVisible = !this.auditRadioVisible
    },
    removeDomain(item) {
      var index = this.rowForm.calcValues.indexOf(item)
      if (index !== -1) {
        this.rowForm.calcValues.splice(index, 1)
      }
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    // searchChange () {

    // },
    handleFilter() {
      this.searchFormConfirm = {
        code: this.searchForm.code,
        status: this.searchForm.status,
        checkStatus: this.searchForm.checkStatus,
        districtId: this.searchForm.districtId,
        supplierNo: this.searchForm.supplierNo,
        platformId: this.searchForm.platformId,
        salesSite: this.searchForm.salesSite,
        name: this.searchForm.name,
        createrName: this.searchForm.createrName,
        updaterName: this.searchForm.updaterName
        // SearchCreateTimeBegin: this.searchForm.createTime ? this.searchForm.createTime[0] : "",
        // SearchCreateTimeEnd: this.searchForm.createTime ? this.searchForm.createTime[1] : "",
        // SearchUpdateTimeBegin: this.searchForm.updateTime ? this.searchForm.updateTime[0] : "",
        // SearchUpdateTimeEnd: this.searchForm.updateTime ? this.searchForm.updateTime[1] : ""
        // categoryList: this.searchForm.categoryId,
      }

      if (this.timeLabel && this.timeValue) {
        if (this.timeLabel === "createTime") {
          this.searchFormConfirm.SearchCreateTimeBegin = this.timeValue[0]
          this.searchFormConfirm.SearchCreateTimeEnd = this.timeValue[1]
        } else {
          this.searchFormConfirm.SearchUpdateTimeBegin = this.timeValue[0]
          this.searchFormConfirm.SearchUpdateTimeEnd = this.timeValue[1]
        }
      } else {
        this.searchFormConfirm.SearchCreateTimeBegin = ""
        this.searchFormConfirm.SearchCreateTimeEnd = ""
        this.searchFormConfirm.SearchUpdateTimeBegin = ""
        this.searchFormConfirm.SearchUpdateTimeEnd = ""
      }

      this.getList(this.page, this.searchFormConfirm)
      this.clearSelectClear()
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    searchReset() {
      this.searchForm = {}
      this.categoryId = {}
      this.timeValue = ""
    },
    getList(page, param) {
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          param
        )
      ).then((response) => {
        console.log("res", response.data.data.records)
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 多选勾选
     */
    selectionChange(list) {
      this.rowList = list
    },
    setSignToFalse() {
      this.addCalc = false //新增属性
      this.eidtCalc = false //编辑属性
      this.addValue = false //属性值新增
      this.eidtValue = false //编辑属性值
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleRuleDialog(row = {}, type) {
      this.$refs.addDialogRef.openDialog(type, row, {
        platformOption: this.platformOption,
        bsedistrictOptions: this.bsedistrictOptions,
        salesModelOption: this.salesModelOption,
        salesSiteOption: this.salesSiteOption,
        supplierOptions: this.supplierOptions,
        currencyOption: this.currencyOption
      })
    },
    updateData() {
      this.getList(this.page, this.searchFormConfirm)
    }
  },
  watch: {
    commonDialogVisible(newVal, oldVal) {
      console.log(newVal)
    },
    salesSiteOption(newVal) {
      console.log("站点选项有变化", newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-form {
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-between;

//   .el-form-item {
//     flex: 1 40%;
//   }
// }
</style>
