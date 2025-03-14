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

export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  // isMedia:true,
  // openHeight:true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  showSummary: true,
  sumColumnList: [
    {
      name: "receiveMoney",
      type: "sum"
    },
    {
      name: "receiveUsedMoney",
      type: "sum"
    },
    {
      name: "receiveLockMoney",
      type: "sum"
    },
    {
      name: "receiveAvailableMoney",
      type: "sum"
    }
  ],
  dic: [],
  column: [
    {
      label: "供应商",
      minWidth: 90,
      prop: "supplierName"
    },
    {
      label: "法人主体",
      minWidth: 120,
      prop: "corporationName"
    },
    {
      label: "制单人",
      minWidth: 90,
      prop: "documentsName"
    },
    {
      label: "业务描述",
      minWidth: 120,
      prop: "businessDescription",
      formatter(row, value, label, column) {
        if (row.type == 0) {
          return "采购退货款"
        } else if (row.type == 1) {
          return "合同变更退款"
        } else {
          return ""
        }
      }
    },
    {
      label: "单据类型",
      minWidth: 120,
      prop: "type",
      formatter(row, value, label, column) {
        if (value == 0) {
          return "采购退货单"
        } else if (value == 1) {
          return "采购变更单"
        } else {
          return ""
        }
      }
    },
    {
      label: "单据编号",
      minWidth: 120,
      prop: "documentsNo"
    },
    {
      label: "单据时间",
      minWidth: 120,
      prop: "documentsTime"
    },
    {
      label: "SKU",
      minWidth: 120,
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      minWidth: 120,
      prop: "skuName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "币别",
      prop: "currency"
    },
    {
      label: "应收金额",
      prop: "receiveMoney",
      width: 150,
      formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "已用金额",
      width: 150,
      prop: "receiveUsedMoney",
      solt: "receiveUsedMoney",
      copy: false
    },
    {
      label: "占用金额",
      width: 150,
      prop: "receiveLockMoney",
      formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "可用金额",
      width: 150,
      prop: "receiveAvailableMoney",

      formatter(row, value, label, column) {
        return round(value)
      }
    },
    {
      label: "核销状态",
      minWidth: 120,
      prop: "status",
      formatter(row, value, label, column) {
        if (value == 0) {
          return "未核销"
        } else if (value == 1) {
          return "已核销"
        } else {
          return ""
        }
      }
    }
  ]
}
