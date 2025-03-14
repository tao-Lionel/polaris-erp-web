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
    url: "/transfer/tmstransfer/page",
    method: "get",
    params: query
  })
}

export function addObj(obj, isSubmit) {
  return request({
    url: "/transfer/tmstransfer?isSubmit=" + isSubmit,
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/transfer/tmstransfer/" + id,
    method: "get"
  })
}

export function delObj(params, transferType) {
  return request({
    url: "/transfer/tmstransfer/del?transferType=" + transferType,
    method: "post",
    data: params
  })
}

export function submitObj(params, transferType) {
  return request({
    url: "/transfer/tmstransfer/submit?transferType=" + transferType,
    method: "post",
    data: params
  })
}

export function saleAuditObj(params, transferType, isAgree) {
  return request({
    url: "/transfer/tmstransfer/saleAudit?transferType=" + transferType + "&isAgree=" + isAgree,
    method: "post",
    data: params
  })
}

export function auditObj(
  params,
  transferType,
  isAgree,
  transportCarrierId,
  transportModeId,
  transportCabinetTypeId,
  declareType
) {
  return request({
    url:
      "/transfer/tmstransfer/audit?transferType=" +
      transferType +
      "&isAgree=" +
      isAgree +
      "&transportCarrierId=" +
      transportCarrierId +
      "&transportModeId=" +
      transportModeId +
      "&transportCabinetTypeId=" +
      transportCabinetTypeId +
      "&declareType=" +
      declareType,
    method: "post",
    data: params
  })
}

export function stockoutObj(params, transferType, isAgree) {
  return request({
    url: "/transfer/tmstransfer/stockout?transferType=" + transferType + "&isAgree=" + isAgree,
    method: "post",
    data: params
  })
}

export function confirmArrivalObj(params, transferType) {
  return request({
    url: "/transfer/tmstransfer/confirmArrival?transferType=" + transferType,
    method: "post",
    data: params
  })
}

export function forceFinishObj(params, transferType) {
  return request({
    url: "/transfer/tmstransfer/forceFinish?transferType=" + transferType,
    method: "post",
    data: params
  })
}

export function putObj(obj) {
  return request({
    url: "/transfer/tmstransfer",
    method: "put",
    data: obj
  })
}

export function uploadFile(obj) {
  return request({
    url: "/transfer/tmstransfer/uploadFile",
    method: "post",
    data: obj
  })
}

export function importLogisticsNo(obj) {
  return request({
    url: "/transfer/tmstransfer/import/logisticsNo",
    method: "post",
    data: obj
  })
}

export function confirmBatchArrival(obj) {
  return request({
    url: "/transfer/tmstransfer/confirmBatchArrival",
    method: "post",
    params: obj
  })
}

export function updateLogisticsProvider(obj) {
  return request({
    url: "/transfer/tmstransfer/updateLogisticsProvider",
    method: "post",
    params: obj
  })
}

export function updateTransportMode(obj) {
  return request({
    url: "/transfer/tmstransfer/updateTransportMode",
    method: "post",
    params: obj
  })
}

export function cancelDeclare(obj) {
  return request({
    url: "/transfer/tmstransfer/cancelDeclare",
    method: "post",
    params: obj
  })
}

export function createDeclare(obj) {
  return request({
    url: "/transfer/tmstransfer/createDeclare",
    method: "post",
    params: obj
  })
}
