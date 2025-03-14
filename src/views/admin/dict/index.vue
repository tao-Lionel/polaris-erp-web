<template>
  <div class="execution admin-dict">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @row-del="rowDel"
        @search-reset="searchReset"
      >
        <template slot-scope="scope" slot="operation">
          <a v-if="permissions.sys_dict_edit" @click="handleEdit(scope.row, scope.index)" style="margin-right: 10px">
            编辑
          </a>
          <a v-if="permissions.sys_dict_copy" @click="handleCopy(scope.row, scope.index)" style="margin-right: 10px">
            复制
          </a>
          <a v-if="permissions.sys_dict_del" @click="handleDel(scope.row, scope.index)">删除 </a>
        </template>

        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="type">
              <el-input v-model="searchForm.type" placeholder="类型" clearable v-search-input size="small"></el-input>
            </el-form-item>
            <el-form-item prop="value">
              <el-input
                v-model="searchForm.value"
                placeholder="数据值"
                clearable
                v-search-input
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="label">
              <el-input v-model="searchForm.label" placeholder="标签" clearable v-search-input size="small"></el-input>
            </el-form-item>
            <el-form-item prop="description">
              <el-input
                v-model="searchForm.description"
                placeholder="描述"
                clearable
                v-search-input
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="log" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="handleLog(scope.row)"></i>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 日志 -->
    <operationlog ref="operationlog"></operationlog>
  </div>
</template>

<script>
import { delObj, fetchList, saveOrUpdate } from "@/api/admin/dict"
import { tableOption } from "@/const/crud/admin/dict"
import { mapGetters } from "vuex"
import operationlog from "@/views/baseSetup/bseoperatelog/index"

export default {
  name: "dict",
  components: {
    operationlog
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      searchForm: {
        type: undefined,
        value: undefined,
        label: undefined,
        description: undefined
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList(page, params) {
      //this.tableLoading = true
      fetchList({
        page: page.currentPage,
        pageSize: page.pageSize,
        ...this.searchForm
      }).then((response) => {
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
      this.$confirm('是否确认删除标签名为"' + row.label + '",数据类型为"' + row.type + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row)
        })
        .then(() => {
          this.getList(this.page)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
        })
        .catch(function () {})
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      saveOrUpdate(row).then(() => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        })
        this.getList(this.page)
        done()
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      saveOrUpdate(row).then((data) => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        this.getList(this.page)
        done()
      })
    },
    searchChange(form) {
      this.getList(this.page, form)
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
    },
    handleCopy(row) {
      const { type, description } = row
      this.$refs.crud.rowAdd({ type, description })
    },
    handleLog(row) {
      this.$refs.operationlog.showOperateLogDialog(row.id, "SysDict", true)
    }
  }
}
</script>
