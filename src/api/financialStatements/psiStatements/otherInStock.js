import request from "@/router/axios"

export function getList(obj) {
  return request({
    url: "/finance/finOtherIn/listPage",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/finance/finOtherIn/getDetail",
    method: "post",
    data: obj
  })
}
