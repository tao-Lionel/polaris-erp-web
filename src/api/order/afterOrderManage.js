import request from '@/router/axios'

/**获新增工单 查询订单 */
export function getOrderByCode(obj) {
  return request({
    url: '/oms/omsSoOrder/getOrderByCode',
    method: 'post',
    data: obj
  })
}




// 获取所有工单类型
export function getAllWorkOrderType(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllWorkOrderType',
    method: 'post',
    data: obj
  })
}

// 获取所有售后原因
export function getListAllReason(obj) {
  return request({
    url: '/oms/omsAfterSalesOrderAfterSalesReason/listAllReason',
    method: 'post',
    data: obj
  })
}

// 新增售后工单
export function addWorkOrder(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/addWorkOrder',
    method: 'post',
    data: obj
  })
}

// 新增备注
export function addRemark(obj) {
  return request({
    url: '/oms/omsAfterSalesOrderRemark/addRemark',
    method: 'post',
    data: obj
  })
}



// 列表
export function getAfterOrderList(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/list',
    method: 'post',
    data: obj
  })
}


// 获取所有工单状态

export function listAllWorkOrderStatus() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllWorkOrderStatus',
    method: 'post'
  })
}

// 获取所有工单类型
export function listAllWorkOrderType() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllWorkOrderType',
    method: 'post'
  })
}

// 工单详情
export function getDetail(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/getDetail',
    method: 'post',
    data: obj
  })
}

// 填写物流单号

export function addLogisticsNo(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/addLogisticsNo',
    method: 'post',
    data: obj
  })
}

// 回显工单详情 - 填写物流单号展示
export function getWorkOrderMsg(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/getWorkOrderMsg',
    method: 'post',
    data: obj
  })
}




// 返回跟进退货的信息
export function getReturnMsg(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/getReturnMsg',
    method: 'post',
    data: obj
  })
}




// 跟进退货提交接口
export function followUpOnReturn(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/followUpOnReturn',
    method: 'post',
    data: obj
  })
}

export function getAllWarehouse(params) {
  return request({
    url: '/baseSetup/bsewarehouse/getAll',
    method: 'get',
    params: params
  })
}

//产品档案
export function getProductList(obj) {//搜索列表
  return request({
    url: '/product/prdarchives/list',
    method: 'post',
    data: obj
  })
}

// 新建赠品工单
export function addWorkOrderByGifts(obj) {//搜索列表
  return request({
    url: '/oms/omsAfterSaleWorkOrder/addWorkOrderByGifts',
    method: 'post',
    data: obj
  })
}

/**获取所有平台类型 */
export function getPlayTypeAll(query) {
  return request({
    url: '/baseSetup/bseplatformtype/getAll',
    method: 'get',
    params: query
  })
}

// 获取平台下的所有站点
export function getSit(obj) {
  return request({
    url: '/baseSetup/bseplatformsit/getSitByPlatformTypeCodes',
    method: 'post',
    data: obj
  })
}


// 获取站点下的所有店铺
export function getStoreBySitIds(obj) {
  return request({
    url: '/baseSetup/bsestore/getStoreBySitIds',
    method: 'post',
    data: obj
  })
}

/**获取模式 */
export function getObjByType(type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}

export function getCurrency(query) {
  return request({
    url: '/baseSetup/bsecurrency/page',
    method: 'get',
    params: query
  })
}

// 获取全部国家
export function getCountry(type) {
  return request({
    url: '/baseSetup/bsecountry/getCountry',
    method: 'get'
  })
}


// 作废售后工单
export function cancelWorkOrder(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/cancel',
    method: 'post',
    data: obj
  })
}



// 跟进退款信息
export function getRefundMsg(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/getRefundMsg',
    method: 'post',
    data: obj
  })
}



// 跟进退款信息 新增
export function followUpOnRefund(obj) {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/followUpOnRefund',
    method: 'post',
    data: obj
  })
}




//  退款方式
export function listAllRefundMethod() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllRefundMethod',
    method: 'post'
  })
}

// 根据SKU批量获取平台SKU列表
export function getSellerSku(obj) {
  return request({
    url: '/baseSetup/bseskurelatemanage/getSellerSku',
    method: 'post',
    data: obj
  })
}


//  销售订单详情
export function getSalesDetailById(obj) {
  return request({
    url: '/oms/omsSoOrder/getById',
    method: 'post',
    data: obj
  })
}



//  手工新增订单
export function manualCreate(obj) {
  return request({
    url: '/oms/omsSoOrder/manualCreate',
    method: 'post',
    data: obj
  })
}

// 获取平台下的所有店铺站点
export function getStore(obj) {
  return request({
    url: '/baseSetup/bsestore/getStoreByPlatformTypeCodes',
    method: 'post',
    data: obj
  })
}

//  售后状态
export function listAllAfterSaleStatus(obj) {
  return request({
    url: '/oms/omsSoOrder/listAllAfterSaleStatus',
    method: 'post',
    data: obj
  })
}

//  返回所有订单状态
export function listAllFulfillmentStatus() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllFulfillmentStatus',
    method: 'post'
  })
}

//  返回所有退货单状态
export function listAllReturnStatus() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllReturnStatus',
    method: 'post'
  })
}

//  返回所有退款单状态
export function listAllRefundStatus() {
  return request({
    url: '/oms/omsAfterSaleWorkOrder/listAllRefundStatus',
    method: 'post'
  })
}


//  返回所有退款单状态
export function exportData(obj) {
  return request({
    url: '/baseSetup/export/exportData',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}