<template>
  <el-dialog
    title="新建/编辑仓库"
    center
    :visible.sync="showDialog"
    width="660px"
    top="10vh"
    custom-class="dialogShowScroll"
    @closed="formReset('addOrUpdateForm')"
  >
    <el-form ref="addOrUpdateForm" :model="bseWarehouseInfo" :rules="addOrUpdateFormRules" status-icon>
      <el-form-item label="内部仓库编码：" prop="warehouseCode">
        <el-input size="small" placeholder="不得超过30个字符" v-model="bseWarehouseInfo.warehouseCode" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="仓库名称：" prop="warehouseName">
        <el-input size="small" placeholder="不得超过30个字符" v-model="bseWarehouseInfo.warehouseName" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="仓库类型：" prop="warehouseTypeId">
        <el-select v-model="bseWarehouseInfo.warehouseTypeId" size="small" filterable placeholder="请选择仓库类型">
          <el-option
            v-for="item in bseWarehouseTypeOptions"
            :key="item.value"
            :label="item.warehouseTypeName"
            :value="item.warehouseTypeId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库服务商：" prop="warehouseProviderId">
        <el-select v-model="bseWarehouseInfo.warehouseProviderId" size="small" filterable placeholder="请选择服务商">
          <el-option
            v-for="item in bseWarehouseProviderOptions"
            :key="item.value"
            :label="item.providerName"
            :value="item.warehouseProviderId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务商仓库编码" prop="providerWarehouseCode" :rules="warehouseOutCodeRules">
        <el-input
          size="small"
          placeholder="不得超过30个字符"
          v-model="bseWarehouseInfo.providerWarehouseCode"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="物流商："
        prop="transportCarrierIds"
        :rules="bseWarehouseInfo.warehouseTypeId == 4 ? transportCarrierIdRules : []"
      >
        <el-select
          v-model="bseWarehouseInfo.transportCarrierIds"
          size="small"
          clearable
          multiple
          filterable
          placeholder="请选择物流商"
        >
          <el-option
            v-for="(item, index) in transportCarrierOptions"
            :key="index"
            :label="item.carrierName"
            :value="item.transportCarrierId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="平台：" prop="platformTypeCode">
            <el-select v-model="bseWarehouseInfo.platformTypeCode" size="small" filterable placeholder="请选择平台">
              <el-option
                v-for="(item, index) in platformOptions"
                :key="index"
                :label="item.platformTypeCode"
                :value="item.platformTypeCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台仓库编码" prop="platformTypeWarehouseCode">
            <el-input
              size="small"
              placeholder="不得超过30个字符"
              v-model="bseWarehouseInfo.platformTypeWarehouseCode"
              clearable
            >
            </el-input>
          </el-form-item> -->
      <el-form-item label="是否支持退件：" prop="supportRefund">
        <el-select v-model="bseWarehouseInfo.supportRefund" size="small" filterable placeholder="请选择">
          <el-option v-for="item in supportRefundOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属国家/地区：" prop="countryId">
        <el-select
          v-model="bseWarehouseInfo.countryId"
          size="small"
          filterable
          placeholder="请选择"
          @change="changeCountry"
        >
          <el-option
            v-for="item in bsecountryOptions"
            :key="item.value"
            :label="item.countryShortName"
            :value="item.countryId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="区域："
        prop="area"
        :rules="bseWarehouseInfo.countryId == 2 ? addOrUpdateFormRules.area : [{ required: false }]"
      >
        <el-select v-model="bseWarehouseInfo.area" size="small" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in regionOptions"
            :key="item.mappingCode"
            :label="item.mappingName"
            :value="item.mappingCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省/州：" prop="states">
        <el-input size="small" placeholder="请输入省/州" v-model="bseWarehouseInfo.states" clearable> </el-input>
      </el-form-item>
      <el-form-item label="市：" prop="city">
        <el-input size="small" placeholder="请输入市" v-model="bseWarehouseInfo.city" clearable> </el-input>
      </el-form-item>

      <el-form-item label="仓库地址：" prop="warehouseAddress">
        <el-input size="small" placeholder="不得超过200个字符" v-model="bseWarehouseInfo.warehouseAddress" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="邮编：" prop="statesZipCode">
        <el-input size="small" placeholder="请输入邮编" v-model="bseWarehouseInfo.statesZipCode" clearable> </el-input>
      </el-form-item>
      <el-form-item label="使用组织：" prop="corporationCodes">
        <el-select
          v-model="bseWarehouseInfo.corporationCodes"
          size="small"
          filterable
          multiple
          placeholder="请选择使用组织"
        >
          <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="　备　　注：" prop="remark">
        <el-input type="textarea" :rows="2" placeholder="不得超过300位字符" v-model="bseWarehouseInfo.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="comfrimCancel('addOrUpdateForm')">取 消</el-button>
      <el-button size="small" type="primary" @click="addOrUpdateSubmit('addOrUpdateForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addObj, putObj } from "@/api/baseSetup/bsewarehouse"
import { getDictByType } from "@/util/auth"

export default {
  name: "addWarehouseDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      bseWarehouseInfo: {
        area: ""
      },
      addOrUpdateFormRules: {
        warehouseCode: [{ required: true, message: "请输入内部仓库编码", trigger: "blur" }],
        warehouseName: [
          { required: true, message: "请输入仓库名称", trigger: "blur" },
          { max: 30, message: "仓库名称不得超过30个字符", trigger: "blur" }
        ],
        warehouseTypeId: [{ required: true, message: "请选择仓库类型", trigger: "blur" }],
        warehouseProviderId: [{ required: true, message: "请选择仓库服务商", trigger: "blur" }],
        supportRefund: [{ required: true, message: "请选择是否支持退件", trigger: "blur" }],
        countryId: [{ required: true, message: "请选择所属国家/地区", trigger: "blur" }],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        warehouseAddress: [
          { required: true, message: "请输入仓库地址", trigger: "blur" },
          { max: 200, message: "仓库地址不得超过200个字符", trigger: "blur" }
        ],
        states: [{ required: true, message: "请输入省/州", trigger: "blur" }],
        city: [{ required: true, message: "请输入市", trigger: "blur" }],
        statesZipCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
        remark: [{ max: 300, message: "备注不得超过300个字符", trigger: "blur" }],
        corporationCodes: [{ required: true, message: "请选择使用组织", trigger: "blur" }]
      },
      warehouseOutCodeRules: [{ required: true, message: "请填写服务商编码", trigger: "blur" }],
      transportCarrierIdRules: [{ required: true, message: "选择海外仓时,必须选择物流商", trigger: "blur" }],
      addOrUpdateFlag: "0",
      bseWarehouseTypeOptions: [],
      bseWarehouseProviderOptions: [],
      transportCarrierOptions: [],
      supportRefundOptions: [],
      bsecountryOptions: [],
      corporationOptions: [],
      regionOptions: [],
      warehouseRegion: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(
      bseWarehouseTypeOptions,
      bseWarehouseProviderOptions,
      transportCarrierOptions,
      supportRefundOptions,
      bsecountryOptions,
      corporationOptions,
      data
    ) {
      if (data) {
        this.bseWarehouseInfo = {
          platformTypeCode: data.platformTypeCode,
          warehouseCode: data.warehouseCode,
          warehouseId: data.warehouseId,
          warehouseName: data.warehouseName,
          warehouseTypeId: data.warehouseTypeId,
          providerWarehouseCode: data.providerWarehouseCode,
          platformTypeWarehouseCode: data.platformTypeWarehouseCodes,
          warehouseProviderId: data.warehouseProviderId,
          supportRefund: data.supportRefund,
          countryId: data.countryId,
          area: data.area,
          transportCarrierIds: data.transportCarrierIds,
          warehouseAddress: data.warehouseAddress,
          states: data.states,
          city: data.city,
          statesZipCode: data.statesZipCode,
          remark: data.remark,
          corporationCodes: data.corporationList.map((item) => item.corporationCode)
        }
        this.addOrUpdateFlag = "1"
      } else {
        this.bseWarehouseInfo = {
          platformTypeCode: undefined,
          warehouseCode: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          warehouseTypeId: undefined,
          providerWarehouseCode: undefined,
          platformTypeWarehouseCode: undefined,
          warehouseProviderId: undefined,
          supportRefund: undefined,
          countryId: undefined,
          area: undefined,
          transportCarrierIds: undefined,
          warehouseAddress: undefined,
          states: undefined,
          city: undefined,
          statesZipCode: undefined,
          remark: undefined,
          corporationCodes: undefined
        }
        this.addOrUpdateFlag = "0"
      }

      this.bseWarehouseTypeOptions = bseWarehouseTypeOptions
      this.bseWarehouseProviderOptions = bseWarehouseProviderOptions
      this.transportCarrierOptions = transportCarrierOptions
      this.supportRefundOptions = supportRefundOptions
      this.bsecountryOptions = bsecountryOptions
      this.corporationOptions = corporationOptions
      this.warehouseRegion = await getDictByType("warehouse_region")
      this.getRegionOptions()
      this.showDialog = true
    },
    async changeCountry() {
      this.regionOptions = []
      this.bseWarehouseInfo.area = ""
      this.getRegionOptions()
    },

    getRegionOptions() {
      const countryCode = this.bsecountryOptions.find(
        (item) => item.countryId === this.bseWarehouseInfo.countryId
      )?.countryCode

      this.regionOptions = this.warehouseRegion.find((item) => item.value === countryCode)?.dictMappings
    },

    //重置表格验证
    formReset(formName) {
      this.$refs[formName].resetFields()
    },
    comfrimCancel(formName) {
      this.$refs[formName].resetFields()
      this.showDialog = false
    },
    /**
     * 提交新增或者更新表单
     */
    addOrUpdateSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //新增
          if (this.addOrUpdateFlag == "0") {
            addObj({
              ...this.bseWarehouseInfo,
              corporationCodes: this.bseWarehouseInfo.corporationCodes.join(",")
            })
              .then((response) => {
                if (response.data.code == 0) {
                  this.showDialog = false
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success",
                    duration: 2000
                  })
                  this.$emit("updateList")
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("操作失败")
                  return
                }
              })
              .catch(() => {
                this.$message.error("操作失败")
                return
              })
          } else {
            //编辑
            putObj({ ...this.bseWarehouseInfo, corporationCodes: this.bseWarehouseInfo.corporationCodes.join(",") })
              .then((response) => {
                if (response.data.code == 0) {
                  this.showDialog = false
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                  })
                  this.$emit("updateList")
                } else if (response.data.code == 1) {
                  this.$message.error(response.data.msg)
                  return
                } else {
                  this.$message.error("操作失败")
                  return
                }
              })
              .catch(() => {
                this.$message.error("操作失败")
                return
              })
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  height: 80vh;

  .el-dialog__body {
    overflow-y: scroll;
    height: calc(100% - 130px);
    .el-form-item__label {
      width: 150px;
    }
  }
}
</style>
