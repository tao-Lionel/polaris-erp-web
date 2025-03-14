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
    url: "/finance/financedeclarecustomrecordmanage/page",
    method: "get",
    params: query
  })
}

/**导入 */
export function uploadDesignFile(obj) {
  return request({
    url: "/finance/financedeclarecustomrecordmanage/uploadDesignFile",
    method: "post",
    data: obj
  })
}

/**导出 */
export function handleExport(query) {
  return request({
    url: "/finance/financedeclarecustomrecordmanage/handleExport",
    method: "get",
    params: query
  })
}

/**查询发票信息 */
export function getInvoiceInfoByDCN(query) {
  return request({
    url: "/finance/financedeclarecustomrecordmanage/getInvoiceInfoByDCN",
    method: "get",
    params: query
  })
}

/**查询合同信息 */
export function getContractInfoByDCN(query) {
  return request({
    url: "/finance/financedeclarecustomrecordmanage/getContractInfoByDCN",
    method: "get",
    params: query
  })
}
