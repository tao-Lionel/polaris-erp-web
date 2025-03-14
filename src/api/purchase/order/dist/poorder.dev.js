"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.fetchList = fetchList
exports.addObj = addObj
exports.getObj = getObj
exports.delObj = delObj
exports.putObj = putObj
exports.agree = agree
exports.reject = reject
exports.removeBatch = removeBatch
exports.createContract = createContract
exports.reverse = reverse
exports.showSkuInfo = showSkuInfo
exports.checkRequestAccountAble = checkRequestAccountAble
exports.showInboundInfo = showInboundInfo
exports.getPlayTypeAll = getPlayTypeAll
exports.getSit = getSit
exports.getNewPrice = getNewPrice
exports.getPoOrderDetailPage = getPoOrderDetailPage
exports.createDelivery = createDelivery
exports.saveOrSubmitNoDetail = saveOrSubmitNoDetail
exports.createContractBatch = createContractBatch
exports.exportPoOrderData = exportPoOrderData

var _axios = _interopRequireDefault(require("@/router/axios"))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

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
function fetchList(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/page",
    method: "post",
    data: obj
  })
}

function addObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder",
    method: "post",
    data: obj
  })
}

function getObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/" + id,
    method: "get"
  })
}

function delObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/" + id,
    method: "delete"
  })
}

function putObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder",
    method: "put",
    data: obj
  })
}

function agree(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/agree",
    method: "put",
    params: obj
  })
}

function reject(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/reject",
    method: "put",
    params: obj
  })
}

function removeBatch(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/removeBatch",
    method: "delete",
    params: obj
  })
}

function createContract(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/createContract",
    method: "post",
    params: obj
  })
}

function reverse(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/reverse",
    method: "put",
    params: obj
  })
}

function showSkuInfo(param) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/showSkuInfo",
    method: "get",
    params: param
  })
}

function checkRequestAccountAble(params) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/checkRequestAccountAble",
    method: "get",
    params: params
  })
}

function showInboundInfo(param) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/showInboundInfo",
    method: "get",
    params: param
  })
}

function getPlayTypeAll(query) {
  return (0, _axios["default"])({
    url: "/baseSetup/bseplatformtype/getAll",
    method: "get",
    params: query
  })
}

function getSit(obj) {
  return (0, _axios["default"])({
    url: "/baseSetup/bseplatformsit/getSitByPlatformTypeCodes",
    method: "post",
    data: obj
  })
} // export function createDelivery(obj){
//   return request({
//     url: '/purchase/poorder/createDelivery',
//     method: 'post',
//     data: obj
//   })
// }

function getNewPrice(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/getNewPrice",
    method: "post",
    data: obj
  })
}

function getPoOrderDetailPage(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/getPoOrderDetailPage",
    method: "post",
    data: obj
  })
}

function createDelivery(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/createDelivery",
    method: "post",
    data: obj
  })
}

function saveOrSubmitNoDetail(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/saveOrSubmitNoDetail",
    method: "post",
    data: obj
  })
}

function createContractBatch(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/createContractBatch",
    method: "post",
    data: obj
  })
}

function exportPoOrderData(obj) {
  return (0, _axios["default"])({
    url: "/purchase/poorder/exportPoOrder",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
