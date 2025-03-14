<template>
  <el-dialog
    title="添加国家区域地址"
    :visible.sync="showDialog"
    width="500px"
    class="dialogShowScroll"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="form" inline label-width="140px" label-suffix=":">
        <div style="display: flex; flex-direction: column">
          <div v-for="(item, index) in addressList" :key="index" style="display: flex; align-items: center">
            <div style="border: 1px solid #ebeef5; margin-bottom: 10px; padding: 5px">
              <el-form-item :label="`国家${index + 1}`" required>
                <el-select
                  size="small"
                  v-model="item.deliveryCountryCode"
                  clearable
                  filterable
                  placeholder="国家"
                  @change="changeCountry(item.deliveryCountryCode, index)"
                  :disabled="editFlag"
                >
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.countryShortName"
                    :value="item.countryCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="`区域${index + 1}`">
                <el-select
                  v-model="item.deliveryRegionCode"
                  size="small"
                  filterable
                  clearable
                  placeholder="区域"
                  :disabled="editFlag"
                >
                  <el-option
                    v-for="item in item.regionOptions"
                    :key="item.mappingCode"
                    :label="item.mappingName"
                    :value="item.mappingCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="`供应商地址${index + 1}`" required>
                <el-input
                  size="small"
                  clearable
                  v-model.trim="item.postalAddress"
                  placeholder="不得超过200位字符"
                  maxlength="200"
                  :disabled="editFlag"
                ></el-input>
              </el-form-item>
            </div>
            <i
              @click="handleDel(index)"
              class="el-icon-remove-outline"
              style="font-size: 30px; cursor: pointer; margin-left: 20px"
            ></i>
            <i
              v-show="index === addressList.length - 1"
              @click="handleAdd"
              class="el-icon-circle-plus-outline"
              style="font-size: 30px; cursor: pointer; margin-left: 20px"
            ></i>
          </div>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "addressDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      addressList: [
        {
          deliveryCountryCode: "",
          deliveryRegionCode: "",
          postalAddress: "",
          regionOptions: []
        }
      ],
      countryOptions: [],
      warehouseRegion: [],
      editFlag: false
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(countryOptions, warehouseRegion, deliveryInfos, editFlag) {
      console.log("deliveryInfos", deliveryInfos)
      this.showDialog = true
      this.countryOptions = countryOptions
      this.warehouseRegion = warehouseRegion
      this.addressList =
        deliveryInfos?.length <= 0
          ? [{ deliveryCountryCode: "", deliveryRegionCode: "", postalAddress: "", regionOptions: [] }]
          : deliveryInfos
      this.addressList.forEach((item, index) => {
        this.getRegionOptions(item.deliveryCountryCode, index)
      })
      this.editFlag = editFlag
    },
    changeCountry(deliveryCountryCode, index) {
      this.addressList[index].regionOptions = []
      this.addressList[index].deliveryRegionCode = ""
      this.getRegionOptions(deliveryCountryCode, index)
    },

    getRegionOptions(deliveryCountryCode, index) {
      const countryCode = this.countryOptions.find((item) => item.countryCode === deliveryCountryCode)?.countryCode
      this.addressList[index].regionOptions = this.warehouseRegion.find(
        (item) => item.value === countryCode
      )?.dictMappings
    },
    handleAdd() {
      if (this.editFlag) {
        this.$message.error("非编辑状态下不可操作")
        return
      }

      this.addressList.push({
        deliveryCountryCode: "",
        deliveryRegionCode: "",
        postalAddress: "",
        regionOptions: []
      })
    },
    handleDel(index) {
      if (this.editFlag) {
        this.$message.error("非编辑状态下不可操作")
        return
      }
      if (this.addressList.length <= 1) {
        this.$message.error("至少保留一个地址")
        return
      }
      this.addressList.splice(index, 1)
    },
    submit() {
      for (let i = 0; i < this.addressList.length; i++) {
        const item = this.addressList[i]
        if (!item.deliveryCountryCode) {
          this.$message.error("请选择国家")
          return
        }
        if (item.deliveryCountryCode === "US" && !item.deliveryRegionCode) {
          this.$message.error("请选择区域")
          return
        }
        if (!item.postalAddress) {
          this.$message.error("请填写供应商地址")
          return
        }
      }
      const addressList = deepCloneIgnoreNull(this.addressList)
      addressList.forEach((item) => {
        delete item.regionOptions
      })
      this.$emit("updateFormData", addressList)
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  text-align: right !important;
}
::v-deep .el-form-item__content {
  margin-bottom: 12px !important;
}
::v-deep .el-dialog {
  height: 500px;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 135px);
  }
}
</style>
