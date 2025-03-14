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
  maxHeight: document.body.clientHeight - 410, //固定标题
  selection: true,
  menu: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
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
      label: "转货单号",
      prop: "changeNo",
      solt: true
    },
    {
      label: "单据日期",
      prop: "createTime"
    },
    {
      label: "仓库",
      prop: "warehouseName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "工厂SKU",
      prop: "skuCode"
    },
    // {
    //   label: '标准SPU',
    //   prop: 'spuCode',
    //
    // },
    // {
    //   label: '转出FNsku',
    //   prop: 'outPlatformSkuCode',
    // },
    // {
    //   label: '转入FNsku',
    //   prop: 'inPlatformSkuCode',
    // },
    // {
    //   label: '转货数量',
    //   prop: 'changeNumber',
    //   solt: true,
    //   minWidth: 120,
    // }, {
    //   label: '转货销售组',
    //   prop: 'outGroupName',
    // },
    // {
    //   label: '收货销售组',
    //   prop: 'inGroupName',
    // },
    // {
    //   label: '库内操作',
    //   prop: 'operaName',
    // },
    {
      label: "转出平台",
      prop: "outPlatform"
    },
    {
      label: "转出站点",
      prop: "outSite"
    },
    {
      label: "转出数量",
      prop: "changeNumber"
    },
    {
      label: "转入平台",
      prop: "inPlatform"
    },
    {
      label: "转入站点",
      prop: "inSite"
    },
    {
      label: "是否共享库存",
      prop: "sharedStock",
      solt: true
    },
    {
      label: "状态",
      prop: "statusDescribe",
      copy: false
    },
    {
      label: "创建人",
      prop: "createByName"
    },
    {
      label: "更新人",
      prop: "updateByName"
    },
    {
      label: "更新时间",
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
export const occupyDetailFormOption = {
  menu: false,
  header: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
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
      label: "单据编号",
      prop: "wmsInboundNo",
      sortable: false
    },
    {
      label: "数量",
      prop: "quantity",
      sortable: false
    },
    {
      label: "店铺",
      prop: "storeAccount",
      sortable: false
    },
    {
      label: "国家",
      prop: "countryShortName",
      sortable: false
    }
  ]
}

export const productRules = {
  corporationId: [{ required: true, message: "必须选择法人主体", trigger: "change" }],
  warehouseId: [{ required: true, message: "必须选择仓库", trigger: "change" }],
  // outPlatform: [{ required: true, message: "必须选择转出平台", trigger: "change" }],
  // outSite: [{ required: true, message: "必须选择转出站点", trigger: "change" }],
  inPlatform: [{ required: true, message: "必须选择转入平台", trigger: "change" }],
  inSite: [{ required: true, message: "必须选择转入站点", trigger: "change" }]
}
