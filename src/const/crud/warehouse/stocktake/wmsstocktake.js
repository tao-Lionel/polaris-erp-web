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
  index: false,
  menu: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "盘点单号",
      prop: "stockTakeNo",
      solt: true
    },
    {
      label: "仓库",
      prop: "warehouseName"
    },
    {
      label: "sku种类",
      prop: "skuTypeSum"
    },
    {
      label: "状态",
      prop: "statusDescribe",
      copy: false
    },
    {
      label: "关联单据",
      prop: "createdRelationNo",
      solt: true,
      copy: false
    },
    {
      label: "创建人",
      prop: "createByName"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "维护人",
      prop: "updateByName"
    },
    {
      label: "维护时间",
      prop: "updateTime"
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: true,
      sortable: false
    }
  ]
}

export const detailOption = {
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  menu: false,
  indexLabel: "序号",
  stripe: false,
  header: false,
  menuAlign: "center",
  align: "center",
  isMedia: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    // {
    //   label: 'FNSKU',sortable:false,
    //   prop: 'platformSkuCode'
    // },
    {
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName"
    },
    // {
    //   label: '平台', sortable: false,
    //   prop: 'platformTypeCode'
    // },
    {
      label: "库位",
      sortable: false,
      prop: "locationCode"
    },
    {
      label: "法人主体",
      sortable: false,
      prop: "corporationName"
    },
    // {
    //   label: '销售组', sortable: false,
    //   prop: 'groupName'
    // },
    {
      label: "系统库存",
      sortable: false,
      prop: "staticQuantity"
    },
    {
      label: "盘点库存",
      sortable: false,
      prop: "stockTakeQuantity"
    },
    {
      label: "差异库存",
      sortable: false,
      prop: "differenceQuantity"
    },
    {
      label: "仓库备注",
      sortable: false,
      prop: "remark"
    }
  ]
}

export const relationOption = {
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  menu: false,
  indexLabel: "序号",
  stripe: false,
  header: false,
  menuAlign: "center",
  align: "center",
  isMedia: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "单据编号",
      prop: "orderNo",
      sortable: false
    },
    {
      label: "单据类型",
      prop: "type",
      sortable: false
    }
  ]
}
