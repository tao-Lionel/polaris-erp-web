<template>
  <el-dialog :title="title" :visible="value" width="50%" @open="open" @close="addCancel" @closed="closed">
    <basic-container>
      <el-form
        ref="addTariffForm"
        :model="addTariffForm"
        :rules="addTariffFormRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="产品品类" prop="categoryId">
              <el-select
                v-model="addTariffForm.categoryId"
                size="small"
                filterable
                placeholder="产品品类"
                clearable
                @change="categoryIdChange"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item.categoryId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="海关编码" prop="targetCustomsCode">
              <el-input
                size="small"
                placeholder="请输入"
                v-search-input-trim
                clearable
                v-model="addTariffForm.targetCustomsCode"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="产地" prop="sourceCountryId">
              <el-select
                v-model="addTariffForm.sourceCountryId"
                size="small"
                placeholder="产地"
                clearable
                @change="sourceCountryIdChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.countryId"
                  :label="item.countryShortName"
                  :value="item.countryId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的国" prop="targetCountryId">
              <el-select
                v-model="addTariffForm.targetCountryId"
                size="small"
                placeholder="产地"
                clearable
                @change="targetCountryIdChange"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.countryId"
                  :label="item.countryShortName"
                  :value="item.countryId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="关税率" prop="tariffRate">
              <el-input size="small" placeholder="请输入" clearable v-model="addTariffForm.tariffRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="MPF" prop="mpf">
              <el-input size="small" placeholder="请输入" v-search-input-trim clearable v-model="addTariffForm.mpf">
                <template slot="append">%</template></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="HMF" prop="hmf">
              <el-input size="small" placeholder="请输入" v-search-input-trim clearable v-model="addTariffForm.hmf">
                <template slot="append">%</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反倾销税率" prop="antiDumpingRate">
              <el-input
                size="small"
                placeholder="请输入"
                v-search-input-trim
                clearable
                v-model="addTariffForm.antiDumpingRate"
              >
                <template slot="append">%</template></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="消费税率" prop="consumptionRate">
              <el-input
                size="small"
                placeholder="请输入"
                clearable
                v-search-input-trim
                v-model="addTariffForm.consumptionRate"
              >
                <template slot="append">%</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="addTariffForm.status" clearable size="small" placeholder="状态">
                <el-option label="正常" value="1"> </el-option>
                <el-option label="停用" value="0"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label-width="100px" label="备注" prop="remark">
              <el-input
                size="small"
                placeholder="请输入"
                v-search-input-trim
                clearable
                v-model="addTariffForm.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <p class="tips-text">说明：</p>
            <p class="tips-text">1、产品品类为系统已维护的最小品类</p>
            <p class="tips-text">2、增值税和消费税，统一为消费税</p>
            <p class="tips-text">3、根据【产品品类+产地+目的国】维护海关编码和关税率</p>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex-remark" style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="addCancel">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </basic-container>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { addOrUpdate } from "@/api/logistics/importTariff/index.js"
import { getAddTariffFormRules } from "./index"

export default {
  name: "addRemarkDialog",
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },
    categoryList: {
      default: () => []
    },
    countryList: {
      default: () => []
    },

    editRow: {
      default: () => {}
    },
    type: {
      default: () => ""
    },
    categoryId: {
      default: () => ""
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    editRow: {
      handler(val) {
        if (Object.keys(val).length !== 0) {
          this.addTariffForm = {
            // ...this.addTariffForm,
            ...val,
            tariffRate: Math.round(val.tariffRate * 100 * 10000) / 10000,
            mpf: Math.round(val.mpf * 100 * 10000) / 10000,
            hmf: Math.round(val.hmf * 100 * 10000) / 10000,
            antiDumpingRate: Math.round(val.antiDumpingRate * 100 * 10000) / 10000,
            consumptionRate: Math.round(val.consumptionRate * 100 * 10000) / 10000
          }
        }
      },
      deep: true
    },
    categoryId(val, oldVal) {
      if (val) {
        this.addTariffForm.categoryId = val
        this.categoryIdChange(val)
      }
    }
  },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      addTariffForm: {
        id: "",
        categoryId: "",
        categoryName: "",
        sourceCountry: "",
        sourceCountryId: "",
        sourceCountryName: "",
        targetCountry: "",
        targetCountryId: "",
        targetCountryName: "",
        targetCustomsCode: "",
        tariffRate: null,
        mpf: "",
        hmf: "",
        antiDumpingRate: "",
        consumptionRate: "",
        remark: ""
      },
      addTariffFormRules: getAddTariffFormRules({
        validateFloat: this.validateFloat,
        validateFloatTen: this.validateFloatTen,
        validateFloatFourDigit: this.validateFloatFourDigit
      }),
      title: "添加进口关税"
    }
  },
  methods: {
    validateFloatTen(rule, value, callback) {
      // 正则表达式匹配最多10位整数，可选的小数部分
      var reg = /^(?:\d{1,10})(\.\d+)?$/

      // 验证输入是否符合正则表达式
      if (reg.test(value)) {
        callback() // 验证通过
      } else {
        // 如果输入的整数部分超过10位或者输入的是非数字字符，则验证失败
        callback(new Error("整数部分不能超过10位"))
      }
    },
    /**是否非负数 */
    validateFloat(rule, value, callback) {
      var reg = /^\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入非负数"))
      }
    },
    /**最多保留4位小数 */
    validateFloatFourDigit(rule, value, callback) {
      var reg = /^\d+(\.\d{1,4})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留四位小数"))
      }
    },
    handleClose() {
      this.$emit("input", false)
    },

    addCancel() {
      this.$emit("input", false)
      this.$refs.addTariffForm.resetFields()
    },
    categoryIdChange(value) {
      const fItem = this.categoryList.find((item) => item.categoryId === value)
      this.addTariffForm.categoryName = fItem.categoryName || ""
    },
    sourceCountryIdChange(value) {
      const fItem = this.countryList.find((item) => item.countryId === value)
      this.addTariffForm.sourceCountry = fItem.countryCode || ""
      this.addTariffForm.sourceCountryName = fItem.countryShortName || ""
    },
    targetCountryIdChange(value) {
      const fItem = this.countryList.find((item) => item.countryId === value)
      this.addTariffForm.targetCountry = fItem.countryCode || ""
      this.addTariffForm.targetCountryName = fItem.countryShortName || ""
    },

    closed() {
      this.categoryId = ""
      this.type = ""
      this.editRow = {}
      this.addTariffForm = {
        id: "",
        categoryId: "",
        categoryName: "",
        sourceCountry: "",
        sourceCountryId: "",
        sourceCountryName: "",
        targetCountry: "",
        targetCountryId: "",
        targetCountryName: "",
        targetCustomsCode: "",
        tariffRate: null,
        mpf: "",
        hmf: "",
        antiDumpingRate: "",
        consumptionRate: "",
        remark: ""
      }
    },
    open() {
      if (this.type == "add") {
        this.title = "添加进口关税"
        this.editRow = {}
        this.addTariffForm.categoryId = ""
        this.$refs.addTariffForm.clearValidate()
      } else if (this.type === "totalAdd") {
        this.title = "添加进口关税"
        this.addTariffForm = {
          id: "",
          categoryId: "",
          categoryName: "",
          sourceCountry: "",
          sourceCountryId: "",
          sourceCountryName: "",
          targetCountry: "",
          targetCountryId: "",
          targetCountryName: "",
          targetCustomsCode: "",
          tariffRate: null,
          mpf: "",
          hmf: "",
          antiDumpingRate: "",
          consumptionRate: "",
          remark: ""
        }
        this.addTariffForm.categoryId = this.categoryId
        this.categoryIdChange(this.categoryId)
        this.$refs.addTariffForm.clearValidate()
      } else {
        this.title = "编辑进口关税"
      }
    },

    async handleSubmit() {
      await this.$refs.addTariffForm.validate()
      const postData = JSON.parse(JSON.stringify(this.addTariffForm))
      if (Object.keys(this.editRow).length === 0) {
        delete postData.id
      }
      // console.log("postData", postData)
      // return
      const res = await addOrUpdate(postData)
      if (res.data.code === 0) {
        this.$message.success("添加成功")
        this.$emit("input", false)
        this.$emit("success")
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-remark {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.tips-text {
  margin-left: 45px;
  color: rgb(153, 153, 153);
  line-height: 22px;
  font-weight: 400;
  font-size: 14px;
}
</style>
