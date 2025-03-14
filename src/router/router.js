import VueRouter from "vue-router"
import PageRouter from "./page/"
import ViewsRouter from "./views/"
import AvueRouter from "./avue-router"
import MobileRouter from "../views/mobile/router/"
import Store from "../store/"

let Router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  // mode:"history",//默认hash
  routes: [].concat([])
})
AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
Router.addRoutes([...PageRouter, ...ViewsRouter, ...MobileRouter])
// Router.addRoute(PageRouter, ViewsRouter, MobileRouter)
export default Router
