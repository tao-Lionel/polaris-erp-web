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
// 详情页
import request from "@/router/axios"

export function getPoChangList(query) {
  //根据采购单查询数据信息
  return request({
    url: "/purchase/poorderchange/getOrderInfo",
    method: "get",
    params: query
  })
}

export function saveDataPurchaseChangeOrderApi(query) {
  //页面数据保存
  return request({
    url: "/purchase/poorderchange/saveData",
    method: "post",
    data: query
  })
}

export function postSubmitPochange(query) {
  //变更单提交
  return request({
    url: "/purchase/poorderchange/submitData",
    method: "post",
    data: query
  })
}

export function getChangeDetail(id) {
  //获取变更详情
  return request({
    url: "/purchase/poorderchange/" + id,
    method: "get"
    // data: query
  })
}

// 根据供应商+sku+价格模式得到价格
export function getPurchaseChangeOrderSkuPriceApi(data) {
  //获取变更详情
  return request({
    url: "/purchase/posupplierskuprice/getPriceByParams",
    method: "post",
    data
  })
}

// 历史价格
export function getPurchaseChangeOrderSkuPriceHistoryApi(data) {
  //获取变更详情
  return request({
    url: "/purchase/posupplierskupricehistory/getPriceByParams",
    method: "post",
    data
  })
}

// 根据供应商+sku+价格模式得到 有效期内的最新价格
export function getPurchaseChangeOrderSkuValidPriceApi(data) {
  //获取变更详情
  return request({
    url: "/purchase/posupplierskuprice/getValidPriceByParams",
    method: "post",
    data
  })
}
