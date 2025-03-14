
import request from '@/router/axios'

/**
 *
 * 平台站点分页
 */
export function getPlatformStorageAgeList (obj) {
  return request({
    url: '/dataanalysis/daStockAgeQuery/platformSitePage',
    method: 'post',
    data: obj
  })
}

/**
 *
 * 仓库分页
 */
export function getWarehouseStorageAgeList (obj) {
  return request({
    url: '/dataanalysis/daStockAgeQuery/warehousePage',
    method: 'post',
    data: obj
  })
}

/**
 *
 * 详情 查看
 */
export function getStorageAgeDetail (obj) {
  return request({
    url: '/dataanalysis/daStockAgeQuery/detail',
    method: 'post',
    data: obj
  })
}


/**获取所有平台类型 */
export function getPlayTypeAll (query) {
  return request({
    url: '/baseSetup/bseplatformtype/getAll',
    method: 'get',
    params: query
  })
}

// 获取平台下的所有站点
export function getSit (obj) {
  return request({
    url: '/baseSetup/bseplatformsit/getSitByPlatformTypeCodes',
    method: 'post',
    data: obj
  })
}

/***
 * 仓库类型
 */
export function getBseWarehouseType() {
  return request({
    url: '/baseSetup/bsewarehousetype/getBseWarehouseType',
    method: 'get'
  })
}

// 列表导出 平台
export function exportListExportPt (obj) {
  return request({
    url: '/warehouse/stockAge/listExportPt',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}
// 列表导出 仓库
export function exportListExportCk(obj) {
  return request({
    url: '/warehouse/stockAge/listExportCk',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}

// 库龄查询明细导出
export function exportDetail (obj) {
  return request({
    url: '/warehouse/stockAge/stockAgeDetailExport',
    method: 'post',
    responseType: 'blob',
    data: obj
  })
}