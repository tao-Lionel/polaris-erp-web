export const bindingPriceOption = {
  border: true,
  index: false,
  menu: false,
  header: false,
  column: [
    { label: "店铺", prop: "storeName", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "标准SKU", prop: "parentSkuCode", sortable: false },
    { label: "链接SPU", prop: "linkSpuCode", sortable: false },
    { label: "链接SKU", prop: "linkSkuCode", sortable: false },
    { label: "审核状态", prop: "auditStatus", sortable: false, solt: true },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, copy: false, width: 100 }
  ]
}
