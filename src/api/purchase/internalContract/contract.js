import request from "@/router/axios"

export function fetchList(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrderContract/listPage",
    method: "post",
    data: obj
  })
}

export function getContract(params) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrderContract/getContract",
    method: "get",
    params: params
  })
}

export function getSettleaccountTypeOptions() {
  return request({
    url: "/purchase/posettleaccounttype/getAll",
    method: "get"
  })
}

// 财务审核
export function financialOperateBatchApi(data) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrderContract/financialOperateBatch",
    method: "post",
    data
  })
}
