import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finInStock/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finInStock/getDetail",
    method: "post",
    data: obj
  })
}
