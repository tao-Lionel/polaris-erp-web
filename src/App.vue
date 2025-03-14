<template>
  <div id="app">
    <router-view></router-view>
    <noticeDialog ref="noticeDialogRef"></noticeDialog>
  </div>
</template>

<script>
import noticeDialog from "@/views/noticeCenter/components/noticeDialog"
import { getAnnouncementAlertListApi } from "@/api/baseSetup/noticeCenter"
import { getStore } from "@/util/store"
import { getFieldDescWithRouteKeyApi } from "@/api/admin/fieldDescription.js"

export default {
  name: "app",
  components: {
    noticeDialog
  },
  data() {
    return {
      observer: null
    }
  },
  computed: {
    isOuterUser() {
      return getStore({ name: "user_info", type: "session" })?.outerUser
    }
  },
  created() {},
  mounted() {},
  updated() {
    this.handleSafariTableFix()
    this.initializeApp()
  },
  beforeDestroy() {
    console.log("app销毁")
    this.cleanupObserver()
  },
  methods: {
    // 初始化相关
    initializeApp() {
      if (!this.isOtherPage() && !this.isOuterUser) {
        this.initializeFeatures()
      }
    },

    isOtherPage() {
      return ["/login", "/authredirect"].includes(this.$route.path)
    },

    async initializeFeatures() {
      await Promise.all([this.getUnreadAnnouncement(), this.getField(), this.getDialogTitle()])
    },

    /**
     * 以下处理兼容safari浏览器表格与头部错乱，但非最终解决方案
     */
    handleSafariTableFix() {
      const tableElements = document.querySelectorAll(".el-table__body")

      setTimeout(() => {
        tableElements.forEach((el) => {
          this.handleTable(el, "table")
          el.style.style = "table"
        })
      }, 0)

      this.$nextTick(() => {
        tableElements.forEach((el) => {
          this.handleTable(el, "none")
        })
      })
    },

    handleTable(el, actions) {
      el.style.display = actions
    },

    // 清理观察者
    cleanupObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null // 清理引用
      }
    },

    // 获取前三条未读公告
    async getUnreadAnnouncement() {
      const { data } = await getAnnouncementAlertListApi()
      if (data.code === 0) {
        if (data.data.length > 0) {
          this.$refs.noticeDialogRef.openDialog()
        }
      }
    },

    // 获取字段配置 type = ".el-dialog__wrapper" 代表弹窗
    async getField(title, type = null) {
      const hash = window.location.hash.slice(1)
      const basePath = hash.split("?")[0]
      const routeKey = title ? `${basePath}/${title}` : basePath

      const { data } = await getFieldDescWithRouteKeyApi({ routeKey })

      if (data.code === 0) {
        const textArr = data.data?.map(({ fieldName, description }) => ({
          key: fieldName,
          value: description
        }))

        if (!textArr) return

        this.getTableTitle(textArr, type)
        if (!type) {
          this.getPageFormLabel(textArr)
        }

        if (type && title) {
          return textArr
        }
      }
    },

    // 统一处理标签的函数
    processLabels(container, textArr, selector, type) {
      const textMap = new Map(textArr.map((item) => [item.key, item.value]))
      const labels = container.querySelectorAll(selector)
      Array.from(labels)
        .filter((label) => !label.querySelector(".el-tooltip"))
        .forEach((label) => {
          const labelText = label.textContent?.trim()
          const tooltipText = textMap.get(labelText)

          if (tooltipText) {
            this.createTooltip(type, label, tooltipText)
          }
        })
    },

    // 处理表格标题
    getTableTitle(textArr, type) {
      const className = type ? `${type} .el-table__header-wrapper thead .cell` : ".el-table__header-wrapper thead .cell"
      this.processLabels(document, textArr, className, "table")
    },

    // 页面上的表单字段
    getPageFormLabel(textArr) {
      const classArr = [".el-form .el-form-item__label", ".label-description"]
      classArr.forEach((item) => this.processLabels(document, textArr, item, "label"))
    },

    // 处理对话框标题
    getDialogTitle() {
      // 获取并过滤对话框
      const dialogWrappers = Array.from(document.querySelectorAll(".el-dialog__wrapper")).filter(
        (wrapper) => !wrapper.querySelector(".noWatch")
      )

      if (!dialogWrappers.length) return

      // 创建或复用MutationObserver
      if (!this.observer) {
        this.observer = new MutationObserver(this.handleDialogMutation.bind(this))
      }

      // 批量添加观察者
      const observerConfig = {
        attributes: true, // 监听属性变化
        attributeFilter: ["style"] // 仅监听style属性
      }

      dialogWrappers.forEach((wrapper) => {
        this.observer.observe(wrapper, observerConfig)
      })
    },

    // 将 MutationObserver 的回调函数提取为单独方法
    async handleDialogMutation(mutations) {
      const targetDialog = mutations.find((mutation) => getComputedStyle(mutation.target).display !== "none")?.target
      if (!targetDialog) return

      const title = targetDialog?.querySelector(".el-dialog__title")?.textContent.trim()
      if (!title) return

      const textArr = await this.getField(title, ".el-dialog__wrapper")
      if (textArr) {
        this.processLabels(targetDialog, textArr, ".el-dialog__body label", "label")
      }
    },

    // 创建tooltip
    createTooltip(type, label, tooltipText) {
      // 创建一个 i 元素，内容为 '?'，用作 tooltip 的触发
      const questionMark = document.createElement("i")
      Object.assign(questionMark.style, {
        display: "flex",
        alignItems: "center",
        marginLeft: "5px"
      })
      questionMark.classList.add("el-tooltip", "el-icon-question", "item")

      // 创建 tooltip 元素，默认隐藏
      const tooltip = document.createElement("div")
      tooltip.textContent = tooltipText
      Object.assign(tooltip.style, {
        position: "absolute",
        backgroundColor: "#333",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "4px",
        visibility: "hidden",
        fontSize: "12px",
        zIndex: "99999",
        maxWidth: "200px",
        whiteSpace: "breakSpaces",
        lineHeight: "20px"
      })

      const handleMouseOver = (event) => {
        Object.assign(tooltip.style, {
          left: `${event.pageX + 10}px`,
          top: `${event.pageY + 10}px`,
          visibility: "visible"
        })
        document.body.appendChild(tooltip)
      }

      const handleMouseOut = () => {
        tooltip.style.visibility = "hidden"
        document.body.removeChild(tooltip)
      }

      questionMark.addEventListener("mouseover", handleMouseOver)
      questionMark.addEventListener("mouseout", handleMouseOut)

      if (type === "table") {
        label.insertBefore(questionMark, label.nextSibling)
      } else {
        label.appendChild(questionMark)
      }
    }
  }
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-scrollbar__bar.is-vertical {
    width: 10px;
    border-radius: 8px;
    transition: all 0.2s;
    right: 0;
  }
  .el-table:hover {
    ::-webkit-scrollbar {
      opacity: 1;
      background-color: rgba(188, 191, 193, 0.3);
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(188, 191, 193, 0.4);

      &:hover {
        background-color: rgba(188, 191, 193, 0.75);
      }
    }
  }
}

.error-tip {
  color: #f56c6c;
  line-height: 6px;
  position: relative;
  top: 6px;
  font-size: 12px;
}

.el-form-item__label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

// 升级信息的样式
.customClassUpgrade {
  font-weight: bold;
}

.el-form-item__label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
