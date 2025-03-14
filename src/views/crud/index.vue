<!--
  -    Copyright (c) 2018-2025, aukeyit All rights reserved.
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
  - Author: aukeyit (aukeyit@aukeyit.com)
  -->

<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :data="tableData"
        :option="tableOption"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="handleDel"
      >
        <template slot-scope="props" slot="expand">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <a :href="props.row.address" target="_blank">{{ props.row.address }}</a>
            </el-form-item>
            <el-form-item label="项目地址">
              <a :href="props.row.git" target="_blank">{{ props.row.git }}</a>
            </el-form-item>
            <el-form-item label="stars">
              <a :href="props.row.address" target="_blank">
                <img :src="props.row.stars" alt="star" />
              </a>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="username">
          <el-tag>{{ scope.row.username }}</el-tag>
        </template>
        <template slot-scope="scope" slot="stars">
          <a :href="scope.row.git" target="_blank">
            <img :src="scope.row.stars" alt="star" />
          </a>
        </template>
        <template slot-scope="scope" slot="address">
          <a :href="scope.row.git" target="_blank">{{ scope.row.address }}</a>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/option"
import { tableData } from "@/const/crud/data"

export default {
  name: "crud",
  data() {
    return {
      tableData: tableData,
      tableOption: tableOption
    }
  },
  mounted: function () {},
  methods: {
    handleDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除序号为" + row.username, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
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
      this.tableData.splice(index, 1, Object.assign({}, row))
      this.$message({
        showClose: true,
        message: "修改成功",
        type: "success"
      })
      done()
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      this.tableData.push(Object.assign({}, row))
      this.$message({
        showClose: true,
        message: "添加成功",
        type: "success"
      })
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
