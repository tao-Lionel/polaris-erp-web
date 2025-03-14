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
    url: "/baseSetup/bseskurelatemanage/page",
    method: "get",
    params: query
  })
}
export function fetchListV2(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/pageV2",
    method: "post",
    data: obj
  })
}

export function handleSaveOrUpdate(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/handleSaveOrUpdate",
    method: "post",
    data: obj
  })
}

export function stateModify(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/stateModify",
    method: "post",
    data: obj
  })
}

export function handleExport(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/handleExport",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function handleImport(obj) {
  return request({
    // url: '/baseSetup/bseskurelatemanage/handleImport',
    url: "/baseSetup/bseskurelatemanage/importDataByBseSkuRelateManage",
    method: "post",
    data: obj
  })
}

export function exportErrorExcel(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/importDataByBseSkuRelateManageExportError",
    method: "post",
    responseType: "blob",
    data: obj
  })
}

export function batchUpdatePriority(obj) {
  return request({
    url: "/baseSetup/bseskurelatemanage/batchUpdatePriority",
    method: "post",
    data: obj
  })
}
