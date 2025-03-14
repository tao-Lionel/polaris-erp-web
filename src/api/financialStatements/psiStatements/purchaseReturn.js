import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finPurchaseReturn/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finPurchaseReturn/getDetail",
    method: "post",
    data: obj
  })
}
