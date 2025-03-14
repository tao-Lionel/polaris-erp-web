import mobileRouters from "../router/index"
export const isPhone = () => {
  /**
   * 区分手机/PC
   * */
  const userAgentInfo = navigator.userAgent
  const reg = /Android|iPhone|Windows Phone|Adr|IOS/gi
  return !!userAgentInfo.match(reg)
}

export const flexible = () => {
  /**
   * 适配手机端 rem
   * */
  ;((window, document) => {
    function resizeFn() {
      let html = document.querySelector("html")
      let body = document.getElementsByTagName("body")[0]
      let screenWidth = window.screen.width
      let screenHeight = window.screen.height
      screenWidth = screenWidth > screenHeight ? screenHeight : screenWidth //横屏、竖屏
      const dpr = window.devicePixelRatio
      html.setAttribute("data-dpr", dpr.toString())
      html.style.fontSize = screenWidth / 10 + "px"

      if (768 <= screenWidth && screenWidth < 1024) {
        html.style.fontSize = "76.8px"
        body.style.fontSize = 26 / (screenWidth / 10) + "rem"
        return
      } else if (screenWidth >= 1024) {
        html.style.fontSize = "76.8px"
        body.style.fontSize = 40 / (screenWidth / 10) + "rem"
        return
      }

      body.style.fontSize = 14 / (screenWidth / 10) + "rem"
      //未完待续
    }

    window.addEventListener("resize", resizeFn)
    resizeFn()
  })(window, document)
}

export const vantTabsScrollToTarget = (ele) => {
  ele = ele && ele.length > 0 ? ele[0] : null
  const app = document.getElementById("app")
  const tabsTop = document.getElementsByClassName("van-tabs")[0].offsetTop
  if (ele) {
    app.scrollTo(0, ele.offsetTop + (tabsTop - 30))
  }
}

export const initMenu = (store, routers) => {
  store.dispatch("GetMenu").then((data) => {
    if (data.length === 0) return
    routers.$avueRouter.routerList = []
    routers.$avueRouter.formatRoutes(data, true, {
      isMobile: true,
      initMobileRouter: mobileRouters
    })
  })
}
