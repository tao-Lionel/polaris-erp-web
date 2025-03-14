import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finOutStock/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finOutStock/getDetail",
    method: "post",
    data: obj
  })
}
