import request from "@/router/axios"
/**
 *
 * 规则列表
 */
export function listPageByQuery(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/listPageByQuery",
    method: "post",
    data: obj
  })
}

/**
 *
 * 规则列表
 */
export function getRulePage(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/listPage",
    method: "post",
    data: obj
  })
}

export function addRule(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/add",
    method: "post",
    data: obj
  })
}
export function updateRule(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/update",
    method: "post",
    data: obj
  })
}

export function justPublish(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/justPublish",
    method: "post",
    data: obj
  })
}
// 通用规则-根据id修改记录(状态)
export function updateStatus(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/updateStatusById",
    method: "post",
    data: obj
  })
}

// 通用规则_规则编辑获取填充数据
export function getRuleEditorInfo(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/listRuleEditorInfoBySceneId",
    method: "post",
    data: obj
  })
}

// 通过id查询规则
export function getRuleDetail(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/select",
    method: "post",
    data: obj
  })
}

// 拷贝
export function copyGeneralRule(obj) {
  return request({
    url: "/baseSetup/generalRule/rule/copyGeneralRule",
    method: "post",
    data: obj
  })
}

/***
 * 通过 code time 获取入参返回结果
 */
export function ruleExecute(obj) {
  return request({
    url: `/baseSetup/generalRule/rule/executeByCodeAndTimeAndEnvMap`,
    method: "post",
    data: obj
  })
}
export function ruleGetInputObjs(obj) {
  return request({
    url: `/baseSetup/generalRule/rule/getInputObjs`,
    method: "post",
    data: obj
  })
}

// 通过id查询执行明细
export function getExecuteDetailsById(obj) {
  return request({
    url: `/baseSetup/generalRule/rule/getExecuteDetailsById`,
    method: "post",
    data: obj
  })
}

// 获取规则下的所有选项
export function getOptionSet(obj) {
  return request({
    url: `/baseSetup/generalRule/rule/getOptionSet`,
    method: "post",
    data: obj
  })
}
