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
 * Author: wangxiaowen (AukeyIT@aukeys.com)
 */

export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menu: false,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  selection: true,
  dic: [],
  column: [
    {
      label: "单据编码",
      prop: "invoiceNo",
      solt: true
    },
    // {
    //   label: '单据日期',
    //   prop: 'createTime',
    //   minWidth:120,
    // },
    {
      label: "标准SPU",
      prop: "spuCode"
    },
    {
      label: "产品名称",
      prop: "spuName"
    },
    {
      label: "品牌",
      prop: "brandName"
    },
    {
      label: "品类",
      prop: "categoryName"
    },
    // {
    //   label: '型号',
    //   prop: 'modelName',
    // },
    // {
    //   label: '销售组',
    //   prop: 'saleGroupName',
    //   minWidth:100,
    // },
    {
      label: "处理环节",
      prop: "processStep",
      type: "select",
      minWidth: 120,
      dicData: [
        {
          label: "未处理",
          value: 0
        },
        {
          label: "销售审核",
          value: 1
        },
        {
          label: "开发审核",
          value: 2
        },
        {
          label: "财务审核",
          value: 3
        },
        {
          label: "审核完成",
          value: 4
        }
      ]
    },
    {
      label: "创建人/创建时间",
      prop: "createName",
      width: 180,
      solt: true
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: true,
      sortable: false
    }
  ]
}
