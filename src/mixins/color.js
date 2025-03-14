import { mapGetters } from "vuex"
const version = require("element-ui/package.json").version // element-ui version from node_modules
const ORIGINAL_THEME = "#409EFF" // default color
export default function () {
  return {
    data() {
      return {
        themeVal: ORIGINAL_THEME
      }
    },
    created() {
      this.themeVal = this.theme
    },
    // updated(){
    // console.log('mixins')
    /**
     * 非最佳办法
     *
     */
    // this.$store.commit('SET_THEME', this.themeVal)
    // this.updateTheme(this.themeVal, ORIGINAL_THEME)
    // },
    watch: {
      themeVal(val, oldVal) {
        this.$store.commit("SET_THEME", val)
        this.updateTheme(val, oldVal)
      }
    },
    computed: {
      ...mapGetters(["theme"])
    },
    methods: {
      updateTheme(val, oldVal) {
        /**
         * val 最终值，eg：#FF40A3
         * oldVal 原始颜色
         *
         */
        //  console.log(val)
        if (typeof val !== "string") return
        const head = document.getElementsByTagName("head")[0]
        // 旧颜色集合
        const originalCluster = this.getThemeCluster(oldVal.replace("#", ""))
        // 新颜色集合
        const themeCluster = this.getThemeCluster(val.replace("#", ""))
        //替换style 标签中的样式
        const styles = [].slice.call(document.querySelectorAll("style")).filter((style) => {
          const text = style.innerText
          return new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
        })

        document.documentElement.style.setProperty("--primary-color", val)

        styles.forEach((style) => {
          const { innerText } = style
          if (typeof innerText !== "string") return
          style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
        })

        const getHandler = (variable, id) => {
          return () => {
            const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace("#", ""))
            const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

            // 将style插入header标签
            let styleTag = document.getElementById(id)
            if (!styleTag) {
              styleTag = document.createElement("style")
              styleTag.setAttribute("id", id)
              head.appendChild(styleTag)
            }
            styleTag.innerText = newStyle
          }
        }

        const chalkHandler = getHandler("chalk", "chalk-style")

        //替换ElementUI中的样式 参看public/index.html
        if (!this.chalk) {
          //const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
          const url = "/cdn/element-ui/2.4.11/theme-chalk/index.css"
          this.getCSSString(url, chalkHandler, "chalk")
        } else {
          chalkHandler()
        }

        //替换APP样式文件
        const link = [].slice.call(document.getElementsByTagName("head")[0].getElementsByTagName("link"))
        for (let i = 0; i < link.length; i++) {
          const style = link[i]
          if (style.href.indexOf("/css/app") != -1 && style.getAttribute("rel") === "stylesheet") {
            this.getCSSString(style.href, (innerText) => {
              const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace("#", ""))
              const newStyle = this.updateStyle(innerText, originalCluster, themeCluster)

              // 将style插入header标签
              let styleTag = document.getElementById("appStyle")
              if (!styleTag) {
                styleTag = document.createElement("style")
                styleTag.setAttribute("id", "appStyle")
                head.appendChild(styleTag)
              }
              styleTag.innerText = newStyle
            })
            break
          }
        }
      },
      ///////
      updateStyle(style, oldCluster, newCluster) {
        let newStyle = style
        oldCluster.forEach((color, index) => {
          newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index])
        })
        return newStyle
      },

      getCSSString(url, callback, variable) {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            if (variable) {
              this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "")
            }
            callback(xhr.responseText)
          }
        }
        xhr.open("GET", url)
        xhr.send()
      },

      getThemeCluster(theme) {
        // 获取以 theme 为准的渐变颜色集合
        const tintColor = (color, tint) => {
          let red = parseInt(color.slice(0, 2), 16)
          let green = parseInt(color.slice(2, 4), 16)
          let blue = parseInt(color.slice(4, 6), 16)

          if (tint === 0) {
            // when primary color is in its rgb space
            return [red, green, blue].join(",")
          } else {
            red += Math.round(tint * (255 - red))
            green += Math.round(tint * (255 - green))
            blue += Math.round(tint * (255 - blue))
            //处理ELEMENT-UI 当为纯色时的BUG，如FF0000 变成了 FF00
            if (ORIGINAL_THEME.toUpperCase() === color.toUpperCase()) {
              red = red.toString(16)
              green = green.toString(16)
              blue = blue.toString(16)
            } else {
              red = red.toString(16).padLeft(2, "0")
              green = green.toString(16).padLeft(2, "0")
              blue = blue.toString(16).padLeft(2, "0")
            }

            return `#${red}${green}${blue}`
          }
        }

        const shadeColor = (color, shade) => {
          let red = parseInt(color.slice(0, 2), 16)
          let green = parseInt(color.slice(2, 4), 16)
          let blue = parseInt(color.slice(4, 6), 16)

          red = Math.round((1 - shade) * red)
          green = Math.round((1 - shade) * green)
          blue = Math.round((1 - shade) * blue)
          //处理ELEMENT-UI 当为纯色时的BUG，如FF0000 变成了 FF00
          if (ORIGINAL_THEME.toUpperCase() === color.toUpperCase()) {
            red = red.toString(16)
            green = green.toString(16)
            blue = blue.toString(16)
          } else {
            red = red.toString(16).padLeft(2, "0")
            green = green.toString(16).padLeft(2, "0")
            blue = blue.toString(16).padLeft(2, "0")
          }

          return `#${red}${green}${blue}`
        }

        const clusters = [theme]
        for (let i = 0; i <= 9; i++) {
          clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
        }
        clusters.push(shadeColor(theme, 0.1))
        return clusters
      }
    }
  }
}
