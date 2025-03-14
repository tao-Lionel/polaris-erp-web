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

export function fetchList(query) {
  return request({
    url: "/finance/purchaseinvoice/page",
    method: "get",
    params: query
  })
}

export function query(query) {
  return request({
    url: "/finance/purchaseinvoice/query",
    method: "get",
    params: query
  })
}

/**录入发票保存 */
export function entryInvoiceSave(obj) {
  return request({
    url: "/finance/purchaseinvoice/entryInvoiceSave",
    method: "post",
    data: obj
  })
}

/**查询发票详情，根据采购单号 sku 单价 */
export function getInvoiceDetailByPurnoAndSkuAndPrice(param) {
  return request({
    url: "/finance/purchaseinvoice/getInvoiceDetailByPurnoAndSkuAndPrice",
    method: "get",
    params: param
  })
}

/**根据id删除发票详情 */
export function delInvoiceDetail(id) {
  return request({
    url: "/finance/purchaseinvoice/delInvoiceDetail/" + id,
    method: "delete"
  })
}

/**查询报关详情，根据采购单号 sku 单价 */
export function getOutQuantityShowByPurnoAndSkuAndPrice(param) {
  return request({
    url: "/finance/purchaseinvoice/getOutQuantityShowByPurnoAndSkuAndPrice",
    method: "get",
    params: param
  })
}

/**根据发票id查询信息 */
export function getOutQuantityShowByInvoiceId(id) {
  return request({
    url: "/finance/purchaseinvoice/getOutQuantityShowByInvoiceId/" + id,
    method: "get"
  })
}
