import request from "@/router/axios"

/**
 * 分页查询普通待排柜
 */
export function getNotDiList(obj) {
  return request({
    url: "/purchase/deliveryPlan/pageNormalUnPlan",
    method: "post",
    data: obj
  })
}
export function getShipmentPlanDetail(id) {
  return request({
    url: `/purchase/deliveryPlan/${id}`,
    method: "get"
  })
}
/**
 * 分页查询DI待排柜
 */
export function getDiList(obj) {
  return request({
    url: "/purchase/deliveryPlan/pageDiUnPlan",
    method: "post",
    data: obj
  })
}

/**
 * 分页查询已排柜
 */
export function getAlreadyList(obj) {
  return request({
    url: "/purchase/deliveryPlan/pageAlreadyPlan",
    method: "post",
    data: obj
  })
}
/**
 * 标记是否加急
 */
export function markUrgentFlag(obj) {
  return request({
    url: "/purchase/deliveryPlan/markUrgentFlag",
    method: "post",
    data: obj
  })
}

/**
 * 获取普通排柜计划分组信息
 */
export function getNormalPlanGroupList(obj) {
  return request({
    url: "/purchase/deliveryPlan/getNormalPlanGroupList",
    method: "post",
    data: obj
  })
}

/**
 * 获取DI排柜计划分组信息
 */
export function getDiPlanGroupList(obj) {
  return request({
    url: "/purchase/deliveryPlan/getDiPlanGroupList",
    method: "post",
    data: obj
  })
}

/**
 * 查看装箱方案分配明细
 */
export function listAllocationPlanResult(obj) {
  return request({
    url: "/purchase/deliveryPlan/listAllocationPlanResult",
    method: "post",
    data: obj
  })
}

/**
 * 保存装箱方案
 */
export function saveResult(obj) {
  return request({
    url: "/purchase/deliveryPlan/saveResult" + `?type=${obj.type}`,
    method: "post",
    data: obj.data
  })
}

/**
 * 导出分组信息
 */
export function exportGroupList(obj) {
  return request({
    url: "/purchase/deliveryPlan/exportGroupList",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}
/**
 * 导入排柜计划方案
 */
export function importResult(obj, query) {
  return request({
    url: "/purchase/deliveryPlan/importResult" + query,
    method: "post",
    data: obj
  })
}

// 下载导模版
export function downloadTemplate(obj) {
  return request({
    url: "/purchase/basis/downloadTemplate",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

/**
 * 分配仓库区域
 */
export function allocationWarehouseArea(obj) {
  return request({
    url: "/purchase/deliveryPlan/allocationWarehouseArea",
    method: "post",
    data: obj
  })
}

/**
 * 获取生成送货单数据
 */
export function generateDelivery(data) {
  return request({
    url: "/purchase/deliveryPlan/getGenerateDelivery",
    method: "post",
    data
  })
}

/**
 * 生成调拨单
 */
export function generateTransfer(shipmentPlanCode) {
  return request({
    url: "/purchase/deliveryPlan/generateTransfer" + `?shipmentPlanCode=${shipmentPlanCode}`,
    method: "post"
  })
}

/**
 * 关联采购计划单
 */
export function relatedPurchasePlan(data) {
  return request({
    url: "/purchase/deliveryPlan/relatedPurchasePlan",
    method: "post",
    data
  })
}

/**
 * 获取生成调拨单数据
 */
export function getGenerateTransfer(shipmentPlanCode) {
  return request({
    url: "/purchase/deliveryPlan/getGenerateTransfer" + `?deliveryPlanCode=${shipmentPlanCode}`,
    method: "post"
  })
}

export function createDeliveryV2(obj) {
  return request({
    url: "/purchase/poorderdetail/createDeliveryV2",
    method: "post",
    data: obj
  })
}

/*
 * 废弃
 */
export function abandon(deliveryPlanCode) {
  return request({
    url: "/purchase/deliveryPlan/abandon" + `?deliveryPlanCode=${deliveryPlanCode}`,
    method: "post"
  })
}
/**
 * 关联出货通知单
 */
export function relatedShippingNotice(obj) {
  return request({
    url: "/purchase/podelivery/relatedShippingNotice",
    method: "post",
    data: obj
  })
}

/**
 * 关联出货通知单
 */
export function calculateVehicle(obj) {
  return request({
    url: "/purchase/deliveryPlan/calculateVehicle",
    method: "post",
    data: obj
  })
}

/**
 * 日志 logType:20
 */
export function containerLoadingLogPage(query) {
  return request({
    url: "/purchase/pooperatelog/page?" + query,
    method: "get"
  })
}

// 审核
export function submitAudit(obj) {
  return request({
    url: "/purchase/deliveryPlan/submit",
    method: "post",
    data: obj
  })
}
// 反审核
export function reverseApproval(obj) {
  return request({
    url: "/purchase//deliveryPlan/reverseApproval",
    method: "post",
    data: obj
  })
}
