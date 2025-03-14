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
  <div class="execution" id="posuppliercontactsBox">
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
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="openDialog" v-if="permissions.posupplier_contact_save" size="small"
            >新 增</el-button
          >
        </template>
        <template slot-scope="scope" slot="operate">
          <!--  <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     v-if="permissions.posupplier_contact_edit"
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button>
          <el-button type="text"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     v-if="permissions.posupplier_contact_delete"
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
          <el-button type="text"
                     icon="el-icon-view"
                     size="small"
                     plain
                     v-if="permissions.posupplier_contact_log"
                     @click="showOperateLog(scope.row,scope.index)">查看日志</el-button> -->

          <i
            class="icon-bianji y-icon-edit"
            v-if="permissions.posupplier_contact_edit"
            @click="handleEdit(scope.row, scope.index)"
          ></i>
          <i
            class="icon-shanchu y-icon-delect"
            v-if="permissions.posupplier_contact_delete"
            @click="handleDel(scope.row, scope.index)"
          ></i>
          <i
            class="icon-chakan y-reviews"
            v-if="permissions.posupplier_contact_log"
            @click="showOperateLog(scope.row, scope.index)"
          ></i>
        </template>
        <template slot-scope="scope" slot="search">
          <!-- <el-form :model="searchForm" :inline="true" ref="searchForm" style="float:left">
            <el-form-item prop="value1">
              <el-input v-model="searchForm.value1" size="small" placeholder="此为预留，可删除"></el-input>
            </el-form-item>
          </el-form> -->
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="value2">
              <el-input v-model="searchForm.value2" size="small" placeholder="此为预留，可删除"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>

      <el-dialog :visible.sync="dialogFormVisible" center width="30%" v-bind:title="dialogTitle">
        <el-form :model="operateForm" ref="operateForm" status-icon :label-position="labelPosition">
          <el-form-item
            label="联系人"
            prop="contactName"
            :rules="{ required: true, message: '必填字段', trigger: 'blur' }"
          >
            <el-input v-model.trim="operateForm.contactName" size="small" clearable maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model.trim="operateForm.title" size="small" clearable maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="cellPhone">
            <el-input v-model.trim="operateForm.cellPhone" size="small" clearable maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model.trim="operateForm.phone" size="small" clearable maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="传真">
            <el-input v-model.trim="operateForm.faxNo" size="small" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件">
            <el-input v-model.trim="operateForm.email" size="small" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="operateForm.remarks" size="small" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="operateData()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/supplier/posuppliercontacts"
import { tableOption } from "@/const/crud/supplier/posuppliercontacts"
import pooperatelog from "@/views/supplier/log/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  components: {
    pooperatelog
  },
  name: "posuppliercontacts",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        value1: "",
        value2: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      operateForm: {
        supplierContactId: "",
        supplierNo: this.$route.query.paramSupplierNo,
        contactName: "",
        title: "",
        cellPhone: "",
        phone: "",
        faxNo: "",
        email: "",
        remarks: "",
        createBy: ""
      },

      tableOption: tableOption,
      paramSupplierNo: this.$route.query.paramSupplierNo,
      tempSupplierNo: "",
      dialogFormVisible: false,
      labelPosition: "right",
      dialogTitle: "联系人",
      dialogType: 0
    }
  },
  props: {
    gycode: [String, Number]
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
      var supplierNo = this.paramSupplierNo
      // debugger;
      var check = false
      if (typeof this.paramSupplierNo != "undefined" && this.paramSupplierNo != "") {
        check = true
      }
      if (typeof this.gycode != "undefined" && this.gycode != "") {
        check = true
      }
      if (!check) {
        this.$message.error("请先在基础信息页面创建!")
        return
      }
      if (typeof this.paramSupplierNo == "undefined" || this.paramSupplierNo == "") {
        //新保存的数据
        supplierNo = this.gycode
      }

      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
            supplierNo: supplierNo
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
      this.tempSupplierNo = ""

      if (typeof this.paramSupplierNo != "undefined" && this.paramSupplierNo != "") {
        this.tempSupplierNo = this.paramSupplierNo
      }

      if (typeof this.gycode != "undefined" && this.gycode != "") {
        this.tempSupplierNo = this.gycode
      }

      if (this.tempSupplierNo == "") {
        this.$message.error("请先在基础信息页面创建!")
        return
      }

      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      //清空数据
      this.clearForm()
      this.dialogTitle = "编辑联系人"
      this.dialogType = 1

      //避免双向绑定
      var tempsupplierContactId = row.supplierContactId
      var tempsupplierNo = row.supplierNo
      var tempcontactName = row.contactName
      var temptitle = row.title
      var tempcellPhone = row.cellPhone
      var tempphone = row.phone
      var tempfaxNo = row.faxNo
      var tempemail = row.email
      var tempremarks = row.remarks

      this.operateForm.supplierContactId = tempsupplierContactId
      this.operateForm.supplierNo = tempsupplierNo
      this.operateForm.contactName = tempcontactName
      this.operateForm.title = temptitle
      this.operateForm.cellPhone = tempcellPhone
      this.operateForm.phone = tempphone
      this.operateForm.faxNo = tempfaxNo
      this.operateForm.email = tempemail
      this.operateForm.remarks = tempremarks

      this.dialogFormVisible = true
      //this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除联系人为【" + row.contactName + "】", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.supplierContactId)
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
      row.supplierNo = this.tempSupplierNo
      addObj(row).then((data) => {
        this.tableData.push(Object.assign({}, row))

        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        this.paramSupplierNo = tempNo
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
    showOperateLog(row, index) {
      this.$refs.pooperatelog.showOperateLogDialog(row.supplierContactId, 6)
    },
    //新增数据
    operateData() {
      var check = true
      this.$refs["operateForm"].validate((valid) => {
        check = valid
      })
      if (!check) {
        return
      }

      var checkPhone = this.operateForm.cellPhone
      //debugger;
      if (checkPhone != "") {
        var reg = /^[\d]+$/
        if (!reg.test(checkPhone) || checkPhone.length != 11) {
          this.$message.error("手机号只能为11位数字!")
          return
        }
      }

      if (this.isNulls(this.operateForm.contactName)) {
        this.$message.error("联系人不能为空!")
        return
      }

      if (this.dialogType === 1) {
        putObj(this.operateForm)
          .then((response) => {
            if (response.data.code == 0) {
              this.$message.success("编辑成功!")
              //关闭模态框
              this.dialogFormVisible = false
              this.getList(this.page)
            } else {
              this.$message.error(response.data.msg)
            }
          })
          .finally(() => {})
      } else {
        if (typeof this.paramSupplierNo != "undefined" && this.paramSupplierNo != "") {
          this.tempSupplierNo = this.paramSupplierNo
        }

        if (typeof this.gycode != "undefined" && this.gycode != "") {
          this.tempSupplierNo = this.gycode
        }

        if (this.tempSupplierNo == "") {
          this.$message.error("请先在基础信息页面创建!")
          return
        }
        this.operateForm.supplierNo = this.tempSupplierNo

        addObj(this.operateForm)
          .then((response) => {
            if (response.data.code == 0) {
              this.$message.success("新增成功!")
              //关闭模态框
              this.dialogFormVisible = false
              this.getList(this.page)
            } else {
              this.$message.error(response.data.msg)
            }
          })
          .finally(() => {})
      }
    },
    openDialog() {
      //清空数据
      this.clearForm()
      this.dialogTitle = "新增联系人"
      this.dialogType = 0
      this.dialogFormVisible = true
    },
    clearForm() {
      this.operateForm.supplierContactId = ""
      this.operateForm.supplierNo = ""
      this.operateForm.contactName = ""
      this.operateForm.title = ""
      this.operateForm.cellPhone = ""
      this.operateForm.phone = ""
      this.operateForm.faxNo = ""
      this.operateForm.email = ""
      this.operateForm.remarks = ""
      this.operateForm.createBy = ""
    },

    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
#posuppliercontactsBox {
  .el-form-item__label {
    min-width: 65px;
  }
  .avue-crud__menu {
    display: none;
  }
}
</style>
