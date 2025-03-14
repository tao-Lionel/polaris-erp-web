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
//F:\window7\2019\git\work\commit\uiProduct\trobs-ui\src\util\util.js
import { isNulls } from "@/util/util"
import { validateCN } from "@/util/validate"

//自定义校验规则
var validatePass = (rule, value, callback) => {
  var req = /^\d{0,5}$/
  var reg = new RegExp(req)
  if (reg.test(value) && !isNulls(value)) {
    callback()
  } else {
    callback(new Error("请输入5位自然数"))
  }
}
var validatePass2 = (rule, value, callback) => {
  // var req = /^([0-9]{0,2})?(\.[0-9]{0,2})?$/;
  var req = /^\d{1,2}$/
  var reg = new RegExp(req)
  if (reg.test(value) && parseInt(value) >= 0 && parseInt(value) <= 16) {
    callback()
  } else {
    callback(new Error("请输入0-16整数"))
  }
}
var validatePassVat = (rule, value, callback) => {
  // var req = /^([0-9]{0,2})?(\.[0-9]{0,2})?$/;
  var req = /^\d{1,2}$/
  var reg = new RegExp(req)
  if (reg.test(value) && parseInt(value) >= 1 && parseInt(value) <= 13) {
    callback()
  } else {
    callback(new Error("请输入1-13整数"))
  }
}
var validatePass3 = (rule, value, callback) => {
  var req = /^([0-9]{0,12})?(\.[0-9]{0,2})?$/
  var reg = new RegExp(req)
  if (reg.test(value) && !isNulls(value)) {
    callback()
  } else {
    callback(new Error("2位小数,12位整数"))
  }
}

/**验证sku code */
var validateSkuCode = (rule, value, callback) => {
  //验证是否包含中文
  if (value && validateCN(value)) {
    callback(new Error("只支持字母/数字/特殊符号"))
  } else {
    callback()
  }
}

export const tableOption = {
  enableLocalStorage: false,
  border: true,
  // index: false,
  // indexLabel: '序号',
  // stripe: true,
  // menuAlign: 'center',
  // menu:false,
  // align: 'center',
  // editBtn: false,
  // delBtn: false,
  // addBtn: false,
  // selection: false,
  // page:false,
  menuWidth: 80,
  page: false,
  align: "center",
  menuAlign: "center",
  editBtn: false,
  // menu:false,
  header: false,
  cancelFixedTop: true,
  dic: [],
  column: [
    // {
    //     label:'操作',
    //     prop:''
    // },
    {
      label: "产品属性",
      prop: "skuAttributes",
      sortable: false
      // width: "200"
    },
    {
      label: "工厂SKU",
      sortable: false,
      prop: "skuCode",
      solt: true,
      // width: "180",
      rules: [
        { required: true, message: "不能为空", trigger: "blur" },
        { validator: validateSkuCode, trigger: "blur" }
      ]
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName",
      solt: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }]
      // width: "180"
    } /*{
            label:'采购周期(d)',
            prop:'purchaseCycle',
            solt:true,
            width: '180',
        },{
            label:'规格参数',
            prop:'specification',
            solt:true,
            width: '120',
        },{
            label:'功能需求',
            prop:'funcRequire',
            solt:true,
            width: '120',
        },{
            label:'认证需求',
            prop:'approveRequire',
            solt:true,
            width: '120',
        },{
            label:'包装清单',
            prop:'packList',
            solt:true,
            width: '120',
        },{
            label:'其他描述',
            prop:'otherDescribe',
            solt:true,
            width: '120',
        },*/,
    {
      label: "产品定位",
      sortable: false,
      prop: "productPositioning",
      solt: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      width: "160",
      copy: false
    },
    {
      label: "基本信息",
      sortable: false,
      prop: "baseInfo",
      solt: true,
      width: "120",
      copy: false
    },
    /*{
            label:'申报要素',
            prop:'elementsCustoms',
            solt:true,
            width: '130',
        },*/ {
      label: "附件",
      sortable: false,
      prop: "signList",
      width: "120",
      solt: true,
      copy: false
    },
    {
      label: "图片",
      sortable: false,
      prop: "pictureDe",
      width: "120",
      solt: true,
      copy: false
    }
  ]
}

//预计采购价表
export const purchaseOption = {
  enableLocalStorage: false,
  cancelFixedTop: true,
  menuWidth: 80,
  page: false,
  align: "center",
  menu: false,
  header: false,
  dic: [],
  border: true,
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      width: "120",
      sortable: false
    },
    {
      label: "SKU名称",
      prop: "skuName",
      sortable: false
    },
    // {
    //   label: '引入产品的供应商',
    //   prop: 'supplierName',
    //   solt: true, sortable: false,
    //   width: '180',
    //   rules: [
    //     { required: true, message: '请选择供应商', trigger: 'blur' }
    //   ]
    // },
    {
      label: "币别",
      prop: "currencyCode",
      solt: true,
      width: 150,
      sortable: false,
      rules: [{ required: true, message: "请选择币别", trigger: "blur" }]
    },
    {
      label: "交易税别",
      prop: "taxType",
      width: 150,
      sortable: false,
      solt: true,
      rules: [{ required: true, message: "请选择交易税别", trigger: "blur" }]
    },
    {
      label: "含税单价",
      prop: "taxPrice",
      width: "150",
      sortable: false,
      solt: true,
      rules: [
        // { required: true, message: '不能为空' },
        { validator: validatePass3, trigger: "blur" }
      ]
    },
    {
      label: "交易税率",
      prop: "taxRate",
      width: "150",
      solt: true,
      sortable: false,
      rules: [
        // { required: true, message: '不能为空' },
        { validator: validatePass2, trigger: "blur" }
      ]
    },
    {
      label: "增值税率",
      prop: "vatRate",
      width: "150",
      solt: true,
      sortable: false,
      rules: [
        // { required: true, message: '不能为空' },
        { validator: validatePassVat, trigger: "blur" }
      ]
    },
    {
      label: "非税单价",
      prop: "price",
      width: "150",
      solt: true,
      sortable: false,
      rules: [
        // { required: true, message: '不能为空' },
        { validator: validatePass3, trigger: "blur" }
      ]
    }
    // {
    //   label: '交货天数(d)',
    //   prop: 'period',
    //   width: '150',
    //   solt: true, sortable: false,
    //   rules: [
    //     { required: true, message: '不能为空', trigger: 'blur' },
    //     { validator: validatePass, trigger: 'blur' }
    //   ]
    // },
  ]
}

export const uploadfileOption = {
  enableLocalStorage: false,
  cancelFixedTop: true,
  page: false,
  align: "center",
  menuAlign: "center",
  editBtn: false,
  menu: false,
  header: false,
  dic: [],
  column: [
    {
      label: "项目",
      prop: "itemName",
      width: "120",
      sortable: false
    },
    {
      label: "设计要求",
      prop: "designRequire",
      width: "180",
      solt: true,
      sortable: false
    },
    {
      label: "计划完成时间",
      prop: "completeTime",
      width: "180",
      solt: true,
      sortable: false
    },
    {
      label: "备注",
      prop: "remarks",
      width: "180",
      solt: true,
      sortable: false
    },
    {
      label: "文件",
      prop: "fileList",
      width: "160",
      solt: true,
      sortable: false
    }
  ]
}

//商品信息form 以及校验规则
export const prdmodal = {
  spu: null,
  productName: null,
  category: null,
  brand: null,
  model: null
}

var checkSpuCode = (rule, value, callback) => {
  // var uPattern = /^[\w_-]+$/;
  var reg = /^[a-zA-Z0-9_-]{1,50}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error())
  }
}

export const prdmodalRules = {
  spu: [
    { required: true, message: "请输入产品编码", trigger: "blur" },
    { min: 1, max: 30, message: "不得超过50个字符", trigger: "blur" },
    { validator: checkSpuCode, message: "只能输入:字母、数字、-_", trigger: "blur" }
  ],
  productName: [
    { required: true, message: "请输入产品名称", trigger: "blur" },
    { min: 1, max: 100, message: "不得超过100个字符", trigger: "blur" }
  ],
  category: [{ required: true, message: "请选择品类", trigger: "blur" }],
  brand: [{ required: true, message: "请选择品牌", trigger: "blur" }],
  developGroupId: [{ required: true, message: "请选择开发小组", trigger: "blur" }]
}
//产品属性form 以及校验规则
export const prdAttrForm = {
  prdAttrs: [],
  prdAttrValues: []
}
export const prdAttrRules = {
  prdAttrs: [{ type: "array", required: true, message: "请至少选择一个属性类", trigger: "change" }],
  prdAttrValues: [{ type: "array", required: true, message: "请至少选择一个属性值", trigger: "change" }]
}

//产品属性组合校验
export const skuRules = {
  specification: [
    { required: true, message: "请输入规格参数", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ],
  funcRequire: [
    { required: true, message: "请输入功能需求", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ],
  approveRequire: [
    { required: true, message: "请输入认证需求", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ],
  packList: [
    { required: true, message: "请输入包装清单", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ],
  otherDescribe: [
    { required: true, message: "请输入功能其他描述", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ]
}

//基本信息校验
export const baseSkuForm = {
  specification: "",
  funcRequire: "",
  approveRequire: "",
  packList: "",
  otherDescribe: ""
}

export const baseSkuRules = {
  // specification: [
  //   { required: true, message: "请输入规格", trigger: "blur" },
  //   // { min: 1, max: 200, message: "长度不超过200个字符", trigger: "blur" }
  // ],
  // funcRequire: [
  //   { required: true, message: "请输入功能需求", trigger: "blur" },
  //   { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  // ],
  // approveRequire: [
  //   { required: true, message: "请输入认证需求", trigger: "blur" },
  //   { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  // ],
  // packList: [
  //   { required: true, message: "请输入包装清单", trigger: "blur" },
  //   { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  // ],
  // otherDescribe: [
  //   { min: 0, max: 200, message: "长度不超过200字符", trigger: "blur" }
  // ],
}
/*申报要素校验*/
//   export const appEleForm = {
//   }

export const appEleRules = {
  customsCode: [
    { required: true, message: "请输入海关编码", trigger: "blur" },
    { min: 1, max: 12, message: "长度不超过12字符", trigger: "blur" }
  ],
  material: [
    { required: true, message: "请输入材质", trigger: "blur" },
    { min: 1, max: 600, message: "长度不超过600字符", trigger: "blur" }
  ],
  application: [
    { required: true, message: "请输入用途", trigger: "blur" },
    { min: 1, max: 600, message: "长度不超过600字符", trigger: "blur" }
  ],
  declarationElement: [
    { required: true, message: "请输入申报要素", trigger: "blur" },
    { min: 1, max: 600, message: "长度不超过600字符", trigger: "blur" }
  ]
}
//设计清单规则
export const signListRules = {
  designRequire: [
    { required: true, message: "请输入海关编码", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ],
  completeTime: [{ type: "date", required: true, message: "请选择日期", trigger: "change" }],
  remarks: [
    { required: true, message: "请输入海关编码", trigger: "blur" },
    { min: 1, max: 200, message: "长度不超过200字符", trigger: "blur" }
  ]
}
//初始化上传清单数据
export const uploadfileData = [
  { item: 0, itemName: "外观设计文件" },
  { item: 1, itemName: "包装盒设计文件" },
  { item: 2, itemName: "说明书设计文件" },
  { item: 3, itemName: "包装说明文件" },
  { item: 4, itemName: "其他文件1" },
  { item: 5, itemName: "其他文件2" },
  { item: 6, itemName: "其他文件3" }
]
//校验数据的设计清单的文件校验
export function checkDesignFile(file, signFileList) {
  let res = {}
  res.flag = true
  if (file.size / 1024 / 1024 > 5) {
    res.msg = "不允许上传大于5M文件"
    res.flag = false
    return res
  }
  // if(file.raw.type!="application/pdf"){
  //     res.msg = "不允许上传非PDF文件";
  //     res.flag = false;
  //     return res;
  // }
  let suffix = file.raw.type
  if (
    suffix != "application/pdf" &&
    suffix != "image/jpg" &&
    suffix != "image/jpeg" &&
    suffix != "image/png" &&
    suffix != "image/bmp"
  ) {
    res.msg = "请选择pdf，jpg，png，bmp文件"
    res.flag = false
    return res
  }

  if (signFileList && signFileList.length >= 5) {
    res.msg = "最多上传5个文件"
    res.flag = false
    return res
  }

  return res
}
//验证图片
export function checkUploadImage() {
  let res = {}
  res.tipFlag = true
  return res
}
//删除行之后自动调整skuCode
export function makeUpAttrFn(attrTableData, minIndex, spuCode) {
  if (attrTableData && attrTableData.length > 0) {
    for (let i = 0; i < attrTableData.length; i++) {
      attrTableData[i].skuCode = spuCode + getStrIndex(minIndex)
      minIndex++
    }
  }
  return attrTableData
}

export function attrskuValate(attrData) {
  let res = {}
  res.data = true
  res.msg = ""
  //着重校验预计采购模块数据
  attrData.forEach((ele) => {
    //校验skuCode
    if (ele.skuCode && validateCN(ele.skuCode)) {
      res.data = false
      res.msg = "属性编码:" + ele.skuCode + "，只支持字母/数字/特殊符号!!"
      return res
    }
    //校验是否有供应商信息
    if (!ele.supplierNo) {
      res.data = false
      res.msg = "请选择" + ele.skuCode + "供应商信息!!"
      return res
    }
    if (!ele.currencyCode) {
      res.data = false
      res.msg = "请选择" + ele.skuCode + "币种!!"
      return res
    }
    if (!ele.currencyCode) {
      res.data = false
      res.msg = "请选择" + ele.skuCode + "币种!!"
      return res
    }
    if (!ele.period) {
      res.data = false
      res.msg = ele.skuCode + "的交货天数不能为空!!"
      return res
    } else {
      var req = /^\d{0,5}$/
      var reg = new RegExp(req)
      if (!reg.test(ele.period)) {
        res.data = false
        res.msg = ele.skuCode + "的交货天数为5位自然数!!"
        return res
      }
    }
    if (!ele.taxType) {
      res.data = false
      res.msg = "请选择" + ele.skuCode + "交易税别!!"
      return res
    }
    if (ele.flagQualification) {
      //存在税务资质
      if (isNulls(ele.price)) {
        res.data = false
        res.msg = ele.skuCode + "非税单价不能为空!!"
        return res
      } else {
        var req = /^([0-9]{0,12})?(\.[0-9]{0,2})?$/
        var reg = new RegExp(req)
        if (!reg.test(ele.price)) {
          res.data = false
          res.msg = ele.skuCode + "非税单价应为2位小数,12位整数!!"
          return res
        }
      }
      if (isNulls(ele.vatRate) && ele.taxType == 1) {
        res.data = false
        res.msg = ele.skuCode + "增值税不能为空!!"
        return res
      } else if (!isNulls(ele.vatRate) && ele.taxType == 1) {
        var req = /^\d{1,2}$/
        var reg = new RegExp(req)
        let bool = reg.test(ele.vatRate) && parseInt(ele.vatRate) >= 1 && parseInt(ele.vatRate) <= 13
        if (!bool) {
          res.data = false
          res.msg = ele.skuCode + "增值税应为1-13的整数!!"
          return res
        }
      }
      if (isNulls(ele.taxPrice) && ele.taxType == 1) {
        res.data = false
        res.msg = ele.skuCode + "含税单价不能为空!!"
        return res
      } else if (isNulls(ele.taxRate) && ele.taxType == 1) {
        res.data = false
        res.msg = ele.skuCode + "交易税率不能为空!!"
        return res
      } else if (ele.taxRate && ele.taxPrice) {
        //var req = /^([0-9]{0,2})?(\.[0-9]{0,2})?$/;
        var req = /^\d{1,2}$/
        var reg = new RegExp(req)
        let bool = reg.test(ele.taxRate) && parseInt(ele.taxRate) >= 0 && parseInt(ele.taxRate) <= 16
        if (!bool) {
          res.data = false
          res.msg = ele.skuCode + "交易税率应为0-16的整数!!"
          return res
        }
        var req2 = /^([0-9]{0,12})?(\.[0-9]{0,2})?$/
        var reg2 = new RegExp(req2)
        if (!reg2.test(ele.taxPrice)) {
          res.data = false
          res.msg = ele.skuCode + "含税单价应为2位小数,12位整数!!"
          return res
        }
        // if(!(parseFloat(ele.taxPrice)>=parseFloat(ele.price))){
        //     res.data = false;
        //     res.msg = ele.skuCode+"含税单价应该大于等于非税单价!!";
        //     return res;
        // }
      }
    } else {
      //不存在税务资质
      if (ele.taxRate || ele.taxPrice) {
        res.data = false
        res.msg = ele.skuCode + "所选的供应商无税务资质!!"
        return res
      }
      if (!ele.price) {
        res.data = false
        res.msg = ele.skuCode + "非税单价不能为空!!"
        return res
      } else {
        var req = /^([0-9]{0,12})?(\.[0-9]{0,2})?$/
        var reg = new RegExp(req)
        if (!reg.test(ele.price)) {
          res.data = false
          res.msg = ele.skuCode + "非税单价应为2位小数,12位整数!!"
          return res
        }
      }
    }
  })
  return res
}

function getStrIndex(index) {
  if (index >= 10 && index <= 99) {
    return index
  } else {
    return "0" + index
  }
}

export function fliterImageFile(fileList, fileRemove, imageDelId) {
  let bl = true
  if (fileList) {
    fileList = fileList.filter((file) => {
      bl = true
      fileRemove.forEach((remove) => {
        if (file.uid === remove.uid) {
          bl = false
        }
      })
      return bl
      // if(bl){
      //     tmp.push(file)
      // }
    })
  }
  if (fileRemove) {
    fileRemove.forEach((re) => {
      if (re.picId) {
        if (imageDelId.indexOf(re.picId) == -1) {
          imageDelId.push(re.picId)
        }
      }
    })
  }
  let res = {}
  res.fileList = fileList
  res.imageDelId = imageDelId
  return res
}
