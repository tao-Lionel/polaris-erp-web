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
  dic: [],
  column: [
    {
      label: "供应商名称",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false,
      overHidden: true
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      solt: true,
      width: 150,
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
          return ""
        }
      }
    },
    // {
    //   label: '型号',
    //   prop: 'modelName'
    // },
    {
      label: "MOQ",
      prop: "moq",
      sortable: false
    },
    {
      label: "采购周期（d）",
      prop: "period"
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: true,
      width: 150,
      sortable: false
    }
  ]
}
