import Index from "../views/index/index"
import defaultPage from "../views/index/df"
/*
 * 移动端所有路由都继承在/mobile路由下面
 * */
export default [
  {
    path: "/mobile",
    component: Index,
    name: "",
    children: [
      {
        path: "/",
        component: () => import(/* webpackChunkName: "mobile" */ "@/views/mobile/views/index/df.vue"),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
]
