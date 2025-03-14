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
    url: "/purchase/poreturndetail/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/poreturndetail",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/poreturndetail/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/poreturndetail/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/poreturndetail",
    method: "put",
    data: obj
  })
}

export function getSkuListByQuery(query) {
  return request({
    url: "/purchase/poreturndetail/getSkuListByQuery",
    method: "get",
    params: query
  })
}

export function getDetailBySkuAndReturnNo(params) {
  return request({
    url: "/purchase/poreturndetail/getDetailBySkuAndReturnNo",
    method: "get",
    params: params
  })
}

export function showEditReturnData(params) {
  return request({
    url: "/purchase/poreturndetail/showEditReturnData",
    method: "get",
    params: params
  })
}

export function getReturnDetailByReturnNo(params) {
  return request({
    url: "/purchase/poreturndetail/getReturnDetailByReturnNo",
    method: "get",
    params: params
  })
}

export function saveData(params) {
  return request({
    url: "/purchase/poreturndetail/saveData",
    method: "post",
    data: params
  })
}

export function getReturnData(params) {
  return request({
    url: "/purchase/poreturndetail/getReturnData",
    method: "get",
    params: params
  })
}

export function submitData(params) {
  return request({
    url: "/purchase/poreturndetail/submitData",
    method: "post",
    data: params
  })
}

export function getPoOrderDetail(params) {
  return request({
    url: "/purchase/poorderdetail/getPoOrderDetail",
    method: "post",
    data: params
  })
}
