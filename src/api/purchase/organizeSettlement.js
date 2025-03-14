import request from "@/router/axios"

export function settlementPriceList(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/pageList",
    method: "post",
    data: query
  })
}
export function settlementPriceCreate(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/create",
    method: "post",
    data: query
  })
}
export function settlementPriceUpdate(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/update",
    method: "post",
    data: query
  })
}
export function settlementPriceAudit(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/audit",
    method: "post",
    data: query
  })
}
export function settlementPriceReverseAudit(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/reverseAudit",
    method: "post",
    data: query
  })
}
export function settlementPriceSync(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/sync",
    method: "post",
    data: query
  })
}
export function getDetailInfo(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceList/getDetailInfo?id=" + query.id,
    method: "post"
  })
}
export function poOrgSettlementPriceListDetail(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceListDetail/list",
    method: "post",
    data: query
  })
}

export function settlementRelationList(query) {
  return request({
    url: "/purchase/poOrgSettlementRelation/pageList",
    method: "post",
    data: query
  })
}
export function settlementRelationCreate(query) {
  return request({
    url: "/purchase/poOrgSettlementRelation/create",
    method: "post",
    data: query
  })
}
export function settlementRelationUpdate(query) {
  return request({
    url: "/purchase/poOrgSettlementRelation/update",
    method: "post",
    data: query
  })
}
export function settlementRelationAudit(query) {
  return request({
    url: "/purchase/poOrgSettlementRelation/audit",
    method: "post",
    data: query
  })
}
export function settlementRelationReverseAudit(query) {
  return request({
    url: "/purchase/poOrgSettlementRelation/reverseAudit",
    method: "post",
    data: query
  })
}
export function settlementRelationSync(query) {
  return request({
    url: "/purchase/poOrgSettlementPrice/sync",
    method: "post",
    data: query
  })
}

export function getAllBizLog(query) {
  return request({
    url: "/admin/log/getBizLog",
    method: "get",
    params: query
  })
}

export function addDetail(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceListDetail/add",
    method: "post",
    data: query
  })
}
export function removeDetail(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceListDetail/remove",
    method: "post",
    data: query
  })
}
export function updateDetail(query) {
  return request({
    url: "/purchase/poOrgSettlementPriceListDetail/update",
    method: "post",
    data: query
  })
}
