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
  column: [
    {
      label: "供应商编码",
      prop: "supplierNo"
    },
    {
      label: "账号类型：对公、香港",
      prop: "supplierAccountType"
    },
    {
      label: "账户名称（供应商名称）",
      prop: "accountName"
    },
    {
      label: "银行账号",
      prop: "accountNo"
    },
    {
      label: "开户行",
      prop: "openingBank"
    },
    {
      label: "开户行地址",
      prop: "openingAdress"
    },
    {
      label: "开户证明",
      prop: "openingCertif"
    },
    {
      label: "SWIFT地址",
      prop: "swiftAdress"
    },
    {
      label: "创建人",
      prop: "createBy"
    },
    {
      label: "最后更新人",
      prop: "updateBy"
    },
    {
      label: "是否删除 1：已删除  0：正常",
      prop: "delFlag"
    }
  ]
}
