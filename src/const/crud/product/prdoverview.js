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
import { getDetails } from "@/api/product/prdsku"

var validateSkuCode = (rule, value, callback) => {
  getDetails(value).then((response) => {
    if (window.boxType === "add") callback()
    let result = response.data.data
    if (result !== null) {
      callback(new Error("SKUCODE已经存在"))
    } else {
      callback()
    }
  })
}

export const tableOption = {
  border: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    // {
    //   label: 'SKU品类ID',
    //   prop: 'categoryId'
    // },
    {
      label: "SKUCODE",
      prop: "skuCode",
      editVisdiplay: false,
      rules: [
        {
          required: true,
          message: "SKUCODE不能为空",
          trigger: "blur"
        },
        {
          min: 3,
          max: 20,
          message: "长度在 3 到 20 个字符",
          trigger: "blur"
        },
        { validator: validateSkuCode, trigger: "blur" }
      ]
    },
    {
      label: "SKU名称",
      prop: "skuName",
      rules: [
        {
          required: true,
          message: "SKU名称不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      label: "品类",
      prop: "categoryId",
      formsolt: true,
      solt: true,
      rules: [
        {
          required: true,
          message: "品类不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      label: "型号",
      prop: "model",
      rules: [
        {
          required: true,
          message: "型号不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      label: "是否带电",
      prop: "isIncludingBattery",
      type: "select",
      solt: true,
      rules: [
        {
          required: true,
          message: "请选择状态",
          trigger: "blur"
        }
      ],
      dicData: [
        {
          label: "否",
          value: 0
        },
        {
          label: "是",
          value: 1
        }
      ]
    },
    {
      label: "图片",
      prop: "picAddr",
      formsolt: true,
      solt: true,
      hide: true
    },
    {
      label: "产品描述",
      prop: "prdDescription",
      type: "textarea",
      minRows: 6,
      span: 24
    },
    {
      label: "创建人",
      prop: "createByName",
      editDisabled: true,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      addVisdiplay: false,
      editDisabled: true,
      editVisdiplay: false
    },
    // {
    //   label: '最后更新人',
    //   prop: 'updateBy'
    // },
    // {
    //   label: '最后更新时间',
    //   prop: 'updateTime'
    // },
    {
      label: "状态",
      prop: "delFlag",
      type: "select",
      addVisdiplay: false,
      editVisdiplay: false,
      dicData: [
        {
          label: "正常",
          value: "0"
        },
        {
          label: "已删除",
          value: "1"
        }
      ]
    }
  ]
}
