<template>
  <div id="ruleEngineDetail">
    <div class="ruleEngineDetail-left">
      <el-form
        ref="form"
        class="ruleEngineDetail-left-form"
        label-position="left"
        :model="form"
        label-width="75px"
        :rules="formRule"
        size="mini"
      >
        <el-form-item label="规则名称:" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入规则名称" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="规则类型:" prop="scene">
          <el-select
            v-model="form.scene"
            placeholder="请选择规则类型"
            @change="choiceType"
            :disabled="isDisabled || $route.query.id"
          >
            <el-option :label="item.label" :value="item.value" v-for="item in ruleType" :key="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则状态:" prop="ruleStatus">
          <el-select v-model="form.ruleStatus" placeholder="请选择规则状态" :disabled="isDisabled">
            <el-option :label="item.label" :value="item.value" v-for="item in status" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p class="ruleEngineDetail-choice_title">可选条件</p>
      <div class="ruleEngineDetail-left-choice">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :name="index" v-for="(conditionItem, index) in conditionTitle" :key="index">
            <template slot="title" v-if="conditionObj[conditionItem.value]">
              <span class="left-choice-title">{{ conditionItem.title }}</span>
            </template>
            <div class="el-checkbox-group">
              <template v-for="(item, index) in conditionObj[conditionItem.value]">
                <el-checkbox
                  v-model="item.status"
                  :key="index"
                  @change="
                    choiceChange({
                      value: conditionItem.value,
                      key: item.key,
                      status: item.status,
                      type: item.type
                    })
                  "
                  :disabled="isDisabled"
                  >{{ item.title }}
                </el-checkbox>
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="ruleEngineDetail-right">
      <p class="right-title">已选条件</p>
      <div class="right-main">
        <el-form ref="orderData" :model="orderData" label-width="150px" size="mini" :rules="rules">
          <BaseMsg
            :baseMsgArr="baseMsgArr"
            :orderData="orderData"
            :orderAll="orderAll"
            :actionWarehouse="actionWarehouse"
            :pdCountStatus="pdCountStatus"
            :isDisabled="isDisabled"
          ></BaseMsg>
          <ProductMsg
            :productMsgArr="productMsgArr"
            :orderData="orderData"
            :isDisabled="isDisabled"
            :orderDataInstance="orderDataInstance"
          >
          </ProductMsg>
          <Logistics
            :logisticsArr="logisticsArr"
            :orderData="orderData"
            :zipCodeStatus="zipCodeStatus"
            :isDisabled="isDisabled"
          ></Logistics>
          <OrderMsg
            :orderMsgArr="orderMsgArr"
            :orderData="orderData"
            :isDisabled="isDisabled"
            @modify="modify"
          ></OrderMsg>
        </el-form>
        <el-form ref="actionData" :model="actionData" label-width="150px" size="mini" :rules="actionRule">
          <Action
            :ruleType="form.scene"
            :actionData="actionData"
            :actionWay="actionWay"
            :actionWarehouse="actionWarehouse"
            :logisticsChannel="logisticsChannel"
            :isDisabled="isDisabled"
          ></Action>
        </el-form>
      </div>
    </div>
    <div class="ruleEngineDetail__opeBtn">
      <el-button type="primary" @click="save" size="mini" style="padding: 10px 30px" v-if="isBatchEdit"
        >保存并继续编辑</el-button
      >
      <el-button type="primary" @click="save" size="mini" style="padding: 10px 30px" v-if="!isDisabled && !isBatchEdit"
        >保存</el-button
      >
      <el-button @click="cancel" size="mini" style="padding: 10px 30px" v-if="!isDisabled">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getPlaTypeAll,
  getObjByType,
  setWarehouseRule,
  splitOrderRule,
  logisticsChannelMatchingRule,
  comfirmOrderRule,
  markPendingConfirmationRule,
  craeteFoRule,
  distributeToThirdPartyWarehousesRule,
  setAutomaticSkuMatchRule,
  setPlatformDeliveryRule,
  getSitByPlatformTypeCodes,
  getStoreByPlatformTypeCodes,
  getAllWarehouse,
  getBseChannel,
  getAllCarriersV2,
  getWarehouseByTransportCarrierCode,
  getRuleVO
} from "@/api/order/orderRule"
import { formRule, actionRule } from "@/const/crud/order/orderRule/orderRule"

import BaseMsg from "@/views/order/orderRule/orderRuleComponents/baseMsg"
import Logistics from "@/views/order/orderRule/orderRuleComponents/logistics"
import OrderMsg from "@/views/order/orderRule/orderRuleComponents/orderMsg"
import Action from "@/views/order/orderRule/orderRuleComponents/action"
import ProductMsg from "@/views/order/orderRule/orderRuleComponents/productMsg"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

const keyObjs = {
  postalCodeStartWith: "isPostalCodeStartWith",
  postalCodeInclude: "isPostalCodeInclude",
  specifyPostalCode: "isSpecifyPostalCode",
  excludePostalCode: "isExcludePostalCode"
}
const validOrderPrd = (rule, value, callback) => {
  let reg = new RegExp(/^[a-zA-Z0-9\-\n ]+$/)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("仅支持输入数字、英文字母、中划线和空格"))
  }
}

export default {
  components: {
    BaseMsg,
    Logistics,
    OrderMsg,
    Action,
    ProductMsg
  },
  name: "ruleEngineDetail",
  data() {
    const validOne = (rule, value, callback) => {
      if (!value.length || !value) {
        if (!this.zipCodeStatus[keyObjs[rule.field]]) {
          callback()
        } else {
          callback(new Error(rule.field === "postalCodeStartWith" ? "请输入收货邮编开头" : "请输入邮编包含"))
        }
      } else {
        let reg = new RegExp(/^[a-zA-Z0-9\-\,\* ]+$/)
        reg.test(value) ? callback() : callback(new Error('仅支持输入数字、英文字母、中划线、*、英文","和空格'))
      }
    }
    const validTwo = (rule, value, callback) => {
      if (!value.length || !value) {
        if (!this.zipCodeStatus[keyObjs[rule.field]]) {
          callback()
        } else {
          callback(new Error(rule.field === "specifyPostalCode" ? "请输入指定收货邮编" : "请输入排除收货邮编"))
        }
      } else {
        let reg = new RegExp(/^[a-zA-Z0-9\-\,\*\~ ]+$/)
        reg.test(value)
          ? callback()
          : callback(new Error('仅支持输入数字、英文字母、中划线、*、英文","、空格和英文"~"'))
      }
    }
    const validAbove = (rule, value, callback) => {
      if (!this.pdCountStatus.isAbove) {
        callback()
        return
      }
      if (this.pdCountStatus.isAbove && !value) {
        callback(new Error("输入产品数量"))
      } else {
        let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
        if (!reg.test(value)) {
          callback(new Error("仅支持输入数字且首位不为0"))
          return
        }

        if (Number(this.orderData.productCount.lower)) {
          if (Number(this.orderData.productCount.above) >= Number(this.orderData.productCount.lower)) {
            callback(new Error("产品数量前者必须小于后者"))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    const validLower = (rule, value, callback) => {
      if (!this.pdCountStatus.isLower) {
        callback()
        return
      }
      if (this.pdCountStatus.isLower && !value) {
        callback(new Error("输入产品数量"))
      } else {
        let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
        if (!reg.test(value)) {
          callback(new Error("仅支持输入数字且首位不为0"))
          return
        }

        if (Number(this.orderData.productCount.above)) {
          if (Number(this.orderData.productCount.above) >= Number(this.orderData.productCount.lower)) {
            callback(new Error("产品数量前者必须小于后者"))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }

    // 验证函数
    var generateValidateProductAbove = (fieldKey) => {
      return (rule, value, callback) => {
        const num = Number(value)
        const [firstKey] = rule.field.split(".")
        const lower = this.orderData[firstKey].lower

        if (value === "") {
          callback(new Error("请输入"))
        } else if (typeof num === "number" && isNaN(num)) {
          callback(new Error("请输入数字"))
        } else if (num < Number(lower) && lower !== "") {
          callback(new Error("最大值不能小于最小值"))
        } else {
          callback()
        }
        // else if (num == Number(lower)) {
        //   callback(new Error("最大值最小值不允许相同"))
        // }
      }
    }

    var generateValidateProductLower = (fieldKey) => {
      return (rule, value, callback) => {
        const num = Number(value)
        const [firstKey] = rule.field.split(".")
        const above = this.orderData[firstKey].above

        if (value === "") {
          callback(new Error("请输入"))
        } else if (typeof num === "number" && isNaN(num)) {
          callback(new Error("请输入数字"))
        } else if (num > Number(above) && above !== "") {
          callback(new Error("最小值不能大于最大值"))
        } else {
          callback()
        }
        // else if (num == Number(above)) {
        //   callback(new Error("最大值最小值不允许相同"))
        // }
      }
    }

    // 动态生成规则函数
    const generateRules = (keyArray) => {
      let rules = {}
      keyArray.forEach((key) => {
        rules[`${key}.lower`] = [
          { required: true, trigger: "change", validator: generateValidateProductLower(key) },
          { validator: generateValidateProductLower(key), trigger: "change" }
        ]

        rules[`${key}.above`] = [
          { required: true, trigger: "change", validator: generateValidateProductAbove(key) },
          { validator: generateValidateProductAbove(key), trigger: "change" }
        ]
      })
      return rules
    }
    const keyArray = ["skuGrossWeight", "packageLength", "packageWidth", "packageHeight", "packageVolume"]

    const validateNumber = (rule, value, callback) => {
      if (!value) {
        callback() // 允许为空，直接通过校验
      } else if (isNaN(value)) {
        callback(new Error("请输入有效的数字")) // 输入的不是数字
      } else if (parseFloat(value) <= 0) {
        callback(new Error("数字必须大于0")) // 数字小于或等于0的错误
      } else {
        callback() // 校验通过
      }
    }
    return {
      conditions: {
        // 自动拆分订单
        SPLIT_ORDER: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
            // {
            //   title: '订单结构',
            //   status: false,
            //   type: 'select',
            //   key: 'orderStructure'
            // }
          ]
        },
        // 自动匹配仓库可选条件
        SET_WAREHOUSE: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            },
            {
              title: "建议物流渠道",
              status: false,
              type: "select",
              key: "suggestedLogisticsChannel",
              noMultiple: true
            }
          ],
          logistics: [
            {
              title: "收货国家/地区",
              status: false,
              placeholder: "收货国家/地区中存在的字符，多个规则换行输入",
              type: "textarea",
              key: "receivingCountry"
            },
            {
              title: "收货省/州",
              status: false,
              placeholder: "收货省/州中存在的字符，多个规则换行输入",
              type: "textarea",
              key: "receivingProvince"
            },
            {
              title: "收货城市",
              status: false,
              placeholder: "收货城市中存在的字符，多个规则换行输入",
              type: "textarea",
              key: "receivingCity"
            }
            // {
            //   title: '收货邮编',
            //   status: false,
            //   type: 'checkboxTextarea',
            //   isValidate: true,
            //   key: 'zipCode',
            //   validateOne: 'postalCodeStartWith',
            //   validateTwo: 'postalCodeInclude',
            //   validateThree: 'specifyPostalCode',
            //   validateFour: 'excludePostalCode',
            // },
          ],
          orderMsg: [
            {
              title: "订单产品",
              status: false,
              placeholder: "仅支持输入数字、英文字母、中划线和空格，多个换行输入",
              type: "textarea",
              key: "sku"
            }
          ]
        },
        // 自动匹配物流渠道
        LOGISTICS_CHANNEL_MATCHING: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            },
            {
              title: "仓库服务商",
              status: false,
              type: "select",
              key: "warehouseProviderCode",
              noMultiple: true
            },
            {
              title: "发货仓库",
              status: false,
              type: "select",
              key: "deliveryWarehouseId"
            },
            {
              title: "建议物流渠道",
              status: false,
              type: "select",
              key: "suggestedLogisticsChannel",
              noMultiple: true
            }
          ],
          productMsg: [
            {
              title: "产品毛重（kg）",
              status: false,
              placeholder: "小",
              type: "input",
              isValidate: true,
              key: "skuGrossWeight"
            },
            {
              title: "包装长（cm）",
              status: false,
              placeholder: "小",
              type: "input",
              isValidate: true,
              key: "packageLength"
            },
            {
              title: "包装宽（cm）",
              status: false,
              placeholder: "小",
              type: "input",
              isValidate: true,
              key: "packageWidth"
            },
            {
              title: "包装高（cm）",
              status: false,
              placeholder: "小",
              type: "input",
              isValidate: true,
              key: "packageHeight"
            },
            {
              title: "包装体积（cm³）",
              status: false,
              placeholder: "小",
              type: "input",
              isValidate: true,
              key: "packageVolume"
            },
            {
              title: "订单产品",
              status: false,
              placeholder: "请填写工厂SKU，多个则换行输入",
              type: "textarea",
              key: "logisticsChannelMatchingSku"
            }
          ],
          logistics: [
            {
              title: "地址1",
              status: false,
              type: "input",
              key: "address",
              noMultiple: true
            }
          ]
        },
        // 自动确认订单
        COMFIRM_ORDER: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ]
        },
        // 自动标记为待确认
        MARK_PENDING_CONFIRMATION: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ]
        },
        // 自动生成发货单
        CRAETE_FO: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ]
        },
        // 自动下第三方仓
        DISTRIBUTE_TO_THIRD_PARTY_WAREHOUSES: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ]
        },
        // 自动审核订单
        REVIEW_ORDER: {},
        // 自动订单标发
        ORDER_ISSUANCE: {},
        // 自动匹配SKU
        AUTOMATIC_SKU_MATCHING: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ]
        },
        // 自动回传平台发货
        PLATFORM_DELIVERY: {
          baseMsg: [
            {
              title: "订单来源",
              status: false,
              type: "select",
              key: "orderSource"
            },
            {
              title: "交货模式",
              status: false,
              type: "select",
              key: "salesModel"
            },
            {
              title: "平台",
              status: false,
              type: "select",
              key: "platform"
            },
            {
              title: "站点",
              status: false,
              type: "select",
              key: "salesSite"
            },
            {
              title: "店铺",
              status: false,
              type: "select",
              key: "store"
            },
            {
              title: "产品数量",
              status: false,
              type: "inputProductCount",
              key: "productCount",
              isValidate: true
            },
            {
              title: "发货方式",
              status: false,
              type: "select",
              key: "deliveryMethod",
              noMultiple: true
            }
          ],
          orderMsg: [
            {
              title: "下单时间（北京时间）",
              status: false,
              placeholder: "",
              type: "inputOrderTime",
              key: "platformOrderTime"
            },
            {
              title: "要求发货时间（北京时间）",
              status: false,
              placeholder: "",
              type: "inputDeliveryTime",
              key: "requireDeliveryTime"
            }
          ]
        }
      },
      form: {
        id: "",
        ruleName: "",
        scene: "SPLIT_ORDER",
        // scene: "SET_WAREHOUSE",
        ruleStatus: "1"
      },
      activeNames: [0, 1, 2, 3],
      ruleType: [],
      conditionTitle: [
        { title: "基础信息", value: "baseMsg" },
        { title: "产品信息", value: "productMsg" },
        { title: "仓储物流", value: "logistics" },
        { title: "订单信息", value: "orderMsg" }
      ],
      status: [],
      conditionObj: {},

      baseMsgArr: [],
      logisticsArr: [],
      orderMsgArr: [],
      productMsgArr: [],

      orderData: {
        orderSource: [], // 订单来源
        salesModel: [], // 订单类型
        platform: [], // 平台
        salesSite: [], // 站点
        store: [], // 店铺
        orderStructure: [], // 订单结构
        productClassify: [], // 产品分类
        deliveryMethod: "",
        warehouseProviderCode: "",
        deliveryWarehouseId: [],
        suggestedLogisticsChannel: "",

        receivingCountry: [],
        receivingProvince: [],
        receivingCity: [],
        twoMeetOneFlag: false,
        postalCodeStartWith: [],
        postalCodeInclude: [],
        specifyPostalCode: [],
        excludePostalCode: [],

        productCount: {
          above: "",
          lower: "",
          aboveType: "",
          lowerType: ""
        }, // 产品数量
        skuGrossWeight: {
          above: "",
          lower: "",
          aboveType: "LE",
          lowerType: "GE"
        },
        packageLength: {
          above: "",
          lower: "",
          aboveType: "LE",
          lowerType: "GE"
        },
        packageWidth: {
          above: "",
          lower: "",
          aboveType: "LE",
          lowerType: "GE"
        },
        packageHeight: {
          above: "",
          lower: "",
          aboveType: "LE",
          lowerType: "GE"
        },
        packageVolume: {
          above: "",
          lower: "",
          aboveType: "LE",
          lowerType: "GE"
        },
        address: {
          content: "",
          type: "CONTAINS"
        },
        logisticsChannelMatchingSku: [], // sku
        platformOrderTime: "",
        requireDeliveryTime: ""
      },
      rules: {
        salesModel: [{ required: true, message: "请选择订单类型", trigger: "change" }],
        orderSource: [{ required: true, message: "请选择订单来源", trigger: "change" }],
        platform: [{ required: true, message: "请选择平台", trigger: "change" }],
        salesSite: [{ required: true, message: "请选择站点", trigger: "change" }],
        store: [{ required: true, message: "请选择店铺", trigger: "change" }],
        deliveryMethod: [{ required: true, message: "请选择发货方式", trigger: "change" }],
        suggestedLogisticsChannel: [{ required: true, message: "请选择建议物流渠道", trigger: "change" }],
        warehouseProviderCode: [{ required: true, message: "请选择仓库服务商", trigger: "change" }],
        deliveryWarehouseId: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
        orderStructure: [{ required: true, message: "请选择订单结构", trigger: "change" }],
        "productCount.above": [
          { required: true, trigger: "blur", validator: validAbove },
          { validator: validAbove, trigger: "blur" }
        ],
        "productCount.lower": [
          { required: true, trigger: "blur", validator: validLower },
          { validator: validLower, trigger: "blur" }
        ],
        // "skuGrossWeight.lower": [
        //   { required: true, trigger: "change", validator: validateProductLower },
        //   { validator: validateProductLower, trigger: "change" }
        // ],
        // "skuGrossWeight.above": [
        //   { required: true, trigger: "change", validator: validateProductAbove },
        //   { validator: validateProductAbove, trigger: "change" }
        // ],
        ...generateRules(keyArray),
        receivingCountry: [{ required: true, message: "请输入收货国家/地区", trigger: "blur" }],
        receivingProvince: [{ required: true, message: "请输入收货省/州", trigger: "blur" }],
        receivingCity: [{ required: true, message: "请输入收货城市", trigger: "blur" }],
        postalCodeStartWith: [
          { required: true, trigger: "blur", validator: validOne },
          { validator: validOne, trigger: "blur" }
        ],
        postalCodeInclude: [
          { required: true, trigger: "blur", validator: validOne },
          { validator: validOne, trigger: "blur" }
        ],
        specifyPostalCode: [
          { required: true, trigger: "blur", validator: validTwo },
          { validator: validTwo, trigger: "blur" }
        ],
        excludePostalCode: [
          { required: true, trigger: "blur", validator: validTwo },
          { validator: validTwo, trigger: "blur" }
        ],
        sku: [
          { required: true, message: "请输入订单产品", trigger: "blur" },
          { validator: validOrderPrd, trigger: "blur" }
        ],
        logisticsChannelMatchingSku: [{ required: true, message: "请填写工厂SKU", trigger: "blur" }],
        platformOrderTime: [{ required: true, validator: validateNumber, trigger: "blur" }],
        requireDeliveryTime: [{ required: true, validator: validateNumber, trigger: "blur" }]
      },
      formRule: formRule,
      actionData: {
        action: "1",
        delayedHours: "",
        excuteFlags: true,
        splitMethod: "",
        deliveryWarehouseId: [],
        // alternativeWarehouseId: [],
        logisticsChannel: "",
        checkQuantityFlag: true,
        priorityMatching: {
          saleSkuPriority: "",
          // companyStockAgePriority: "",
          // platformSiteStockAgePriority: "",
          stockAgePriority: "",
          warehouseNearbyPriority: "",
          platformAdvanceWarehouse: false
        }
      },
      actionRule: actionRule,
      actionWay: [],
      actionWarehouse: [],
      logisticsChannel: [],
      orderAll: {},
      // 收货邮编的checkbox状态
      zipCodeStatus: {
        isPostalCodeStartWith: false,
        isPostalCodeInclude: false,
        isSpecifyPostalCode: false,
        isExcludePostalCode: false
      },
      isDisabled: false,
      pdCountStatus: {
        isLower: false,
        isAbove: false
      },
      // 是否批量编辑
      isBatchEdit: false,
      editIndex: 0,
      editIndexMaxLength: 0,
      batchParamArrays: [],
      //
      orderDataInstance: null
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.init()
    this.isDisabled = this.$route.query.disabled
    // if(this.$parent.$refs.tagNavigate){
    //   this.$parent.$refs.tagNavigate.clearTagCache(this.$route.fullPath);
    // }
    const { idsGroup, editIndex } = this.$route.query
    if (idsGroup) {
      this.isBatchEdit = true
      this.editIndex = +editIndex
      this.batchParamArrays = JSON.parse(localStorage.getItem("batchEditArray"))
      this.editIndexMaxLength = this.batchParamArrays.length
    }
  },
  mounted() {
    this.orderDataInstance = this.$refs.orderData
  },
  activated() {
    const { id, scene, disabled } = this.$route.query
    if (id && scene && disabled) {
      this.getRuleDetail()
    }
  },
  beforeDestroy() {
    localStorage.removeItem("batchEditArray")
  },
  methods: {
    init() {
      // 获取规则类型
      getObjByType("rule_scene").then((res) => {
        if (res.data.code === 0) {
          const ruleType = []
          res.data.data.forEach((item) => {
            if (
              item.value !== "ORDER_ISSUANCE" &&
              item.value !== "REVIEW_ORDER" &&
              item.value !== "CONFIGURATION_ADDRESS"
            ) {
              ruleType.push(item)
            }
          })
          this.ruleType = ruleType
          this.conditionObj = this.conditions[this.form.scene]
        }
      })
      // 获取订单拆分类型
      getObjByType("split_method").then((res) => {
        this.actionWay = res.data.data.filter(
          (item) => item.value === "EACH_PRODUCT" || item.value === "WAREHOUSE_CONSOLIDATION"
        )
        this.actionData.splitMethod = "EACH_PRODUCT"
      })
      // 获取订单规则状态
      getObjByType("rule_status").then((res) => {
        this.status = res.data.data
      })

      // 获取仓库类型
      getAllWarehouse().then((res) => {
        this.actionWarehouse = res.data.data.filter((item) => item.funcState === "1")
      })

      // 获取物流渠道
      getBseChannel().then((res) => {
        this.logisticsChannel = res.data.data.filter((item) => item.status === "1")
        this.orderAll.suggestedLogisticsChannel = res.data.data
          .filter((item) => item.status === "1")
          .map((item) => {
            return { label: item.bseChannelName, value: item.bseChannelCode }
          })
      })

      const requestAll = [
        getObjByType("order_operate_type"),
        getObjByType("order_business_type"),
        getPlaTypeAll(),
        getObjByType("so_order_structure"),
        getObjByType("compare_type_left"),
        getObjByType("compare_type_right"),
        getStoreByPlatformTypeCodes([]),
        getObjByType("delivery_method"),
        getAllCarriersV2()
      ]

      Promise.all(requestAll)
        .then((result) => {
          const orderChoice = {
            0: "orderSource",
            1: "salesModel",
            2: "platform",
            3: "orderStructure",
            4: "aboveType",
            5: "lowerType",
            6: "store",
            7: "deliveryMethod",
            8: "warehouseProviderCode"
          }
          result.forEach((item, index) => {
            this.orderAll[orderChoice[index]] = item.data.data
            this.orderAll.salesSite = []
            this.orderAll.deliveryWarehouseId = []
            this.orderData.productCount = {
              above: "",
              lower: "",
              aboveType: "GT",
              lowerType: "LT"
            }
            if (index === 6) {
              this.orderAll[orderChoice[index]] = item.data.filter((item) => item.state === "0")
            }
          })
          // console.log(this.orderAll)
          this.orderAll.platform = this.orderAll.platform.map((item) => {
            return { label: item.platformTypeName, value: item.platformTypeCode }
          })
          this.orderAll.store = this.orderAll.store.map((item) => {
            return { label: item.storeAccount, value: item.storeId }
          })
          this.orderAll.warehouseProviderCode = this.orderAll.warehouseProviderCode.map((item) => {
            return { label: item.providerName, value: item.providerCode }
          })

          if (this.$route.query.id && this.$route.query.scene) {
            this.form.id = this.$route.query.id
            this.getRuleDetail()
          }

          // 批量编辑
          const { idsGroup } = this.$route.query
          if (idsGroup) {
            this.getNextRuleDetail(this.editIndex)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 获取详情
    async getRuleDetail(opt) {
      let postData = {}
      // 判断是否批量编辑
      if (opt) {
        postData = opt
      } else {
        postData = this.$route.query
      }
      const resRule = await getRuleVO(postData)
      if (resRule.data.code === 0) {
        const data = resRule.data.data
        this.conditionObj = this.conditions[data.scene]

        if (data.param.salesSite && data.param.salesSite.length) {
          // 根据平台获取回显站点
          const resSit = await getSitByPlatformTypeCodes(data.param.platform)
          this.orderAll.salesSite = resSit.data.map((item) => {
            return { label: item.sitName, value: item.sitName }
          })
        }
        // 仓库服务商对应的发货仓库回显数据
        if (data.param.deliveryWarehouseId && data.param.deliveryWarehouseId.length) {
          let deliveryWarehouseArr = this.actionWarehouse.filter(
            (item) => item.providerCode === data.param.warehouseProviderCode
          )
          this.orderAll.deliveryWarehouseId = deliveryWarehouseArr.map((item) => {
            return {
              label: item.warehouseName,
              value: item.warehouseId
            }
          })
        }
        this.calcData(data)
      }
    },
    getNextRuleDetail(eIndex) {
      console.log("eindex", eIndex, this.batchParamArrays)
      if (eIndex + 1 > this.editIndexMaxLength) {
        return
      }

      this.form.id = this.batchParamArrays[eIndex].id
      this.getRuleDetail(this.batchParamArrays[eIndex])
    },

    // 最终数据赋值回显
    calcData(data) {
      this.form.ruleName = data.ruleName
      this.form.scene = data.scene
      this.form.ruleStatus = String(data.ruleStatus)

      let resObj = data.param
      let baseMsgArr = this.conditions[data.scene].baseMsg
      baseMsgArr.forEach((item) => {
        if (item.type === "inputProductCount") {
          if (resObj.productCount.above || resObj.productCount.lower) {
            item.status = true
          }
        }
        if (resObj[item.key] && resObj[item.key].length && Array.isArray(resObj[item.key])) {
          item.status = true
        }
        if (typeof resObj[item.key] === "string" && resObj[item.key] !== "") {
          item.status = true
        }
      })
      this.baseMsgArr = baseMsgArr.filter((item) => item.status)

      let logisticsArr = this.conditions[data.scene].logistics
      if (logisticsArr) {
        logisticsArr.forEach((item) => {
          if (item.type === "checkboxTextarea") {
            if (
              resObj.postalCodeStartWith.length ||
              resObj.postalCodeInclude.length ||
              resObj.specifyPostalCode.length ||
              resObj.excludePostalCode.length
            ) {
              item.status = true
            }
          }
          if (item.type == "input") {
            if (resObj.address.content) {
              item.status = true
            }
          }
          if (resObj[item.key] && resObj[item.key].length) {
            item.status = true
          }
        })
        this.logisticsArr = logisticsArr.filter((item) => item.status)
      }

      let orderMsgArr = this.conditions[data.scene].orderMsg
      if (orderMsgArr) {
        orderMsgArr.forEach((item) => {
          if (resObj[item.key] && resObj[item.key].length) {
            item.status = true
          }
          if (item.type === "inputOrderTime" || item.type == "inputDeliveryTime") {
            if (resObj[item.key] !== "" && resObj[item.key] !== null) {
              item.status = true
            }
          }
        })
        // ======================  //
        this.orderMsgArr = orderMsgArr.filter((item) => item.status)
      }

      // 添加产品信息
      let productMsgArr = this.conditions[data.scene].productMsg
      if (productMsgArr) {
        productMsgArr.forEach((item) => {
          if (resObj[item.key] && resObj[item.key].length) {
            item.status = true
          }
          if (item.type === "input") {
            if (resObj[item.key].above || resObj[item.key].lower) {
              item.status = true
            }
          }
        })
        this.productMsgArr = productMsgArr.filter((item) => item.status)
      }

      // 收货邮编、textarea框数组数据转化为空格分数据
      const transformString = [
        "receivingCountry",
        "receivingProvince",
        "receivingCity",
        "sku",
        "postalCodeStartWith",
        "postalCodeInclude",
        "specifyPostalCode",
        "excludePostalCode"
      ]
      transformString.forEach((item) => {
        if (resObj[item] && resObj[item].length) {
          resObj[item] = resObj[item].join("\n")
        }
      })

      this.$nextTick(() => {
        this.orderData = Object.assign({}, this.orderData, resObj)
        this.actionData = Object.assign({}, this.actionData, data.action)
      })
    },
    choiceType(value) {
      this.conditionObj = this.conditions[value]
      this.baseMsgArr = []
      this.logisticsArr = []
      this.orderMsgArr = []
      this.productMsgArr = []
      for (let i = 0; i < this.conditionTitle.length; i++) {
        let count = this.conditionObj[this.conditionTitle[i].value]
          ? this.conditionObj[this.conditionTitle[i].value].length
          : 0
        for (let j = 0; j < count; j++) {
          if (!this.conditionObj[this.conditionTitle[i].value]) continue
          this.conditionObj[this.conditionTitle[i].value][j].status = false
        }
      }
    },
    choiceChange(obj) {
      console.log("obj", obj)
      const BASE = {
        baseMsg: "baseMsgArr",
        logistics: "logisticsArr",
        orderMsg: "orderMsgArr",
        productMsg: "productMsgArr"
      }
      this[BASE[obj.value]] = this.conditionObj[obj.value].filter((item) => item.status)
      if (!obj.status && obj.type === "select") {
        if (obj.key === "suggestedLogisticsChannel" || obj.key === "deliveryMethod") {
          this.orderData[obj.key] = ""
        } else {
          this.orderData[obj.key] = []
        }
      } else if (!obj.status && obj.type === "textarea") {
        this.orderData[obj.key] = []
      } else if (!obj.status && obj.type === "checkboxTextarea") {
        if (obj.key === "zipCode") {
          this.orderData.postalCodeStartWith = []
          this.orderData.postalCodeInclude = []
          this.orderData.specifyPostalCode = []
          this.orderData.excludePostalCode = []
          this.orderData.twoMeetOneFlag = false
        }
      } else if (!obj.status && obj.type === "inputProductCount") {
        if (obj.key === "productCount") {
          this.orderData.productCount.aboveType = "GT"
          this.orderData.productCount.above = ""
          this.orderData.productCount.lowerType = "LT"
          this.orderData.productCount.lower = ""
        }
      } else if (obj.value === "productMsg" && obj.type === "input") {
        this.orderData[obj.key].above = ""
        this.orderData[obj.key].lower = ""
      } else if (obj.value === "logistics" && obj.type === "input") {
        this.orderData[obj.key].content = ""
      } else if (obj.key == "requireDeliveryTime") {
        this.orderData[obj.key] = ""
      } else if (obj.key == "platformOrderTime") {
        this.orderData[obj.key] = ""
      }
    },
    modify(obj) {
      if (!this.orderData[obj.checkout]) {
        this.orderData[obj.key] = ""
      }
    },
    validateDom(domVal) {
      let p = new Promise((resolve, reject) => {
        this.$refs[domVal].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      return p
    },
    cancel() {
      if (this.$parent.$refs.tagNavigate) {
        this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
        this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
      }
      // this.$router.push({ path: "/order/orderRuleList" });
    },
    hasDuplicateValues(obj) {
      const values = Object.values(obj)
      const uniqueValues = new Set(values)
      return uniqueValues.size !== values.length
    },
    async save() {
      let formRes = await this.validateDom("form")
      if (!formRes) return false
      let orderDataRes = await this.validateDom("orderData")
      if (!orderDataRes) return false
      let actionDataRes = await this.validateDom("actionData")
      if (!actionDataRes) return false

      this.form.param = this.orderData
      this.form.action = this.actionData
      // 原来字段 alternativeWarehouseId 前端不需要 在编辑的时候 也不需要传回给后端会出错 所以删除这个字段alternativeWarehouseId
      if (this.form.action.alternativeWarehouseId) {
        delete this.form.action.alternativeWarehouseId
      }
      // console.log("this.form", this.form)
      // return
      let apiAll = {
        SPLIT_ORDER: () => {
          return splitOrderRule(this.form)
        },
        // SET_WAREHOUSE: () => { return setWarehouseRule(this.form) },
        LOGISTICS_CHANNEL_MATCHING: () => {
          return logisticsChannelMatchingRule(this.form)
        },
        COMFIRM_ORDER: () => {
          return comfirmOrderRule(this.form)
        },
        MARK_PENDING_CONFIRMATION: () => {
          return markPendingConfirmationRule(this.form)
        },
        CRAETE_FO: () => {
          return craeteFoRule(this.form)
        },
        DISTRIBUTE_TO_THIRD_PARTY_WAREHOUSES: () => {
          return distributeToThirdPartyWarehousesRule(this.form)
        },
        AUTOMATIC_SKU_MATCHING: () => {
          return setAutomaticSkuMatchRule(this.form)
        },
        PLATFORM_DELIVERY: () => {
          return setPlatformDeliveryRule(this.form)
        }
      }
      if (this.form.scene === "AUTOMATIC_SKU_MATCHING") {
        if (this.hasDuplicateValues(this.actionData.priorityMatching)) {
          this.$message.warning("自动匹配SKU优先级不能重复")
          return
        }
      }

      if (this.form.scene === "SET_WAREHOUSE") {
        const cloneForm = deepClone(this.form)

        // 收货邮编、textarea框空格分数据转化为数组数据
        const transformArr = [
          "receivingCountry",
          "receivingProvince",
          "receivingCity",
          "sku",
          "postalCodeStartWith",
          "postalCodeInclude",
          "specifyPostalCode",
          "excludePostalCode"
        ]
        transformArr.forEach((item) => {
          if (typeof cloneForm.param[item] === "string") {
            cloneForm.param[item] = cloneForm.param[item].split("\n")
          }
        })
        setWarehouseRule(cloneForm).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(this.form.id ? "订单规则修改成功" : "订单规则保存成功")
            if (this.isBatchEdit) {
              this.getNextRuleDetail(++this.editIndex)
              if (this.editIndex + 1 === this.batchParamArrays.length) {
                this.isBatchEdit = false
              }
              return
            }
            this.cancel()
          }
        })
      } else {
        // 非自动匹配仓库的类型 不传platformAdvanceWarehouse 字段
        this.form.action.platformAdvanceWarehouse = undefined
        this.form.action.priorityMatching.platformAdvanceWarehouse = undefined

        apiAll[this.form.scene]().then((res) => {
          if (res.data.code === 0) {
            this.$message.success(this.form.id ? "订单规则修改成功" : "订单规则保存成功")
            if (this.isBatchEdit) {
              this.getNextRuleDetail(++this.editIndex)
              if (this.editIndex + 1 === this.batchParamArrays.length) {
                this.isBatchEdit = false
              }
              return
            }
            this.cancel()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
#ruleEngineDetail {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  font-size: 12px;
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    color: #000;
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #000;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }
  .ruleEngineDetail-left {
    width: 380px;
    height: 100%;
    display: flex;
    flex-shrink: 0;
    padding: 20px;
    box-sizing: border-box;
    border-right: 12px solid #f1f1f1;
    flex-direction: column;
  }
  .ruleEngineDetail-right {
    flex: 1;
    height: 100%;
    padding: 10px 20px 80px;
    overflow-y: auto;
    box-sizing: border-box;
    .el-select--mini {
      width: 100%;
    }
    .ruleEngineBaseMsg-checkbox-input {
      .el-select {
        width: 95px;
      }
      .el-input--mini {
        background: #fff;
      }
    }
    .ruleEngineBaseMsg-checkbox-otherInput {
      .el-select--mini {
        width: 80px;
      }
      .el-input--mini {
        background: #fff;
      }
      .el-input__inner {
        width: 80px;
      }
    }
    .ruleEngineBaseMsg-boxVolumen {
      .el-select--mini {
        width: 80px;
      }
    }
    .right-title {
      color: #33363c;
      line-height: 16px;
      font-weight: 600;
      margin-bottom: 32px;
      height: 16px;
      font-size: 14px;
    }
    .right-main {
      width: 650px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #000;
    }
    .el-checkbox__label {
      color: #000;
      font-size: 12px;
    }
    .el-form-item--mini {
      font-size: 12px;
      color: #000;
    }
  }
  .ruleEngineDetail__opeBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    // box-shadow: 2px 0px 10px 2px #efefef;
    z-index: 100;
  }
}
.ruleEngineDetail-left-form {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  .el-form-item__label {
    font-size: 12px;
  }
  .el-form-item--mini:nth-child(3) .el-form-item__label {
    line-height: 12px;
  }
  .el-select {
    width: 100%;
  }
  .el-radio__label {
    font-size: 12px;
    color: #55585f;
  }
}
.ruleEngineDetail-choice_title {
  font-weight: bold;
  padding: 10px 0 15px;
  border-top: 1px dashed #efefef;
}
.ruleEngineDetail-left-choice {
  flex: 1;
  overflow-y: auto;
  .left-choice-title {
    position: relative;
    margin-left: 15px;
    &:before {
      content: "";
      position: absolute;
      left: -5px;
      top: 1px;
      bottom: 2px;
      width: 2px;
      background: blue;
    }
  }
  .el-collapse-item__wrap {
    border: none;
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
  }
  .el-collapse {
    border: none;
  }
  .el-checkbox-group {
    .el-checkbox {
      margin-left: 15px;
      margin-top: 10px;
      margin-right: 0;
    }
    .el-checkbox__label {
      font-size: 12px;
      padding-left: 5px;
    }
  }
  .el-collapse-item__header {
    font-size: 12px;
    position: relative;
    font-weight: bold;
    height: 35px;
    border: none;
    .el-collapse-item__arrow {
      display: none;
    }
  }
}
</style>
