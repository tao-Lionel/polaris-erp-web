import request from "@/router/axios"

// 查询物流商映射列表
export function getLogisticsMappingListPageApi(params) {
  return request({
    url: "/baseSetup/logisticsMapping/getMappingListPage",
    method: "get",
    params
  })
}

// 获取渠道映射详情
export function getLogisticsMappingDetailApi(params) {
  return request({
    url: "/baseSetup/logisticsMapping/getMappingDetail",
    method: "get",
    params
  })
}

// 新增物流商映射配置
export function addLogisticsMappingApi(data) {
  return request({
    url: "/baseSetup/logisticsMapping/addMapping",
    method: "post",
    data
  })
}

// 编辑物流渠道映射配置
export function editLogisticsMappingApi(data) {
  return request({
    url: "/baseSetup/logisticsMapping/editMapping",
    method: "post",
    data
  })
}

// 查询海外物流商
export function getOverseaCarrierListApi(data) {
  return request({
    url: "/baseSetup/logisticsMapping/getOverseaCarrierList",
    method: "post",
    data
  })
}

// 根据仓库id获取物流商列表
export function getCarriersByWarehouseIdNoInnerApi(data) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getCarriersByWarehouseIdNoInner",
    method: "post",
    data
  })
}

// 获取所有物流商
export function getCarriersAllApi() {
  return request({
    url: "/baseSetup/bsetransportcarrier/getAllCarriersV2",
    method: "get"
  })
}

// 根据物流商编码获取物流渠道
export function getBseChannelByTransportCodeApi(data) {
  return request({
    url: "/baseSetup/bseChannel/getBseChannelByTransportCode",
    method: "post",
    data
  })
}

// 获取日志
export function getLogisticsMappingLogInfoApi(params) {
  return request({
    url: "/baseSetup/logisticsMapping/getLogInfo",
    method: "get",
    params
  })
}
