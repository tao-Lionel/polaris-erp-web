<template>
  <el-dialog title="获取历史采购价" :visible.sync="showDialog" width="80%">
    <div>
      <div>点击确认，当前工厂SKU会更新对应的采购价目</div>
      <avue-crud :data="tableData" :option="tableOptions" @selection-change="selectionChange" ref="crud"> </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPurchaseChangeOrderSkuPriceHistoryApi } from "@/api/purchase/pochange/poorderchangedetail"
export default {
  name: "newPriceDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableData: [],
      tableOptions: {
        border: true,
        header: false,
        selection: true,
        menu: false,
        column: [
          {
            label: "工厂SKU",
            prop: "skuCode",
            sortable: false
          },
          {
            label: "产品名称",
            prop: "skuName",
            sortable: false
          },
          {
            label: "价格月份",
            prop: "monthYear"
          },
          {
            label: "币种",
            prop: "currency"
          },
          {
            label: "价格",
            prop: "price"
          }
        ]
      },
      selectList: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(row, priceModel, supplierNo) {
      this.showDialog = true
      const { skuId, skuCode, skuName } = row
      this.getList(skuId, priceModel, skuCode, skuName, supplierNo)
    },
    async getList(skuId, priceModel, skuCode, skuName, supplierNo) {
      const { data } = await getPurchaseChangeOrderSkuPriceHistoryApi({
        skuIds: [skuId],
        supplierNo,
        priceModel
      })
      if (data.code === 0) {
        this.tableData = data.data.map((item) => {
          return {
            ...item,
            skuCode: skuCode,
            skuName: skuName
          }
        })
      } else {
        this.$message.error(data.msg)
      }
    },
    //选中行事件
    selectionChange(selection) {
      this.selectList = selection
    },
    submit() {
      if (this.selectList.length !== 1) {
        this.$message.warning("请选择一条数据")
        return
      }
      this.$emit("updateList", this.selectList[0])
      this.$refs.crud.selectClear()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
