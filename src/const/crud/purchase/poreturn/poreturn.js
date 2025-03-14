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
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  expand: true,
  column: [
    {
      label: "单据编号",
      prop: "returnNo",
      solt: "returnNo",
      sortable: false
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      sortable: false
    },
    {
      label: "单据时间",
      prop: "createTime"
    },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "退货货值",
      prop: "returnValueTotal"
    },
    {
      label: "出库时间",
      prop: "outStockTime"
    },
    // {
    //   label: '退款金额',
    //   prop: 'refundMoneyTotal',
    //   minWidth:120,
    // },
    {
      label: "单据状态",
      prop: "status",
      solt: "status",
      copy: false,
      formatter(row, value, label, column) {
        if (value == "0") {
          return "未处理"
        } else if (value == "1") {
          return "采购审核"
        } else if (value == "2") {
          return "财务审核"
        } else if (value == "3") {
          return "审核完成"
        } else {
          return ""
        }
      }
    },
    // {
    //   label: '退款处理方式',
    //   minWidth:150,
    //   prop: 'refundMode',
    //   formatter(row, value , label, column){
    //     if(value=='0'){
    //       return '现金收款'
    //     }else if(value=='1'){
    //       return '记为应收'
    //     }else{
    //       return ''
    //     }
    //   }
    // },
    {
      label: "采购组",
      prop: "purchaseGroupName"
    },
    {
      label: "币别",
      prop: "currency"
    },
    {
      label: "制单人",
      minWidth: 100,
      prop: "createName"
    },
    {
      label: "退货备注",
      prop: "remark",
      sortable: false
    }
  ]
}
