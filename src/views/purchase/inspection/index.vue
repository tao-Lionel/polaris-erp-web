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
  <div class="execution inspection-wrapper" id="inspection">
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
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.purchase_poinspection_add"
            >新 增</el-button
          >

          <el-button type="primary" @click="handleDel" size="small" v-if="permissions.purchase_poinspection_del"
            >删 除</el-button
          >
          <el-button type="primary" @click="handleArrange" size="small" v-if="permissions.purchase_poinspection_arrange"
            >确认安排</el-button
          >
          <el-button type="primary" @click="handleCancel" size="small" v-if="permissions.purchase_poinspection_cancel"
            >撤销确认</el-button
          >
          <el-button type="primary" @click="ensureOpen()" size="small" v-if="permissions.purchase_poinspection_result"
            >确认结果</el-button
          >
          <el-button
            type="primary"
            @click="exportData()"
            size="small"
            v-if="permissions.purchase_poinspection_exportData"
            >单据导出</el-button
          >
          <el-button
            type="primary"
            @click="exportListData()"
            size="small"
            v-if="permissions.purchase_poinspection_exportListData"
            >列表导出</el-button
          >
        </template>
        <!-- <template slot-scope="scope" v-if="permissions.purchase_poinspection_add"
                  slot="menu">
          <el-button type="text"
                     v-if="permissions.purchase_poinspection_edit"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button>
          <el-button type="text"
                     v-if="permissions.purchase_poinspection_del"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template> -->

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <!-- 单据时间 -->
            <el-form-item prop="createTimeStr">
              <el-date-picker
                v-model="searchForm.createTimeStr"
                type="daterange"
                align="right"
                size="small"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="inspectionNo">
              <el-input
                v-model.trim="searchForm.inspectionNo"
                size="small"
                placeholder="验货单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="status">
              <el-select v-model="searchForm.status" clearable size="small" placeholder="单据状态">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="searchChange" v-show="false" native-type="submit"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="inspectionResult">
              <el-select v-model="searchForm.inspectionResult" clearable size="small" placeholder="验货结果">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-model.trim="searchForm.skuCode"
                size="small"
                placeholder="SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <!-- 验货时间 -->
            <el-form-item prop="inspectionDateStr">
              <el-date-picker
                v-model="searchForm.inspectionDateStr"
                type="daterange"
                align="right"
                unlink-panels
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="验货开始日期"
                end-placeholder="验货结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-button @click="searchChange" v-show="false" native-type="submit"></el-button>
          </el-form>
        </template>

        <template slot="inspectionNo" slot-scope="scope">
          <router-link
            :to="'/inspection/detail?inspectionNo=' + scope.row.inspectionNo"
            :title="scope.row.inspectionNo"
            >{{ scope.row.inspectionNo }}</router-link
          >
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.inspectionNo)">{{ formatData(scope.row.status) }}</a>
        </template>

        <template slot="attachFile" slot-scope="scope">
          <div v-if="splitArr(scope.row.attachFile).length == 0"></div>
          <div v-if="splitArr(scope.row.attachFile).length > 0">
            <!-- v-popover:popPicPreview -->
            <el-button
              type="text"
              slot="reference"
              class="color-grey"
              @click="showPicPreview(scope.row.attachFile, $event)"
              >查看</el-button
            >
          </div>
        </template>
      </avue-crud>
      <!-- <el-popover v-model="isShowPicPreview" ref="popPicPreview" placement="left" trigger="click" popper-class="subHight2" @hide="picPreviewHided()" >
             <span v-for="(item,index) in picPreviewLists" :key="index">
                <img style="width:100%;" :src="item">
            </span> 
      </el-popover> -->
      <!-- 确认验货结果回话框 -->
      <el-dialog title="确认验货结果" :visible.sync="centerDialogVisible" width="70%" center>
        <div>
          <el-form ref="ensureForm" :inline="true" :model="ensureForm">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label-width="80px" label="验货时间">
                  <el-date-picker
                    style="width: 100%"
                    v-model="ensureForm.inspectionDate"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="验货文件(非必传)">
                  <el-button type="text" size="mini" class="button-css" @click="uploadFileDialog = true"
                    >上传</el-button
                  >
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="验货员">
                  <el-input
                    size="small"
                    v-model.trim="ensureForm.inspector"
                    placeholder="不得超过20个字符"
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="subHight">
          <avue-crud ref="subcrud" :data="subtableData" :option="subtableOption">
            <template slot="actualQuantity" slot-scope="scope">
              <el-form status-icon :model="scope.row">
                <el-form-item>
                  <el-input
                    size="small"
                    v-model="scope.row.actualQuantity"
                    style="width: 120px"
                    placeholder="计划数量"
                    maxlength="9"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>

            <template slot="inspectionResult" slot-scope="scope">
              <el-form status-icon :model="scope.row">
                <el-form-item>
                  <el-radio v-model="scope.row.inspectionResult" label="0" border check>合格</el-radio>
                  <el-radio v-model="scope.row.inspectionResult" label="1" border>不合格</el-radio>
                </el-form-item>
              </el-form>
            </template>

            <template slot="information" slot-scope="scope">
              <el-form status-icon :model="scope.row">
                <el-form-item>
                  <el-input type="textarea" v-model="scope.row.information" maxlength="200"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </avue-crud>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="ensureResult">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog class="dialog-wrapper" title="上传文件" :visible.sync="uploadFileDialog" width="55%">
        <el-upload
          action
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="companyCertificationRemove"
          :http-request="uplodeRequest"
          accept="image/jpeg, image/png, image/jpg"
          multiple
          :before-upload="onBeforeUploadImage"
          :file-list="fileList"
          :on-change="picChange"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog width="50%" title="预览图片" :visible.sync="picVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confrimUpload">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
      <img-dialog ref="imgdialog"></img-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getEnsureData, ensureResultData } from "@/api/purchase/inspection/poinspectiondetail.js"
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  insureArrange,
  cancelArrange,
  exportExcel
} from "@/api/purchase/inspection/poinspection.js"
import { tableOption, subtableOption } from "@/const/crud/purchase/inspection/poinspection.js"
import { uploadImage } from "@/api/supplier/posupplieraccounthistory"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import operationlog from "@/views/purchase/log/index"
import imgDialog from "@/views/purchase/inquiryorder/imgDialog"
// F:/project/trobs-ui/src/views/purchase/inquiryorder/imgDialog.vue
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"

export default {
  name: "poinspection",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        createTimeStr: "",
        inspectionDateStr: "",
        inspectionNo: "",
        supplierName: "",
        skuCode: "",
        status: "",
        inspectionResult: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      subtableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      subtableOption: subtableOption,

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      options: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "已安排"
        },
        {
          value: "2",
          label: "已验货"
        }
      ],
      options2: [
        {
          value: "0",
          label: "合格"
        },
        {
          value: "1",
          label: "不合格"
        }
      ],
      selectList: [],
      centerDialogVisible: false,
      uploadFileDialog: false,
      ensureForm: {
        inspectionDate: "",
        uploadFileUrl: [],
        inspector: ""
      },
      fileList: [],
      dialogImageUrl: "",
      picVisible: false,
      inspectionNo: "",

      // isShowPicPreview:false,
      // picPreviewLists:[],
      supplierOptions: []
    }
  },
  created() {},
  mounted: function () {
    this.getSupplierAll()
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  components: {
    operationlog,
    imgDialog
  },
  methods: {
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "已安排",
        2: "已验货"
      }
      return obj[id]
    },
    // 查看日志
    showOperateLog(inspectionNo) {
      this.$refs.operationlog.showOperateLogDialog(inspectionNo, 19)
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
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
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$router.push({
        path: "/inspection/detail",
        query: {}
      })
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    //删除
    handleDel(row, index) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var checkNos = ""
      var inspectionNos = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 0) {
          checkNos = checkNos + this.selectList[i].inspectionNo + ";"
          continue
        }
        inspectionNos.push(this.selectList[i].inspectionNo)
      }
      if (!this.isNulls(checkNos)) {
        this.$message.error(checkNos + "的状态不是未处理，不能进行删除!")
        return
      }

      this.$confirm("是否确认删除单号为" + inspectionNos, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(inspectionNos)
        })
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("删除成功!")
            //重新加载
            //页面刷新
            this.$refs.crud.selectClear()
            this.refreshChange()
            //this.getList(this.page);
          } else {
            this.$message.error("删除异常!")
          }
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
    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },
    //确认安排
    handleArrange() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var checkNos = ""
      var inspectionNos = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 0) {
          checkNos = checkNos + this.selectList[i].inspectionNo + ";"
          continue
        }
        inspectionNos.push(this.selectList[i].inspectionNo)
      }

      if (!this.isNulls(checkNos)) {
        this.$message.error(checkNos + "的状态不是未处理，不能进行安排!")
        return
      }

      insureArrange(inspectionNos)
        .then((resopnse) => {
          if (resopnse.data.code == 0) {
            this.$message.success("操作成功!")
            //页面刷新
            this.$refs.crud.selectClear()
            this.refreshChange()
          } else {
            this.$message.error(resopnse.data.msg)
          }
        })
        .finally(() => {})
    },

    //取消确认
    handleCancel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var checkNos = ""
      var inspectionNos = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 1) {
          checkNos = checkNos + this.selectList[i].inspectionNo + ";"
          continue
        }
        inspectionNos.push(this.selectList[i].inspectionNo)
      }

      if (!this.isNulls(checkNos)) {
        this.$message.error(checkNos + "的状态不是已安排，不能进行取消!")
        return
      }

      cancelArrange(inspectionNos)
        .then((resopnse) => {
          if (resopnse.data.code == 0) {
            this.$message.success("操作成功!")
            //页面刷新
            this.$refs.crud.selectClear()
            this.refreshChange()
          } else {
            this.$message.error(resopnse.data.msg)
          }
        })
        .finally(() => {})
    },
    //关闭弹框清空
    cleanfileList() {
      this.fileList = []
    },
    //覆盖默认上传方法
    uplodeRequest() {},
    //校验
    onBeforeUploadImage(file) {
      if (file.name.indexOf(",") != -1 || file.name.indexOf("[") != -1 || file.name.indexOf("]") != -1) {
        this.$message.error("文件名包含敏感字符,请修改后重新上传")
        return false
      }
      if (file.name.length > 40) {
        this.$message.error("文件名长度超出40个字符，请重新命名后上传")
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png")) {
        this.$message.error("上传文件只能是图片格式!")
        return false
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!")
        return false
      }
    },
    //确认上传
    confrimUpload() {
      if (this.fileList.length == 0) {
        return
      }
      this.ensureForm.uploadFileUrl = []
      this.fileList.forEach((file) => {
        this.UploadOpeningCertifPublic(file)
      })
      console.log(this.ensureForm.uploadFileUrl)
      this.uploadFileDialog = false
    },
    /**
     * 上传图片
     */
    UploadOpeningCertifPublic(file) {
      var formData = new FormData()
      formData.append("file", file.raw)
      formData.append("folderName", "inspection")
      uploadImage(formData).then((data) => {
        const uTmp = getTokenUrl(data.data.data)
        this.ensureForm.uploadFileUrl.push(data.data.data)
      })
    },
    //预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.picVisible = true
    },
    //删除图片
    companyCertificationRemove(file, fileLis) {
      this.fileList = fileLis
    },
    //校验
    picChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error("当前文件已经存在!")
        fileList.pop()
      }
      this.fileList = fileList
    },
    //确认结果信息查询
    ensureOpen() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var checkNos = ""
      var checkFlag = true
      this.inspectionNo = ""
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 1) {
          checkNos = checkNos + this.selectList[i].inspectionNo + ";"
          continue
        }

        if (this.inspectionNo != "" && this.inspectionNo != this.selectList[i].inspectionNo) {
          checkFlag = false
        }
        this.inspectionNo = this.selectList[i].inspectionNo
      }

      if (!this.isNulls(checkNos)) {
        this.$message.error(checkNos + "的状态不是已安排，不能进行结果确认!")
        return
      }

      if (!checkFlag) {
        this.$message.error("确认结果一次只能操作一条单据!")
        return
      }
      //清空数据
      this.ensureForm.inspectionDate = ""

      getEnsureData(this.inspectionNo)
        .then((resopnse) => {
          if (resopnse.data.code == 0) {
            this.subtableData = resopnse.data.data

            var userName = this.userInfo.displayname
            this.ensureForm.inspector = userName
            this.cleanfileList()
            this.centerDialogVisible = true
          } else {
            this.$message.error("确认数据查询失败")
          }
        })
        .finally(() => {})
    },

    //确认验货结果
    ensureResult() {
      var data = this.subtableData
      if (data.length == 0) {
        //关闭
        this.centerDialogVisible = false
        return
      }
      //做验证
      if (this.isNulls(this.ensureForm.inspector)) {
        this.$message.error("验货员不能为空")
        return
      }
      if (this.isNulls(this.ensureForm.inspectionDate)) {
        this.$message.error("验货时间不能为空")
        return
      }
      var req = /^\d{0,9}$/
      var reg = new RegExp(req)
      var checkFlag = true
      for (var i = 0; i < data.length; i++) {
        //实际数量
        if (this.isNulls(data[i].actualQuantity) || !reg.test(data[i].actualQuantity)) {
          this.$message.error("第" + (i + 1) + "行，实际验货数量必须为小于9位的自然数!")
          checkFlag = false
        }
        if (data[i].inspectionResult == "1" && this.isNulls(data[i].information)) {
          this.$message.error("第" + (i + 1) + "行，验货结果为不合格，需要输入验货详情!")
          checkFlag = false
        }
      }
      if (!checkFlag) {
        return
      }
      var attachList = []
      for (var k = 0; k < this.ensureForm.uploadFileUrl.length; k++) {
        var attObj = {
          inspectionNo: this.inspectionNo,
          attachFile: this.ensureForm.uploadFileUrl[k]
        }
        attachList.push(attObj)
      }
      //保存结果
      //添加附件
      var poInspection = {
        inspectionNo: this.inspectionNo,
        inspectionDate: this.ensureForm.inspectionDate,
        inspector: this.ensureForm.inspector
      }
      var obj = {
        poInspection: poInspection,
        list: data,
        attachList: attachList
      }

      ensureResultData(obj)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("确认成功!")
            this.centerDialogVisible = false
            //页面刷新
            this.$refs.crud.selectClear()
            this.refreshChange()
          } else {
            this.$message.error(response.data.msg)
          }
        })
        .finally(() => {})
    },

    //数据导出
    exportData() {
      if (this.selectList.length == 0) {
        this.$message.error("请勾选数据!")
        return
      }
      var inspectionNo = ""
      var checkNo = true
      for (var i = 0; i < this.selectList.length; i++) {
        if (inspectionNo != "" && inspectionNo != this.selectList[i].inspectionNo) {
          checkNo = false
        }
        inspectionNo = this.selectList[i].inspectionNo
      }
      if (!checkNo) {
        this.$message.error("一次只能导出一个单据!")
        return
      }

      // if(this.isNulls(inspectionNos)){
      //   obj = deepCloneIgnoreNull(this.searchForm);
      // }else{
      //   obj = {
      //     'inspectionNo': inspectionNos,
      //   }
      // }
      // var param = '';
      // var count = 0;
      // for (var index in obj){
      //     if(count == 0){
      //       param = "?" + index + "=" + obj[index];
      //     }else{
      //       param = param + "&" + index + "=" + obj[index];
      //     }
      //     count ++;
      // }
      this.downloadUrl = getTokenUrlFile("/api/purchase/poinspection/exportData?inspectionNo=" + inspectionNo)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },

    /**
     * 列表导出
     */
    exportListData() {
      var obj = deepCloneIgnoreNull(this.searchForm)
      var param = ""
      if (this.selectList.length > 0) {
        var inspectionNo = ""
        for (var i = 0; i < this.selectList.length; i++) {
          if (i == 0) {
            inspectionNo = this.selectList[i].inspectionNo
          } else {
            inspectionNo = inspectionNo + "," + this.selectList[i].inspectionNo
          }
        }
        param = "?inspectionNo=" + inspectionNo
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

      this.downloadUrl = getTokenUrlFile("/api/purchase/poinspection/exportListData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },
    splitArr(str) {
      var arr = []
      if (this.isNulls(str)) {
        return arr
      }
      var arr2 = str.split(",")
      for (var k = 0; k < arr2.length; k++) {
        arr.push(getTokenUrl(arr2[k]))
      }
      return arr
    },
    showPicPreview(param, $event) {
      const urls = (this.picPreviewLists = this.splitArr(param))
      // console.log(this.picPreviewLists=this.splitArr(param))

      this.$refs.imgdialog.showImgUrl(urls)

      // this.isShowPicPreview=true;
      // this.picPreviewLists=this.splitArr(param);
      // this.$nextTick(()=>{
      //   var pop =this.$refs.popPicPreview;
      //   pop.popperJS._reference=$event.target;
      //   pop.popperJS.state.position=pop.popperJS._getPosition(pop.popperJS._popper,pop.popperJS._reference);
      //   pop.popperJS.update();

      // });
    },
    // picPreviewHided(){
    //   this.picPreviewLists=[];
    // },
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
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

<style lang="scss">
#inspection {
  .subHight2 {
    width: 600px;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    img {
      width: 100%;
    }
  }
}
</style>
