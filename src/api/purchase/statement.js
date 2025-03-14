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
    url: "/finance/internalSupplierStatement/queryPage",
    method: "post",
    data: obj
  })
}

export function deleteStatement(data) {
  return request({
    url: "/finance/internalSupplierStatement/deleteStatement",
    method: "post",
    data
  })
}

export function changeStatementStatus(data) {
  return request({
    url: "/finance/internalSupplierStatement/changeStatementStatus",
    method: "post",
    data
  })
}

export function getStatementInfo(query) {
  return request({
    url: "/finance/internalSupplierStatement/getStatementInfo",
    method: "get",
    params: query
  })
}

export function uploadReplyDocument(query) {
  return request({
    url: "/finance/internalSupplierStatement/uploadReplyDocument",
    method: "get",
    params: query
  })
}
