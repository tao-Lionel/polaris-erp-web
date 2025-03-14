<template>
  <el-dialog
    title="生成合同-选择合同条款"
    :visible.sync="showDialog"
    width="30%"
    :before-close="createContractCancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <avue-crud
      ref="createContractCrud"
      :page="createContractPage"
      :data="createContractData"
      :option="createContractTableOption"
      @selection-change="createContractSelectionChange"
    >
    </avue-crud>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="createContractCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="createContractConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createContractTableOption } from "../list.js"
import { createContractBatch } from "@/api/purchase/order/poorder"
import { getListBySupplierNo } from "@/api/supplier/posupplierOther"

export default {
  name: "generateContractDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      createContractTableOption,
      createContractData: [],
      createContractPage: {
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      createContractSelectionList: [],
      contractPurchaseOrderNo: null
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(contractPurchaseOrderNo, supplierNo) {
      this.showDialog = true
      this.contractPurchaseOrderNo = contractPurchaseOrderNo

      getListBySupplierNo(supplierNo).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length === 0) {
            this.$message.warning("该供应商合同条款未配置，请先配置合同条款！")
            return
          }
          this.createContractData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    createContractSelectionChange(list) {
      this.createContractSelectionList = list
    },
    createContractCancel() {
      this.$refs.createContractCrud.selectClear()
      this.showDialog = false
      this.createContractData = []
    },
    createContractConfirm() {
      if (!this.createContractSelectionList.length) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.createContractSelectionList.length > 1) {
        this.$message.error("只能选择一个合同条款")
        return
      }

      let params = {
        informationId: this.createContractSelectionList[0].informationId,
        purchaseOrderNo: this.contractPurchaseOrderNo
      }

      console.log(params)
      createContractBatch(params).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: "生成合同成功",
            type: "success"
          })
          this.$emit("updateList")
          this.createContractCancel()
        } else if (res.data.code === 1 && res.data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("生成合同失败")
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
