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
  - Author: wangbin (AukeyIT@aukeys.com) @on-load="getList"
  -->

<template>
  <div class="execution" id="customsElements-box">
    <basic-container>
      <avue-crud
        ref="crud"
        class="handle-cell-hidden"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @size-change="sizeChange"
        @search-change="handleFilter"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="selectionChange"
      >
        <template slot="search">
          <el-form-item>
            <avue-crud-input
              v-model="search.customsCode"
              placeholder="海关编码"
              size="small"
              clearable
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item>
            <avue-crud-input
              v-model="search.customsName"
              placeholder="海关名称"
              size="small"
              clearable
              @keyup.enter.native="handleFilter"
              onlyTrim
            />
          </el-form-item>
        </template>

        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleAdd"
            size="small"
            v-if="permissions.customsElements_prdcustomselements_add"
            >新 增</el-button
          >
          <el-button
            type="primary"
            @click="handleEdit"
            size="small"
            v-if="permissions.customsElements_prdcustomselements_edit"
            >编 辑</el-button
          >
          <el-button
            @click="handleStateModify(0)"
            size="small"
            type="primary"
            v-if="permissions.prdcustomselements_enable"
            >启用</el-button
          >
          <el-button
            @click="handleStateModify(1)"
            size="small"
            type="primary"
            v-if="permissions.prdcustomselements_prohibit"
            >禁用</el-button
          >
        </template>

        <template slot="delFlag" slot-scope="scope">
          <!-- <div v-if="scope.row.delFlag === '0'" style="overflow:hidden;width:100%;"><el-tag type="primary">启用</el-tag></div> -->
          <el-tag type="primary" v-if="scope.row.delFlag === '0'">启用</el-tag>
          <el-tag type="primary" v-else>禁用</el-tag>
        </template>

        <template slot="showSkuView" slot-scope="scope">
          <!-- <el-button type="text" size="mini" class="button-css"  @click="showSku(scope.row.customsElementId)">查看</el-button> -->
          <i class="icon-chakan y-reviews" @click="showSku(scope.row.customsElementId)"></i>
        </template>

        <template slot="operateLog" slot-scope="scope">
          <!-- <el-button type="text" size="mini" class="button-css" @click="showOperateLog(scope.row.customsElementId)">查看</el-button> -->
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.customsElementId)"></i>
        </template>
      </avue-crud>

      <!--新增/编辑海关要素-->
      <div>
        <el-dialog
          :title="addOrUpdateCustomsTitle"
          :visible.sync="addOrUpdateCustomsDialog"
          width="660px"
          @close="clearData"
          center
        >
          <el-form
            ref="addOrUpdateCustomsForm"
            :model="addOrUpdateCustomsForm"
            :label-position="labelPosition"
            :rules="customsRules"
            size="small"
            status-icon
          >
            <el-form-item label="海关编码:" prop="customsCode">
              <avue-crud-input
                v-model.trim="addOrUpdateCustomsForm.customsCode"
                size="small"
                :maxlength="12"
                :disabled="codeUseDisabled"
                onlyTrim
              ></avue-crud-input>
            </el-form-item>

            <el-form-item label="海关名称:" prop="customsName">
              <avue-crud-input
                v-model.trim="addOrUpdateCustomsForm.customsName"
                size="small"
                onlyTrim
              ></avue-crud-input>
            </el-form-item>

            <el-form-item label="海关名称（英文）:" prop="customsNameEn">
              <avue-crud-input
                v-model.trim="addOrUpdateCustomsForm.customsNameEn"
                size="small"
                onlyTrim
              ></avue-crud-input>
            </el-form-item>

            <el-form-item label="法定退税率:" prop="legalRefundRate">
              <avue-crud-input
                v-model.trim="addOrUpdateCustomsForm.legalRefundRate"
                size="small"
                :maxlength="2"
                onlyTrim
              >
                <template slot="append">%</template>
              </avue-crud-input>
            </el-form-item>

            <el-form-item label="海关法定单位:" prop="customsLegalUnit">
              <avue-crud-input
                v-model.trim="addOrUpdateCustomsForm.customsLegalUnit"
                size="small"
                :maxlength="20"
                onlyTrim
              ></avue-crud-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="addOrUpdateCustomsDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitForm('addOrUpdateCustomsForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 引入子组件-sku信息 -->
      <ShowSkuInfo ref="showSkuInfo"></ShowSkuInfo>
      <!-- 操作日志 -->
      <prdoperatelog ref="prdoperatelog"></prdoperatelog>
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
  checkCustomsUse,
  stateModify
} from "@/api/product/customsElements/prdcustomselements"
import { tableOption } from "@/const/crud/product/customsElements/prdcustomselements"
import ShowSkuInfo from "./ShowSkuInfo"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "../../../components/avue/utils/util"
export default {
  name: "prdcustomselements",
  components: {
    ShowSkuInfo,
    prdoperatelog
  },
  data() {
    //验证规则
    var validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]+$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入整数"))
      }
    }
    var validateRate = (rule, value, callback) => {
      // var reg = /^[0-9]+\.?[0-9]*$/;
      var reg = /^[0-9]+$/
      if (reg.test(value)) {
        if (0 <= value && value <= 16) {
          callback()
        } else {
          callback(new Error(""))
        }
      }

      // return {
      //   tableData: [],
      //   page: {
      //     total: 0, // 总页数
      //     currentPage: 1, // 当前页数
      //     pageSize: 20 // 每页显示多少条
      //   },
      //   search:{
      //     customsCode:'',
      //     customsName:''
      //   },
      //   customsRules:{
      //     customsCode:[
      //           {required: true, message:'海关编码不能为空' , trigger: 'blur'},
      //           {validator: validateNumber, message:'海关编码只能为数字', trigger: 'blur' }
      //     ],
      //     customsName:[
      //       {required: true, message:'海关名称不能为空' , trigger: 'blur'},
      //       { min: 1, max: 100, message: '海关名称长度在1到100个字符', trigger: 'blur' }
      //     ],
      //     customsNameEn:[
      //       {required: true, message:'海关名称(英文)不能为空' , trigger: 'blur'},
      //       { min: 1, max: 200, message: '海关名称(英文)长度在1到200个字符', trigger: 'blur' }
      //     ],
      //     legalRefundRate:[
      //       {required: true, message:'法定退税率不能为空' , trigger: 'blur'},
      //       {validator: validateRate, message:"只能输入0~16的数", trigger: 'blur' }
      //     ],
      //     customsLegalUnit:[
      //       {required: true, message:'海关法定单位不能为空' , trigger: 'blur'}
      //     ]
      //   },
      //   labelPosition:"right",
      //   tableOption: tableOption,
      //   isAdd:true,
      //   addOrUpdateCustomsDialog:false,
      //   addOrUpdateCustomsTitle:'',
      //   addOrUpdateCustomsForm:{ },
      //   selectRows:[],
      // }
    }

    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      search: {
        customsCode: "",
        customsName: ""
      },
      customsRules: {
        customsCode: [
          { required: true, message: "海关编码不能为空", trigger: "blur" },
          {
            validator: validateNumber,
            message: "海关编码只能为数字",
            trigger: "blur"
          }
        ],
        customsName: [
          { required: true, message: "海关名称不能为空", trigger: "blur" },
          { min: 1, max: 100, message: "海关名称长度在1到100个字符", trigger: "blur" }
        ],
        customsNameEn: [
          {
            required: true,
            message: "海关名称(英文)不能为空",
            trigger: "blur"
          },
          { min: 1, max: 200, message: "海关名称(英文)长度在1到200个字符", trigger: "blur" },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: "不允许输入中文", trigger: "blur" }
        ],
        legalRefundRate: [
          { required: true, message: "法定退税率不能为空", trigger: "blur" },
          {
            validator: validateRate,
            message: "只能输入0~16的数",
            trigger: "blur"
          }
        ],
        customsLegalUnit: [{ required: true, message: "海关法定单位不能为空", trigger: "blur" }]
      },
      labelPosition: "right",
      tableOption: tableOption,
      isAdd: true,
      addOrUpdateCustomsDialog: false,
      addOrUpdateCustomsTitle: "",
      addOrUpdateCustomsForm: {},
      selectRows: [],
      codeUseDisabled: false,
      searchQ: {}
    }
  },
  created() {},
  mounted: function () {
    // this.getList(this.page);
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    searchReset() {
      this.search = {}
    },
    handleFilter(param) {
      this.page.currentPage = 1
      this.clearSelectClear()
      this.searchQ = deepCloneIgnoreNull(this.search)
      this.getList(this.page, param)
    },
    getList(page, params) {
      //拼接上自定义搜索条件
      //params = Object.assign(params || {}, this.searchQ);
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchQ
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
      this.addOrUpdateCustomsForm = {
        customsCode: "",
        customsName: "",
        customsNameEn: "",
        legalRefundRate: "",
        customsLegalUnit: ""
      }
      this.isAdd = true
      this.addOrUpdateCustomsTitle = "新增海关要素"
      this.addOrUpdateCustomsDialog = true
      //this.$refs.crud.rowAdd()
    },
    handleEdit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectRows.length != 1) {
        this.$message.warning("只能勾选一条数据")
        return
      }
      var numberList = []
      this.selectRows.forEach((item) => {
        if ("1" == item.delFlag) {
          numberList.push(item.customsCode)
        }
      })
      if (numberList.length > 0) {
        this.$message.warning("该单据已禁用，不能编辑")
        return
      }

      var row = this.selectRows[0]
      this.addOrUpdateCustomsForm = {
        customsElementId: row.customsElementId,
        customsCode: row.customsCode,
        customsName: row.customsName,
        customsNameEn: row.customsNameEn,
        legalRefundRate: row.legalRefundRate,
        customsLegalUnit: row.customsLegalUnit
      }
      //判断该海关要素是否被关联
      checkCustomsUse(row.customsElementId).then((res) => {
        if (res.data.code === 0) {
          this.codeUseDisabled = res.data.data
        }
      })
      this.isAdd = false
      this.addOrUpdateCustomsTitle = "编辑海关要素"
      this.addOrUpdateCustomsDialog = true
    },
    /**启用 禁用 */
    handleStateModify(state) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }

      var ids = []
      var numberList = []
      this.selectRows.forEach((item) => {
        ids.push(item.customsElementId)
        if (state == item.delFlag) {
          numberList.push(item.customsCode)
        }
      })
      const msg = state === 0 ? "启用" : "禁用"
      if (numberList.length > 0) {
        this.$message.warning("海关编号:" + numberList + "已" + msg + ",无须重复" + msg)
        return
      }

      const saveObj = {
        customsElementIds: ids.join(","),
        stateModify: state
      }
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          stateModify(saveObj)
            .then((response) => {
              if (response.data.code == 0) {
                this.$message.success(msg + "成功")
                this.clearSelectClear()
                this.getList(this.page, this.search)
              } else if (response.data.code == 1) {
                this.$message.warning(response.data.msg)
                this.getList(this.page, this.search)
                return
              } else {
                this.$message.error(msg + "失败")
                return
              }
            })
            .catch(() => {
              this.$message.error(msg + "失败")
              return
            })
        }
      })
    },
    handleDel() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      var ids = ""
      this.selectRows.forEach((item) => {
        ids += item.customsElementId + ","
      })
      //去掉最后一个逗号(如果不需要去掉，就不用写)
      if (ids.length > 0) {
        ids = ids.substr(0, ids.length - 1)
      }
      var _this = this
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(ids)
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            })
            this.clearSelectClear()
            this.getList(this.page, this.search)
          } else if (data.data.code === 1) {
            _this.$message.error(data.data.msg)
          } else {
            _this.$message.error("删除失败")
          }
        })
        .catch(function (err) {
          _this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.customsElementId)
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
     * 表单提交验证
     */
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.handleSave(this.addOrUpdateCustomsForm, null)
          } else {
            this.handleUpdate(this.addOrUpdateCustomsForm, null, null)
          }
        }
      })
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row)
        .then((response) => {
          if (response.data.code == 0) {
            this.addOrUpdateCustomsDialog = false
            this.getList(this.page, this.search)
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            })
            this.clearSelectClear()
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("修改失败")
            return
          }
        })
        .catch(() => {
          this.$message.error("修改失败")
          return
        })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    //   handleSave: function(row, done) {
    //     addObj(row).then(response => {
    //         if(response.data.code==0){
    //           this.addOrUpdateCustomsDialog = false;
    //           this.getList(this.page, this.search);
    //           this.$message({
    //             showClose: true,
    //             message: '新增成功',
    //             type: 'success'
    //           });
    //           this.clearSelectClear();
    //         }else if(response.data.code==1){
    //           this.$message.error(response.data.msg);
    //           return;
    //         }
    //   });
    // },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      preventShake.preventShake((bool) => {
        if (bool) {
          addObj(row)
            .then((response) => {
              if (response.data.code == 0) {
                this.addOrUpdateCustomsDialog = false
                this.getList(this.page, this.search)
                this.clearSelectClear()
                this.$message.success("新增成功")
              } else if (response.data.code == 1) {
                this.$message.error(response.data.msg)
                return
              } else {
                this.$message.error("新增失败")
                return
              }
            })
            .catch(() => {
              this.$message.error("新增失败")
              return
            })
        }
      })
    },

    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearData() {
      this.addOrUpdateCustomsForm = {}
      this.$refs["addOrUpdateCustomsForm"].resetFields()
      this.codeUseDisabled = false
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    //查看关联的sku信息
    showSku(id) {
      this.$refs.showSkuInfo.findRelationSkuView(id)
    },
    //查看操作日志
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id, 12)
    }
  }
}
</script>

<style lang="scss">
#customsElements-box {
  .el-dialog__body {
    .el-form-item__label {
      min-width: 130px;
    }
  }
}
</style>
