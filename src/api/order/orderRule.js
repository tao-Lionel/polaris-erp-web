import request from "@/router/axios"

/**获取所有平台类型 */
export function getPlaTypeAll(query) {
  return request({
    url: "/baseSetup/bseplatformtype/getAll",
    method: "get",
    params: query
  })
}

/**获取模式 */
export function getObjByType(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

// 获取选中平台的所有站点
export function getSitByPlatformTypeCodes(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// 获取所有店铺站点
export function getStoreByPlatformTypeCodes(obj) {
  return request({
    url: "/baseSetup/bsestore/getStoreByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// 获取所有物流渠道
export function getBseChannel(obj) {
  return request({
    url: "/baseSetup/bseChannel/listAll",
    method: "post",
    data: obj
  })
}

// 获取订单规则列表
export function getQueryOrderRule(obj) {
  return request({
    url: "/oms/orderRule/queryOrderRule",
    method: "post",
    data: obj
  })
}

// 删除订单规则
export function updateDelStatusById(obj) {
  return request({
    url: "/oms/orderRule/updateDelStatusByIds",
    method: "post",
    data: obj
  })
}

// 启用/禁用订单规则
export function updateRuleStatusById(obj) {
  return request({
    url: "/oms/orderRule/updateRuleStatusByIds",
    method: "post",
    data: obj
  })
}

//修改优先级
export function updatePriority(obj) {
  return request({
    url: "/oms/orderRule/updatePriority",
    method: "post",
    data: obj
  })
}

// 获取订单规则详情
export function getRuleVO(obj) {
  return request({
    url: "/oms/orderRule/getRuleVO",
    method: "post",
    data: obj
  })
}

// 获取仓库
export function getAllWarehouse(params) {
  return request({
    url: "/baseSetup/bsewarehouse/getAll",
    method: "get",
    params: params
  })
}

/**添加拆分规则 */
export function splitOrderRule(obj) {
  return request({
    url: "/oms/orderRule/splitOrder/save",
    method: "post",
    data: obj
  })
}

/**添加匹配仓库规则 */
export function setWarehouseRule(obj) {
  return request({
    url: "/oms/orderRule/setWarehouse/save",
    method: "post",
    data: obj
  })
}

// 添加匹配物流渠道
export function logisticsChannelMatchingRule(obj) {
  return request({
    url: "/oms/orderRule/logisticsChannelMatching/save",
    method: "post",
    data: obj
  })
}

// 添加自动确认
export function comfirmOrderRule(obj) {
  return request({
    url: "/oms/orderRule/comfirmOrder/save",
    method: "post",
    data: obj
  })
}

// 添加自动标记为待确认
export function markPendingConfirmationRule(obj) {
  return request({
    url: "/oms/orderRule/markPendingConfirmation/save",
    method: "post",
    data: obj
  })
}

// 添加自动生成发货单
export function craeteFoRule(obj) {
  return request({
    url: "/oms/orderRule/craeteFo/save",
    method: "post",
    data: obj
  })
}

// 添加自动下第三方仓
export function distributeToThirdPartyWarehousesRule(obj) {
  return request({
    url: "/oms/orderRule/distributeToThirdPartyWarehouses/save",
    method: "post",
    data: obj
  })
}

export function setAutomaticSkuMatchRule(obj) {
  return request({
    url: "/oms/orderRule/setAutomaticSkuMatch/save",
    method: "post",
    data: obj
  })
}

export function setPlatformDeliveryRule(obj) {
  return request({
    url: "/oms/orderRule/platformDelivery/save",
    method: "post",
    data: obj
  })
}

// 获取所有仓库服务商
export function getAllCarriersV2(params) {
  return request({
    url: "/baseSetup/bsewarehouseprovider/getAll",
    method: "get",
    params: params
  })
}

// 根据服务商获取仓库
export function getWarehouseByTransportCarrierCode(params) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getWarehouseByTransportCarrierCode",
    method: "get",
    params: params
  })
}
