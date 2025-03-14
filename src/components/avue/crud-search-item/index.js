import CrudSearchItem from "../crud/src/crud-search-item.vue"

CrudSearchItem.install = function (Vue) {
  Vue.component(CrudSearchItem.name, CrudSearchItem)
}

export default CrudSearchItem
