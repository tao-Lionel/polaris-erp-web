<template>
  <el-form-item>
    <div :class="b()">
      <div style="display: flex; align-items: center">
        <el-select v-model="curField" size="small" placeholder="请选择" @change="changeField">
          <el-option v-for="item in searchFields" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <el-date-picker
          v-if="componentType === 'daterange'"
          v-model="formValue"
          size="small"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-input
          v-else-if="componentType === 'input'"
          v-model="formValue"
          v-search-input
          clearable
          placeholder="请输入"
          size="small"
        ></el-input>

        <el-date-picker
          v-else-if="componentType === 'datetimerange'"
          v-model="formValue"
          size="small"
          type="datetimerange"
          range-separator="至"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </div>
    </div>
  </el-form-item>
</template>

<script>
import { mapGetters } from "vuex"
import crudCompoents from "../../mixins/crud-compoents.js"
import create from "../../utils/create"

export default create({
  name: "crud-search-item",
  components: {},
  props: {
    // 下拉的字段列表
    // 示例：{ label: "创建时间", value: "createTime", type: "input", default: true },
    searchFields: {
      type: Array,
      required: false
    }
  },
  mixins: [crudCompoents()],
  data() {
    return {
      curField: "", // 当前选择的字段
      oldField: "", // 上一次选择的字段
      componentType: "input",
      formValue: undefined
    }
  },
  watch: {
    formValue(val) {
      this.$emit("updateField", { [this.curField]: val })
    }
  },
  created() {},
  mounted: function () {
    this.init()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      let defaultItem = this.searchFields.find((item) => item?.default)
      const { value, type } = defaultItem
      let curField = value ? value : this.searchFields[0].value
      let componentType = type ? type : this.searchFields[0].type
      this.curField = curField // 获取默认显示的字段名
      this.oldField = curField
      this.componentType = componentType
    },
    // 切换字段值
    changeField(val) {
      let obj = this.searchFields.find((item) => item.value === val)
      this.formValue = undefined
      this.componentType = obj.type
      this.$emit("updateField", { [this.oldField]: undefined })
      this.oldField = val // 更新上一次选择的字段
    },
    // 重置搜索条件
    resetField() {
      this.formValue = undefined
    }
  }
})
</script>

<style lang="scss" scoped>
.avue-crud-search-item {
  display: flex;
  width: auto;

  ::v-deep .el-select {
    width: 130px !important;
    .el-input {
      width: 130px !important;
    }
  }
}
</style>
