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
    url: "/purchase/poorderchange/page",
    method: "get",
    params: query
  })
}

export function delRows(query) {
  return request({
    url: "/purchase/poorderchange/removeData",
    method: "delete",
    params: query
  })
}
export function purchaseSubmit(query) {
  //提交审核
  return request({
    url: "/purchase/poorderchange/submit",
    method: "put",
    params: query
  })
}

export function purchaseCancelSubmit(query) {
  //提交审核
  return request({
    url: "/purchase/poorderchange/cancelSubmit",
    method: "put",
    params: query
  })
}

export function purchaseVerify(query) {
  //.变更审核
  return request({
    url: "/purchase/poorderchange/auditor",
    method: "put",
    params: query
  })
}

export function poReverseAuditor(obj) {
  return request({
    url: "/purchase/poorderchange/reverseAuditor",
    method: "put",
    params: obj
  })
}
