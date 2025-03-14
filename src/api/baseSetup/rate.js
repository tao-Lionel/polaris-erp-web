import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/baseSetup//bsecurrency/queryBseCurrencyExchangePage",
    method: "post",
    data: obj
  })
}

export function exportBseCurrencyExchangePage(obj) {
  return request({
    url: "/baseSetup/bsecurrency/exportBseCurrencyExchangePage",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

export function getCurrency(query) {
  return request({
    url: "/baseSetup/bsecurrency/getAll",
    method: "get",
    params: query
  })
}
