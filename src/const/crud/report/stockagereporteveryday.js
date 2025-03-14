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
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "快照时间",
      prop: "backUpDate",
      type: "datetime",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      width: "150"
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    //   width:'150',
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
      width: "120"
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
    {
      label: "销售组",
      prop: "groupName",
      width: "100"
    },
    {
      label: "法人主体",
      prop: "corporationName",
      width: "200"
    },
    {
      label: "0-30天库龄",
      prop: "dateDiff30",
      width: "150"
    },
    {
      label: "31-90天库龄",
      prop: "dateDiff90",
      width: "150"
    },
    {
      label: "91-180天库龄",
      prop: "dateDiff180",
      width: "150"
    },
    {
      label: "181-270天库龄",
      prop: "dateDiff270",
      width: "150"
    },
    {
      label: "271-365天库龄",
      prop: "dateDiff365",
      width: "150"
    },
    {
      label: "366天以上库龄",
      prop: "dateDiff366",
      width: "150"
    }
  ]
}
