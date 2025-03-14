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
    url: "/supplier/posupplieraccounthistory/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/supplier/posupplieraccounthistory",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/supplier/posupplieraccounthistory/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/supplier/posupplieraccounthistory/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/supplier/posupplieraccounthistory",
    method: "put",
    data: obj
  })
}

export function getObjMaxBySupplierNo(supplierNo) {
  return request({
    url: "/supplier/posupplieraccounthistory/getMaxBySupplierNo/" + supplierNo,
    method: "get"
  })
}

export function getHistoryList(supplierNo, supplierAccountType) {
  return request({
    url: "/supplier/posupplieraccounthistory/getHistoryList/" + supplierNo + "/" + supplierAccountType,
    method: "get"
  })
}

export function submitObj(obj) {
  return request({
    url: "/supplier/posupplieraccounthistory/submit",
    method: "post",
    data: obj
  })
}

export function withdrawObj(id) {
  return request({
    url: "/supplier/posupplieraccounthistory/withdraw/" + id,
    method: "get"
  })
}

export function auditObj(params) {
  return request({
    url: "/supplier/posupplieraccounthistory/audit",
    method: "post",
    params: params
  })
}

export function uploadImage(obj) {
  return request({
    url: "/supplier/posupplieraccounthistory/loadImage",
    method: "post",
    data: obj
  })
}
