import request from "@/router/axios"

// 新增标签
export function createLabel(obj) {
  return request({
    url: "/oms/omsLabelManagement/create",
    method: "post",
    data: obj
  })
}

// 更新标签
export function updateLabel(obj) {
  return request({
    url: "/oms/omsLabelManagement/update",
    method: "post",
    data: obj
  })
}

// 删除标签
export function deleteLabel(obj) {
  return request({
    url: "/oms/omsLabelManagement/delete",
    method: "post",
    data: obj
  })
}

// 查询标签数据
export function getListPage(obj) {
  return request({
    url: "/oms/omsLabelManagement/listPage",
    method: "post",
    data: obj
  })
}
