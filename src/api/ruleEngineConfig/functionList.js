import request from "@/router/axios"
/**
 *
 * 通用函数-分页查询listPageByQuery
 */
export function listPageByQuery(obj) {
  return request({
    url: "/baseSetup/generalRule/function/listPageByQuery",
    method: "post",
    data: obj
  })
}
/**
 *
 * 函数列表
 */
export function getFunctionPage(obj) {
  return request({
    url: "/baseSetup/generalRule/function/listPage",
    method: "post",
    data: obj
  })
}

/**
 * 通用函数-增加记录
 */
export function addFunction(obj) {
  return request({
    url: "/baseSetup/generalRule/function/add",
    method: "post",
    data: obj
  })
}

/**
 * 通用函数-根据id修改记录(状态)
 */
export function updateFunctionStatus(obj) {
  return request({
    url: "/baseSetup/generalRule/function/updateStatusById",
    method: "post",
    data: obj
  })
}

/**
 * 通用函数-根据id修改记录(非状态)
 */
export function updateFunction(obj) {
  return request({
    url: "/baseSetup/generalRule/function/update",
    method: "post",
    data: obj
  })
}

/**
 * 通用函数-根据id获取 详情
 */
export function getFunctionDetail(obj) {
  return request({
    url: "/baseSetup/generalRule/function/select",
    method: "post",
    data: obj
  })
}

/**
 * 通用规则_函数编辑获取填充数据
 */
export function listFunctionEditorInfoBySceneId(obj) {
  return request({
    url: "/baseSetup/generalRule/function/listFunctionEditorInfoBySceneId",
    method: "post",
    data: obj
  })
}

/**
 * 通用函数-根据id 拷贝函数
 */
export function copyGeneralFunction(obj) {
  return request({
    url: "/baseSetup/generalRule/function/copyGeneralFunction",
    method: "post",
    data: obj
  })
}

/***
 * 通过 code time 获取入参返回结果
 */
export function functionExecute(obj) {
  return request({
    url: `/baseSetup/generalRule/function/executeByCodeAndTimeAndEnvMap`,
    method: "post",
    data: obj
  })
}

// 通用函数-通过 code 或 name 获取最新的入参
export function functionGetInputObjs(obj) {
  return request({
    url: `/baseSetup/generalRule/function/getInputObjs`,
    method: "post",
    data: obj
  })
}
