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
  <div class="execution">
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
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.bsecustomsclearancerate_add"
            >新 增</el-button
          >
          <el-button type="primary" @click="handleExport" size="small" v-if="permissions.bsecustomsclearancerate_export"
            >导出</el-button
          >
          <el-button type="primary" @click="handleEdit" size="small" v-if="permissions.bsecustomsclearancerate_edit"
            >修改</el-button
          >
          <el-button type="primary" @click="handleAudit" size="small" v-if="permissions.bsecustomsclearancerate_audit"
            >审核</el-button
          >
          <el-button type="primary" @click="handleDel" size="small" v-if="permissions.bsecustomsclearancerate_del"
            >删除</el-button
          >
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="transportModeName"
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.transportModeName"
                size="small"
                placeholder="运输方式"
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
          </el-form>
        </template>

        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.bseCustomsClearanceRateId)"></i>
        </template>
      </avue-crud>

      <!--新增-->
      <div>
        <el-dialog class="add_dialog" title="新增" :visible.sync="addDialog" width="400px" @close="formReset" center>
          <el-form ref="addForm" :model="addForm" :rules="addRules" size="small" status-icon>
            <el-form-item label="运输方式:" prop="transportModeId">
              <el-select clearable filterable size="mini" placeholder="请选择" v-model="addForm.transportModeId">
                <el-option
                  v-for="item in transportModeList"
                  :key="item.transportModeId"
                  :label="item.transportModeName"
                  :value="item.transportModeId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="国家:" prop="countryId">
              <el-select clearable filterable size="mini" placeholder="请选择" v-model="addForm.countryId">
                <el-option
                  v-for="item in countryList"
                  :key="item.countryId"
                  :label="item.countryShortName"
                  :value="item.countryId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="清关率:" prop="customsClearanceRate">
              <el-input v-model="addForm.customsClearanceRate" size="small" maxlength="7">
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitAddForm('addForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!--修改-->
      <div>
        <el-dialog
          class="edit_dialog"
          title="修改"
          :visible.sync="editDialog"
          width="400px"
          @close="editFormReset"
          center
        >
          <el-form ref="editForm" :model="editForm" :rules="editRules" size="small" status-icon>
            <el-form-item label="运输方式:">
              <span>{{ editForm.transportModeName }}</span>
            </el-form-item>

            <el-form-item label="国家:">
              <span>{{ editForm.countryCode }}</span>
            </el-form-item>

            <el-form-item label="清关率:" prop="customsClearanceRate">
              <el-input v-model="editForm.customsClearanceRate" size="small" maxlength="7">
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="editDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitEditForm('editForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  handleAudit,
  removeBatch
} from "@/api/baseSetup/bsecustomsclearancerate"
import { getCountryAll } from "@/api/baseSetup/bsecountry"
import { getAll as getTransportModesAll } from "@/api/baseSetup/bsetransportmodes"
import { tableOption, addRules, editRules } from "@/const/crud/baseSetup/bsecustomsclearancerate"
import { mapGetters } from "vuex"
import { getUrlConcatToken } from "@/util/auth"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"

export default {
  name: "bsecustomsclearancerate",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        transportModeName: "",
        approveStatus: ""
      },
      addForm: {
        transportModeId: null,
        countryId: null,
        customsClearanceRate: ""
      },
      editForm: {
        bseCustomsClearanceRateId: null,
        transportModeName: "",
        countryCode: "",
        customsClearanceRate: ""
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
      tableLoading: false,
      tableOption: tableOption,
      addDialog: false,
      editDialog: false,
      transportModeList: [],
      countryList: [],
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      addRules: addRules,
      editRules: editRules
    }
  },
  components: {
    operationlog
  },
  created() {
    getCountryAll().then((response) => {
      if (response.data.code == 0) {
        this.countryList = response.data.data
      }
    })
    getTransportModesAll().then((response) => {
      if (response.data.code == 0) {
        this.transportModeList = response.data.data
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 查看日志
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, 9)
    },
    getList(page = {}, params) {
      this.tableLoading = true
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
        this.tableLoading = false
      })
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.addDialog = true
    },
    formReset() {
      this.$nextTick(function () {
        this.$refs["addForm"].resetFields()
        this.addForm = {
          transportModeId: null,
          countryId: null,
          customsClearanceRate: ""
        }
      })
    },
    submitAddForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              addObj(_this.addForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success("新增成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.addDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  console.log("gag")
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.bseCustomsClearanceRateId)
        })
        par += "&bseCustomsClearanceRateIds=" + keys.join(",")
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
      window.location = getUrlConcatToken(`/api/baseSetup/bsecustomsclearancerate/handleExport`) + par
    },
    handleEdit(row, index) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("只能选择一条数据")
        return
      }
      var selectRow = this.selectRows[0]
      ;(this.editForm = {
        bseCustomsClearanceRateId: selectRow.bseCustomsClearanceRateId,
        transportModeName: selectRow.transportModeName,
        countryCode: selectRow.countryCode,
        customsClearanceRate: selectRow.customsClearanceRate
      }),
        (this.editDialog = true)
    },
    editFormReset() {
      this.$nextTick(function () {
        this.$refs["editForm"].resetFields()
        this.editForm = {
          bseCustomsClearanceRateId: null,
          transportModeName: "",
          countryCode: "",
          customsClearanceRate: ""
        }
      })
    },
    submitEditForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              putObj(_this.editForm)
                .then((response) => {
                  if (response.data.code == 0) {
                    _this.$message.success("修改成功")
                    _this.clearSelectClear()
                    _this.refreshChange()
                    _this.editDialog = false
                  } else if (response.data.code == 1) {
                    _this.$message.warning(response.data.msg)
                    return
                  } else {
                    _this.$message.error("操作失败")
                    return
                  }
                })
                .catch(() => {
                  console.log("gag")
                  _this.$message.error("操作失败")
                  return
                })
            }
          })
        }
      })
    },
    handleDel(row, index) {
      //状态是否为未审核
      let ids = []
      for (let i = 0; i < this.selectRows.length; i++) {
        var selectRow = this.selectRows[i]
        var approveStatus = selectRow.approveStatus
        if (approveStatus != 1) {
          this.$message.error("选择的数据存在不是未审核的，请检查")
          return
        }
        ids.push(selectRow.bseCustomsClearanceRateId)
      }
      var _this = this
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeBatch(ids)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("删除成功")
                _this.clearSelectClear()
                _this.refreshChange()
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
        })
        .catch(() => {})
    },
    rowDel: function (row, index) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }

      this.$confirm("是否确认删除ID为" + row.bseCustomsClearanceRateId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.bseCustomsClearanceRateId)
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
    /**审核 */
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //状态是否为未审核
      let ids = []
      for (let i = 0; i < this.selectRows.length; i++) {
        var selectRow = this.selectRows[i]
        var approveStatus = selectRow.approveStatus
        if (approveStatus != 1) {
          this.$message.error("选择的数据存在不是未审核的，请检查")
          return
        }
        ids.push(selectRow.bseCustomsClearanceRateId)
      }
      //审核
      var _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(ids)
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
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    }
  }
}
</script>

<style lang="scss" scoped>
.add_dialog,
.edit_dialog {
  ::v-deep {
    .el-form-item__label {
      width: 100px;
    }
  }
}
</style>
