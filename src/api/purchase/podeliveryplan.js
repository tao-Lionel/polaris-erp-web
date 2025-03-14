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
    url: "/purchase/podeliveryplan/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/podeliveryplan",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/podeliveryplan/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/podeliveryplan/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/podeliveryplan",
    method: "put",
    data: obj
  })
}

export function getCreateDeliveryPlanPage(params) {
  return request({
    url: "/purchase/podeliveryplan/getCreateDeliveryPlanPage",
    method: "get",
    params: params
  })
}

export function getDeliveryPlanInfo(param) {
  return request({
    url: "/purchase/podeliveryplan/getDeliveryPlanInfo/" + param,
    method: "get"
  })
}

export function savePoDeliveryPlan(obj) {
  return request({
    url: "/purchase/podeliveryplan/savePoDeliveryPlan",
    method: "post",
    data: obj
  })
}

export function submitPoDeliveryPlan(obj) {
  return request({
    url: "/purchase/podeliveryplan/submitPoDeliveryPlan",
    method: "post",
    data: obj
  })
}

export function deletePoDeliveryPlan(param) {
  return request({
    url: "/purchase/podeliveryplan/deletePoDeliveryPlan/" + param,
    method: "delete"
  })
}

export function changeStatus(params) {
  return request({
    url: "/purchase/podeliveryplan/changeStatus",
    method: "put",
    params: params
  })
}

export function insertRemarks(params) {
  return request({
    url: "/purchase/podeliveryplan/insertRemarks",
    method: "post",
    params: params
  })
}

export function getRemarks(param) {
  return request({
    url: "/purchase/podeliveryplan/getRemarks/" + param,
    method: "get"
  })
}

export function getDeliveryDetail(param) {
  return request({
    url: "/purchase/podeliveryplan/getDeliveryDetail",
    method: "get",
    params: param
  })
}

export function updateDeliveryStateEndForce(obj) {
  return request({
    url: "/purchase/podeliveryplan/updateDeliveryStateEndForce",
    method: "put",
    params: obj
  })
}

export function getUserSaleGroup(param) {
  return request({
    url: "/purchase/podeliveryplan/getUserSaleGroup",
    method: "get",
    params: param
  })
}
