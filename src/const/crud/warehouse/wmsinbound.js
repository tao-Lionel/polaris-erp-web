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
  maxHeight: document.body.clientHeight - 360, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  selection: true,
  dic: [],
  column: [
    {
      label: "送货单号",
      minWidth: 140,
      prop: "deliveryNo",
      solt: true,
      sortable: false
    },
    {
      label: "入库批次号",
      prop: "wmsInboundBatchNo",
      sortable: false
    },
    {
      label: "入库单号",
      prop: "wmsInboundNo",
      hidden: true,
      sortable: false
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      hidden: true,
      sortable: false
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false
    },
    {
      label: "入库状态",
      prop: "status",
      formatter: function (row, value, label, column) {
        if (row.status === "0") {
          return "未入库"
        } else {
          return "已入库"
        }
      }
    },
    {
      label: "入库时间",
      prop: "createTime",
      type: "date",
      format: "yyyy-MM-dd hh:mm:ss",
      valueFormat: "yyyy-MM-dd hh:mm:ss"
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNo"
    },
    {
      label: "制单员",
      prop: "inboundUserDisplayName",
      sortable: false
    },
    {
      label: "仓库名称",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "税别",
      prop: "taxType",
      formatter: function (row, value, label, column) {
        if (value == "1") {
          return "含税"
        }
        if (value == "2") {
          return "非税"
        }
        return ""
      }
    },
    // {
    //   label: '源签收编号',
    //   minWidth: 150,
    //   prop: 'wmsSignNo',
    // },
    {
      label: "合同编号",
      prop: "poContractNo"
    },
    {
      label: "采购员",
      minWidth: 90,
      prop: "displayname"
    }
  ]
}

export const inboundOption = {
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  pageFlag: true, //是否显示分页器
  column: [
    {
      label: "采购单号",
      prop: "purchaseCode"
    },
    {
      label: "送货单号",
      prop: "sendCode"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      prop: "skuName"
    },
    {
      label: "供应商",
      prop: "supplier"
    },
    {
      label: "平台",
      prop: "platformTypeName"
    },
    {
      label: "站点",
      prop: "sitName"
    },
    {
      label: "单价",
      prop: "price"
    },
    {
      label: "箱数",
      prop: "boxCount"
    },
    {
      label: "包装长*宽*高(cm)",
      prop: "packageLength"
    },
    {
      label: "包装体积(cm³)",
      prop: "packageVolume"
    },
    {
      label: "产品毛重",
      prop: "productWeight"
    },
    {
      label: "送货数量",
      prop: "sendCount"
    },
    {
      label: "入库数量",
      prop: "inboundCount",
      width: 120,
      slot: true,
      isNeed: true,
      type: "input"
    },
    {
      label: "库位",
      prop: "location",
      slot: true,
      isNeed: true,
      type: "select"
    }
  ]
}

export const deliveryOption = {
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  selection: false,
  header: false,
  maxHeight: 500,
  dic: [],
  column: [
    {
      label: "入库单号",
      minWidth: 140,
      prop: "inBoundNo",
      sortable: false
    },
    {
      label: "采购单号",
      minWidth: 140,
      prop: "purchaseOrderNo",
      sortable: false
    },
    {
      label: "送货单号",
      prop: "deliveryNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      minWidth: 160,
      sortable: false
    },
    {
      label: "产品名称",
      minWidth: 120,
      prop: "skuName",
      sortable: false
    },
    {
      label: "供应商",
      minWidth: 200,
      prop: "supplierName",
      sortable: false
    },
    {
      label: "平台",
      minWidth: 120,
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "币种",
      minWidth: 120,
      prop: "currency",
      sortable: false
    },
    {
      label: "单价",
      minWidth: 120,
      prop: "price",
      sortable: false
    },
    {
      label: "箱数",
      minWidth: 120,
      prop: "boxCount",
      sortable: false
    },
    {
      label: "包装长*宽*高(cm)",
      minWidth: 150,
      prop: "packageLength",
      formatter: function (row, value, label, column) {
        return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
      },
      sortable: false
    },
    {
      label: "包装体积(cm3)",
      minWidth: 120,
      prop: "packageVolume",
      sortable: false
    },
    {
      label: "产品毛重(kg)",
      prop: "skuGrossWeight",
      minWidth: 110,
      sortable: false
    },
    {
      label: "送货数量",
      minWidth: 150,
      prop: "deliveryQuantity",
      sortable: false
    },
    {
      label: "入库数量",
      minWidth: 120,
      prop: "inboundCount",
      sortable: false
    },
    {
      label: "库位",
      minWidth: 90,
      prop: "locationCode",
      sortable: false
    },
    {
      label: "入库时间",
      prop: "inBoundTime",
      minWidth: 150,
      sortable: false
    }
  ]
}
