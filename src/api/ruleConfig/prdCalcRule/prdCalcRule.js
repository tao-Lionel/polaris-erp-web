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

export function fetchList(obj) {
  return request({
    url: "/product/prdcalculaterule/page",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/product/prdcalculaterule/add",
    method: "post",
    data: obj
  })
}

export function auditSubmit(obj) {
  return request({
    url: "/product/prdcalculaterule/handleAudit",
    method: "post",
    data: obj
  })
}

export function statusModifyEnbale(obj) {
  return request({
    url: "/product/prdcalculaterule/stateModifyEnbale",
    method: "post",
    data: obj
  })
}
export function statusModifyDisabale(obj) {
  return request({
    url: "/product/prdcalculaterule/stateModifyProhibit",
    method: "post",
    data: obj
  })
}

export function exportData(obj) {
  return request({
    url: "/product/prdcalculaterule/exportPrdCalculateRule",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/product/ruleConfig/prdCalcRule" + id,
    method: "get"
  })
}

export function delObj(obj) {
  return request({
    url: "/product/prdcalculaterule/remove",
    method: "post",
    data: obj
  })
}

export function updateObj(obj) {
  return request({
    url: "/product/prdcalculaterule/update",
    method: "post",
    data: obj
  })
}

export function exportDataById(obj) {
  return request({
    url: "/product/prdcalculaterule/exportPrdCalculateRuleByIds",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

// export function importRecord(obj) {
//   return request({
//     url: "/product/prdCalculateRecord/importRecord",
//     method: "post",
//     data: obj
//   })
// }

export function importRecord(obj) {
  return request({
    url: "/product/prdCalculateRecord/importCalcRecordData",
    method: "post",
    data: obj
  })
}
