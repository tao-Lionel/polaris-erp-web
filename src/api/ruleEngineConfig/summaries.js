import request from "@/router/axios"

/**
 *
 *通用变量-分页查询-listPageByQuery
 */
export function listPageByQuery(obj) {
  return request({
    url: "/baseSetup/generalRule/ruleCollaboration/listPageByQuery",
    method: "post",
    data: obj
  })
}
