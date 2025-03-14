import request from "@/router/axios"

// 采购计划列表
export function getPurchasePlanPageApi(data) {
  return request({
    url: "/purchase/purchasePlan/page",
    method: "post",
    data
  })
}

// 采购计划详情
export function getPurchasePlanDetailApi(purchasePlanCode) {
  return request({
    url: "/purchase/purchasePlan/detail?purchasePlanCode=" + purchasePlanCode,
    method: "get"
  })
}

// 新增采购计划
export function addPurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/saveOrUpdate",
    method: "post",
    data
  })
}

// 完结采购计划单
export function closePurchasePlanByIdApi(data) {
  return request({
    url: "/purchase/purchasePlan/close",
    method: "post",
    data
  })
}

// 创建采购订单
export function createPurchaseOrderApi(data) {
  return request({
    url: "/purchase/purchasePlan/createPurchaseOrder",
    method: "post",
    data
  })
}

// 通过链接SKU获取信息
export function getLinkSkuInfoApi(data) {
  return request({
    url: "/product/prdLinkSku/getLinkSkuAndFactorySkuInfoFront",
    method: "post",
    data
  })
}

// 提交审批
export function submitPurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/submit",
    method: "post",
    data
  })
}

// 下发数夫
export function pushShufuPurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/pushShufu",
    method: "post",
    data
  })
}

// 反审核
export function reversePurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/reverse",
    method: "post",
    data
  })
}

// 作废采购计划单
export function cancelPurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/cancel",
    method: "post",
    data
  })
}

// 采购计划单导入
export function importPurchasePlanApi(data) {
  return request({
    url: "/purchase/purchasePlan/importData",
    method: "post",
    data
  })
}

// 下载错误文件
export function exportErrorDataApi(data) {
  return request({
    url: "/purchase/basis/exportErrorData",
    method: "post",
    responseType: "blob",
    data
  })
}

// 下载模板
export function productDownloadTemplateApi(data) {
  return request({
    url: "/purchase/basis/downloadTemplate",
    method: "post",
    responseType: "blob",
    data
  })
}

// 通过送货计划号查询送货详情
export function getDeliveryPlanDetailApi(deliveryPlanCode) {
  return request({
    url: `/purchase/deliveryPlan/${deliveryPlanCode}`,
    method: "get"
  })
}
