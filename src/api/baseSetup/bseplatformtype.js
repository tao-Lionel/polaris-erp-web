/*
 *    Copyright (c) 2018-2025, Aukey All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the trob4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: wangbin (AukeyIT@aukeys.com)
 */

import request from "@/router/axios"

/**获取所有平台类型 */
export function getPlaTypeAll(query) {
  return request({
    url: "/baseSetup/bseplatformtype/getAll",
    method: "get",
    params: query
  })
}

/**获取模式 */
export function getObjByType(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

/**获取产品售后毛利列表 */
export function getprdSaleProfit(obj) {
  return request({
    url: "/product/prdCalculateRecord/page",
    method: "post",
    data: obj
  })
}

/**删除产品毛利测算数据 */
export function delProfit(id) {
  return request({
    url: "/product/prdCalculateRecord/" + id,
    method: "delete"
  })
}

/**确认定价 */
export function sureConfirmPric(query) {
  return request({
    url: "/product/prdCalculateRecord/confirmPricing",
    method: "get",
    params: query
  })
}

/**批量确认定价 */
export function confirmPricingBatch(obj) {
  return request({
    url: "/product/prdCalculateRecord/confirmPricingBatch",
    method: "post",
    data: obj
  })
}

/**获取产品售后毛利测算详情 */
export function getPrdCalculateRecord(id) {
  return request({
    url: "/product/prdCalculateRecord/" + id,
    method: "get"
  })
}

/**获取测算规则 */
export function getPrdcalculaterule(query) {
  return request({
    url: "/product/prdcalculaterule/list",
    method: "get",
    params: query
  })
}

/**获取关联规则详情 */
export function getPrdCalculateRuleDetail(query) {
  return request({
    url: "/product/prdcalculaterule/getPrdCalculateRuleById",
    method: "get",
    params: query
  })
}

/**获取关联规则详情 */
export function matchRule(obj) {
  return request({
    url: "/product/prdCalculateRecord/matchRule",
    method: "post",
    data: obj
  })
}

/**批量测算 */
export function testGetPrdFinalCalculate(obj) {
  return request({
    url: "/product/prdcalculaterule/getPrdFinalCalculate",
    method: "post",
    data: obj
  })
}

/**测算导入 */
export function calculateHandelImport(obj) {
  return request({
    url: "/product/prdCalculateRecord/importExcelReturnList",
    method: "post",
    data: obj
  })
}

/**批量保存 */
export function batchSave(obj) {
  return request({
    url: "/product/prdCalculateRecord/batchSave",
    method: "post",
    data: obj
  })
}

// 产品测算毛利导出
export function exportData(obj) {
  return request({
    url: "/product/prdCalculateRecord/export",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 关联导出
export function exportPrdCalculateRuleEX(obj) {
  return request({
    url: "/product/prdCalculateRecord/exportPrdCalculateRuleEX",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 新增测算导入时错误excel下载
export function exportErrorExcel(obj) {
  return request({
    url: "/product/prdCalculateRecord/importExcelReturnList/exportError",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 获取最新定价
export function getSellingPriceBatch(obj) {
  return request({
    url: "/product/prdCalculateRecord/getSellingPriceBatch",
    method: "post",
    data: obj
  })
}

// 批量删除
export function removeByIds(obj) {
  return request({
    url: "/product/prdCalculateRecord/removeByIds",
    method: "post",
    data: obj
  })
}

// 批次号导出
export function exportPrdCalculateRuleByBatchIdEX(obj) {
  return request({
    url: "/product/prdCalculateRecord/exportPrdCalculateRuleByBatchIdEX",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 通过链接SKU查询链接SPU
export function getLinkSpuByLinkSkuApi(params) {
  return request({
    url: "/product/prdCalculateRecord/getLinkSpuByLinkSku/" + params,
    method: "get"
  })
}

// 通过链接SPU查询链接SKU列表
export function getLinkSkuListByLinkSpuApi(params) {
  return request({
    url: "/product/prdCalculateRecord/getLinkSkuListByLinkSpu/" + params,
    method: "get"
  })
}

// 指派链接sku
export function assignLinkSkuApi(obj) {
  return request({
    url: "/product/prdCalculateRecord/assignLinkSku",
    method: "post",
    data: obj
  })
}

// 绑定ASIN/id
export function assignAsinApi(obj) {
  return request({
    url: "/product/prdCalculateRecord/assignAsin",
    method: "post",
    data: obj
  })
}

// 导出测算记录明细
export function exportPrdCalculateRecordDetailApi(obj) {
  return request({
    url: "/product/prdCalculateRecord/batchExport/detail",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// 导出测算列表明细
export function exportPrdCalculateRecordListApi(obj) {
  return request({
    url: "/product/prdCalculateRecord/batchExport/column",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// tab统计
export function getCalcRecordsStatusApi() {
  return request({
    url: "/product/prdCalculateRecord/calcRecordsState",
    method: "get"
  })
}

// 失效、审核
export function getPrdCalculateRecordInvalidApi(data) {
  return request({
    url: "/product/prdCalculateRecord/UpdateCalculateRecordState",
    method: "put",
    data
  })
}

// 下载模版
export function downloadTemplateCalculateApi(data) {
  return request({
    url: "/product/prdCalculateRecord/downloadTemplate/record",
    method: "post",
    responseType: "blob",
    data
  })
}
