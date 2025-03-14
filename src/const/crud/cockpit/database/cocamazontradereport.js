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
      label: "ID",
      prop: "id"
    },
    {
      label: "日期",
      prop: "reportDate"
    },
    {
      label: "账户-店铺账号",
      prop: "settlement"
    },
    {
      label: "订单类型",
      prop: "type"
    },
    {
      label: "订单编号",
      prop: "orderId"
    },
    {
      label: "SellerSku",
      prop: "sellerSku"
    },
    {
      label: "标题",
      prop: "title"
    },
    {
      label: "购买数量",
      prop: "quantity"
    },
    {
      label: "站点",
      prop: "marketplace"
    },
    {
      label: "配送渠道",
      prop: "fulfillment"
    },
    {
      label: "收货城市",
      prop: "orderCity"
    },
    {
      label: "收货州",
      prop: "orderState"
    },
    {
      label: "邮编",
      prop: "orderPostal"
    },
    {
      label: "销售总额",
      prop: "productSales"
    },
    {
      label: "运费",
      prop: "shippingCredits"
    },
    {
      label: "礼品金额",
      prop: "giftWrapCredits"
    },
    {
      label: "亚马逊积分成本",
      prop: "amazonIntegration"
    },
    {
      label: "促销扣除金额",
      prop: "promotionalRebates"
    },
    {
      label: "消费税",
      prop: "salesTaxCollected"
    },
    {
      label: "销售佣金",
      prop: "salesCommission"
    },
    {
      label: "低价值商品",
      prop: "lowWorthCommodity"
    },
    {
      label: "平台代收税",
      prop: "marketplaceFacilitatorTax"
    },
    {
      label: "亚马逊配送费",
      prop: "fbaFees"
    },
    {
      label: "其他交易收费",
      prop: "otherTransactionFees"
    },
    {
      label: "其他",
      prop: "other"
    },
    {
      label: "合计净收入",
      prop: "total"
    },
    {
      label: "导入时间",
      prop: "exportDate"
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "平台站点ID",
      prop: "bsePlatformSitId"
    },
    {
      label: "店铺ID",
      prop: "storeId"
    },
    {
      label: "SKU_ID",
      prop: "skuId"
    },
    {
      label: "类型细分ID",
      prop: "orderTypeDetailId"
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
