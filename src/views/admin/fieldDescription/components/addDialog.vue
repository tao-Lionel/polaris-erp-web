<template>
  <el-dialog :title="title" :visible.sync="showDialog" width="500px" @close="closeDialog">
    <div>
      <el-form :model="form" ref="form" :rules="rules" inline label-width="100px">
        <el-form-item label="功能" prop="funcName">
          <el-cascader
            v-model="form.funcName"
            :options="funcNameOptions"
            filterable
            :props="{
              expandTrigger: 'hover',
              value: 'pathName',
              label: 'name',
              children: 'children',
              checkStrictly: true
            }"
            size="small"
            @change="changeFuncName"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="字段" prop="fieldName">
          <el-input v-model="form.fieldName" size="small" placeholder="请输入字段"></el-input>
        </el-form-item>
        <el-form-item label="字段说明" prop="description">
          <el-input
            v-model="form.description"
            size="small"
            placeholder="请输入字段说明"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFuncTreeApi, saveOrUpdateFieldApi } from "@/api/admin/fieldDescription.js"

let form = {
  id: "",
  funcName: "",
  fieldName: "",
  description: "",
  routeKey: "",
  functionName: ""
}

export default {
  name: "fieldDescriptionAddDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      rules: {
        funcName: [{ required: true, message: "请选择功能", trigger: "blur" }],
        fieldName: [{ required: true, message: "请输入字段", trigger: "blur" }],
        description: [{ required: true, message: "请输入字段说明", trigger: "blur" }]
      },
      funcNameOptions: []
    }
  },
  computed: {
    title() {
      return this.form.id ? "编辑" : "新增"
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    openDialog(row) {
      this.form = { ...form }
      if (row) {
        this.form = {
          id: row.id,
          funcName: row.funcName,
          fieldName: row.fieldName,
          description: row.description,
          routeKey: row.routeKey,
          functionName: row.functionName
        }
      }
      this.showDialog = true
      this.getFuncTree()
    },
    async getFuncTree() {
      const { data } = await getFuncTreeApi()
      if (data.code === 0) {
        this.funcNameOptions = this.setChildren(data.data)
        console.log(this.funcNameOptions)
      }
    },
    setChildren(arr) {
      arr.forEach((item) => {
        item.pathName = item.name + "#" + item.path
        if (item.children && item.children.length > 0) {
          this.setChildren(item.children)
        } else {
          item.children = null
        }
      })
      return arr
    },
    changeFuncName(val) {
      console.log(val)
      let routeKey = []
      let functionName = []
      this.form.funcName.forEach((item) => {
        routeKey.push(item.split("#")[1])
        functionName.push(item.split("#")[0])
      })

      this.form.routeKey = routeKey.pop()
      this.form.functionName = functionName.join("/")
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(this.form)

          const { data } = await saveOrUpdateFieldApi(this.form)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.$emit("updateList")
            this.showDialog = false
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    closeDialog() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped></style>
