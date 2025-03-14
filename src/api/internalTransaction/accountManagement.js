import request from "@/router/axios"

export function getReconciliationPageApi(data) {
  return request({
    url: "/finance/reconciliation/pageList",
    method: "post",
    data
  })
}

export function singleDownloadApi(params) {
  return request({
    url: "/finance/reconciliation/internalSales/download",
    method: "get",
    responseType: "blob",
    params
  })
}

export function batchDownloadApi(params) {
  return request({
    url: "/finance/reconciliation/internalSales/batchDownload",
    method: "get",
    params
  })
}
