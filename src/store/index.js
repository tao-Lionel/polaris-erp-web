import Vue from "vue"
import Vuex from "vuex"
import user from "./modules/user"
import common from "./modules/common"
import tags from "./modules/tags"
import logs from "./modules/logs"
import getters from "./getters"
// import mobile from "./modules/mobile"

console.log(user)
console.log(getters)
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags
    // mobile
  },
  getters
})

export default store
