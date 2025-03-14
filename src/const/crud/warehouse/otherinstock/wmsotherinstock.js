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
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  dic: [],
  column: [
    {
      label: "单据编号",
      prop: "orderNo",
      solt: true
    },
    {
      label: "法人主体",
      prop: "corporationName"
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
      label: "入库数量",
      prop: "sumInNum",
      solt: true
    },
    {
      label: "业务类别",
      prop: "businessTypeDescribe"
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
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "更新人",
      prop: "updateByName"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: "180px"
    },
    // {
    //   label: '销售组',
    //   prop: 'groupName'
    // },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "入库记录",
      prop: "operateLog",
      solt: true,
      sortable: false
    },
    {
      label: "入库日期",
      prop: "inboundTime"
    }
  ]
}

export const otherInStockDetailOption = {
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
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    // {
    //   label: '型号', sortable: false,
    //   prop: 'modelName'
    // },
    // {
    //   label: '平台', sortable: false,
    //   prop: 'platform',
    //   solt: true
    // },
    // {
    //   label: '站点', sortable: false,
    //   prop: 'site',
    //   solt: true
    // },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "数量",
      sortable: false,
      prop: "operateQuantity",
      solt: true,
      width: 150
    },
    {
      label: "含税",
      sortable: false,
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 2,
          label: "否"
        }
      ]
    },
    {
      label: "库位",
      sortable: false,
      prop: "stockLocation",
      solt: true,
      width: 150
    },
    // {
    //   label: '单价',
    //   prop: 'price',width:150,
    //   solt: true
    // },
    // {
    //   label: '金额',
    //   prop: 'money'
    // },
    {
      label: "操作",
      sortable: false,
      prop: "oprateHandle",
      solt: true,
      copy: false
    }
  ]
}

/**详情页table */
export const productTableOption = {
  enableLocalStorage: false,
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
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
    //   prop: 'platformSkuCode'
    // },
    {
      label: "标准SPU",
      prop: "spuCode"
    },
    {
      label: "sku",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      prop: "skuName"
    }
    // {
    //   label: '型号',
    //   prop: 'modelName'
    // },
    // {
    //   label: '平台',
    //   prop: 'platformTypeCode'
    // }
  ]
}
