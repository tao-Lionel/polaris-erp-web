<template>
  <el-dialog title="编辑" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="海外仓渠道编码" prop="updateOverseaChannelCode">
          <el-input v-model="form.updateOverseaChannelCode" size="small" placeholder="请输入海外仓渠道编码"></el-input>
        </el-form-item>
        <el-form-item label="ERP渠道编码" prop="bseChannelCode">
          <el-select v-model="form.bseChannelCode" size="small" filterable clearable placeholder="请选择ERP渠道编码">
            <el-option v-for="item in erpChannelCodeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单性质" prop="orderType">
          <el-select v-model="form.orderType" size="small" placeholder="请选择订单性质" filterable clearable>
            <el-option v-for="item in orderNatureOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第三方付款账号" prop="accountCode">
          <el-input v-model="form.accountCode" size="small" placeholder="请输入第三方付款账号"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  editLogisticsMappingApi,
  getCarriersByWarehouseIdNoInnerApi,
  getBseChannelByTransportCodeApi
} from "@/api/baseSetup/logisticsChannelMapping"

export default {
  name: "editChannelSettingDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        orderType: "",
        accountCode: "",
        bseChannelCode: "",
        overseaChannelCode: "",
        updateOverseaChannelCode: "",
        platform: "",
        orderBusinessType: "",
        type: "",
        overseaWarehouseId: "",
        overseaWarehouseCode: "",
        warehousueCode: "",
        providerCode: "",
        oldOrderType: "",
        oldBseChannelCode: ""
      },
      orderNatureOptions: [],
      erpChannelCodeOptions: [],
      rules: {
        updateOverseaChannelCode: [{ required: true, message: "请输入海外仓渠道编码", trigger: "blur" }],
        bseChannelCode: [{ required: true, message: "请选择ERP渠道编码", trigger: "change" }],
        orderType: [{ required: true, message: "请选择订单性质", trigger: "change" }]
        // accountCode: [{ required: true, message: "请输入第三方付款账号", trigger: "blur" }]
      },
      row: {}
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    async openDialog(row, orderNatureOptions, selectData) {
      this.showDialog = true
      this.row = row
      // 订单性质
      this.orderNatureOptions = orderNatureOptions
      const {
        orderType,
        accountCode,
        bseChannelCode,
        bseOverseaChannelCode,
        bseOverseaCarrierId,
        bseOverseaCarrierCode,
        bseCarrierCode
      } = this.row
      const {
        bseWarehouseId,
        platform,
        orderBusinessType,
        type,
        bseWarehouseCode,
        providerCode,
        bseOverseaWarehouseCode
      } = selectData
      this.getErpChannelCode(bseCarrierCode)
      this.form = {
        orderType,
        accountCode,
        bseChannelCode,
        overseaChannelCode: bseOverseaChannelCode,
        updateOverseaChannelCode: bseOverseaChannelCode,
        platform,
        orderBusinessType,
        type,
        overseaWarehouseId: bseOverseaCarrierId,
        overseaWarehouseCode: bseOverseaWarehouseCode,
        warehouseCode: bseWarehouseCode,
        providerCode,
        oldOrderType: orderType,
        oldBseChannelCode: bseChannelCode
      }
    },

    // 获取ERP物流商
    async getErpLogistics(id) {
      const { data } = await getCarriersByWarehouseIdNoInnerApi({ warehouseIds: [id] })
      if (data.code === 0) {
        // this.erpLogisticsOptions = data?.data?.[0]?.dataList.map((item) => {
        //   return {
        //     value: item.transportCarrierCode,
        //     label: item.carrierName
        //   }
        // })
      }
    },
    // 获取ERP渠道编码
    async getErpChannelCode(id) {
      this.erpChannelCodeOptions = []
      const { data } = await getBseChannelByTransportCodeApi({ transportCarrierCode: id })
      if (data.code === 0) {
        this.erpChannelCodeOptions = data.data.map((item) => {
          return {
            value: item.bseChannelCode,
            label: item.bseChannelName
          }
        })
      }
    },

    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const { data } = await editLogisticsMappingApi(this.form)
          this.$message.success("操作成功")
          this.$emit("updateList")
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
