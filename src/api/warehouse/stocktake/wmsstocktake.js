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
    url: "/warehouse/wmsstocktake/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/warehouse/wmsstocktake",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/warehouse/wmsstocktake/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/warehouse/wmsstocktake/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/warehouse/wmsstocktake",
    method: "put",
    data: obj
  })
}
export function createStockTake(file) {
  return request({
    url: "/warehouse/wmsstocktake/createStockTake",
    method: "post",
    data: file
  })
}

//审核/wmsstocktake/confirm
export function confrim(obj) {
  return request({
    url: "/warehouse/wmsstocktake/confirm",
    method: "post",
    data: obj
  })
}
export function createOrder(obj) {
  return request({
    url: "/warehouse/wmsstocktake/createOrder",
    method: "post",
    data: obj
  })
}
export function showRelationNo(stockTakeNo) {
  return request({
    url: "/warehouse/wmsstocktake/showRelationNo/" + stockTakeNo,
    method: "get"
  })
}
export function showDetail(stockTakeNo) {
  return request({
    url: "/warehouse/wmsstocktake/showDetail/" + stockTakeNo,
    method: "get"
  })
}
export function delRows(obj) {
  return request({
    url: "/warehouse/wmsstocktake/delRows",
    method: "post",
    data: obj
  })
}

//提交待审核/wmsstocktake/toBeReviewed
export function toBeReviewed(obj) {
  return request({
    url: "/warehouse/wmsstocktake/toBeReviewed",
    method: "post",
    data: obj
  })
}
