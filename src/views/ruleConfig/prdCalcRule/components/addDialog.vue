<template>
  <el-dialog v-if="showDialog" :title="title" :visible.sync="showDialog" width="1000px" max-height="400px" center>
    <div>
      <el-form ref="form" :model="form" label-position="left" label-width="70px" :rules="rules" id="addDialog">
        <detail-wrapper :options="{ title: '基础信息' }">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="platformId" label="平台">
                <el-select
                  v-model="form.platformId"
                  size="small"
                  placeholder="请选择平台"
                  clearable
                  :disabled="disabled"
                  @change="changePlatform"
                >
                  <el-option
                    v-for="item in platformOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="salesSite" label="销售站点">
                <el-select
                  v-model="form.salesSite"
                  size="small"
                  placeholder="请选择销售站点"
                  clearable
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in salesSiteOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="districtId" label="区域">
                <el-select
                  v-model="form.districtId"
                  size="small"
                  placeholder="请选择区域"
                  clearable
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in bsedistrictOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="salesModel" label="模式">
                <el-select
                  v-model="form.salesModel"
                  size="small"
                  placeholder="请选择模式"
                  clearable
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in salesModelOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="currency" label="币种">
                <el-select v-model="form.currency" size="small" placeholder="请选择币种" clearable :disabled="disabled">
                  <el-option
                    v-for="item in currencyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplierNo" label="供应商">
                <el-select
                  v-model="form.supplierNo"
                  size="small"
                  placeholder="请选择供应商"
                  clearable
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '费用比例' }">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="tariffRate" label="关税率">
                <el-input type="number" size="small" v-model="form.tariffRate" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="managementFeeRate" label="管理费用费比">
                <el-input type="number" size="small" v-model="form.managementFeeRate" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- <el-form-item prop="supplyPriceDiscount" label="供货价折扣率">
                <el-input type="number" size="small" v-model="form.supplyPriceDiscount" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item> -->
              <el-form-item prop="57" label="品牌S-推广费用费比">
                <el-input type="number" size="small" v-model="form['57']" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item prop="57" label="品牌S-推广费用费比">
                <el-input type="number" size="small" v-model="form['57']" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item prop="56" label="品牌N-推广费用费比">
                <el-input type="number" size="small" v-model="form['56']" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="54" label="品牌A-推广费用费比">
                <el-input type="number" size="small" v-model="form['54']" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="refundFeeRate" label="退款费费比">
                <el-input type="number" size="small" v-model="form.refundFeeRate" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="grossProfitRate" label="净利率">
                <el-input type="number" size="small" v-model="form.grossProfitRate" :disabled="disabled">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '规则名称' }">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="name" label="规则名称">
                <el-input v-model="form.name" size="small" :disabled="disabled"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button v-if="this.type !== 3" type="primary" size="small" @click="submitForm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { addObj } from "@/api/ruleConfig/prdCalcRule/prdCalcRule"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"

export default {
  name: "addDialog",
  components: {},
  props: {},
  data() {
    return {
      rules: {
        platformId: { required: true, message: "必须选择平台", triger: "blur", type: "number" },
        districtId: { validator: this.validateFields, triger: "blur", type: "string" },
        salesSite: { validator: this.validateFields, triger: "blur", type: "string" },
        salesModel: { required: true, message: "必须选择模式", type: "string" },
        supplierNo: { required: true, message: "必须填写供应商", triger: "blur" },
        currency: { required: true, message: "必须填写币种", triger: "blur" },
        name: { required: true, message: "规则名称不能为空" },
        tariffRate: [
          {
            required: true,
            validator: this.validateIsZero,
            message: "必须填写关税率",
            type: "number",
            triger: "blur"
          },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        managementFeeRate: [
          { required: true, validator: this.validateIsZero, message: "必须填写管理费用费比", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        54: [
          { required: true, validator: this.validateIsZero, message: "必须填写推广费用费比", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        57: [
          { required: true, validator: this.validateIsZero, message: "必须填写推广费用费比", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        56: [
          { required: true, validator: this.validateIsZero, message: "必须填写推广费用费比", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        grossProfitRate: [
          { required: true, validator: this.validateIsZero, message: "必须填写净利率", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ],
        // supplyPriceDiscount: [
        //   { required: true, validator: this.validateIsZero, message: "必须填写供货价折扣率", triger: "blur" },
        //   { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        // ],
        refundFeeRate: [
          { required: true, validator: this.validateIsZero, message: "必须填写退款费费比", triger: "blur" },
          { validator: this.validateNumber, message: "只能输入大于或等于0的数字！", triger: "blur" }
        ]
      },
      showDialog: false,
      form: {},
      platformOption: [],
      bsedistrictOptions: [],
      salesSiteOption: [],
      salesModelOption: [],
      supplierOptions: [],
      currencyOption: [],
      type: 1,
      row: {},
      title: "新增毛利测算规则",
      disabled: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    validateFields(rule, value, callback) {
      if (!this.form.salesSite && !this.form.districtId) {
        callback(new Error("区域和站点必须至少填写一个"))
      }
      callback()
    },
    validateIsZero(rule, value, callback) {
      if (value === 0 || value === "0" || /^\d+(\.\d+)?$/.test(value)) {
        callback()
      } else {
        callback(new Error("必须填写关税率"))
      }
    },
    //负数输入验证
    validateNumber(rule, value, callback) {
      if (value < 0) {
        callback(new Error("只能输入大于或等于0的数字！"))
      } else {
        callback()
      }
    },
    async openDialog(type, row, obj) {
      this.showDialog = true
      this.type = type
      this.row = row
      this.form = {}
      if (row && (type === 2 || type === 3)) {
        const {
          platformId,
          districtId,
          salesSite,
          salesModel,
          supplierNo,
          currency,
          name,
          tariffRate,
          managementFeeRate,
          grossProfitRate,
          // supplyPriceDiscount,
          refundFeeRate
          // id
        } = row

        if (row.platformId) {
          await this.getSite(row.platformId)
          console.log("this.salesSiteOption", this.salesSiteOption)
        }

        let brandObj = {}
        // 品牌S 品牌N 品牌A
        if (row.promotionExpensesRateList) {
          row.promotionExpensesRateList.forEach((item) => {
            brandObj[item.brandId] = (item.promotionExpensesRate * 100).toFixed(2)
          })
        }

        this.form = {
          platformId,
          districtId,
          salesSite: salesSite ? Number(salesSite) : "",
          salesModel,
          supplierNo,
          currency,
          name,
          tariffRate: (tariffRate * 100).toFixed(2),
          managementFeeRate: (managementFeeRate * 100).toFixed(2),
          grossProfitRate: (grossProfitRate * 100).toFixed(2),
          // supplyPriceDiscount: supplyPriceDiscount * 100,
          refundFeeRate: (refundFeeRate * 100).toFixed(2),
          // id,
          ...brandObj
        }
      }
      this.title = type === 1 ? "新增毛利测算规则" : type === 2 ? "复制规则" : "查看详情"
      this.disabled = type === 3
      this.platformOption = obj.platformOption
      this.bsedistrictOptions = obj.bsedistrictOptions
      // this.salesSiteOption = obj.salesSiteOption
      this.salesModelOption = obj.salesModelOption
      this.supplierOptions = obj.supplierOptions
      this.currencyOption = obj.currencyOption
    },
    changePlatform(val) {
      // this.form.salesSite = ""
      this.getSite(val)
    },
    async getSite(val) {
      this.salesSiteOption = []
      let res = await getSitInfoByPlatformId({ platformTypeId: val })
      if (res.data.code === 0) {
        let options = []
        res.data.data.forEach((item) => {
          options.push({
            value: item.bsePlatformSitId,
            label: item.sitEnName
          })
        })
        for (let i = 0; i < options.length; i++) {
          this.$set(this.salesSiteOption, i, options[i])
        }
      }
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let promotionExpensesRateList = [
            { brandId: 54, promotionExpensesRate: (this.form["54"] / 100).toFixed(4) },
            { brandId: 56, promotionExpensesRate: (this.form["56"] / 100).toFixed(4) },
            { brandId: 57, promotionExpensesRate: (this.form["57"] / 100).toFixed(4) }
          ]

          let tariffRate = (this.form.tariffRate / 100).toFixed(4)
          let managementFeeRate = (this.form.managementFeeRate / 100).toFixed(4)
          // let supplyPriceDiscount = (this.form.supplyPriceDiscount / 100).toFixed(4)
          let refundFeeRate = (this.form.refundFeeRate / 100).toFixed(4)
          let grossProfitRate = (this.form.grossProfitRate / 100).toFixed(4)
          let form = deepCloneIgnoreNull(this.form)
          Object.assign(form, {
            tariffRate,
            managementFeeRate,
            // supplyPriceDiscount,
            refundFeeRate,
            grossProfitRate,
            promotionExpensesRateList
          })
          console.log("form================", form)
          const { data } = await addObj({ ...form, checkStatus: "3" })
          if (data.data.code === 0) {
            this.$message.success("操作成功")
            this.showDialog = false
            this.$emit("updateData")
          } else {
            this.$message.error(data.data.msg)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#addDialog {
  ::v-deep .iod-target-top .el-form-item__error {
    bottom: -12px;
  }
  ::v-deep .det-content .el-row .el-col {
    padding-top: 10px;
    padding-bottom: 13px;
  }
}
</style>
