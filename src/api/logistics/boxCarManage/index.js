import request from "@/router/axios"

// 车型管理
export function listPage(data) {
  return request({
    url: "/warehouse/boxCarManage/listPage",
    method: "post",
    data
  })
}

export function disabledByIds(data) {
  return request({
    url: "/warehouse/boxCarManage/disabledByIds",
    method: "post",
    data
  })
}

export function enabledByIds(data) {
  return request({
    url: "/warehouse/boxCarManage/enabledByIds",
    method: "post",
    data
  })
}

export function add(data) {
  return request({
    url: "/warehouse/boxCarManage/add",
    method: "post",
    data
  })
}

export function update(data) {
  return request({
    url: "/warehouse/boxCarManage/update",
    method: "post",
    data
  })
}
