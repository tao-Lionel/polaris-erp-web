<template>
  <!-- 下发至第三方仓弹窗 -->
  <el-dialog title="下发至第三方仓" :visible.sync="showDialog" width="25%">
    <div style="color: #000; width: 250px; margin: 0 auto">
      <p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px">
        共{{ selectRows.length }}个发货单，确认审核发货吗？
      </p>
      <div style="line-height: 24px">
        <p>审核发货需满足：</p>
        <p>1、所有商品已匹配SKU</p>
        <p>2、发货单已分配仓库</p>
        <p>3、发货单已分配物流</p>
        <p>4、所有商品在指定仓库有可用库存</p>
        <p>5、发货单状态为待下发</p>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "sendToThirdPartyWarehouseDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      selectRows: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows) {
      this.showDialog = true
      this.selectRows = selectRows
    },
    handleConfirm() {
      this.showDialog = false
      this.$emit("sendToThirdPartyWarehouse")
    }
  }
}
</script>

<style lang="scss" scoped></style>
