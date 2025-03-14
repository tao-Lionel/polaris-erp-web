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
    url: "/purchase/pocontract/getPoContractPage",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/pocontract",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/pocontract/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/pocontract/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/pocontract",
    method: "put",
    data: obj
  })
}

export function delRows(obj) {
  return request({
    url: "/purchase/pocontract/delRows",
    method: "delete",
    data: obj
  })
}
export function changStatus(obj, status) {
  return request({
    url: "/purchase/pocontract/changStatus/" + status,
    method: "put",
    data: obj
  })
}
export function uploadFile(obj) {
  return request({
    url: "/purchase/pocontract/uploadFile",
    method: "post",
    data: obj
  })
}
export function showPic(obj) {
  return request({
    url: "/purchase/pocontract/showPic",
    method: "get",
    params: obj
  })
}

export function getApproveData(contractNo) {
  return request({
    url: "/purchase/pocontract/getApproveData/" + contractNo,
    method: "get"
  })
}
export function financialOperate(obj) {
  return request({
    url: "/purchase/pocontract/financialOperate",
    method: "put",
    data: obj
  })
}
export function getSettleaccountTypeOptions() {
  return request({
    url: "/purchase/posettleaccounttype/getAll",
    method: "get"
  })
}
export function getPurchaseOrderNos(poContractNo) {
  return request({
    url: "/purchase/pocontract/getPurchaseOrderNos/" + poContractNo,
    method: "get"
  })
}
export function getContractPicInfo(obj) {
  return request({
    url: "/purchase/pocontract/getContractPicInfo",
    method: "get",
    params: obj
  })
}

export function showInAndOutStockInfo(obj) {
  return request({
    url: "/purchase/pocontract/getContractInAndOutStockInfo",
    method: "get",
    params: obj
  })
}

export function updateContractUrl(obj) {
  return request({
    url: "/purchase/pocontract/updateContractUrl",
    method: "post",
    data: obj
  })
}

export function financialOperateBatch(obj) {
  return request({
    url: "/purchase/pocontract/financialOperateBatch",
    method: "post",
    data: obj
  })
}

// 批量上传合同文件
export function batchPurchaseContractUploadApi(data) {
  return request({
    url: "/purchase/pocontract/batchUpload",
    method: "post",
    data
  })
}

export function batchPurchaseContractRefreshApi(params) {
  return request({
    url: "/purchase/attachUpload/log",
    method: "get",
    params
  })
}

// 财务审核
export function batchFinancialOperateV2Api(obj) {
  return request({
    url: "/purchase/pocontract/v2/financialOperate",
    method: "post",
    data: obj
  })
}
