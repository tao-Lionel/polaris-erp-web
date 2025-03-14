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
 * Author: wangxiaowen (AukeyIT@aukeys.com)
 */

import request from "@/router/axios"

export function fetchList(query) {
  return request({
    url: "/product/prdsku/page",
    method: "get",
    params: query
  })
}

export function getSkuStatus(query) {
  return request({
    url: "/product/prdsku/skuStatus",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/product/prdsku",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/product/prdsku/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/product/prdsku/" + id,
    method: "delete"
  })
}

export function updateObj(obj) {
  return request({
    url: "/product/prdsku/update",
    method: "post",
    data: obj
  })
}

export function getPrdSkuImageUrl(obj) {
  return request({
    url: "/product/prdsku/imgUrl",
    method: "get",
    params: { skuId: obj.skuId }
  })
}

export function getDetails(obj) {
  return request({
    url: "/product/prdsku/details/" + obj,
    method: "get"
  })
}

export function getByLikeSkuCode(params) {
  return request({
    url: "/product/prdsku/getByLikeSkuCode",
    method: "get",
    params: params
  })
}

/**根据SKU编码查询SKU基础信息(有品类权限、SKU状态为正常，在新品创建中审批完成的数据) */
export function getByLikeSkuCodeAndAuditOk(params) {
  return request({
    url: "/product/prdsku/getByLikeSkuCodeAndAuditOk",
    method: "get",
    params: params
  })
}

export function getByLikeSkuCodeAndAuditOkPage(params) {
  return request({
    url: "/product/prdsku/getByLikeSkuCodeAndAuditOkPage",
    method: "get",
    params: params
  })
}

/**根据SKU编码查询SKU基础信息(有品类权限、且在新品创建中审批完成的数据)  */
export function getByLikeSkuCodeAndCreateAuditComplete(params) {
  return request({
    url: "/product/prdsku/getByLikeSkuCodeAndCreateAuditComplete",
    method: "get",
    params: params
  })
}
