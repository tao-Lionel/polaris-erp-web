<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <!-- 采购付款单 -->
  <div class="execution" id="popayment">
    <basic-container>
      <avue-crud
        ref="crud"
        class="handle-cell-hidden"
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
        >>
        <template slot="menuLeft">
          <!-- v-if="permissions.generator_wmsotheroutstockdetail_add" -->
          <el-button type="primary" @click="exportData" v-if="permissions.popayment_export" size="small"
            >导 出</el-button
          >
          <el-button type="primary" @click="clickBatPay" v-if="permissions.popayment_export && false" size="small"
            >批量支付</el-button
          >
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="poPaymentNo">
              <avue-crud-input
                v-model="searchForm.poPaymentNo"
                size="small"
                placeholder="单据编号,支持多个"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                size="small"
                v-model="searchForm.status"
                collapse-tags
                clearable
                filterable
                placeholder="支付状态"
              >
                <el-option label="未支付" value="1"></el-option>
                <el-option label="已支付" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="requestAccountNo">
              <avue-crud-input
                v-model="searchForm.requestAccountNo"
                size="small"
                placeholder="请款单号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <!-- <avue-crud-input
                v-model="searchForm.supplierName"
                size="small"
                placeholder="请输入供应商名称搜索"
              ></avue-crud-input> -->
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationName">
              <avue-crud-input
                v-model="searchForm.corporationName"
                size="small"
                placeholder="法人主体"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="currency">
              <el-select
                size="small"
                v-model="searchForm.currency"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="币别"
              >
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.currency"
                  :label="item.currency"
                  :value="item.currency"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="requestName">
              <el-input
                v-model="searchForm.requestName"
                size="small"
                v-search-input
                clearable
                placeholder="请款人"
              ></el-input>
            </el-form-item>
            <el-form-item prop="createName">
              <el-input
                v-model="searchForm.createName"
                size="small"
                v-search-input
                clearable
                placeholder="付款人"
              ></el-input>
            </el-form-item>
            <el-form-item prop="expecteTime">
              <el-date-picker
                v-model="searchForm.expecteTime"
                type="daterange"
                size="small"
                start-placeholder="期望付款开始日期"
                end-placeholder="期望付款结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <!-- 操作列表中的某一列 -->
        <template slot="poPaymentNo" slot-scope="scope">
          <router-link
            class="el-row-text"
            :to="{ path: '/paymentDetail', query: { poPaymentNo: scope.row.poPaymentNo } }"
            >{{ scope.row.poPaymentNo }}</router-link
          >
        </template>
        <template slot="paymentAttach" slot-scope="scope">
          <i
            v-if="scope.row.paymentAttach"
            class="icon-xiazai y-icon-edit"
            @click="download(scope.row.paymentAttach)"
          ></i>
          <i
            v-if="scope.row.paymentAttach"
            class="icon-chakan y-reviews"
            @click="preViewMethods(scope.row.paymentAttach)"
          ></i>
        </template>
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "未支付" : "已支付" }}</span>
        </template>
      </avue-crud>
    </basic-container>
    <!-- 支付 -->
    <el-dialog class="payment-dialog" v-bind:title="paymentTitle" :visible.sync="paymentDialog" width="520px" center>
      <el-form ref="paymentDialogForm" :model="paymentDialogForm" status-icon :rules="rules">
        <el-form-item label="实付金额" prop="actualAmount">
          <el-input :maxlength="12" clearable v-model="paymentDialogForm.actualAmount" size="small"></el-input>
        </el-form-item>

        <el-form-item prop="actualCurrency" label="币别">
          <el-select
            size="small"
            v-model="paymentDialogForm.actualCurrency"
            collapse-tags
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in currencyOptions"
              :key="item.currency"
              :label="item.currency"
              :value="item.currency"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="水单文件" prop="paymentAttach">
          <!-- <el-input v-model="paymentDialogForm.paymentAttach" size="small"></el-input> -->
          <el-upload
            style="display: inline-block"
            ref="upload"
            accept="image/jpeg, image/jpg, image/png, image/bmp"
            action="String"
            :auto-upload="false"
            :on-change="signFileChange"
            :show-file-list="false"
          >
            <el-button size="small" type="text">上传水单文件</el-button>
            <avue-crud-input hidden v-model="paymentDialogForm.paymentAttach" style="display: none" />
          </el-upload>
          <span v-if="paymentDialogForm.paymentAttach">
            <i class="icon-chakan y-icon-edit" @click="preViewMethods(paymentDialogForm.paymentAttach)"></i>
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sureToPay">确定</el-button>
      </span>
    </el-dialog>
    <!-- 查看图片 -->
    <imgdialog ref="imgdialog"></imgdialog>
  </div>
</template>

<script>
import { fetchList, exportListData } from "@/api/purchase/payment/popayment"
import { tableOption } from "@/const/crud/purchase/payment/popayment"
import { getAll } from "@/api/baseSetup/bsecurrency"
import imgdialog from "../inquiryorder/imgDialog.vue"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"

export default {
  name: "wmsotheroutstockdetail",
  data() {
    var validatePass = (rule, value, callback) => {
      if (isNaN(value / 1) || value < 0) {
        this.paymentDialogForm.actualAmount = ""
        callback(new Error("请输入不为负的数字"))
      } else {
        this.paymentDialogForm.actualAmount = (value * 1).toFixed(2)
        callback()
      }
    }
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        time: [],
        poPaymentNo: "",
        requestAccountNo: "",
        supplierName: "",
        expecteTime: [],
        corporationName: "",
        currency: "",
        status: ""
      },
      currencyOptions: [],
      //确定的搜索条件
      searchFormConfirm: {},
      selectList: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      rules: {
        actualAmount: [
          { required: true, message: "实付金额不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      paymentDialog: false,
      paymentTitle: "支付",
      paymentDialogForm: {
        actualAmount: "",
        actualCurrency: "",
        paymentAttach: ""
      },
      supplierOptions: []
    }
  },
  created() {},
  components: {
    imgdialog
  },
  mounted: function () {
    //this.getList(this.page)
    this.getCurrencyAll()
    this.getSupplierAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //弹框确定
    sureToPay() {
      if (this.paymentDialogForm.actualAmount === "" || this.paymentDialogForm.actualAmount == null) {
        this.$message.error("未填写实付金额")
        return
      }
      if (this.paymentDialogForm.actualCurrency === "" || this.paymentDialogForm.actualCurrency == null) {
        this.$message.error("未选择实付币别")
        return
      }
      // if (this.paymentDialogForm.paymentAttach === "" || this.paymentDialogForm.paymentAttach == null) {
      //   this.$message.error("未选择水单文件")
      //   return
      // }

      let param = {
        poPaymentNo: this.detailInfo.poPaymentNo,
        paymentAccount: this.detailInfo.paymentAccount,
        actualAmount: this.paymentDialogForm.actualAmount,
        actualCurrency: this.paymentDialogForm.actualCurrency,
        paymentAttach: this.paymentDialogForm.paymentAttach,
        remark: this.detailInfo.remark
      }

      payment(param)
        .then((res) => {
          if (res.data.code == 0) {
            // console.dir(res)
            this.$message.success("支付成功")
            this.paymentDialog = false
            // 跳转回父级并关闭当前页面
            this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath)
            this.$router.push("/finance/popayment")
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("支付失败")
          // this.paymentDialog = false;
          return
        })
    },
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }
      if (!/^image\/(jpeg|png|jpg)$/.test(file.raw.type)) {
        this.$message.warning("请选择图片")
        return
      }

      let formdata = new FormData()
      formdata.append("file", file.raw)

      uploadImage(formdata)
        .then((res) => {
          if (res.data.code == 0) {
            // console.dir(res)
            this.paymentDialogForm.paymentAttach = res.data.data
            this.$message.success("上传成功")
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("上传失败")
          return
        })
    },
    clickBatPay() {
      console.log(!this.selectList)
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.paymentDialog = true
    },
    /**
     * 查询国家地区
     */
    getCurrencyAll() {
      getAll().then((response) => {
        this.currencyOptions = response.data.data
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      this.page.currentPage = page.currentPage

      // if(this.searchFormConfirm.status){
      //   this.searchFormConfirm.status = this.searchFormConfirm.status.join(',')
      // }
      var tempCurrency = this.searchFormConfirm.currency
      if (this.searchFormConfirm.currency) {
        this.searchFormConfirm.currency = this.searchFormConfirm.currency.join(",")
      }
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.startDate = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endDate = this.searchFormConfirm.time[1]
      }
      if (this.searchFormConfirm.expecteTime && this.searchFormConfirm.expecteTime.length == 2) {
        this.searchFormConfirm.expecteStartDate = this.searchFormConfirm.expecteTime[0]
        this.searchFormConfirm.expecteEndDate = this.searchFormConfirm.expecteTime[1]
      }

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
      })
      this.searchFormConfirm.currency = tempCurrency
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.otherOutStockDetailId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.otherOutStockDetailId)
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
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
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

    preViewMethods(url) {
      if (!url) {
        this.$message.warning("未上传文件")
        return
      }

      this.$refs.imgdialog.showImgUrl(url)
    },
    download(url) {
      window.location = getTokenUrl(url)
    },

    exportData() {
      // debugger;
      var tempCurrency = this.searchFormConfirm.currency
      if (this.searchFormConfirm.currency) {
        this.searchFormConfirm.currency = this.searchFormConfirm.currency.join(",")
      }
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.startDate = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endDate = this.searchFormConfirm.time[1]
      }
      if (this.searchFormConfirm.expecteTime && this.searchFormConfirm.expecteTime.length == 2) {
        this.searchFormConfirm.expecteStartDate = this.searchFormConfirm.expecteTime[0]
        this.searchFormConfirm.expecteEndDate = this.searchFormConfirm.expecteTime[1]
      }

      var obj = deepCloneIgnoreNull(this.searchFormConfirm)
      var param = ""
      if (this.selectList.length > 0) {
        var poPaymentNo = ""
        for (var i = 0; i < this.selectList.length; i++) {
          if (i == 0) {
            poPaymentNo = this.selectList[i].poPaymentNo
          } else {
            poPaymentNo = poPaymentNo + "," + this.selectList[i].poPaymentNo
          }
        }
        param = "?poPaymentNo=" + poPaymentNo
      } else {
        var count = 0
        for (var index in obj) {
          if (count == 0) {
            param = "?" + index + "=" + obj[index]
          } else {
            param = param + "&" + index + "=" + obj[index]
          }
          count++
        }
      }

      this.downloadUrl = getTokenUrlFile("/api/finance/popayment/exportListData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
      this.searchFormConfirm.currency = tempCurrency
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
    }
  }
}
</script>
