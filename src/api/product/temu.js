import request from "@/router/axios"

// 获取列表
export function getTemuListApi(params) {
  return request({
    url: "/product/platSupplyCost/listPage",
    method: "get",
    params
  })
}

// 新增
export function addTemuApi(obj) {
  return request({
    url: "/product/platSupplyCost/add",
    method: "post",
    data: obj
  })
}

// 编辑
export function editTemuApi(obj) {
  return request({
    url: "/product/platSupplyCost/edit",
    method: "post",
    data: obj
  })
}

// 日志
export function getTemuLogPageApi(params) {
  return request({
    url: "/product/platSupplyCost/listLogPage",
    method: "get",
    params
  })
}

// 下载模版
export function temuDownloadUrlApi(data) {
  return request({
    url: "/product/platSupplyCost/downloadImportTemplate",
    method: "post",
    responseType: "blob",
    data
  })
}

// 导入
export function importTempApi(data) {
  return request({
    url: "/product/platSupplyCost/importData",
    method: "post",
    data
  })
}

// 导出
export function exportTempApi(data) {
  return request({
    url: "/product/platSupplyCost/exportData",
    method: "post",
    responseType: "blob",
    data
  })
}
