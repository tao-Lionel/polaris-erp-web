import request from "@/router/axios"

// 打托数分页查询
export function getPageListApi(data) {
  return request({
    url: "/product/prdSealSamplePallet/listPage",
    method: "post",
    data
  })
}

// 新增打托数
export function addPalletsManageApi(data) {
  return request({
    url: "/product/prdSealSamplePallet/insert",
    method: "post",
    data
  })
}

// 编辑打托数
export function editPalletsManageApi(data) {
  return request({
    url: "/product/prdSealSamplePallet/update",
    method: "post",
    data
  })
}

// 导入修改打托数维护
export function importPalletsManageApi(data) {
  return request({
    url: "/product/prdSealSamplePallet/importPallet",
    method: "post",
    data
  })
}
