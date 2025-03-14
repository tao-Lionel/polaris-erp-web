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
          <el-button
            v-if="permissions.baseSetup_logisticsChannelMapping_add"
            type="primary"
            @click="handleAddAndEdit(1)"
            size="small"
          >
            新 增
          </el-button>
          <!-- <el-button type="primary" @click="handleAddAndEdit(2)" size="small"> 修 改 </el-button> -->
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="providerCode">
              <el-select v-model="searchForm.providerCode" size="small" clearable filterable placeholder="海外仓服务商">
                <el-option
                  v-for="item in overseasWarehouseProviderOptions"
                  :key="item.providerCode"
                  :label="item.providerName"
                  :value="item.providerCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseCode">
              <el-select
                v-model="searchForm.warehouseCode"
                size="small"
                clearable
                filterable
                placeholder="内部仓库编码"
              >
                <el-option
                  v-for="item in warehouseCodeOptions"
                  :key="item.warehouseCode"
                  :label="item.warehouseCode"
                  :value="item.warehouseCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="platform">
              <el-select v-model="searchForm.platform" size="small" placeholder="平台" filterable clearable>
                <el-option
                  v-for="item in platformOptions"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="orderBusinessType" slot-scope="{ row }">
          <div>{{ getOrderBusinessTypeName(row.orderBusinessType) }}</div>
        </template>
        <template slot="operate" slot-scope="{ row }">
          <a @click="setChannel(row)">渠道设置</a>
        </template>

        <template slot="operateLog" slot-scope="{ row }">
          <i class="el-icon-tickets check-log" @click="showOperateLog(row)"></i>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 日志 -->
    <logInfoDialog ref="logInfoDialogRef"></logInfoDialog>

    <addEditDialog ref="addEditDialogRef" @updateData="refreshChange"></addEditDialog>
    <channelSetting ref="channelSettingRef" @updateData="refreshChange"></channelSetting>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import logInfoDialog from "./components/logInfoDialog.vue"
import addEditDialog from "./components/addEditDialog"
import channelSetting from "./channelSetting.vue"
import { getAll as getBseWarehouseProvider } from "@/api/baseSetup/bsewarehouseprovider"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getLogisticsMappingListPageApi } from "@/api/baseSetup/logisticsChannelMapping"
import { getDictByType } from "@/util/auth"

export default {
  name: "logisticsChannelMappingList",
  components: { logInfoDialog, addEditDialog, channelSetting },
  data() {
    return {
      searchForm: {
        providerCode: "",
        warehouseCode: "",
        platform: ""
      },
      statusOptions: [],
      platformOptions: [],
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      overseasWarehouseProviderOptions: [],
      warehouseCodeOptions: [],
      orderModelOptions: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: async function () {
    this.getList()
    this.getPlatform()
    this.getOverseasWarehouseProvider()
    this.getWarehouseAll()
    // 订单模式
    this.orderModelOptions = await getDictByType("order_business_type")
  },
  methods: {
    // 获取海外仓服务商
    async getOverseasWarehouseProvider() {
      const { data } = await getBseWarehouseProvider()
      if (data.code === 0) {
        this.overseasWarehouseProviderOptions = data.data
      }
    },
    // 获取仓库
    async getWarehouseAll() {
      const { data } = await getAllWarehouse({ funcState: "1", delFlag: "0", isFba: false })
      if (data.data && data.data.length > 0) {
        this.warehouseCodeOptions = data.data
      }
    },
    //加载列表数据
    async getList() {
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.searchForm
      }

      console.log("params==========", params)

      const { data } = await getLogisticsMappingListPageApi(params)

      this.tableData = data.data.records
      this.page.total = data.data.total
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
    // 获取平台
    async getPlatform() {
      const { data } = await getPlaTypeAll()
      this.platformOptions = data.data
    },
    // 1 新增 2 编辑
    handleAddAndEdit(type) {
      let selectData = null
      if (type === 2) {
        if (this.selectList.length !== 1) {
          this.$message.warning("请选择一条数据")
          return
        }
        selectData = this.selectList[0]
      }
      this.$refs.addEditDialogRef.openDialog(type, selectData)
    },
    // 打开日志
    showOperateLog(row) {
      this.$refs.logInfoDialogRef.openDialog(row)
    },
    // 渠道设置
    setChannel(row) {
      this.$refs.channelSettingRef.openDialog(row, this.getOrderBusinessTypeName(row.orderBusinessType))
    },
    getOrderBusinessTypeName(type) {
      return this.orderModelOptions.find((item) => item.value === type)?.label
    }
  }
}
</script>

<style lang="scss" scoped>
.check-log {
  font-size: 16px;
  color: #46b1b0;
  cursor: pointer;
}
</style>
