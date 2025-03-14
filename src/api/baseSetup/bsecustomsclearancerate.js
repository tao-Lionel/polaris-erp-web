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
    url: "/baseSetup/bsecustomsclearancerate/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate",
    method: "put",
    data: obj
  })
}

export function handleAudit(obj) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate/audit",
    method: "put",
    data: obj
  })
}

export function removeBatch(obj) {
  return request({
    url: "/baseSetup/bsecustomsclearancerate/removeBatch",
    method: "delete",
    data: obj
  })
}
