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
exports.changStatus = changStatus
exports.uploadFile = uploadFile
exports.showPic = showPic
exports.getApproveData = getApproveData
exports.financialOperate = financialOperate
exports.getSettleaccountTypeOptions = getSettleaccountTypeOptions
exports.getPurchaseOrderNos = getPurchaseOrderNos
exports.getContractPicInfo = getContractPicInfo
exports.showInAndOutStockInfo = showInAndOutStockInfo

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
    url: "/purchase/pocontract/getPoContractPage",
    method: "post",
    data: obj
  })
}

function addObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract",
    method: "post",
    data: obj
  })
}

function getObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/" + id,
    method: "get"
  })
}

function delObj(id) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/" + id,
    method: "delete"
  })
}

function putObj(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract",
    method: "put",
    data: obj
  })
}

function delRows(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/delRows",
    method: "delete",
    data: obj
  })
}

function changStatus(obj, status) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/changStatus/" + status,
    method: "put",
    data: obj
  })
}

function uploadFile(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/uploadFile",
    method: "post",
    data: obj
  })
}

function showPic(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/showPic",
    method: "get",
    params: obj
  })
}

function getApproveData(contractNo) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/getApproveData/" + contractNo,
    method: "get"
  })
}

function financialOperate(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/financialOperate",
    method: "put",
    data: obj
  })
}

function getSettleaccountTypeOptions() {
  return (0, _axios["default"])({
    url: "/purchase/posettleaccounttype/getAll",
    method: "get"
  })
}

function getPurchaseOrderNos(poContractNo) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/getPurchaseOrderNos/" + poContractNo,
    method: "get"
  })
}

function getContractPicInfo(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/getContractPicInfo",
    method: "get",
    params: obj
  })
}

function showInAndOutStockInfo(obj) {
  return (0, _axios["default"])({
    url: "/purchase/pocontract/getContractInAndOutStockInfo",
    method: "get",
    params: obj
  })
}
