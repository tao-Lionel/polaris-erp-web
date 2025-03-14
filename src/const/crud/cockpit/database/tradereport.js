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
/** US交易列表JS */
export const tableOption = {
  maxHeight: document.body.clientHeight - 410, //固定标题
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "订单编号",
      minWidth: 120,
      prop: "orderId"
    },
    {
      label: "日期",
      minWidth: 90,
      prop: "reportDate",
      type: "date",
      format: "yyyy-MM-dd"
    },
    {
      label: "账号",
      minWidth: 90,
      // prop: 'settlement',
      prop: "storeAccount"
    },
    {
      label: "站点",
      minWidth: 90,
      // prop: 'marketplace',
      prop: "countryCode"
    },
    {
      label: "订单类型",
      minWidth: 120,
      // prop: 'type',
      prop: "orderType"
    },
    {
      label: "标题",
      minWidth: 90,
      prop: "title"
    },
    {
      label: "Seller Sku",
      prop: "sellerSku"
    },
    {
      label: "sku",
      minWidth: 90,
      prop: "skuCode"
    },
    {
      label: "数量",
      minWidth: 90,
      prop: "quantity"
    },
    {
      label: "币别",
      minWidth: 90,
      prop: "currency"
    },
    {
      label: "销售额",
      minWidth: 90,
      prop: "productSales"
    },
    {
      label: "运费",
      minWidth: 90,
      prop: "shippingCredits"
    },
    {
      label: "礼品费用",
      minWidth: 120,
      prop: "giftWrapCredits"
    },
    {
      label: "促销金额",
      minWidth: 120,
      prop: "promotionalRebates"
    },
    {
      inex: 14,
      label: "积分成本",
      minWidth: 120,
      prop: "amazonIntegration"
    },
    {
      label: "消费税",
      minWidth: 90,
      prop: "salesTaxCollected"
    },
    {
      label: "平台代收税",
      minWidth: 130,
      prop: "marketplaceFacilitatorTax"
    },
    {
      label: "低价值商品",
      minWidth: 130,
      prop: "lowWorthCommodity"
    },
    {
      label: "佣金",
      minWidth: 90,
      prop: "salesCommission"
    },
    {
      label: "配送费",
      minWidth: 90,
      prop: "fbaFees"
    },
    {
      label: "其他交易费",
      minWidth: 120,
      prop: "otherTransactionFees"
    },
    {
      label: "其他费",
      minWidth: 90,
      prop: "other"
    },
    {
      label: "净收入",
      minWidth: 90,
      prop: "total"
    },
    {
      label: "渠道",
      minWidth: 90,
      prop: "fulfillment"
    },
    {
      label: "收货城市",
      minWidth: 120,
      prop: "orderCity"
    },
    {
      label: "收货州",
      minWidth: 90,
      prop: "orderState"
    },
    {
      label: "邮编",
      minWidth: 90,
      prop: "orderPostal"
    },
    {
      label: "来源",
      minWidth: 90,
      prop: "remark"
    },
    {
      label: "操作日志",
      minWidth: 120,
      prop: "operateLog",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const hiddenTableOption = {
  US: {
    name: ["amazonIntegration", "lowWorthCommodity"]
  },
  UK: {
    name: ["amazonIntegration", "salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  FR: {
    name: ["amazonIntegration", "salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  DE: {
    name: ["amazonIntegration", "salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  IT: {
    name: ["amazonIntegration", "salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  ES: {
    name: ["amazonIntegration", "salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  CA: {
    name: ["amazonIntegration", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  JP: {
    name: ["salesTaxCollected", "marketplaceFacilitatorTax", "lowWorthCommodity"]
  },
  AU: {
    name: ["amazonIntegration", "marketplaceFacilitatorTax"]
  }
}

export const uploadFormRules = {
  platformTypeId: [{ required: true, message: "请选择平台", trigger: "blur" }],
  bsePlatformSitId: [{ required: true, message: "请选择站点", trigger: "blur" }],
  storeId: [{ required: true, message: "请选择店铺", trigger: "blur" }],
  file: [{ required: true, message: "请选择文件", trigger: "blur" }]
}
