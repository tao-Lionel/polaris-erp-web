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

export function getPurchaseReconciliationAccountPage(query) {
  return request({
    url: "/finance/purchasereconciliation/accountpage",
    method: "get",
    params: query
  })
}

export function getPurchaseReconciliationQuantityPage(obj) {
  return request({
    url: "/finance/purchasereconciliation/quantitypage",
    method: "post",
    data: obj
  })
}

export function getPurchaseReconciliationQuantityPageV2(obj) {
  return request({
    url: "/finance/purchasereconciliation/quantitypageV2",
    method: "post",
    data: obj
  })
}

export function checkRequestAccount(obj) {
  return request({
    url: "/finance/porequestaccountdetail/checkRequestAccount",
    method: "post",
    data: obj
  })
}

export function saveDataV2(obj) {
  return request({
    url: "/finance/porequestaccountdetail/saveDataV2",
    method: "post",
    data: obj
  })
}

export function exportQuantityData(obj) {
  return request({
    url: "/finance/purchasereconciliation/exportQuantityData",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

export function saveDataAllQuery(obj) {
  return request({
    url: "/finance/purchasereconciliation/saveDataAllQuery",
    method: "post",
    data: obj
  })
}

export function createInvoice(obj) {
  return request({
    url: "/finance/finCommercialInvoice/createInvoice",
    method: "post",
    data: obj
  })
}

export function createStatement(obj) {
  return request({
    url: "/finance/internalSupplierStatement/createStatement",
    method: "post",
    data: obj
  })
}
