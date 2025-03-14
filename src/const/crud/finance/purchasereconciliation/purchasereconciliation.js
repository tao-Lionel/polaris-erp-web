/*
 *    Copyright (c) 2018-2025, Aukey All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the trob4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: wangbin (AukeyIT@aukeys.com)
 */
export const round = (number) => {
  if (number == null) {
    return null
  }
  return Math.round(number * 100) / 100
}

export const accountTableOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "往来单位（供应商）",
      minWidth: 200,
      prop: "supplierName"
    },
    {
      label: "结算组织（法人主体）",
      minWidth: 200,
      prop: "corporationaName"
    },
    {
      label: "制单人",
      minWidth: 100,
      prop: "createUser"
    },
    {
      label: "业务描述",
      minWidth: 120,
      prop: "businessDescription"
    },
    {
      label: "单据类型",
      minWidth: 120,
      prop: "docType"
    },
    {
      label: "单据编号",
      minWidth: 120,
      prop: "docNo"
    },
    {
      label: "单据时间",
      minWidth: 120,
      prop: "createTime"
    },
    {
      label: "请购状态",
      minWidth: 120,
      prop: "poRequestAccountStatus"
    },
    {
      label: "关联单号",
      minWidth: 120,
      prop: "relationNo"
    },
    {
      label: "合同编号",
      minWidth: 120,
      prop: "poContractNo"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      minWidth: 120,
      prop: "skuName"
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName"
    },
    {
      label: "往来金额（原币）",
      minWidth: 200,
      prop: "orginalAmount"
    },
    {
      label: "往来金额（本位币）",
      minWidth: 200,
      prop: "standardAmount"
    },
    {
      label: "支付状态",
      minWidth: 120,
      prop: "payStatus",
      formatter(row, value, label, column) {
        if (value == "1") {
          return "待付"
        } else if (value == "2") {
          return "已付"
        } else {
          return ""
        }
      }
    }
  ]
}

export const quantityTableOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  stripe: false,
  column: [
    {
      label: "往来单位（供应商）",
      minWidth: 200,
      prop: "supplierName",
      sortable: false
    },
    {
      label: "结算组织（法人主体）",
      minWidth: 200,
      prop: "corporationName",
      sortable: false
    },
    {
      label: "采购员",
      minWidth: 120,
      prop: "purchaseName",
      sortable: false
    },
    // {
    //   label: '业务描述',
    //   minWidth: 120,
    //   prop: 'businessDescription'
    // },
    {
      label: "单据类型",
      minWidth: 120,
      prop: "docType",
      sortable: false
    },
    {
      label: "请款状态",
      minWidth: 120,
      prop: "poRequestAccountStatus"
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      minWidth: 120,
      sortable: false
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "单据编号",
      minWidth: 120,
      prop: "docNo",
      sortable: false
    },
    {
      label: "单据时间",
      minWidth: 120,
      prop: "createTime",
      sortable: false
    },
    {
      label: "采购单号",
      minWidth: 120,
      prop: "relationNo",
      sortable: false
    },
    {
      label: "SKU",
      minWidth: 100,
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      minWidth: 140,
      prop: "skuName",
      sortable: false
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      minWidth: 140,
      sortable: false
    },
    {
      label: "单价",
      prop: "unitPrice",
      sortable: false,
      formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "数量",
      prop: "quantity",
      sortable: false
    },
    {
      label: "货值",
      prop: "goodValue",
      sortable: false,
      formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "平台",
      minWidth: 100,
      prop: "platformCode",
      sortable: false
    },
    {
      label: "站点",
      minWidth: 100,
      prop: "sitCode",
      sortable: false
    },
    {
      label: "品牌",
      prop: "brandName",
      sortable: false
    },
    {
      label: "税别",
      prop: "taxType",
      sortable: false,
      formatter(row, value, label, column) {
        if (value == "1") {
          return "含税"
        } else if (value == "2") {
          return "非税"
        } else {
          return ""
        }
      }
    },
    {
      label: "币种",
      prop: "currency",
      sortable: false
    },
    {
      label: "产品毛重kg",
      prop: "skuGrossWeight",
      minWidth: 120,
      sortable: false
    },
    {
      label: "包装体积m³",
      prop: "packageVolume",
      minWidth: 120,
      sortable: false
    },
    {
      label: "仓库",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "合同编号",
      minWidth: 120,
      prop: "poContractNo",
      sortable: false
    },
    {
      label: "制单员",
      minWidth: 120,
      prop: "createDocName",
      sortable: false
    },
    {
      label: "采购组",
      prop: "purchaseGroupName",
      sortable: false
    }
  ]
}
