export const tableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  editBtn: true,
  delBtn: true,
  align: "center",
  addBtn: true,
  column: [
    // {
    //   fixed: true,
    //   label: 'id',
    //   prop: 'roleId',
    //   span: 24,
    //   editDisabled: true,
    //   addVisdiplay: false
    // },
    {
      width: 150,
      minWidth: 150,
      maxWidth: 300,
      fixed: true,
      label: "姓名",
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
      width: 150,
      label: "用户账号",
      prop: "userAccount",
      span: 24,
      editDisabled: true,
      rules: [
        {
          required: true,
          message: "用户账号",
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
      label: "用户密码",
      prop: "userPassword",
      overHidden: true,
      type: "textarea",
      minRows: 6,
      span: 24
    },
    {
      width: 220,
      label: "职务 (职务决定数据权限关系)",
      prop: "duties",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      width: 180,
      label: "功能权限",
      prop: "functionAuthority",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      width: 180,
      label: "品类权限",
      prop: "categoryAuthority",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      width: 180,
      label: "店铺权限",
      prop: "shopAuthority",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      width: 180,
      label: "仓库权限",
      prop: "warehouseAuthority",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    }
  ]
}
