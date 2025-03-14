/*
 *    Copyright (c) 2018-2025, aukeyit All rights reserved.
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
 * Author: aukeyit (aukeyit@aukeyit.com)
 */

import request from "@/router/axios"

export function fetchList(query) {
  return request({
    url: "/admin/user/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/admin/user",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/admin/user",
    method: "put",
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: "/admin/user/details/" + obj,
    method: "get"
  })
}

export function getPassCode() {
  return request({
    url: "/admin/user/getPassCode/",
    method: "get"
  })
}

export function editFlagLock(obj) {
  return request({
    url: "/admin/user/editFlagLock",
    method: "put",
    params: obj
  })
}

export function getFunctionRole(id) {
  return request({
    url: "/admin/user/getFunctionRole/" + id,
    method: "get"
  })
}

export function assignRole2User(param) {
  return request({
    url: "/admin/user/assignRole2User",
    method: "put",
    params: param
  })
}

export function assignRoleData2User(param) {
  return request({
    url: "/admin/user/assignRoleData2User",
    method: "put",
    params: param
  })
}

export function passwordInit(param) {
  return request({
    url: "/admin/user/passwordInit",
    method: "put",
    params: param
  })
}

export function getMemberAllByGroupId(params) {
  return request({
    url: "/admin/user/getMemberAllByGroupId",
    method: "get",
    params: params
  })
}

export function getSkuCatagorysByUserId(param) {
  return request({
    url: "/admin/user/getSkuCatagorys/" + param,
    method: "get"
  })
}

export function getBrandsByUserId(param) {
  return request({
    url: "/admin/user/getBrands?userId=" + param,
    method: "get"
  })
}

export function getWarehousesByUserId(params) {
  return request({
    url: "/admin/user/getWarehouses",
    method: "get",
    params: params
  })
}

export function getStoresByUserId(params) {
  return request({
    url: "/admin/user/getBaseStores",
    method: "get",
    params: params
  })
}

// 密码初始化系统随机生成
export function passwordInitV2Api(param) {
  return request({
    url: "/admin/user/passwordInitV2",
    method: "put",
    params: param
  })
}

// 检查账号是否需要改密码
export function checkPasswordDeadLineApi(param) {
  return request({
    url: "/admin/user/checkPasswordDeadLine",
    method: "put",
    params: param
  })
}

// 根据用户名获取用户列表
export function getListByUserNameApi(data) {
  return request({
    url: "/admin/user/listByUserName",
    method: "post",
    data
  })
}
