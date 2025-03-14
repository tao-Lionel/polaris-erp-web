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
  menu: false,
  selection: true,
  border: true,
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
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      prop: "skuName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "海关编号",
      prop: "customsCode"
    },
    {
      label: "海关名称",
      prop: "customsName"
    },
    {
      label: "海关名称（英文）",
      prop: "customsNameEn"
    },
    {
      label: "法定退税率",
      prop: "legalRefundRate"
    },
    {
      label: "海关法定单位",
      prop: "customsLegalUnit"
    },
    {
      label: "品牌",
      prop: "brandName"
    },
    {
      label: "规格",
      prop: "specification"
    },
    {
      label: "材质",
      prop: "material"
    },
    {
      label: "用途",
      prop: "application"
    },
    {
      label: "申报要素",
      prop: "declarationElement"
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: "operateLog",
      sortable: false
    }
  ]
}
