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
  <div class="execution" id="bsecurrency">
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
          <el-button type="primary" v-if="permissions.baseSetup_bsecurrency_add" size="small" @click="handleAdd"
            >新 增</el-button
          >
          <!-- <el-button type="primary" v-if="permissions.baseSetup_bsecurrency_edit" size="small"
            @click="handleEdit">修改</el-button> -->

          <!-- 审核注释暂时掉2023-12-18 -->
          <!-- <el-button type="primary" v-if="permissions.baseSetup_bsecurrency_audit" @click="handleAudit"
            size="small">审核</el-button> -->
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsecurrency_enable"
            @click="handleEnable(0)"
            size="small"
            >启用</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsecurrency_prohibit"
            @click="handleEnable(1)"
            size="small"
            >禁用</el-button
          >
          <el-button type="primary" v-if="permissions.baseSetup_bsecurrency_export" @click="handleExport()" size="small"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="currency">
              <avue-crud-input
                v-model="searchForm.currency"
                size="small"
                placeholder="币种代码"
                v-search-input
              ></avue-crud-input>
            </el-form-item>

            <el-form-item prop="currencyName">
              <avue-crud-input
                v-model="searchForm.currencyName"
                size="small"
                placeholder="币种名称"
                v-search-input
              ></avue-crud-input>
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

        <!-- <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.currency)"></i>
        </template> -->
        <template slot-scope="{ row }" slot="exchangeRate">
          <el-button slot="reference" type="text" @click="getExchangeRate(row)">查看</el-button>
        </template>

        <template slot-scope="{ row }" slot="operationLog">
          <el-dropdown size="small" style="margin-right: 9px">
            <el-button type="primary" size="small"> 操作<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleEdit(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="showOperateLog(row.id)">查看日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </avue-crud>

      <!--新增/编辑-->
      <div>
        <!-- <el-dialog class="mydialog-add" :title="handleAddOrUpdateTile" :visible.sync="addOrUpdateDialog" width="660px" @close="formReset"> -->
        <el-dialog
          class="mydialog-add"
          :title="handleAddOrUpdateTile"
          :visible.sync="addOrUpdateDialog"
          width="660px"
          @closed="formReset"
        >
          <el-form ref="addOrUpdateForm" :model="addOrUpdateForm" :rules="addOrUpdateRules" status-icon>
            <el-form-item label="币种代码（原币）" prop="currency">
              <el-input
                v-model="addOrUpdateForm.currency"
                size="small"
                maxlength="5"
                @blur="inputBlur"
                v-search-input-trim
                :disabled="addOrUpdateDisabled"
                @keyup.native="toUpperCase"
              ></el-input>
            </el-form-item>

            <el-form-item label="币种名称（原币）" prop="currencyName">
              <el-input
                v-model="addOrUpdateForm.currencyName"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
                :disabled="addOrUpdateDisabled"
              ></el-input>
            </el-form-item>

            <el-form-item label="币种符号" prop="currencySymbol">
              <el-input
                v-model.trim="addOrUpdateForm.currencySymbol"
                size="small"
                maxlength="50"
                @blur="inputBlur"
                v-search-input-trim
                :disabled="addOrUpdateDisabled"
              ></el-input>
            </el-form-item>

            <el-form-item label="平均汇率" prop="averageExchangeRate">
              <el-input
                v-model="addOrUpdateForm.averageExchangeRate"
                size="small"
                @blur="inputBlur"
                v-search-input-trim
              ></el-input>
            </el-form-item>

            <!-- <el-form-item label="汇率" prop="exchangeRate">
              <el-input v-model="addOrUpdateForm.exchangeRate" size="small" @blur="inputBlur"
                v-search-input-trim></el-input>
            </el-form-item> -->
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
          <!-- <el-button type="primary" @click="handleAuditSave">确 定</el-button> -->
          <el-button type="info" size="small" @click="dialogResult(false, 'auditForm')">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true, 'auditForm')">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 汇率 -->
      <el-dialog title="汇率" :visible.sync="exchangeStatus" width="40%">
        <avue-crud ref="crud" :data="exchangeData" :option="exchangeOption">
          <template slot-scope="{ row }" slot="formatterEndDate">
            {{ row.formatterStartDate }} 至 {{ row.formatterEndDate }}
          </template>
        </avue-crud>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="exchangeStatus = false">取消</el-button>
        </div>
      </el-dialog>

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
  stateModify,
  handleAudit,
  getExchangeByCurrency
} from "@/api/baseSetup/bsecurrency/bsecurrency"
import { tableOption, addOrUpdateRules, exchangeOption } from "@/const/crud/baseSetup/bsecurrency/bsecurrency"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "bsecurrency",
  data() {
    return {
      exchangeStatus: false,
      exchangeData: [],
      exchangeOption: exchangeOption,
      //搜索条件，和前端控件绑定
      searchForm: {
        currency: "",
        delFlag: "",
        approveStatus: "",
        currencyName: ""
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
      selectRows: [],
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      //禁用下拉数据
      delFlagOptions: [
        { value: "0", label: "启用" },
        { value: "1", label: "禁用" }
      ],
      //新增修改相关
      handleAddOrUpdateTile: "",
      addOrUpdateDialog: false,
      addOrUpdateForm: {
        isAdd: true,
        currency: null,
        currencyName: null,
        exchangeRate: null,
        averageExchangeRate: null
      },
      addOrUpdateRules: addOrUpdateRules,
      addOrUpdateDisabled: false,
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null,
      exchangeRate: "正在加载..."
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
    getExchangeRate(row) {
      getExchangeByCurrency({ currency: row.currency, size: -1 }).then((res) => {
        if (res.data.code === 0) {
          console.log(res)
          this.exchangeData = res.data.data
          this.exchangeStatus = true
        }
      })
    },

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
      console.log(this.selectRows)
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
    filterCNY(rows) {
      var result = false
      if (rows && rows.length > 0) {
        rows.forEach((obj) => {
          if (obj.currency == "CNY") {
            result = true
          }
        })
      }
      return result
    },
    /** 打开新增窗口**/
    handleAdd() {
      this.handleAddOrUpdateTile = "新增"
      this.addOrUpdateDialog = true
      this.addOrUpdateForm.isAdd = true
      this.addOrUpdateDisabled = false
    },
    handleEdit(row) {
      // if (!this.selectRows || this.selectRows.length == 0) {
      //   this.$message.warning('请选择数据')
      //   return
      // }
      // if (this.selectRows.length != 1) {
      //   this.$message.warning('请选择一条数据进行修改')
      //   return
      // }
      console.log(row)
      if (this.filterCNY(row)) {
        this.$message.warning("本位币CNY，不能修改")
        return
      }
      this.addOrUpdateDisabled = true
      this.handleAddOrUpdateTile = "修改"
      this.addOrUpdateDialog = true
      // let row = this.selectRows[0]
      this.addOrUpdateForm = {
        isAdd: false,
        currency: row.currency,
        currencyName: row.currencyName,
        currencySymbol: row.currencySymbol,
        exchangeRate: row.exchangeRate,
        averageExchangeRate: row.averageExchangeRate
      }
    },
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          preventShake.preventShake((bool) => {
            if (bool) {
              if (this.addOrUpdateForm.isAdd) {
                //新增
                addObj(_this.addOrUpdateForm)
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
              } else {
                putObj(_this.addOrUpdateForm)
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
      //方法2
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          isAdd: true,
          currency: null,
          currencyName: null,
          exchangeRate: null,
          averageExchangeRate: null
        }
      })

      /*
      //方法1
      let timer=null;
      let _this_=this;
      _this_.$refs["addOrUpdateForm"].resetFields();
      // 处理blur执行在formReset之后
      timer=setTimeout(function(){
          _this_.$refs["addOrUpdateForm"].resetFields();
          timer=null;
      },500)
       */

      // this.addOrUpdateForm = {
      //   isAdd: true,
      //   currency: null,
      //   currencyName: null,
      //   exchangeRate: null,
      // }
    },
    getPSkuByApproveStatusOk() {
      let currency = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          currency.push(obj.currency)
          return obj
        }
      })
      return currency
    },
    getPSkuByDelFlagFall() {
      let currency = []
      var data = this.selectRows.filter((obj) => {
        if (obj.delFlag == 1) {
          currency.push(obj.currency)
          return obj
        }
      })
      return currency
    },
    /**审核 */
    handleAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //是否已审核
      let currency = this.getPSkuByApproveStatusOk()
      if (currency && currency.length > 0) {
        this.$message.warning("币别:" + currency + "，已审核过，不能重新审核")
        return
      }

      // 获取已禁用
      currency = this.getPSkuByDelFlagFall()
      if (currency && currency.length > 0) {
        this.$message.warning("币别:" + currency + "，已禁用，不能审核")
        return
      }

      // this.auditDialog = true;
      this.auditType = "1"
      this.auditTextarea = ""

      //直接保存
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.currency)
        // ids.push({id:obj.id,currency:obj.currency})
      })
      var _this = this
      var obj = {
        currency: ids.join(","),
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
        ids.push(obj.currency)
      })
      var _this = this
      var obj = {
        currency: ids.join(","),
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
        ids.push(item.currency)
        if (state == item.delFlag) {
          numberList.push(item.currency)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("币别:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      if (state === 1 && this.filterCNY(this.selectRows)) {
        this.$message.warning("本位币CNY，不能被禁用")
        return
      }

      const saveObj = {
        currency: ids.join(","),
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
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.currency)
        })
        par += "&selectCurrencyList=" + keys
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
      window.location = getUrlConcatToken(`/api/baseSetup/bsecurrency/handleExport`) + par
    },
    showOperateLog(id) {
      this.$refs.operationlog.showOperateLogDialog(id, "BseCurrency", true)
    },
    toUpperCase() {
      if (this.addOrUpdateForm.currency) {
        this.addOrUpdateForm.currency = this.addOrUpdateForm.currency.toUpperCase()
      }
    }
  }
}
</script>

<style lang="scss">
#bsecurrency {
  .el-textarea__inner {
    height: 90px;
  }

  .mydialog-add .el-form-item__label {
    width: 124px;
  }
}
</style>
