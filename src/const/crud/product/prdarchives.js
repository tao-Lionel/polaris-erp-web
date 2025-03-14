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
// import { getDetail } from '@/api/product/prdskucategory'
// var validateCategoryPid = (rule, value, callback) => {
//   if (window.boxType === 'edit') {
//     console.info(value)
//     callback(new Error('父级品类不可选择自己或子级'))
//   }
//   callback()
// }

export const tableOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
  // height:750,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  column: [
    {
      label: "主图",
      prop: "imageUrl",
      sortable: false,
      solt: true,
      width: 110
    },
    {
      label: "标准SPU",
      prop: "spuCode",
      sortable: true,
      slotHeader: "spuCodeHeader",
      width: 180
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      slotHeader: "standardSkuCodeHeader",
      sortable: true,
      width: 180
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      slotHeader: "skuCodeHeader",
      solt: true,
      sortable: true,
      width: 180
    },
    {
      label: "版本号",
      prop: "skuGrade",
      solt: false,
      width: 80,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: true,
      slotHeader: "skuNameHeader"
    },
    {
      label: "品牌",
      prop: "brandName",
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "产品定位",
      prop: "productPositioning",
      sortable: false
    },
    {
      label: "销售状态",
      prop: "saleStatus",
      sortable: false
      // solt: true,
    },
    {
      label: "采购状态",
      prop: "purchaseStatus",
      sortable: false
    },
    {
      label: "封样状态",
      prop: "sampleStatus",
      sortable: false
    },
    {
      label: "产品长*宽*高(cm)",
      prop: "productSize",
      sortable: false
    },
    {
      label: "包装长*宽*高(cm)",
      prop: "wrapperSize",
      sortable: false
    },
    {
      label: "包装体积(cm³)",
      prop: "packageVolume",
      sortable: false
    },
    {
      label: "外箱长*宽*高(cm)",
      prop: "outsideWrapperSize",
      sortable: false
    },
    {
      label: "外箱体积(cm³)",
      prop: "outerBoxVolume",
      sortable: false
    },
    {
      label: "产品净重(kg)",
      prop: "skuWeight",
      sortable: false
    },
    {
      label: "产品毛重(kg)",
      prop: "skuGrossWeight",
      sortable: false
    },

    {
      label: "装箱数量",
      prop: "boxs",
      sortable: false
    },
    {
      label: "外箱重量(kg)",
      prop: "boxGrossWeight",
      sortable: false
    },
    // {
    //   label: "产品重量(kg)",
    //   prop: "skuWeight",
    //   width: 170,
    //   sortable: false
    // },
    // {
    //   label: "币种",
    //   prop: "currency",
    //   sortable: false,
    // },
    // {
    //   label: "含税价",
    //   prop: "includedTax",
    //   width: 100,
    //   sortable: false,
    // },
    // {
    //   label: "非税价",
    //   prop: "noIncludedTax",
    //   width: 100,
    //   sortable: false,
    // },

    // {
    //   label: "销售组",
    //   prop: "saleGroupName",
    //   sortable: false,
    //
    // },
    // {
    //   label: "托盘规格",
    //   prop: "palletSpec",
    //   sortable: false,
    //   solt: true
    // },
    // {
    //   label: "打托数",
    //   prop: "palletNumber",
    //   sortable: false
    // },
    {
      label: "创建人/创建时间",
      prop: "createName",
      solt: true,
      sortable: false,
      width: 180
    },
    // {
    //   label: '创建时间',
    //   prop: 'createTime',
    //   sortable: false,
    // },
    {
      label: "更新人/更新时间",
      prop: "updateName",
      solt: true,
      sortable: false,
      width: 180
    },
    // {
    //   label: '更新时间',
    //   prop: 'updateTime',
    //   sortable: true,
    // },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      width: 80,
      fixed: "right",
      copy: false
    }
  ]
}

// 销售状态 0-正常,1-停售,2-清仓,3-暂停
export const saleStatusOption = {
  0: "正常",
  1: "停售",
  2: "清仓",
  3: "暂停"
}
