import request from "@/router/axios"

// 物流商分页查询招标信息
export function getPageApi(data) {
  return request({
    url: "/warehouse/tender/page",
    method: "post",
    data
  })
}

// 投标
export function submitTenderApi(data) {
  return request({
    url: "/warehouse/tender/submitTender",
    method: "post",
    data
  })
}

// 通过id查询
export function getDetailApi(inviteTenderId) {
  return request({
    url: `/warehouse/tender/${inviteTenderId}`,
    method: "get"
  })
}

// 导出
export function exportTenderApi(data) {
  return request({
    url: "/warehouse/tender/export",
    method: "post",
    responseType: "blob",
    data
  })
}

// 报价清单模板下载
export function downloadTemplateApi(data) {
  return request({
    url: "/warehouse/basis/downloadTemplate",
    method: "post",
    responseType: "blob",
    data
  })
}

// 批量投标
export function submitTenderBatchApi(data) {
  return request({
    url: "/warehouse/tender/submitTenderBatch",
    method: "post",
    data
  })
}
