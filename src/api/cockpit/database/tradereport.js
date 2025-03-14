import request from "@/router/axios"

export function getTradeReportList(query) {
  return request({
    url: "/cockpit/database/tradeReport/page",
    method: "get",
    params: query
  })
}
