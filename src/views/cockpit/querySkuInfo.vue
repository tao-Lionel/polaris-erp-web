<template>
  <div class="execution" id="queryskuinfo">
    <!-- <basic-container> -->
    <el-dialog title="选择产品" :visible.sync="queryskuinfoDialog" @close="dialogClose" width="60%" height="60%">
      <avue-crud
        ref="crud"
        v-model="form"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm">
            <el-form-item label="skuCode" prop="skuCode">
              <el-input v-model="searchForm.skuCode" placeholder="请输入sku" size="small" v-search-input />
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSelectSku">确定</el-button>
      </span>
    </el-dialog>
    <!-- </basic-container> -->
  </div>
</template>
<script>
import { getByLikeSkuCodeAndAuditOkPage } from "@/api/product/prdsku"
import { tableOption } from "@/const/crud/cockpit/queryskuinfo"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "queryskuinfo",
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        skuCode: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      form: {},
      tableOption: tableOption,
      tableData: [],
      selectRows: [],
      queryskuinfoDialog: false
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
        pageSize: 10,
        currentPage: 1 // 当前页数
      }
      this.$refs["searchForm"].resetFields()
      this.searchForm.skuCode = ""
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    /** 刷新回调 */
    refreshChange() {
      this.getList(this.page)
    },
    handleFilter(param) {
      this.getList(this.page)
    },
    selectionChange(tableData) {
      this.selectRows = tableData
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    getList(page, params) {
      //拼接上自定义搜索条件
      params = Object.assign(params || {}, this.searchFormConfirm)
      getByLikeSkuCodeAndAuditOkPage(
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
    querySku() {
      this.handleFilter()
      this.queryskuinfoDialog = true
      if (this.selectRows && this.selectRows.length > 0) {
        this.clearSelectClear()
      }
    },
    handleSelectSku() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请勾选数据")
        return false
      } else if (this.selectRows.length != 1) {
        this.$message.error("只支持选择一条数据")
        return false
      }
      this.$emit("handleSelectSku", this.selectRows[0])
    },
    closeDialog() {
      this.queryskuinfoDialog = false
    }
  }
}
</script>

<style>
#queryskuinfo .el-dialog__body {
  padding: 0px 20px;
}
#queryskuinfo .el-card__body {
  padding: 0px 0px;
}
</style>
