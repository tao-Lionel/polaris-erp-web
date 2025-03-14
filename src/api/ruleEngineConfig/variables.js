import request from "@/router/axios"

/**
 *
 *通用变量-分页查询-listPageByQuery
 */
export function listPageByQuery(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/listPageByQuery",
    method: "post",
    data: obj
  })
}
/**
 *
 *变量列表 分页查询
 */
export function getVariablesPage(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/listPage",
    method: "post",
    data: obj
  })
}

/**
 *
 * 通用变量-增加记录
 */
export function addVariables(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/add",
    method: "post",
    data: obj
  })
}

/**
 * 通用变量-根据id修改记录
 */
export function updateVariables(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/update",
    method: "post",
    data: obj
  })
}
/**
 * 通用变量-根据id修改记录内容(状态)
 */
export function updateVariablesStatus(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/updateStatusById",
    method: "post",
    data: obj
  })
}

/**
 * 通用变量-根据id获取
 */

export function getVariablesDetail(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/select",
    method: "post",
    data: obj
  })
}

// 通用变量-根据id拷贝变量
export function copyGeneralVariables(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/copyGeneralVariables",
    method: "post",
    data: obj
  })
}

// 通用变量-根据id拷贝变量
export function listVariablesTypeAndValueType(obj) {
  return request({
    url: "/baseSetup/generalRule/variables/listVariablesTypeAndValueType",
    method: "post",
    data: obj
  })
}

/***
 * 通过 code time 获取入参返回结果
 */
export function variablesExecute(obj) {
  return request({
    url: `/baseSetup/generalRule/variables/executeByCodeAndTimeAndEnvMap`,
    method: "post",
    data: obj
  })
}
