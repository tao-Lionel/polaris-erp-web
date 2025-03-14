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
  indexLabel: "序号",
  stripe: true,
  isMedia: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  menu: false,
  selection: true,
  column: [
    {
      label: "合同编号",
      prop: "poContractNo",
      solt: true,
      overHidden: true,
      inputStyle: "width:150px"
    },
    {
      label: "合同日期",
      prop: "contractDate",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    },
    {
      label: "供应商",
      prop: "supplierName",
      inputStyle: "width:150px",
      overHidden: true,
      sortable: false
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false
    },
    {
      label: "法人主体",
      prop: "corporationName",
      overHidden: true,
      sortable: false
    },
    {
      label: "合同金额",
      prop: "amount",
      solt: true
    },
    {
      label: "交易币别",
      prop: "currency",
      sortable: false
    },
    {
      label: "结算方式",
      prop: "settleaccountName",
      sortable: false
    },
    {
      label: "合同状态",
      prop: "status",
      solt: true
      // formatter: (function (row, value, label, column) {
      //   if (value == 0) {
      //     return '未处理';
      //   } else if (value == 1) {
      //     return '财务审核'
      //   } else if (value == 2) {
      //     return '审核通过'
      //   } else {
      //     return value
      //   }
      // })
    },
    {
      label: "付款状态",
      prop: "payStatus",
      formatter: function (row, value, label, column) {
        if (value == 0) {
          return "未付款"
        } else if (value == 1) {
          return "部分付款"
        } else if (value == 2) {
          return "付款完成"
        } else {
          return value
        }
      }
    },
    // {
    //   label: '我司签章件',
    //   prop: 'existCompanyCertification',
    //   solt: true,
    // },
    {
      label: "对方回签件",
      prop: "existSupplierCertification",
      solt: true,
      sortable: false,
      width: 130
    },
    {
      label: "关联采购订单",
      prop: "purchaseOrderNo",
      solt: true,
      sortable: false
    },
    {
      label: "采购员",
      minWidth: 90,
      prop: "username",
      sortable: false
    },
    // {
    //   label: '采购组',
    //   minWidth:90,
    //   prop: 'groupName'
    // },
    {
      label: "交易税别",
      minWidth: 100,
      prop: "taxType",
      hidden: true
    },
    {
      label: "合同模板ID",
      minWidth: 120,
      prop: "contractTemplateId",
      hidden: true
    },
    {
      label: "创建人",
      prop: "createBy",
      minWidth: 90,
      hidden: true
    },
    {
      label: "最后更新人",
      prop: "updateBy",
      minWidth: 140,
      hidden: true
    },
    {
      label: "是否有效",
      minWidth: 120,
      prop: "delFlag",
      formatter: function (row, value, label, column) {
        if (value == 0) {
          return "有效"
        } else if (value == 1) {
          return "无效"
        }
      }
    }
  ]
}

export const inAndOutStockInfoDialogOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  header: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "SKU",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "入库数量",
      sortable: false,
      prop: "inStockQuantity"
    },
    {
      label: "出库数量",
      sortable: false,
      prop: "outStockQuantity"
    },
    {
      label: "结余数量",
      sortable: false,
      prop: "remainQuantity"
    }
  ]
}
