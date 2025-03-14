import Layout from "@/page/index/"

export default [
  {
    //刷新路由，用于刷新当前页面的路由
    path: "/refresh",
    component: Layout,
    children: [
      {
        path: "/refresh/:path*",
        component: () => import("@/views/refresh/index"),
        meta: {
          keepAlive: true,
          isTab: false,
          isAuth: false
        }
      }
    ]
  },
  {
    path: "/login",
    name: "登录页",
    component: () => import(/* webpackChunkName: "page" */ "@/page/login/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/wxoauth",
    name: "认证页",
    component: () => import(/* webpackChunkName: "page" */ "@/page/login/wxoauth"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/authredirect",
    name: "认证回调页",
    component: () => import(/* webpackChunkName: "page" */ "@/page/login/authredirect"),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/lock",
    name: "锁屏页",
    component: () => import(/* webpackChunkName: "page" */ "@/page/lock/index"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/404",
    component: () => import(/* webpackChunkName: "page" */ "@/components/error-page/404"),
    name: "404",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/403",
    component: () => import(/* webpackChunkName: "page" */ "@/components/error-page/403"),
    name: "403",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/500",
    component: () => import(/* webpackChunkName: "page" */ "@/components/error-page/500"),
    name: "500",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: "/",
    name: "主页",
    redirect: "/wel"
  },
  {
    path: "/myiframe",
    component: Layout,
    redirect: "/myiframe",
    children: [
      {
        path: ":routerPath",
        name: "iframe",
        component: () => import(/* webpackChunkName: "page" */ "@/components/iframe/main"),
        props: true
      }
    ]
  },
  {
    path: "/previewExcel",
    component: () => import(/* webpackChunkName: "page" */ "@/views/cockpit/previewExcel.vue"),
    name: "previewExcel",
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  }
  // {
  //     path: '*',
  //     component: () =>
  //         import ( /* webpackChunkName: "page" */ '@/components/error-page/404'),
  //     name: '404',
  //     meta: {
  //         keepAlive: true,
  //         isTab: false,
  //         isAuth: false
  //     }

  // }
]
