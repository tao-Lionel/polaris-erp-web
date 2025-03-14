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
var validateNumber = (rule, value, callback) => {
  var reg = /^[0-9]*[1-9][0-9]*$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("只能输入正整数"))
  }
}

//处理环节
export const statusOptions = [
  {
    value: 0,
    label: "未处理"
  },
  {
    value: 1,
    label: "采购审核"
  },
  {
    value: 2,
    label: "审核通过"
  }
]

export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
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
      label: "撤销单号",
      prop: "requisitionRevokeNo",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "源请购单批次号",
      prop: "requisitionBatchNo",
      width: 190,
      sortable: false
    },
    {
      label: "源请购单号",
      prop: "requisitionNo",
      width: 150,
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      width: 150,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      minWidth: 120,
      sortable: false
    },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      width: 140,
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
      label: "平台",
      prop: "platformCode",
      width: 90,
      sortable: false
    },
    {
      label: "站点",
      prop: "sitCode",
      width: 90,
      sortable: false
    },
    {
      label: "原请购数量",
      prop: "oldRequisitionQuantity",
      minWidth: 150,
      sortable: false
    },
    {
      label: "撤销数量",
      prop: "revokeQuantity",
      minWidth: 120,
      sortable: false
    },
    {
      label: "新请购数量",
      prop: "newRequisitionQuantity",
      minWidth: 120,
      sortable: false
    },
    {
      label: "单据状态",
      prop: "status",
      solt: "status",
      minWidth: 120,
      sortable: false,
      copy: false
      // type: 'select',
      // dicData: [{
      //   value: 0,
      //   label: '未处理'
      // }, {
      //     value: 1,
      //     label: '采购审核'
      // }, {
      //     value: 2,
      //     label: '审核通过'
      // }]
    },
    {
      label: "撤销说明",
      prop: "remark",
      minWidth: 120,
      sortable: false
    },
    {
      label: "制单人",
      prop: "createName",
      minWidth: 90,
      sortable: false
    }
  ]
}

export let tableOptionCreate = {
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
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
      label: "源请购单批次号",
      prop: "requisitionBatchNo",
      width: 190,
      sortable: false
    },
    {
      label: "源请购单号",
      prop: "requisitionNo",
      sortable: false
    },
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
    // {
    //   label: '包装箱长宽高(cm)',
    //   prop: 'modelName',
    //   sortable:false,
    // },
    {
      label: "原请购数量",
      prop: "oldRequisitionQuantity",
      sortable: false
    },
    {
      label: "撤销数量",
      prop: "revokeQuantity",
      sortable: false,
      solt: true
      // rules: [
      //   { required: true, message: '数量不能为空' },
      //   { type: 'number', message: '请购数量必须为数字值' },
      //   { validator: validateNumber, message: '请购数量只能输入正整数', trigger: 'blur' }
      // ]
    },
    {
      label: "新请购数量",
      prop: "newRequisitionQuantity",
      solt: true,
      sortable: false
    },
    {
      label: "撤销说明",
      prop: "remark",
      solt: true,
      width: 240,
      sortable: false
      // rules: [
      //   { required: true, message: '说明不能为空，最多可输入200个字' }
      // ]
    },
    {
      label: "操作",
      prop: "oprateHandle",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}
