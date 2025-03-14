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
// import { getDetail } from '@/api/product/prdskucategory'
// var validateCategoryPid = (rule, value, callback) => {
//   if (window.boxType === 'edit') {
//     console.info(value)
//     callback(new Error('父级品类不可选择自己或子级'))
//   }
//   callback()
// }

export const tableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  // selection:true,
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menuWidth: "100",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dialogWidth: "450px", //dialog宽度
  labelWidth: 90, //弹出框label的宽度
  formIsInline: true, //是否设为同一行
  dic: [],
  localStorageSymbol: "B", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    {
      label: "品类ID",
      prop: "categoryId",
      editVisdiplay: false,
      addVisdiplay: false,
      hidden: true
    },
    {
      label: "父级品类",
      prop: "categoryPid",
      // formsolt: false,
      // solt: false,
      hidden: true,
      editVisdiplay: false,
      addVisdiplay: false
      // rules: [{ validator: validateCategoryPid, trigger: 'blur' }]
    },
    {
      label: "品类代码",
      prop: "categoryCode",
      span: 24, //设置col的占比
      rules: [
        {
          required: true,
          message: "品类名称不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      label: "品类名称",
      prop: "categoryName",
      searchInputTrim: true,
      span: 24,
      rules: [
        {
          required: true,
          message: "品类名称不能为空",
          trigger: "blur"
        }
      ]
    },
    {
      label: "父级品类",
      prop: "categoryPidName",
      formsolt: true,
      span: 24,
      editVisdiplay: false,
      addVisdiplay: false
    },
    {
      label: "创建人",
      prop: "createByName",
      editVisdiplay: false,
      addVisdiplay: false
    },
    {
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      editVisdiplay: false,
      addVisdiplay: false
    },
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
    },
    {
      label: "操作",
      prop: "operation",
      width: 100,
      solt: true
    }
  ]
}
