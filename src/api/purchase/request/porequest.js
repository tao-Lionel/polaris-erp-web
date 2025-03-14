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

export function fetchList(obj) {
  return request({
    url: "/finance/porequestaccount/pagePost",
    method: "post",
    data: obj
  })
}

export function getInitData(params) {
  return request({
    url: "/finance/porequestaccountdetail/getInitData",
    method: "get",
    params: params
  })
}
export function getMaxRequestAccount(params) {
  return request({
    url: "/finance/porequestaccountdetail/getMaxRequestAccount",
    method: "get",
    params: params
  })
}

export function getPurchaseRecord(params) {
  return request({
    url: "/finance/porequestaccountdetail/getPurchaseRecord",
    method: "get",
    params: params
  })
}

export function saveData(data) {
  return request({
    url: "/finance/porequestaccountdetail/saveData",
    method: "post",
    data: data
  })
}

export function submitData(data) {
  return request({
    url: "/finance/porequestaccountdetail/submitData",
    method: "post",
    data: data
  })
}

//   列表删除
export function deleteBatch(params) {
  return request({
    url: "/finance/porequestaccount/deleteBatch",
    method: "delete",
    params: params
  })
}
//   提交
export function submitDataBatch(params) {
  return request({
    url: "/finance/porequestaccount/submitDataBatch",
    method: "put",
    params: params
  })
}
//   撤销提交
export function cancelSubmitBatch(params) {
  return request({
    url: "/finance/porequestaccount/cancelSubmitBatch",
    method: "put",
    params: params
  })
}
//   采购审核
export function purchaseVerify(params) {
  return request({
    url: "/finance/porequestaccount/purchaseVerify",
    method: "put",
    params: params
  })
}

export function getAccountDetailInfo(params) {
  return request({
    url: "/finance/porequestaccount/getAccountDetailInfo",
    method: "get",
    params: params
  })
}
//   财务审核
export function financeVerify(params) {
  return request({
    url: "/finance/porequestaccount/financeVerify",
    method: "put",
    params: params
  })
}

//打印
export function printDocInfo(params) {
  return request({
    url: "/finance/porequestaccount/printDocInfo",
    method: "get",
    params: params
  })
}

export function exportRequestData(obj) {
  return request({
    url: "/finance/porequestaccount/exportPoRequestAccount",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function getInitFinalData(query) {
  return request({
    url: "/finance/porequestaccountdetail/getInitFinalData",
    method: "get",
    params: query
  })
}

export function getInitPreData(query) {
  return request({
    url: "/finance/porequestaccountdetail/getInitPreData",
    method: "get",
    params: query
  })
}

///porequestaccount/updateExpertTime
export function updateExpertTime(obj) {
  return request({
    url: "/finance/porequestaccount/updateExpertTime",
    method: "post",
    data: obj
  })
}
