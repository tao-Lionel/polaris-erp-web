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
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  // isMedia:true,
  menu: false,
  dialogWidth: "450px",
  labelWidth: 92, //弹出框label的宽度
  formIsInline: true, //是否设为同一行
  localStorageSymbol: "A", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    {
      label: "品牌id",
      prop: "brandId",
      editVisdiplay: false,
      addVisdiplay: false,
      hidden: true
    },
    {
      label: "品牌名称",
      prop: "brandName",
      span: 24,
      maxlength: "30",
      rules: [
        {
          required: true,
          message: "品牌名称不能为空",
          trigger: "blur"
        },
        {
          min: 1,
          max: 30,
          message: "品牌名称不得超过30位字符",
          trigger: "blur"
        }
      ]
    },
    {
      label: "备注",
      prop: "remark",
      type: "textarea",
      maxlength: "200",
      span: 24,
      rules: [
        {
          min: 0,
          max: 200,
          message: "备注不得超过200位字符",
          trigger: "blur"
        }
      ]
    },
    {
      label: "创建人",
      prop: "displayName",
      editVisdiplay: false,
      addVisdiplay: false
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: true,
      editVisdiplay: false,
      addVisdiplay: false,
      width: 100,
      sortable: false
    },
    {
      label: "操作",
      prop: "brandSolt",
      solt: true,
      editVisdiplay: false,
      addVisdiplay: false,
      width: 120,
      sortable: false,
      copy: false
    }
  ]
}
