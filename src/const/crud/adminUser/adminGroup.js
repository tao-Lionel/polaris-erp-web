export const tableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  border: true,
  searchsolt: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  column: [
    {
      width: 300,
      minWidth: 150,
      maxWidth: 300,
      label: "小组名称",
      prop: "name",
      span: 24,
      rules: [
        { required: true, message: "小组名称不能为空", trigger: "blur" },
        { min: 2, max: 30, message: "长度在 2 到 30个字符", trigger: "blur" }
      ]
    },
    {
      width: 150,
      label: "所属职能类",
      prop: "groupFunctionName",
      type: "select",
      overHidden: true,
      span: 24,
      searchMmultiple: true,
      dicData: []
    },
    {
      width: 220,
      label: "所属部门",
      prop: "deptName",
      type: "select",
      overHidden: true,
      minRows: 6,
      span: 24,
      searchMmultiple: true,
      props: {
        label: "name",
        value: "deptId"
      },
      dicData: []
    },
    {
      label: "销售范围",
      prop: "salesScope",
      solt: true
    },
    {
      label: "备注",
      prop: "remarks",
      type: "text",
      editDisabled: true,
      addVisdiplay: false,
      span: 24
    },
    {
      width: 200,
      label: "创建时间",
      prop: "createTime",
      type: "text",
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
