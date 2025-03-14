import request from "@/router/axios"

//亚马逊报表查询
export function getAmazonVCReport(obj) {
  return request({
    url: "/product/prdCalculateRecord/getReportPageAmazon",
    method: "post",
    data: obj
  })
}

//亚马逊批次查询
export function getBatAmazonVCReport(obj) {
  return request({
    url: "/product/prdCalculateRecord/getReportPageAmazonBatch",
    method: "post",
    data: obj
  })
}

//亚马逊导出
export function exportAmazonVCReport(obj) {
  return request({
    url: "/product/prdCalculateRecord/exportReportAmazon",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}

//多平台测算汇总查询
export function getMutiPlatformReport(obj) {
  return request({
    url: "/product/prdCalculateRecord/getReportPageMuti",
    method: "post",
    data: obj
  })
}

//多平台测算汇总导出
export function exportMutiPlatformReport(obj) {
  return request({
    url: "/product/prdCalculateRecord/exportReportMuti",
    method: "post",
    data: obj,
    responseType: "blob"
  })
}
