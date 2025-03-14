import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/product/bundle/listPage",
    method: "post",
    data: obj
  })
}

export function getBundle(query) {
  return request({
    url: "/product/bundle/getById",
    method: "get",
    params: query
  })
}

export function auditBundle(obj) {
  return request({
    url: "/product/bundle/batchCheck",
    method: "post",
    data: obj
  })
}

export function batchCreate(obj) {
  return request({
    url: "/product/bundle/batchCreate",
    method: "post",
    data: obj
  })
}

export function updateBundle(obj) {
  return request({
    url: "/product/bundle/update",
    method: "post",
    data: obj
  })
}

export function batchSales(obj) {
  return request({
    url: "/product/bundle/batchUpdateSaleStatus",
    method: "post",
    data: obj
  })
}

export function getNormalBundleLikeCode(query) {
  return request({
    url: "/product/bundle/getNormalBundleLikeCode",
    method: "get",
    params: query
  })
}

export function batchImportBundle(obj) {
  return request({
    url: "/product/bundle/batchImportBundle",
    method: "post",
    data: obj
  })
}
