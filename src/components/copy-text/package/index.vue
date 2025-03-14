<template>
  <span
    :class="[
      type ? `is-${type}` : '',
      type && justify ? `is-justify-${justify}` : '',
      type && align ? `is-align-${align}` : ''
    ]"
    class="copy-text-ellipsis"
    @mouseenter="showCopyIcon"
    @mouseleave="hideCopyIcon"
  >
    <!-- 如果没有slot则取text -->
    <span ref="textRef" class="copy-text-ellipsis">
      <!-- 如果插槽有内容，则显示插槽内容，否则显示 prop 传入的值 -->
      <slot v-if="hasSlotContent" />
      <span v-else :title="val">{{ val }}</span>
    </span>
    <!-- 如果有文本，则显示复制图标，点击触发复制功能 -->
    <i
      v-if="(textComputed && showIcon) || !hoverToShow"
      class="icon el-icon-copy-document"
      @click.stop="handleCopy"
    ></i>
  </span>
</template>

<script>
import { Message } from "element-ui"

export default {
  name: "CopyText",
  components: {},
  props: {
    // 同时使用text属性和slot，实际拷贝text，显示slot
    // 实际拷贝值，不传默认拷贝 slot 的文字
    text: {
      type: String,
      default: ""
    },
    // 默认开启flex
    type: {
      type: String,
      default: "flex"
    },
    // <'start' | 'end' | 'center' | 'space-around' | 'space-between'>
    justify: {
      type: String,
      default: "start"
    },
    // <'top' | 'middle' | 'bottom'>
    align: {
      type: String,
      default: "middle"
    },
    hoverToShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 存储 slot 内部文本
      textRefInnerText: "",
      // 用于存储消息处理实例
      messageHandler: null,
      // 控制复制图标的显示
      showIcon: false,
      // 定时器
      hideIconTimer: null
    }
  },
  computed: {
    // 返回实际拷贝的文本
    val() {
      return this.text
    },
    // 检查是否通过属性传入了文本
    fromAttr() {
      return !!this.val
    },
    // 计算最终需要拷贝的文本
    textComputed() {
      return this.fromAttr ? this.val : this.textRefInnerText
    },
    // 检查 slot 是否有内容
    hasSlotContent() {
      return !!this.$slots.default
    }
  },
  mounted() {
    this.handleTextUpdate()
  },
  updated() {
    this.handleTextUpdate()
  },
  beforeDestroy() {
    // 组件销毁前清除消息处理实例
    this.messageHandler = null
  },
  methods: {
    handleTextUpdate() {
      this.$nextTick(() => {
        this.textRefInnerText = this.$refs.textRef?.innerText || ""
      })
    },
    // 创建一个用于复制的隐藏 textarea 元素
    createFakeElement(v) {
      const fakeElement = document.createElement("textarea")
      fakeElement.setAttribute("readonly", "")
      fakeElement.setAttribute("opacity", "0")
      fakeElement.value = v
      return fakeElement
    },
    // 处理复制操作
    handleCopy() {
      const txt = this.textComputed
      const fakeEle = this.createFakeElement(txt)
      document.body.appendChild(fakeEle)
      fakeEle.select()
      try {
        document.execCommand("copy")
        if (this.messageHandler) {
          this.messageHandler.close()
        }
        this.messageHandler = Message({
          message: "已复制",
          type: "success",
          duration: 1000
        })
      } catch (err) {
        console.error(err)
      } finally {
        fakeEle.remove()
      }
    },
    // 显示复制图标
    showCopyIcon() {
      if (this.hoverToShow) {
        this.showIcon = true
      }
    },
    // 隐藏复制图标
    hideCopyIcon() {
      if (this.hoverToShow) {
        this.showIcon = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.is-flex {
  display: flex;
  width: 100%;
  // 水平排列
  &.is-justify-center {
    justify-content: center;
  }
  &.is-justify-end {
    justify-content: end;
  }
  &.is-justify-space-between {
    justify-content: space-between;
  }
  &.is-justify-space-around {
    justify-content: space-around;
  }
  // 垂直方向
  &.is-align-middle {
    align-items: center;
  }
  &.is-align-bottom {
    align-items: flex-end;
  }
}

.icon {
  margin-left: 5px;
  opacity: 0.6;
  font-size: 14px;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}
.copy-text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    display: inline;
  }
}
</style>
