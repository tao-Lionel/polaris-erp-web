import request from "@/router/axios"

export function saveOtherInformation(obj) {
  return request({
    url: "/supplier/poSupplierOtherInformation/saveOrUpdateInformation",
    method: "post",
    data: obj
  })
}

export function getListBySupplierNo(supplierNo) {
  return request({
    url: "/supplier/poSupplierOtherInformation/getListBySupplierNo?supplierNo=" + supplierNo,
    method: "get"
  })
}

export function getBySupplierNo(supplierNo) {
  return request({
    url: "/supplier/poSupplierOtherInformation/getBySupplierNo?supplierNo=" + supplierNo,
    method: "get"
  })
}

export function uploadImage(obj) {
  return request({
    url: "/supplier/posupplieraccounthistory/loadImage",
    method: "post",
    data: obj
  })
}
