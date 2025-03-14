import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finSaleReturn/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finSaleReturn/getDetail",
    method: "post",
    data: obj
  })
}
