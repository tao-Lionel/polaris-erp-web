export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: "姓名",
      prop: "displayname"
    },
    {
      label: "用户账号",
      prop: "username"
    },
    {
      label: "性别",
      prop: "genders"
    },
    {
      label: "手机号",
      prop: "phone"
    },
    {
      label: "状态",
      prop: "lockFlag",
      solt: true,
      copy: false
    },
    {
      label: "注册时间",
      prop: "createTime",
      width: 180
    }
  ]
}

export const gendersList = [
  {
    value: 0,
    label: "男"
  },
  {
    value: 1,
    label: "女"
  }
]
