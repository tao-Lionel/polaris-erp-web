import request from "@/router/axios"

// 列表记录
export function searchRecord(payload) {
  return request({ url: "/admin/sysgroup/page", params: payload })
}

// 分类数据
export function searchCategory() {
  return request({ url: "/admin/sysgroupfunction" })
}

// 部门数据
export function searchDepartment() {
  return request({ url: "/admin/dept" })
}

// 新增记录
export function insertRecord(payload) {
  return request({ url: "/admin/sysgroup", method: "post", data: payload })
}

// 更新记录
export function updateRecord(payload) {
  return request({ url: "/admin/sysgroup", method: "put", data: payload })
}

// 删除记录
export function deleteRecord(payload) {
  return request({ url: "/admin/sysgroup/" + payload, method: "delete" })
}

// 查询小组是否绑定了员工
export function checkUserForGroup(groupID) {
  return request({ url: "/admin/sysgroup/checkUserForGroup/" + groupID, method: "get" })
}

export function getGroupAllByParams(params) {
  return request({
    url: "/admin/sysgroup/getGroupAllByParams",
    method: "get",
    params: params
  })
}

// 查询小组信息,如果只有一个组类别，获取自己的所属组，有多个全部获取
export function getGroupAllByParamsSpecial(params) {
  return request({
    url: "/admin/sysgroup/getGroupAllByParamsSpecial",
    method: "get",
    params: params
  })
}

//通过小组id获取销售范围
export function getGroupSalesScopeByGroupId(id) {
  return request({
    url: "/admin/sysgroup/getGroupSalesScopeByGroupId" + "?groupId=" + id,
    method: "get"
  })
}

// 获取选中平台的所有站点
export function getSitlnfoByPlatformlds(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitInfoByPlatformIds",
    method: "post",
    data: obj
  })
}
