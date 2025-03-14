export const rowForm = {
  attributeId: null,
  attributeName: "",
  attributeValues: [
    {
      attributeValueId: null,
      attributeValueName: "",
      funcState: ""
    }
  ]
}

export const rules = {
  attributeName: [
    { required: true, message: "请输入属性名称", trigger: "blur" },
    { min: 1, max: 30, message: "属性名称不得超过30位字符", trigger: "blur" }
  ]
}
