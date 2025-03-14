import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/page",
    method: "post",
    data: obj
  })
}

export function stateModify(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/stateModify",
    method: "post",
    data: obj
  })
}

export function handleSaveOrUpdate(obj) {
  return request({
    url: "/baseSetup/bseplatformsku/handleSaveOrUpdate",
    method: "post",
    data: obj
  })
}

export function getWarehouseSkuInfo(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/getById",
    method: "post",
    data: obj
  })
}

export function saveAndUpdateMsg(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/saveOrUpdate",
    method: "post",
    data: obj
  })
}

// export function handleImport (obj) {
//   return request({
//     url: '/baseSetup/bsewarehousesku/handleImport',
//     method: 'post',
//     data: obj
//   })
// }

export function handleImport(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/import/bseWarehouseSku",
    method: "post",
    data: obj
  })
}

export function exportMsg(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function exportErrorExcel(obj) {
  return request({
    url: "/baseSetup/bsewarehousesku/import/exportError/bseWarehouseSku",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
