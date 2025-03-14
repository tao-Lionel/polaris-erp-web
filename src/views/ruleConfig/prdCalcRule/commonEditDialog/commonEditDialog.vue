<template>
  <div class="form">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="48%" :before-close="handleClose">
      <el-form v-if="dialogVisible" ref="form" :model="newFormFiled" label-position="left" label-width="70px">
        <el-form-item
          v-for="(item, index) in formDataList"
          :key="index"
          :label="item.label"
          :prop="item.name"
          :rules="
            item.name === 'salesSite' || item.name === 'districtId'
              ? { validator: validateFields, triger: 'blur', type: 'number' }
              : item.rule
          "
        >
          <template v-if="item.type === 'tag'">
            <el-tag>{{ newFormFiled[item.name] }}</el-tag>
          </template>
          <template v-if="item.type === 'select'">
            <el-select
              v-model="newFormFiled[item.name]"
              @change="handleChange(item.name, newFormFiled[item.name])"
              :disabled="title !== '新增' && title !== '复制规则'"
              clearable
            >
              <el-option
                v-for="item in item.option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-if="item.type === 'input'" minwidth="200">
            <el-input
              type="number"
              v-model="newFormFiled[item.name]"
              v-if="
                item.name === '54' ||
                item.name === '56' ||
                item.name === '57' ||
                item.name === 'managementFeeRate' ||
                item.name === 'tariffRate'
              "
            >
              <template slot="append">%</template>
            </el-input>
            <el-input v-model="newFormFiled[item.name]" v-else-if="item.name !== 'name'"> </el-input>

            <el-input v-model="newFormFiled[item.name]" v-else> </el-input>
          </template>
          <template v-if="item.type === 'cascader'">
            <el-cascader
              expand-trigger="hover"
              :prop="{ multiple: true }"
              v-model="newFormFiled[item.name]"
              :show-all-levels="false"
              :options="item.option"
              :disabled="title !== '新增' && title !== '复制规则'"
              @change="handleChange(item.name, newFormFiled[item.name])"
            ></el-cascader>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "commonDialog",
  components: {},
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    },
    formDataList: Array,
    formFiled: Object
  },
  data() {
    return {
      savename: "",
      commonData: {},
      newFormFiled: this.formFiled,
      ruleUni: [{ validator: this.validateFields, triger: "blur", type: "number" }]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit("update:visible", val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    validateFields(rule, value, callback) {
      if (!this.newFormFiled.salesSite && !this.newFormFiled.districtId) {
        callback(new Error("区域和站点必须至少填写一个"))
      }
      callback()
    },
    //通过value寻找对应的label
    getLabelByValue(options, value) {
      const option = options.find((item) => item.value === value)
      return option ? option.label : ""
    },

    //级联选择找label
    getLabelByValueCasc(options, value) {
      let targetOption = options
      for (let i = 0; i < value.length; i++) {
        targetOption = targetOption.find((option) => option.value === value[i])
        if (!targetOption) {
          return ""
        }
        if (targetOption.children) {
          targetOption = targetOption.children
        }
      }
      return targetOption ? targetOption.label : ""
    },
    cancelDialog() {
      this.$refs.form.resetFields()
      this.$emit("clearData", {})
      this.$emit("clearSiteOptions", [])
      this.dialogVisible = false
    },

    setData() {
      console.log(this.formFiled.salesSite)
      this.$refs.form.validate((valid) => {
        switch (this.title) {
          case "新增":
            this.commonData = {
              name: this.newFormFiled.name,
              salesModel: this.newFormFiled.salesModel,
              platformId: this.newFormFiled.platformId,
              districtId: this.newFormFiled.districtId,
              supplierNo: this.newFormFiled.supplierNo,
              // category: this.newFormFiled.category,
              // brand: this.newFormFiled.brand,
              salesSite: this.newFormFiled.salesSite,
              currency: this.newFormFiled.currency
            }
            break
          case "物流配置":
            this.commonData = {
              checkStatus: this.formFiled.checkStatus,
              tariffRate: (this.newFormFiled.tariffRate / 100).toFixed(4)
            }
            break
          case "财务配置":
            this.commonData = {
              checkStatus: this.formFiled.checkStatus,
              managementFeeRate: (this.newFormFiled.managementFeeRate / 100).toFixed(4)
            }
            break
          case "产品编辑":
            this.commonData = {
              promotionExpensesRateList: [
                { brandId: 54, promotionExpensesRate: (this.newFormFiled["54"] / 100).toFixed(4) },
                { brandId: 56, promotionExpensesRate: (this.newFormFiled["56"] / 100).toFixed(4) },
                { brandId: 57, promotionExpensesRate: (this.newFormFiled["57"] / 100).toFixed(4) }
              ],
              name: this.newFormFiled.name
            }
            break
          case "运营编辑":
            this.commonData = {
              name: this.newFormFiled.name
            }
            break
          case "复制规则":
            this.commonData = {
              promotionExpensesRateList: this.newFormFiled.promotionExpensesRateList,
              name: this.newFormFiled.name,
              salesModel: this.newFormFiled.salesModel,
              platformId: this.newFormFiled.platformId,
              // category: this.newFormFiled.category,
              // brand: this.newFormFiled.brand,
              salesSite: this.newFormFiled.salesSite,
              supplierNo: this.newFormFiled.supplierNo,
              currency: this.newFormFiled.currency
            }
            break
          default:
            break
        }
        if (valid) {
          console.log("data", this.commonData)
          this.$emit("getSonData", this.commonData)
        } else {
          this.$message.error("请检查填写数据是否有误")
        }
      })
    },
    handleChange(name, val) {
      console.log("name", name, val)

      if (name === "platformId") {
        this.formFiled.salesSite = null
      }
      this.$emit("changePlat", { name, val })
      if (
        this.newFormFiled.platformId &&
        this.newFormFiled.salesModel &&
        this.newFormFiled.currency &&
        //  && this.newFormFiled.brand && this.newFormFiled.category[0]
        // && this.newFormFiled.salesSite
        this.newFormFiled.supplierNo
      ) {
        console.log("formDataList", this.formDataList)
        let platformIdLabel = this.getLabelByValue(this.formDataList[0].option, this.newFormFiled.platformId)
        let salesSiteLabel = this.getLabelByValue(this.formDataList[2].option, this.newFormFiled.salesSite)
        let districtLabel = this.getLabelByValue(this.formDataList[1].option, this.newFormFiled.districtId)
        // let brandLabel = this.getLabelByValue(this.formDataList[4].option, this.newFormFiled.brand)
        // let categoryLabel = this.getLabelByValueCasc(this.formDataList[5].option, this.newFormFiled.category)
        let supplierLabel = this.getLabelByValue(this.formDataList[4].option, this.newFormFiled.supplierNo)
        // console.log('categoryLabel', categoryLabel)
        // console.log('category', this.newFormFiled.category)
        // if (this.newFormFiled.districtId === 8) {
        //   salesSiteLabel = 'EU'
        // }

        this.newFormFiled.name = `${platformIdLabel}-${districtLabel === "欧洲地区" ? districtLabel : salesSiteLabel}-${this.newFormFiled.salesModel}-${this.newFormFiled.currency}-${supplierLabel}`
        this.savename = this.newFormFiled.name
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  },
  watch: {
    formFiled: {
      handler(newVal) {
        this.newFormFiled = newVal
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 80px;
}

.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .el-form-item {
    flex: 1 35%;
  }
}
</style>
