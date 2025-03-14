<template>
  <div id="ruleEngineBaseMsg">
    <p class="ruleEngineBaseMsg-title" v-show="baseMsgArr.length">基础信息</p>
    <div>
      <el-form-item
        :label="item.title + ':'"
        v-for="item in baseMsgArr"
        :key="item.key"
        :required="item.isValidate ? true : ''"
        :prop="item.isValidate ? '' : item.key"
      >
        <template v-if="item.type === 'select'">
          <el-tooltip placement="top" :disabled="!getContent(item.key)">
            <div slot="content" v-html="getContent(item.key)"></div>
            <el-select
              v-model="orderData[item.key]"
              :placeholder="'请选择' + item.title"
              :multiple="!item.noMultiple"
              filterable
              :disabled="isDisabled"
              @change="getPlatForm($event, item.key)"
              clearable
              :collapse-tags="false"
            >
              <p
                class="ruleEngineBaseMsg__selectAll"
                v-if="!item.noMultiple"
                :class="
                  orderData[item.key] &&
                  orderData[item.key].length === orderChoice[item.key] &&
                  orderChoice[item.key].length
                    ? 'ruleEngineBaseMsg__selectAll_select'
                    : ''
                "
                @click="choiceAll(item.key)"
              >
                <span>全选</span
                ><i
                  v-show="
                    orderData[item.key] &&
                    orderData[item.key].length === orderChoice[item.key] &&
                    orderChoice[item.key].length
                  "
                  class="el-icon-check"
                ></i>
              </p>
              <el-option
                :label="optionItem.label"
                :value="optionItem.value"
                v-for="optionItem in orderChoice[item.key]"
                :key="optionItem.value"
              >
              </el-option>
            </el-select>
          </el-tooltip>
        </template>
        <template v-else-if="item.type === 'inputProductCount'">
          <div class="ruleEngineBaseMsg-checkbox-input">
            <el-form-item prop="productCount.above">
              <div style="display: flex">
                <el-checkbox
                  v-model="pdCountStatus.isAbove"
                  @change="changePcStatus($event, 'above')"
                  :disabled="isDisabled"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  placeholder="请输入产品数量"
                  v-model="orderData.productCount.above"
                  :disabled="!pdCountStatus.isAbove || isDisabled"
                  size="small"
                >
                  <el-select
                    v-model="orderData.productCount.aboveType"
                    slot="prepend"
                    :disabled="!pdCountStatus.isAbove || isDisabled"
                    placeholder="请选择"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in orderChoice.aboveType"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="productCount.lower">
              <div style="display: flex; margin-left: 20px">
                <el-checkbox
                  v-model="pdCountStatus.isLower"
                  @change="changePcStatus($event, 'lower')"
                  :disabled="isDisabled"
                  style="margin-right: 10px"
                ></el-checkbox>
                <el-input
                  placeholder="请输入产品数量"
                  v-model="orderData.productCount.lower"
                  :disabled="!pdCountStatus.isLower || isDisabled"
                  size="small"
                >
                  <el-select
                    v-model="orderData.productCount.lowerType"
                    slot="prepend"
                    :disabled="!pdCountStatus.isLower || isDisabled"
                    placeholder="请选择"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in orderChoice.lowerType"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-input>
              </div>
            </el-form-item>
          </div>
        </template>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getSitByPlatformTypeCodes, getWarehouseByTransportCarrierCode } from "@/api/order/orderRule"
import { preventShake } from "@/util/tool"

import { deepClone } from "../../../../util/util"
export default {
  name: "baseMsg",
  props: {
    baseMsgArr: {
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
    orderAll: {
      type: Object,
      default: function () {
        return {}
      }
    },
    pdCountStatus: {
      type: Object,
      default: function () {
        return {}
      }
    },
    actionWarehouse: {
      type: Array,
      default: function () {
        return []
      }
    },
    isDisabled: false
  },
  data() {
    return {
      orderChoice: this.orderAll
    }
  },
  watch: {
    baseMsgArr: function (val) {
      this.$nextTick(() => {
        this.orderChoice = Object.assign({}, this.orderAll)
      })
    },
    orderData: function (val) {
      if (val.productCount.above) {
        this.pdCountStatus.isAbove = true
      }
      if (val.productCount.lower) {
        this.pdCountStatus.isLower = true
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getContent(val) {
      let content = ""
      if (val === "store") {
        // 过滤出匹配的仓库名字
        const matchedStores = this.orderChoice[val]
          .filter((store) => this.orderData[val].includes(store.value))
          .map((store) => store.label)

        // 每5个加一个 <br>，并用 ", " 分隔，最后一个不加逗号
        content = matchedStores.reduce((acc, name, index) => {
          const isLastItem = index === matchedStores.length - 1 // 判断是否是最后一个元素
          const isLineBreak = (index + 1) % 5 === 0 // 判断是否是第5个元素

          if (isLineBreak && !isLastItem) {
            return acc + name + " ,<br/>"
          } else if (!isLastItem) {
            return acc + name + " , "
          } else {
            return acc + name // 最后一个元素不加逗号
          }
        }, "")
      }
      return content
    },
    choiceAll(val) {
      if (this.orderData[val].length < this.orderChoice[val].length) {
        this.orderData[val] = this.orderChoice[val].map((item) => item.value)
      } else {
        this.orderData[val] = []
      }
    },
    changePcStatus(val, key) {
      if (!val) {
        this.orderData.productCount[key] = ""
        key === "above"
          ? (this.orderData.productCount.aboveType = "GT")
          : (this.orderData.productCount.lowerType = "LT")
      }
    },
    getPlatForm(status, key) {
      // 获取站点数据
      if (key === "platform") {
        preventShake.preventShake((bool) => {
          if (bool) {
            this.orderData.salesSite = []
            this.orderData.store = []
            getSitByPlatformTypeCodes(this.orderData.platform).then((res) => {
              this.orderAll.salesSite = res.data.map((item) => {
                return {
                  label: item.sitName,
                  value: item.sitName
                }
              })
              this.orderChoice = Object.assign({}, this.orderAll)
            })
          }
        }, 600)
      }
      if (key === "warehouseProviderCode") {
        this.orderData.deliveryWarehouseId = []
        let deliveryWarehouseArr = this.actionWarehouse.filter(
          (item) => item.providerCode === this.orderData.warehouseProviderCode
        )
        this.orderAll.deliveryWarehouseId = deliveryWarehouseArr.map((item) => {
          return {
            label: item.warehouseName,
            value: item.warehouseId
          }
        })
        this.orderChoice = Object.assign({}, this.orderAll)
      }
    }
  }
}
</script>

<style lang="scss">
#ruleEngineBaseMsg {
  .ruleEngineBaseMsg-checkbox-input {
    display: flex;
    align-items: center;
  }
}

.ruleEngineBaseMsg__selectAll {
  display: flex;
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: #f5f7fa;
  }
}
.ruleEngineBaseMsg__selectAll_select {
  color: #409eff;
  font-weight: bold;
}

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
</style>
