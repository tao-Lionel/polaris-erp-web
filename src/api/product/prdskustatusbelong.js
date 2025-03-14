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
    url: "/product/prdskustatusbelong/page",
    method: "get",
    params: query
  })
}

export function checkoutSaleGroup(obj, type) {
  return request({
    url: "/product/prdskustatusbelong/checkoutSaleGroup/" + type,
    method: "put",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/product/prdskustatusbelong",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/product/prdskustatusbelong/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/product/prdskustatusbelong/" + id,
    method: "delete"
  })
}
/**
 *
 * @param {*} obj 参数对象
 * @param {*} type 按钮类型 0:设置状态 1:切换维护人
 */
export function putObj(obj, type) {
  return request({
    url: "/product/prdskustatusbelong/" + type,
    method: "put",
    data: obj
  })
}

export function checkName(name, obj) {
  return request({
    url: "/product/prdskustatusbelong/getNameList/" + name,
    method: "get",
    params: obj
  })
}

export function getGroupUsers(obj) {
  return request({
    url: "/product/prdskustatusbelong/getGroupUsers",
    params: obj,
    method: "get"
  })
}

/**采购允许、禁用 */
export function purchaseState(param, state) {
  return request({
    url: "/product/prdskustatusbelong/purchaseState/" + state,
    data: param,
    method: "post"
  })
}

export function getUserInfoByGroupId(groupId) {
  return request({
    url: "/product/prdskustatusbelong/getUserInfoByGroupId/" + groupId,
    method: "get"
  })
}

export function changeDevelops(data) {
  return request({
    url: "/product/prdskustatusbelong/changeDevelops",
    data: data,
    method: "post"
  })
}

export function changeBuyers(data) {
  return request({
    url: "/product/prdskustatusbelong/changeBuyers",
    data: data,
    method: "post"
  })
}

export function getPurchaseMainMsg(obj) {
  return request({
    url: "/product/prdskustatusbelong/showPurchaserWithSaleSit",
    data: obj,
    method: "post"
  })
}
export function savePurchaseMain(obj) {
  return request({
    url: "/product/prdskustatusbelong/savePurchaserWithSaleSit",
    data: obj,
    method: "post"
  })
}

export function handleImport(obj) {
  return request({
    url: "/product/prdskustatusbelong/handImport",
    data: obj,
    method: "post"
  })
}

export function exportErrorExcel(obj) {
  return request({
    url: "/product/prdskustatusbelong/downloadErrorFile",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
