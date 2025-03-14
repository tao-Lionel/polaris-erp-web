import { preventShake, throttle } from "./tool"

// 自定义指令文件
class SearchInput {
  /*
    1,作用:将input空格转成逗号,连续多个逗号,转为1个,禁止输入部分特殊字符
    2,用法:v-search-input="inputModel"或v-search-input
    
    */
  constructor() {
    const regExpRules = /[\"\'><]/gim
    this.name = "search-input"
    this.methods = {
      bind: function (e, b, v) {
        const elArr = e.getElementsByTagName("input")
        let el = null
        if (elArr.length > 1) {
          el = elArr[1]
        } else {
          el = elArr[0]
        }
        // const [el] = e.getElementsByTagName("input")
        el.addEventListener("change", function () {
          let val = this.value ? this.value.trim().replace(/\s+/gm, ",") : ""
          val = val.replace(/\,+/gm, ",")
          val = val.replace(regExpRules, "")
          v.data.model.callback(val)
        })
      },
      unbind(el) {
        el.removeEventListener("change", function () {})
      }
    }
  }
}

class SearchInputTrim {
  /*
        1,作用:只去除input前后空格
        2,用法:v-search-input-trim="inputModel"或v-search-input-trim
 
*/
  constructor() {
    this.name = "search-input-trim"
    this.methods = {
      bind: function (e, b, v) {
        const regExpRules = /[\"\'><]/gim
        let input = Array.from(e.getElementsByTagName("input"))
        let textarea = Array.from(e.getElementsByTagName("textarea"))
        let [el] = input.length > 0 ? input : textarea
        el.addEventListener("keyup", function () {
          let _this = this
          preventShake.preventShake(function (bool) {
            if (bool) {
              let val = _this.value ? _this.value.trim() : ""
              v.data.model.callback(val.replace(regExpRules, ""))
            }
          }, 500)
        })
      },
      unbind(el) {
        el.removeEventListener("keyup", function () {})
      }
    }
  }
}

class MergeTableHeaderRow {
  constructor() {
    /**
     * 合并table的表头
     *
     */
    this.name = "merge-header-row"
    this.methods = {
      bind: function (e, b, v) {
        let table = v.child.$children[0].$el
        let tableHeader = table.querySelector(".el-table__header-wrapper").querySelector(".has-gutter")
        var timer = null
        clearTimeout(timer)
        timer = setTimeout(function () {
          let th = Array.from(tableHeader.getElementsByTagName("th"))
          b.value.forEach((val, index) => {
            th[val.index].setAttribute("colspan", val.col)
            for (let i = val.index + 1; i < val.index + val.col; i++) {
              th[index].parentNode.removeChild(th[i])
            }
          })

          tableHeader = null
          th = null
        }, 0)

        table = null
      },
      unbind(el) {}
    }
  }
}

class ResizeDialog {
  constructor() {
    this.name = "resize-dialog"
    this.methods = {
      bind(e, b, v) {
        let target = Array.from(e.children)[0]
        let header = target.firstChild
        let startX = null
        let startY = null
        header.style.cursor = "move"

        header.onmousedown = function () {
          target.setAttribute("draggable", true)

          target.ondragstart = function (event) {
            startX = event.offsetX
            startY = event.offsetY
          }
          e.ondragover = function (event) {
            event.preventDefault()
          }

          e.ondrop = function (event) {
            target.removeAttribute("style.scss")
            target.style.position = "absolute"
            // target.style.position = 'fixed';
            target.style.left = event.offsetX - startX + "px"
            target.style.top = event.offsetY - startY + "px"

            target.setAttribute("draggable", false)
            target.ondragstart = null
            e.ondrop = null
            e.ondragover = null
          }
        }

        // header.addEventListener('keydown',function(){
        //     console.log(1)
        // })
      }
    }
  }

  // createElement(ele,cls){
  //     let create=document.createElement(ele);
  //     create.setAttribute('class',cls);
  //     return create
  // }
}

class MoveFixed {
  constructor() {
    this.name = "move-fixed"
    this.methods = {
      bind(ele) {
        let left = null
        let top = null
        let bodyNode = document.documentElement || document.body
        ele.firstChild.style.cursor = "move"
        ele.firstChild.onmousedown = function (event) {
          left = event.offsetX
          top = event.offsetY

          ele.firstChild.style.userSelect = "none"

          let moveX = null
          let moveY = null
          let nl = null
          let nt = null
          bodyNode.onmousemove = throttle(function (e) {
            moveX = e.clientX
            moveY = e.clientY
            nl = moveX - left
            nt = moveY - top
            ele.style.left = nl + "px"
            ele.style.top = nt + "px"
          }, 20)
        }
        //鼠标抬起事件
        ele.onmouseup = function () {
          //开关关闭
          ele.firstChild.style.userSelect = "unset"
          ele.style.cursor = "default"
          bodyNode.onmousemove = null
        }
      }
    }
  }
}

const searchInput = new SearchInput()
const searchInputTrim = new SearchInputTrim()
const mergeTableHeaderRow = new MergeTableHeaderRow()
const resizeDialog = new ResizeDialog()
const moveFixed = new MoveFixed()

export { searchInput, searchInputTrim, mergeTableHeaderRow, resizeDialog, moveFixed }
