<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -+- 
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
    <!-- <basic-container> -->
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @on-load="getList"
      @refresh-change="refreshChange"
      @search-change="handleFilter"
      @row-update="handleUpdate"
      @row-save="handleSave"
      @row-del="rowDel"
    >
      <template slot="menuLeft">
        <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.product_prdskumodel_add"
          >新 增</el-button
        >
      </template>
      <template slot-scope="scope" slot="modelSolt">
        <!-- <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     v-if="permissions.product_prdskumodel_edit"
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button> 
          <el-button type="text"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     v-if="permissions.product_prdskumodel_del"
                     @click="handleDel(scope.row,scope.index)">删除</el-button>  -->

        <i
          class="icon-bianji y-icon-edit"
          v-if="permissions.product_prdskumodel_edit"
          @click="handleEdit(scope.row, scope.index)"
        ></i>
        <i
          class="icon-shanchu y-icon-delect"
          v-if="permissions.product_prdskumodel_del"
          @click="handleDel(scope.row, scope.index)"
        ></i>
      </template>
      <!-- 操作日志 -->
      <template slot="operateLog" slot-scope="scope">
        <!-- <el-button type="text" size="mini" class="button-css" @click="showOperateLog(scope.row.modelId)">查看</el-button>   -->
        <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.modelId)"></i>
      </template>
    </avue-crud>

    <!-- 操作日志 -->
    <prdoperatelog ref="prdoperatelog"></prdoperatelog>

    <!-- </basic-container> -->
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/product/prdskumodel"
import { tableOption } from "@/const/crud/product/prdskumodel"
import prdoperatelog from "@/views/product/prdoperatelog/index"
import { mapGetters } from "vuex"
export default {
  name: "prdskumodel",
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
      tableOption: tableOption
    }
  },
  created() {},
  mounted: function () {},
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
          params
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
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this

      this.$confirm("是否确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.modelId)
        })
        .then((data) => {
          if (data.data.code === 0) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            })
            _this.tableData.splice(index, 1)
            this.getList(this.page)
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
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            })
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("修改失败")
            return
          }

          this.tableData.splice(index, 1, Object.assign({}, row))
          done()
          this.getList(this.page)
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
    handleSave: function (row, done) {
      addObj(row)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              message: "新增成功",
              type: "success"
            })
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("新增失败")
            return
          }

          this.tableData.push(Object.assign({}, row))
          done()
          this.getList(this.page)
        })
        .catch(() => {
          this.$message.error("新增失败")
          return
        })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 查询
     */
    handleFilter(param) {
      this.getList(this.page, param)
    },
    //查看操作日志
    showOperateLog(id) {
      this.$refs.prdoperatelog.showOperateLogDialog(id, 5)
    }
  }
}
</script>
