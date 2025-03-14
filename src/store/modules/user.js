import { removeToken, setToken, getToken } from "@/util/auth"
import { getStore, setStore } from "@/util/store"
import { isURL } from "@/util/validate"
import { getUserInfo, loginByMobile, loginBySocial, loginByUsername, logout, refreshToken } from "@/api/login"
import { deepClone, encryption } from "@/util/util"
import webiste from "@/const/website"
import { GetMenu } from "@/api/admin/menu"

function addPath(ele, first) {
  const propsConfig = webiste.menu.props
  const propsDefault = {
    label: propsConfig.label || "label",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children"
  }
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild && first) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index"
    return
  }
  ele[propsDefault.children].forEach((child) => {
    if (!isURL(child[propsDefault.path])) {
      child[propsDefault.path] = `${ele[propsDefault.path]}/${
        child[propsDefault.path] ? child[propsDefault.path] : "index"
      }`
    }
    addPath(child)
  })
}

const user = {
  state: {
    userInfo: {},
    permissions: {},
    roles: [],
    menu:
      getStore({
        name: "menu"
      }) || [],
    menuAll: [],
    access_token:
      getStore({
        name: "access_token"
      }) ||
      getToken() ||
      "",
    refresh_token:
      getStore({
        name: "refresh_token"
      }) || "",
    expires_in:
      getStore({
        name: "expires_in"
      }) || ""
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        key: "tsourceofbenefit",
        param: ["password"]
      })
      return new Promise((resolve, reject) => {
        loginByUsername(user.username, user.password, user.code, user.randomStr)
          .then((response) => {
            const data = response.data
            console.log("123", data)
            setToken(data.access_token)
            commit("SET_ACCESS_TOKEN", data.access_token)
            commit("SET_REFRESH_TOKEN", data.refresh_token)
            commit("SET_EXPIRES_IN", data.expires_in)
            commit("CLEAR_LOCK")
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据手机号登录
    LoginByPhone({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByMobile(userInfo.mobile, userInfo.code)
          .then((response) => {
            const data = response.data
            setToken(data.access_token)
            commit("SET_ACCESS_TOKEN", data.access_token)
            commit("SET_REFRESH_TOKEN", data.refresh_token)
            commit("SET_EXPIRES_IN", data.expires_in)
            commit("CLEAR_LOCK")
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据OpenId登录
    LoginBySocial({ commit }, param) {
      return new Promise((resolve, reject) => {
        loginBySocial(param.state, param.code)
          .then((response) => {
            if (!response) {
              reject("登录失败，未能找到对应的用户，请先账号密码登录绑定企业微信！")
              return
            }
            const data = response.data
            setToken(data.access_token)
            commit("SET_ACCESS_TOKEN", data.access_token)
            commit("SET_REFRESH_TOKEN", data.refresh_token)
            commit("SET_EXPIRES_IN", data.expires_in)
            commit("CLEAR_LOCK")
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data || {}
            commit("SET_USERIFNO", data.sysUser)
            commit("SET_ROLES", data.roles || [])
            commit("SET_PERMISSIONS", data.permissions || [])
            resolve(data)
          })
          .catch((err) => {
            reject()
          })
      })
    },
    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token)
          .then((response) => {
            const data = response.data
            setToken(data.access_token)
            commit("SET_ACCESS_TOKEN", data.access_token)
            commit("SET_REFRESH_TOKEN", data.refresh_token)
            commit("SET_EXPIRES_IN", data.expires_in)
            commit("CLEAR_LOCK")
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit("SET_MENU", [])
            commit("SET_PERMISSIONS", [])
            commit("SET_USER_INFO", {})
            commit("SET_ACCESS_TOKEN", "")
            commit("SET_REFRESH_TOKEN", "")
            commit("SET_EXPIRES_IN", "")
            commit("SET_ROLES", [])
            commit("DEL_ALL_TAG")
            commit("CLEAR_LOCK")
            removeToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 注销session
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_MENU", [])
        commit("SET_PERMISSIONS", [])
        commit("SET_USER_INFO", {})
        commit("SET_ACCESS_TOKEN", "")
        commit("SET_REFRESH_TOKEN", "")
        commit("SET_EXPIRES_IN", "")
        commit("SET_ROLES", [])
        commit("DEL_ALL_TAG")
        commit("CLEAR_LOCK")
        removeToken()
        resolve()
      })
    },
    // 获取系统菜单
    GetMenu({ commit }) {
      return new Promise((resolve) => {
        GetMenu().then((res) => {
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach((ele) => {
            addPath(ele)
          })
          commit("SET_MENU", menu)
          resolve(menu)
        })
      })
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: "access_token",
        content: state.access_token,
        type: "session"
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: "refresh_token",
        content: state.refresh_token,
        type: "session"
      })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
      setStore({
        name: "expires_in",
        content: state.expires_in,
        type: "session"
      })
    },
    SET_USERIFNO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: "user_info",
        content: state.userInfo,
        type: "session"
      })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: "menu",
        content: state.menu,
        type: "session"
      })
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
    }
  }
}
export default user
