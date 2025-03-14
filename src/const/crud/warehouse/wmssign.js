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
import { formatDate } from "@/filters/index"
export const tableOption = {
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "签收编号",
      prop: "wmsSignNo"
    },
    {
      label: "送货单号",
      prop: "deliveryNo"
      // solt: true
    },
    {
      label: "签收状态",
      prop: "status",
      type: "select",
      dicData: [
        {
          value: 0,
          label: "待签收"
        },
        {
          value: 1,
          label: "已签收"
        }
      ]
    },
    {
      label: "签收时间",
      prop: "signTime"
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "送货产品",
      prop: "skuCount",
      solt: true
    },
    {
      label: "送货日期",
      prop: "deliveryDate",
      formatter: function (row, value, label, column) {
        if (value) {
          var date = new Date(value)
          return formatDate(date, "yyyy-MM-dd")
        }
        return ""
      }
    },
    {
      label: "税别",
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ]
    },
    {
      label: "总箱数",
      prop: "boxCount"
    },
    {
      label: "合同编号",
      prop: "poContractNo"
    },
    {
      label: "采购员",
      prop: "purchaseUserName"
    }
  ]
}

export const tableOptionDetail = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  tip: false,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "采购单号",
      prop: "purchaseOrderNo"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      prop: "skuName"
    },
    {
      label: "采购数量",
      prop: "purchaseQuantity"
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode'
    // },
    {
      label: "平台",
      prop: "platformCode"
    },
    {
      label: "站点",
      prop: "sitCode"
    },
    {
      label: "送货数量",
      prop: "deliveryQuantity"
    },
    {
      label: "单价",
      prop: "price"
      // 	formatter:function(row, value , label, column){
      // 		if(row.taxType == 1){
      // 				return row.price;
      // 		}
      // 		return "";
      //  }
    },
    {
      label: "箱数",
      prop: "boxCount"
    },
    {
      label: "长/宽/高（cm）",
      prop: "boxLength",
      formatter: function (row, value, label, column) {
        if (row.boxLength) {
          return row.boxLength + "/" + row.boxWidth + "/" + row.boxHeight
        }
        return ""
      }
    },
    {
      label: "包装长*宽*高(cm)",
      prop: "packageLength",
      formatter: function (row, value, label, column) {
        if (row.packageLength) {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        }
        return ""
      }
    },
    {
      label: "产品毛重（kg）",
      prop: "boxGrossWeight"
    }
  ]
}
