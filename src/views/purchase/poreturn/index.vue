<template>
  <div class="poreturn" id="poreturn">
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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.purchase_poreturn_add"
            >新 建</el-button
          >
          <el-button type="primary" @click="handleDel" size="small" v-if="permissions.purchase_poreturn_del"
            >删 除</el-button
          >
          <el-button type="primary" @click="handleSubmit" size="small" v-if="permissions.purchase_poreturn_submit"
            >提交审核</el-button
          >
          <el-button type="primary" @click="handleCancel" size="small" v-if="permissions.purchase_poreturn_cancel"
            >撤销提交</el-button
          >
          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="采购审核"
            command="采购审核"
            @command="handleCommand"
            v-if="permissions.purchase_poreturn_purchaseVerify"
          >
            <el-dropdown-item command="采购反审">采购反审</el-dropdown-item>
          </el-dropdown-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="handleFinanceVerify"
            size="small"
            v-if="permissions.purchase_poreturn_financeVerify"
            >财务审核</el-button
          >
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.returnNo)">{{ formatData(scope.row.status) }}</a>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="searchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="returnNo">
              <el-input
                v-model.trim="searchForm.returnNo"
                size="small"
                placeholder="单据编号"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model.trim="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商名称" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="corporationName">
              <el-select v-model="searchForm.corporationName" size="small" placeholder="法人主体" filterable clearable>
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="currencyArray">
              <el-select
                v-model="searchForm.currencyArray"
                clearable
                collapse-tags
                size="small"
                placeholder="币别"
                multiple
              >
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="statusArray">
              <el-select
                v-model="searchForm.statusArray"
                collapse-tags
                clearable
                size="small"
                placeholder="单据状态"
                multiple
              >
                <el-option label="未处理" value="0"></el-option>
                <el-option label="采购审核" value="1"></el-option>
                <el-option label="财务审核" value="2"></el-option>
                <el-option label="审核完成" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outBoundArray">
              <el-date-picker
                v-model="searchForm.outBoundArray"
                type="daterange"
                size="small"
                start-placeholder="出库开始日期"
                end-placeholder="出库结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <!-- 展开行 -->
        <template slot="expand" slot-scope="scope">
          <el-table
            :data="scope.row?.childDetailList"
            :show-header="true"
            size="mini"
            style="margin-left: 90px; width: calc(100% - 90px)"
          >
            <el-table-column prop="skuCode" label="工厂SKU"></el-table-column>
            <el-table-column prop="skuName" label="产品名称"></el-table-column>
            <el-table-column prop="platform" label="平台"></el-table-column>
            <el-table-column prop="site" label="站点" width="120"></el-table-column>
            <el-table-column prop="poPrice" label="入库价" width="150"></el-table-column>
            <el-table-column prop="returnCount" label="退货数量" width="150"></el-table-column>
            <el-table-column prop="refundMoney" label="退货货值" width="150"></el-table-column>
          </el-table>
        </template>

        <template slot-scope="scope" slot="returnNo">
          <copy-text hoverToShow>
            <router-link :to="'/poreturn/detail?returnNo=' + scope.row.returnNo" :title="scope.row.returnNo">{{
              scope.row.returnNo
            }}</router-link>
          </copy-text>
        </template>
      </avue-crud>
      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="520px">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="请填写原因，不得超过100个字符。(拒绝必填)"
          v-model.trim="confrimTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchListPost,
  addObj,
  putObj,
  delObj,
  deleteBatch,
  submitBatch,
  cancelSubmitBatch,
  purchaseVerifyBatch,
  financeVerifyBatch
} from "@/api/purchase/poreturn/poreturn"
import { tableOption } from "@/const/crud/purchase/poreturn/poreturn"
import { mapGetters } from "vuex"
import operationlog from "@/views/purchase/log/index"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

export default {
  name: "poreturn",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        outBoundArray: [],
        timeArray: [],
        startTime: "",
        endTime: "",
        returnNo: "",
        statusArray: [],
        status: "",
        currencyArray: [],
        currency: ""
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
      selectList: [],
      confrimTextarea: "",
      confrimTitle: "",
      confrimDialog: false,
      currencyOptions: [],
      supplierOptions: [],
      corporationList: []
    }
  },
  created() {
    getBseCurrency().then(({ data }) => {
      if (data.code == 0) {
        this.currencyOptions = data.data
      }
    })
    this.getSupplierAll()
    this.getCorporation()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
    modifySupplier(val) {
      this.searchForm.supplierName = val.replace(/,/g, " ")
      if (this.searchForm.supplierName.indexOf("BEAUTIFUL") !== -1) {
        this.searchForm.supplierName = this.searchForm.supplierName.replace(".", ".,")
      }
    },
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "采购审核",
        2: "财务审核",
        3: "审核完成"
      }
      return obj[id]
    },
    // 查看日志
    showOperateLog(returnNo) {
      this.$refs.operationlog.showOperateLogDialog(returnNo, 17)
    },
    handleFinanceVerify() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].status
        if (status != 2) {
          this.$message.error("存在状态不是财务审核的数据，请检查")
          return
        }
        returnNoArray.push(this.selectList[i].returnNo)
      }
      this.confrimTextarea = ""
      ;(this.confrimTitle = "财务审核"), (this.confrimDialog = true)
    },
    handleCancel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].status
        if (status != 1) {
          this.$message.error("存在状态不是采购审核的数据，请检查")
          return
        }
        returnNoArray.push(this.selectList[i].returnNo)
      }

      cancelSubmitBatch({ returnNos: returnNoArray.join(",") })
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            var map = data.data
            var successList = map.success
            var errorList = map.error
            var successMsg = ""
            for (var k = 0; k < successList.length; k++) {
              successMsg = successMsg + successList[k] + "; "
            }
            var errorMsg = ""
            for (var k = 0; k < errorList.length; k++) {
              errorMsg = errorMsg + errorList[k] + "; "
            }
            if (!this.isNulls(successMsg) && this.isNulls(errorMsg)) {
              this.$message.success("撤销审核成功")
            } else if (!this.isNulls(errorMsg)) {
              this.$message.error("撤销审核失败的数据" + errorMsg)
            }
            //刷新页面
            this.getList(this.page)
          } else {
            this.$message.error(data.msg)
          }
        })
        .finally(() => {})
    },
    handleSubmit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].status
        if (status != 0) {
          this.$message.error("存在状态不是未处理的数据，请检查")
          return
        }
        returnNoArray.push(this.selectList[i].returnNo)
      }

      submitBatch({ returnNos: returnNoArray.join(",") })
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            var map = data.data
            var successList = map.success
            var errorList = map.error
            var successMsg = ""
            for (var k = 0; k < successList.length; k++) {
              successMsg = successMsg + successList[k] + "; "
            }
            var errorMsg = ""
            for (var k = 0; k < errorList.length; k++) {
              errorMsg = errorMsg + errorList[k] + "; "
            }
            if (!this.isNulls(successMsg) && this.isNulls(errorMsg)) {
              this.$message.success("提交审核成功")
            } else if (!this.isNulls(errorMsg)) {
              this.$message.error("提交审核失败的数据" + errorMsg)
            }
            //刷新页面
            this.getList(this.page)
          } else {
            this.$message.error(data.msg)
          }
        })
        .finally(() => {})
    },
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    },

    handleCommand(command) {
      if (command == "采购审核") {
        if (!this.selectList || this.selectList.length == 0) {
          this.$message.error("请勾选数据")
          return
        }
        var returnNoArray = []
        for (var i = 0; i < this.selectList.length; i++) {
          var status = this.selectList[i].status
          if (status != 1) {
            this.$message.error("存在状态不是采购审核的数据，请检查")
            return
          }
          returnNoArray.push(this.selectList[i].returnNo)
        }
        this.confrimTextarea = ""
        ;(this.confrimTitle = "采购审核"), (this.confrimDialog = true)
      }
      if (command == "采购反审") {
        if (!this.selectList || this.selectList.length == 0) {
          this.$message.error("请勾选数据")
          return
        }
        var returnNoArray = []
        for (var i = 0; i < this.selectList.length; i++) {
          var status = this.selectList[i].status
          if (status != 2) {
            this.$message.error("存在状态不是财务审核的数据，请检查")
            return
          }
          returnNoArray.push(this.selectList[i].returnNo)
        }

        purchaseVerifyBatch({ returnNos: returnNoArray.join(","), type: 2, comment: "采购反审" })
          .then(({ data }) => {
            if (data.code == 0) {
              this.$refs.crud.selectClear()
              this.$message.success("采购反审成功")
              //刷新页面
              this.getList(this.page)
            } else {
              this.$message.error(data.msg)
            }
          })
          .finally(() => {})
      }
    },
    dialogResult(dialogFlag) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        returnNoArray.push(this.selectList[i].returnNo)
      }
      if (dialogFlag) {
        if (this.confrimTitle == "采购审核") {
          purchaseVerifyBatch({ returnNos: returnNoArray.join(","), type: 0, comment: this.confrimTextarea })
            .then(({ data }) => {
              if (data.code == 0) {
                this.$refs.crud.selectClear()
                this.confrimDialog = false
                this.$message.success("采购审核同意成功")
                //刷新页面
                this.getList(this.page)
              } else {
                this.$message.error(data.msg)
              }
            })
            .finally(() => {})
        }
        if (this.confrimTitle == "财务审核") {
          financeVerifyBatch({ returnNos: returnNoArray.join(","), type: 0, comment: this.confrimTextarea })
            .then(({ data }) => {
              if (data.code == 0) {
                this.$refs.crud.selectClear()
                this.confrimDialog = false
                var map = data.data
                var successList = map.success
                var errorList = map.error
                var successMsg = ""
                for (var k = 0; k < successList.length; k++) {
                  successMsg = successMsg + successList[k] + "; "
                }
                var errorMsg = ""
                for (var k = 0; k < errorList.length; k++) {
                  errorMsg = errorMsg + errorList[k] + "; "
                }
                if (!this.isNulls(successMsg) && this.isNulls(errorMsg)) {
                  this.$message.success("财务审核同意成功")
                } else if (!this.isNulls(errorMsg)) {
                  this.$message.error("财务审核同意失败的数据" + errorMsg)
                }
                //刷新页面
                this.getList(this.page)
              } else {
                this.$message.error(data.msg)
              }
            })
            .finally(() => {})
        }
      } else {
        if (!this.confrimTextarea || this.confrimTextarea == "") {
          this.$message.error("请填写拒绝原因")
          return false
        }
        if (this.confrimTitle == "采购审核") {
          purchaseVerifyBatch({ returnNos: returnNoArray.join(","), type: 1, comment: this.confrimTextarea })
            .then(({ data }) => {
              if (data.code == 0) {
                this.$refs.crud.selectClear()
                this.confrimDialog = false
                var map = data.data
                var successList = map.success
                var errorList = map.error
                var successMsg = ""
                for (var k = 0; k < successList.length; k++) {
                  successMsg = successMsg + successList[k] + "; "
                }
                var errorMsg = ""
                for (var k = 0; k < errorList.length; k++) {
                  errorMsg = errorMsg + errorList[k] + "; "
                }
                if (!this.isNulls(successMsg) && this.isNulls(errorMsg)) {
                  this.$message.success("采购审核拒绝成功")
                } else if (!this.isNulls(errorMsg)) {
                  this.$message.error("采购审核拒绝失败的数据" + errorMsg)
                }
                //刷新页面
                this.getList(this.page)
              } else {
                this.$message.error(data.msg)
              }
            })
            .finally(() => {})
        }
        if (this.confrimTitle == "财务审核") {
          financeVerifyBatch({ returnNos: returnNoArray.join(","), type: 1, comment: this.confrimTextarea })
            .then(({ data }) => {
              if (data.code == 0) {
                this.$refs.crud.selectClear()
                this.confrimDialog = false
                var map = data.data
                var successList = map.success
                var errorList = map.error
                var successMsg = ""
                for (var k = 0; k < successList.length; k++) {
                  successMsg = successMsg + successList[k] + "; "
                }
                var errorMsg = ""
                for (var k = 0; k < errorList.length; k++) {
                  errorMsg = errorMsg + errorList[k] + "; "
                }
                if (!this.isNulls(successMsg) && this.isNulls(errorMsg)) {
                  this.$message.success("财务审核拒绝成功")
                } else if (!this.isNulls(errorMsg)) {
                  this.$message.error("财务审核拒绝失败的数据" + errorMsg)
                }
                //刷新页面
                this.getList(this.page)
              } else {
                this.$message.error(data.msg)
              }
            })
            .finally(() => {})
        }
      }
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
      fetchListPost(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
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
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$router.push({
        path: "/poreturn/detail",
        query: {}
      })
    },
    handleDel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].status
        if (status != 0) {
          this.$message.error("存在状态不是未处理的数据，请检查")
          return
        }
        returnNoArray.push(this.selectList[i].returnNo)
      }
      this.$confirm("此操作将永久删除该采购退货单号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBatch({ returnNos: returnNoArray.join(",") })
            .then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$message({
                  message: "删除成功",
                  type: "success"
                })
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$message.error(data.msg)
              } else {
                this.$message.error("删除失败")
              }
            })
            .finally(() => {})
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.returnNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.returnNo)
        })
        .then((data) => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          this.getList(this.page)
        })
        .catch(function (err) {})
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row).then((data) => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      addObj(row).then((data) => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.searchForm.status = this.searchForm.statusArray.join(",")
      this.searchForm.currency = this.searchForm.currencyArray.join(",")
      if (this.searchForm.timeArray && this.searchForm.timeArray.length == 2) {
        this.searchForm.startTime = this.searchForm.timeArray[0]
        this.searchForm.endTime = this.searchForm.timeArray[1]
      } else {
        this.searchForm.startTime = ""
        this.searchForm.endTime = ""
      }
      if (this.searchForm.outBoundArray && this.searchForm.outBoundArray.length == 2) {
        this.searchForm.outStockStartTime = this.searchForm.outBoundArray[0]
        this.searchForm.outStockEndTime = this.searchForm.outBoundArray[1]
      } else {
        this.searchForm.outStockStartTime = ""
        this.searchForm.outStockEndTime = ""
      }
      //将搜索的条件放入到确认的搜索条件中
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
    selectionChange(list) {
      this.selectList = list
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
