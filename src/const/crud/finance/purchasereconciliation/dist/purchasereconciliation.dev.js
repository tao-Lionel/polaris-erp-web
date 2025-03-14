"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.quantityTableOption = exports.accountTableOption = exports.round = void 0

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
var round = function round(number) {
  if (number == null) {
    return null
  }

  return Math.round(number * 100) / 100
}

exports.round = round
var accountTableOption = {
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
  searchShow: true,
  //搜索栏开关
  searchAdvanced: true,
  //高级搜索栏开关
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
      formatter: function formatter(row, value, label, column) {
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
exports.accountTableOption = accountTableOption
var quantityTableOption = {
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
  searchShow: true,
  //搜索栏开关
  searchAdvanced: true,
  //高级搜索栏开关
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
      label: "采购员",
      minWidth: 120,
      prop: "purchaseName"
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
      minWidth: 100,
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      minWidth: 140,
      prop: "skuName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "税别",
      prop: "taxType",
      formatter: function formatter(row, value, label, column) {
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
      label: "币别",
      prop: "currency"
    },
    {
      label: "单价",
      prop: "unitPrice",
      formatter: function formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "数量",
      prop: "quantity"
    },
    {
      label: "货值",
      prop: "goodValue",
      formatter: function formatter(row, value, label, column) {
        return round(value)
      }
    }
  ]
}
exports.quantityTableOption = quantityTableOption
