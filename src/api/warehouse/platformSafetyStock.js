import request from "@/router/axios"

export function getSafetyStockPageApi(obj) {
  return request({
    url: "/warehouse/wmssafestock/listPage",
    method: "post",
    data: obj
  })
}

// 新增
export function saveSafetyStockApi(obj) {
  return request({
    url: "/warehouse/wmssafestock/savePlatformSafeStock",
    method: "post",
    data: obj
  })
}

// 导出
export function exportSafetyStockApi(obj) {
  return request({
    url: "/warehouse/wmssafestock/exportExcel",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
