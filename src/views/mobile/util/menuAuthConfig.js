/**
 * 该配置文件为临时配置权限文件
 * git 测试 2
 * */
export const menuAuthConfig = [
  { path: "/report/stockviewreport", color: "#ff8e00" }, //库存查询
  { path: "/purchase/porequisiton", color: "#17cd79" }, //请购单
  { path: "/warehouse/wmssign", color: "#5c73ff" }, //签收
  { path: "/warehouse/wmsqualitycontrol", color: "#2a8efe" }, //质检
  { path: "/warehouse/warehouse/wmsinbound", color: "#9c60f5" }, //入库

  //以下暂未开发
  { path: "/purchase/pocontract", color: undefined },
  { path: "/purchase/podeliveryplan", color: undefined },
  { path: "/purchase/delivery/index", color: undefined },
  { path: "/report/stockrecordreport", color: undefined },
  { path: "/report/stockreport", color: undefined },
  { path: "/finance/porequest", color: undefined },
  { path: "/finance/popayment", color: undefined }
]
