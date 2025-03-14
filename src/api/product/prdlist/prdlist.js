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
 * Author: wangxiaowen (AukeyIT@aukeys.com)
 */

import request from "@/router/axios"

export function fetchList(query) {
  return request({
    url: "/product/prdcreateinvoices/page",
    method: "get",
    params: query
  })
}

export function fetchSpuList(query) {
  return request({
    url: "/product/prdspu/page",
    method: "get",
    params: query
  })
}

export function getProcessSpu(query) {
  return request({
    url: "/product/prdspu/processSpu",
    method: "get",
    params: query
  })
}

export function isEdit(query) {
  return request({
    url: "/product/prdspu/isEdit",
    method: "get",
    params: query
  })
}

export function fastCreate(obj) {
  return request({
    url: "/product/prdcreateinvoices/createFast",
    method: "post",
    data: obj
  })
}

/**新品创建 新增接口 */
export function submitPrd(obj) {
  return request({
    url: "/product/prdcreateinvoices/submitPrd",
    method: "post",
    data: obj
  })
}
/**新品创建 新增新接口 */
export function submitPrdAlone(obj) {
  return request({
    url: "/product/prdcreateinvoices/submitPrdAlone",
    method: "post",
    data: obj
  })
}

/**新品创建 修改接口 */
export function submitPrdEdit(obj) {
  return request({
    url: "/product/prdcreateinvoices/submitPrdEdit",
    method: "post",
    data: obj
  })
}

/**新品创建 修改新接口 */
export function submitPrdEditAlone(obj) {
  return request({
    url: "/product/prdcreateinvoices/submitPrdEditAlone",
    method: "post",
    data: obj
  })
}

/**新品创建特殊编辑 */
export function submitPrdSpecialEdit(obj) {
  return request({
    url: "/product/prdcreateinvoices/submitPrdSpecialEdit",
    method: "post",
    data: obj
  })
}

export function toExamine(obj) {
  return request({
    url: "/product/prdcreateinvoices/toExamine",
    method: "post",
    data: obj
  })
}

export function cancelSubmit(obj) {
  return request({
    url: "/product/prdcreateinvoices/cancelSubmit",
    method: "post",
    data: obj
  })
}
export function rollbackSubmit(obj) {
  return request({
    url: "/product/prdcreateinvoices/rollbackSubmit",
    method: "post",
    data: obj
  })
}

export function getCreateInvoicesInfo(query) {
  return request({
    url: "/product/prdcreateinvoices/getCreateInvoicesInfo",
    method: "get",
    params: query
  })
}

export function getMakeUpAttr(query) {
  return request({
    url: "/product/prdcreateinvoices/getMakeUpAttr",
    method: "get",
    params: query
  })
}

export function uplaodDesignFile(obj) {
  return request({
    url: "/product/prddesignlist/uplaodDesignFile",
    method: "post",
    data: obj
  })
}

export function uplaodDesignFileV2(obj) {
  return request({
    url: "/product/prddesignlist/uploadDesignFileV2",
    method: "post",
    data: obj
  })
}
// export function addObj(obj) {
//   return request({
//     url: '/product/prdattribute',
//     method: 'post',
//     data: obj
//   })
// }

// export function getObj(id) {
//   return request({
//     url: '/product/prdattribute/' + id,
//     method: 'get'
//   })
// }

// export function delObj(id) {
//   return request({
//     url: '/product/prdattribute/' + id,
//     method: 'delete'
//   })
// }

// export function putObj(obj) {
//   return request({
//     url: '/product/prdattribute',
//     method: 'put',
//     data: obj
//   })
// }
