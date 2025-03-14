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

export function fetchList(params) {
  return request({
    url: "/purchase/porequisitonrevoke/page",
    method: "get",
    params: params
  })
}

export function deleteData(params) {
  return request({
    url: "/purchase/porequisitonrevoke/deleteData",
    method: "delete",
    params: params
  })
}

export function submitNoDataChange(params) {
  return request({
    url: "/purchase/porequisitonrevoke/submitNoDataChange",
    method: "put",
    params: params
  })
}

export function purchaseVerify(params) {
  return request({
    url: "/purchase/porequisitonrevoke/purchaseVerify",
    method: "put",
    params: params
  })
}

export function getCreateInitData(params) {
  return request({
    url: "/purchase/porequisitonrevoke/getCreateInitData",
    method: "get",
    params: params
  })
}

export function saveData(query) {
  return request({
    url: "/purchase/porequisitonrevoke/saveData",
    method: "post",
    data: query
  })
}

export function submitData(query) {
  return request({
    url: "/purchase/porequisitonrevoke/submitData",
    method: "post",
    data: query
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/porequisitonrevoke/" + id,
    method: "get"
  })
}
