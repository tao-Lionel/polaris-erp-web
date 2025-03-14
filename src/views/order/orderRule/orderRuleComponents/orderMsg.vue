<template>
  <div class="ruleEngineBaseMsg">
    <p class="ruleEngineBaseMsg-title" v-show="orderMsgArr.length">订单信息</p>
    <template v-for="(item, index) in orderMsgArr">
      <el-form-item
        v-if="!item.isValidate"
        :label="item.title + ':'"
        :key="item.key"
        :rules="item.rules"
        :prop="item.key"
        label-width="170px"
      >
        <template v-if="item.type === 'textarea'">
          <el-input
            v-model="orderData[item.key]"
            type="textarea"
            :disabled="isDisabled"
            :placeholder="item.placeholder"
            :rows="3"
          ></el-input>
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
        <template v-else-if="item.type === 'inputSelectMoney'">
          <div class="ruleEngineBaseMsg-checkbox-input">
            <div style="display: flex">
              <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
              <el-input placeholder="请输入内容" v-model="orderData[item.key]" size="small">
                <el-select v-model="select" slot="prepend" placeholder="大于">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
                <el-select v-model="select" slot="append" placeholder="CNY">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
              </el-input>
            </div>
            <div style="display: flex; margin-top: 10px">
              <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
              <el-input placeholder="请输入内容" v-model="orderData.orderSmallMoney" size="small">
                <el-select v-model="select" slot="prepend" placeholder="小于">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
                <el-select v-model="select" slot="append" placeholder="CNY">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
              </el-input>
            </div>
          </div>
        </template>
        <template v-else-if="item.type === 'inputOrderTime'">
          <div class="ruleEngineBaseMsg-checkbox-input">
            <div style="display: flex">
              <el-input
                style="width: 300px; margin: 0 10px"
                placeholder=""
                v-model="orderData[item.key]"
                :disabled="isDisabled"
                size="small"
              >
                <template slot="prepend">+</template>
                <template slot="append">小时</template>
              </el-input>
            </div>
          </div>
        </template>
        <template v-else-if="item.type === 'inputDeliveryTime'">
          <div class="ruleEngineBaseMsg-checkbox-input">
            <div style="display: flex">
              <el-input
                style="width: 300px; margin: 0 10px"
                placeholder=""
                v-model="orderData[item.key]"
                :disabled="isDisabled"
                size="small"
              >
                <template slot="prepend">-</template>
                <template slot="append">小时</template>
              </el-input>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="ruleEngineBaseMsg-checkbox-input" style="display: flex">
            <div style="display: flex">
              <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
              <el-input placeholder="请输入" v-model="input3" size="small">
                <el-select v-model="select" slot="prepend" placeholder="大于">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
                <span slot="append">{{ item.type === "inputSelect" ? "g" : "小时" }}</span>
              </el-input>
            </div>
            <div style="display: flex; margin-left: 30px">
              <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
              <el-input placeholder="请输入" v-model="input3" size="small">
                <el-select v-model="select" slot="prepend" placeholder="大于">
                  <el-option label="餐厅名" value="1"></el-option>
                </el-select>
                <span slot="append">{{ item.type === "inputSelect" ? "g" : "小时" }}</span>
              </el-input>
            </div>
          </div>
        </template>
      </el-form-item>
      <div v-else :key="item.key">
        <template v-if="item.type === 'inputSelectMoney'">
          <div style="display: flex; margin-bottom: 20px">
            <div class="ruleEngineBaseMsg--elForm-modify">
              <span style="color: red; margin-right: 3px">*</span>{{ item.title }}:
            </div>
            <div class="ruleEngineBaseMsg-checkbox-input" style="flex: 1">
              <div style="display: flex; align-items: center">
                <el-checkbox
                  v-model="orderData[item.startCheckoutBox]"
                  @change="modify(index, 'start')"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  :disabled="!orderData[item.startCheckoutBox]"
                  placeholder="请输入内容"
                  v-model="orderData[item.validateStart]"
                  size="small"
                >
                  <el-select
                    v-model="orderData[item.isGreater]"
                    slot="prepend"
                    placeholder="大于"
                    :disabled="!orderData[item.startCheckoutBox]"
                  >
                    <el-option label="大于" value="2"></el-option>
                    <el-option label="大于等于" value="3"></el-option>
                  </el-select>
                  <el-select v-model="orderData[item.isMoney]" slot="append" placeholder="CNY">
                    <el-option label="CNY" value="CNY"></el-option>
                    <el-option label="USD" value="USD"></el-option>
                  </el-select>
                </el-input>
              </div>
              <div style="display: flex; margin-top: 10px">
                <el-checkbox
                  v-model="orderData[item.endCheckoutBox]"
                  @change="modify(index, 'end')"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  :disabled="!orderData[item.endCheckoutBox]"
                  placeholder="请输入内容"
                  v-model="orderData[item.validateEnd]"
                  size="small"
                >
                  <el-select
                    :disabled="!orderData[item.endCheckoutBox]"
                    v-model="orderData[item.isLess]"
                    slot="prepend"
                    placeholder="小于"
                  >
                    <el-option label="小于" value="0"></el-option>
                    <el-option label="小于等于" value="1"></el-option>
                  </el-select>
                  <el-select v-model="orderData[item.isMoney]" slot="append" placeholder="CNY">
                    <el-option label="CNY" value="CNY"></el-option>
                    <el-option label="USD" value="USD"></el-option>
                  </el-select>
                </el-input>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="display: flex; margin-bottom: 20px">
            <div class="ruleEngineBaseMsg--elForm-modify">
              <span style="color: red; margin-right: 3px">*</span>{{ item.title }}:
            </div>
            <div class="ruleEngineBaseMsg-checkbox-input" style="display: flex">
              <div style="display: flex; align-items: center">
                <el-checkbox
                  v-model="orderData[item.startCheckoutBox]"
                  @change="modify(index, 'start')"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  :disabled="!orderData[item.startCheckoutBox]"
                  placeholder="请输入"
                  v-model="orderData[item.validateStart]"
                  size="small"
                >
                  <el-select
                    :disabled="!orderData[item.startCheckoutBox]"
                    v-model="orderData[item.isGreater]"
                    slot="prepend"
                    placeholder="大于"
                  >
                    <el-option label="大于" value="2"></el-option>
                    <el-option label="大于等于" value="3"></el-option>
                  </el-select>
                  <span slot="append">{{ item.type === "inputSelect" ? "kg" : "小时" }}</span>
                </el-input>
              </div>
              <div style="display: flex; margin-left: 30px; align-items: center">
                <el-checkbox
                  v-model="orderData[item.endCheckoutBox]"
                  @change="modify(index, 'end')"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  :disabled="!orderData[item.endCheckoutBox]"
                  placeholder="请输入"
                  v-model="orderData[item.validateEnd]"
                  size="small"
                >
                  <el-select
                    :disabled="!orderData[item.endCheckoutBox]"
                    v-model="orderData[item.isLess]"
                    slot="prepend"
                    placeholder="小于"
                  >
                    <el-option label="小于" value="0"></el-option>
                    <el-option label="小于等于" value="1"></el-option>
                  </el-select>
                  <span slot="append">{{ item.type === "inputSelect" ? "kg" : "小时" }}</span>
                </el-input>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getPrdCalculateRuleDetail } from "@/api/baseSetup/bseplatformtype"

import { deepClone } from "../../../../util/util"
export default {
  name: "baseMsg",
  props: {
    orderMsgArr: {
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
    isDisabled: false
  },
  data() {
    return {
      options: [],
      bidArr: []
    }
  },
  watch: {},
  created() {
    setTimeout(() => {
      this.options = [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ]
    }, 1000)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    modify(index, status) {
      this.$emit("modify", {
        key: this.orderMsgArr[index][status === "start" ? "validateStart" : "validateEnd"],
        checkout: this.orderMsgArr[index][status === "start" ? "startCheckoutBox" : "endCheckoutBox"]
      })
    }
  }
}
</script>

<style lang="scss">
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
.ruleEngineBaseMsg-boxVolumen {
  .el-select--mini {
    width: 100px;
  }
}
.ruleEngineBaseMsg-textarea {
  .textarea-main {
    background: #f7f9fb;
    border-radius: 4px;
    padding: 10px;
  }
  .textarea-first {
    display: flex;
  }
  .textarea-two {
    display: flex;
    background: #f7f9fb;
    padding: 10px;
    margin-top: 20px;
  }
  .el-checkbox__label {
    font-size: 12px;
    padding-left: 6px;
  }
}
.ruleEngineBaseMsg--elForm-modify {
  width: 138px;
  margin-right: 12px;
  text-align: right;
  flex-shrink: 0;
}
</style>
