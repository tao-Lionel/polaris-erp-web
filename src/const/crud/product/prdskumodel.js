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
  enableLocalStorage: false,
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
  dialogWidth: "450px",
  labelWidth: 92, //弹出框label的宽度
  formIsInline: true, //是否设为同一行
  menu: false,
  column: [
    {
      label: "id",
      prop: "modelId",
      hidden: true,
      editVisdiplay: false,
      addVisdiplay: false
    },
    {
      label: "型号名称",
      prop: "modelName",
      span: 24,
      rules: [
        {
          required: true,
          message: "型号名称",
          trigger: "blur"
        },
        {
          min: 1,
          max: 150,
          message: "型号名称不得超过150位字符",
          trigger: "blur"
        }
      ]
    },
    {
      label: "备注",
      prop: "remark",
      type: "textarea",
      span: 24,
      rules: [
        {
          min: 0,
          max: 200,
          message: "型号名称不得超过200位字符",
          trigger: "blur"
        }
      ]
    },
    {
      label: "创建时间",
      prop: "createTime",
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "创建人",
      prop: "createByName",
      addVisdiplay: false,
      editVisdiplay: false
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
      prop: "modelSolt",
      solt: true,
      editVisdiplay: false,
      addVisdiplay: false,
      width: 120,
      sortable: false,
      copy: false
    }
  ]
}
