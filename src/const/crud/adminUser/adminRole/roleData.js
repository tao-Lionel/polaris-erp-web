export const tableOption = {
  maxHeight: document.body.clientHeight - 320, //固定标题
  enableLocalStorage: false,
  border: true,
  // index: true,
  indexLabel: "序号",
  // stripe: true,
  menuAlign: "center",
  //menu:false,
  editBtn: false,
  size: "mini",
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "60",
  highlightCurrentRow: true,
  columnBtn: false,
  column: [
    {
      label: "id",
      prop: "roleDataId",
      span: 24,
      width: 36,
      hide: true,
      // editDisabled: true,
      addVisdiplay: false,
      viewVisdiplay: false
    },
    {
      minWidth: 120,
      maxWidth: 300,
      label: "数据角色名称",
      prop: "name",
      span: 24,
      rules: [
        {
          required: true,
          message: "姓名",
          trigger: "blur"
        },
        {
          min: 3,
          max: 20,
          message: "长度在 2 到 10个字符",
          trigger: "blur"
        }
      ]
    },
    {
      label: "备注",
      prop: "remarks",
      span: 24
    },
    {
      label: "创建时间",
      prop: "createTime",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      label: "操作",
      prop: "operate",
      sortable: false,
      solt: true,
      copy: false
    }
  ]
}

export const warehouseOption = {
  enableLocalStorage: false,
  selection: true,
  border: true,
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "auto",
  size: "mini",
  paginationLayout: "prev, pager, next",
  columnBtn: false,
  resetBtn: false,
  tip: false,
  //highlightCurrentRow: true,
  column: [
    {
      label: "仓库名称",
      prop: "warehouseName",
      span: 24
    },
    {
      label: "仓库类型",
      prop: "warehouseTypeName",
      span: 24
    },
    {
      label: "备注",
      prop: "remark",
      span: 24
    }
  ]
}

export const storeOption = {
  enableLocalStorage: false,
  selection: true,
  border: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "auto",
  size: "mini",
  paginationLayout: "prev, pager, next",
  columnBtn: false,
  resetBtn: false,
  tip: false,
  column: [
    {
      label: "店铺名称",
      prop: "storeAccount",
      span: 24
    },
    {
      label: "店铺简称",
      prop: "storeAccount",
      span: 24
    },
    {
      label: "平台",
      prop: "platformTypeCode",
      span: 24
    },
    {
      label: "站点",
      prop: "countryCode",
      span: 24
    },
    {
      label: "备注",
      prop: "remark",
      span: 24
    }
  ]
}
