export const tableOption = {
  maxHeight: document.body.clientHeight - 320, //固定标题
  border: true,
  searchSlot: true,
  size: "mini",
  menu: false,
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  highlightCurrentRow: true,
  column: [
    {
      label: "id",
      prop: "roleId",
      hide: true,
      span: 24,
      editDisabled: true,
      addVisdiplay: false
    },
    {
      label: "功能角色名称",
      prop: "roleName",
      span: 24,
      rules: [
        {
          required: true,
          message: "功能角色名称",
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
      prop: "roleDesc",
      span: 24,
      editDisabled: true,
      rules: [
        {
          required: true,
          message: "备注",
          trigger: "blur"
        },
        {
          min: 3,
          max: 20,
          message: "长度在 3 到 20 个字符",
          trigger: "blur"
        }
      ]
    },
    {
      width: 180,
      label: "创建时间",
      prop: "updateTime",
      overHidden: true,
      minRows: 6,
      span: 24
    },
    {
      width: 120,
      label: "操作",
      prop: "colOperation",
      solt: true,
      sortable: false,
      editVisdiplay: false
    }
  ]
}
