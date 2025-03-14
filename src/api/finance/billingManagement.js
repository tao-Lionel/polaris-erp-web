import request from "@/router/axios"

// 获取结算列表
export function getSettlementPageListApi(data) {
  return request({
    url: "/finance/settlement/settlementPageList",
    method: "post",
    data
  })
}

// 获取账单列表
export function getBillPageListApi(data) {
  return request({
    url: "/finance/settlement/billPageList",
    method: "post",
    data
  })
}

// 获取账单详情列表
export function getBillDetailPageListApi(data) {
  return request({
    url: "/finance/settlement/billDetailPageList",
    method: "post",
    data
  })
}

// 创建平台账单
export function createFinPlatformSettlementApi(data) {
  return request({
    url: "/finance/settlement/createFinPlatformSettlement",
    method: "post",
    data
  })
}

// 删除平台账单
export function deleteSettlementApi(data) {
  return request({
    url: "/finance/settlement/deleteSettlement",
    method: "post",
    data
  })
}

// 头程账单列表
export function getHeadBillPageListApi(data) {
  return request({
    url: "/finance/finLogisticsHeadBill/pageList",
    method: "post",
    data
  })
}

// 头程账单费用汇总
export function getHeadBillFeeSummaryPageListApi(data) {
  return request({
    url: "/finance/finLogisticsHeadBill/pageListRelation",
    method: "post",
    data
  })
}

// 头程账单费用明细
export function getHeadBillFeeDetailPageListApi(data) {
  return request({
    url: "/finance/finLogisticsHeadBill/pageListDetail",
    method: "post",
    data
  })
}

// 头程账单删除
export function deleteHeadBillApi(data) {
  return request({
    url: "/finance/finLogisticsHeadBill/delete",
    method: "post",
    data
  })
}

// 头程账单上传
export function uploadHeadBillApi(data) {
  return request({
    url: "/finance/finLogisticsHeadBill/upload",
    method: "post",
    data
  })
}

// 海外仓账单列表
export function getOverseasBillPageListApi(data) {
  return request({
    url: "/finance/finOverseaWarehouseBill/pageList",
    method: "post",
    data
  })
}

// 上传海外仓对账单
export function uploadOverseaBillApi(data, site) {
  return request({
    url: "/finance/finOverseaWarehouseBill/upload?site=" + site,
    method: "post",
    data
  })
}

// 删除海外仓对账单
export function deleteOverseaBillApi(data) {
  return request({
    url: "/finance/finOverseaWarehouseBill/remove",
    method: "post",
    data
  })
}

// 海外仓对账费用分页
export function getOverseaFeePageApi(data) {
  return request({
    url: "/finance/finOverseaWarehouseBillDetail/feePageList",
    method: "post",
    data
  })
}

// 海外仓对账仓库分页
export function getOverseaWarehousePageApi(data) {
  return request({
    url: "/finance/finOverseaWarehouseBillDetail/warehousePageList",
    method: "post",
    data
  })
}

// 海外仓对账明细分页
export function getOverseaBillDetailPageApi(data) {
  return request({
    url: "/finance/finOverseaWarehouseBillDetail/pageList",
    method: "post",
    data
  })
}

//账单,签收单压缩包下载
export function downloadBillPageApi(data) {
  return request({
    url: "/finance/settlement/downloadAmazonVcSettlement",
    method: "post",
    responseType: "blob",
    data
  })
}
