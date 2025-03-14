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
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    //   width: '150'
    // },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      prop: "site"
    },
    {
      label: "SKU",
      prop: "skuCode",
      width: "100"
    },
    {
      label: "SKU名称",
      prop: "skuName",
      width: "150"
    },
    {
      label: "仓库名称",
      prop: "warehouseName",
      width: "150"
    },
    // {
    //   label: '销售组',
    //   prop: 'groupName',
    //   width: '100'
    // },
    {
      label: "法人主体名称",
      prop: "corporationName",
      width: "200"
    },

    {
      label: "关联单号",
      prop: "relationNo",
      width: "180"
    },
    {
      label: "业务类型",
      prop: "recordTypeName",
      width: "120"
    },
    {
      label: "操作数量",
      prop: "quantity"
    },
    {
      label: "是否含税",
      minWidth: 110,
      prop: "taxTypeDescribe"
    },
    {
      label: "采购单价",
      minWidth: 110,
      prop: "poPrice"
    },
    {
      label: "本位币",
      minWidth: 110,
      prop: "defaultPrice"
    },
    {
      label: "交易币别",
      minWidth: 110,
      prop: "currency"
    },
    {
      label: "库位代码",
      minWidth: 110,
      prop: "locationCode"
    },
    {
      label: "创建人名称",
      prop: "createByName",
      width: "140"
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: "180"
    }
  ]
}
