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
  <div class="execution" id="sealSample">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @selection-change="selectionChange"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-del="rowDel"
        @search-change="searchChange"
        @search-reset="searchReset"
      >
        <template slot-scope="scope" slot="menuLeft">
          <el-button
            size="small"
            type="primary"
            v-if="permissions.sealSample_prdsealsample_insert"
            @click="openSealSampleWindow"
            >封样</el-button
          >
          <el-button
            type="primary"
            @click="sealsampleConfrim(1, '提交封样')"
            size="small"
            v-if="permissions.sealSample_confrim"
            >提交封样</el-button
          >
          <el-button size="small" type="primary" v-if="permissions.prd_seal_sample_batch_import" @click="showImport"
            >批量导入</el-button
          >
          <!--
          <el-button type="primary" @click="recall(1, '撤销提交')" size="small"
            v-if="permissions.sealSample_recall">撤销提交</el-button> -->

          <!-- 2023-07-03 暂时隐藏审核流-->
          <!-- <el-dropdown-button
            v-if="permissions.sealSample_developerConfrim"
            type="primary"
            size="small"
            buttonText="开发审核"
            command="开发审核"
            @command="handleCommand"
          >
            <el-dropdown-item command="开发反审核">反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown-button
            v-if="permissions.sealSample_designerConfrim"
            type="primary"
            size="small"
            buttonText="设计审核"
            command="设计审核"
            @command="handleCommand"
          >
            <el-dropdown-item command="设计反审核">反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown-button
            v-if="permissions.sealSample_purchaserConfrim"
            type="primary"
            size="small"
            buttonText="采购审核"
            command="采购审核"
            @command="handleCommand"
          >
            <el-dropdown-item command="采购反审核">反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown-button
            v-if="permissions.sealSample_sellerConfrim"
            type="primary"
            size="small"
            buttonText="销售审核"
            command="销售审核"
            @command="handleCommand"
          >
            <el-dropdown-item command="销售反审核">反审核</el-dropdown-item>
          </el-dropdown-button> -->

          <!-- <el-dropdown-button
            type="primary"
            size="small"
            buttonText="品质审核"
            command="品质审核"
            @command="handleCommand"
          >
            <el-dropdown-item command="品质反审核">反审核</el-dropdown-item>
          </el-dropdown-button>-->

          <!-- 2023-07-03 暂时隐藏审核流-->
          <!-- <el-button
            style="margin-left:10px"
            type="primary"
            @click="sealsampleConfrim(6,'品质审核')"
            size="small"
            v-if="permissions.sealSample_quanlityConfrim"
          >品质审核</el-button> -->
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="formInline" ref="formInline" :inline="true">
            <!-- <el-form-item label="sku名称">
              <el-input
                clearable
                v-model="formInline.skuName"
                size="small"
                placeholder="请输入sku名称搜索"
                v-search-input-trim
              ></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="源单编号">
              <el-input
                clearable
                v-model="formInline.invoiceNo"
                size="small"
                placeholder="请输入源单编号搜索"
                v-search-input
              ></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-input
                v-model="formInline.spuCode"
                placeholder="标准SPU,支持多个"
                size="small"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item class="needChangeSelect">
              <el-input placeholder="请输入内容" v-model="selectValue" size="small" v-search-input>
                <el-select v-model="selectLabel" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="item in searchName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.skuName" size="small" placeholder="产品名称" clearable> </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.invoiceNo" size="small" placeholder="源单编号" clearable> </el-input>
            </el-form-item>

            <!-- <el-form-item label="开发人员">
              <el-input v-model="formInline.developer" size="small" placeholder="开发人员" clearable>
              </el-input>
            </el-form-item> -->
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="formInline" ref="formInline" :inline="true">
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="dateRange"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="封样开始日期"
                end-placeholder="封样结束日期"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.dataStatus" size="small" placeholder="封样状态" clearable>
                <el-option
                  v-for="item in dataStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="dataStatus" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            class="button-css el-row-text"
            @click="showOperateLog(scope.row.sealSampleId)"
            >{{ scope.row.formatterStatus }}</el-button
          >
        </template>

        <template slot="skuCode" slot-scope="scope">
          <!-- <el-button
            type="text"
            size="mini"
            class="button-css"
            @click="showSealSampleWindow(scope.row)"
          >{{scope.row.skuCode}}</el-button>-->
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              :to="
                '/sealSampleTable/index?skuId=' +
                scope.row.skuId +
                '&skuCode=' +
                scope.row.skuCode +
                '&disabled=' +
                true
              "
              :title="scope.row.skuCode"
              >{{ scope.row.skuCode }}</router-link
            >
          </copy-text>
        </template>

        <template slot="developer" slot-scope="{ row }">
          <div>{{ row.developer }}</div>
          <div>{{ row.createTime }}</div>
        </template>

        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.sealSampleId)"></i>
          <!-- <el-button type="text" size="mini">查看</el-button> -->
        </template>
      </avue-crud>
      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="30%">
        <!-- :before-close="handleClose"> -->
        <!-- <el-radio v-model="confirmType" label="1">同意</el-radio>
        <el-radio v-model="confirmType" label="2">拒绝</el-radio> -->
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="请填写相关信息反馈给开发人员，不得超过100个字符。"
          v-model="confrimTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleConfrim()">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>
      <!-- 操作日志 -->
      <prdoperatelog ref="prdoperatelog"></prdoperatelog>
    </basic-container>

    <newCommonImport
      ref="commonImport"
      :downloadUrl="downloadUrl"
      :previewUrl="previewUrl"
      :uploadUrl="uploadUrl"
      downloadTitle="封样单导入模板"
      @import="importExcelBtn"
      :isUploadFile="true"
    >
    </newCommonImport>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, updateStatus, reverseConfrim } from "@/api/product/prdsealsample"
import newCommonImport from "@/views/cockpit/newCommonImport.vue"
import { tableOption } from "@/const/crud/product/prdsealsample"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "../../../components/avue/utils/util"
import axios from "axios"
export default {
  name: "prdsealsample",
  components: {
    prdoperatelog,
    newCommonImport
  },
  data() {
    return {
      downloadUrl: "/product/prdsealsample/prdSealSampleTemplateDownWithData",
      previewUrl: "/product/prdsealsample/batchImportDataPreview",
      uploadUrl: "/product/prdsealsample/batchImportData",
      dataStatusOptions: [
        // {
        //   value: "-1",
        //   label: "缺少封样数据"
        // },
        {
          value: "0",
          label: "未处理"
        },
        // {
        //   value: "1",
        //   label: "开发审核"
        // },
        // {
        //   value: "2",
        //   label: "设计审核"
        // },
        // {
        //   value: "3",
        //   label: "采购审核"
        // },
        // {
        //   value: "4",
        //   label: "销售审核"
        // },
        // {
        //   value: "5",
        //   label: "品质审核"
        // },
        {
          value: "6",
          label: "封样完成"
        },
        {
          value: "7",
          label: "待质量审核"
        }
      ],
      searchForm: {},
      formInline: {
        skuName: "",
        invoiceNo: "",
        spuCode: "",
        dataStatus: []
      },
      dateRange: [],
      dataStatus: "",
      confrimTextarea: "",
      confrimTitle: "",
      confirmType: "", //1同意,2拒绝
      confrimDialog: false,
      dataObj: {},
      tableData: [],
      selectList: [],
      formInlineTotal: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      excelErrorMsg: [],
      searchName: [
        { label: "工厂sku", value: "skuCode" },
        { label: "标准sku", value: "standardSkuCode" }
      ],
      selectValue: "",
      selectLabel: "skuCode"
    }
  },
  created() {},
  activated() {
    this.getList(this.page, this.searchForm)
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 批量导入
    showImport() {
      const params = this.tableData.map((item) => {
        return {
          skuCode: item.skuCode
        }
      })
      this.$refs.commonImport.syncFn({
        downloadParams: params,
        uploadParams: {}
      })
    },
    // 导入成功才有的回调
    importExcelBtn(file) {
      this.getList(this.page, this.searchForm)
    },

    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.confirmType = 1
      } else {
        this.confirmType = 2
      }
      this.handleConfrim()
    },

    //撤销提交
    recall() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (let index = 0; index < this.selectList.length; index++) {
        if (this.selectList[index].dataStatus == 6) {
          this.$message.error("封样完成状态不能操作")
          return
        } else if (this.selectList[index].dataStatus != 1) {
          this.$message.error("请检查勾选数据的[封样状态]是否正确")
          return
        }
      }
      var selectRow = this.selectList
      var addList = []
      for (let i = 0; i < selectRow.length; i++) {
        addList.push({
          dataStatus: 1,
          sealSampleId: selectRow[i].sealSampleId
        })
      }
      var obj = {
        prdSealSampleList: addList,
        confirmType: 2
      }
      updateStatus(obj).then((response) => {
        //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
        if (response.data.code == 0) {
          this.$refs.crud.selectClear()
          this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }
        this.getList(this.page)
      })
    },
    handleCommand(command) {
      if (command == "开发审核") {
        this.sealsampleConfrim(2, command)
      } else if (command == "开发反审核") {
        this.reverseConfrim(2)
      } else if (command == "设计审核") {
        this.sealsampleConfrim(3, command)
      } else if (command == "设计反审核") {
        this.reverseConfrim(3)
      } else if (command == "采购审核") {
        this.sealsampleConfrim(4, command)
      } else if (command == "采购反审核") {
        this.reverseConfrim(4)
      } else if (command == "销售审核") {
        this.sealsampleConfrim(5, command)
      } else if (command == "销售反审核") {
        this.reverseConfrim(5)
      }
    },
    //查看操作日志
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id ? id : -2, 7)
    },
    searchReset() {
      this.formInline = {
        skuName: "",
        invoiceNo: "",
        dataStatus: []
      }
      this.dateRange = []
      this.selectValue = ""
    },
    searchChange(form) {
      this.searchForm = form
      this.formInlineTotal = deepCloneIgnoreNull(this.formInline)
      // var param = this.formInline;
      // var skuCode = form.skuCode;
      // var skuName = param.skuName;
      // var number = param.number;
      // var invoiceNo = param.invoiceNo;
      // if (skuCode) {
      //   this.formInline.skuCode = skuCode
      //     .trim()
      //     .replace(/\s+/g, ",")
      //     .replace(/,{2,}/g, ",");
      // }
      // if (skuName) {
      //   param.skuName = skuName
      //     .trim()
      //     .replace(/\s+/g, ",")
      //     .replace(/,{2,}/g, ",");
      // }
      // if (number) {
      //   param.number = number
      //     .trim()
      //     .replace(/\s+/g, ",")
      //     .replace(/,{2,}/g, ",");
      // }
      // if (invoiceNo) {
      //   param.invoiceNo = invoiceNo
      //     .trim()
      //     .replace(/\s+/g, ",")
      //     .replace(/,{2,}/g, ",");
      // }
      // this.page.page = 1;
      this.page.currentPage = 1
      if (this.selectLabel && this.selectValue) {
        this.searchForm[this.selectLabel] = this.selectValue
      }

      if (this.dateRange) {
        this.searchForm.beginCreateTime = this.dateRange[0]
        this.searchForm.endCreateTime = this.dateRange[1]
      }

      this.getList(this.page, this.searchForm)
    },
    //查询
    getList(page, params) {
      this.tableLoading = true
      if (params) {
        Object.assign({
          descs: "create_time",
          current: page.currentPage,
          size: page.pageSize
        })
      }
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.formInlineTotal
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.tableData.forEach((item) => {
          switch (item.dataStatus) {
            case null:
              item.formatterStatus = "缺少封样数据"
              break
            case 0:
              item.formatterStatus = "未处理"
              break
            case 1:
              item.formatterStatus = "开发审核"
              break
            case 2:
              item.formatterStatus = "设计审核"
              break
            case 3:
              item.formatterStatus = "采购审核"
              break
            case 4:
              item.formatterStatus = "销售审核"
              break
            case 5:
              item.formatterStatus = "品质审核"
              break
            case 6:
              item.formatterStatus = "封样完成"
              break
            case 7:
              item.formatterStatus = "待质量审核"
              break
          }
          item.dataStatus
        })
        //更新分页信息
        this.page.total = response.data.data.total
        this.page.currentPage = response.data.data.current
        this.page.pageSize = response.data.data.size
        this.tableLoading = false
      })
    },
    showSealSampleWindow(row) {
      this.$router.push({
        path: "/sealSampleTable",
        query: {
          sealSampleId: typeof row.sealSampleId == "object" ? "" : row.sealSampleId,
          skuCode: row.skuCode,
          skuId: row.skuId,
          edit: false
        }
      })
    },
    //新开页面
    openSealSampleWindow() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      for (let index = 0; index < this.selectList.length; index++) {
        // if (this.selectList[index].dataStatus == 6) {
        //   this.$message.error("封样完成状态不能操作");
        //   return;
        // } else if (this.selectList[index].dataStatus != 0) {
        //   this.$message.error("请选择[封样状态]为未处理的单据");
        //   return;
        // }
        let row = this.selectList[index]
        if (row.dataStatus != 6 && row.dataStatus != 0 && row.dataStatus != null && row.dataStatus != 7) {
          this.$message.error("请选择封样状态为:【未处理】【封样完成】【缺少封样数据】【待质量审核】的单据")
          return
        }
      }
      if (!this.selectList[0].sealSampleId) {
        this.selectList[0].sealSampleId = ""
      }
      this.$router.push({
        path: "/sealSampleTable",
        query: {
          sealSampleId: this.selectList[0].sealSampleId,
          skuCode: this.selectList[0].skuCode,
          skuId: this.selectList[0].skuId,
          disabled: false
        }
      })
    },
    //勾选方法
    selectionChange(list) {
      this.selectList = list
    },
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    //反审
    reverseConfrim(type) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (let index = 0; index < this.selectList.length; index++) {
        if (this.selectList[index].dataStatus == 6) {
          this.$message.error("封样完成状态不能操作")
          return
        } else if (this.selectList[index].dataStatus != type) {
          this.$message.error("请检查勾选数据的[封样状态]是否正确")
          return
        }
      }
      reverseConfrim(this.selectList, type).then((response) => {
        if (response.data.code == 0) {
          this.$refs.crud.selectClear()
          this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }
        this.getList(this.page)
      })
    },
    sealsampleConfrim: function (dataStatus, title) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (let index = 0; index < this.selectList.length; index++) {
        if (this.selectList[index].dataStatus == 6) {
          this.$message.error("封样完成状态不能操作")
          return
        } else if (this.selectList[index].dataStatus != dataStatus - 1) {
          this.$message.error("请检查勾选数据的[封样状态]是否正确")
          return
        }
      }
      if (dataStatus == 1) {
        var selectRow = this.selectList
        var addList = []
        for (let i = 0; i < selectRow.length; i++) {
          addList.push({
            dataStatus: dataStatus,
            sealSampleId: selectRow[i].sealSampleId
          })
        }
        var confirmType
        if ((title = "提交封样")) {
          confirmType = 1
        } else if ((title = "撤销提交")) {
          confirmType = 2
        }
        var obj = {
          prdSealSampleList: addList,
          confirmType: confirmType
        }
        updateStatus(obj).then((response) => {
          //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
          if (response.data.code == 0) {
            this.$refs.crud.selectClear()
            // this.getList(this.page)
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            })
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("修改失败")
            return
          }
          this.getList(this.page, this.searchForm)
        })
      } else {
        this.confirmType = "1"
        this.confrimTextarea = ""
        this.confrimDialog = true
        this.confrimTitle = title
        this.dataStatus = dataStatus
      }
    },
    //审批弹框确认
    handleConfrim() {
      var selectRow = this.selectList
      var addList = []
      for (let i = 0; i < selectRow.length; i++) {
        addList.push({
          dataStatus: this.dataStatus,
          sealSampleId: selectRow[i].sealSampleId
        })
      }
      if (this.confirmType == 2) {
        if (!this.confrimTextarea) {
          this.$message.error("请填写拒绝原因")
          return
        }
      }
      // var attchObj = {
      //   confirmType: this.confirmType,
      //   message: this.confrimTextarea
      // };
      var obj = {
        prdSealSampleList: addList,
        confirmType: this.confirmType,
        message: this.confrimTextarea
      }
      updateStatus(obj).then((response) => {
        //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
        if (response.data.code == 0) {
          this.$refs.crud.selectClear()
          // this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
          this.changeStaff = false
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }

        this.confrimDialog = false
        this.getList(this.page)
      })
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.sealSampleId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.sealSampleId)
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
     * @title 数据插入或更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      row.skuId = this.selectList[0].skuId
      row.sealSampleId = this.selectList[0].sealSampleId
      addObj(row).then((data) => {
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
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
#sealSample {
  ::v-deep .el-dialog__header {
    line-height: 30px;
  }

  ::v-deep .el-textarea__inner {
    height: 90px;
  }

  ::v-deep .el-dialog__footer {
    padding: 0px 20px 20px 20px;
    border-top: 0px;
    clear: both;
    background: #fff;
  }
}
</style>
