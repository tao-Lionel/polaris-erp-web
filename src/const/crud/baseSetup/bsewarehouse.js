export const tableOption = {
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "内部仓库编码",
      prop: "warehouseCode"
    },
    {
      label: "仓库名称",
      prop: "warehouseName"
    },
    {
      label: "仓库类型",
      prop: "warehouseTypeName"
      // type: "select",
      // props: {
      //   label: "warehouseTypeName",
      //   value: "warehouseTypeId"
      // },
      // dicUrl: "/baseSetup/bsewarehousetype/{{key}}",
      // dicData: "getBseWarehouseType"
    },
    {
      label: "使用组织",
      prop: "downloadCorporationNames",
      sortable: false
      // solt: true
    },
    {
      label: "仓库服务商",
      prop: "warehouseProviderName"
      // type: "select",
      // props: {
      //   label: "providerName",
      //   value: "warehouseProviderId"
      // },
      // dicUrl: "/baseSetup/bsewarehouseprovider/{{key}}",
      // dicData: "getAll"
    },
    {
      label: "服务商仓库编码",
      prop: "providerWarehouseCode"
    },
    {
      label: "物流商",
      prop: "downloadTransportCarrierNames",
      solt: true,
      width: 100
    },
    {
      label: "AppID",
      prop: "warehouseOutAppId"
    },
    {
      label: "AppSecret",
      prop: "warehouseOutAppSecret"
    },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "店铺",
      prop: "storeAccounts"
    },
    {
      label: "平台仓库编码",
      prop: "platformTypeWarehouseCodes"
    },
    {
      label: "是否支持退件",
      prop: "supportRefund",
      type: "select"
    },
    {
      label: "国家",
      prop: "countryName",
      type: "select"
    },
    {
      label: "区域",
      prop: "area"
    },
    {
      label: "省/州",
      prop: "states",
      sortable: false
    },
    {
      label: "市",
      prop: "city",
      sortable: false
    },
    {
      label: "仓库地址",
      prop: "warehouseAddress",
      sortable: false
    },
    {
      label: "邮编",
      prop: "statesZipCode",
      sortable: false
    },
    {
      label: "仓库状态",
      prop: "funcStateName"
      // type: "select",
      // dicData: [
      //   {
      //     label: "启用",
      //     value: "1"
      //   },
      //   {
      //     label: "禁用",
      //     value: "0"
      //   }
      // ]
    },
    {
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    },
    {
      label: "备注",
      prop: "remark"
    }
  ]
}

export const exportColumns = [
  ...tableOption.column.filter((item) => !["warehouseOutAppId", "warehouseOutAppSecret"].includes(item.prop))
]
