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

export function getCountryAll() {
  return request({
    url: "/baseSetup/bsecountry/getCountry",
    method: "get"
  })
}

export function fetchListCountry(query) {
  return request({
    url: "/baseSetup/bsecountry/page",
    method: "get",
    params: query
  })
}

export function addObjCountry(obj) {
  return request({
    url: "/baseSetup/bsecountry",
    method: "post",
    data: obj
  })
}

export function getObjCountry(id) {
  return request({
    url: "/baseSetup/bsecountry/" + id,
    method: "get"
  })
}

export function delObjCountry(id) {
  return request({
    url: "/baseSetup/bsecountry/" + id,
    method: "delete"
  })
}

export function putObjCountry(obj) {
  return request({
    url: "/baseSetup/bsecountry",
    method: "put",
    data: obj
  })
}

export function getCountry() {
  return request({
    url: "/baseSetup/bsecountry/getCountry",
    method: "get"
  })
}

//获取国家对应币种
export function getCountryByParamApi(data) {
  return request({
    url: "/baseSetup/bsecountry/getCountryByParam",
    method: "post",
    data
  })
}
