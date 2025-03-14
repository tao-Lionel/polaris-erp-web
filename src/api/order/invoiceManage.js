import request from "@/router/axios"

//获取列表
export function getInvoiceListPage(obj) {
  return request({
    url: "/oms/foOrder/listPage",
    method: "post",
    data: obj
  })
}

//获取列表V2
export function getInvoiceListPageV2(obj) {
  return request({
    url: "/oms/foOrder/listPageV2",
    method: "post",
    data: obj
  })
}

//下发至第三方仓库/foOrder/syncOrder
export function syncOrder(obj) {
  return request({
    url: "/oms/foOrder/syncOrder",
    method: "post",
    data: obj
  })
}

//获取面单/omsOrderLogisticsInfo/getFaceSheet
export function getFaceSheet(obj) {
  return request({
    url: "/oms/omsOrderLogisticsInfo/getFaceSheet",
    method: "post",
    data: obj
  })
}

// 查看面单详情
export function listDbShippingLabel(obj) {
  return request({
    url: "/oms/omsSoOrder/listDbShippingLabel",
    method: "post",
    data: obj
  })
}

//同步发货单/foOrder/syncOrderStatus
export function syncOrderStatus(obj) {
  return request({
    url: "/oms/foOrder/syncOrderStatus",
    method: "post",
    data: obj
  })
}

//标记已发货/foOrder/markShipment
export function markShipment(obj) {
  return request({
    url: "/oms/foOrder/markShipment",
    method: "post",
    data: obj
  })
}

//获取标记已发货列表/foOrder/queryDeliveryList
export function getMarkShipment(obj) {
  return request({
    url: "/oms/foOrder/queryDeliveryList",
    method: "post",
    data: obj
  })
}
//标记已签收/foOrder/markReceived
export function markReceived(obj) {
  return request({
    url: "/oms/foOrder/markReceived",
    method: "post",
    data: obj
  })
}

//释放库存/foOrder/releaseStock
export function releaseStock(obj) {
  return request({
    url: "/oms/foOrder/releaseStock",
    method: "post",
    data: obj
  })
}

//占用库存/foOrder/occupyStock
export function occupyStock(obj) {
  return request({
    url: "/oms/foOrder/occupyStock",
    method: "post",
    data: obj
  })
}

//批量删除发货单/foOrder
export function delOrder(obj) {
  return request({
    url: "/oms/foOrder/batchDelete",
    method: "post",
    data: obj
  })
}

//设置仓库物流/foOrder/setLogistics
export function setLogistics(obj) {
  return request({
    url: "/oms/foOrder/setLogistics",
    method: "post",
    data: obj
  })
}

//获取订单统计数量/foOrder/getStatusCount
export function getStatusCount(obj) {
  return request({
    url: "/oms/foOrder/getStatusCount",
    method: "post",
    data: obj
  })
}

//获取所有内部物流渠道/bseChannel/getBseChannelByChannelCodes
export function getAllChannel(obj) {
  return request({
    url: "/baseSetup/bseChannel/listAll",
    method: "post",
    data: obj
  })
}

//根据ID获取发货单详情/foOrder/getDetailInfo
export function getDetailById(obj) {
  return request({
    url: "/oms/foOrder/getDetailInfo",
    method: "post",
    data: obj
  })
}

export function getAllBizLog(query) {
  return request({
    url: "/admin/log/getBizLog",
    method: "get",
    params: query
  })
}
//取消发货单/foOrder/batchCancel
export function batchCancel(obj) {
  return request({
    url: "/oms/foOrder/batchCancel",
    method: "post",
    data: obj
  })
}

//导出发货单/foOrder/export
export function invoiceExport(obj) {
  return request({
    url: "/oms/foOrder/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
//上传文件
export function uploadImgAndPdf(obj) {
  return request({
    url: "/filecenter/upload/multipartFileEX",
    method: "post",
    data: obj
  })
}

//预览文件
export function previewImgAndPdf(query) {
  return request({
    url: "/filecenter/downloadEX/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

//保存文件
export function uploadStatement(obj) {
  return request({
    url: "/oms/foOrder/setLogisticsLabel",
    method: "post",
    data: obj
  })
}

//取消异常标识/foOrder/clearAbnormal
export function cancelAbnormal(obj) {
  return request({
    url: "/oms/foOrder/clearAbnormal",
    method: "post",
    data: obj
  })
}

// 撤销发货
export function batchRevokeApi(obj) {
  return request({
    url: "/oms/foOrder/batchRevoke",
    method: "post",
    data: obj
  })
}

// 下载导入修改单价模版
export function downloadTemplate(obj) {
  return request({
    url: "/oms/basis/downloadTemplate",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}
// 导入
export function modifyOrderPrice(obj) {
  return request({
    url: "/oms/foOrder/modifyOrderPrice",
    method: "post",
    data: obj
  })
}

export function checkModifyOrderPrice(obj) {
  return request({
    url: "/oms/foOrder/checkModifyOrderPrice",
    method: "post",
    data: obj
  })
}

export function checkModifyOrderPriceV2(obj) {
  return request({
    url: "/oms/foOrder/checkModifyOrderPriceV2",
    method: "post",
    data: obj
  })
}

// 查询物流轨迹
export function logisticsTracking(foOrderCode) {
  return request({
    url: "/oms/foOrder/logisticsTracking" + `?foOrderCode=${foOrderCode}`,
    method: "get"
  })
}
