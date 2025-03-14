<template>
  <div id="ruleEngineBaseMsg">
    <p class="ruleEngineBaseMsg-title" v-show="productMsgArr.length">产品信息</p>
    <div>
      <el-form-item
        :label="item.title + ':'"
        v-for="item in productMsgArr"
        :key="item.key"
        :prop="item.key"
        :required="item.isValidate ? true : ''"
      >
        <template v-if="item.type === 'textarea'">
          <el-form-item :prop="item.key">
            <el-input
              v-model="orderProduct"
              type="textarea"
              :disabled="isDisabled"
              :placeholder="item.placeholder"
              :rows="3"
              @change="changeLogisticsChannelMatchingSku"
            ></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="11">
              <el-form-item :prop="`${[item.key]}.lower`">
                <el-input
                  v-model="orderData[item.key].lower"
                  :disabled="isDisabled"
                  placeholder="最小值"
                  @change="lowerChange($event, item.key)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="text-align: center">~</p>
            </el-col>
            <el-col :span="11">
              <el-form-item :prop="`${[item.key]}.above`">
                <el-input
                  v-model="orderData[item.key].above"
                  :disabled="isDisabled"
                  placeholder="最大值"
                  @change="aboveChange($event, item.key)"
                ></el-input
              ></el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getSitByPlatformTypeCodes } from "@/api/order/orderRule"
import { preventShake } from "@/util/tool"

export default {
  name: "baseMsg",
  props: {
    productMsgArr: {
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

    isDisabled: false,
    orderDataInstance: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      // 订单产品
      orderProduct: ""
    }
  },
  watch: {
    orderData: {
      handler(val) {
        if (val && val.logisticsChannelMatchingSku) {
          this.orderProduct = val.logisticsChannelMatchingSku.join(",") // 将数组转为字符串
        }
      },
      immediate: true // 立即执行一次
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    lowerChange(val, key) {
      this.orderDataInstance.validateField(`${key}.above`)
    },
    aboveChange(val, key) {
      this.orderDataInstance.validateField(`${key}.lower`)
    },
    changeLogisticsChannelMatchingSku(val) {
      // 将输入的字符串按空格或逗号分割成数组
      const skuArray = val.split(/[\s,]+/).filter((item) => item !== "")
      this.$set(this.orderData, "logisticsChannelMatchingSku", skuArray)
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
