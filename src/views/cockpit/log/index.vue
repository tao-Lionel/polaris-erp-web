<template>
  <div class="execution" id="pooperatelog">
    <basic-container>
      <el-dialog title="操作日志" :visible.sync="pooperatelogDialog" @close="dialogClose" width="60%" height="60%">
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :option="tableOption"
          @current-change="currentChange"
          @size-change="sizeChange"
          @search-change="handleFilter"
          @search-reset="searchReset"
          @on-load="getList"
          @refresh-change="refreshChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel"
        >
          <!-- 操作日志 -->
          <template slot="logRemark" slot-scope="scope">
            <span>{{ scope.row.logRemark }}</span>
            <el-button v-if="scope.row.filePath" type="text" @click="download(scope.row.filePath)">
              下载<i class="el-icon-download el-icon--right"></i>
            </el-button>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="pooperatelogDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList } from "@/api/cockpit/database/cocoperatelog"
import { tableOption } from "@/const/crud/cockpit/database/cocoperatelog"
import { getTokenUrl } from "@/util/auth"
import { mapGetters } from "vuex"

export default {
  name: "pooperatelog",
  props: {
    receiveRelateId: Number,
    receiveLogType: Number
  },
  data() {
    return {
      pooperatelogDialog: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      search: {
        relateId: -1,
        logType: -1
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
  methods: {
    // 下载
    download(url) {
      if (!url) {
        this.$message.warning("未上传调拨附件")
        return
      }
      window.location = getTokenUrl(url)
    },
    dialogClose() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    getList(page, params) {
      params = this.search
      this.tableLoading = true
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
        this.tableLoading = false
      })
    },
    showOperateLogDialog(id, type) {
      this.search.relateId = id
      this.search.logType = type
      this.handleFilter()
      this.pooperatelogDialog = true
    },
    handleFilter(param) {
      this.getList(this.page, this.search)
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      // this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      // this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      // this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {},
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {},
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {},
    /**
     * 刷新回调
     */
    refreshChange() {
      // this.getList(this.page)
      this.getList(this.page, this.search)
    },
    searchReset() {
      this.search = {}
    }
  }
}
</script>

<style>
#pooperatelog .avue-crud__menu {
  display: none;
}
#pooperatelog .el-dialog__body {
  padding: 0px 20px;
}
#pooperatelog .el-card__body {
  padding: 0px 0px;
}
</style>
