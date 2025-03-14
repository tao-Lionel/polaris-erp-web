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

export function saveOrSubmitForm(obj, type) {
  return request({
    url: "/supplier/posuppliertax/" + type,
    method: "post",
    data: obj
  })
}

export function getInfo(supplierNo) {
  return request({
    url: "/supplier/posuppliertax/" + supplierNo,
    method: "get"
  })
}

export function changeStatus(query) {
  return request({
    url: "/supplier/posuppliertax/changeStatus",
    method: "put",
    params: query
  })
}

export function delPic(picId) {
  return request({
    url: "/supplier/posuppliertax/delPic/" + picId,
    method: "delete"
  })
}

// var a = {
//     "dataType": "object",
//     "content": {
//         "beta": true,
//         "debug": true,
//         "appId": "wxd1678d3f83b1d83a",
//         "timestamp": "1562988202422",
//         "nonceStr": "B4ea6cN8ven3sv",
//         "signature": "c342f39fce7c2832b63387e8ec56ee62a327e475",
//         "jsApiList": ["checkJsApi", "scanQRCode"]
//     },
//     "type": "session",
//     "datetime": 1562988202425
// }
