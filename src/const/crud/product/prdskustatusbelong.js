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
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menuWidth: 150,
  align: "center",
  refreshBtn: true,
  menu: false,
  showClomnuBtn: false,
  searchSize: "mini",
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  dicUrl: [],
  selection: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "标准SPU",
      prop: "spuCode"
    },
    {
      label: "工厂SKU",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      prop: "skuName"
    },
    {
      label: "开发人员",
      prop: "developer"
    },
    {
      label: "开发组",
      prop: "developGroupName"
    },
    {
      label: "开发维护人员",
      prop: "maintainer"
    },
    {
      label: "所属采购组",
      prop: "buyerGroupName"
    },
    {
      label: "采购员",
      prop: "buyer"
    },
    // {
    //   label: "采购主体",
    //   prop: "sitEnNameWithCorporationVos",
    //   solt: true,
    //   minWidth: 120
    // },
    // {
    //   label: '所属销售组', width: 120,
    //   prop: 'groupName'
    // },
    {
      label: "销售状态",
      width: 120,
      prop: "saleStatus",
      formatter: function (row, value, label, column) {
        switch (value) {
          case 0:
            return "正常"
          case 1:
            return "停售"
          case 2:
            return "清仓"
          case 3:
            return "暂停"
          case 4:
            return "待启用"
          default:
            return "-"
        }
      }
    },
    {
      label: "采购状态",
      width: 120,
      prop: "purchaseState",
      formatter: function (row, value, label, column) {
        switch (value) {
          case 0:
            return "允许采购"
          case 1:
            return "禁止采购"
          default:
            return "-"
        }
      }
    },
    {
      label: "操 作",
      prop: "btnGroup",
      solt: true,
      width: 100,
      sortable: false,
      fixed: "right",
      copy: false
    }
  ]
}

/**切换开发组信息 验证 */
export const switchDevelopGroupRules = {
  developGroupId: [{ required: true, message: "请选择开发组", trigger: "blur" }],
  maintainerId: [{ required: true, message: "请选择开发维护人", trigger: "blur" }]
}

/**切换采购组验证 */
export const switchBuyerGroupRules = {
  buyerGroupId: [{ required: true, message: "请选择采购组", trigger: "blur" }],
  buyerId: [{ required: true, message: "请选择采购员", trigger: "blur" }]
}
