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

/**退税预审管理接口 */
export function fetchList(query) {
  return request({
    url: "/finance/financetaxrefundmanage/page",
    method: "get",
    params: query
  })
}

export function handleAuditSave(obj) {
  return request({
    url: "/finance/financetaxrefundmanage/handleAuditSave",
    method: "post",
    data: obj
  })
}

/**根据报关单号和项号获取报关采购信息 */
export function getDeclareCustomInfo(obj) {
  return request({
    url: "/finance/financetaxrefundmanage/getDeclareCustomInfo",
    method: "get",
    params: obj
  })
}

/**根据报关单号和项号获取发票信息 */
export function getInvoiceInfo(obj) {
  return request({
    url: "/finance/financetaxrefundmanage/getInvoiceInfo",
    method: "get",
    params: obj
  })
}

export function exportTaxRefund(obj) {
  return request({
    url: "/finance/financetaxrefundmanage/exportTaxRefund",
    method: "get",
    params: obj
  })
}

/*****************退税管理相关接口 ******************/

//查询退税信息
export function fetchDrawbackList(query) {
  return request({
    url: "/finance/financetaxrefundmanage/drawback/page",
    method: "get",
    params: query
  })
}
// 根据报关单号查询关单关联信息
export function getDeclareInfo(query) {
  return request({
    url: "/finance/financetaxrefundmanage/getDeclareInfo",
    method: "get",
    params: query
  })
}

export function exportDrawback(obj) {
  return request({
    url: "/finance/financetaxrefundmanage/exportDrawback",
    method: "get",
    params: obj
  })
}
