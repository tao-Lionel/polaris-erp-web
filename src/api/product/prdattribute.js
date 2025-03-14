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
    url: "/product/prdattribute/page",
    method: "get",
    params: query
  })
}

export function fetchAttrAll() {
  return request({
    url: "/product/prdattribute/getAll",
    method: "get"
  })
}

export function fetchListAttr(query) {
  return request({
    url: "/product/prdattribute/page",
    method: "get",
    params: query
  })
}

export function fetchListAttrById(query) {
  return request({
    url: "/product/prdattribute/pageById",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/product/prdattribute",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/product/prdattribute/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/product/prdattribute/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/product/prdattribute",
    method: "put",
    data: obj
  })
}

export function addAttAndVal(obj) {
  return request({
    url: "/product/prdattribute/addAttAndVal",
    method: "post",
    data: obj
  })
}

export function updateAttAndVal(obj) {
  return request({
    url: "/product/prdattribute/updateAttAndVal",
    method: "post",
    data: obj
  })
}

export function delAttrVal(ids) {
  return request({
    url: "/product/prdattribute/delAttrVal/" + ids,
    method: "delete"
  })
}

export function sortAttAndVal(obj) {
  return request({
    url: "/product/prdattribute/sortAttAndVal",
    method: "post",
    data: obj
  })
}

export function getAttributeByCategoryId(query) {
  return request({
    url: "/product/prdattribute/getAttributeByCategoryId",
    method: "get",
    params: query
  })
}
