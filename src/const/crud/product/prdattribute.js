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
  maxHeight: document.body.clientHeight - 445, //固定标题
  border: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menu: false,
  // align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  selection: true,
  dic: [],
  localStorageSymbol: "C", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    {
      label: "优先级",
      prop: "sortNumber",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      search: false,
      width: 100,
      sortable: false
    },
    {
      label: "属性名称",
      prop: "attributeName",
      search: false,
      slot: true,
      width: 200,
      sortable: false
    },
    {
      label: "属性值，简码",
      prop: "attributeValues",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "系统属性",
      prop: "systemStatus",
      type: "select",
      sortable: false,
      width: 120,
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
      label: "操作",
      prop: "operateValue",
      solt: true,
      width: 150,
      sortable: false,
      copy: false
    }
  ]
}
