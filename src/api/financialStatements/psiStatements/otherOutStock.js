import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finOtherOut/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finOtherOut/getDetail",
    method: "post",
    data: obj
  })
}
