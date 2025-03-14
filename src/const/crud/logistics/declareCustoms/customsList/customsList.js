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
/** 报关单列表JS */
export const tableOption = {
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
  column: [
    {
      label: "报关单号",
      prop: "declareCustomNo",
      solt: true
    },
    {
      label: "单据日期",
      prop: "createTime",
      type: "date",
      format: "yyyy-MM-dd"
    },
    {
      label: "贸易国（地区）",
      prop: "tradeCountryName"
    },
    {
      label: "运抵国（地区）",
      prop: "destinateCountryName"
    },
    {
      label: "法人",
      prop: "corporationName"
    },
    {
      label: "类型",
      prop: "declareTypeId",
      solt: true
    },
    {
      label: "报关数量",
      prop: "declareQuantityTotal",
      minWidth: 120,
      solt: true
    },
    {
      label: "运输方式",
      prop: "transportModeName"
    },
    {
      label: "物流商",
      minWidth: 120,
      prop: "carrierShortName"
    },
    {
      label: "合同协议号",
      minWidth: 130,
      prop: "contractNumber"
    },
    {
      label: "海关单号",
      minWidth: 120,
      prop: "customsNumber",
      solt: true,
      formatter: function (row, value) {
        // console.log(getTokenUrl(row.annexFileAddr))
      }
    },
    {
      label: "状态",
      prop: "status",
      type: "select",
      dicData: [
        {
          label: "待审核",
          value: 0
        },
        {
          label: "待报关",
          value: 1
        },
        {
          label: "报关完成",
          value: 2
        }
      ]
    },
    {
      label: "关联单据",
      minWidth: 120,
      prop: "transferNo"
    },
    {
      label: "制单人",
      minWidth: 120,
      prop: "createByName"
    },
    {
      label: "关联发票",
      minWidth: 120,
      prop: "invoiceCode"
    },
    {
      label: "操作日志",
      prop: "operate",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

/**产品详情页table */
export const skuTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
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
      label: "sku",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "型号",
      sortable: false,
      prop: "modelName"
    },
    {
      label: "申报单价",
      sortable: false,
      prop: "declarePrice"
    },
    {
      label: "数量",
      sortable: false,
      prop: "declareQuantity"
    }
  ]
}
