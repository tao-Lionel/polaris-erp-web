<template>
  <div class="execution" id="stockrecordlog">
    <basic-container>
      <el-dialog
        title="出入库记录"
        :visible.sync="pooperatelogDialog"
        @close="dialogClose"
        width="80%"
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
          <template slot-scope="scope" slot="search">
            <el-form @submit.prevent.native :model="searchNew" :inline="true" ref="searchNew" style="float: left">
              <el-form-item prop="recordTypeId">
                <el-select
                  v-model="searchNew.recordTypeId"
                  size="small"
                  multiple
                  collapse-tags
                  filterable
                  clearable
                  placeholder="出入库类型"
                >
                  <el-option
                    v-for="item in listAllRecord"
                    :key="item.recordTypeId"
                    :label="item.recordTypeName"
                    :value="item.recordTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="form-label" prop="searchDate">
                <el-date-picker
                  size="small"
                  v-model="searchNew.searchDate"
                  type="daterange"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  start-placeholder="单据开始日期"
                  end-placeholder="单据结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </template>
          <template slot-scope="scope" slot="menuLeft">
            <div style="padding-top: 10px">
              <el-button type="primary" size="small" @click="exportData">导出</el-button>
            </div>
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
import { listAllRecordType, exportStockRecord, showStockRecordV2 as fetchList } from "@/api/warehouse/wmsstock"
import { tableOption } from "@/const/crud/warehouse/wmsstockrecord"
import { mapGetters } from "vuex"

export default {
  name: "stockrecordlog",
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
      search: {},
      searchNew: {
        searchDate: [],
        recordTypeId: []
      },
      searchForm: {},
      tableOption: tableOption,
      listAllRecord: []
    }
  },
  created() {
    listAllRecordType().then((res) => {
      if (res.data.code === 0) {
        this.listAllRecord = res.data.data
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    exportData() {
      exportStockRecord(this.searchForm).then((res) => {
        console.log(1111, res)
        const blobUrl = window.URL.createObjectURL(res.data)
        // const filename = res.headers['content-disposition'].split('=')[1];
        const filename = "出入库记录导出.xlsx"
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },
    dialogClose() {
      this.page = {
        total: 0, // 总页数
        pageSize: 10,
        currentPage: 1 // 当前页数
      }
      this.searchNew.recordTypeId = []
      this.searchNew.searchDate = []
      this.searchNew.recordTypeCode = []
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
    showLog(row) {
      // this.search.relateId = id;
      // this.search.logType = type;
      this.search = row
      this.search.recordTypeId = []
      this.handleFilter(this.search)
      this.pooperatelogDialog = true
    },
    handleFilter() {
      // console.log(this.page, this.search)
      let recordTypeCode = []
      this.searchNew.recordTypeId.forEach((item) => {
        let arr = this.listAllRecord.filter((items) => items.recordTypeId === item)
        if (arr.length) {
          recordTypeCode.push(arr[0].wmsRecordTypeCode)
        }
      })
      if (this.searchNew.searchDate && this.searchNew.searchDate.length) {
        this.searchNew.beginTime = this.searchNew.searchDate[0]
        this.searchNew.endTime = this.searchNew.searchDate[1]
      } else {
        this.searchNew.beginTime = ""
        this.searchNew.endTime = ""
      }
      this.searchNew.recordTypeCode = recordTypeCode
      this.searchForm = Object.assign(this.search, this.searchNew)
      this.getList(this.page, Object.assign(this.search, this.searchNew))
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
      // this.search={};
      this.searchNew.searchDate = []
      this.searchNew.recordTypeId = []
    }
  }
}
</script>

<style>
#stockrecordlog .avue-crud__menu {
  /* display: none;     */
}

#stockrecordlog .el-dialog__body {
  padding: 0px 10px;
}

#stockrecordlog .el-card__body {
  padding: 0px 0px;
}
</style>
