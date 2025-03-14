<template>
  <div class="ruleEngineBaseMsg">
    <p class="ruleEngineBaseMsg-title" v-show="logisticsArr.length">仓储物流</p>
    <div>
      <template v-for="item in logisticsArr">
        <el-form-item v-if="!item.isValidate" :label="item.title + ':'" :key="item.key" :prop="item.key">
          <template v-if="item.type === 'textarea'">
            <el-input
              v-model="orderData[item.key]"
              type="textarea"
              :placeholder="item.placeholder"
              :disabled="isDisabled"
              :rows="3"
              @change="handleChange($event, item)"
            ></el-input>
            <el-popover
              v-if="item.key == 'receivingProvince'"
              placement="top-start"
              width="200"
              trigger="click"
              :content="receivingProvinceDetail"
            >
              <el-button slot="reference" type="text" @click="handelCheck">查看</el-button>
            </el-popover>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="orderData[item.key]"
              :placeholder="'请选择' + item.title"
              multiple
              filterable
              clearable
              :disabled="isDisabled"
            >
              <el-option :label="item.label" :value="item.value" v-for="item in options" :key="item.value"> </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'input'">
            <el-row>
              <el-col :span="6">
                <el-select v-model="orderData[item.key].type" class="logistics-select" placeholder="请选择">
                  <el-option label="包含" value="CONTAINS"></el-option>
                  <el-option label="不包含" value="NOT_CONTAINS"></el-option>
                </el-select>
              </el-col>
              <el-col :span="18">
                <el-input placeholder="请输入地址1" v-model="orderData[item.key].content" size="small"> </el-input>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item v-else :label="item.title + ':'" :key="item.key" required>
          <div class="textarea-main">
            <el-form-item :prop="item.validateOne">
              <div class="textarea-first" style="margin-bottom: 0px">
                <el-checkbox
                  :disabled="isDisabled"
                  v-model="zipCodeStatus.isPostalCodeStartWith"
                  style="margin-right: 10px"
                  @change="changeZipCodeSt($event, 'isPostalCodeStartWith')"
                  >收货邮编开头</el-checkbox
                >
                <el-input
                  :disabled="!zipCodeStatus.isPostalCodeStartWith || isDisabled"
                  v-model="orderData[item.validateOne]"
                  type="textarea"
                  placeholder="仅支持输入数字、英文字母、中划线、*和空格，多个邮编用英文,隔开"
                  @blur="checkType(item.validateOne)"
                  :rows="3"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item :prop="item.validateTwo">
              <div class="textarea-first">
                <el-checkbox
                  :disabled="isDisabled"
                  v-model="zipCodeStatus.isPostalCodeInclude"
                  style="margin-right: 10px"
                  @change="changeZipCodeSt($event, 'isPostalCodeInclude')"
                  >收货邮编包含</el-checkbox
                >
                <el-input
                  :disabled="!zipCodeStatus.isPostalCodeInclude || isDisabled"
                  v-model="orderData[item.validateTwo]"
                  type="textarea"
                  placeholder="仅支持输入数字、英文字母、中划线、*和空格，多个邮编用英文,隔开"
                  @blur="checkType(item.validateTwo)"
                  :rows="3"
                ></el-input>
              </div>
            </el-form-item>
            <el-checkbox :disabled="isDisabled" v-model="orderData.twoMeetOneFlag" style="margin: 0 10px 20px 0"
              >两项满足其一项</el-checkbox
            >
            <el-form-item :prop="item.validateThree">
              <div class="textarea-two">
                <el-checkbox
                  :disabled="isDisabled"
                  v-model="zipCodeStatus.isSpecifyPostalCode"
                  style="margin-right: 10px"
                  @change="changeZipCodeSt($event, 'isSpecifyPostalCode')"
                  >指定收货邮编</el-checkbox
                >
                <el-input
                  :disabled="!zipCodeStatus.isSpecifyPostalCode || isDisabled"
                  v-model="orderData[item.validateThree]"
                  type="textarea"
                  placeholder='支持输入数字、英文字母、中划线、*和空格，多个邮编用英文,隔开；支持设置邮编范围，用英文"~"分割，距离：1970~1975'
                  @blur="checkType(item.validateThree)"
                  :rows="3"
                ></el-input>
                <div class="el-form-item__error" v-show="zipCodeStatus.validateThreeShow">
                  指定收货邮编仅支持输入数字、英文字母、中划线、英文~和空格
                </div>
              </div>
            </el-form-item>
            <el-form-item :prop="item.validateFour">
              <div class="textarea-two">
                <el-checkbox
                  :disabled="isDisabled"
                  v-model="zipCodeStatus.isExcludePostalCode"
                  style="margin-right: 10px"
                  @change="changeZipCodeSt($event, 'isExcludePostalCode')"
                  >排除收货邮编</el-checkbox
                >
                <el-input
                  :disabled="!zipCodeStatus.isExcludePostalCode || isDisabled"
                  v-model="orderData[item.validateFour]"
                  type="textarea"
                  placeholder='支持输入数字、英文字母、中划线、*和空格，多个邮编用英文,隔开；支持设置邮编范围，用英文"~"分割，距离：1970~1975'
                  @blur="checkType(item.validateFour)"
                  :rows="3"
                ></el-input>
                <div class="el-form-item__error" v-show="zipCodeStatus.validateFourShow">
                  排除收货邮编仅支持输入数字、英文字母、中划线、英文~和空格
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form-item>

        <div v-if="false" :key="item.key">
          <template v-if="item.type === 'checkboxTextarea'">
            <div style="display: flex">
              <div class="ruleEngineBaseMsg--elForm-modify">
                <span style="color: red; margin-right: 3px">*</span>{{ item.title }}:
              </div>
              <div class="ruleEngineBaseMsg-textarea" style="flex: 1">
                <div class="textarea-main">
                  <div class="textarea-first" style="margin-bottom: 20px">
                    <el-checkbox
                      v-model="isOne"
                      style="margin-right: 10px"
                      @change="changeZipCodeSt($event, 'validateOneShow')"
                      >收货邮编开头</el-checkbox
                    >
                    <el-input
                      :disabled="!isOne"
                      v-model="orderData[item.validateOne]"
                      type="textarea"
                      placeholder="仅支持输入数字、英文字母、中划线和空格，多个换行输入"
                      @blur="checkType(item.validateOne)"
                      :rows="3"
                    ></el-input>
                    <div class="el-form-item__error" v-show="zipCodeStatus.validateOneShow">
                      收货邮编开头仅支持输入数字、英文字母、中划线和空格
                    </div>
                  </div>
                  <div class="textarea-first">
                    <el-checkbox
                      v-model="isTwo"
                      style="margin-right: 10px"
                      @change="changeZipCodeSt($event, 'validateTwoShow')"
                      >收货邮编包含</el-checkbox
                    >
                    <el-input
                      :disabled="!isTwo"
                      v-model="orderData[item.validateTwo]"
                      type="textarea"
                      placeholder="仅支持输入数字、英文字母、中划线和空格，多个换行输入"
                      @blur="checkType(item.validateTwo)"
                      :rows="3"
                    ></el-input>
                    <div class="el-form-item__error" v-show="zipCodeStatus.validateTwoShow">
                      收货邮编包含仅支持输入数字、英文字母、中划线和空格
                    </div>
                  </div>
                  <el-checkbox v-model="orderData.twoMeetOneFlag" style="margin-right: 10px; margin-top: 15px"
                    >两项满足其一项</el-checkbox
                  >
                </div>
                <div class="textarea-two">
                  <el-checkbox
                    v-model="isThree"
                    style="margin-right: 10px"
                    @change="changeZipCodeSt($event, 'validateThreeShow')"
                    >指定收货邮编</el-checkbox
                  >
                  <el-input
                    :disabled="!isThree"
                    v-model="orderData[item.validateThree]"
                    type="textarea"
                    placeholder='支持输入数字、英文字母、中划线和空格，多个换行输入；支持设置邮编范围，用英文"~"分割，距离：1970~1975'
                    @blur="checkType(item.validateThree)"
                    :rows="3"
                  ></el-input>
                  <div class="el-form-item__error" v-show="zipCodeStatus.validateThreeShow">
                    指定收货邮编仅支持输入数字、英文字母、中划线、英文~和空格
                  </div>
                </div>
                <div class="textarea-two">
                  <el-checkbox
                    v-model="isFour"
                    style="margin-right: 10px"
                    @change="changeZipCodeSt($event, 'validateFourShow')"
                    >排除收货邮编</el-checkbox
                  >
                  <el-input
                    :disabled="!isFour"
                    v-model="orderData[item.validateFour]"
                    type="textarea"
                    placeholder='支持输入数字、英文字母、中划线和空格，多个换行输入；支持设置邮编范围，用英文"~"分割，距离：1970~1975'
                    @blur="checkType(item.validateFour)"
                    :rows="3"
                  ></el-input>
                  <div class="el-form-item__error" v-show="zipCodeStatus.validateFourShow">
                    排除收货邮编仅支持输入数字、英文字母、中划线、英文~和空格
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getPrdCalculateRuleDetail } from "@/api/baseSetup/bseplatformtype"
// import { } from '@/const/crud/order/orderRule/orderRule'

import { deepClone } from "../../../../util/util"
export default {
  name: "baseMsg",
  props: {
    logisticsArr: {
      type: Array,
      default: function () {
        return []
      }
    },
    orderData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    zipCodeStatus: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isDisabled: false
  },
  data() {
    return {
      options: [],
      statusObj: {
        isPostalCodeStartWith: "postalCodeStartWith",
        isPostalCodeInclude: "postalCodeInclude",
        isSpecifyPostalCode: "specifyPostalCode",
        isExcludePostalCode: "excludePostalCode"
      },
      receivingProvinceDetail: ""
    }
  },
  watch: {
    orderData(val) {
      for (let key in this.statusObj) {
        if (this.orderData[this.statusObj[key]].length) {
          if (this.statusObj[key] === "postalCodeStartWith") {
            this.zipCodeStatus.isPostalCodeStartWith = true
          } else if (this.statusObj[key] === "postalCodeInclude") {
            this.zipCodeStatus.isPostalCodeInclude = true
          } else if (this.statusObj[key] === "specifyPostalCode") {
            this.zipCodeStatus.isSpecifyPostalCode = true
          } else if (this.statusObj[key] === "excludePostalCode") {
            this.zipCodeStatus.isExcludePostalCode = true
          }
        }
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    baseInsert() {
      // this.$emit('baseInsert', this.baseMsg)
    },
    checkType(keyName) {},
    changeZipCodeSt(val, key) {
      this.zipCodeStatus[key] = val
      if (!val) {
        this.orderData[this.statusObj[key]] = []
      }
    },
    handleChange(val, item) {
      if (item.key == "receivingProvince") {
        console.log("this.orderData[item.key]", this.orderData[item.key].split("\n"))
        this.receivingProvinceDetail = this.orderData[item.key].split("\n").join("，")
      }
    },
    handelCheck() {
      this.receivingProvinceDetail = this.orderData["receivingProvince"].split("\n").join("，")
    }
  }
}
</script>

<style lang="scss" scoped>
.ruleEngineBaseMsg-title {
  font-size: 14px;
  font-weight: bold;
  position: relative;
  margin-left: 10px;
  margin-bottom: 30px;
  &:before {
    content: "";
    position: absolute;
    left: -10px;
    top: 3px;
    bottom: 3px;
    width: 2px;
    background: blue;
  }
}
.ruleEngineBaseMsg {
  .textarea-main {
    background: #f7f9fb;
    border-radius: 4px;
    padding: 10px 10px 10px;
    .textarea-first {
      display: flex;
      position: relative;
    }
    .textarea-two {
      display: flex;
      background: #f7f9fb;
      position: relative;
    }
    .el-checkbox__label {
      font-size: 12px;
      padding-left: 6px;
    }
  }
}

::v-deep .logistics-select .el-input--mini .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
</style>
