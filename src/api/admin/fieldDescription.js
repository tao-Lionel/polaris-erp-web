import request from "@/router/axios"

export function getFuncTreeApi() {
  return request({
    url: "/admin/menu/funcTree",
    method: "get"
  })
}

export function getFieldPageListApi(params) {
  return request({
    url: "/baseSetup/bseFrontendField/pageList",
    method: "get",
    params
  })
}

export function getFieldDescWithRouteKeyApi(params) {
  return request({
    url: "/baseSetup/bseFrontendField/getFieldDescWithRouteKey",
    method: "get",
    params
  })
}

export function deleteFieldApi(data) {
  return request({
    url: "/baseSetup/bseFrontendField/delete",
    method: "post",
    data
  })
}

export function saveOrUpdateFieldApi(data) {
  return request({
    url: "/baseSetup/bseFrontendField/saveOrUpdate",
    method: "post",
    data
  })
}
