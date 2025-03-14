import request from "@/router/axios"

export function getCocSkuCosting(query) {
  return request({
    url: "/cockpit/cocSkuCosting/page",
    method: "get",
    params: query
  })
}

export function importExcel(obj) {
  return request({
    url: "/cockpit/cocSkuCosting/importExcel",
    method: "post",
    data: obj
  })
}
