<template>
  <div class="execution" id="prdoperatelog">
    <basic-container>
      <el-dialog title="操作日志" :visible.sync="prdoperatelogDialog" @close="dialogClose" width="60%" height="60%">
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
          <template slot="search">
            <el-form-item label="操作类型">
              <avue-crud-input v-model="search.logRemark" placeholder="请输入备注信息" size="small" />
            </el-form-item>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="prdoperatelogDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getDeclareLogList } from "@/api/logistics/declareCustoms/customsList/customsList"
import { tableOption } from "@/const/crud/product/prdoperatelog/prdoperatelog"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "prdoperatelog",
  props: {
    receiveRelateId: Number,
    receiveLogType: Number
  },
  data() {
    return {
      prdoperatelogDialog: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      search: {
        relateId: -1,
        logType: -1,
        logRemark: null
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
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page)
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList(this.page)
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
      this.getList(this.page)
    },
    getList(page, params) {
      //拼接上自定义搜索条件
      params = Object.assign(params || {}, this.search)
      getDeclareLogList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then((response) => {
        console.log(response.data.records)
        this.tableData = response.data.records
        // console.log(this.tableData)
        this.page.total = response.data.total
      })
    },
    showOperateLogDialog(id, type) {
      this.search.relateId = id
      this.search.logType = type
      this.handleFilter()
      this.prdoperatelogDialog = true
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
    handleSave: function (row, done) {}
  }
}
</script>

<style>
#prdoperatelog .avue-crud__menu {
  display: none;
}
#prdoperatelog .el-dialog__body {
  padding: 10px 10px;
}
#prdoperatelog .el-card__body {
  padding: 0px 0px;
}
</style>
