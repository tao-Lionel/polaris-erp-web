<template>
  <div>
    <el-dialog title="渠道映射" :visible.sync="showDialog" width="80%" @close="cancel">
      <avue-crud ref="crud" :page="page" :data="tableData" :option="tableOption" @selection-change="selectionChange">
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button type="primary" @click="handleEdit()" size="small"> 编 辑 </el-button>
          <div class="mt-10 mb-10">
            <span class="mr-20">海外仓服务商编码：{{ selectData.providerCode }}</span>
            <span class="mr-20">平台：{{ selectData.platform }}</span>
            <span class="mr-20">交货模式：{{ orderBusinessTypeName }}</span>
            <span>内部仓库编码：{{ selectData.bseWarehouseCode }}</span>
          </div>
        </template>

        <template slot="orderType" slot-scope="{ row }">
          <div>{{ orderNatureOptions.find((item) => item.value === row.orderType)?.label }}</div>
        </template>
      </avue-crud>
      <span slot="footer">
        <el-button size="small" @click="cancel">关 闭</el-button>
      </span>
    </el-dialog>

    <editChannelSettingDialog ref="editChannelSettingDialogRef" @updateList="updateList"></editChannelSettingDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./channelSetting"
import editChannelSettingDialog from "./components/editChannelSettingDialog"
import { getDictByType } from "@/util/auth"
import { getLogisticsMappingDetailApi } from "@/api/baseSetup/logisticsChannelMapping"

export default {
  name: "channelSetting",
  components: { editChannelSettingDialog },
  data() {
    return {
      showDialog: false,
      searchForm: {},
      tableOption,
      page: {
        total: null, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      selectData: {},
      orderNatureOptions: [],
      orderBusinessTypeName: ""
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async openDialog(selectData, orderBusinessTypeName) {
      this.showDialog = true
      this.selectData = selectData
      this.orderBusinessTypeName = orderBusinessTypeName
      // 订单性质
      this.orderNatureOptions = await getDictByType("order_type")
      // this.tableData = selectData.channelDetailList
      this.getDetail()
    },
    async getDetail() {
      const { providerCode, bseWarehouseCode, platform, orderBusinessType } = this.selectData
      const { data } = await getLogisticsMappingDetailApi({
        providerCode,
        warehouseCode: bseWarehouseCode,
        platform,
        orderBusinessType
      })
      if (data.code === 0) {
        this.tableData = data?.data.channelDetailList
      }
    },
    async updateList(row) {
      this.$refs.crud.selectClear()
      this.getDetail()
    },

    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    // 编辑
    handleEdit() {
      if (this.selectList.length !== 1) {
        this.$message.warning("请选择一条数据进行编辑")
        return
      }
      this.$refs.editChannelSettingDialogRef.openDialog(this.selectList[0], this.orderNatureOptions, this.selectData)
    },
    cancel() {
      this.$refs.crud.selectClear()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__menu {
  display: none;
}
</style>
