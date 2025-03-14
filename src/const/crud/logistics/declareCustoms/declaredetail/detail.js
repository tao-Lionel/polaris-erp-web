export function declareObjectTransfer(obj) {
  //公共申报保存模块的数据
  let common = {}
  if (obj) {
    common.accompanyDocNo = obj.accompanyDocNo
    common.bargainType = obj.bargainType
    common.contractNumber = obj.contractNumber
    common.customsExit = obj.customsExit
    common.declareCustomNo = obj.declareCustomNo
    common.destinateCountryId = obj.destinateCountryId
    common.exemptionProperty = obj.exemptionProperty
    common.exitPort = obj.exitPort
    common.markNoRemark = obj.markNoRemark
    common.outboundConsignee = obj.outboundConsignee
    common.packageSum = obj.packageSum
    common.packageType = obj.packageType
    common.regulatoryMode = obj.regulatoryMode
    common.signContractSite = obj.signContractSite
    common.totalNetWeight = obj.totalNetWeight
    common.totalRoughWeight = obj.totalRoughWeight
    common.tradeCountryId = obj.tradeCountryId
    common.transportModeId = obj.transportModeId
    common.packageSum = obj.packageSum
    common.goalCountryId = obj.goalCountryId
    common.currency = obj.currency
  }
  return common
}
// export const fixedInvoiceOption=[{markNo:'MARK',customsName:'DESCRIPTION',declareQuantity:'QUANTITY',customsLegalUnit:'unit',
// price:'UNIT PRICE',amount:'AMOUNT'},{markNo:'',customsName:'',declareQuantity:'',customsLegalUnit:'',
// price:'USD',amount:'USD'},{markNo:'N/M',customsName:'',declareQuantity:'',customsLegalUnit:'',
// price:'USD',amount:'FOB出口口岸'}]
//固定表头
export function fixedInvoiceTable() {
  let fixedTableData = [
    {
      markNo: "MARK",
      customsName: "DESCRIPTION",
      declareQuantity: "QUANTITY",
      customsLegalUnit: "UNIT PRICE",
      declarePrice: "UNIT PRICE",
      amount: "AMOUNT"
    },
    { markNo: "", customsName: "", declareQuantity: "", customsLegalUnit: "", declarePrice: "USD", amount: "USD" },
    {
      markNo: "N/M",
      customsName: "",
      declareQuantity: "",
      customsLegalUnit: "",
      declarePrice: "",
      amount: "FOB出口口岸"
    }
  ]
  return fixedTableData
}
//装箱单固定表头
export function fixedPackageTable1() {
  let fixedTableData = [
    {
      mark: "MARK",
      customsName: "DESCRIPTION",
      packageQuantity: "PKG",
      unit: "UNIT",
      declareQuantity: "QTY",
      customsLegalUnit: "STATION",
      roughWeight: "G.W",
      netWeight: "N.W",
      volume: "MEAS"
    },
    {
      mark: "N/M",
      customsName: "",
      packageQuantity: "",
      unit: "",
      declareQuantity: "",
      customsLegalUnit: "",
      roughWeight: "KGS",
      netWeight: "KGS",
      volume: "M3"
    }
  ]
  return fixedTableData
}
//自主申报提交校验(自主报关)
var validatePass = (rule, value, callback) => {
  //自主报关合同号编辑校验
  var req = /^YR\d{12}$/
  var reg = new RegExp(req)
  if (!reg.test(value)) {
    callback(new Error("请遵守合同协议号规则"))
  } else {
    let arr1 = [1, 3, 5, 6, 7, 8, 10, 12]
    let arr2 = [4, 6, 9, 11]
    let year = value.substring(2, 6)
    let month = value.substring(6, 8)
    let date = value.substring(8, 10)
    if (arr1.indexOf(parseInt(month)) != -1 && parseInt(date) <= 31) {
      callback()
    } else if (arr2.indexOf(parseInt(month)) != -1 && parseInt(date) <= 30) {
      callback()
    } else if (parseInt(month) == 2) {
      let y = parseInt(year)
      if (y % 100 == 0 && y % 400 == 0 && parseInt(date) <= 29) {
        callback()
      } else if (y % 100 != 0 && y % 4 == 0 && parseInt(date) <= 29) {
        callback()
      } else if (parseInt(date) <= 28) {
        callback()
      } else {
        callback(new Error("请遵守合同协议号规则"))
      }
    } else {
      callback(new Error("请遵守合同协议号规则"))
    }
  }
}
var validateNull = (rule, value, callback) => {
  if (value == null || value == "") {
    callback(new Error("不能为空"))
  } else {
    callback()
  }
}
var validateFloat = (rule, value, callback) => {
  var req = /^([0-9]{0,12})?(\.[0-9]{0,4})?$/
  var reg = new RegExp(req)
  if (!reg.test(value)) {
    callback(new Error("4位小数,12位整数"))
  } else {
    callback()
  }
}
export const rulesSelf = {
  contractNumber: [{ validator: validatePass, trigger: "blur" }],
  transportModeId: [{ validator: validateNull, message: "请选择运输方式", trigger: "change" }],
  exitPort: [
    // {validator: validateNull, trigger: 'blur'},
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  customsExit: [
    // {validator: validateNull, trigger: 'blur'},
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  totalRoughWeight: [{ validator: validateFloat, trigger: "blur" }],
  totalNetWeight: [{ validator: validateFloat, trigger: "blur" }],
  signContractSite: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  currency: [{ validator: validateNull, message: "请选择币别", trigger: "change" }],
  tradeCountryId: [{ validator: validateNull, message: "请选择贸易国", trigger: "change" }],
  destinateCountryId: [{ validator: validateNull, message: "请选择运抵国", trigger: "change" }],
  goalCountryId: [{ validator: validateNull, message: "请选择目的国", trigger: "change" }],
  outboundConsignee: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  regulatoryMode: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  exemptionProperty: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  packageType: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  packageSum: [
    { validator: validateNull, trigger: "blur" },
    { type: "number", message: "件数必须为数字值" }
  ],
  bargainType: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  accompanyDocNo: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  markNoRemark: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ]
}
//自主申报提交校验(自贸通)
var validatePassTr = (rule, value, callback) => {
  //自贸通报关合同号编辑校验
  var req = /^\d{2}ZMT016\d{5}$/
  var reg = new RegExp(req)
  if (!reg.test(value)) {
    callback(new Error("请遵守合同协议号规则"))
  } else {
    let mon = value.substring(8, 10)
    if (parseInt(mon) <= 12) {
      callback()
    } else {
      callback(new Error("请遵守合同协议号规则"))
    }
  }
}
export const rulesTrade = {
  contractNumber: [{ validator: validatePassTr, trigger: "blur" }],
  transportModeId: [{ validator: validateNull, message: "请选择运输方式", trigger: "change" }],
  exitPort: [
    //  {validator: validateNull, trigger: 'blur'},
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  customsExit: [
    //  {validator: validateNull, trigger: 'blur'},
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  totalRoughWeight: [{ validator: validateFloat, trigger: "blur" }],
  totalNetWeight: [{ validator: validateFloat, trigger: "blur" }],
  signContractSite: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  currency: [{ validator: validateNull, message: "请选择币别", trigger: "change" }],
  tradeCountryId: [{ validator: validateNull, message: "请选择贸易国", trigger: "change" }],
  destinateCountryId: [{ validator: validateNull, message: "请选择运抵国", trigger: "change" }],
  goalCountryId: [{ validator: validateNull, message: "请选择目的国", trigger: "change" }],
  outboundConsignee: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  regulatoryMode: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  exemptionProperty: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  packageType: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  packageSum: [
    { validator: validateNull, trigger: "blur" },
    { type: "number", message: "件数必须为数字值" }
  ],
  bargainType: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  accompanyDocNo: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ],
  markNoRemark: [
    { validator: validateNull, trigger: "blur" },
    { min: 1, max: 50, message: "长度在1到50个字符", trigger: "blur" }
  ]
}
