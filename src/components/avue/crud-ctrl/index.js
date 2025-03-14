import CrudCtrl from "../crud/src/crud-ctrl.vue"

CrudCtrl.install = function (Vue) {
  Vue.component(CrudCtrl.name, CrudCtrl)
}

export default CrudCtrl
