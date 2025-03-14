import request from "@/router/axios"

// 获取树形数据
export function getTreeData(payload) {
  return request({ url: "/admin/dept/tree", parmas: payload })
}

// 查询节点
export function searchNodeData(payload) {
  return request({ url: "/admin/dept/" + payload })
}

// 新增节点
export function insertNodeData(payload) {
  return request({ url: "/admin/dept", method: "post", data: payload })
}

// 更新节点
export function updateNodeData(payload) {
  return request({ url: "/admin/dept", method: "put", data: payload })
}

// 删除节点
export function deleteNodeData(payload) {
  return request({ url: "/admin/dept/" + payload, method: "delete" })
}
