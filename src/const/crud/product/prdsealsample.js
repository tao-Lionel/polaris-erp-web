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
  maxHeight: document.body.clientHeight - 410, //固定标题
  border: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  selection: true,
  // height:"100%",
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "标准SPU",
      prop: "spuCode",
      search: false
      // overHidden: true
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      search: false,
      solt: true
      // overHidden: true
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      search: false
      // solt: true
      // overHidden: true
    },
    // {
    //   label: 'SKU名称',
    //   prop: 'skuName',
    //   width: '200px',
    //   search: false,
    //   // overHidden: true
    // },
    // {
    //   label: '型号',
    //   prop: 'modelName',
    //   // overHidden: true
    // },
    // {
    //   label: '开发人员',
    //   prop: 'developer',
    //   width: '120px',
    // },
    // {
    //   label: '源单编号',
    //   prop: 'invoiceNo',
    //   width: '150px',
    //   search: false,
    //   // overHidden: true
    // },
    {
      label: "产品名称",
      prop: "skuName"
    },
    {
      label: "产品长*宽*高(cm)",
      prop: "skuLength",
      // editVisdiplay: false,
      formatter: function (row, value, label, column) {
        if (row.skuLength == null && row.skuWidth == null && row.skuHeight == null) {
          return null
        } else {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        }
      }
    },
    {
      label: "包装长*宽*高(cm)",
      prop: "packageLength",
      // editVisdiplay: false,
      formatter: function (row, value, label, column) {
        if (row.packageLength == null && row.packageWidth == null && row.packageHeight == null) {
          return null
        } else {
          return row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight
        }
      }
    },
    {
      label: "包装体积(m³)",
      prop: "packageVolume"
    },
    {
      label: "外箱长*宽*高(cm)",
      prop: "outerBoxLength",
      // editVisdiplay: false,
      formatter: function (row, value, label, column) {
        if (row.outerBoxLength == null && row.outerBoxWidth == null && row.outerBoxHeight == null) {
          return null
        } else {
          return row.outerBoxLength + "*" + row.outerBoxWidth + "*" + row.outerBoxHeight
        }
      }
    },
    {
      label: "外箱体积(m³)",
      prop: "outerBoxVolume"
    },
    {
      label: "产品净重(kg)",
      prop: "skuWeight"
      // editVisdiplay: false,
      // formatter: function (row, value, label, column) {
      //   if (row.skuWeight == null && row.skuGrossWeight == null) {
      //     return null
      //   } else {
      //     return row.skuWeight + "/" + row.skuGrossWeight
      //   }
      // }
    },
    {
      label: "产品毛重(kg)",
      prop: "skuGrossWeight"
    },
    {
      label: "装箱数量",
      prop: "boxs"
    },
    {
      label: "外箱重量(kg)",
      prop: "boxGrossWeight"
    },
    // {
    //   label: '单箱数',
    //   prop: 'boxs',
    // },
    // {
    //   label: 'FOB采购价格(USD)',
    //   prop: 'purchasePrice',
    // },
    // {
    //   label: "打托数",
    //   prop: "palletNumber"
    // },
    {
      label: "封样状态",
      prop: "dataStatus",
      solt: true,
      // editVisdiplay: false,
      copy: false
    },
    {
      label: "封样时间/开发人员",
      width: 180,
      prop: "developer", // createTime
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      solt: true
    },
    {
      label: "操作日志",
      prop: "operateLog",
      solt: true,
      sortable: false
    }
  ]
}
