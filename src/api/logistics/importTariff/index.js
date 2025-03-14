import request from "@/router/axios"

// 获取最低一级品类
export function queryAllLowestLevelCategory(code) {
  return request({
    url: "/product/prdskucategory/queryAllLowestLevelCategory",
    method: "post",
  })
}

// 获取国家
export function getCountry(code) {
  return request({
    url: "/baseSetup/bsecountry/getCountry",
    method: "get"
  })
}

// 明细分页查询
export function listPage(data) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/listPage",
    method: "post",
    data: data
  })
}

// 汇总分页查询
export function summaryListPage(data) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/summaryListPage",
    method: "post",
    data: data
  })
}

// 添加进口关税
export function addOrUpdate(data) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/addOrUpdate",
    method: "post",
    data: data
  })
}

// 编辑进口关税
export function update(data) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/update",
    method: "post",
    data: data
  })
}

// 删除进口关税
export function deleteTariff(data) {
  return request({
    url: "/warehouse/customsdeclarationmaintenance/delete",
    method: "post",
    data: data
  })
}
