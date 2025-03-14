export default {
  title: "trobs",
  logo: "icon-pingguo",
  indexTitle: "北极星ERP",
  whiteList: ["/login", "/404", "/401", "/lock"], // 配置无权限可以访问的页面
  whiteTagList: ["/login", "/404", "/401", "/lock"], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  lockPage: "/lock",
  tokenTime: 6000,
  info: {
    title: "北极星ERP",
    list: [
      "自上而下的决策执行",
      "业务方尽量做到全流程参与",
      "主体管理流程优于细节流程",
      "数据清晰优于流程",
      "敏捷响应优于快速响应",
      "交付优于技术"
    ]
  },
  // http的status默认放行不才用统一处理的,
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    group: [],
    close: false,
    isLocalStore: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: "label",
      path: "path",
      icon: "icon",
      children: "children"
    }
  }
}
