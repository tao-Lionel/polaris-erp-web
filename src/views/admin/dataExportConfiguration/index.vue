<template>
  <div class="execution" id="dataExportConfiguration">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="name">
              <avue-crud-input
                v-model="searchForm.name"
                size="small"
                placeholder="请输入名称"
                clearable
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="category">
              <el-select v-model="searchForm.category" size="small" clearable filterable placeholder="请选择分类">
                <el-option v-for="item in categoryList" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="exportType">
              <el-select v-model="searchForm.exportType" size="small" clearable filterable placeholder="请选择应用类型">
                <el-option v-for="item in applicationType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="exportTypeNameHeader" slot-scope="scope">
          应用类型
          <el-tooltip
            effect="dark"
            content="公共导出配置：用于标识那些配置适用于所有用户共享的导出功能；业务特定导出配置：用于表示仅适用于特定业务页面的导出功能"
            placement="top"
          >
            <el-badge value="?" class="badge-item" type="info"> </el-badge>
          </el-tooltip>
        </template>

        <template slot="roleNameListHeader" slot-scope="scope">
          使用角色
          <el-tooltip effect="dark" content="指定可使用该功能的角色，仅针对应用类型=公共导出页面有效" placement="top">
            <el-badge value="?" class="badge-item" type="info"> </el-badge>
          </el-tooltip>
        </template>

        <template slot-scope="scope" slot="opeSolt">
          <div>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" style="color: #f56c6c" @click="handleDel(scope.row)">删除</el-button> -->
          </div>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "./index.js"
import { getExportConfigPage, getCategoryList } from "@/api/admin/dataExportConfiguration.js"
import { getDictByType } from "@/util/auth.js"

export default {
  name: "dataExportConfiguration",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        name: "",
        category: "",
        exportType: ""
      },
      tableOption: tableOption,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      categoryList: [],
      applicationType: []
    }
  },
  activated() {
    this.page.currentPage = 1
    this.getList()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
    this.getDictByType()
  },
  methods: {
    async getList() {
      const postData = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }

      const { data } = await getExportConfigPage(this.removeEmptyProperties(postData))
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
        this.page.currentPage = data.data.current
        this.page.pageSize = data.data.size
      }
    },
    removeEmptyProperties(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === "" || obj[key] === false) {
          delete obj[key]
        }
      }
      return obj
    },

    async getCategoryList() {
      const { data } = await getCategoryList()
      if (data.code === 0) {
        this.categoryList = data.data
      }
    },
    async getDictByType() {
      const data = await getDictByType("export_type")
      this.applicationType = data
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()

      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList()
    },

    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    /** 打开新增窗口**/
    handleAdd() {
      console.log("新增")
      this.$router.push({
        path: "/admin/addDataExportConfig",
        query: {
          type: "add"
        }
      })
    },

    handleClose() {
      // this.addOrUpdateDialog = false;
    },
    handleEdit(row) {
      this.$router.push({
        path: "/admin/updateDataExportConfig",
        query: {
          id: row.id,
          type: "edit"
        }
      })
      console.log(row)
    },

    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dataExportConfiguration {
  .badge-item {
    margin-top: 10px;
    margin-right: 40px;
  }
  ::v-deep .el-badge__content--info {
    background-color: #999696 !important;
    transform: scale(0.8);
  }
}
</style>
