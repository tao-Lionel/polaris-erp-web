"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.getInfoByPurchaseOrderNo = getInfoByPurchaseOrderNo
exports.getPriceAndRateByPurchaseOrderNo = getPriceAndRateByPurchaseOrderNo
exports.saveOrSubmit = saveOrSubmit

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
function getInfoByPurchaseOrderNo(query) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/getInfoByPurchaseOrderNo/" + query,
    method: "get"
  })
}

function getPriceAndRateByPurchaseOrderNo(query) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/getPriceAndRateByPurchaseOrderNo",
    method: "get",
    params: query
  })
}

function saveOrSubmit(data) {
  return (0, _axios["default"])({
    url: "/purchase/poorderdetail/saveOrSubmit",
    method: "put",
    data: data
  })
}
