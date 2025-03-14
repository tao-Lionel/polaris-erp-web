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
    url: "/purchase/poinquiryorder/page",
    method: "get",
    params: query
  })
}

export function submitAudit(query) {
  return request({
    url: "/purchase/poinquiryorder/submitAudit",
    method: "post",
    params: query
  })
}

export function saveObj(obj) {
  return request({
    url: "/purchase/poinquiryorder",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/poinquiryorder/" + id,
    method: "get"
  })
}

export function delObj(orderNo) {
  return request({
    url: "/purchase/poinquiryorder/batchDel/" + orderNo,
    method: "delete"
  })
}

export function cancelSubmit(obj) {
  return request({
    url: "/purchase/poinquiryorder/cancelSubmit",
    method: "post",
    data: obj
  })
}

export function uploadDesignFile(obj) {
  return request({
    url: "/purchase/poinquiryorder/uploadDesignFile",
    method: "post",
    data: obj
  })
}

// 询价单导入
export function batchImportPreview(obj) {
  return request({
    url: "/purchase/poinquiryorder/batchImportPreview",
    method: "post",
    data: obj
  })
}

export function uploadImgAndPdf(obj) {
  return request({
    url: "/filecenter/upload/multipartFileEX",
    method: "post",
    data: obj
  })
}

export function previewImgAndPdf(query) {
  return request({
    url: "/filecenter/downloadEX/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

export function downloadImgAndPdf(query) {
  return request({
    url: "/filecenter/downloadEX/fileId/" + query.fileId,
    method: "get",
    responseType: "blob"
  })
}

export function updateInquiryEvidence(obj) {
  return request({
    url: "/purchase/poinquiryorder/updateInquiryEvidence",
    method: "post",
    data: obj
  })
}
