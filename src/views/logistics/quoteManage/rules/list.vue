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
          <el-button v-if="permissions.logistics_tender_rule_add" size="small" type="primary" @click="handleAdd(null)">
            新增
          </el-button>
          <el-button
            v-if="permissions.logistics_tender_rule_enable"
            size="small"
            type="primary"
            @click="handleBatchEnable"
          >
            批量启用
          </el-button>
          <el-button
            v-if="permissions.logistics_tender_rule_disable"
            size="small"
            type="primary"
            @click="handleBatchDisable"
          >
            批量禁用
          </el-button>
          <el-button v-if="permissions.logistics_tender_rule_export" size="small" type="primary" @click="handleExport">
            导出数据
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="portOfOrigin">
              <el-select
                clearable
                v-model="searchForm.portOfOrigin"
                filterable
                multiple
                placeholder="起运港口"
                size="small"
              >
                <el-option
                  v-for="item in departureHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="destinationPort">
              <el-select
                clearable
                v-model="searchForm.destinationPort"
                filterable
                multiple
                placeholder="目的港口"
                size="small"
              >
                <el-option
                  v-for="item in intoHarbourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="logisticsProviderUserId">
              <el-select
                v-model="searchForm.logisticsProviderUserId"
                filterable
                clearable
                placeholder="物流商"
                size="small"
              >
                <el-option
                  v-for="item in logisticsProviderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <template slot="enable" slot-scope="scope">
          <el-tag v-if="scope.row.enable" type="success" size="mini">启用</el-tag>
          <el-tag v-else type="danger" size="mini">禁用</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <addDialog ref="addDialogRef" @updateList="updateList"></addDialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import { getDictByType, downloadBlob } from "@/util/auth"
import addDialog from "./components/addDialog.vue"
import {
  getRulesListApi,
  getTenderLogisticsApi,
  batchRulesOperateApi
} from "@/api/logistics/logisticsProviderTendering"
import { exportDataComApi } from "@/api/common/index"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "releaseRulesList",
  components: { addDialog },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        logisticsProviderUserId: "",
        portOfOrigin: [],
        destinationPort: []
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      departureHarbourOptions: [],
      intoHarbourOptions: [],
      searchFields: [
        { label: "创建人", value: "createName", type: "input", default: true },
        { label: "创建时间", value: "createTime", type: "datetimerange" },
        { label: "更新人", value: "updateName", type: "input" },
        { label: "更新时间", value: "updateTime", type: "datetimerange" }
      ],
      logisticsProviderOptions: []
    }
  },
  created() {},
  mounted: async function () {
    this.init()
    this.getList()
  },
  methods: {
    async init() {
      //目的港
      this.intoHarbourOptions = await getDictByType("into_harbour")
      //起运港
      this.departureHarbourOptions = await getDictByType("departure_harbour")
      // 投标物流商
      getTenderLogisticsApi().then((res) => {
        this.logisticsProviderOptions = res.data.data.map((item) => {
          return {
            label: item.displayname,
            value: item.userId
          }
        })
      })
    },

    //加载列表数据
    async getList() {
      const searchForm = Object.keys(this.searchForm).reduce((acc, key) => {
        if (Array.isArray(this.searchForm[key]) && this.searchForm[key].length) {
          acc[key] = this.searchForm[key].join(",")
        } else if (Array.isArray(this.searchForm[key]) && this.searchForm[key].length === 0) {
          acc[key] = undefined
        } else if (this.searchForm[key] !== undefined && this.searchForm[key] !== null && this.searchForm[key] !== "") {
          console.log(key, this.searchForm[key])
          acc[key] = this.searchForm[key]
        }
        return acc
      }, {})
      const params = {
        page: {
          current: this.page.currentPage,
          size: this.page.pageSize
        },
        ...searchForm
      }
      const { data } = await getRulesListApi(params)
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
      this.$refs.searchCrudItemRef.resetField()
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
    updateField(obj) {
      let createStartTime = obj.createTime?.[0]
      let createEndTime = obj.createTime?.[1]
      let updateStartTime = obj.updateTime?.[0]
      let updateEndTime = obj.updateTime?.[1]

      Object.assign(this.searchForm, obj, { createStartTime, createEndTime, updateStartTime, updateEndTime })
    },
    updateList() {
      this.getList()
      this.$refs.crud.selectClear()
    },
    getCtrlList(row) {
      return [
        {
          title: "编辑",
          item: row,
          clickFn: (row) => {
            this.handleAdd(row)
          },
          show: this.permissions.logistics_tender_rule_edit
        }
      ]
    },
    handleAdd(row = null) {
      this.$refs.addDialogRef.openDialog(row)
    },
    handleBatchEnable() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }
      this.$confirm(`你勾选了${this.selectList.length}条数据，确定批量启用数据吗？`, "批量启用").then(async () => {
        const { data } = await batchRulesOperateApi({ ids: this.selectList.map((item) => item.id), enable: true })
        if (data.code === 0) {
          this.$message.success("批量启用成功")
          this.updateList()
        }
      })
    },
    handleBatchDisable() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }
      this.$confirm(`你勾选了${this.selectList.length}条数据，确定批量禁用数据吗？`, "批量禁用").then(async () => {
        const { data } = await batchRulesOperateApi({ ids: this.selectList.map((item) => item.id), enable: false })
        if (data.code === 0) {
          this.$message.success("批量禁用成功")
          this.updateList()
        }
      })
    },
    async handleExport() {
      const exportParams = []
      const obj = deepCloneIgnoreNull(this.searchForm)
      delete obj.createStartTime
      delete obj.createEndTime
      delete obj.updateStartTime
      delete obj.updateEndTime

      Object.keys(obj).forEach((item) => {
        if (Array.isArray(obj[item])) {
          exportParams.push({ code: item, value: obj[item].join(",") })
        } else {
          exportParams.push({ code: item, value: obj[item] })
        }
      })

      const { data } = await exportDataComApi({
        id: 35,
        param: exportParams,
        exportModel: "SYNC"
      })
      downloadBlob(data, "招标需求发布规则导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>

<style lang="scss" scoped></style>
