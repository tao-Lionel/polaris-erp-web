"use strict"
class PreventShake {
  /**
 * 公用 数据防抖
 * 参数：cb未回调函数
 *      
 * 使用案例：  
 * 1,script标签引入,eg:   import  {PreventShake}  from "../../../util/tool.js";
 * 
 * 2，PreventShake.preventShake(bool => {
                        if(bool){
                            //TODO
                            
                        }
                    });

 * 
 */
  constructor() {
    this.flag = false
    this.timer = null
  }

  preventShake(cb, time) {
    let disTime = time || 300 //默认取300
    clearTimeout(this.timer)
    this.timer = setTimeout(function () {
      this.flag = true
      cb(true)
    }, disTime)

    if (!this.flag) {
      this.flag = false
      cb(false)
      return
    }
    this.flag = false
  }
}

export let preventShake = new PreventShake()

export function debounce(func, wait) {
  let timeout, result

  return function () {
    let context = this
    let args = arguments

    clearTimeout(timeout)
    timeout = setTimeout(function () {
      result = func.apply(context, args)
    }, wait)

    return result
  }
}

export function throttle(fn, delayTime) {
  /**
   * 节流方法，delayTime单位为毫秒
   * 当前文件的 tableHeaderFixed【table头部悬浮】有使用案例
   *
   */
  let preTime = Date.now()
  return function () {
    let _this = this
    let args = arguments
    let nowTime = Date.now()
    if (nowTime - preTime >= delayTime) {
      fn.apply(_this, args)
      preTime = Date.now()
    }
  }
}

export function validateInput(className) {
  let inputBoxArr = document.getElementsByClassName(className) //"validate_wrapper";
  let tipFlag = true
  for (let boxInd = 0; boxInd <= inputBoxArr.length - 1; boxInd++) {
    let inputBox = inputBoxArr[boxInd]
    let inputArr = inputBox.getElementsByTagName("input")

    for (let i = 0; i <= inputArr.length - 1; i++) {
      let value = inputArr[i].value
      let numberInputAttr = inputArr[i].getAttribute("role")
      let currentDomParent = inputArr[i].parentNode
      let error = currentDomParent.getElementsByClassName("error-tip")
      //if(error&&error.length>0){
      // inputArr[i].parentNode.removeChild(error[0])
      // }

      if (!numberInputAttr) {
        let createTip = document.createElement("p")
        let tipText = inputArr[i].getAttribute("placeholder")

        createTip.className = "error-tip"
        createTip.innerHTML = tipText
        if (error.length < 1) {
          currentDomParent.appendChild(createTip)
        }

        if (!value) {
          inputArr[i].style.borderColor = "#f56c6c"
          createTip.style.visibility = "visible"
          tipFlag = false
        } else {
          inputArr[i].style.borderColor = "#dcdfe6"
          inputArr[i].parentNode.lastChild.style.visibility = "hidden"
          // createTip.style.visibility="hidden"
        }
      }
    }
  }
  return tipFlag
}

export function fixedTableHeader(scrollView, isCollapse) {
  let elTable = Array.from(scrollView.querySelectorAll(".el-table"))
  if (!elTable) return

  elTable.forEach((el) => {
    // 多表格悬浮
    if (!el.classList.contains("cancelFixedTop") && !install.isDialogTable(el)) {
      // console.log(el)
      let tableHeaderWrapper = el.querySelector(".el-table__header-wrapper")
      if (tableHeaderWrapper) {
        let distanceHeadHeight = tableHeaderWrapper.getBoundingClientRect().height
        let distanceTop = el.getBoundingClientRect().top
        let tableBodyWrapper = el.querySelector(".el-table__body-wrapper")
        let el_table__row = el.querySelector(".el-table__fixed-header-wrapper") //头部全选
        let el_table__fixed_body_wrapper = el.querySelector(".el-table__fixed-body-wrapper")
        let vTop = scrollView.getBoundingClientRect().top //可视区域
        let elHeight = el.offsetHeight
        // debugger

        if (distanceTop <= vTop && distanceTop >= -elHeight + vTop) {
          if (el_table__row) {
            //区分是否有头部
            el_table__row.classList.add("y-table-hide")
            el_table__fixed_body_wrapper.style.top = 0
          }
          if (tableHeaderWrapper) {
            tableHeaderWrapper.classList.add("fixedTop")
            tableHeaderWrapper.style.top = vTop + "px"

            // tableHeaderFixStatus(el, 'show')

            let tempInsert = install.getEle("temp-insert", el)
            if (tempInsert.length < 1) {
              let insert = install.createEle("div", "temp-insert", "height:" + distanceHeadHeight + "px")
              el.insertBefore(insert, tableHeaderWrapper)
              insert = null
            }
          }
        } else {
          if (el_table__row) {
            el_table__row.classList.remove("y-table-hide")
            el_table__fixed_body_wrapper.style.top = el_table__row.offsetHeight + "px"
          }

          if (tableHeaderWrapper) {
            tableHeaderWrapper.classList.remove("fixedTop")
            let insertDom = install.getEle("temp-insert", el)

            // tableHeaderFixStatus(el, 'hide')

            if (insertDom.length > 0) {
              el.removeChild(insertDom[0])
            }
          }
        }

        // if (tableHeaderWrapper) {
        /* && /fixedTop/ig.test(tableHeaderWrapper.className)*/
        tableHeaderWrapper.style.width = tableBodyWrapper.offsetWidth !== 0 ? tableBodyWrapper.offsetWidth + "px" : null
        // tableHeaderWrapper.removeAttribute("style")
        // }
      }
    }
  })
}

// 解决table列的fixed状态跟表头fixed状态样式冲突
function tableHeaderFixStatus(el, status) {
  let el_table__fixed_right = el.querySelector(".el-table__fixed-right")
  let el_table__fixed = el.querySelector(".el-table__fixed")
  let is_hidden = el.querySelector(".has-gutter").getElementsByClassName("is-hidden")

  if (el_table__fixed && !el_table__fixed_right) {
    el_table__fixed.style.top = status === "show" ? "45px" : 0
  } else if (!el_table__fixed && el_table__fixed_right) {
    el_table__fixed_right.style.top = status === "show" ? "45px" : 0
  } else if (el_table__fixed && el_table__fixed_right) {
    el_table__fixed.style.top = status === "show" ? "45px" : 0
  }
  for (let i = 0; i < is_hidden.length; i++) {
    is_hidden[i].children[0].style.visibility = status === "show" ? "visible" : "hidden"
  }
}

let install = {
  isTable: true, //是否为table中input
  getEle: function (targetClassName, targetParent) {
    /**
     * 获取指定class元素
     *
     */
    //console.log(targetClassName, targetParent)
    targetParent = targetParent || document
    let tartget = targetParent.getElementsByClassName(targetClassName)

    if (tartget) {
      return Array.from(tartget)
    } else {
      return []
    }
  },
  createEle(ele, cls, sty) {
    let c = document.createElement(ele)
    if (cls) {
      c.setAttribute("class", cls)
    }
    if (sty) {
      c.setAttribute("style", sty)
    }

    return c
  },
  handleElementUIPopper: function () {
    /***
     * 处理element滚动时，select不动
     *
     */

    let inputIsFocus = this.getEle(".is-focus")[0]

    // close-table-select
    if (!inputIsFocus) return //有聚焦
    let avueCrud = this.getEle(".close-table-select")
    if (avueCrud.length < 1) {
      avueCrud = null
      return
    } //有指定的table

    let avueCrudFocus = this.getEle(".is-focus", avueCrud[0])
    if (avueCrudFocus.length < 1) {
      avueCrudFocus = null
      return
    } //不是table中的

    if (avueCrud && avueCrud.length > 0 && avueCrudFocus && avueCrudFocus.length > 0) {
      avueCrudFocus[0].click()
    }

    inputIsFocus = null
    avueCrud = null
    avueCrudFocus = null
  },
  isDialogTable(ele) {
    // 查询是否属于dialog中的table
    if (ele) {
      const ele_parent = ele.parentNode
      const is_origin = ele_parent.classList.contains("el-dialog__wrapper")
      if (is_origin) {
        // 属于dialog内table
        return true
      } else {
        // 不属于
        //console.log('父类dom', is_origin)
        //容错处理， 到父类scrollView||avue-main停止
        if (ele_parent.classList.contains("scrollView")) return false
        if (ele_parent.classList.contains("avue-main")) return false
        return this.isDialogTable(ele_parent)
      }
    }
  }
}

export function tableHeaderFixed() {
  /*
        控制table的header悬浮顶部
    
    */
  let scrollView = document.querySelector(".scrollView")

  if (!scrollView) return
  if (scrollView) {
    scrollView.onscroll = debounce(function () {
      // 表格头部悬浮
      fixedTableHeader(scrollView)
      // 表格内选项隐藏
      install.handleElementUIPopper()
    }, 50)

    // 页面缩放，控制头部长度
    window.onresize = debounce(function () {
      fixedTableHeader(scrollView)
      install.handleElementUIPopper()
    }, 50)
  }
}

export function limitFilesMaxSize(files) {
  /**
   * 限制文件集合上传大小
   * 参数 file 数组
   */
  let size = 0
  files.forEach((f) => {
    if (f.size) {
      size += f.size
    }
  })
  if (size / 1024 / 1024 > 20) {
    return false
  } else {
    return true
  }
}
