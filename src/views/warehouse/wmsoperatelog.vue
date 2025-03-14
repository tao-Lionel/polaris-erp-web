<template>
  <div class="execution" id="pooperatelog">
    <basic-container>
      <el-dialog
        :title="title"
        :visible.sync="pooperatelogDialog"
        @close="dialogClose"
        top="10vh"
        width="60%"
        height="60%"
        class="dialogShowScroll"
      >
        <avue-crud
          ref="crud"
          :page="page"
          :data="tableData"
          :option="tableOption"
          @current-change="currentChange"
          @size-change="sizeChange"
          @search-change="handleFilter"
          @search-reset="searchReset"
          @refresh-change="refreshChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel"
        >
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="pooperatelogDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList } from "@/api/warehouse/wmsoperatelog"
import { tableOption } from "@/const/crud/warehouse/wmsoperatelog"
import { mapGetters } from "vuex"

export default {
  name: "pooperatelog",
  props: {
    receiveRelateId: Number,
    receiveLogType: Number,
    title: {
      type: String,
      default: "操作日志"
    }
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
      tableOption: tableOption
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    dialogClose() {
      this.page = {
        pageSize: 10,
        total: 0, // 总页数
        currentPage: 1 // 当前页数
      }
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.search)
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.search)
    },
    getList(page, params) {
      params = this.search
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
    showOperateLogDialog(id, type) {
      this.search.relateId = id
      this.search.logType = type
      this.handleFilter()
      this.pooperatelogDialog = true
    },
    handleFilter() {
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
