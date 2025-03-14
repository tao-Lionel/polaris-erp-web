import request from '@/router/axios'

//  数据导出s
export function exportData(obj) {
  return request({
    url: '/baseSetup/export/exportData',
    method: 'post',
    responseType: obj.exportModel === 'SYNC' ? 'blob' : 'application/json;charset=UTF-8',
    data: obj
  })
}

// 获取可以导出的模块信息
export function getExportInfo() {
  return request({
    url: '/baseSetup/export/getExportInfo',
    method: 'get'
  })
}


// 获取下拉框数据
export function getSelectInfo(obj) {
  return request({
    url: '/baseSetup/export/getSelectInfo',
    method: 'post',
    data: obj
  })
}