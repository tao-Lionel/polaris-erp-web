import request from "@/router/axios"

//获取类型
export function getObjbyType(query) {
  return request({
    url: "/warehouse/transfer/getDetailInfo",
    method: "get",
    params: query
  })
}

///transfer/listPage 获取调拨单列表

export function fetchList(obj) {
  return request({
    url: "/warehouse/transfer/listPage",
    method: "post",
    data: obj
  })
}

///transfer/getStockQueryGroupIn 获取入库单列表
export function getStockQueryGroupIn(obj) {
  return request({
    url: "/warehouse/transfer/getStockQueryGroupIn",
    method: "post",
    data: obj
  })
}
///transfer/cancel 作废调拨单
export function transferCancel(obj) {
  return request({
    url: "/warehouse/transfer/cancel",
    method: "post",
    data: obj
  })
}
///transfer/confirmShipment 确认发货
export function confirmShipment(obj) {
  return request({
    url: "/warehouse/transfer/confirmShipment",
    method: "post",
    data: obj
  })
}

///transfer/create 保存调拨单
export function transferSave(obj) {
  return request({
    url: "/warehouse/transfer/create",
    method: "post",
    data: obj
  })
}

///transfer/update
export function transferUpdate(obj) {
  return request({
    url: "/warehouse/transfer/update",
    method: "post",
    data: obj
  })
}

///transfer/confirmCost 锁定费用
export function confirmCost(obj) {
  return request({
    url: "/warehouse/transfer/confirmCost",
    method: "post",
    data: obj
  })
}

///transfer/updateThirdPartyInNo 关联第三方单据

export function relatedInNo(obj) {
  return request({
    url: "/warehouse/transfer/updateThirdPartyInNo",
    method: "post",
    data: obj
  })
}

///transfer/saveCost 录入费用

export function saveCost(obj) {
  return request({
    url: "/warehouse/transfer/saveCost",
    method: "post",
    data: obj
  })
}

///transfer/getDetailInfo id查询调拨单详情

export function getDetailInfo(query) {
  return request({
    url: "/warehouse/transfer/getDetailInfo",
    method: "get",
    params: query
  })
}

///bsetransportcarrier/getCarriersByWarehouseIdNoInner 获取公司类型
export function getCarriersByWarehouse(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getCarriersByWarehouseIdNoInner",
    method: "post",
    data: obj
  })
}
///transfer/getConfirmInfo 获取确认入库数据
export function getConfirmInfoById(query) {
  return request({
    url: "/warehouse/transfer/getConfirmInfo",
    method: "get",
    params: query
  })
}

///confirmPutInStorage 确认入库
export function confirmPutInStorage(obj) {
  return request({
    url: "/warehouse/transfer/confirmPutInStorage",
    method: "post",
    data: obj
  })
}

///transfer/getCostInfo 获取录入费用
export function getCostInfoById(query) {
  return request({
    url: "/warehouse/transfer/getCostInfo",
    method: "get",
    params: query
  })
}

//获取录入调整费用
export function getLockCostInfoById(obj) {
  return request({
    url: "/warehouse/transfer/getLockCostInfo",
    method: "post",
    data: obj
  })
}

///transfer/downloadImportCostTemplate 下载导入模板
export function getImportTemplate(query) {
  return request({
    url: "/warehouse/transfer/downloadImportCostTemplate",
    method: "get",
    responseType: "blob",
    params: query
  })
}

///transfer/importCost 导入费用
export function importCostApi(obj) {
  return request({
    url: "/warehouse/transfer/importCost",
    method: "post",
    data: obj
  })
}

///transfer/getUnLockCostInfo 获取待锁定数据
export function getUnLockCostInfo(obj) {
  return request({
    url: "/warehouse/transfer/getUnLockCostInfo",
    method: "post",
    data: obj
  })
}

///transfer/uploadStatement 上传对账单
export function uploadStatement(obj) {
  return request({
    url: "/warehouse/transfer/uploadStatement",
    method: "post",
    data: obj
  })
}

export function uploadImgAndPdf(obj) {
  return request({
    url: "/filecenter/upload/multipartFileEX",
    method: "post",
    data: obj
  })
}

export function previewImgAndPdf(query) {
  return request({
    url: "/filecenter/downloadEX/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

export function downloadImgAndPdf(query) {
  return request({
    url: "/filecenter/download/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

//列表提交 transfer/submitTransfer
export function submitTransfer(obj) {
  return request({
    url: "/warehouse/transfer/submitTransfer",
    method: "post",
    data: obj
  })
}

//强制完结show /transfer/forceFinishShow
export function forceFinishShow(obj) {
  return request({
    url: "/warehouse/transfer/forceFinishShow",
    method: "post",
    data: obj
  })
}

//强制完结 /transfer/forceFinish
export function forceFinish(obj) {
  return request({
    url: "/warehouse/transfer/forceFinish",
    method: "post",
    data: obj
  })
}

//导出数据/transfer/exportExcel
export function exportExcel(obj) {
  return request({
    url: "/warehouse/transfer/exportExcel",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function getTransferLogisticsTransport(obj) {
  return request({
    url: "/warehouse/transfer/getTransferLogisticsTransport",
    method: "post",
    data: obj
  })
}

export function getInternalDetailInfo(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/getDetailInfo?orderNo=" + obj.orderNo,
    method: "post"
  })
}

export function listPageDetail(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/listPageDetail",
    method: "post",
    data: obj
  })
}

export function getTransferFinalProduct(obj) {
  return request({
    url: "/warehouse/transferFinal/getTransferFinalProduct",
    method: "post",
    data: obj
  })
}

export function getFinalInfo(query) {
  return request({
    url: "/warehouse/transferFinal/getDetailInfo",
    method: "get",
    params: query
  })
}

export function finalSave(obj) {
  return request({
    url: "/warehouse/transferFinal/create",
    method: "post",
    data: obj
  })
}

export function costListAll(obj) {
  return request({
    url: "/warehouse/logisticscosttype/listAll",
    method: "post",
    data: obj
  })
}

export function showCostList(obj) {
  return request({
    url: "/warehouse/cost/showCostList",
    method: "post",
    data: obj
  })
}

export function handleCost(obj) {
  return request({
    url: "/warehouse/cost/handleCost",
    method: "post",
    data: obj
  })
}

export function getListCustomsDeclarationMsg(obj) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/listCustomsDeclarationMsg",
    method: "post",
    data: obj
  })
}

//导出尾程
export function transferFinalExportExcelApi(obj) {
  return request({
    url: "/warehouse/transferFinal/exportExcel",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 批量上传附件
export function batchUploadAttachmentApi(data, bizType) {
  return request({
    url: "/finance/finAntiDumpingFile/upload?bizType=" + bizType,
    method: "post",
    data
  })
}

// 获取文件列表
export function getFileListApi(data) {
  return request({
    url: "/finance/finAntiDumpingFile/listFile",
    method: "post",
    data
  })
}

// 下载全部
export function downloadAllApi(data) {
  return request({
    url: "/finance/finAntiDumpingFile/download",
    method: "post",
    data
  })
}

// 保存或更新延迟入库原因
export function inboundDelayReasonApi(data) {
  return request({
    url: "/warehouse/transfer/inboundDelayReason",
    method: "post",
    data
  })
}
