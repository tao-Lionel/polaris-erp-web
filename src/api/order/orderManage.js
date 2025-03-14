import request from "@/router/axios"

/**获取所有平台类型 */
export function getPlayTypeAll(query) {
  return request({
    url: "/baseSetup/bseplatformtype/getAll",
    method: "get",
    params: query
  })
}

// 获取平台下的所有站点
export function getSit(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// 获取平台下的所有店铺站点
export function getStore(obj) {
  return request({
    url: "/baseSetup/bsestore/getStoreByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// 获取站点下的所有店铺
export function getStoreBySitIds(obj) {
  return request({
    url: "/baseSetup/bsestore/getStoreBySitIds",
    method: "post",
    data: obj
  })
}

/**获取模式 */
export function getObjByType(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

// 获取全部国家
export function getCountry(type) {
  return request({
    url: "/baseSetup/bsecountry/getCountry",
    method: "get"
  })
}

// 添加手工订单
export function manualCreate(obj) {
  return request({
    url: "/oms/omsSoOrder/manualCreate",
    method: "post",
    data: obj
  })
}

/**添加匹配规则 */
export function setWarehouseRule(obj) {
  return request({
    url: "/oms/setWarehouseRule/save",
    method: "post",
    data: obj
  })
}

/**添加拆分规则 */
export function splitOrderRule(obj) {
  return request({
    url: "/oms/splitOrderRule/save",
    method: "post",
    data: obj
  })
}

// 获取匹配仓库订单详情
export function getDetailByOrderId(obj) {
  return request({
    url: "/oms/omsSoOrder/getDetailByOrderId",
    method: "post",
    data: obj
  })
}

// 切换仓库获取库存
export function getStockNumWithSku(obj) {
  return request({
    url: "/oms/omsSoOrder/getStockNumWithSku",
    method: "post",
    data: obj
  })
}

// 隐藏缺货仓库
export function hideWarehouse(obj) {
  return request({
    url: "/oms/omsSoOrder/hideWarehouse",
    method: "post",
    data: obj
  })
}

// 手动匹配仓库
export function matchOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/matchOrder",
    method: "post",
    data: obj
  })
}

// 手动匹配SKU
export function matchOrderTasks(obj) {
  return request({
    url: "/oms/omsSoOrder/orderAutomaticMatch",
    method: "post",
    data: obj
  })
}

// 获取订单管理列表
export function getOrderList(obj) {
  return request({
    url: "/oms/omsSoOrder/listPage",
    method: "post",
    data: obj
  })
}

// 单个修改标签
export function editLabel(obj) {
  return request({
    url: "/oms/voucherLabel/save",
    method: "post",
    data: obj
  })
}

// 批量修改标签
export function editAllLabel(obj) {
  return request({
    url: "/oms/voucherLabel/batchSave",
    method: "post",
    data: obj
  })
}

// 旧获取确认订单详情
export function querySoOrderConfirmDetailList(obj) {
  return request({
    url: "/oms/omsSoOrderDetail/querySoOrderConfirmDetailList",
    method: "post",
    data: obj
  })
}

// 新获取确认订单详情
export function getOrderConfirmOperateInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/getOrderConfirmOperateInfo",
    method: "post",
    data: obj
  })
}

// 旧确认订单
export function confirmOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/confirmOrder",
    method: "post",
    data: obj
  })
}

// 新确认订单
export function orderConfirm(obj) {
  return request({
    url: "/oms/omsSoOrder/orderConfirm",
    method: "post",
    data: obj
  })
}

// 标记发货
export function markShipment(obj) {
  return request({
    url: "/oms/omsSoOrder/markShipment",
    method: "post",
    data: obj
  })
}

// 获取商品库存
export function getWmsStock(obj) {
  return request({
    url: "/warehouse/wmsstock/getWmsStock",
    method: "post",
    data: obj
  })
}

// 根据仓库获取物流商、物流渠道
export function getCarriersByWarehouseld(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getCarriersByWarehouseIdNoInner",
    method: "post",
    data: obj
  })
}

// 根据物流商获取物流渠道
export function getBseChannelByTransportCode(obj) {
  return request({
    url: "/baseSetup/bseChannel/getBseChannelByTransportCode",
    method: "post",
    data: obj
  })
}

// 设置仓库物流
export function updateDefaultLogistics(obj) {
  return request({
    url: "/oms/omsSoOrder/matchOrder",
    method: "post",
    data: obj
  })
}

// 手工取消订单
export function manualCancelOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/manualCancelOrder",
    method: "post",
    data: obj
  })
}

// 同步订单
export function syncSingeOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/syncSingleOrder",
    method: "post",
    data: obj
  })
}

// 获取订单详情
export function getDetailById(obj) {
  return request({
    url: "/oms/omsSoOrder/getById",
    method: "post",
    data: obj
  })
}

// 获取订单状态的数量
export function getOrderCountInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/getOrderCountInfo",
    method: "post",
    data: obj
  })
}

// 编辑订单
export function updateOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/updateOrder",
    method: "post",
    data: obj
  })
}

// 更新地址
export function updateReceiverInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/updateReceiverInfo",
    method: "post",
    data: obj
  })
}

// 获取对应的sku的平台sku
export function getAsin(query) {
  return request({
    url: "/baseSetup/bseskurelatemanage/page",
    method: "get",
    params: query
  })
}

// 手工、导入单确认
export function confirmUnInterfaceOrder(obj) {
  return request({
    url: "/oms/omsSoOrder/confirmUnInterfaceOrder",
    method: "post",
    data: obj
  })
}

// 按数量拆单
export function createFoOrderByNum(obj) {
  return request({
    url: "/oms/omsSoOrder/createFoOrderByNum",
    method: "post",
    data: obj
  })
}

// 生成普通发货单
export function createFoOrderByNormal(obj) {
  return request({
    url: "/oms/omsSoOrder/createFoOrderByNormal",
    method: "post",
    data: obj
  })
}

// 按详情合单
export function createFoOrderByDetail(obj) {
  return request({
    url: "/oms/omsSoOrder/createFoOrderByDetail",
    method: "post",
    data: obj
  })
}

// 根据SKU批量获取平台SKU列表
export function getSellerSku(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/getSellerSku",
    method: "post",
    data: obj
  })
}

// 导入订单
export function importOrderData(obj) {
  return request({
    url: "/oms/omsSoOrder/importOrderData",
    method: "post",
    data: obj
  })
}

// 导入订单错误excel下载
export function exportErrorExcel(obj) {
  return request({
    url: "/oms/omsSoOrder/importOrderDataExportError",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 取消异常标识
export function cancelAbnormal(obj) {
  return request({
    url: "/oms/omsSoOrder/cancelAbnormal",
    method: "post",
    data: obj
  })
}

// 获取修改SKU列表
export function getMateSkuList(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/matchSku",
    method: "post",
    data: obj
  })
}

// 标记为待确认
export function customerServiceDeal(obj) {
  return request({
    url: "/oms/omsSoOrder/orderDeal",
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

// 获取面单
export function getOrderShippingLabelOperateInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/getOrderShippingLabelOperateInfo",
    method: "post",
    data: obj
  })
}

// 保存面单
export function orderShippingLabelSave(obj) {
  return request({
    url: "/oms/omsSoOrder/orderShippingLabelSave",
    method: "post",
    data: obj
  })
}

// 获取生成发货单详情
export function getOrderDeliveryOperateInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/getOrderDeliveryOperateInfo",
    method: "post",
    data: obj
  })
}

// 生成发货单
export function orderGenerateDelivery(obj) {
  return request({
    url: "/oms/omsSoOrder/orderGenerateDelivery",
    method: "post",
    data: obj
  })
}

// 获取取消订单详情
export function getOrderCancelOperateInfo(obj) {
  return request({
    url: "/oms/omsSoOrder/getOrderCancelOperateInfo",
    method: "post",
    data: obj
  })
}

// 取消订单
export function orderCancel(obj) {
  return request({
    url: "/oms/omsSoOrder/orderCancel",
    method: "post",
    data: obj
  })
}

// 旧导出订单
export function exportExcel(obj) {
  return request({
    url: "/oms/omsSoOrder/exportExcel",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 新导出订单
export function exportData(obj) {
  return request({
    url: "/oms/omsSoOrder/exportData",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 新建备注
export function saveRemark(obj) {
  return request({
    url: "/oms/omsSoOrder/saveRemark",
    method: "post",
    data: obj
  })
}

// 修改SKU
export function orderMatchSku(obj) {
  return request({
    url: "/oms/omsSoOrder/orderMatchSku",
    method: "post",
    data: obj
  })
}

// 批量修改SKU
export function batchUpdateSKU(obj) {
  return request({
    url: "/oms/omsSoOrder/batchUpdateSKU",
    method: "post",
    data: obj
  })
}

// 获取释放库存数据
export function releaseQuantityList(obj) {
  return request({
    url: "/oms/omsSoOrder/list/releaseQuantity",
    method: "post",
    data: obj
  })
}

// 释放库存
export function releaseQuantity(obj) {
  return request({
    url: "/oms/omsSoOrder/releaseQuantity",
    method: "post",
    data: obj
  })
}

// 冻结订单
export function orderFreeze(obj) {
  return request({
    url: "/oms/omsSoOrder/orderFreeze",
    method: "post",
    data: obj
  })
}

// 解冻订单
export function orderReFreeze(obj) {
  return request({
    url: "/oms/omsSoOrder/orderReFreeze",
    method: "post",
    data: obj
  })
}

// 标记为待处理
export function reDeal(obj) {
  return request({
    url: "/oms/omsSoOrder/reDeal",
    method: "post",
    data: obj
  })
}

// 根据sku获取仓库
export function getWarehouseInfoBySkuApi(query) {
  return request({
    url: "/oms/omsSoOrder/getSkuWarehouseInfo",
    method: "get",
    params: query
  })
}

// 获取启用的销售关系
export function getEnableSkuRelateManagerInfoApi(data) {
  return request({
    url: "/baseSetup/bseskurelatemanage/getEnableSkuRelateManagerInfo",
    method: "post",
    data
  })
}

// 上传附件
export function batchUploadAttachmentApi(data, bizType) {
  return request({
    url: "/oms/file/upload",
    method: "post",
    data
  })
}

// 接收订单页面展示
export function getReceiveOrderInfoApi(data) {
  return request({
    url: "/oms/omsSoOrder/receiveInfo",
    method: "post",
    data
  })
}

// 接收订单
export function receiveOrderApi(data) {
  return request({
    url: "/oms/omsSoOrder/receive",
    method: "post",
    data
  })
}

// 接收订单下载文件
export function receiveOrderDownLoadApi(data) {
  return request({
    url: "/oms/omsSoOrder/receiveDownLoad",
    method: "post",
    responseType: "blob",
    data
  })
}

// 接单数据文件上传展示
export function receiveUpLoadShowApi(data) {
  return request({
    url: "/oms/omsSoOrder/receiveUpLoadShow",
    method: "post",
    data
  })
}

// 根据页面查询参数获取订单编号列表
export function getOrderCodeByPageParamApi(data) {
  return request({
    url: "/oms/omsSoOrder/listOrderCodeByPageParam",
    method: "post",
    data
  })
}

// 生成页面展示
export function getDeliveryOperateInfoApi(data) {
  return request({
    url: "/oms/omsSoOrder/listDeliveryOperateInfo",
    method: "post",
    data
  })
}

// 生成发货批次单
export function saveDeliveryBatchApi(data) {
  return request({
    url: "/oms/omsSoOrder/orderGenerateFos",
    method: "post",
    data
  })
}

// 发货批次单上传回显
export function saveDeliveryBatchUpLoadShowApi(data) {
  return request({
    url: "/oms/omsSoOrder/orderCreateFoBatchUpLoadShow",
    method: "post",
    data
  })
}

// 生成发货单数据文件下载
export function saveDeliveryBatchDownLoadApi(data) {
  return request({
    url: "/oms/omsSoOrder/orderCreateFoBatchDownLoad",
    method: "post",
    responseType: "blob",
    data
  })
}

// 批量获取提货时间
export function getSoOrderRequireTimeApi(data) {
  return request({
    url: "/oms/omsSoOrder/getSoOrderRequireTime",
    method: "post",
    data
  })
}

// 订单物流面单-创建-手动上传面单
export function orderShippingLabelSaveApi(data) {
  return request({
    url: "/oms/omsSoOrder/orderShippingLabelSaveForManualUpload",
    method: "post",
    data
  })
}
