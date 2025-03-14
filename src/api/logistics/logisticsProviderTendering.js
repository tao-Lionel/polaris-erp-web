import request from "@/router/axios"

// 招标列表
export function getPageApi(data) {
  return request({
    url: "/warehouse/invitetender/page",
    method: "post",
    data
  })
}

// 通过id查询
export function getDetailApi(id) {
  return request({
    url: `/warehouse/invitetender/${id}`,
    method: "get"
  })
}

// 新增/修改
export function addAndEditApi(data) {
  return request({
    url: "/warehouse/invitetender",
    method: "post",
    data
  })
}

// 发布招标
export function publishTenderApi(data) {
  return request({
    url: "/warehouse/invitetender/publish",
    method: "post",
    data
  })
}

// 确定中标
export function confirmTenderApi(data) {
  return request({
    url: "/warehouse/invitetender/confirm",
    method: "post",
    data
  })
}

// 开标
export function openTenderApi(data) {
  return request({
    url: "/warehouse/invitetender/openTender",
    method: "post",
    data
  })
}

// 导出
export function exportInviteTenderApi(data) {
  return request({
    url: "/warehouse/invitetender/export",
    method: "post",
    responseType: "blob",
    data
  })
}

// 获取投标物流商列表
export function getTenderLogisticsApi() {
  return request({
    url: `/warehouse/invitetender/getLogistics`,
    method: "get"
  })
}

// 查询是否可以投标
export function checkCanBidApi(id) {
  return request({
    url: `/warehouse/invitetender/checkCanBid/${id}`,
    method: "get"
  })
}

// 查询是否可以确定中标
export function checkCanConfirmApi(id) {
  return request({
    url: `/warehouse/invitetender/checkCanConfirm/${id}`,
    method: "get"
  })
}

// 更新状态
export function updateTenderStatusApi() {
  return request({
    url: `/warehouse/invitetender/updateTenderStatus`,
    method: "get"
  })
}

// 招标需求发布规则 列表
export function getRulesListApi(data) {
  return request({
    url: `/warehouse/invitetender/logisticsProviderRouteConf/page`,
    method: "post",
    data
  })
}

// 招标需求发布规则 保存
export function saveRulesApi(data) {
  return request({
    url: `/warehouse/invitetender/logisticsProviderRouteConf/save`,
    method: "post",
    data
  })
}

// 批量启用/禁用
export function batchRulesOperateApi(data) {
  return request({
    url: `/warehouse/invitetender/logisticsProviderRouteConf/operate`,
    method: "post",
    data
  })
}

// 招标作废
export function cancelTenderApi(data) {
  return request({
    url: `/warehouse/invitetender/cancel`,
    method: "post",
    data
  })
}
