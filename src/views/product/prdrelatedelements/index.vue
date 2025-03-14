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
<!-- @current-change="currentChange" -->
<template>
  <div class="execution" id="prdrelatedelements">
    <basic-container class="prdrelatedelements">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @search-change="handleFilter"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleAdd"
            size="small"
            v-if="permissions.product_prdrelatedelements_add_or_edit"
            >关联要素</el-button
          >
        </template>

        <template slot="search">
          <el-form-item>
            <el-input v-model="search.customsCode" size="small" placeholder="海关编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.customsName" size="small" placeholder="海关名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.skuCode" size="small" placeholder="SKU"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.skuName" size="small" placeholder="SKU名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.modelName" size="small" placeholder="型号"></el-input>
          </el-form-item>
        </template>
        <template slot="operateLog" slot-scope="scope">
          <!-- <span @click="showOperateLog(scope.row.relatedElementId)" style="color:#F90">查看</span> -->
          <!-- <el-button type="text" size="mini" class="button-css" @click="showOperateLog(scope.row.relatedElementId)">查看</el-button> -->
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.relatedElementId)"></i>
        </template>
      </avue-crud>

      <!--关联要素-->
      <el-dialog title="关联要素" center :visible.sync="addOrUpdateDialogVisible" width="695px" @close="closeDialog">
        <el-form
          class="add-form-style"
          ref="addOrUpdateForm"
          :model="relatedElementsInfo"
          :rules="addOrUpdateFormRules"
          status-icon
        >
          <el-form-item label="当前SKU" prop="skuCode" label-position="left">{{
            relatedElementsInfo.skuCode
          }}</el-form-item>
          <el-form-item label="SKU名称" prop="skuName" label-position="left" :title="relatedElementsInfo.skuName">{{
            relatedElementsInfo.skuName
          }}</el-form-item>
          <el-form-item label="海关编号" prop="customsCode">
            <el-select
              size="small"
              v-model="relatedElementsInfo.customsCode"
              filterable
              remote
              reserve-keyword
              @change="handleSelect"
              placeholder="请输入海关编号查询"
              :remote-method="querySearch"
              :loading="loading"
            >
              <el-option
                v-for="item in customsData"
                :key="item.customsElementId"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <!-- <el-autocomplete
              v-model="relatedElementsInfo.customsCode" 
              :fetch-suggestions="querySearch"
              placeholder="请输入海关编号查询"
              @select="handleSelect"
              :loading="loading">
            </el-autocomplete> -->
          </el-form-item>
          <el-form-item label="海关名称" prop="customsName" label-position="left">{{
            relatedElementsInfo.customsName
          }}</el-form-item>
          <el-form-item label="海关名称（英文）" prop="customsNameEn" label-position="left">{{
            relatedElementsInfo.customsNameEn
          }}</el-form-item>
          <el-form-item label="法定退税率" prop="legalRefundRate" label-position="left">{{
            relatedElementsInfo.legalRefundRate
          }}</el-form-item>
          <el-form-item label="品牌" prop="brandName" label-position="left">{{
            relatedElementsInfo.brandName
          }}</el-form-item>
          <el-form-item label="规格" prop="specification" label-position="left">{{
            relatedElementsInfo.specification
          }}</el-form-item>
          <el-form-item label="海关法定单位" prop="customsLegalUnit" label-position="left">{{
            relatedElementsInfo.customsLegalUnit
          }}</el-form-item>
          <el-form-item label="材质" prop="material">
            <el-input
              type="textarea"
              placeholder="不得超过600位字符"
              maxlength="600"
              v-model="relatedElementsInfo.material"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="用途" prop="application">
            <el-input
              type="textarea"
              maxlength="600"
              placeholder="不得超过600位字符"
              v-model="relatedElementsInfo.application"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="申报要素" prop="declarationElement">
            <el-input
              type="textarea"
              maxlength="600"
              placeholder="不得超过600位字符"
              v-model="relatedElementsInfo.declarationElement"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="addOrUpdateDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 操作日志 -->
      <prdoperatelog ref="prdoperatelog"></prdoperatelog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, queryCustomsCodeList } from "@/api/product/prdrelatedelements"
import { tableOption } from "@/const/crud/product/prdrelatedelements"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { resolve } from "q"
import { deepCloneIgnoreNull } from "../../../components/avue/utils/util"
export default {
  name: "prdrelatedelements",
  components: {
    prdoperatelog
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      addOrUpdateDialogVisible: false,
      selectList: [],
      //搜索对象
      search: {
        customsCode: "",
        customsName: "",
        skuCode: "",
        skuName: "",
        modelName: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      relatedElementsInfo: {},
      prdRelatedElementsInfo: {},
      addOrUpdateFormRules: {
        customsCode: [
          { required: true, message: "请输入海关编号", trigger: "change" }
          // { max: 12, message: "海关编号不得超过12个字符", trigger: "change" }
        ],
        material: [
          { required: true, message: "请输入材质", trigger: "blur" },
          { max: 600, message: "材质不得超过600个字符", trigger: "blur" }
        ],
        application: [
          { required: true, message: "请输入用途", trigger: "blur" },
          { max: 600, message: "用途不得超过600个字符", trigger: "blur" }
        ],
        declarationElement: [
          { required: true, message: "请输入申报要素", trigger: "blur" },
          { max: 600, message: "申报要素不得超过600个字符", trigger: "blur" }
        ]
        // customsNameEn: [
        //   { required: true, message: "请输入海关名称(英文)", trigger: "blur" },
        //   { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' }
        // ]
      },
      //海关元素下拉框
      loading: false,
      customsData: []
    }
  },
  created() {},
  mounted: function () {
    // this.getList(this.page);getList
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
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
     * 重置搜索条件
     */
    searchReset() {
      this.search = {}
    },
    handleFilter(param) {
      this.page.currentPage = 1
      this.searchFormConfirm = deepCloneIgnoreNull(this.search)
      this.getList(this.page, param)
      this.clearSelectClear()
    },
    /**
     * 选中数据
     */
    selectionChange(tableData) {
      this.selectList = tableData
    },
    /**
     * 清除选中
     */
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    /**
     * 当前第几页
     */
    // currentChange(val) {
    //   //console.log(this.searchQ)
    //   this.page.currentPage = val;
    //   // this.getList(this.page, this.searchQ);
    // },
    /**
     * 每页显示几条
     */
    sizeChange(val) {
      this.page.pageSize = val
      // this.getList(this.page, this.searchQ);
    },
    /**
     * 查看操作日志
     */
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id, 11)
    },
    closeDialog() {
      this.customsData = []
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      var data = this.selectList[0]
      this.relatedElementsInfo = {
        skuId: data.skuId,
        skuCode: data.skuCode,
        skuName: data.skuName,
        customsElementId: data.customsElementId,
        customsCode: data.customsCode,
        customsName: data.customsName,
        customsNameEn: data.customsNameEn,
        legalRefundRate: data.legalRefundRate,
        brandName: data.brandName,
        specification: data.specification,
        customsLegalUnit: data.customsLegalUnit,
        relatedElementId: data.relatedElementId,
        material: data.material,
        application: data.application,
        declarationElement: data.declarationElement
      }
      this.addOrUpdateDialogVisible = true
    },
    /**
     * 输入检索海关编号
     */
    querySearch(queryString, resolve) {
      if (!queryString || queryString.trim().length == 0) {
        this.customsData = []
      } else {
        queryString = queryString.length <= 60 ? queryString : queryString.substring(0, 60)
        var queryParams = {
          customsCode: queryString
        }
        this.loading = true
        queryCustomsCodeList(queryParams).then((response) => {
          this.loading = false
          var restaurants = response.data.data
          this.customsData = restaurants
          console.log(this.customsData)
          // resolve(restaurants)
        })
      }
    },
    handleSelect(item) {
      let options = this.customsData.filter((obj) => {
        return obj.value == item
      })
      if (options.length == 1) {
        let opt = options[0]
        this.relatedElementsInfo.customsElementId = opt.customsElementId
        this.relatedElementsInfo.customsCode = opt.value
        this.relatedElementsInfo.customsName = opt.customsName
        this.relatedElementsInfo.customsNameEn = opt.customsNameEn
        this.relatedElementsInfo.legalRefundRate = opt.legalRefundRate
        this.relatedElementsInfo.customsLegalUnit = opt.customsLegalUnit
      }
    },
    //提交新增或者更新表单
    addOrUpdateSubmit(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.prdRelatedElementsInfo = {
            relatedElementId: this.relatedElementsInfo.relatedElementId,
            material: this.relatedElementsInfo.material.trim(),
            application: this.relatedElementsInfo.application.trim(),
            declarationElement: this.relatedElementsInfo.declarationElement.trim(),
            skuId: this.relatedElementsInfo.skuId,
            customsElementId: this.relatedElementsInfo.customsElementId
          }

          preventShake.preventShake((bool) => {
            if (bool) {
              addObj(this.prdRelatedElementsInfo)
                .then((response) => {
                  if (response.data.code == 0) {
                    this.addOrUpdateDialogVisible = false
                    this.clearSelectClear()
                    this.getList(this.page)
                    this.$notify({
                      title: "成功",
                      message: "操作成功",
                      type: "success",
                      duration: 2000
                    })
                    //清空
                  } else if (response.data.code == 1) {
                    this.$message.error(response.data.msg)
                    return
                  } else {
                    this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  this.$message.error("操作失败")
                  return
                })
            }
          })
        } else {
          console.log("error submit!!")
          return false
        }
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
      this.$confirm("是否确认删除ID为" + row.relatedElementId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.relatedElementId)
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
    refreshChange(param) {
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
