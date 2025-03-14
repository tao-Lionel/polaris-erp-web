"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.createOrderTableOption = exports.tableOptionCreate = exports.tableOption = exports.statusOptions = void 0

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

/**请购数量 */
var validateNumber = function validateNumber(rule, value, callback) {
  var reg = /^[0-9]*[1-9][0-9]*$/

  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("只能输入正整数"))
  }
} // //处理环节
// export const statusOptions = [{
//   value: 0,
//   label: '未处理'
// }, {
//   value: 1,
//   label: '销售一审'
// },
// {
//   value: 8,
//   label: '销售二审'
// },{
//   value: 9,
//   label: '销售三审'
// },{
//   value: 2,
//   label: '生成订单'
// }, {
//   value: 3,
//   label: '订单处理'
// }, {
//   value: 4,
//   label: '合同处理'
// }, {
//   value: 5,
//   label: '未入库'
// }, {
//   value: 6,
//   label: '部分入库'
// }, {
//   value: 7,
//   label: '入库完成'
// }]
//处理环节

var statusOptions = [
  {
    value: 0,
    label: "待提交"
  },
  {
    value: 1,
    label: "已提交"
  },
  {
    value: 2,
    label: "审核通过"
  },
  {
    value: 3,
    label: "部分转单"
  },
  {
    value: 4,
    label: "生成订单"
  }
]
exports.statusOptions = statusOptions
var tableOption = {
  menu: false,
  selection: true,
  border: true,
  searchShow: true,
  //搜索栏开关
  searchAdvanced: true,
  //高级搜索栏开关，默认关闭
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
    {
      label: "请购单批次号",
      prop: "requisitionBatchNo",
      solt: true,
      
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      
    },
    {
      label: "单据时间",
      prop: "requisitionDate",
      
    }, // {
    //   label: 'SKU',
    //   prop: 'skuCode',
    //   solt: true,
    //   
    // },
    // {
    //   label: 'SKU名称',
    //   prop: 'skuName',
    //   minWidth:120,
    // },
    // {
    //   label: '型号',
    //   prop: 'modelName'
    // },
    // {
    //   label: '规格',
    //   prop: 'specification'
    // },
    {
      label: "请购数量",
      prop: "requisitionQuantity",
      
    },
    {
      label: "实采数量",
      prop: "purchaseQuantity",
      
    },
    {
      label: "实入数量",
      prop: "inboundQuantity",
      
    }, // {
    //   label: '已录交货计划数量',
    //   prop: 'alreadyPlanQuantity',
    //   minWidth:120,
    // },
    {
      label: "供应商",
      prop: "supplierName",
      solt: true,
      
    },
    {
      label: "法人主体",
      prop: "corporationName",
      
    }, // {
    //   label: '税别',
    //   prop: 'taxType',
    //   type: 'select',
    //   dicData: [{
    //     value: 1,
    //     label: '含税'
    //   }, {
    //     value: 2,
    //     label: '非税'
    //   }]
    // },
    // {
    //   label: '币别',
    //   prop: 'currency'
    // },
    // {
    //   label: '采购价',
    //   prop: 'priceStr',
    //   solt: true,
    //   minWidth:100,
    // },
    {
      label: "关联采购单号",
      prop: "purchaseOrderNo",
      width: 150,
      solt: true
    },
    {
      label: "请购人",
      prop: "createByName",
      
    },
    {
      label: "处理环节",
      prop: "statusName",
      width: 120 // solt:true,
      // type: 'select',
      // dicData: statusOptions,
    }, // {
    //   label: '开发员',
    //   prop: 'maintainerName',
    //   minWidth:100,
    // },
    {
      label: "采购员",
      prop: "purchaseByName",
      
    }, // {
    //   label: '请购组',
    //   prop: 'requisitionGroupName',
    //   minWidth:100,
    // },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "撤销状态",
      prop: "revokeStatus",
      minWidth: 120,
      type: "select",
      dicData: [
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "异常"
        }
      ]
    }
  ]
}
exports.tableOption = tableOption
var tableOptionCreate = {
  cancelFixedTop: true,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true,
  //搜索栏开关
  searchAdvanced: false,
  //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  tip: false,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "请购单号",
      prop: "requisitionNo",
      sortable: false,
      
    },
    {
      label: "SKU",
      prop: "skuCode",
      solt: true,
      width: 220,
      sortable: false,
      rules: [
        {
          required: true,
          message: "请选择sku"
        }
      ]
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false,
      
    }, // {
    //   label: '型号',
    //   prop: 'modelName',
    //   sortable:false,
    //   width: 120,
    // },
    // {
    //   label: '规格',
    //   prop: 'specification',
    //   sortable:false,
    // },
    {
      label: "产品长宽高(cm)",
      prop: "skuLength",
      width: 160,
      sortable: false,
      formatter: function formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else if (row.modelName) {
          return row.modelName
        } else {
          return ""
        }
      }
    },
    {
      label: "包装长宽高(cm)",
      prop: "packageLength",
      width: 160,
      sortable: false,
      formatter: function formatter(row, value, label, column) {
        if (row.packageLength && row.packageWidth && row.packageHeight) {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        } else {
          return ""
        }
      }
    },
    {
      label: "请购数量",
      prop: "requisitionQuantity",
      sortable: false,
      solt: true,
      width: 250,
      rules: [
        {
          required: true,
          message: "数量不能为空"
        },
        {
          type: "number",
          message: "请购数量必须为数字值"
        },
        {
          validator: validateNumber,
          message: "请购数量只能输入正整数",
          trigger: "blur"
        }
      ]
    }, // {
    //   label: '销售期望交期',
    //   sortable:false,
    //   prop: 'expectDelivery',
    //   width:200,
    //   solt: true,
    //   rules: [
    //     { required: true, message: '请选择销售期望交期' }
    //   ]
    // },
    {
      label: "平台",
      prop: "platformCode",
      sortable: false,
      solt: true,
      width: 150,
      rules: [
        {
          required: true,
          message: "请选择平台"
        }
      ]
    },
    {
      label: "站点",
      prop: "sitCode",
      sortable: false,
      solt: true,
      width: 150,
      rules: [
        {
          required: true,
          message: "请选择站点"
        }
      ]
    },
    {
      label: "PO号",
      prop: "poCode",
      sortable: false,
      solt: true,
      
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false,
      solt: true,
      
    },
    {
      label: "商品备注",
      sortable: false,
      prop: "remarks",
      solt: true,
      width: 240 // rules: [
      //   { required: true, message: '说明不能为空，最多可输入200个字' }
      // ]
    },
    {
      label: "单据备注",
      sortable: false,
      prop: "notes",
      solt: true,
      width: 240 // rules: [
      //   { required: true, message: '说明不能为空，最多可输入200个字' }
      // ]
    },
    {
      sortable: false,
      label: "操作",
      prop: "oprateHandle",
      solt: true,
      copy: false
    }
  ]
}
exports.tableOptionCreate = tableOptionCreate
var createOrderTableOption = {
  menu: false,
  maxHeight: 400,
  selection: true,
  border: true,
  searchShow: true,
  //搜索栏开关
  searchAdvanced: false,
  //高级搜索栏开关，默认关闭
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
      label: "SKU",
      prop: "skuCode",
      width: 100,
      sortable: false
    },
    {
      label: "产品长宽高(cm)",
      prop: "skuLength",
      width: 160,
      sortable: false,
      formatter: function formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else if (row.modelName) {
          return row.modelName
        } else {
          return ""
        }
      }
    },
    {
      label: "包装长宽高(cm)",
      prop: "packageLength",
      width: 160,
      sortable: false,
      formatter: function formatter(row, value, label, column) {
        if (row.packageLength && row.packageWidth && row.packageHeight) {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        } else {
          return ""
        }
      }
    },
    {
      label: "请购数量",
      prop: "requisitionQuantity",
      sortable: false
    },
    {
      label: "已采数量",
      prop: "purchaseQuantity",
      sortable: false
    },
    {
      label: "实采数量",
      prop: "thisPurchaseQuantity",
      width: 120,
      solt: true,
      sortable: false
    },
    {
      label: "采购明细备注",
      prop: "remarks",
      width: 180,
      solt: true,
      sortable: false
    } // {
    //   label: '请购数量',
    //   prop: 'requisitionQuantity',
    //   sortable:false,
    //   solt: true,
    //   width:300,
    //   rules: [
    //     { required: true, message: '数量不能为空' },
    //     { type: 'number', message: '请购数量必须为数字值' },
    //     { validator: validateNumber, message: '请购数量只能输入正整数', trigger: 'blur' }
    //   ]
    // },
  ]
}
exports.createOrderTableOption = createOrderTableOption
