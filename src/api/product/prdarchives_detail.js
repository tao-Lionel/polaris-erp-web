import request from "@/router/axios"
//产品档案
export function fetchList(obj) {
  //搜索列表
  return request({
    url: "/product/prdarchives/list",
    method: "post",
    data: obj
  })
}

export function downloadFetchList(query) {
  //请求下载链接
  return request({
    url: "/product/prdarchives/export",
    method: "get",
    params: Object(query)
  })
}

export function exportPrdchives(obj) {
  return request({
    url: "/product/prdarchives/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 产品详情

export function detail_spuList(query) {
  //获取spu列表
  return request({
    url: "/product/prdarchives/spuDetail",
    method: "get",
    params: Object(query)
  })
}

export function detail_skuList(query) {
  //获取sku列表
  return request({
    url: "/product/prdarchives/skuDetail",
    method: "get",
    params: Object(query)
  })
}

export function detail_skuInfo(query) {
  //获取sku信息
  return request({
    url: "/product/prdarchives/skuInformationTab",
    method: "get",
    params: Object(query)
  })
}

export function getBySku(query) {
  return request({
    url: "/product/prdCalculatePrice/getBySku",
    method: "get",
    params: Object(query)
  })
}

export function savePrdCalculatePrice(obj) {
  //搜索列表
  return request({
    url: "/product/prdCalculatePrice/savePrdCalculatePrice",
    method: "post",
    data: obj
  })
}

// 升级sku
export function upgradeSku(obj) {
  return request({
    url: "/product/prdarchives/upgrade",
    method: "post",
    data: obj
  })
}

// tab统计
export function getSkuStatusCount(obj) {
  return request({
    url: "/product/prdarchives/getSkuSealStatusCount",
    method: "post",
    data: obj
  })
}

// 删除
export function delPrdarchivesApi(data) {
  return request({
    url: `/product/prdarchives/removeSkuBySkuCodeList?skuCode=${data}`,
    method: "post"
  })
}

// 同步plm sku  信息
export function plmSyncAllSku() {
  return request({
    url: `/product/plmSync/syncManual`,
    method: "post"
  })
}
