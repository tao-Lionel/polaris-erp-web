"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.fetchList = fetchList
exports.getInitData = getInitData
exports.getMaxRequestAccount = getMaxRequestAccount
exports.getPurchaseRecord = getPurchaseRecord
exports.saveData = saveData
exports.submitData = submitData
exports.deleteBatch = deleteBatch
exports.submitDataBatch = submitDataBatch
exports.cancelSubmitBatch = cancelSubmitBatch
exports.purchaseVerify = purchaseVerify
exports.getAccountDetailInfo = getAccountDetailInfo
exports.financeVerify = financeVerify
exports.printDocInfo = printDocInfo
exports.exportRequestData = exportRequestData
exports.getInitFinalData = getInitFinalData
exports.getInitPreData = getInitPreData
exports.updateExpertTime = updateExpertTime

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
    url: "/finance/porequestaccount/pagePost",
    method: "post",
    data: obj
  })
}

function getInitData(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/getInitData",
    method: "get",
    params: params
  })
}

function getMaxRequestAccount(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/getMaxRequestAccount",
    method: "get",
    params: params
  })
}

function getPurchaseRecord(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/getPurchaseRecord",
    method: "get",
    params: params
  })
}

function saveData(data) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/saveData",
    method: "post",
    data: data
  })
}

function submitData(data) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/submitData",
    method: "post",
    data: data
  })
} //   列表删除

function deleteBatch(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/deleteBatch",
    method: "delete",
    params: params
  })
} //   提交

function submitDataBatch(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/submitDataBatch",
    method: "put",
    params: params
  })
} //   撤销提交

function cancelSubmitBatch(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/cancelSubmitBatch",
    method: "put",
    params: params
  })
} //   采购审核

function purchaseVerify(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/purchaseVerify",
    method: "put",
    params: params
  })
}

function getAccountDetailInfo(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/getAccountDetailInfo",
    method: "get",
    params: params
  })
} //   财务审核

function financeVerify(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/financeVerify",
    method: "put",
    params: params
  })
} //打印

function printDocInfo(params) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/printDocInfo",
    method: "get",
    params: params
  })
}

function exportRequestData(obj) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/exportPoRequestAccount",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

function getInitFinalData(query) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/getInitFinalData",
    method: "get",
    params: query
  })
}

function getInitPreData(query) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccountdetail/getInitPreData",
    method: "get",
    params: query
  })
} ///porequestaccount/updateExpertTime

function updateExpertTime(obj) {
  return (0, _axios["default"])({
    url: "/finance/porequestaccount/updateExpertTime",
    method: "post",
    data: obj
  })
}
