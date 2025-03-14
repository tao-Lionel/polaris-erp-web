import request from "@/router/axios"

// 新增核价需求
export function saveProductPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/save",
    method: "post",
    data
  })
}

// 更新核价需求
export function updateProductPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/update",
    method: "post",
    data
  })
}

// 核价需求分页查询
export function getProductPricingDemandPageApi(data) {
  return request({
    url: "/product/pricing/demand/page",
    method: "post",
    data
  })
}

// 通过id查询核价需求
export function getProductPricingDemandByIdApi(id) {
  return request({
    url: `/product/pricing/${id}`,
    method: "get"
  })
}

// 核价信息分页查询
export function getProductPricingInfoPageApi(data) {
  return request({
    url: "/product/pricing/info/page",
    method: "post",
    data
  })
}

// 分页获取生成的核价信息
export function getProductPricingSuccessPageApi(data) {
  return request({
    url: `/product/pricing/pageSuccess`,
    method: "post",
    data,
    params: {
      isHideLoading: true
    }
  })
}

// 核价计算
export function getProductPricingCalculateApi(data) {
  return request({
    url: "/product/pricing/calculate",
    method: "post",
    data
  })
}

// 异步核价计算
export function getProductPricingSyncCalculateApi(data) {
  return request({
    url: "/product/pricing/syncCalculate",
    method: "post",
    data
  })
}

// 核价需求驳回
export function rejectProductPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/reject",
    method: "post",
    data
  })
}

// 核价需求作废
export function invalidProductPricingDemandApi(data) {
  return request({
    url: `/product/pricing/demand/invalid`,
    method: "post",
    data
  })
}

// 核价信息提交
export function submitProductPricingInfoApi(id) {
  return request({
    url: `/product/pricing/demand/submit/${id}`,
    method: "get"
  })
}

// 核价信息提交审核前校验
export function reviewProductPricingInfoApi(data) {
  return request({
    url: `/product/pricing/info/review`,
    method: "post",
    data
  })
}

// 核价信息提交审核 筛选
export function reviewProductPricingInfoBatchApi(data) {
  return request({
    url: `/product/pricing/info/submitReview`,
    method: "post",
    data
  })
}

// 核价需求查询
export function getProductPricingDemandByLinkSkuIdApi(linkSkuId) {
  return request({
    url: `/product/pricing/demand/${linkSkuId}`,
    method: "get"
  })
}

// 已关联核价查询
export function getProductPricingBoundByLinkSkuIdApi(linkSkuId) {
  return request({
    url: `/product/pricing/demand/bound/${linkSkuId}`,
    method: "get"
  })
}

// 可关联核价查询
export function getProductPricingAvailableByLinkSkuIdApi(linkSkuId) {
  return request({
    url: `/product/pricing/demand/available/${linkSkuId}`,
    method: "get"
  })
}

//  校验是否可以启用核价
export function checkPricingBindApi(data) {
  return request({
    url: "/product/pricing/demand/checkbind",
    method: "post",
    data
  })
}

//  启用核价
export function bindPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/bind",
    method: "post",
    data
  })
}

// 批量提交核价需求
export function batchSubmitPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/batchSubmit",
    method: "post",
    data
  })
}

// 核价需求导入
export function importPricingDemandApi(data) {
  return request({
    url: "/product/pricing/import",
    method: "post",
    data
  })
}

// 下载模板
export function productDownloadTemplateApi(data) {
  return request({
    url: "/product/basis/downloadTemplate",
    method: "post",
    responseType: "blob",
    data
  })
}

// 下载错误文件
export function exportErrorDataApi(data) {
  return request({
    url: "/product/basis/exportErrorData",
    method: "post",
    responseType: "blob",
    data
  })
}

// SPU和SKU 互查
export function getSpuOrSkuApi(data) {
  return request({
    url: "/product/prdsku/getSkuCodeSpuCodeInfo",
    method: "post",
    data
  })
}

// 根据平台获取销售模式
export function getSaleModeByPlatformApi(data) {
  return request({
    url: "/baseSetup/bseplatformtype/getOrderBusinessTypeByPlatform",
    method: "post",
    data
  })
}

// 核价信息作废
export function invalidProductPricingInfoApi(data) {
  return request({
    url: "/product/pricing/info/invalid",
    method: "post",
    data
  })
}

// 链接sku核价相关内容
export function checkLinkSkuPricingApi(linkSkuId) {
  return request({
    url: `/product/prdLinkSku/pricing/${linkSkuId}`,
    method: "get"
  })
}

// 根据标准sku获取工厂sku, sku获取标准sku
export function getSkuByStandardSkuApi(data) {
  return request({
    url: "/product/prdsku/getStandardSkuSkuInfo",
    method: "post",
    data
  })
}

// 根据sku获取采购供应商 采购供应商获取sku
export function getSupplierBySkuApi(data) {
  return request({
    url: "/product/prdsku/getSupplierFactoryCodeInfo",
    method: "post",
    data
  })
}

// 核价信息审核通过 测试用
export function passProductPricingInfoApi(pricingInfoId) {
  return request({
    url: `/product/pricing/info/pass/${pricingInfoId}`,
    method: "get"
  })
}

// 获取oa审批url
export function getOaProcessUrlApi(data) {
  return request({
    url: "/baseSetup/oa/getProcessUrl",
    method: "post",
    data
  })
}

// 核价需求 提交审核
export function submitReviewProductPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/submitReview",
    method: "post",
    data
  })
}

// 校验是否有可核价的需求
export function checkPricingDemandApi(data) {
  return request({
    url: "/product/pricing/demand/check",
    method: "post",
    data
  })
}
