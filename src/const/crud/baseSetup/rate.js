export const rateOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
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
  column: [
    {
      label: "执行月份",
      prop: "workDateTime"
    },
    {
      label: "原币",
      prop: "currencySourceName"
    },
    {
      label: "目标币",
      prop: "currencyTargetName"
    },
    {
      label: "上月汇率",
      prop: "exchangeRateLastMonth"
    },
    {
      label: "本月汇率",
      prop: "exchangeRate"
    }
  ]
}
