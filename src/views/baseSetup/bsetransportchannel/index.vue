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
  <div class="execution" id="bsetransportchannel">
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
      >
        <template slot="menuLeft">
          <el-button type="primary" v-if="permissions.baseSetup_bsetransportchannel_add" size="small" @click="handleAdd"
            >新 增</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportchannel_edit"
            size="small"
            @click="handleEdit"
            >修改</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportchannel_audit"
            @click="handleAudit"
            size="small"
            >审核</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportchannel_enable"
            @click="handleEnable(0)"
            size="small"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportchannel_prohibit"
            @click="handleEnable(1)"
            size="small"
            >禁用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsetransportchannel_export"
            @click="handleExport()"
            size="small"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="transportModeName">
              <el-input
                v-model="searchForm.transportModeName"
                size="small"
                placeholder="运输方式,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="approveStatus">
              <el-select v-model="searchForm.approveStatus" size="small" clearable filterable placeholder="状态">
                <el-option
                  v-for="item in approveStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="delFlag">
              <el-select v-model="searchForm.delFlag" size="small" clearable filterable placeholder="启用/禁用">
                <el-option v-for="item in delFlagOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.transportModeId)"></i>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <el-dialog
          class="add_dialog"
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @close="formReset"
          center
        >
          <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" :rules="addOrUpdateRules" size="small" status-icon>
            <el-form-item label="运输方式" prop="transportModeName">
              <el-input
                v-model="addOrUpdateForm.transportModeName"
                size="small"
                maxlength="30"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <el-form-item label="账期" prop="accountDays">
              <el-input v-model="addOrUpdateForm.accountDays" size="small" maxlength="10" v-search-input-trim>
                <template slot="append">天</template>
              </el-input>
            </el-form-item>

            <el-form-item label="签收时间" prop="signDays">
              <el-input v-model="addOrUpdateForm.signDays" size="small" maxlength="10" v-search-input-trim>
                <template slot="append">天</template>
              </el-input>
            </el-form-item>

            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                v-model="addOrUpdateForm.remarks"
                size="small"
                maxlength="100"
                v-search-input-trim
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 审核 -->
      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="30%">
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
          <!-- <el-button type="primary" @click="handleAuditSave">确 定</el-button> -->
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
  fetchList,
  handleSaveOrUpdate,
  stateModify,
  handleAudit
} from "@/api/baseSetup/bsetransportchannel/bsetransportchannel"
import { tableOption, addOrUpdateRules } from "@/const/crud/baseSetup/bsetransportchannel/bsetransportchannel"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { getUrlConcatToken } from "@/util/auth"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bsetransportchannel",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        transportModeName: "",
        approveStatus: "",
        delFlag: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      selectRows: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,

      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      //禁用
      delFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      //新增 修改相关
      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      addOrUpdateRules: addOrUpdateRules,
      addOrUpdateForm: {
        transportModeId: null,
        transportModeName: "",
        accountDays: 0,
        signDays: "",
        remarks: ""
      },
      //审核相关
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null
    }
  },
  components: {
    operationlog
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
      } else {
        this.auditType = 2
      }
      this.handleAuditSave()
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
      page = page || { currentPage: 1 }
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
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
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
    //已审核数据
    getPSkuByApproveStatusOk() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          exists.push(obj.transportModeName)
          return obj
        }
      })
      return exists
    },
    //已禁用数据
    getPSkuByDelFlagFall() {
      let exists = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          exists.push(obj.transportModeName)
          return obj
        }
      })
      return exists
    },
    /** 打开新增窗口**/
    handleAdd: function () {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true
    },
    handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("请选择一条数据进行修改")
        return
      }

      //是否已审核
      // let exists = this.getPSkuByApproveStatusOk();
      // if(exists && exists.length > 0){
      //   this.$message.warning('物流商:'+exists + '，已审核过，不能修改');
      //   return;
      // }

      // 获取已禁用平台sku
      let exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("运输方式:" + exists + "，已禁用，不能修改")
        return
      }

      let row = this.selectRows[0]
      this.addOrUpdateForm = {
        transportModeId: row.transportModeId,
        transportModeName: row.transportModeName,
        accountDays: row.accountDays,
        signDays: row.signDays,
        remarks: row.remarks
      }
      this.handleAddOrUpdateTile = "修改"
      this.addOrUpdateDialog = true
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              handleSaveOrUpdate(_this.addOrUpdateForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success(_this.handleAddOrUpdateTile + "成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.addOrUpdateDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    inputBlur() {
      if (!this.addOrUpdateDialog) {
        this.formReset()
      }
    },
    formReset() {
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          transportModeId: null,
          transportModeName: "",
          accountDays: 0,
          signDays: "",
          remarks: ""
        }
      })
    },
    /**审核 */
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //是否已审核
      let exists = this.getPSkuByApproveStatusOk()
      if (exists && exists.length > 0) {
        this.$message.warning("运输方式:" + exists + "，已审核过，不能重新审核")
        return
      }

      // 获取已禁用
      exists = this.getPSkuByDelFlagFall()
      if (exists && exists.length > 0) {
        this.$message.warning("运输方式:" + exists + "，已禁用，不能审核")
        return
      }
      // this.auditDialog = true;
      this.auditType = "1"
      this.auditTextarea = ""

      //直接审核
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.transportModeId)
      })
      var _this = this
      var obj = {
        transportModeIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        }
      })
    },
    handleAuditSave() {
      if (this.auditType == "2" && !this.auditTextarea && this.auditTextarea.trim() == "") {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.transportModeId)
      })
      var _this = this
      var obj = {
        transportModeIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        }
      })
    },
    /**启用 禁用 */
    handleEnable(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.transportModeId)
        if (state == item.delFlag) {
          numberList.push(item.transportModeName)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("运输方式:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        transportModeIds: ids,
        stateModify: state
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          stateModify(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success(msg + "成功")
                _this.clearSelectClear()
                _this.refreshChange()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error(msg + "失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error(msg + "失败")
              return
            })
        }
      })
    },
    /**导出 */
    handleExport() {
      //  let par='';
      //     Object.keys(this.searchForm).forEach(key=>{
      //       if(this.searchForm[key]){
      //           par+='&'+key+'='+this.searchForm[key];
      //     }
      //   })

      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.transportModeId)
        })
        par += "&transportModeIds=" + keys.join(",")
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/baseSetup/bsetransportchannel/handleExport`) + par
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 4)
    }
  }
}
</script>

<style lang="scss">
#bsetransportchannel {
  .add_dialog .el-form-item__label {
    width: 124px;
  }
}
</style>
