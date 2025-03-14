/**
 * 全站权限配置
 *
 */
import router from "./router/router"
import store from "./store"
import { validatenull } from "@/util/validate"
import { getToken } from "@/util/auth"
import { getStore } from "@/util/store"
import NProgress from "nprogress" // progress bar
import "nprogress/nprogress.css" // progress bar style
import { Message, MessageBox } from "element-ui"
import { isPhone } from "./views/mobile/util/util"
import { initMenu } from "./views/mobile/util/util"
import { checkPasswordDeadLineApi } from "@/api/admin/user"

NProgress.configure({ showSpinner: false })
const lockPage = store.getters.website.lockPage // 锁屏页
router.beforeEach((to, from, next) => {
  console.log("【beforeEach】")
  /*
   * 若已登录 & 移动端设备 & 不为移动端路由  ====>  跳转
   * */
  // if (isPhone() && to.path.indexOf("/mobile") === -1 && getToken()) {
  //   next({ path: "/mobile" })
  //   return
  // }

  //检测路由是否存在，不存在路由还跳转的话就会白屏
  //1、人为输入一个不存在路由引起白屏
  //2、动态菜单在登录超时，引起白屏
  //尝试跳转首页
  if (!to.matched || to.matched.length === 0) {
    if (!isPhone()) {
      // 如果用户已登录但路由不存在，可能是动态路由还没加载完成
      if (getToken()) {
        // 重新获取路由
        store
          .dispatch("GetMenu")
          .then(() => {
            // router.$avueRouter.routerList = []
            router.$avueRouter.formatRoutes(store.state.user.menu, true)
            // 检查获取菜单后路由是否存在
            const route = router.match(to.path)
            if (route.matched.length > 0) {
              next({ ...to, replace: true }) // 重新尝试路由跳转
            } else {
              next({ path: "/404" }) // 如果路由还是不存在，直接去404
            }
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              next({ path: "/login" })
            })
          })
        return
      }
      // 如果未登录，跳转到登录页
      next({ path: "/login" })
      return
    }
  }
  // 缓冲设置
  if (
    to.meta.keepAlive === true &&
    store.state.tags.tagList.some((ele) => {
      return ele.value === to.fullPath
    })
  ) {
    to.meta.$keepAlive = true
  } else {
    NProgress.start()
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = to.meta.keepAlive || false
    }
  }

  const meta = to.meta || {}
  if (getToken()) {
    if (store.getters.isLock && to.path != lockPage) {
      next({ path: lockPage })
    } else if (to.path === "/login") {
      next({ path: "/" })
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch("GetUserInfo")
          .then(() => {
            //有些用户没有角色信息，会导致无限跳转
            if (store.getters.roles.length > 0) {
              next({ ...to, replace: true })
            } else {
              store.dispatch("FedLogOut").then(() => {
                Message({
                  message: "用户登录失败，该用户未配置角色，请联系管理员！",
                  type: "error"
                })
                //next({...{ path: '/login',query:{ error_code:'noroles' } }, replace: true})

                next({ path: "/login" })
              })
            }
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              // debugger
              next({ path: "/login" })
            })
          })
      } else {
        const value = to.query.src || to.fullPath
        const label = to.query.name || to.name
        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit("ADD_TAG", {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: router.$avueRouter.group || [],
            isLocalStore: meta.isLocalStore || false
          })
        }

        if (to.matched.length === 0) {
          const reg = /mobile/g
          if (reg.test(to.path)) {
            initMenu(store, router)
          }
        }
        next()
      }
    }
    // 检测是否需要修改密码
    if (to.path != "/info/index" && to.path != "/login" && store.getters.roles.length > 0) {
      const userInfo = getStore({ name: "user_info", type: "session" })
      if (!userInfo?.userId) return
      checkPasswordDeadLineApi({ userId: userInfo?.userId }).then((res) => {
        if (res.data.code === 0) {
          if (!res.data.data) {
            // 需要修改密码
            MessageBox.confirm("注意：您的密码已经超过90天未修改，请您尽快修改密码！", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then((res) => {
                next({ path: "/info/index" })
              })
              .catch((e) => {
                store.dispatch("LogOut").then(() => {
                  next({ path: "/login" })
                })
              })
          }
        }
      })
    }
  } else {
    if (meta.isAuth === false) {
      next()
    } else {
      // debugger
      next("/login")
    }
  }
})

router.afterEach((to) => {
  NProgress.done()
  const title = isPhone() ? to.meta.$name : store.getters.tag.label
  router.$avueRouter.setTitle(title)
})
