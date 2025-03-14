import request from "@/router/axios"

export function listPage(obj) {
  return request({
    url: "/baseSetup/bseCarrierBoxCarTypeInfo/listPage",
    method: "post",
    data: obj
  })
}
// 禁用
export function disabledByIds(obj) {
  return request({
    url: "/baseSetup/bseCarrierBoxCarTypeInfo/disabledByIds",
    method: "post",
    data: obj
  })
}
// 启用
export function enabledByIds(obj) {
  return request({
    url: "/baseSetup/bseCarrierBoxCarTypeInfo/enabledByIds",
    method: "post",
    data: obj
  })
}
// 新增
export function add(obj) {
  return request({
    url: "/baseSetup/bseCarrierBoxCarTypeInfo/add",
    method: "post",
    data: obj
  })
}

export function update(obj) {
  return request({
    url: "/baseSetup/bseCarrierBoxCarTypeInfo/update",
    method: "post",
    data: obj
  })
}
