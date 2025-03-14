import request from "@/router/axios"

// 分页列表
export function getPageList(data) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/pageList",
    method: "post",
    data
  })
}

// 查看详情
export function getCheckDetailList(data) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/showList",
    method: "post",
    data
  })
}

// 解除锁定
export function getUnLock(data) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/unLock",
    method: "post",
    data
  })
}

// 锁定
export function getLock(data) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/lock",
    method: "post",
    data
  })
}

// 导入
export function importForecastExcelApi(obj) {
  return request({
    url: "/dataanalysis/daSalesForecast/data/asyncImport",
    method: "post",
    data: obj
  })
}

// 导出
export function exportData(obj) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/exportData",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 获取销量预测数据模板
export function exportForecastTemplateApi(obj) {
  return request({
    url: "/dataanalysis/daSalesForecast/data/downloadImportTemplate",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 逻辑删除销量预测记录
export function deleteForecastApi(data) {
  return request({
    url: "/dataanalysis/daSalesForecastPlan/delete",
    method: "post",
    data
  })
}
