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

export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  menu: false,
  selection: true,
  border: true,
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      minWidth: 150,
      sortable: false,
      formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else if (row.modelName) {
          return row.modelName
        } else {
          return ""
        }
      }
    },
    {
      label: "包装长宽高(cm)",
      prop: "packageLength",
      width: 150,
      sortable: false,
      formatter(row, value, label, column) {
        if (row.packageLength && row.packageWidth && row.packageHeight) {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        } else {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        }
      }
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "taxPrice"
    },
    {
      label: "非税单价",
      prop: "noneTaxPrice"
    },
    {
      label: "交易税率",
      minWidth: 120,
      prop: "taxRate",
      formatter: function (row, value, label, column) {
        if (value) {
          return Math.round(value * 100 * 1000) / 1000 + "%"
        }
        return ""
      }
    },
    {
      label: "币别",
      prop: "currency",
      sortable: false
    },
    {
      label: "价格模式",
      prop: "priceModel",
      sortable: false
    },
    {
      label: "价格有效期",
      prop: "startPriceValidity",
      width: 180,
      solt: true,
      sortable: false
    },
    {
      label: "是否默认供应商",
      minWidth: 150,
      prop: "isDefault",
      type: "select",
      sortable: false,
      dicData: [
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ]
    },
    {
      label: "价格来源",
      minWidth: 120,
      prop: "priceSource",
      type: "select",
      sortable: false,
      dicData: [
        {
          label: "新品开发",
          value: 1
        },
        {
          label: "询价单",
          value: 2
        }
      ]
    },
    {
      label: "来源单据",
      minWidth: 120,
      prop: "sourceNo",
      sortable: false
    },
    {
      label: "历史价格",
      minWidth: 100,
      prop: "priceHistorySlot",
      solt: "priceHistorySlot",
      sortable: false
    }
  ]
}

export const priceHistoryOption = {
  menu: false,
  selection: false,
  border: true,
  index: true,
  indexLabel: "序号",
  isMedia: false,
  stripe: false,
  // menuAlign: 'center',
  // align: 'center',
  header: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "含税单价",
      prop: "taxPrice",
      sortable: false
    },
    {
      label: "非税单价",
      sortable: false,
      prop: "noneTaxPrice"
    },
    {
      label: "交易税率",
      sortable: false,
      prop: "taxRate"
    },
    {
      label: "币别",
      sortable: false,
      prop: "currency"
    },
    {
      label: "价格有效期",
      sortable: false,
      width: 180,
      prop: "startPriceValidity",
      solt: true
    },
    {
      label: "制单人",
      sortable: false,
      prop: "createByName"
    },
    {
      label: "单据时间",
      sortable: false,
      prop: "createTime"
    },
    {
      label: "源单据",
      sortable: false,
      prop: "sourceNo",
      width: 180
    }
  ]
}
