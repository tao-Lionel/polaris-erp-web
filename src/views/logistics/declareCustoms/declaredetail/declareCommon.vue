<template>
  <div id="cus-common">
    <a class="title">{{ commonTitle }}</a>
    <div class="common-container">
      <el-form
        :model="commonRuleForm"
        :rules="rules"
        ref="commonRuleForm"
        size="mini"
        label-width="100px"
        :disabled="disableForm"
        class="common-ruleForm"
      >
        <div class="importantTop">
          <el-form-item label="合同协议号:" prop="contractNumber">
            <el-input v-model="commonRuleForm.contractNumber"></el-input>
          </el-form-item>
          <el-form-item label="运输方式:" prop="transportModeId">
            <el-select v-model="commonRuleForm.transportModeId" placeholder="">
              <el-option
                v-for="(transforMode, index) in transforModeList"
                :key="index"
                :label="transforMode.transportModeName"
                :value="transforMode.transportModeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="离境口岸:" prop="exitPort">
            <el-input v-model="commonRuleForm.exitPort"></el-input>
          </el-form-item>
          <el-form-item label="出境关别:" prop="customsExit">
            <el-input v-model="commonRuleForm.customsExit"></el-input>
          </el-form-item>
          <el-form-item label="毛重:" prop="totalRoughWeight">
            <el-input v-model="commonRuleForm.totalRoughWeight"></el-input>
          </el-form-item>
          <el-form-item label="净重:" prop="totalNetWeight">
            <el-input v-model="commonRuleForm.totalNetWeight"></el-input>
          </el-form-item>
          <el-form-item label="签约地:" prop="signContractSite">
            <el-input v-model="commonRuleForm.signContractSite"></el-input>
          </el-form-item>
          <el-form-item label="币别:" prop="currency">
            <el-select v-model="commonRuleForm.currency" placeholder="">
              <el-option
                v-for="(currency, index) in currencyList"
                :key="index"
                :label="currency.currency"
                :value="currency.currency"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="贸易国:" prop="tradeCountryId">
            <el-select v-model="commonRuleForm.tradeCountryId" placeholder="">
              <el-option
                v-for="(country, index) in countryList"
                :key="index"
                :label="country.countryShortName"
                :value="country.countryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运抵国:" prop="destinateCountryId">
            <el-select v-model="commonRuleForm.destinateCountryId" placeholder="">
              <el-option
                v-for="(country, index) in countryList"
                :key="index"
                :label="country.countryShortName"
                :value="country.countryId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的国:" prop="goalCountryId">
            <el-select v-model="commonRuleForm.goalCountryId" placeholder="">
              <el-option
                v-for="(country, index) in countryList"
                :key="index"
                :label="country.countryShortName"
                :value="country.countryId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="btn-mid">
          <el-button
            type="text"
            class="arrowBtn"
            @click="showClick()"
            icon="el-icon-caret-bottom"
            v-if="!show"
          ></el-button>
          <el-button type="text" class="arrowBtn" @click="showClick()" icon="el-icon-caret-top" v-if="show"></el-button>
        </div>
        <el-collapse-transition>
          <!--其他信息-->
          <div class="otherBottomDetail" v-show="show">
            <el-form-item label="境外收货人:" prop="outboundConsignee">
              <el-input v-model="commonRuleForm.outboundConsignee"></el-input>
            </el-form-item>
            <el-form-item label="监管方式:" prop="regulatoryMode">
              <el-input v-model="commonRuleForm.regulatoryMode"></el-input>
            </el-form-item>
            <el-form-item label="征免性质:" prop="exemptionProperty">
              <el-input v-model="commonRuleForm.exemptionProperty"></el-input>
            </el-form-item>
            <el-form-item label="包装种类:" prop="packageType">
              <el-input v-model="commonRuleForm.packageType"></el-input>
            </el-form-item>
            <el-form-item label="件数:" prop="packageSum">
              <el-input v-model="commonRuleForm.packageSum" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="成交方式:" prop="bargainType">
              <el-input v-model="commonRuleForm.bargainType"></el-input>
            </el-form-item>
            <el-form-item label="随附单证及编号:" prop="accompanyDocNo">
              <el-input v-model="commonRuleForm.accompanyDocNo"></el-input>
            </el-form-item>
            <el-form-item label="标记唛码及备注:" prop="markNoRemark">
              <el-input v-model="commonRuleForm.markNoRemark"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </el-form>
    </div>
    <div class="com-bottom">
      <el-button
        type="primary"
        class="btn-save"
        size="small"
        :disabled="disableForm"
        @click="saveDecClick()"
        v-if="permissions.cusDeclare_save_declare"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getBseCurrencyAll } from "@/api/baseSetup/bsecurrency"
import { getAll as getBsetransportmodesAll } from "@/api/baseSetup/bsetransportmodes"
import { mapGetters } from "vuex"
export default {
  name: "declareCommon",
  components: {},
  data() {
    return {
      commonRuleForm: this.declareCustom,
      rules: this.rulesProp,
      myNumberNo: this.numberNo,
      countryList: [],
      currencyList: [],
      transforModeList: [],
      show: false,
      disableForm: this.displayAud,
      commonTitle: this.commonTitleFr
    }
  },
  props: {
    numberNo: String,
    declareCustom: Object,
    rulesProp: Object,
    displayAud: Boolean,
    commonTitleFr: String
  },
  updated() {
    // this.commonRuleForm = this.declareCustom;
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      if (!this.countryList || this.countryList.length == 0) {
        getCountry().then((res) => {
          this.countryList = res.data.data
        })
      }
      if (!this.currencyList || this.currencyList.length == 0) {
        getBseCurrencyAll().then((res) => {
          this.currencyList = res.data.data
        })
      }
      if (!this.transforModeList || this.transforModeList.length == 0) {
        getBsetransportmodesAll().then((res) => {
          this.transforModeList = res.data.data
        })
      }
    },
    saveDecClick() {
      this.$refs.commonRuleForm.validate((valid) => {
        if (valid) {
          this.$emit("saveClick", this.commonRuleForm)
        }
      })
    },
    showClick() {
      this.show = !this.show
    },
    displayFn(bool) {
      this.disableForm = bool
    }
  }
}
</script>
<style lang="scss">
@import "./declareCommon.scss";
</style>
