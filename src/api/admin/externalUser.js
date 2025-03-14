import request from "@/router/axios"

export function fetchList(query) {
  return request({
    url: "/admin/user/page",
    method: "get",
    params: query
  })
}
