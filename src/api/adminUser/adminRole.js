import request from "@/router/axios"

/**
 * 数据角色
 */
// 查询
export function search(payload) {
  return request({ url: "/admin/sysroledata/page", params: payload })
}

// 添加
export function insert(payload) {
  return request({ url: "/admin/sysroledata", method: "post", data: payload })
}

// 删除
export function remove(payload) {
  return request({ url: "/admin/sysroledata/" + payload, method: "delete" })
}

// 分配权限
export function update(payload) {
  return request({ url: "/admin/sysroledata/assignRoleAuth", method: "post", data: payload })
}

// 查询拥有该权限的用户
export function select(payload) {
  return request({ url: "/admin/sysroledata/" + payload })
}

// 仓库类型下拉框框数据
export function warehouseType(payload) {
  return request({ url: "/baseSetup/bsewarehousetype/getBseWarehouseType" })
}

/**
 * 功能角色
 */
// 查询功能角色
export function searchFunction(payload) {
  return request({ url: "/admin/role/page", params: payload })
}

// 删除功能角色
export function deleteFunction(payload) {
  return request({ url: "/admin/role/" + payload, method: "delete" })
}

//根据ID查询功能角色
export function getRoleInfoById(payload) {
  return request({ url: "/admin/role/" + payload, method: "get" })
}
//为功能角色分配权限
export function putRoleFunction(data) {
  return request({
    url: "/admin/role/menu",
    method: "post",
    data
  })
}
