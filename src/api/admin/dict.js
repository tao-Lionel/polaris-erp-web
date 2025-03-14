import request from "@/router/axios"

export function fetchList(data) {
  return request({
    // url: "/admin/dict/page",
    url: "/admin/dict/pageV2",
    method: "post",
    data
  })
}

export function addObj(obj) {
  return request({
    url: "/admin/dict/",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/admin/dict/" + id,
    method: "get"
  })
}

export function getObjByType(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

export function delObj(row) {
  return request({
    url: "/admin/dict/" + row.id + "/" + row.type,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/admin/dict/",
    method: "put",
    data: obj
  })
}

export function remote(type) {
  return request({
    url: "/admin/dict/type/" + type,
    method: "get"
  })
}

export function saveOrUpdate(data) {
  return request({
    url: "/admin/dict/saveOrUpdate",
    method: "post",
    data
  })
}
