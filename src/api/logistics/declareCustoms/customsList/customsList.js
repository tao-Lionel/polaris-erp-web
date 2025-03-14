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
// import { STATUS_CODES } from 'http';

export function getDeclareList(query) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/page",
    method: "get",
    params: query
  })
}
export function exportListBefore(query) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/exportListBefore",
    method: "get",
    params: query
  })
}

export function getDeclareOne(code) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/getOne/" + code,
    method: "get"
  })
}

export function getTotalInfoOne(code) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/getTotalInfoOne/" + code,
    method: "get"
  })
}

/** 关单合并 */
export function mergeDeclare(query) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/mergeDeclare",
    method: "get",
    params: query
  })
}

/**审核 */
export function reviewDeclare(query) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/reviewDeclare",
    method: "get",
    params: query
  })
}

/**上传附件接口 */
// export function uploadDesignFile(data){
//   return request({
//     url: '',
//     method: 'post',
//     data: data
//   })
// }

/**报关完成保存 */
export function declareAtCustomsSave(data) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/declareAtCustom",
    method: "post",
    data: data
  })
}
/*申报保存*/
export function saveDeclare(data) {
  return request({
    url: "/declarecustoms/cusdeclarecustoms/saveDec",
    method: "post",
    data: data
  })
}
/**日志查询 */
export function getDeclareLogList(query) {
  return request({
    url: "/declarecustoms/cusoperatelog/page",
    method: "get",
    params: query
  })
}

export function getSkuInfo(code) {
  return request({
    url: "/declarecustoms/cusdeclaredetail/getSkuInfo/" + code,
    method: "get"
  })
}
