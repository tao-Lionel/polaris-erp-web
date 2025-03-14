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
  maxHeight: document.body.clientHeight - 370, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  isMedia: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menue: false,
  selection: true,
  menu: false,
  dic: [],
  column: [
    {
      label: "验货单号",
      prop: "inspectionNo",
      solt: true
    },
    {
      label: "单据时间",
      prop: "createTime",
      type: "date",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd"
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "验货地址",
      prop: "inspectionAdress"
    },
    {
      label: "验货联系方式",
      prop: "callphone"
    },
    {
      label: "验货SKU",
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      prop: "skuName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "计划验货数量",
      prop: "planQuantity"
    },
    {
      label: "实际验货数量",
      prop: "actualQuantity"
    },
    {
      label: "单据状态",
      minWidth: 120,
      prop: "status",
      solt: true
      // formatter:function(row, value , label, column){
      //   if(value == 0){
      //     return "未处理"
      //   }
      //   if(value == 1){
      //     return "已安排"
      //   }
      //   if(value == 2){
      //     return "已验货"
      //   }
      // }
    },
    {
      label: "验货结果",
      minWidth: 120,
      prop: "inspectionResult",
      formatter: function (row, value, label, column) {
        if (value == 0) {
          return "合格"
        }
        if (value == 1) {
          return "不合格"
        }
      }
    },
    {
      label: "验货详情",
      minWidth: 120,
      prop: "information"
    },
    {
      label: "制单人",
      minWidth: 90,
      prop: "createName"
    },
    {
      label: "验货员",
      minWidth: 90,
      prop: "inspector"
    },
    {
      label: "验货时间",
      minWidth: 120,
      prop: "inspectionDate",
      type: "date",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd"
    },
    {
      label: "验货文件",
      minWidth: 120,
      prop: "attachFile",
      solt: true
    }
  ]
}

export const subtableOption = {
  enableLocalStorage: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  menue: false,
  selection: false,
  menu: false,
  dic: [],
  column: [
    {
      label: "明细表id",
      prop: "inspectionDetailId",
      hide: true
    },
    {
      label: "验货SKU",
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      prop: "skuName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "计划验货数量",
      prop: "planQuantity"
    },
    {
      label: "实际验货数量",
      prop: "actualQuantity",
      solt: true,
      width: "160px"
    },
    {
      label: "验货结果",
      prop: "inspectionResult",
      solt: true,
      width: "230px"
    },
    {
      label: "验货详情",
      prop: "information",
      solt: true,
      width: "260px"
    }
  ]
}
