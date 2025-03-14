import request from "@/router/axios"

// 列表查询
export function getListPageApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/queryList",
    method: "post",
    data
  })
}

export function getListPageV2Api(data) {
  return request({
    url: "/oms/omsFoBatchOrder/queryListV2",
    method: "post",
    data
  })
}

//详情查询
export function getDetailsApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/details?batchOrderCode=" + data.batchOrderCode,
    method: "post"
  })
}

//下发至第三方仓
export function syncOrderBatchApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/syncOrder",
    method: "post",
    data
  })
}

//反审核
export function batchDeleteApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/batchDelete",
    method: "post",
    data
  })
}

//标记已发货
export function markShipmentApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/markShipment",
    method: "post",
    data
  })
}

//获取发货单标记发货列表
export function getMarkShippedListApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/queryDeliveryList",
    method: "post",
    data
  })
}

//取消异常标识
export function cancelAbnormalApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/clearAbnormal",
    method: "post",
    data
  })
}

//批量修改标签
export function editLabelApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/batchSave",
    method: "post",
    data
  })
}

// 获取订单统计数量
export function getStatusCountApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/getStatusCount",
    method: "post",
    data
  })
}

//导出发货批次单
export function exportBatchOrderApi(obj) {
  return request({
    url: "/oms/omsFoBatchOrder/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 查看附件
export function getAttachmentListApi(batchOrderCode) {
  return request({
    url: "/oms/omsFoBatchOrder/getAttachmentList/" + batchOrderCode,
    method: "get"
  })
}

// 修改ARN/排柜号
export function updateArnApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/updateArn",
    method: "post",
    data
  })
}

// 获取平台附件
export function getPlatformFaceSheetsApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/getPlatformFaceSheets",
    method: "post",
    data
  })
}

// 重新生成
export function reGenerationApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/handleBatchOrderException",
    method: "post",
    data
  })
}

// 重试弹窗展示 获取时间列表
export function reGenerationOperateInfoApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/handleBatchOrderExceptionOperateInfo",
    method: "post",
    data
  })
}

// 平台取消shipment
export function cancelShipmentApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/foBatchOrderPlatformCancel",
    method: "post",
    data
  })
}

// 发货批次单上传附件
export function uploadAttachmentApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/uploadAttachment",
    method: "post",
    data
  })
}

// 获取发货批次单附件
export function getSBOLAttachmentListApi(batchOrderCode) {
  return request({
    url: "/oms/omsFoBatchOrder/getSBOLAttachmentList/" + batchOrderCode,
    method: "get"
  })
}

// 核对SBOL
export function confirmSBOLApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/confirmSBOL",
    method: "post",
    data
  })
}

// 修改备注
export function uploadOmsFoBatchMark(data) {
  return request({
    url: "/oms/omsFoBatchOrder/uploadOmsFoBatchMark",
    method: "post",
    data
  })
}

// 修改发货单跟踪号
export function uploadOmsFoBatchTruckingNumber(data) {
  return request({
    url: "/oms/omsFoBatchOrder/uploadOmsFoBatchTruckingNumber",
    method: "post",
    data
  })
}

// 下载导模版
export function downloadTemplate(obj) {
  return request({
    url: "/oms/omsFoBatchOrder/downloadTemplate",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

//导入数据预览
export function uploadFileBatchApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/importDataPreview",
    method: "post",
    data
  })
}

// 重试弹窗展示 获取时间列表
export function reGenerationOperateInfoV2Api(data) {
  return request({
    url: "/oms/omsFoBatchOrder/handleBatchOrderExceptionOperateInfoV2",
    method: "post",
    data
  })
}

// 根据筛选条件查询指定批次单的附件列表
export function getSomeFoOrderBatchAttachmentListApi(data) {
  return request({
    url: "/oms/omsFoBatchOrder/getSomeFoOrderBatchAttachmentList",
    method: "post",
    data
  })
}
