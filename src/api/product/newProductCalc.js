import request from "@/router/axios"

/**
 *
 *  新品试算 列表
 */
export function getTrialListPage(data) {
  return request({
    url: "/product/pricing/trial/page",
    method: "post",
    data
  })
}

/***
 * 测算作废
 */
export function trialCancel(data) {
  return request({
    url: "/product/pricing/trial/cancel",
    method: "post",
    data
  })
}

export function trialSave(data) {
  return request({
    url: "/product/pricing/trial/save",
    method: "post",
    data
  })
}

/**
 *
 * 计算
 */
export function trialCalculate(data) {
  return request({
    url: "/product/pricing/trial/calculate",
    method: "post",
    data
  })
}

export function getTrialDetail(id) {
  return request({
    url: `/product/pricing/trial/${id}`,
    method: "get"
  })
}
