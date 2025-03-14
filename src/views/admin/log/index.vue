<template>
  <div class="log">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @row-del="rowDel"
      >
        <template slot="search">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable size="small">
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </template>

        <template slot-scope="scope" slot="operate">
          <el-button type="text" v-if="permissions.sys_log_del" size="mini" @click="handleDel(scope.row, scope.index)">
            删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from "@/api/admin/log"
import { tableOption } from "@/const/crud/admin/log"
import { mapGetters } from "vuex"

import { deepCloneIgnoreNull, deepClone } from "../../../components/avue/utils/util"

export default {
  name: "log",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        type: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {},
  methods: {
    handleCommand(command) {
      alert(command)
    },
    getList(page, params) {
      //this.tableLoading = true;
      this.page.currentPage = page.currentPage
      //此处要拼接上外部的参数，此处使用已确认的条件
      //params = Object.assign(params || {}, this.searchFormConfirm);
      // this.$message.success(
      //   "搜索数据" +
      //     JSON.stringify(
      //       Object.assign(
      //         {
      //           descs: "create_time",
      //           current: page.currentPage,
      //           size: page.pageSize
      //         },
      //         params,
      //         this.searchFormConfirm
      //       )
      //     )
      // );
      fetchList(
        Object.assign(
          {
            descs: "create_time",
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
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为"' + row.id + '"的日志?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.id)
        })
        .then((data) => {
          this.getList(this.page)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
        })
        .catch(function (err) {})
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
      //将搜索的条件放入到确认的搜索条件中
      //搜索清空也不重置搜索条件this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm);
      this.searchForm.type = ""
    },
    /**
     * 刷新回调
     */
    refreshChange(params) {
      this.getList(this.page, params)
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
