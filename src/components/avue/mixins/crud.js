import * as utils from "../utils/util.js"
import { validatenull } from "../utils/validate.js"
import crudInput from "../crud/src/crud-input"
import crudSelect from "../crud/src/crud-select"
import crudRadio from "../crud/src/crud-radio"
import crudCheckbox from "../crud/src/crud-checkbox"
import crudCascader from "../crud/src/crud-cascader"
import crudDate from "../crud/src/crud-date"
import crudTime from "../crud/src/crud-time"
import crudInputNumber from "../crud/src/crud-input-number"
import crudSwitch from "../crud/src/crud-switch"
import crudRate from "../crud/src/crud-rate"
import crudUpload from "../crud/src/crud-upload"
import crudSilder from "../crud/src/crud-silder"
import crudImg from "../crud/src/crud-img"
export default function () {
  return {
    props: {
      option: {
        type: Object,
        required: true,
        default: () => {
          return {}
        }
      }
    },
    components: {
      crudInput,
      crudSelect,
      crudRadio,
      crudCheckbox,
      crudDate,
      crudTime,
      crudCascader,
      crudInputNumber,
      crudSwitch,
      crudRate,
      crudUpload,
      crudSilder,
      crudImg
    },
    watch: {
      tableForm: {
        handler() {
          this.$emit("input", this.tableForm)
        },
        deep: true
      },
      form: {
        handler() {
          this.$emit("input", this.form)
        },
        deep: true
      },
      option: {
        handler() {
          // 正在进行排序操作时不触发
          if (this.isSorting) return
          this.init()
        },
        deep: true
      }
    },
    data() {
      return {
        DIC: {},
        dicCascaderList: [],
        isLoadLocal: false,
        isSorting: false,
        eventHandlers: []
      }
    },
    created() {
      this.init()
    },
    computed: {
      menuType() {
        return this.tableOption.menuType || this.$AVUE.menuType || "button"
      },
      isMediumSize() {
        return this.controlSize === "medium" ? "small" : this.controlSize
      },
      controlSize() {
        return this.tableOption.size || (this.$AVUE || {}).size || "medium"
      },
      localStorageKey() {
        const { localStorageSymbol } = this.tableOption
        const urlHash = window.location.hash
        // 若同个页面有两个不同的表格可添加localStorageSymbol属性，对路由进行区分。
        return localStorageSymbol ? `${urlHash}/${localStorageSymbol}` : urlHash
      }
    },
    methods: {
      init() {
        // 初始化工具
        this.initFun()

        this.tableOption = this.option

        this.isLoadLocal = false
        let localTableColumnOption
        if (this.vaildData(this.option.enableLocalStorage, true)) {
          var localTableColumnOptionStr = localStorage.getItem(this.localStorageKey)
          if (localTableColumnOptionStr) {
            localTableColumnOption = JSON.parse(localTableColumnOptionStr)
            this.isLoadLocal = true
          }
        }
        if (this.isLoadLocal) {
          this.tableOption.column.forEach((col) => {
            let localColumn = localTableColumnOption[col.prop]
            if (localColumn) {
              if (localColumn.width) {
                this.$set(col, "width", localColumn.width)
              }
              if (localColumn.hide) {
                this.$set(col, "hide", localColumn.hide)
              }
              // 列表排序字段
              if (localColumn.sortIndex || localColumn.sortIndex === 0) {
                this.$set(col, "sortIndex", localColumn.sortIndex)
              }
              // 列表固定字段
              if (localColumn.fixed) {
                this.$set(col, "fixed", localColumn.fixed)
              }
            }
          })
          this.isSorting = true
          this.tableOption.column.sort((a, b) => a.sortIndex - b.sortIndex)
          this.$nextTick(() => {
            this.isSorting = false
          })
        }

        const dicFlag = this.vaildData(this.tableOption.dicFlag, true)
        // 规则初始化
        this.rulesInit()

        // 初始化字典
        if (dicFlag) this.dicInit()
        else this.DIC = this.tableOption.dicData

        // 初始化表单formInitVal;
        this.formInit()
      },
      dicInit() {
        let locaDic = this.tableOption.dicData || {}
        this.columnOption.forEach((ele) => {
          if (this.vaildData(ele.dicFlag, true)) {
            if (!validatenull(ele.dicUrl)) {
              this.dicCascaderList.push({
                dicUrl: ele.dicUrl,
                dicData: ele.dicData
              })
            } else if (!validatenull(this.tableOption.dicUrl) && typeof ele.dicData === "string") {
              this.dicCascaderList.push({
                dicUrl: this.tableOption.dicUrl,
                dicData: ele.dicData
              })
            }
          }
        })
        this.GetDic().then((data) => {
          this.DIC = Object.assign({}, locaDic, data)
        })
      },
      vaildData(val, dafult) {
        if (typeof val === "boolean") {
          return val
        }
        return !validatenull(val) ? val : dafult
      },
      GetDicByType(href) {
        return new Promise((resolve) => {
          this.$http.get(href).then(function (res) {
            // 降级处理
            const list = res.data
            if (!validatenull(list.data)) {
              resolve(list.data instanceof Array ? list.data : [])
            } else if (!validatenull(list)) {
              resolve(list instanceof Array ? list : [])
            } else {
              resolve([])
            }
          })
        })
      },
      GetDic() {
        return new Promise((resolve) => {
          let result = []
          let dicData = {}
          let cascaderList = Object.assign([], this.dicCascaderList)
          if (validatenull(cascaderList)) resolve({})
          cascaderList.forEach((ele) => {
            result.push(
              new Promise((resolve) => {
                this.GetDicByType(`${ele.dicUrl.replace("{{key}}", ele.dicData)}`).then(function (res) {
                  resolve(res)
                })
              })
            )
          })
          Promise.all(result).then((data) => {
            cascaderList.forEach((ele, index) => {
              dicData[ele.dicData] = data[index]
            })
            resolve(dicData)
          })
        })
      },
      initFun() {
        Object.keys(utils).forEach((key) => {
          this[key] = utils[key]
        })
      },
      // 计算每列宽度
      calcColWidth() {
        let minWidth = 100
        let maxWidth = 200
        let column = this.tableOption.column
        let tableData = this.list

        // 创建一个 span 用于测量文本宽度
        const span = document.createElement("span")
        span.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap"
        document.body.appendChild(span)

        if (tableData?.length) {
          // 使用map缓存sortable的结果
          const sortableMap = new Map(column.map((item) => [item.prop, this.vaildData(item.sortable, true)]))

          column.forEach((item) => {
            if (!item.width && !item.minWidth) {
              // 如果有排序功能，则排序按钮宽度为 24px
              const isSortable = sortableMap.get(item.prop)
              const sortableWidth = isSortable ? 24 : 0

              // 只获取第一行数据进行计算
              const firstRowData = tableData[0][item.prop]
              const headerWidth = this.getTextWidth(item.label, span)

              // 优化最大宽度计算逻辑
              let contentWidth =
                typeof firstRowData === "object" ? maxWidth : this.getTextWidth(String(firstRowData || ""), span)

              // 取表头宽度和内容宽度的最大值
              let finalWidth = Math.max(headerWidth, contentWidth)

              // 确保最小宽度且考虑排序图标
              item.minWidth = Math.max(
                minWidth,
                finalWidth + (finalWidth - headerWidth <= sortableWidth ? sortableWidth : 0)
              )
            }
          })
        }

        // 移除用于测量宽度的 span 元素
        document.body.removeChild(span)
      },

      // 用 span 标签包裹内容，然后获取 span 的宽度
      getTextWidth(str, span) {
        span.textContent = str
        return span.offsetWidth + 30 // 30px作为padding
      }

      // // 表格筛选功能交互
      // setSearchLabel(className = ".avue-crud__left") {
      //   const elObj = {
      //     input: `${className} .el-form-item__content .el-input:first-of-type input:not(.needChangeTime *):not(.needChangeSelect *):not(.avue-crud-search-item *):not(.exclude-label *)`,
      //     searchFilterable: `${className} .el-form-item__content>.el-select>.el-select__tags>input:not(.needChangeTime *):not(.needChangeSelect *):not(.avue-crud-search-item *):not(.exclude-label *)`,
      //     searchNoFilterable: `${className} .el-form-item__content>.el-select .el-input:nth-of-type(2) input:not(.needChangeTime *):not(.needChangeSelect *):not(.avue-crud-search-item *):not(.exclude-label *)`
      //   }

      //   // 获取下拉多选的input元素
      //   const getSearchMultipleInput = (parentNode) => {
      //     return parentNode.nextElementSibling.querySelector("input")
      //   }

      //   // 移除下拉多选的placeholder
      //   const removePlaceholder = (el, key, parentNode, input) => {
      //     if (input) {
      //       input.removeAttribute("placeholder")
      //     } else if (key === "searchFilterable") {
      //       const input = getSearchMultipleInput(parentNode)
      //       input.removeAttribute("placeholder")
      //     }
      //     el.removeAttribute("placeholder")
      //   }

      //   // 获取 placeholder的值
      //   const getPlaceholder = (el, parentNode, key) => {
      //     let placeholder = el.getAttribute("placeholder")

      //     // 下拉多选的特殊处理
      //     if (key === "searchFilterable") {
      //       const input = getSearchMultipleInput(parentNode)
      //       placeholder = input.getAttribute("placeholder")
      //       removePlaceholder(el, key, parentNode, input)
      //     } else {
      //       removePlaceholder(el, key, parentNode)
      //     }

      //     return placeholder
      //   }

      //   const createLabel = (placeholder) => {
      //     // 创建label 标签
      //     const label = document.createElement("label")
      //     label.innerText = placeholder
      //     label.classList.add("input-label")
      //     return label
      //   }

      //   // 获取input 和 下拉多选的值
      //   const getValue = (el, key, parentNode) => {
      //     return (
      //       el?.value ||
      //       (key === "searchFilterable" && parentNode.querySelector(".el-tag")) ||
      //       (key === "searchNoFilterable" && parentNode.previousElementSibling.querySelector(".el-tag"))
      //     )
      //   }

      //   Object.keys(elObj).forEach((key) => {
      //     const elements = document.querySelectorAll(elObj[key])
      //     elements.forEach((el) => {
      //       el.classList.add("input-field")
      //       // 获取input 的父节点
      //       let parentNode = el.parentNode
      //       const label = createLabel(getPlaceholder(el, parentNode, key))
      //       // 将label 插入到input 的前面
      //       parentNode.insertBefore(label, el)

      //       // 如果有默认值的情况
      //       const hasValue = getValue(el, key, parentNode)
      //       if (hasValue) {
      //         label.classList.add("label-shrink")
      //       }

      //       const handleFocus = () => {
      //         label.classList.add("label-shrink")
      //         removePlaceholder(el, key, parentNode)
      //       }

      //       const handleBlur = () => {
      //         setTimeout(() => {
      //           // 如果有值
      //           const hasValue = getValue(el, key, parentNode)
      //           label.classList.toggle("label-shrink", hasValue)
      //           if (!hasValue) {
      //             removePlaceholder(el, key, parentNode)
      //           }
      //         }, 300)
      //       }

      //       const handleClick = () => {
      //         label.classList.remove("label-shrink")
      //         removePlaceholder(el, key, parentNode)
      //       }

      //       const handleMouseEnter = (e) => {
      //         const hasValue = getValue(el, key, parentNode)
      //         // 如果有值
      //         if (hasValue) {
      //           const suffixClose = e.target.querySelector(".el-icon-circle-close")
      //           if (suffixClose) {
      //             // 监听点击清除
      //             suffixClose.addEventListener("click", handleClick, { once: true })
      //           }
      //         }
      //       }

      //       // 监听input 的focus 事件
      //       el.addEventListener("focus", handleFocus)
      //       // 监听input 的blur 事件
      //       el.addEventListener("blur", handleBlur)
      //       // 监听鼠标进入事件
      //       const targetNode = key === "searchFilterable" ? parentNode.nextElementSibling : parentNode
      //       targetNode.addEventListener("mouseenter", handleMouseEnter)

      //       // 保存这些监听，在合适的时候清除
      //       this.eventHandlers.push({ el, targetNode, handleFocus, handleBlur, handleMouseEnter })
      //     })
      //   })
      // },
      // // 清除监听
      // removeSearchLabelListeners() {
      //   this.eventHandlers.forEach(({ el, targetNode, handleFocus, handleBlur, handleMouseEnter }) => {
      //     el.removeEventListener("focus", handleFocus)
      //     el.removeEventListener("blur", handleBlur)
      //     targetNode.removeEventListener("mouseenter", handleMouseEnter)
      //   })
      //   this.eventHandlers = []
      // },
      // removeLabelShrink() {
      //   const elements = document.querySelectorAll(
      //     ".avue-crud__left .input-label, .avue-crud__searchAdvanced .input-label"
      //   )

      //   elements.forEach((labelEl) => {
      //     const inputEl = labelEl.nextElementSibling
      //     if (inputEl.value) {
      //       labelEl.classList.add("label-shrink")
      //     } else {
      //       labelEl.classList.remove("label-shrink")
      //     }

      //     if (inputEl) {
      //       inputEl.removeAttribute("placeholder")
      //     }
      //   })
      // }
    }
  }
}
