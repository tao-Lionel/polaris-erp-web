import request from "@/router/axios"

export function getInternalDetailInfo(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/getDetailInfo?orderNo=" + obj.orderNo,
    method: "post"
  })
}

export function listPageDetail(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/listPageDetail",
    method: "post",
    data: obj
  })
}

export function listPage(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/listPage",
    method: "post",
    data: obj
  })
}

export function getReturnDetail(obj) {
  return request({
    url: "/warehouse/wmsInternalTransactionOrder/getReturnDetail?orderNo=" + obj.orderNo,
    method: "post"
  })
}

export function getAllSupplier(obj) {
  return request({
    url: "/finance/baseData/getAllSupplier",
    method: "post",
    data: obj
  })
}
