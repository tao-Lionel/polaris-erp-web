import request from "@/router/axios"

export function getRecord(payload) {
  return request({ url: "", parmas: payload })
}

// 测试接口 调用原api/admin/user中的方法
export function fetchList(query) {
  return request({
    url: "/admin/user/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/admin/user",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/admin/user/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/admin/user",
    method: "put",
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: "/admin/user/details/" + obj,
    method: "get"
  })
}
