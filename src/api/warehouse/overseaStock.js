import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/warehouse/wmsOverseaStockCount/listPage",
    method: "post",
    data: obj
  })
}

///wmsOverseaStockCount/export 导出数据
export function selectedExport(obj) {
  return request({
    url: "/warehouse/wmsOverseaStockCount/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

///wmsOverseaStockCount/exportAll 导出所有数据
export function allExport(obj) {
  return request({
    url: "/warehouse/wmsOverseaStockCount/exportAll",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
///wmsOverseaStockCount/sync
export function syncOversea(id) {
  return request({
    url: "/warehouse/wmsOverseaStockCount/sync?warehouseId=" + id,
    method: "post",
    data: id
  })
}
