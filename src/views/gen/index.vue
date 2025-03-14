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
        @refresh-change="refreshChange"
        @search-reset="searchReset"
        @search-change="searchChange"
      >
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" plain @click="handleDown(scope.row, scope.index)"> 生成 </el-button>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="database">
              <el-select v-model="searchForm.database" size="small" placeholder="请选择">
                <el-option
                  v-for="item in databaseList"
                  :key="item.SCHEMA_NAME"
                  :label="item.SCHEMA_NAME"
                  :value="item.SCHEMA_NAME"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>

      <el-dialog title="生成配置" :visible.sync="box" width="50%" lock-scroll>
        <div class="pull-auto">
          <avue-form :option="formOption" ref="formData" v-model="formData" @submit="gen()"> </avue-form>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, fetchDatabaseList, handleDown } from "@/api/gen/gen"
import { formOption, tableOption } from "@/const/crud/gen/gen"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "../../components/avue/utils/util"
export default {
  name: "code-generator",
  data() {
    return {
      tableData: [],
      formData: {},
      box: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      formOption: formOption,
      databaseList: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        database: ""
      },
      //确定的搜索条件
      searchFormConfirm: {}
    }
  },
  created() {
    this.getDatabaseList()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getDatabaseList() {
      fetchDatabaseList().then((response) => {
        this.databaseList = response.data.data
      })
    },
    getList(page, params) {
      // this.tableLoading = true
      fetchList(
        Object.assign(
          {
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
    handleDown: function (row, index) {
      this.formData.tableName = row.tableName
      this.box = true
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    searchChange(form) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, form)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
    },
    gen(form) {
      handleDown(Object.assign(this.formData, this.searchFormConfirm)).then(() => {
        this.box = true
      })
    }
  }
}
</script>
