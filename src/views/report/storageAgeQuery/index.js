export const platformTableOption = {
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
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
  // selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  maxHeight: document.body.clientHeight - 448,
  localStorageSymbol: "A",
  column: [
    {
      label: "标准SPU",
      prop: "spu",
      search: false,
      sortable: false,
      width: 150
    },
    {
      label: "标准SKU",
      prop: "standardSku",
      sortable: false,
      width: 150
    },
    {
      label: "工厂SKU",
      prop: "sku",
      sortable: false,
      width: 150
    },
    {
      label: "品类",
      prop: "categoryName", // 待确定
      sortable: false,
      width: 150
      // solt: true,
      // copy: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false,
      minWidth: 180
      // solt: true
    },
    {
      label: "入库时间",
      prop: "ptInTime",
      sortable: false,
      valueFormat: "yyyy-MM-dd",
      type: "daterange",
      width: 150
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },

    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "公司库龄",
      prop: "companyStockAge",
      solt: true,
      sortable: "custom",
      slotHeader: "companyStockAgeHeader",
      width: 160
    },
    {
      label: "海外库龄",
      prop: "overseaStockAge",
      solt: true,
      sortable: "custom",
      slotHeader: "overseaStockAgeHeader",
      width: 160
    },
    {
      label: "平台站点库龄",
      prop: "platformSiteStockAge",
      solt: true,
      sortable: "custom",
      slotHeader: "platformSiteStockAgeHeader",
      width: 180
    }
  ]
}

export const warehouseTableOption = {
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
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
  // selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  maxHeight: document.body.clientHeight - 448,
  localStorageSymbol: "B",
  column: [
    {
      label: "标准SPU",
      prop: "spu",
      sortable: false,
      width: 150
    },
    {
      label: "标准SKU",
      prop: "standardSku",
      sortable: false,
      width: 150
    },
    {
      label: "工厂SKU",
      prop: "sku",
      sortable: false,
      width: 150
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
      // solt: true
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false,
      minWidth: 180
      // solt: true
    },
    {
      label: "仓库名称",
      prop: "warehouseName",
      sortable: false,
      width: 130
    },

    {
      label: "入库时间",
      prop: "ckInTime",
      sortable: false,
      valueFormat: "yyyy-MM-dd",
      type: "daterange",
      width: 150
    },
    {
      label: "仓库库龄",
      prop: "warehouseStockAge",
      sortable: "custom",
      solt: true,
      slotHeader: "warehouseStockAgeHeader",
      width: 160
    }
  ]
}

export const detailTableOption = {
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: true,
  searchFlag: true,
  // searchAdvanced: true,//高级搜索
  // index: true,
  // selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器
  maxHeight: document.body.clientHeight - 448,

  column: [
    {
      label: "标准SPU",
      prop: "spu",
      sortable: false
    },
    {
      label: "SKU",
      prop: "sku",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "仓库名称",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "实际库存",
      prop: "actualQuantity",
      sortable: false
    },
    {
      label: "可用库存",
      prop: "availableQuantity",
      sortable: false
    },
    {
      label: "（在仓库存）关联单号",
      prop: "relationNo",
      sortable: false
    },
    {
      label: "（在仓库存）入库时间",
      prop: "inboundTime",
      sortable: false,
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      type: "daterange"
    },
    {
      label: "（首次入库）关联单号",
      prop: "latestInboundNo",
      sortable: false
    },
    {
      label: "（首次入库）入库时间",
      prop: "latestInboundDate",
      sortable: false,
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      type: "daterange"
    },
    {
      label: "库龄",
      prop: "age",
      sortable: false
    }
  ]
}
