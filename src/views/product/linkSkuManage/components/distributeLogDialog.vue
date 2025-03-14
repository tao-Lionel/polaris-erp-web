<template>
  <el-dialog title="运营变更记录" :visible.sync="showDialog" width="80%">
    <div>
      <avue-crud
        :data="tableData"
        :option="distributeLogTableOption"
        :page="page"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="level">
              <el-select size="small" v-model="searchForm.level" clearable placeholder="变更级别">
                <el-option
                  v-for="item in operatorLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select size="small" v-model="searchForm.status" clearable multiple placeholder="状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="status" slot-scope="scope">
          <span :style="{ color: scope.row.status === '生效中' ? '#67C23A' : '#F56C6C' }">{{ scope.row.status }}</span>
        </template>
        <template slot="disableTime" slot-scope="scope">
          {{ scope.row.disableTime ? scope.row.disableTime : "9999-12-31" }}
        </template>
        <template slot="enableTime" slot-scope="scope">
          {{ scope.row.updateName }}<br />
          {{ scope.row.enableTime }}
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { distributeLogTableOption } from "../list"
import { getDistributeLogApi } from "@/api/product/linkSkuMange"
import { getDictByType, setFiltering } from "@/util/auth"

export default {
  name: "distributeLogDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableData: [],
      distributeLogTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {
        level: "",
        status: "",
        linkSkuId: ""
      },
      operatorLevelOptions: [],
      statusOptions: [
        {
          label: "生效中",
          value: "valid"
        },
        { label: "已失效", value: "invalid" }
      ]
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(row) {
      this.showDialog = true
      this.operatorLevelOptions = await getDictByType("operator_level")
      this.searchForm.linkSkuId = row.id

      this.getList()
    },
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm)
      }
      const { data } = await getDistributeLogApi(params)
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
a
