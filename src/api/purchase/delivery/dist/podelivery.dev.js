"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.fetchList = fetchList
exports.addObj = addObj
exports.getObj = getObj
exports.delObj = delObj
exports.putObj = putObj
exports.delRows = delRows
exports.arrangeComfirm = arrangeComfirm
exports.showDetail = showDetail
exports.exportDeliveryData = exportDeliveryData

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
    url: "/purchase/podelivery/pagePost",
    method: "post",
    data: obj
  })
}

function addObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery",
    method: "post",
    data: obj
  })
}

function getObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/" + id,
    method: "get"
  })
}

function delObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/" + id,
    method: "delete"
  })
}

function putObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery",
    method: "put",
    data: obj
  })
}

function delRows(obj) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/delRows",
    method: "delete",
    data: obj
  })
}

function arrangeComfirm(selectRows, type) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/arrangeComfirm/" + type,
    method: "put",
    data: selectRows
  })
}

function showDetail(deliveryNo) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/showDetail/" + deliveryNo,
    method: "get"
  })
}

function exportDeliveryData(obj) {
  return (0, _axios["default"])({
    url: "/purchase/podelivery/exportPoDelivery",
    method: "post",
    responseType: "blob",
    data: obj
  })
}
