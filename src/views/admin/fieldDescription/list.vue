<template>
  <div>
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
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button size="small" type="primary" @click="handleAdd()"> 新增 </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="fieldName">
              <el-input
                v-model="searchForm.fieldName"
                placeholder="字段名,支持多个"
                clearable
                v-search-input
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item prop="funcName">
              <el-cascader
                v-model="searchForm.funcName"
                :options="funcNameOptions"
                filterable
                clearable
                placeholder="请选择功能"
                :props="{
                  expandTrigger: 'hover',
                  value: 'pathName',
                  label: 'name',
                  children: 'children',
                  checkStrictly: true
                }"
                size="small"
                @change="changeFuncName"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </template>

        <template slot="createByName" slot-scope="scope">
          {{ scope.row.createByName }}<br />
          {{ scope.row.createTime }}
        </template>

        <template slot="updateByName" slot-scope="scope">
          {{ scope.row.updateByName }}<br />
          {{ scope.row.updateTime }}
        </template>

        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <addDialog ref="addDialogRef" @updateList="updateList"></addDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import addDialog from "./components/addDialog"
import { getFieldPageListApi, deleteFieldApi, getFuncTreeApi } from "@/api/admin/fieldDescription.js"

export default {
  name: "fieldDescriptionList",
  components: { addDialog },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        fieldName: "",
        funcName: "",
        functionName: ""
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      funcNameOptions: []
    }
  },
  created() {},
  mounted: async function () {
    this.getList()
    this.getFuncTree()
  },
  methods: {
    async getFuncTree() {
      const { data } = await getFuncTreeApi()
      if (data.code === 0) {
        this.funcNameOptions = this.setChildren(data.data)
      }
    },
    setChildren(arr) {
      arr.forEach((item) => {
        item.pathName = item.name + "#" + item.path
        if (item.children && item.children.length > 0) {
          this.setChildren(item.children)
        } else {
          item.children = null
        }
      })
      return arr
    },
    changeFuncName(val) {
      let functionName = []
      this.searchForm.funcName.forEach((item) => {
        functionName.push(item.split("#")[0])
      })

      this.searchForm.functionName = functionName.join("/")
    },
    //加载列表数据
    async getList() {
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.searchForm
      }

      const { data } = await getFieldPageListApi(params)

      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      console.log("重置")
      this.$refs.searchFormRef.resetFields()
      this.searchForm.functionName = ""
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
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    handleAdd(row = null) {
      this.$refs.addDialogRef.openDialog(row)
    },
    updateList() {
      this.getList()
    },
    getCtrlList(row) {
      return [
        {
          title: "编辑",
          item: row,
          clickFn: (row) => {
            this.handleAdd(row)
          },
          show: true
        },
        {
          title: "删除",
          item: row,
          clickFn: (row) => {
            this.$confirm(`您确定要删除吗?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(async () => {
                const { data } = await deleteFieldApi({ id: row.id })
                if (data.code === 0) {
                  this.$message.success("删除成功!")
                  this.getList()
                }
              })
              .catch((res) => {})
          },
          show: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
