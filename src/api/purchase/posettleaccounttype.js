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
    url: "/purchase/posettleaccounttype/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/posettleaccounttype",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/posettleaccounttype/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/posettleaccounttype/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/posettleaccounttype",
    method: "put",
    data: obj
  })
}

export function delBatchObj(obj) {
  return request({
    url: "/purchase/posettleaccounttype",
    method: "delete",
    params: obj
  })
}

export function modifyStateByIds(obj) {
  return request({
    url: "/purchase/posettleaccounttype/modifyStateByIds",
    method: "put",
    params: obj
  })
}

export function getAllPosettleaccount(obj) {
  return request({
    url: "/purchase/posettleaccounttype/getAll",
    method: "get",
    params: obj
  })
}

export function checkUsedByPurchaseOrder(param) {
  return request({
    url: "/purchase/posettleaccounttype/checkUsedByPurchaseOrder",
    method: "get",
    params: param
  })
}

export function getSettleaccountTypeByName(params) {
  return request({
    url: "/purchase/posettleaccounttype/getSettleaccountTypeByName",
    method: "get",
    params: params
  })
}
