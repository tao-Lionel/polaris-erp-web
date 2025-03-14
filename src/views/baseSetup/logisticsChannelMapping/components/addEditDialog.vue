<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="500px" @close="cancel">
    <div>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="渠道类型" prop="type">
          <el-radio-group v-model="form.type" @change="changeType">
            <el-radio :label="0">海外仓发货</el-radio>
            <el-radio :label="1">平台指定渠道</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type === 0" label="海外仓服务商" prop="providerCode">
          <el-select
            v-model="form.providerCode"
            size="small"
            clearable
            filterable
            placeholder="请选择海外仓服务商"
            @change="changeProviderCode"
          >
            <el-option
              v-for="item in overseasWarehouseProviderOptions"
              :key="item.providerCode"
              :label="item.providerName"
              :value="item.providerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 0" label="仓库" prop="warehouseCode">
          <el-select
            v-model="form.warehouseCode"
            size="small"
            clearable
            filterable
            placeholder="请选择仓库"
            @change="changeWarehouse"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select
            v-model="form.platform"
            size="small"
            filterable
            clearable
            placeholder="请选择平台"
            @change="changePlatform"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.platformTypeCode"
              :label="item.platformTypeCode"
              :value="item.platformTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货模式" prop="orderBusinessType">
          <el-select v-model="form.orderBusinessType" size="small" placeholder="请选择交货模式" filterable clearable>
            <el-option v-for="item in orderModelOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="type === 1">
          <el-form-item label="订单性质" prop="orderType">
            <el-select v-model="form.orderType" size="small" placeholder="请选择订单性质" filterable clearable>
              <el-option v-for="item in orderNatureOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ERP物流商" prop="carrierCode">
            <el-select
              v-model="form.carrierCode"
              size="small"
              placeholder="请选择ERP物流商"
              filterable
              clearable
              @change="changeCarrierCode"
            >
              <el-option v-for="item in erpLogisticsOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ERP渠道编码" prop="bseChannelCode">
            <el-select v-model="form.bseChannelCode" size="small" placeholder="请选择ERP渠道编码" filterable clearable>
              <el-option
                v-for="item in erpChannelCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="" prop="overseaCarrierCode">
              <template slot="label">
                海外物流商
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="同步第三方发货渠道，如映射失败，则影响同步"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <el-select
                v-model="form.overseaCarrierCode"
                size="small"
                placeholder="请选择海外物流商"
                filterable
                clearable
              >
                <el-option
                  v-for="item in overseasLogisticsOptions"
                  :key="item.bseOverseaCarrierCode"
                  :label="item.bseOverseaCarrierName"
                  :value="item.bseOverseaCarrierCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="海外仓渠道编码" prop="overseaChannelCode">
            <el-input v-model="form.overseaChannelCode" size="small" placeholder="请输入海外仓渠道编码"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getAll as getBseWarehouseProvider } from "@/api/baseSetup/bsewarehouseprovider"
import { getDictByType } from "@/util/auth"
import {
  addLogisticsMappingApi,
  editLogisticsMappingApi,
  getOverseaCarrierListApi,
  getCarriersByWarehouseIdNoInnerApi,
  getBseChannelByTransportCodeApi,
  getCarriersAllApi
} from "@/api/baseSetup/logisticsChannelMapping"
let form = {
  type: 0,
  providerCode: "",
  warehouseCode: "",
  platform: "",
  orderBusinessType: "",
  orderType: "",
  carrierCode: "",
  bseChannelCode: "",
  overseaCarrierCode: "",
  overseaChannelCode: ""
}

export default {
  name: "addEditDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form,
      title: "新增",
      platformOptions: [],
      warehouseOptions: [],
      orderModelOptions: [],
      rules: {
        type: [{ required: true, message: "请选择渠道类型", trigger: "blur" }],
        providerCode: [{ required: true, message: "请输入海外仓服务商", trigger: "blur" }],
        warehouseCode: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        platform: [{ required: true, message: "请选择平台", trigger: "blur" }],
        orderBusinessType: [{ required: true, message: "请选择交货模式", trigger: "blur" }],
        orderType: [{ required: true, message: "请选择订单性质", trigger: "blur" }],
        carrierCode: [{ required: true, message: "请选择ERP物流商", trigger: "blur" }],
        bseChannelCode: [{ required: true, message: "请选择ERP渠道编码", trigger: "blur" }],
        overseaCarrierCode: [{ required: true, message: "请选择海外物流商", trigger: "blur" }],
        overseaChannelCode: [{ required: true, message: "请输入海外仓渠道编码", trigger: "blur" }]
      },
      overseasWarehouseProviderOptions: [],
      orderNatureOptions: [],
      erpLogisticsOptions: [],
      overseasLogisticsOptions: [],
      erpChannelCodeOptions: [],
      selectData: {},
      type: 1
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    async openDialog(type, selectData) {
      this.showDialog = true
      this.type = type

      this.form = form
      this.selectData = selectData

      this.getPlatform()
      this.getWarehouseAll()
      this.getOverseasWarehouseProvider()
      // 交货模式
      this.orderModelOptions = await getDictByType("order_business_type")
      // 订单性质
      this.orderNatureOptions = await getDictByType("order_type")
      if (type === 1) {
        this.title = "新增"
      } else {
        this.title = "编辑"
        this.getDetail()
      }
    },
    // 获取详情
    async getDetail() {
      const { providerCode, bseWarehouseCode, platform, orderBusinessType, type } = this.selectData
      this.form = {
        platform,
        type: Number(type),
        providerCode,
        warehouseCode: bseWarehouseCode,
        orderBusinessType
      }
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlaTypeAll()
      this.platformOptions = data.data
    },
    // 获取仓库
    async getWarehouseAll() {
      this.warehouseOptions = []
      this.form.warehouseCode = ""
      const { data } = await getAllWarehouse({ funcState: "1", delFlag: "0", isFba: false })
      if (data.data && data.data.length > 0) {
        this.warehouseOptions = data.data
      }
    },
    // 获取海外仓服务商
    async getOverseasWarehouseProvider() {
      const { data } = await getBseWarehouseProvider()
      if (data.code === 0) {
        this.overseasWarehouseProviderOptions = data.data
      }
    },
    // 获取ERP物流商
    async getErpLogistics(id) {
      this.erpLogisticsOptions = []
      this.form.carrierCode = ""
      const { data } = await getCarriersByWarehouseIdNoInnerApi({ warehouseIds: [id] })
      if (data.code === 0) {
        this.erpLogisticsOptions = data?.data?.[0]?.dataList.map((item) => {
          return {
            value: item.transportCarrierCode,
            label: item.carrierName
          }
        })
      }
    },
    // 获取所有ERP物流商
    async getErpLogisticsAll() {
      this.erpLogisticsOptions = []
      this.form.carrierCode = ""
      const { data } = await getCarriersAllApi()
      if (data.code === 0) {
        this.erpLogisticsOptions = data?.data?.map((item) => {
          return {
            value: item.transportCarrierCode,
            label: item.carrierName
          }
        })
      }
    },
    // 获取ERP渠道编码
    async getErpChannelCode(id) {
      this.erpChannelCodeOptions = []
      this.form.bseChannelCode = ""
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

    changeCarrierCode(val) {
      if (!val) return
      this.getErpChannelCode(val)
    },

    changeWarehouse(val) {
      if (!val) return
      const id = this.warehouseOptions.find((item) => item.warehouseCode === val)?.warehouseId
      this.getErpLogistics(id)
    },

    changeType() {
      this.form.providerCode = ""
      this.getOverseaCarrierList()
      this.erpLogisticsOptions = []
      this.erpChannelCodeOptions = []
      this.form.carrierCode = ""
      this.form.bseChannelCode = ""
      this.form.warehouseCode = ""
      // 平台指定渠道获取所有的ERP物流商
      if (this.form.type === 1) {
        this.getErpLogisticsAll()
        this.form.warehouseCode = "All"
      }
    },
    async changeProviderCode(val) {
      await this.getWarehouseAll()
      this.getOverseaCarrierList()
      if (!val) return
      // 过滤仓库
      this.warehouseOptions = this.warehouseOptions.filter((item) => item.providerCode === val)
    },
    changePlatform() {
      this.getOverseaCarrierList()
    },

    // 获取海外物流商
    async getOverseaCarrierList() {
      this.overseasLogisticsOptions = []
      this.form.overseaCarrierCode = ""
      if (this.form.type && !this.form.platform) return
      if (!this.form.type && !this.form.providerCode) return
      const { data } = await getOverseaCarrierListApi({
        type: this.form.type,
        providerCode: this.form.type ? this.form.platform : this.form.providerCode
      })
      if (data.code === 0) {
        this.overseasLogisticsOptions = data.data
      }
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.overseasLogisticsOptions = []
      this.erpLogisticsOptions = []
      this.erpChannelCodeOptions = []
      this.showDialog = false
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          let fn = this.type === 1 ? addLogisticsMappingApi : editLogisticsMappingApi
          const { data } = await fn(this.form)
          this.$message.success("操作成功")
          this.$emit("updateData")
          this.cancel()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
