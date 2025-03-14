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

//条码
export const isBarcodeOptions = [
  {
    value: 1,
    label: "否"
  },
  {
    value: 2,
    label: "是"
  }
]
//库内操作选项
export const operationOptions = [
  {
    value: 1,
    label: "无"
  },
  {
    value: 2,
    label: "换条码换箱唛"
  },
  {
    value: 3,
    label: "换箱唛"
  },
  {
    value: 4,
    label: "换条码"
  }
]
//状态
export const transferStatusOptions = [
  {
    value: 1,
    label: "草稿"
  },
  {
    value: 8,
    label: "主管审核"
  },
  {
    value: 2,
    label: "物流审核"
  },
  {
    value: 3,
    label: "待发货"
  },
  {
    value: 4,
    label: "在途"
  },
  {
    value: 6,
    label: "部分到货"
  },
  {
    value: 5,
    label: "已完成"
  },
  {
    value: 7,
    label: "强制完成"
  }
]

//报关单状态
export const declareCustomNoTypeOptions = [
  {
    value: 1,
    label: "已生成"
  },
  {
    value: 2,
    label: "未生成"
  },
  {
    value: 3,
    label: "不必生成"
  }
]

//申报类型
export const declareTypeOptions = [
  {
    value: 1,
    label: "自贸通报关"
  },
  {
    value: 2,
    label: "自主报关"
  },
  {
    value: 3,
    label: "工厂报关"
  }
]
//页面切换配置
export const tabPosition = {
  0: {
    transferStatusArr: [1, 2, 3, 4, 5, 6, 7, 8], //全部订单
    count: 0
  },
  1: {
    transferStatusArr: [1], //草稿【草稿状态】
    count: 0
  },
  2: {
    transferStatusArr: [2], //物流审核【物流审核】
    count: 0
  },
  3: {
    transferStatusArr: [3], //待发货【待发货状态】
    count: 0
  },
  4: {
    transferStatusArr: [4, 6], //在途【在途状态 + 部分到货状态】
    count: 0
  },
  5: {
    transferStatusArr: [5, 7], //已完成【已完成状态 + 强制完成状态】
    count: 0
  },
  6: {
    transferStatusArr: [8], //主管审核【主管审核】
    count: 0
  }
}

//隐藏表格属性---根据调拨类型：注意，这里---1-国内调海外，2-国内调FBA，3-海外调FBA，4-海外互转，5-国内互转
export const hiddenTableOptionTransferType = {
  1: {
    name: ["stockLocationId", "shipmentid"]
  },
  2: {
    name: ["stockLocationId"]
  },
  3: {
    name: ["declareType", "declareCustomNo", "stockLocationId"]
  },
  4: {
    name: ["declareType", "declareCustomNo", "stockLocationId", "shipmentid"]
  },
  5: {
    name: ["declareType", "declareCustomNo", "logisticsNo", "shipmentid"]
  }
}

//隐藏表格属性---根据切换页面标签：注意，这里---0-全部订单，1-草稿，2-物流审核，3-待发货，4-在途，5-已完成，6-主管审核
export const hiddenTableOptionTabPosition = {
  0: {
    name: ["outStockTime"]
  },
  1: {
    name: [
      "declareType",
      "declareCustomNo",
      "carrierShortName",
      "deliveryQuantity",
      "logisticsNo",
      "receivingQuantity",
      "outStockTime"
    ]
  },
  2: {
    name: [
      "declareType",
      "declareCustomNo",
      "carrierShortName",
      "deliveryQuantity",
      "logisticsNo",
      "receivingQuantity",
      "outStockTime"
    ]
  },
  3: {
    name: ["declareCustomNo", "deliveryQuantity", "logisticsNo", "receivingQuantity", "outStockTime"]
  },
  4: {
    name: []
  },
  5: {
    name: []
  },
  6: {
    name: [
      "declareType",
      "declareCustomNo",
      "carrierShortName",
      "deliveryQuantity",
      "logisticsNo",
      "receivingQuantity",
      "outStockTime"
    ]
  }
}

// 税别
export const taxTypeOptions = [
  {
    value: 1,
    label: "全部退税"
  },
  {
    value: 2,
    label: "非税"
  },
  {
    value: 3,
    label: "部分退税"
  }
]

export const tableOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "调拨单号",
      prop: "transferNo",
      solt: true
    },
    {
      label: "发货仓",
      minWidth: 90,
      prop: "warehouseOutName"
    },
    {
      label: "目的仓",
      minWidth: 90,
      prop: "warehouseInName"
    },
    {
      label: "法人",
      prop: "corporationName"
    },
    {
      label: "平台SKU种类",
      prop: "skuCount",
      solt: true
    },
    {
      label: "总数量",
      minWidth: 90,
      prop: "transferQuantity"
    },
    {
      label: "总箱数",
      minWidth: 90,
      prop: "transferBoxs"
    },
    {
      label: "状态",
      prop: "transferStatus",
      type: "select",
      dicData: transferStatusOptions
    },
    {
      label: "退税",
      prop: "taxType",
      type: "select",
      dicData: taxTypeOptions
    },
    {
      label: "申报类型",
      minWidth: 120,
      prop: "declareType",
      type: "select",
      dicData: declareTypeOptions
    },
    {
      label: "报关单号",
      minWidth: 120,
      prop: "declareCustomNo"
    },
    {
      label: "运输方式",
      minWidth: 120,
      prop: "transportModeName"
    },
    {
      label: "Shipmentid",
      prop: "shipmentid"
    },
    {
      label: "物流商",
      minWidth: 90,
      prop: "carrierShortName"
    },
    {
      label: "总体积（m³）",
      width: 150,
      prop: "volume",
      formatter: function (row, value, label, column) {
        if (value) {
          return value.toFixed(6)
        }
        return ""
      }
    },
    {
      label: "总重量（KG）",
      width: 150,
      prop: "boxWeight",
      formatter: function (row, value, label, column) {
        if (value) {
          return value.toFixed(5)
        }
        return ""
      }
    },
    {
      label: "实发数量",
      minWidth: 120,
      prop: "deliveryQuantity"
    },
    {
      label: "到货数量",
      minWidth: 120,
      prop: "receivingQuantity"
    },

    {
      label: "创建人",
      minWidth: 90,
      prop: "createByName"
    },
    {
      label: "创建时间",
      minWidth: 120,
      prop: "createTime"
    },
    {
      label: "物流单号",
      minWidth: 120,
      prop: "logisticsNo"
    },
    {
      label: "确认发货时间",
      minWidth: 120,
      prop: "outStockTime"
    },
    {
      label: "操作",
      prop: "operateLog",
      solt: true,
      width: 150,
      sortable: false,
      copy: false
    }
  ]
}

/**详情页table */
export const handleTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "平台SKU",
      prop: "platformSkuCode",
      sortable: false
    },
    {
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "型号",
      sortable: false,
      prop: "modelName"
    },
    {
      label: "货品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "调拨数量",
      sortable: false,
      prop: "transferQuantity",
      solt: true,
      width: 150
    },
    {
      label: "箱数",
      sortable: false,
      prop: "transferBoxs",
      solt: true,
      width: 150
    },
    {
      label: "含税",
      sortable: false,
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 2,
          label: "否"
        }
      ]
    },
    {
      label: "法人id",
      prop: "corporationId",
      hidden: true
    },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "长",
      sortable: false,
      prop: "boxLength",
      hidden: true
    },
    {
      label: "宽",
      sortable: false,
      prop: "boxWidth",
      hidden: true
    },
    {
      label: "高",
      sortable: false,
      prop: "boxHeight",
      hidden: true
    },
    {
      label: "单箱体积",
      sortable: false,
      prop: "volume",
      hidden: true
    },
    {
      label: "单箱体积（长/宽/高/m³）",
      sortable: false,
      prop: "boxLength",
      formatter: function (row, value, label, column) {
        if (value) {
          return value / 100
        }
        return ""
      }
    },
    {
      label: "",
      prop: "boxWidth",
      sortable: false,
      formatter: function (row, value, label, column) {
        if (value) {
          return value / 100
        }
        return ""
      }
    },
    {
      label: "",
      prop: "boxHeight",
      sortable: false,
      formatter: function (row, value, label, column) {
        if (value) {
          return value / 100
        }
        return ""
      }
    },
    {
      label: "",
      prop: "volume",
      sortable: false
    },
    {
      label: "单箱重量（KG）",
      width: 140,
      sortable: false,
      prop: "boxWeight",
      formatter: function (row, value, label, column) {
        if (value) {
          return value / 1000
        }
        return ""
      }
    },
    {
      label: "库位",
      sortable: false,
      prop: "locationCode",
      hidden: true
    },
    {
      label: "条码",
      sortable: false,
      prop: "isBarcode",
      solt: true
    },
    {
      label: "操作",
      sortable: false,
      prop: "oprateHandle",
      solt: true,
      copy: false
    }
  ]
}

/**详情页table */
export const productTableOption = {
  enableLocalStorage: false,
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "sku",
      prop: "skuCode"
    },
    {
      label: "sku名称",
      prop: "skuName"
    },
    {
      label: "库位",
      prop: "locationCode"
    },
    {
      label: "可用数量",
      prop: "availableQuantity"
    },
    {
      label: "含税",
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ]
    },
    {
      label: "法人id",
      prop: "corporationId",
      hidden: true
    },
    {
      label: "法人主体",
      prop: "corporationName"
    }
  ]
}

/**详情页table */
export const stockoutTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "sku",
      prop: "skuCode"
    },
    {
      label: "含税",
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ]
    },
    {
      label: "调拨数量",
      prop: "transferQuantity"
    },
    {
      label: "箱数",
      prop: "boxs",
      solt: true,
      width: 100
    },
    {
      label: "发货数量",
      prop: "quantity",
      solt: true,
      width: 100
    },
    {
      label: "箱规（长/宽/高/m）",
      prop: "boxLength",
      solt: true,
      width: 100
    },
    {
      label: "",
      prop: "boxWidth",
      solt: true,
      width: 100
    },
    {
      label: "",
      prop: "boxHeight",
      solt: true,
      width: 100
    },
    {
      label: "单箱重量（KG）",
      prop: "boxWeight",
      solt: true,
      width: 140
    }
  ]
}

/**详情页table */
export const confirmArrivalTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "sku",
      prop: "skuCode"
    },
    {
      label: "含税",
      prop: "taxType",
      type: "select",
      dicData: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ]
    },
    {
      label: "实发数量",
      prop: "deliveryQuantity"
    },
    {
      label: "实发箱数",
      prop: "deliveryBoxs"
    },
    {
      label: "已到货数量",
      prop: "receivingQuantity"
    },
    {
      label: "已到货箱数",
      prop: "receivingBoxs"
    },
    {
      label: "到货数量",
      prop: "currentReceivingQuantity",
      solt: true,
      width: 150
    },
    {
      label: "到货箱数",
      prop: "currentReceivingBoxs",
      solt: true,
      width: 150
    },
    {
      label: "库位",
      prop: "stockLocationId",
      solt: true,
      width: 150
    }
  ]
}

/**产品详情页table */
export const skuTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "平台SKU",
      sortable: false,
      prop: "platformSkuCode"
    },
    {
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "调拨数量",
      sortable: false,
      prop: "transferQuantity"
    },
    {
      label: "出库数量",
      sortable: false,
      prop: "deliveryQuantity"
    },
    {
      label: "到货数量",
      sortable: false,
      prop: "receivingQuantity"
    },
    {
      label: "法人",
      sortable: false,
      prop: "corporationName"
    }
  ]
}
