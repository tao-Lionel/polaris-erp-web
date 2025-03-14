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
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "明细id",
      prop: "changeDetailId"
    },
    {
      label: "采购变革单号",
      prop: "poOrderChangeNo"
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo"
    },
    {
      label: "采购单明细id",
      prop: "poDetailId"
    },
    {
      label: "sku id",
      prop: "skuId"
    },
    {
      label: "sku数量",
      prop: "skuQuantity"
    },
    {
      label: "单价",
      prop: "price"
    },
    {
      label: "sku总金额",
      prop: "skuAmount"
    },
    {
      label: "创建人",
      prop: "createBy"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "最后更新人",
      prop: "updateBy"
    },
    {
      label: "最后更新时间",
      prop: "updateTime"
    },
    {
      label: "是否删除 1：已删除  0：正常",
      prop: "delFlag"
    }
  ]
}

export const rules = {
  skuQuantity: [{ required: true, message: "数量至少大于0", trigger: "blur" }],
  price: [{ required: true, message: "价格至少大于0", trigger: "blur" }]
}
//  export const returnAmountRules=[
//     { required: true, message: '退款金额至少大于0', trigger: 'blur' }
//   ]
