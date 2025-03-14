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
  <!-- 请购撤销 -->
  <div class="execution" id="porequisitonCancelList">
    <basic-container>
      <!-- <router-link to="/porequisitonCancel/edit">新增/撤销使用同一个页面</router-link> -->
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <!-- v-if="permissions.purchase_porequisiton_submit" pore_cancel -->
          <el-button
            type="primary"
            @click="deleteDataList()"
            v-if="permissions.purchase_porequisitonrevoke_del"
            size="small"
            >删 除</el-button
          >
          <el-button
            type="primary"
            @click="submitNoDataChangeList()"
            v-if="permissions.purchase_porequisitonrevoke_submit"
            size="small"
            >提交审核</el-button
          >
          <el-button
            type="primary"
            @click="purchaseVerifyList()"
            v-if="permissions.purchase_porequisitonrevoke_purchase"
            size="small"
            >采购审核</el-button
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
            <el-form-item prop="requisitionRevokeNo">
              <avue-crud-input
                v-model="searchForm.requisitionRevokeNo"
                size="small"
                placeholder="撤销单号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <avue-crud-input v-model="searchForm.skuCode" size="small" placeholder="SKU"></avue-crud-input>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="modelName">
              <avue-crud-input v-model="searchForm.modelName" size="small" placeholder="型号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="requisitionNo">
              <avue-crud-input v-model="searchForm.requisitionNo" size="small" placeholder="请购单号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                size="small"
                v-model="searchForm.status"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="单据状态"
              >
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <!-- 操作列表中的某一列 -->
        <template slot="requisitionRevokeNo" slot-scope="scope">
          <router-link
            :to="{ path: '/porequisitonCancel/edit', query: { requisitionRevokeNo: scope.row.requisitionRevokeNo } }"
            >{{ scope.row.requisitionRevokeNo }}</router-link
          >
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.requisitionRevokeNo)">{{ formatData(scope.row.status) }}</a>
        </template>
      </avue-crud>

      <!-- 审核 -->
      <el-dialog class="audit-dialog" v-bind:title="auditTitle" :visible.sync="auditDialog" width="520px" center>
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="拒绝必须填写原因，不得超过100个字符。"
          v-model="refuseReason"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="dialogResult(false, 'audit', 1, '销售审核', true)"
            >拒 绝</el-button
          >
          <el-button type="primary" size="small" @click="dialogResult(true, 'audit', 1, '销售审核', true)"
            >通 过</el-button
          >
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, deleteData, submitNoDataChange, purchaseVerify } from "@/api/purchase/porequisitonCancel"
import { getMemberAllByGroupId } from "@/api/admin/user"
import { tableOption, statusOptions } from "@/const/crud/purchase/porequisitonCancel"
import operationlog from "@/views/purchase/log/index"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "porequisitonCancelList",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        status: [],
        time: [],
        requisitionNo: "",
        skuCode: "",
        modelName: "",
        requisitionRevokeNo: ""
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
      list: [],
      auditTitle: "采购审核",
      auditDialog: false,
      auditResult: "", //1同意,2拒绝
      refuseReason: "",
      purchaseUserId: "",
      purchaseUserOptions: [],
      //处理环节
      statusOptions: statusOptions
    }
  },
  mounted: function () {
    this.getList(this.page)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "采购审核",
        2: "审核通过"
      }
      return obj[id]
    },
    // 查看日志
    showOperateLog(requisitionRevokeNo) {
      this.$refs.operationlog.showOperateLogDialog(requisitionRevokeNo, 18)
    },
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditResult = 0
      } else {
        this.auditResult = 1
      }
      if (this.auditResult == 1) {
        if (!this.refuseReason) {
          this.$message.error("请填写拒绝原因")
          return
        }
      }
      let remark = ""
      if (this.auditResult == 1) {
        remark = this.refuseReason
      }
      let param = {
        requisitionRevokeNos: this.list.join(","),
        type: this.auditResult,
        rejectReason: remark
      }

      //访问后台接口 更新数据
      purchaseVerify(param).then((response) => {
        if (response.data.code == 0) {
          this.auditDialog = false
          this.clearSelectClear()
          this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
          this.getList(this.page, this.searchFormConfirm)
          this.$notify({
            title: "成功",
            message: "采购审核成功",
            type: "success",
            duration: 2000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    //dialog 样式修改后添加结束
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage

      if (this.searchFormConfirm.status) {
        this.searchFormConfirm.status = this.searchFormConfirm.status.join(",")
      }
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.startTime = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endTime = this.searchFormConfirm.time[1]
      } else {
        this.searchFormConfirm.startTime = ""
        this.searchFormConfirm.endTime = ""
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
      this.page.currentPage = 1
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
      // this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm);
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      // this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm);
      this.getList(this.page, this.searchFormConfirm)
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
     * 删除数据
     */
    deleteDataList: function () {
      this.checkDataBefore(0, "删除")
      if (this.list.length == 0) {
        return
      }

      //删除前弹框
      this.$confirm("此操作将删除选中请购撤销, 是否继续??", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            requisitionRevokeNos: this.list.join(",")
          }

          //访问后台接口 更新数据
          deleteData(param).then((response) => {
            if (response.data.code == 0) {
              this.auditDialog = false
              this.clearSelectClear()
              this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
              this.getList(this.page, this.searchFormConfirm)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("操作失败")
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    /**
     * 提交审核
     */
    submitNoDataChangeList: function () {
      this.checkDataBefore(0, "提交审核")
      if (this.list.length == 0) {
        return
      }
      let param = {
        requisitionRevokeNos: this.list.join(",")
      }

      //访问后台接口 更新数据
      submitNoDataChange(param).then((response) => {
        if (response.data.code == 0) {
          this.auditDialog = false
          this.clearSelectClear()
          this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
          this.getList(this.page, this.searchFormConfirm)
          this.$notify({
            title: "成功",
            message: "提交审核成功",
            type: "success",
            duration: 2000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },

    /**
     * 采购审核
     */
    purchaseVerifyList: function () {
      this.checkDataBefore(1, "采购审核")
      if (this.list.length == 0) {
        return
      }
      this.auditResult = ""
      this.refuseReason = ""
      this.auditDialog = true
    },
    /**
     * 删除、提交审核，采购审核前校验数据
     */
    checkDataBefore: function (status, operation) {
      this.list = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var flag = true
      var tip = ""
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        if (element.status != status) {
          var statusName = ""
          for (let a = 0; index < this.statusOptions.length; a++) {
            if (element.status == this.statusOptions[a].value) {
              statusName = this.statusOptions[a].label
              break
            }
          }
          tip = "请购撤销单" + element.requisitionRevokeNo + "，状态为：" + statusName + ",不允许" + operation
          flag = false
          break
        } else {
          this.list.push(element.requisitionRevokeNo)
        }
      }
      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
