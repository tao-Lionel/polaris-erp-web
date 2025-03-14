<template>
  <div class="execution" id="inquiryorder">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="routeAdd" size="small" v-if="permissions.generator_poinquiryorder_add"
            >新 建</el-button
          >
          <el-button type="primary" @click="deleteData" size="small" v-if="permissions.generator_poinquiryorder_del"
            >删 除</el-button
          >
          <el-button
            type="primary"
            @click="inOrderConfirm(0, 1)"
            size="small"
            v-if="permissions.generator_poinquiryorder_submit"
            >提 交</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="inOrderConfirm(1, 0, null, -1)"
            v-if="permissions.generator_poinquiryorder_revoke"
            >撤销提交</el-button
          >

          <!-- <el-dropdown-button
            type="primary"
            size="small"
            buttonText="采购审核"
            command="采购审核"
            v-if="permissions.generator_poinquiryorder_purchase"
            @command="handleCommand"
          >
            <el-dropdown-item command="采购反审核">采购反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button
            v-if="permissions.generator_poinquiryorder_financial_audit || false"
            type="primary"
            size="small"
            @click="showAuditDialog(2)"
            >财务审核</el-button
          > -->
        </template>

        <template slot="search">
          <el-form
            @submit.prevent.native="searchChange"
            :model="searchForm"
            :inline="true"
            ref="searchForm"
            style="float: left"
          >
            <!-- <el-form-item label="单据时间" prop="startTime">
              <el-date-picker
                v-model="searchForm.startTime"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="searchForm.endTime"
                value-format="yyyy-MM-dd"
                type="date"
                size="small"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item> -->

            <el-form-item prop="billTimes">
              <el-date-picker
                size="small"
                v-model="searchForm.billTimes"
                type="daterange"
                range-separator="至"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="inquiryOrderNo">
              <el-input
                v-model="searchForm.inquiryOrderNo"
                size="small"
                placeholder="单据编号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="priceModel">
              <el-select v-model="searchForm.priceModel" clearable size="small" placeholder="价格模式">
                <el-option
                  v-for="item in priceModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="stateArray">
              <el-select
                v-model="searchForm.stateArray"
                placeholder="询价状态"
                size="small"
                collapse-tags
                multiple
                clearable
              >
                <el-option
                  v-for="item in stateArrayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                placeholder="工厂SKU,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <!-- 查看日志 -->
        <template slot="approveStatus" slot-scope="scope">
          <!-- <el-button type="text" size="mini" class="button-css" @click="showChangeLog(scope.row.inquiryOrderNo)">{{
            stateArrayOptions.find((item) => item.value == scope.row.approveStatus)?.label
          }}</el-button> -->
          {{ stateArrayOptions.find((item) => item.value == scope.row.approveStatus)?.label }}
        </template>

        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            class="button-css"
            @click="handleEdit(scope.row.inquiryOrderNo)"
            :disabled="![0, 3].includes(scope.row.approveStatus)"
            >编辑</el-button
          >
          <!-- formatter  -->
        </template>

        <!-- 点击单据编号查看详情 -->
        <template slot="inquiryOrderNo" slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            class="button-css"
            @click="routeDetail(scope.row.inquiryOrderNo)"
          >{{scope.row.inquiryOrderNo}}</el-button>  -->
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              :to="'/inquiryorder/detail/' + scope.row.inquiryOrderNo"
              :title="scope.row.inquiryOrderNo"
              >{{ scope.row.inquiryOrderNo }}</router-link
            >
          </copy-text>
        </template>

        <template slot="inquiryEvidence" slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            @click="download(scope.row.inquiryEvidence)">下载</el-button> -->
          <!-- <el-button
            type="text"
            size="mini"
            @click="preViewMethods(scope.row.inquiryEvidence)">预览</el-button> -->
          <!-- <i
            v-if="scope.row.inquiryEvidence != '' && scope.row.inquiryEvidence != null"
            class="icon-xiazai y-icon-edit"
            @click="download(scope.row.inquiryEvidence)"
          ></i>
          <i
            v-if="scope.row.inquiryEvidence != '' && scope.row.inquiryEvidence != null"
            class="icon-chakan y-reviews"
            @click="preViewMethods(scope.row.inquiryEvidence)"
          ></i> -->

          <a v-if="scope.row.inquiryEvidence != ''" @click="handleView(scope.row)">查看</a>
          <span v-else>暂无凭证</span>
        </template>
      </avue-crud>

      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="520px">
        <!-- :before-close="handleClose"> -->
        <!-- <el-radio v-model="auditType" label="1">同意</el-radio>
        <el-radio v-model="auditType" label="2">拒绝</el-radio> -->
        <el-input
          type="textarea"
          :rows="5"
          :maxlength="100"
          placeholder="请填写拒绝原因，不得超过100个字符。拒绝，必填"
          v-model="auditTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleAudit">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 查看图片 -->
      <imgdialog ref="imgdialog"></imgdialog>
      <!-- 查看日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>

      <viewFilesDialog ref="viewFilesDialogRef"></viewFilesDialog>
    </basic-container>
  </div>
  <!-- 1 -->
</template>

<script>
import {
  fetchList,
  submitAudit,
  delObj,
  previewImgAndPdf,
  downloadImgAndPdf
} from "@/api/purchase/inquiryorder/poinquiryorder"
import { tableOption } from "@/const/crud/purchase/inquiryorder/poinquiryorder"
import imgdialog from "./imgDialog"
import { getTokenUrl } from "@/util/auth"
import preview from "@/components/yvue/pdf/index"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import pooperatelog from "@/views/supplier/log/index"
import { mapGetters } from "vuex"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getDictByType } from "@/util/auth"
import { query } from "@/api/finance/purchaseinvoice/purchaseinvoice"
import viewFilesDialog from "./viewFilesDialog.vue"

export default {
  name: "poinquiryorder",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        billTimes: [],
        startTime: "",
        endTime: "",
        inquiryOrderNo: "",
        supplierName: "",
        state: "",
        stateArray: [],
        currency: "",
        priceModel: "",
        skuCode: ""
      },
      auditTitle: "财务审核",
      auditDialog: false,
      auditType: "1",
      selectList: [],
      auditTextarea: "",
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      imageData: "",
      pdfData: "",
      supplierOptions: [],
      stateArrayOptions: [
        { value: 0, label: "待提审" },
        { value: 1, label: "审核中" },
        { value: 2, label: "审核通过" },
        { value: 3, label: "审核不通过" }
      ],
      priceModelOptions: [],
      validType: null,
      approveEvent: 0
    }
  },
  components: {
    imgdialog,
    pooperatelog,
    viewFilesDialog
  },
  created() {
    this.getSupplierAll()
    this.getPriceModelAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
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

    // 获取价格模式
    async getPriceModelAll() {
      this.priceModelOptions = await getDictByType("price_model")
    },

    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
        this.approveEvent = 0
      } else {
        this.auditType = 2
        this.approveEvent = -1
      }
      this.handleAudit()
    },
    //跳转询价单新增页面
    routeAdd() {
      this.$router.push({
        path: "/inquiryorder/create/-1"
      })
    },
    //跳转询价单编辑页面
    routeDetail(number) {
      this.$router.push({
        path: "/inquiryorder/detail/" + number
      })
    },
    handleEdit(number) {
      this.$router.push({
        path: "/inquiryorder/detail/" + number,
        query: {
          type: "edit"
        }
      })
    },
    /** 刷新回调 */
    refreshChange(params) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    /**  搜索回调 */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中

      this.searchForm.state = this.searchForm.stateArray.join(",")
      if (this.searchForm.billTimes.length > 0) {
        this.searchForm.startTime = this.searchForm.billTimes[0]
        this.searchForm.endTime = this.searchForm.billTimes[1]
      } else {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
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
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
      // console.log(this.searchFormConfirm)
      fetchList(
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
        this.imageData = ""
        this.pdfData = ""
      })
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    selectionChange(list) {
      this.selectList = list
    },
    // 1 采购 2 财务
    showAuditDialog(type) {
      this.validType = type
      let inquiryOrderNos = this.validSelectList(type)
      if (inquiryOrderNos == "") {
        return
      }
      this.auditTitle = this.stateArrayOptions.find((item) => type == item.value).label
      this.auditDialog = true
    },
    //判断有效数据 selectList
    validSelectList(nowStatus) {
      console.log("nowStatus", nowStatus)
      let inquiryOrderNos = ""
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return inquiryOrderNos
      }
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].approveStatus
        if (nowStatus == status || status === 3) {
          inquiryOrderNos += this.selectList[i].inquiryOrderNo + ","
        }
      }
      console.log("inquiryOrderNos===", inquiryOrderNos)
      if (inquiryOrderNos == "") {
        this.$message.error("请勾选正确数据")
        return inquiryOrderNos
      }
      inquiryOrderNos = inquiryOrderNos.substring(0, inquiryOrderNos.length - 1)
      return inquiryOrderNos
    },
    handleAudit() {
      if (this.auditType == 2 && this.auditTextarea == "") {
        this.$message.error("请填写原因")
        return
      }
      let toStatus = this.stateArrayOptions.find((item) => this.validType == item.value).value + 1
      if (this.auditType == 2) {
        toStatus = 0
      }
      this.inOrderConfirm(this.validType, toStatus, this.auditTextarea, this.approveEvent)
    },
    inOrderConfirm(nowStatus, toStatus, message, approveEvent = 0) {
      let _this = this
      let inquiryOrderNos = ""
      inquiryOrderNos = this.validSelectList(nowStatus)
      if (inquiryOrderNos == "") {
        return
      }
      submitAudit(
        Object.assign({
          approveEvent,
          approveStatus: toStatus,
          inquiryOrderNos: inquiryOrderNos,
          message: message
        })
      ).then((response) => {
        if (response.data.code == 0) {
          if (!response.data.data) {
            _this.$message.warning(response.data.msg)
          } else {
            _this.$message.success("操作成功")
          }
          _this.auditTextarea = ""
          _this.auditDialog = false
          _this.$refs.crud.toggleSelection()
          _this.refreshChange()
        } else if (response.data.code == 1) {
          _this.$message.error(response.data.msg)
        } else {
          _this.$message.error("操作失败")
        }
      })
    },
    /**
     * 删除数据
     */
    deleteData() {
      let inquiryOrderNos = ""
      var checkFlag = false
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return inquiryOrderNos
      }
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].approveStatus
        if (0 == status) {
          if (i == 0) {
            inquiryOrderNos += this.selectList[i].inquiryOrderNo
          } else {
            inquiryOrderNos += "," + this.selectList[i].inquiryOrderNo
          }
        } else {
          checkFlag = true
        }
      }

      if (checkFlag) {
        this.$message.warning("勾选的数据，有状态不是待处理的")
        return
      }

      this.$confirm("是否确认删除单号" + inquiryOrderNos, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(inquiryOrderNos).then((resp) => {
          console.log(resp)
          if (resp.data.code == 0) {
            this.$message.success("删除成功")
            this.$refs.crud.toggleSelection()
            this.refreshChange()
          } else {
            this.$message.warning(resp.data.msg)
          }
        })
      })
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    // handleEdit(row, index) {
    //   this.$refs.crud.rowEdit(row, index)
    // },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.inquiryOrderNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.inquiryOrderNo)
        })
        .then((data) => {
          _this.tableData.splice(index, 1)
          _this.$message.success("删除成功")
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

    download(id) {
      if (!id) {
        this.$message.warning("未上传文件")
        return
      }
      downloadImgAndPdf({ fileId: id }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const filename = decodeURIComponent(res.headers["content-disposition"].split("=")[1])
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },
    //预览
    preViewMethods(id) {
      if (!id) {
        this.$message.warning("未上传文件")
        return
      }
      // if (this.imageData) {
      //   this.$refs.imgdialog.showImgUrl(this.imageData)
      //   return;
      // }
      // if (this.pdfData) {
      //   window.open(this.pdfData);
      //   return;
      // }
      previewImgAndPdf({ fileId: id }).then((res) => {
        if (res.data.type === "application/pdf") {
          const blob = new Blob([res.data], { type: "application/pdf" })
          this.pdfData = URL.createObjectURL(blob)
          window.open(this.pdfData)
        } else {
          const href = window.URL.createObjectURL(res.data)
          this.imageData = href
          this.$refs.imgdialog.showImgUrl(href)
        }
      })
    },
    //查看日志
    showChangeLog(inquiryOrderNo) {
      this.$refs.pooperatelog.showOperateLogDialog(inquiryOrderNo, 9)
    },
    handleCommand(command) {
      if (command == "采购审核") {
        this.showAuditDialog(1)
      } else if (command == "采购反审核") {
        this.inOrderConfirm(2, 1, "", -1)
      }
    },
    handleView(row) {
      this.$refs.viewFilesDialogRef.openDialog(row)
    }
  }
}
</script>

<style lang="scss">
#inquiryorder {
  .el-dialog__header {
    line-height: 30px;
  }
  .el-textarea__inner {
    height: 90px;
  }
  .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
  }
}
</style>
