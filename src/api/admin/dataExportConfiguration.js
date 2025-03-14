import request from "@/router/axios"


export function getExportConfigPage(obj) {
  return request({
    url: "/baseSetup/export/getExportConfigPage",
    method: "post",
    data: obj
  })
}


// 获取分类信息
export function getCategoryList() {
  return request({
    url: "/baseSetup/export/getCategoryList",
    method: "get",
  })
}


export function getExportConfigDetail(id) {
  return request({
    url: "/baseSetup/export/getExportConfig" + `?id=${id}`,
    method: "get",
  })
}


// 插入导出配置
export function saveOrUpdateExportConfig(obj) {
  return request({
    url: "/baseSetup/export/saveOrUpdateExportConfig",
    method: "post",
    data: obj
  })
}


