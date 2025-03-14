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
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
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
      label: "单据编号",
      minWidth: 120,
      prop: "returnOrderNo",
      solt: true
    },
    {
      label: "单据日期",
      minWidth: 120,
      prop: "createTime"
    },
    {
      label: "FBA移除号",
      minWidth: 140,
      prop: "fbaRemoveNo"
    },
    {
      label: "退货仓",
      minWidth: 100,
      prop: "warehouseName"
    },
    {
      label: "退货数量",
      minWidth: 120,
      prop: "returnQuantity"
    },
    {
      label: "到货数量",
      minWidth: 120,
      prop: "arriveQuantity"
    },
    {
      label: "单据状态",
      minWidth: 120,
      prop: "status",
      formatter(row, value, label, column) {
        if (value == 0) {
          return "草稿"
        } else if (value == 1) {
          return "待审核"
        } else if (value == 2) {
          return "已审核"
        } else {
          return ""
        }
      }
    },
    {
      label: "到货状态",
      minWidth: 120,
      prop: "arriveStatus",
      formatter(row, value, label, column) {
        if (value == 0) {
          return "未到货"
        } else if (value == 1) {
          return "部分到货"
        } else if (value == 2) {
          return "全部到货"
        } else {
          return ""
        }
      }
    },
    {
      label: "创建人",
      minWidth: 120,
      prop: "createName"
    },
    {
      label: "销售组",
      minWidth: 120,
      prop: "salesGroupName"
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "查看",
      prop: "showInfo",
      solt: true,
      sortable: false
    },
    {
      label: "操作日志",
      prop: "operate",
      solt: true,
      sortable: false
    }
  ]
}

export const arriveConfirmOptions = {
  header: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
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
      label: "跟踪号",
      prop: "logisticsTrackNo"
    },
    {
      label: "FNsku",
      prop: "platformSkuCode"
    },
    {
      label: "单据数量",
      prop: "returnQuantity"
    },
    {
      label: "已到货数量",
      prop: "hasArriveQuantity"
    },
    {
      label: "本次到货数量",
      prop: "arriveQuantity",
      solt: true
    },
    {
      label: "关联单号",
      prop: "relationNo",
      solt: true
    },
    {
      label: "库位",
      prop: "stockLocationId",
      solt: true
    },
    {
      label: "处理方式",
      prop: "businessTypeDescribe",
      solt: true
    }
  ]
}
