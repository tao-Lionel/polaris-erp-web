import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/purchase/poorder/page",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/poorder",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/poorder/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/poorder/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/poorder",
    method: "put",
    data: obj
  })
}

export function agree(obj) {
  return request({
    url: "/purchase/poorder/agree",
    method: "put",
    params: obj
  })
}

export function reject(obj) {
  return request({
    url: "/purchase/poorder/reject",
    method: "put",
    params: obj
  })
}

export function removeBatch(obj) {
  return request({
    url: "/purchase/poorder/removeBatch",
    method: "delete",
    params: obj
  })
}

export function createContract(obj) {
  return request({
    url: "/purchase/poorder/createContract",
    method: "post",
    params: obj
  })
}

export function reverse(obj) {
  return request({
    url: "/purchase/poorder/reverse",
    method: "put",
    params: obj
  })
}

export function showSkuInfo(param) {
  return request({
    url: "/purchase/poorder/showSkuInfo",
    method: "get",
    params: param
  })
}

export function checkAdvancePayAble(params) {
  return request({
    url: "/purchase/poorder/checkAdvancePayAble",
    method: "get",
    params: params
  })
}

export function showInboundInfo(param) {
  return request({
    url: "/purchase/poorder/showInboundInfo",
    method: "get",
    params: param
  })
}

export function getPlayTypeAll(query) {
  return request({
    url: "/baseSetup/bseplatformtype/getAll",
    method: "get",
    params: query
  })
}

export function getSit(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// export function createDelivery(obj){
//   return request({
//     url: '/purchase/poorder/createDelivery',
//     method: 'post',
//     data: obj
//   })
// }

export function getNewPrice(obj) {
  return request({
    url: "/purchase/poorder/getNewPrice",
    method: "post",
    data: obj
  })
}

export function getPoOrderDetailPage(obj) {
  return request({
    url: "/purchase/poorderdetail/getPoOrderDetailPage",
    method: "post",
    data: obj
  })
}

export function createDelivery(obj) {
  return request({
    url: "/purchase/poorderdetail/createDelivery",
    method: "post",
    data: obj
  })
}

export function saveOrSubmitNoDetail(obj) {
  return request({
    url: "/purchase/poorderdetail/saveOrSubmitNoDetail",
    method: "post",
    data: obj
  })
}

export function createContractBatch(obj) {
  return request({
    url: "/purchase/poorder/createContractBatch",
    method: "post",
    data: obj
  })
}

export function exportPoOrderData(obj) {
  return request({
    url: "/purchase/poorder/exportPoOrder",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function importData(obj) {
  return request({
    url: "/purchase/podelivery/importData",
    method: "post",
    data: obj
  })
}

// 编辑备注
export function updatePoorderRemarkApi(data) {
  return request({
    url: "/purchase/poorder/updateRemarks",
    method: "post",
    data
  })
}

// 采购单详情
export function getPoOrderDetailApi(params) {
  return request({
    url: "/purchase/poorder/v2/detail",
    method: "get",
    params
  })
}

// 采购单完结单据
export function completePoOrderApi(data) {
  return request({
    url: "/purchase/poorder/v2/complete",
    method: "post",
    data
  })
}

// 采购订单列表
export function getPoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/page",
    method: "post",
    data
  })
}

// 采购订单作废
export function cancelPoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/cancel",
    method: "post",
    data
  })
}

// 采购订单提交审批
export function submitPoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/submit",
    method: "post",
    data
  })
}

// 采购订单推送数夫
export function pushShufuPoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/pushShufu",
    method: "post",
    data
  })
}

// 采购订单反审核
export function reversePoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/reverse",
    method: "post",
    data
  })
}

// 更新采购单
export function updatePoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/update",
    method: "post",
    data
  })
}

// 拆分采购订单
export function splitPoOrderPageApi(data) {
  return request({
    url: "/purchase/poorder/v2/split",
    method: "post",
    data
  })
}

// 拆分采购订单
export function pushPoOrderToJEApi(data) {
  return request({
    url: "/purchase/poorder/v2/pushPoOrderToJE",
    method: "post",
    data
  })
}
