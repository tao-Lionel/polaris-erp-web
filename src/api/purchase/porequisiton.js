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
    url: "/purchase/porequisiton/page",
    method: "post",
    data: obj
  })
}

export function totalPage(obj) {
  return request({
    url: "/purchase/porequisiton/totalPage",
    method: "post",
    data: obj
  })
}

export function getPoRequisitonTotal(obj) {
  return request({
    url: "/purchase/porequisiton/getPoRequisitonTotal",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/porequisiton",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/porequisiton/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/porequisiton/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/porequisiton",
    method: "put",
    data: obj
  })
}

export function getGroupAllByParams(params) {
  return request({
    url: "/purchase/porequisiton/getGroupAllByParams",
    method: "get",
    params: params
  })
}

export function saveOne(params) {
  return request({
    url: "/purchase/porequisiton/saveOne",
    method: "post",
    data: params
  })
}

export function submitOne(params) {
  return request({
    url: "/purchase/porequisiton/submitOne",
    method: "post",
    data: params
  })
}

export function saveList(params) {
  return request({
    url: "/purchase/porequisiton/saveList",
    method: "post",
    data: params
  })
}

export function submitList(params) {
  return request({
    url: "/purchase/porequisiton/submitList",
    method: "post",
    data: params
  })
}

export function updateList(params, operateCode, remark) {
  return request({
    url: "/purchase/porequisiton/updateList?operateCode=" + operateCode + "&remark=" + remark,
    method: "post",
    data: params
  })
}

export function assignBuyer(params, purchaseUserId) {
  return request({
    url: "/purchase/porequisiton/assignBuyer?purchaseUserId=" + purchaseUserId,
    method: "post",
    data: params
  })
}

// export function createOrder(params) {
//   return request({
//     url: '/purchase/porequisiton/createOrder',
//     method: 'post',
//     data: params
//   })
// }

export function createOrder(params) {
  return request({
    url: "/purchase/poorder/createOrder",
    method: "post",
    data: params
  })
}

export function checkRevokeable(params) {
  return request({
    url: "/purchase/porequisiton/checkRevokeable",
    method: "get",
    params: params
  })
}

export function getPriceData(str) {
  return request({
    url: "/purchase/porequisiton/getPriceData?requisitionNo=" + str,
    method: "get"
  })
}

export function getStatusCounts() {
  return request({
    url: "/purchase/porequisiton/getStatusCounts",
    method: "get"
  })
}

export function getPoRequisitonSkuStockInfo(params) {
  return request({
    url: "/purchase/porequisiton/getPoRequisitonSkuStockInfo",
    method: "get",
    params: params
  })
}

export function importPreview(params) {
  return request({
    url: "/purchase/porequisiton/importPreview",
    method: "post",
    data: params
  })
}

export function getPrdSkuInfoBySkusNoInner(params) {
  return request({
    url: "/product/prdsku/getPrdSkuInfoBySkusNoInner",
    method: "post",
    data: params
  })
}

// 导出
export function exportData(obj) {
  return request({
    url: "/purchase/porequisiton/exportData",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function getCorporation(query) {
  return request({
    url: `/baseSetup/bsecorporation/getBySupplierNo?supplierNo=${query.supplierNo}`,
    method: "get"
  })
}

// 通过供应商编码查询价格模式
export function getModelBySupplierNoApi(query) {
  return request({
    url: `/purchase/posupplierskuprice/getModelBySupplierNo?supplierNo=${query}`,
    method: "get"
  })
}

// 保存请购单基本信息
export function savePurchaseBasicInfoApi(data) {
  return request({
    url: "/purchase/porequisiton/saveBasicInfo",
    method: "post",
    data
  })
}
