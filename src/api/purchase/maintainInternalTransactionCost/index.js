
import request from "@/router/axios"

export function listPage(obj) {
  return request({
    url: "/finance/finInternalTransactionSkuCost/listPage",
    method: "post",
    data: obj
  })
}

export function edit(obj) {
  return request({
    url: "/finance/finInternalTransactionSkuCost/editBatch",
    method: "post",
    data: obj
  })
}