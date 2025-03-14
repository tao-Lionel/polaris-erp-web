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
    url: "/warehouse/transfercost/costListPage",
    method: "post",
    data: obj
  })
}

// export function addObj (obj) {
//   return request({
//     url: '/transfer/tmstransfercost',
//     method: 'post',
//     data: obj
//   })
// }

// export function getObj (id) {
//   return request({
//     url: '/transfer/tmstransfercost/' + id,
//     method: 'get'
//   })
// }

// export function delObj (id) {
//   return request({
//     url: '/transfer/tmstransfercost/' + id,
//     method: 'delete'
//   })
// }

// export function putObj (obj) {
//   return request({
//     url: '/transfer/tmstransfercost',
//     method: 'put',
//     data: obj
//   })
// }

// export function getCostTypeAll () {
//   return request({
//     url: '/transfer/tmstransfercost/getCostTypeAll',
//     method: 'get'
//   })
// }

// export function importObj (obj) {
//   return request({
//     url: '/transfer/tmstransfercost/import',
//     method: 'post',
//     data: obj
//   })
// }

// export function auditObj (params) {
//   return request({
//     url: '/transfer/tmstransfercost/audit',
//     method: 'post',
//     data: params
//   })
// }

export function exportData(obj) {
  return request({
    url: "/warehouse/transfercost/exportExcel",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function getCarriers() {
  return request({
    url: "/baseSetup/bsetransportcarrier/getAllCarriersV2",
    method: "get"
  })
}

export function lockCostShow(obj) {
  return request({
    url: "/warehouse/transfercost/lockCostShow",
    method: "post",
    data: obj
  })
}

export function lockCost(obj) {
  return request({
    url: "/warehouse/transfercost/lockCost",
    method: "post",
    data: obj
  })
}

export function handleAbnormal(obj) {
  return request({
    url: "/warehouse/transfercost/handleAbnormal",
    method: "post",
    data: obj
  })
}

export function getCheckBillInfo(obj) {
  return request({
    url: "/warehouse/transfercost/getCheckBillInfo",
    method: "post",
    data: obj
  })
}

export function saveCheckBill(obj) {
  return request({
    url: "/warehouse/transfercost/saveCheckBill",
    method: "post",
    data: obj
  })
}

export function batchImportDataPreview(obj) {
  return request({
    url: "/warehouse/transfercost/batchImportDataPreview",
    method: "post",
    data: obj
  })
}

export function batchImportData(obj) {
  return request({
    url: "/warehouse/transfercost/batchImportData",
    method: "post",
    data: obj
  })
}
