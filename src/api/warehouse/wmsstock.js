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
    url: "/warehouse/wmsstock/page",
    method: "get",
    params: query
  })
}

export function fetchListPost(obj) {
  return request({
    url: "/warehouse/wmsstock/pagePost",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/warehouse/wmsstock",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/warehouse/wmsstock/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/warehouse/wmsstock/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/warehouse/wmsstock",
    method: "put",
    data: obj
  })
}

export function getBsePlatformSkuWmsStockPage(query) {
  return request({
    url: "/warehouse/wmsstock/bsePlatformSku/page",
    method: "get",
    params: query
  })
}
export function showStockRecord(query) {
  return request({
    url: "/warehouse/wmsstock/showStockRecord",
    method: "post",
    params: query
  })
}
export function showStockRecordV2(obj) {
  return request({
    url: "/warehouse/wmsstock/showStockRecordV2",
    method: "post",
    data: obj
  })
}
export function showBatch(query) {
  return request({
    url: "/warehouse/wmsstock/showBatch",
    method: "get",
    params: query
  })
}
export function showOccupy(query) {
  return request({
    url: "/warehouse/wmsstock/showOccupy",
    method: "get",
    params: query
  })
}

export function getProductList(query) {
  return request({
    url: "/warehouse/wmsstock/page",
    method: "get",
    params: query
  })
}

export function listAllRecordType(obj) {
  return request({
    url: "/warehouse/wmsstock/listAllRecordType",
    method: "post",
    data: obj
  })
}

export function exportStockRecord(obj) {
  return request({
    url: "/warehouse/wmsstock/exportStockRecord",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

// 根据仓库法人主体skuIds站点获取库存数据
export function getWmsStockByPramsApi(obj) {
  return request({
    url: "/warehouse/wmsstock/getWmsStockByPrams",
    method: "post",
    data: obj
  })
}
