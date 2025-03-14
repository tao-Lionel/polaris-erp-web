import request from "@/router/axios"

export function searchAnalysis(query) {
  return request({
    url: "/cockpit/analysis/search",
    method: "get",
    params: query
  })
}

export function gainAnalysisLine(query) {
  return request({
    url: "/cockpit/analysis/gainAnalysisLine",
    method: "get",
    params: query
  })
}

export function gainTableData(query) {
  return request({
    url: "/cockpit/analysis/gainTableData",
    method: "get",
    params: query
  })
}

export function getUserTableAuth() {
  return request({
    url: "/cockpit/analysis/getUserTableAuth",
    method: "get"
  })
}

export function getChildByItemId(param) {
  return request({
    url: "/cockpit/analysis/getChildByItemId",
    method: "get",
    params: param
  })
}
