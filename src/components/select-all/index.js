import SelectAll from "./package/index.vue"

SelectAll.install = function (Vue) {
  Vue.component(SelectAll.name, SelectAll)
}

export default SelectAll
