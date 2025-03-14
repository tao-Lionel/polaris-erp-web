/*
 *    Copyright (c) 2018-2025, aukeyit All rights reserved.
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
 * Author: aukeyit (aukeyit@aukeyit.com)
 */
import { getDetails } from "@/api/admin/user"

// var validateUserAccount = (rule, value, callback) => {
//   getDetails(value).then(response => {
//     if (window.boxType === 'edit') callback()
//     let result = response.data.data
//     if (result !== null) {
//       callback(new Error('用户账号已经存在'))
//     } else {
//       callback()
//     }
//   })
// }

var validateUsername = (rule, value, callback) => {
  getDetails(value).then((response) => {
    if (window.boxType === "edit") callback()
    let result = response.data.data
    if (result !== null) {
      callback(new Error("用户名已经存在"))
    } else {
      callback()
    }
  })
}

export const tableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  border: true,
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  column: [
    {
      label: "id",
      prop: "userId",
      span: 24,
      hide: true,
      editDisabled: true,
      addVisdiplay: false
    },
    {
      label: "姓名",
      prop: "displayname",
      editDisabled: true,
      // overHidden: true,
      // solt: true,
      span: 24,
      rules: [
        { required: true, message: "请输入用户名" },
        { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
        { validator: validateUsername, trigger: "blur" }
      ]
    },
    {
      label: "用户账号",
      prop: "username",
      editDisabled: true,
      minWidth: 120,
      // overHidden: true,
      // solt: true,
      span: 24,
      rules: [
        { required: true, message: "请输入用户账号" },
        { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
      ]
    },

    {
      label: "职务",
      prop: "userPositionName",
      type: "select",
      solt: true,
      span: 24,
      minWidth: "200px",
      copy: false
    },

    {
      label: "功能权限",
      prop: "roleFunction",
      solt: true,
      span: 24,
      minWidth: 120,
      sortable: false
      // overHidden: true,
    },
    {
      label: "品类权限",
      prop: "categoryNames",
      solt: true,
      span: 24,
      minWidth: 120,
      sortable: false
      // overHidden: true,
    },
    {
      label: "品牌权限",
      prop: "brandNames",
      solt: true,
      span: 24,
      minWidth: 120,
      sortable: false
      // overHidden: true,
    },
    {
      label: "店铺权限",
      prop: "baseStoreNames",
      solt: true,
      span: 24,
      minWidth: 120,
      sortable: false
      // overHidden: true,
    },
    {
      label: "仓库权限",
      prop: "warehouses",
      solt: true,
      span: 24,
      minWidth: 120,
      sortable: false
      // overHidden: true,
    },
    {
      label: "性别",
      prop: "genders",
      align: "center",
      type: "radio"
    },
    {
      label: "手机号",
      prop: "phone",
      type: "phone"

      // overHidden: true,
    },
    // {
    //   label: '状态',
    //   prop: 'lockFlag',
    //   type: 'select',
    //   solt: true,
    //   span: 24,
    //   rules: [{
    //     required: true,
    //     message: '请选择状态',
    //     trigger: 'blur'
    //   }],
    //   dicData: [{
    //     label: '有效',
    //     value: '0'
    //   }, {
    //     label: '锁定',
    //     value: '9'
    //   }]
    // },
    {
      label: "状态",
      prop: "lockFlag",
      type: "select",
      editDisabled: true,
      solt: true,
      span: 24,
      copy: false
    },
    {
      width: 180,
      label: "注册时间",
      prop: "createTime",
      type: "datetime",
      //format: 'yyyy/MM/dd',
      //valueFormat: 'yyyy/MM/dd',
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    }
  ]
}

export const warehouseOption = {
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
      label: "仓库名称",
      prop: "warehouseName",
      span: 24
    },
    {
      label: "仓库类型",
      prop: "warehouseTypeName",
      span: 24
    },
    {
      label: "备注",
      prop: "remark",
      span: 24
    }
  ]
}

export const storeOption = {
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
      label: "店铺名称",
      prop: "storeAccount",
      span: 24
    },
    {
      label: "备注",
      prop: "remark",
      span: 24
    }
  ]
}
