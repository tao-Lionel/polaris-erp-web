import request from "@/router/axios"

// 预览下载 文件
export function previewFileApi(query) {
  return request({
    url: "/filecenter/downloadEX/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

// 上传文件
export function uploadFileApi(obj) {
  return request({
    url: "/filecenter/upload/multipartFileEX",
    method: "post",
    data: obj
  })
}

// 获取帆软token
export function getFineBiTokenApi(obj) {
  return request({
    url: "/dataanalysis/oauth/fineBi/token",
    method: "post",
    data: obj
  })
}

//  公共导出
export function exportDataComApi(obj) {
  return request({
    url: "/baseSetup/export/exportData",
    method: "post",
    responseType: obj.exportModel === "SYNC" ? "blob" : "application/json;charset=UTF-8",
    data: obj
  })
}

// 数据收集token获取
export function getDataManagerTokenApi(obj) {
  return request({
    url: "/dataanalysis/oauth/DataManager/token",
    method: "post",
    data: obj
  })
}

// 页面导出
export function exportPageComApi(moduleName, data) {
  return request({
    url: `/${moduleName}/basis/exportPage`,
    method: "post",
    responseType: "blob",
    data
  })
}

// 上传文件
export function uploadFileBatchApi(data, filePath) {
  return request({
    url: "/filecenter/upload/uploadFileBatch?filePath=" + filePath,
    method: "post",
    data
  })
}

// 下载错误文件
export function exportErrorDataApi(moduleName, data) {
  return request({
    url: `/${moduleName}/basis/exportErrorData`,
    method: "post",
    responseType: "blob",
    data
  })
}

// 根据id获取文件地址
export function getFileListByIdListApi(data) {
  return request({
    url: "/filecenter/listByIdList",
    method: "post",
    data
  })
}

// 通过文件url获取文件流
export function downloadFileByUrl(data) {
  return request({
    url: "/filecenter/getByteArrByUrl",
    method: "post",
    responseType: "blob",
    data
  })
}
