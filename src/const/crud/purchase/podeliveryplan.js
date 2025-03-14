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
  column: [
    {
      label: "交货计划单号",
      prop: "deliveryPlanNo"
    },
    {
      label: "请购单号",
      prop: "requisitionNo"
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "请购数量",
      prop: "requisitionQuantity"
    },
    {
      label: "实采数量",
      minWidth: 120,
      prop: "actualPurchaseQuantity"
    },
    {
      label: "销售组",
      minWidth: 90,
      prop: "requisitionGroupName"
    },
    {
      label: "原期望交货日期",
      prop: "oldExpectDelivery"
    },
    {
      label: "销售员",
      minWidth: 90,
      prop: "requisitionUserName"
    },
    {
      label: "采购员",
      minWidth: 90,
      prop: "purchaseUserName"
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo"
    },
    {
      label: "合同编号",
      prop: "poContractNo"
    },
    {
      label: "提交时间",
      prop: "submitTime"
    },
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "店铺",
      prop: "platformAccountName"
    },
    {
      label: "站点",
      prop: "sitName"
    },
    {
      label: "期望交货日期",
      prop: "expectDeliveryDate"
    },
    {
      label: "期望交货数量",
      prop: "expectDeliveryQuantity"
    },
    {
      label: "入库数量",
      minWidth: 120,
      prop: "inboundQuantity"
    },
    {
      label: "采购确认状态",
      solt: true,
      width: 150,
      prop: "purchaseConfirmStatus"
      // formatter(row, value , label, column){
      //   if(value==0){
      //     return '未处理'
      //   }else if(value==1){
      //     return '待确认';
      //   }else if(value==2){
      //     return '已确认';
      //   }else{
      //     return '';
      //   }
      // }
    },
    {
      label: "送货状态",
      solt: true,
      width: 120,
      prop: "deliveryStatus",
      formatter(row, value, label, column) {
        if (value == "0") {
          return "未送货"
        } else if (value == "1") {
          return "部分送货"
        } else if (value == "2") {
          return "全部送货"
        } else {
          return ""
        }
      }
    },
    {
      label: "采购备注",
      prop: "remarks",
      solt: "remarks",
      sortable: false
    }
  ]
}

export const deliveryInfoOptions = {
  header: false,
  showSearchBtn: false,
  border: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "auto",
  size: "mini",
  paginationLayout: "prev, pager, next",
  columnBtn: false,
  resetBtn: false,
  tip: false,
  column: [
    {
      label: "送货单号",
      sortable: false,
      prop: "deliveryNo"
    },
    {
      label: "送货时间",
      sortable: false,
      prop: "createTime"
    },
    {
      label: "送货数量",
      sortable: false,
      prop: "deliveryQuantity"
    },
    {
      label: "入库数量",
      sortable: false,
      prop: "inboundQuantity"
    },
    {
      label: "入库状态",
      sortable: false,
      prop: "inboundStatus",
      formatter: function (row, value, label, column) {
        if (value == 0) {
          return "未入库"
        } else if (value == 1) {
          return "部分入库"
        } else if (value == 2) {
          return "全部入库"
        } else {
          return ""
        }
      }
    }
  ]
}

export const createDeliveryPlanOption = {
  enableLocalStorage: false,
  highlightCurrentRow: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
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
      label: "请购单号",
      prop: "requisitionNo"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "请购数量",
      prop: "requisitionQuantity"
    },
    {
      label: "实采数量",
      prop: "actualPurchaseQuantity"
    },
    {
      label: "已交货计划数量",
      prop: "expectDeliveryQuantityAll"
    },
    {
      label: "未入交货计划数量",
      prop: "unExpectDeliveryQuantityAll"
    },
    {
      label: "销售组",
      prop: "requisitionGroupName"
    },
    {
      label: "原期望交货日期",
      prop: "oldExpectDelivery"
    },
    {
      label: "销售员",
      prop: "requisitionUserName"
    },
    {
      label: "采购员",
      prop: "purchaseUserName"
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo"
    },
    {
      label: "合同编号",
      prop: "poContractNo"
    }
  ]
}

export const rowDeliveryPlanOption = {
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  dic: [],
  column: [
    {
      label: "平台SKU",
      prop: "platformSkuCode",
      solt: "platformSkuCode",
      width: 150
    },
    {
      label: "店铺",
      prop: "platformAccountName"
    },
    {
      label: "站点",
      prop: "sitName"
    },
    {
      label: "期望交货数量",
      prop: "expectDeliveryQuantity",
      solt: "expectDeliveryQuantity",
      width: 120
    },
    {
      label: "期望交货日期",
      prop: "expectDeliveryDate",
      solt: "expectDeliveryDate",
      width: 200
    },
    {
      label: "交货计划单号",
      prop: "deliveryPlanNo"
    },
    {
      label: "采购确认状态",
      prop: "purchaseConfirmStatus",
      formatter(row, value, label, column) {
        if (value == 0) {
          return "未处理"
        } else if (value == 1) {
          return "待确认"
        } else if (value == 2) {
          return "已确认"
        } else {
          return ""
        }
      }
    },
    {
      label: "提交时间",
      prop: "submitTime",
      type: "datetime"
    },
    {
      label: "操作",
      prop: "operate",
      solt: "operate",
      copy: false
    }
  ]
}
