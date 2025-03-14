import request from "@/router/axios"


// 成本还原列表
export function getIndonesianFactoryCost(obj) {
  return request({
    url: "/finance/finRestoreAdjust/listPage",
    method: "post",
    data: obj
  })
}

// 生成单据
export function generate(month) {
  return request({
    url: "/finance/finRestoreAdjust/generate" + `?dataMonth=${month}`,
    method: "post",
  })
}


// 审核
export function audit(month) {
  return request({
    url: "/finance/finRestoreAdjust/audit" + `?dataMonth=${month}`,
    method: "post",
  })
}

// 反审核
export function revertAudit(month) {
  return request({
    url: "/finance/finRestoreAdjust/revertAudit" + `?dataMonth=${month}`,
    method: "post",
  })
}


// 推送
export function push(month) {
  return request({
    url: "/finance/finRestoreAdjust/push" + `?dataMonth=${month}`,
    method: "post",
  })
}