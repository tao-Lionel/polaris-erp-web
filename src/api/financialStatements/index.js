import request from "@/router/axios"

export function costTypeList(obj) {
  return request({
    url: "/warehouse/logisticscosttype/listPage",
    method: "post",
    data: obj
  })
}

export function addCostType(obj) {
  return request({
    url: "/warehouse/logisticscosttype/addCostType",
    method: "post",
    data: obj
  })
}

export function updateCostType(obj) {
  return request({
    url: "/warehouse/logisticscosttype/updateCostType",
    method: "post",
    data: obj
  })
}

export function getObjByType(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

export function getcostAll(obj) {
  return request({
    url: "/warehouse/logisticscosttype/listAll",
    method: "post",
    data: obj
  })
}

export function finPayableList(obj) {
  return request({
    url: "/finance/finPayable/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finPayable/getDetail",
    method: "post",
    data: obj
  })
}

export function finReceiveBillList(obj) {
  return request({
    url: "/finance/finReceiveBill/listPage",
    method: "post",
    data: obj
  })
}

export function finReceiveBillDetail(obj) {
  return request({
    url: "/finance/finReceiveBill/getDetail",
    method: "post",
    data: obj
  })
}

export function bsestoreAll(params) {
  return request({
    url: "/baseSetup/bsestore/getAll",
    method: "get",
    params: params
  })
}

export function bsewarehouseAll(params) {
  return request({
    url: "/baseSetup/bsewarehouse/getAll",
    method: "get",
    params: params
  })
}

export function finStockCostAdjustment(obj) {
  return request({
    url: "/finance/finStockCostAdjustment/listPage",
    method: "post",
    data: obj
  })
}

export function finStockCostAdjustmentDetail(obj) {
  return request({
    url: "/finance/finStockCostAdjustment/getDetail",
    method: "post",
    data: obj
  })
}

export function finEnterSaleStore(obj) {
  return request({
    url: "/finance/finEnterSaleStore/listPage",
    method: "post",
    data: obj
  })
}

export function finEnterSaleStoreDetail(obj) {
  return request({
    url: "/finance/finEnterSaleStore/listPageMountDetail",
    method: "post",
    data: obj
  })
}

export function checkProcess(obj) {
  return request({
    url: "/finance/finEnterSaleStore/checkProcess?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function process(obj) {
  return request({
    url: "/finance/finEnterSaleStore/process?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function pushJieDie(obj) {
  return request({
    url: "/finance/finEnterSaleStore/push?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function checkReverseProcess(obj) {
  return request({
    url: "/finance/finEnterSaleStore/checkReverseProcess?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function reverseProcess(obj) {
  return request({
    url: "/finance/finEnterSaleStore/reverseProcess?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function checkGenerate(obj) {
  return request({
    url: "/finance/finEnterSaleStore/checkGenerate?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function generate(obj) {
  return request({
    url: "/finance/finEnterSaleStore/regenerate?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function deleteData(obj) {
  return request({
    url: "/finance/finEnterSaleStore/delete?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}

export function getBizLogPage(query) {
  return request({
    url: "/admin/log/getBizLogPage",
    method: "get",
    params: query
  })
}

export function getAllWarehouseAboutInTransit(params) {
  return request({
    url: "/baseSetup/bsewarehouse/getAllWarehouseAboutInTransit",
    method: "post"
  })
}

export function getAllSupplier(obj) {
  return request({
    url: "/finance/baseData/getAllSupplier",
    method: "post",
    data: obj
  })
}

export function getAllCust(obj) {
  return request({
    url: "/finance/baseData/getAllCust",
    method: "post",
    data: obj
  })
}

export function checkData() {
  return request({
    url: "/finance/finInternalTransactionSkuCost/checkData",
    method: "post"
  })
}

export function regenerateAndPushApi(obj) {
  return request({
    url: "/finance/finEnterSaleStore/regeneratePayable?dateMonth=" + obj.dateMonth,
    method: "post"
  })
}
