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
import { round } from "@/components/avue/utils/util"

export const tableOption = {
  maxHeight: document.body.clientHeight - 363, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "请购单批次号",
      prop: "requisitionBatchNo",
      sortable: false
    },
    {
      label: "采购单号",
      solt: true,
      prop: "purchaseOrderNo",
      sortable: false
    },
    // {
    //   label: '请购单编号',
    //   solt: true,
    //   prop: 'TODO',
    //   width:160,
    // },
    {
      label: "单据时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    // {
    //   label: "PO号",
    //   prop: "poCode",
    //
    // },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "产品",
      prop: "skuCount",
      solt: "skuCount",
      sortable: false,
      copy: false
    },
    {
      label: "总金额",
      prop: "amount",
      formatter(row, value, label, column) {
        if (!value) {
          return ""
        } else {
          return round(value)
        }
      }
    },
    {
      label: "稅别",
      prop: "taxType",
      sortable: false,
      formatter(row, value, label, column) {
        if (value == "1") {
          return "含税"
        } else if (value == "2") {
          return "非税"
        } else {
          return ""
        }
      }
    },
    {
      label: "币别",
      prop: "currency",
      sortable: false
    },
    {
      label: "价格模式",
      prop: "priceModel",
      sortable: false,
      sortable: false
    },
    {
      label: "入库仓",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "结算方式",
      prop: "settleaccountName",
      sortable: false
    },
    {
      label: "送货状态",
      prop: "deliveryStatus",
      sortable: false,
      formatter(row, value, label, column) {
        if (value == "0") {
          return "未送货"
        } else if (value == "1") {
          return "部分送货"
        } else if (value == "2") {
          return "全部送货"
        }
      }
    },
    {
      label: "订单状态",
      prop: "status",
      solt: true,
      sortable: false,
      copy: false
      // formatter(row, value , label, column){
      //   if(value=='0'){
      //     return '未处理'
      //   }else if(value=='1'){
      //     return '采购一审'
      //   }else if(value=='2'){
      //     return '采购二审'
      //   }else if(value=='3'){
      //     return '审核完成'
      //   }else{
      //     return ''
      //   }
      // }
    },
    {
      label: "付款状态",
      prop: "payStatus",
      sortable: false,
      formatter(row, value, label, column) {
        if (value == "0") {
          return "未付款"
        } else if (value == "1") {
          return "部分付款"
        } else if (value == "2") {
          return "付款完成"
        } else {
          return ""
        }
      }
    },
    {
      label: "入库状态",
      prop: "inboundStatus",
      solt: "inboundStatus",
      copy: false,
      sortable: false
      // formatter(row, value , label, column){
      //   if(value=='0'){
      //     return '未入库'
      //   }else if(value=='1'){
      //     return '部分入库'
      //   }else if(value=='2'){
      //     return '入库完成'
      //   }else{
      //     return ''
      //   }
      // }
    },
    {
      label: "合同状态",
      prop: "contractStatus",
      formatter(row, value, label, column) {
        if (value === 0) {
          return "未处理"
        } else if (value == 1) {
          return "财务审核"
        } else if (value == 2) {
          return "审核通过"
        } else {
          return ""
        }
      },
      sortable: false
    },
    {
      label: "合同编号",
      prop: "poContractNo",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "请款单号",
      prop: "requestAccountNo",
      solt: true,
      sortable: false
    },
    {
      label: "请购人",
      prop: "createByName",
      sortable: false
    },
    {
      label: "采购员",
      prop: "purchaseByName",
      sortable: false
    },
    {
      label: "采购组",
      prop: "purchaseGroupName",
      sortable: false
    },
    // {
    //   label: "备注",
    //   minWidth: 120,
    //   prop: "remarks"
    // },
    {
      label: "撤销状态",
      prop: "revokeStatus",
      sortable: false,
      formatter(row, value, label, column) {
        if (value == 0) {
          return "正常"
        } else if (value == 1) {
          return "异常"
        } else {
          return ""
        }
      }
    },
    {
      label: "操作",
      fixed: "right",
      solt: true,
      prop: "operation",
      sortable: false,
      width: 160,
      copy: false
    }
  ]
}

export const inboundOptions = {
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
      label: "采购单号",
      prop: "purchaseOrderNo",
      sortable: false
    },
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
      label: "采购数量",
      sortable: false,
      prop: "purchaseQuantity"
    },
    {
      label: "已入库数量",
      sortable: false,
      prop: "inboundQuantity"
    },
    {
      label: "未入库数量",
      sortable: false,
      prop: "unInboundQuantity"
    }
  ]
}

export const skuInfoDialogOption = {
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
  maxHeight: 400,
  dic: [],
  column: [
    // {
    //   label: '采购单号',
    //   prop: 'purchaseOrderNo'
    // },
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
      label: "采购数量",
      sortable: false,
      prop: "purchaseQuantity"
    },
    {
      label: "单价",
      sortable: false,
      prop: "price"
    },
    {
      label: "平台",
      sortable: false,
      prop: "platformCode"
    },
    {
      label: "站点",
      sortable: false,
      prop: "sitCode"
    },
    {
      label: "交易税率(%)",
      sortable: false,
      prop: "taxRate"
    },
    {
      label: "金额",
      sortable: false,
      prop: "total"
    },
    // {
    //   label: '已入库数量',
    //   prop: 'inboundQuantity'
    // },{
    //   label: '未入库数量',
    //   prop: 'unInboundQuantity'
    // },
    {
      label: "请购单号",
      sortable: false,
      prop: "requisitionNo"
    }
  ]
}

export let createOrderTableOption = {
  menu: false,
  maxHeight: 400,
  fixHeight: 400,
  selection: true,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  dic: [],
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      width: 160,
      sortable: false,
      formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else {
          return row.modelName
        }
      }
    },
    {
      label: "包装长宽高(cm)",
      width: 160,
      prop: "modelName",
      sortable: false,
      formatter(row, value, label, column) {
        if (row.packageLength && row.packageWidth && row.packageHeight) {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        } else {
          return row.modelName
        }
      }
    },
    {
      label: "请购数量",
      prop: "requisitionQuantity",
      sortable: false
    },
    {
      label: "非税单价",
      prop: "price",
      sortable: false
    },
    {
      label: "金额",
      prop: "amount",
      sortable: false
    },
    {
      label: "采购数量",
      prop: "purchaseQuantity",
      sortable: false
    },
    {
      label: "送货数量",
      prop: "deliveryQuantity",
      width: 120,
      solt: true,
      sortable: false
    },
    {
      label: "未送货数量",
      prop: "unDeliveryQuantity",
      width: 100,
      sortable: false
    }
    // {
    //   label: '出货柜号',
    //   prop: 'shippingContainerNo',
    //   width: 160,
    //   solt: true,
    //   sortable: false,
    // },
  ]
}

export let createContractTableOption = {
  border: true,
  selection: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  menu: false,
  pageFlag: false, //是否显示分页器
  dic: [],
  column: [
    {
      label: "合同条款名称",
      prop: "informationName",
      sortable: false
    }
  ]
}

export let setWarehouseTableOption = {
  menu: false,
  maxHeight: 400,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    // {
    //   label: '图片',
    //   prop: 'pic',
    //   solt: true,
    //   width: 90,
    //   sortable:false,
    // },
    {
      label: "仓库名称",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "仓库类型",
      prop: "warehouseTypeName",
      sortable: false
    },
    {
      label: "仓库服务商",
      prop: "providerName",
      sortable: false
    }
  ]
}
