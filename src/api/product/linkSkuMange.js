import request from "@/router/axios"

// 获取分页查询
export function getPageListApi(data) {
  return request({
    url: "/product/prdLinkSku/page",
    method: "post",
    data
  })
}

// 修改
export function editLinkSkuApi(data) {
  return request({
    url: "/product/prdLinkSku/update",
    method: "post",
    data
  })
}

// 保存
export function saveLinkSkuApi(data) {
  return request({
    url: "/product/prdLinkSku/save",
    method: "post",
    data
  })
}

// 批量更新
export function batchUpdateApi(data) {
  return request({
    url: "/product/prdLinkSku/batchUpdate",
    method: "post",
    data
  })
}

// 链接sku品类树形数据
export function getCategoryTreeApi(data) {
  return request({
    url: "/product/prdLinkSkuCategory/getTree",
    method: "post",
    data
  })
}

// 更新运营和开售时间
export function updateOtherInfoApi(data) {
  return request({
    url: "/product/prdLinkSku/updateOtherInfo",
    method: "post",
    data
  })
}

// 导出
export function exportExcelLinkSkuApi(data) {
  return request({
    url: "/product/prdLinkSku/exportExcel",
    method: "post",
    responseType: "blob",
    data
  })
}

export const linkSkuDownloadUrlApi = "/product/prdLinkSku/downPrdLinkSkuImportTemplate"
export const linkSkuPreviewUrlApi = "/product/prdLinkSku/batchImportPreview"
export const linkSkuUploadUrlApi = "/product/prdLinkSku/batchImportData"

// 查询标准SPU、SKU
export function getBrandOrSpuOrSkuCodeApi(data) {
  return request({
    url: "/product/prdarchives/getBrandOrSpuOrSkuCode",
    method: "post",
    data
  })
}

// 新增
export function saveBatchLinkSkuApi(data) {
  return request({
    url: "/product/prdLinkSku/saveBatch",
    method: "post",
    data
  })
}

// 查询链接sku集合或者查询测算记录集合
export function findLinkSkusOrCalculsApi(data) {
  return request({
    url: "/product/prdLinkSku/findLinkSkusOrCalculs",
    method: "post",
    data
  })
}

// 详情
export function getLinkSkuDetailApi(id) {
  return request({
    url: `/product/prdLinkSku/linkSkuDetail/${id}`,
    method: "get"
  })
}

// 导入修改价格
export function importEditPriceApi(data) {
  return request({
    url: "/product/prdLinkSku/linkSkuPriceImportBatchUpdate",
    method: "post",
    data
  })
}

// 下载修改价格模版
export function downloadEditPriceApi(data) {
  return request({
    url: "/product/prdLinkSku/linkSkuPriceUpdateTemplateDownload",
    method: "post",
    responseType: "blob",
    data
  })
}

// 保存分配运营
export function saveDistributeApi(data) {
  return request({
    url: "/product/operatorRecord/save",
    method: "post",
    data
  })
}

// 分配运营记录
export function getDistributeLogApi(data) {
  return request({
    url: "/product/operatorRecord/listPage",
    method: "post",
    data
  })
}

// 分配运营导入
export function distributeImportApi(data) {
  return request({
    url: "/product/operatorRecord/import",
    method: "post",
    data
  })
}

export function LinkRequireDataPreview(data) {
  return request({
    url: "/product/pricing/importDataPreview",
    method: "post",
    data
  })
}
