module.exports = [
  {
    path: "/wel",
    component: "",
    redirect: "/wel/index",
    children: [
      {
        path: "index",
        name: "首页",
        component: () => import(/* webpackChunkName: "views" */ "@/views/homepage/index")
      }
    ]
  },
  {
    path: "/crud",
    component: "",
    redirect: "/crud/index",
    children: [
      {
        path: "index",
        name: "CRUD例子",
        component: () => import(/* webpackChunkName: "views" */ "@/views/crud/index")
      }
    ]
  },
  {
    path: "/info",
    component: "",
    redirect: "/info/index",
    children: [
      {
        path: "index",
        name: "个人信息",
        component: () => import(/* webpackChunkName: "page" */ "@/views/admin/user/info")
      }
    ]
  },
  {
    path: "/product/openTag",
    component: "",
    redirect: "/product/openTag",
    children: [
      {
        path: "index/:id",
        name: "新品详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/prdlist/prdcreate/createprd"),
        meta: {
          keepAlive: false,
          parentPath: "/product/prdlist"
        }
      },
      {
        path: "edit/:id",
        name: "新品详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/prdlist/prdcreate/createprd"),
        meta: {
          keepAlive: false,
          parentPath: "/product/prdlist"
        }
      }
    ]
  },
  {
    path: "/product/detail",
    component: "",
    // redirect: "/product",
    children: [
      {
        path: "index",
        name: "SKU详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/product/prddetail/index"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdarchives"
        }
      }
    ]
  },
  {
    path: "/sealSampleTable",
    component: "",
    name: "封样单",
    redirect: "/sealSampleTable/index",
    children: [
      {
        path: "index",
        name: "封样单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/product/prdsealsample/newIndex"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdsealsample"
        }
      }
    ]
  },
  {
    path: "/createSuppplier",
    component: "",
    name: "供应商详情",
    redirect: "/createSuppplier/index",
    children: [
      {
        path: "index",
        name: "供应商详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/supplier/createSupplier"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/supplier/list"
        }
      }
    ]
  },
  {
    path: "/porequisiton",
    component: "",
    children: [
      {
        path: "create",
        name: "新建请购单",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/porequisiton/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/porequisiton"
        }
      }
    ]
  },
  {
    path: "/porequisiton",
    component: "",
    children: [
      {
        path: "detail",
        name: "请购单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/porequisiton/detail"),
        meta: {
          keepAlive: false,
          parentPath: "/purchase/porequisiton"
        }
      }
    ]
  },
  {
    path: "/orderUpdate",
    component: "",
    name: "采购单",
    redirect: "/orderUpdate/index",
    children: [
      {
        path: "index",
        name: "采购订单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/poorder/index_detail"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/poorder"
        }
      }
    ]
  },
  {
    path: "/",
    component: "",
    name: "采购请款单",
    // redirect: '/requestDetail/index',
    children: [
      {
        path: "requestDetail",
        name: "采购请款单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/porequest/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/finance/porequest"
        }
      },
      {
        path: "print",
        name: "打印付款申请书",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/porequest/print"),
        meta: {
          keepAlive: true,
          parentPath: "/finance/porequest"
        }
      }
    ]
  },
  {
    path: "/",
    component: "",
    name: "采购付款单",
    // redirect: '/paymentDetail',
    children: [
      {
        path: "paymentDetail",
        name: "采购付款单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/popayment/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/finance/popayment"
        }
      }
    ]
  },
  {
    path: "/approveContract",
    component: "",
    name: "财务审核",
    redirect: "/approveContract/index",
    children: [
      {
        path: "index",
        name: "财务审核",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/contract/approveContract"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/pocontract"
        }
      }
    ]
  },
  {
    path: "/showTaxContractPic",
    component: "",
    name: "含税合同",
    redirect: "/showTaxContractPic/index",
    children: [
      {
        path: "index",
        name: "含税合同",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/contract/taxContract"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/pocontract"
        }
      }
    ]
  },
  {
    path: "/showNonTaxContractPic",
    component: "",
    name: "合同",
    redirect: "/showNonTaxContractPic/index",
    children: [
      {
        path: "index",
        name: "合同",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/contract/nonTaxContract"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/pocontract"
        }
      }
    ]
  },
  {
    path: "/contractAttachView",
    component: "",
    name: "附件预览",
    redirect: "/contractAttachView/index",
    children: [
      {
        path: "index",
        name: "附件预览",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/contract/contractAttachView"),
        meta: {
          parentPath: "/purchase/pocontract"
        }
      }
    ]
  },
  {
    path: "/inquiryorder",
    component: "",
    name: "询价单",
    redirect: "/inquiryorder",
    children: [
      {
        path: "create/:inquiryOrderNo",
        name: "询价单详情",
        component: () => import("@/views/purchase/inquiryorder/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/inquiryorder"
        }
      },
      {
        path: "detail/:inquiryOrderNo",
        name: "询价单详情",
        component: () => import("@/views/purchase/inquiryorder/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/inquiryorder"
        }
      }
    ]
  },
  {
    path: "/wmssign",
    component: "",
    name: "签收",
    redirect: "/wmssign",
    children: [
      {
        path: "list",
        name: "签收列表",
        component: () => import("@/views/warehouse/wmssign/list"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/wmssign"
        }
      },
      {
        path: "sign",
        name: "签收",
        component: () => import("@/views/warehouse/wmssign/index"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/wmssign"
        }
      }
    ]
  },
  {
    path: "/delivery",
    component: "",
    name: "送货单",
    redirect: "/delivery",
    children: [
      {
        path: "create",
        name: "送货单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/delivery/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/delivery/index"
        }
      },
      {
        path: "print",
        name: "打印送货单",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/delivery/print"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/delivery/index"
        }
      }
    ]
  },
  {
    path: "/declareCustoms",
    component: "",
    redirect: "/declareCustoms",
    children: [
      {
        path: "detail/:id/:customsType",
        name: "报关详情",
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/logistics/declareCustoms/declaredetail/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/declareCustoms"
        }
      }
    ]
  },
  {
    path: "/transfer",
    component: "",
    name: "调拨管理",
    redirect: "/transfer",
    children: [
      {
        path: "detail/1",
        name: "调拨订单",
        component: () => import("@/views/logistics/transfer/tmstransfer/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/1"
        }
      },
      {
        path: "detail/2",
        name: "调拨订单",
        component: () => import("@/views/logistics/transfer/tmstransfer/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/2"
        }
      },
      {
        path: "detail/3",
        name: "调拨订单",
        component: () => import("@/views/logistics/transfer/tmstransfer/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/3"
        }
      },
      {
        path: "detail/4",
        name: "调拨订单",
        component: () => import("@/views/logistics/transfer/tmstransfer/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/4"
        }
      },
      {
        path: "detail/5",
        name: "调拨订单",
        component: () => import("@/views/logistics/transfer/tmstransfer/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/5"
        }
      }
    ]
  },
  {
    path: "/createDeliveryPlan",
    component: "",
    name: "制作交货计划",
    redirect: "/createDeliveryPlan",
    children: [
      {
        path: "index",
        name: "制作交货计划",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/podeliveryplan/index_create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/podeliveryplan"
        }
      }
    ]
  },
  {
    path: "/inspection",
    component: "",
    name: "验货单",
    redirect: "/inspection",
    children: [
      {
        path: "detail",
        name: "验货单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/inspection/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/inspection/index"
        }
      }
    ]
  },
  {
    path: "/otherOutStock",
    component: "",
    name: "其他出库",
    redirect: "/otherOutStock",
    children: [
      {
        path: "create",
        name: "其他出库单",
        component: () => import(/* webpackChunkName: "views" */ "@/views/warehouse/otherOutStock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/otherOutStock"
        }
      }
    ]
  },
  {
    path: "/poreturn",
    component: "",
    name: "采购退货单",
    redirect: "/poreturn",
    children: [
      {
        path: "detail",
        name: "采购退货单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/poreturn/index_create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/poreturn"
        }
      }
    ]
  },
  {
    path: "/",
    component: "",
    name: "采购变更",
    // redirect: '/pochange/edit',
    children: [
      {
        path: "pochange/edit",
        name: "采购变更单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/pochange/create.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/change/index"
        }
      }
    ]
  },
  {
    path: "/porequisitonCancel/",
    component: "",
    name: "请购撤销新增/编辑",
    redirect: "/porequisitonCancel/",
    children: [
      {
        path: "edit",
        name: "请购撤销单详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/purchase/porequisitonCancel/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/porequisitonCancel"
        }
      }
    ]
  },
  {
    path: "/otherInStock",
    component: "",
    name: "其他入库",
    redirect: "/otherInStock",
    children: [
      {
        path: "create",
        name: "其他入库详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/warehouse/otherinstock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/otherinstock"
        }
      }
    ]
  },
  {
    path: "/fbareturn",
    component: "",
    name: "FBA退货管理",
    redirect: "/fbareturn",
    children: [
      {
        path: "detail",
        name: "FBA退货明细",
        component: () => import(/* webpackChunkName: "views" */ "@/views/warehouse/fbareturn/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/fbareturn"
        }
      },
      {
        path: "info",
        name: "FBA退货详情",
        component: () => import(/* webpackChunkName: "views" */ "@/views/warehouse/fbareturn/info"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/fbareturn"
        }
      }
    ]
  },
  {
    path: "/activiti",
    component: "",
    name: "模型",
    redirect: "/activiti",
    children: [
      {
        path: "detail/:id",
        name: "模型",
        component: () => import(/* webpackChunkName: "views" */ "@/views/activiti/detail.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/activiti/index"
        }
      }
    ]
  },
  {
    path: "/product/prdsalegrossprofits",
    component: "",
    children: [
      {
        path: "detail/:id",
        name: "产品售价毛利详情",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/product/prdsalegrossprofit/prdcreate/profitdetail"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdsalegrossprofit"
        }
      },
      {
        path: "rule/:id",
        name: "关联规则详情",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/product/prdsalegrossprofit/prdcreate/ruledetail"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdsalegrossprofit"
        }
      },
      {
        path: "add",
        name: "新增测算",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/product/prdsalegrossprofit/prdcreate/addmeasuremen"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdsalegrossprofit"
        }
      }
    ]
  },
  {
    path: "/order/orderRules",
    component: "",
    children: [
      {
        path: "detail",
        name: "订单规则详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/orderRule/orderRuleDetail"),
        meta: {
          keepAlive: true,
          parentPath: "/order/orderRuleList"
        }
      }
    ]
  },
  {
    path: "/baseSetup/bsetransportcarrier",
    component: "",
    children: [
      {
        path: "detail/:id",
        name: "物流商详情",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/baseSetup/bsetransportcarrier/bseTransportCarrierDetail"),
        meta: {
          keepAlive: true,
          parentPath: "/baseSetup/bsetransportcarrier"
        }
      }
    ]
  },

  {
    path: "/order/orderManages",
    component: "",
    children: [
      {
        path: "detail",
        name: "订单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/orderManage/orderManageDetail"),
        meta: {
          keepAlive: true,
          parentPath: "/order/orderManageList"
        }
      }
    ]
  },
  {
    path: "/order/orderManages",
    component: "",
    children: [
      {
        path: "detailEdit",
        name: "编辑订单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/orderManage/orderManageEdit"),
        meta: {
          keepAlive: true,
          parentPath: "/order/orderManageList"
        }
      }
    ]
  },
  {
    path: "/order/orderManages",
    component: "",
    children: [
      {
        path: "add",
        name: "新增订单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/orderManage/addOrderManage"),
        meta: {
          keepAlive: true,
          parentPath: "/order/orderManageList"
        }
      }
    ]
  },
  {
    path: "/order/invoiceManage",
    component: "",
    children: [
      {
        path: "detail",
        name: "发货单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/invoiceManage/invoiceManageDetail"),
        meta: {
          keepAlive: true,
          parentPath: "/order/invoiceManage"
        }
      }
    ]
  },
  {
    path: "/transfer/fristMileTransfer",
    component: "",
    children: [
      {
        path: "add",
        name: "新增调拨单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/fristMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/fristMileTransfer"
        }
      },
      {
        path: "edit",
        name: "编辑调拨单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/fristMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/fristMileTransfer"
        }
      },
      {
        path: "detail",
        name: "调拨单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/fristMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/fristMileTransfer"
        }
      },
      {
        path: "internalOrderDetail",
        name: "内部交易订单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/internalContract/internalOrderDetail"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/fristMileTransfer"
        }
      }
    ]
  },
  {
    path: "/transfer/lastMileTransfer",
    component: "",
    children: [
      {
        path: "add",
        name: "新增尾程调拨单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/lastMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/lastMileTransfer"
        }
      },
      {
        path: "edit",
        name: "编辑尾程调拨单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/lastMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/lastMileTransfer"
        }
      },
      {
        path: "detail",
        name: "尾程调拨单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/logistics/transfer/lastMileTransfer/create"),
        meta: {
          keepAlive: true,
          parentPath: "/logistics/tmstransfer/lastMileTransfer"
        }
      }
    ]
  },
  {
    path: "/financialStatements/purchaseSalesInventoryDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "进销存对账表明细",
        component: () =>
          import(/* webpackChunkName: "page" */ "@/views/financialStatements/purchaseSalesInventory/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/purchaseSalesInventory"
        }
      }
    ]
  },
  {
    path: "/purchase/organizeSettlement",
    component: "",
    children: [
      {
        path: "create",
        name: "新增结算价目",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/organizeSettlement/create"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/organizeSettlement"
        }
      },
      {
        path: "detail",
        name: "结算价目详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/organizeSettlement/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/organizeSettlement"
        }
      },
      {
        path: "edit",
        name: "编辑结算价目",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/organizeSettlement/edit"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/organizeSettlement"
        }
      }
    ]
  },
  {
    path: "/financialStatements/cost/accountsPayableDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "财务应付单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/accountsPayable/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/cost/accountsPayable"
        }
      }
    ]
  },
  {
    path: "/purchase/internalContract",
    component: "",
    children: [
      {
        path: "detail",
        name: "内部交易合同详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/internalContract/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/internalContract"
        }
      }
    ]
  },
  {
    path: "/financialStatements/cost/accountsPayableDetail",
    component: "",
    children: [
      {
        path: "psdetail",
        name: "暂估应付单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/accountsPayable/psdetail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/cost/accountsPayable"
        }
      }
    ]
  },
  {
    path: "/financialStatements/cost/receiptDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "收款单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/receipt/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/cost/receipt"
        }
      }
    ]
  },
  {
    path: "/financialStatements/cost/receiptReturnDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "收款退货单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/receiptReturn/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/cost/receiptReturn"
        }
      }
    ]
  },
  {
    path: "/financialStatements/cost/costAdjustmentDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "成本调整单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/costAdjustment/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/cost/costAdjustment"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/purchaseInStockDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "采购入库单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/purchaseInStock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/purchaseInStock"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/purchaseReturnDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "采购退货单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/purchaseReturn/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/purchaseReturn"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/salesOutStockDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "销售出库单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/salesOutStock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/salesOutStockDetail"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/salesReturnDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "销售退货单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/salesReturn/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/salesReturnDetail"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/otherInStockDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "其他入库单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/otherInStock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/otherInStockDetail"
        }
      }
    ]
  },
  {
    path: "/financialStatements/psi/otherOutStockDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "其他出库单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/financialStatements/otherOutStock/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/financialStatements/psi/otherOutStockDetail"
        }
      }
    ]
  },
  {
    path: "/transaction/purchaseDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "内部采购订单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/internalTransaction/purchase/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/purchase"
        }
      }
    ]
  },
  {
    path: "/transaction/purchaseReturnDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "内部采购退货单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/internalTransaction/purchaseReturn/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/purchaseReturn"
        }
      }
    ]
  },
  {
    path: "/transaction/purchase",
    component: "",
    children: [
      {
        path: "invoice",
        name: "发票详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/internalTransaction/invoice/index"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/purchase"
        }
      }
    ]
  },
  {
    path: "/transaction/purchaseReturn",
    component: "",
    children: [
      {
        path: "invoice",
        name: "发票详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/internalTransaction/invoice/index"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/purchaseReturn"
        }
      }
    ]
  },
  {
    path: "/product/prdcombproduct",
    component: "",
    children: [
      {
        path: "create",
        name: "新增套装关系",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/prdcombproduct/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdcombproduct"
        }
      },
      {
        path: "detail",
        name: "套装关系详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/prdcombproduct/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdcombproduct"
        }
      },
      {
        path: "edit",
        name: "编辑套装关系",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/prdcombproduct/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/product/prdcombproduct"
        }
      }
    ]
  },
  {
    path: "/transaction/statementDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "供应商对账单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/statement/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/statement"
        }
      }
    ]
  },
  {
    path: "/transaction/commercialInvoiceDetail",
    component: "",
    children: [
      {
        path: "detail",
        name: "商业发票详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/commercialInvoice/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/transaction/commercialInvoice"
        }
      }
    ]
  },
  {
    path: "/warehouse/stockchange",
    component: "",
    children: [
      {
        path: "create",
        name: "新增转货",
        component: () => import(/* webpackChunkName: "page" */ "@/views/warehouse/stockchange/create"),
        meta: {
          keepAlive: true,
          parentPath: "/warehouse/stockchange"
        }
      }
    ]
  },
  {
    path: "/order/afterOrderManage",
    component: "",
    children: [
      {
        path: "afterOrderDetail",
        name: "售后工单详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/afterOrderManage/detail"),
        meta: {
          keepAlive: true,
          parentPath: "/order/afterOrderManageList"
        }
      }
    ]
  },
  {
    path: "/order/afterOrderManage",
    component: "",
    children: [
      {
        path: "addGiftWorkOrder",
        name: "新增重发/赠品工单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/afterOrderManage/addGiftWorkOrder"),
        meta: {
          keepAlive: true,
          parentPath: "/order/afterOrderManageList"
        }
      }
    ]
  },
  {
    path: "/order/afterOrderManage",
    component: "",
    children: [
      {
        path: "resendWorkOrder",
        name: "新建重发工单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/order/afterOrderManage/addGiftWorkOrder"),
        meta: {
          keepAlive: true,
          parentPath: "/order/afterOrderManageList"
        }
      }
    ]
  },
  {
    path: "/admin",
    component: "",
    children: [
      {
        path: "addDataExportConfig",
        name: "新增数据导出配置",
        component: () => import(/* webpackChunkName: "page" */ "@/views/admin/dataExportConfiguration/addOrUpdate.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/admin/dataExportConfiguration"
        }
      }
    ]
  },
  {
    path: "/admin",
    component: "",
    children: [
      {
        path: "updateDataExportConfig",
        name: "编辑数据导出配置",
        component: () => import(/* webpackChunkName: "page" */ "@/views/admin/dataExportConfiguration/addOrUpdate.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/admin/dataExportConfiguration"
        }
      }
    ]
  },
  {
    path: "/noticeCenter/publishNotice",
    component: "",
    children: [
      {
        path: "add",
        name: "新增公告",
        component: () => import(/* webpackChunkName: "page" */ "@/views/noticeCenter/publishNotice/add"),
        meta: {
          keepAlive: false,
          parentPath: "/noticeCenter/publishNotice"
        }
      }
    ]
  },
  {
    path: "/noticeCenter/publishNotice",
    component: "",
    children: [
      {
        path: "edit",
        name: "编辑公告",
        component: () => import(/* webpackChunkName: "page" */ "@/views/noticeCenter/publishNotice/edit"),
        meta: {
          keepAlive: false,
          parentPath: "/noticeCenter/publishNotice"
        }
      }
    ]
  },
  {
    path: "/purchase/poorder/generateDeliveryNote",
    component: "",
    children: [
      {
        path: "index",
        name: "生成送货单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/poorder/generateDeliveryNote"),
        meta: {
          keepAlive: false,
          parentPath: "/purchase/poorder"
        }
      }
    ]
  },
  {
    path: "/product/linkSkuManage",
    component: "",
    children: [
      {
        path: "create",
        name: "新增链接SKU",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/linkSkuManage/create"),
        meta: {
          keepAlive: true,
          parentPath: "/product/linkSkuManage"
        }
      }
    ]
  },
  {
    path: "/product/linkSkuManage",
    component: "",
    children: [
      {
        path: "edit",
        name: "编辑链接SKU",
        component: () => import(/* webpackChunkName: "page" */ "@/views/product/linkSkuManage/edit"),
        meta: {
          keepAlive: true,
          parentPath: "/product/linkSkuManage"
        }
      }
    ]
  },
  {
    path: "/purchase/porequisiton",
    component: "",
    children: [
      {
        path: "generateOrder",
        name: "请购单生成订单",
        component: () => import(/* webpackChunkName: "page" */ "@/views/purchase/porequisiton/generateOrder"),
        meta: {
          keepAlive: true,
          parentPath: "/purchase/porequisiton"
        }
      }
    ]
  },
  {
    path: "/productCosting/costingList",
    component: "",
    children: [
      {
        path: "detail",
        name: "核价详情",
        component: () => import(/* webpackChunkName: "page" */ "@/views/productCosting/costingList/detail.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/productCosting/costingList"
        }
      }
    ]
  },
  {
    path: "/ruleEngineConfig/rulesList",
    component: "",
    children: [
      {
        path: "editRule",
        name: "编辑核价规则",
        component: () => import(/* webpackChunkName: "page" */ "@/views/ruleEngineConfig/rulesList/editRule.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/ruleEngineConfig/rulesList"
        }
      }
    ]
  },
  {
    path: "/ruleEngineConfig/rulesList",
    component: "",
    children: [
      {
        path: "checkRule",
        name: "查看核价规则",
        component: () => import(/* webpackChunkName: "page" */ "@/views/ruleEngineConfig/rulesList/checkRule.vue"),
        meta: {
          keepAlive: true,
          parentPath: "/ruleEngineConfig/rulesList"
        }
      }
    ]
  },
  {
    path: "/productCosting/costingRequire",
    component: "",
    children: [
      {
        path: "costing",
        name: "单个核价",
        component: () => import(/* webpackChunkName: "page" */ "@/views/productCosting/costingRequire/costing"),
        meta: {
          keepAlive: true,
          parentPath: "/productCosting/costingRequire"
        }
      }
    ]
  },
  {
    path: "/productCosting/costingRequire",
    component: "",
    children: [
      {
        path: "batchCosting",
        name: "批量核价",
        component: () => import(/* webpackChunkName: "page" */ "@/views/productCosting/costingRequire/batchCosting"),
        meta: {
          keepAlive: true,
          parentPath: "/productCosting/costingRequire"
        }
      }
    ]
  }
]
