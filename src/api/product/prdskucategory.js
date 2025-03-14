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
 * Author: wangxiaowen (AukeyIT@aukeys.com)
 */

//产品分类

import request from "../../router/axios"

export function fetchList(query) {
  return request({
    url: "/product/prdskucategory/page",
    method: "get",
    params: query
  })
}

export function fetchTreeList(query) {
  return request({
    url: "/product/prdskucategory/tree",
    method: "get",
    params: query
  })
}

export function fetchTreeListByPid(pid) {
  return request({
    url: "/product/prdskucategory/pid/" + pid,
    method: "get"
  })
}

export function addObj(obj) {
  return request({
    url: "/product/prdskucategory",
    method: "post",
    data: obj
  })
}

export function addRootNode(obj) {
  return request({
    url: "/product/prdskucategory/addRootNode",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/product/prdskucategory/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/product/prdskucategory/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/product/prdskucategory",
    method: "put",
    data: obj
  })
}

export function getDetail(query) {
  return request({
    url: "/product/prdskucategory/detail",
    method: "post",
    data: query
  })
}

/**校验当前品类是否被spu关联，关联不可新增 */
export function checkCategoryNoRelation(categoryId) {
  return request({
    url: "/product/prdskucategory/checkCategoryNoRelation/" + categoryId,
    method: "get"
  })
}
