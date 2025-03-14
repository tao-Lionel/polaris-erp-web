<template>
  <el-select
    v-model="selectAllValue"
    :filter-method="filterMethod"
    reserve-keyword
    multiple
    collapse-tags
    clearable
    filterable
    @visible-change="visibleChange"
    @change="changeSelect"
    v-bind="$attrs"
  >
    <div class="checkbox">
      <el-checkbox v-model="checked" @change="changeSelectAll">全选</el-checkbox>
    </div>
    <el-option v-for="item in list" :key="item[keyName]" :label="item[labelName]" :value="item[keyName]"></el-option>
  </el-select>
</template>

<script>
import { deepClone } from "@/components/avue/utils/util"

export default {
  name: "SelectAll",
  components: {},
  props: {
    options: {
      type: Array,
      default: () => []
    },
    keyName: {
      type: String,
      default: "value"
    },
    labelName: {
      type: String,
      default: "label"
    },
    selectValue: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: false,
      list: [],
      selectAllValue: []
    }
  },
  watch: {
    options() {
      console.log("options", this.options)
      this.list = deepClone(this.options)
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    filterMethod(val) {
      console.log("val", val)
      // 转大写
      const valUpper = val.toUpperCase()
      this.list = this.options.filter((item) => item.sitName.includes(valUpper))
    },
    changeSelectAll() {
      this.$emit("update:selectValue", [])
      this.selectAllValue = []
      if (this.checked) {
        this.list.map((item) => {
          this.selectAllValue.push(item[this.keyName])
        })
        this.$emit("update:selectValue", this.selectAllValue)
        this.$emit("change", this.selectAllValue)
      } else {
        this.$emit("update:selectValue", [])
      }
    },
    changeSelect(val) {
      if (!val?.length) {
        this.list = this.options
      }
      if (val.length === this.list.length) {
        this.checked = true
      } else {
        this.checked = false
      }
      this.$emit("update:selectValue", this.selectAllValue)
      this.$emit("change", val)
    },
    resetSelectAll() {
      this.checked = false
      this.selectAllValue = []
      this.$emit("update:selectValue", this.selectAllValue)
    },
    visibleChange(val) {
      this.$emit("visible-change", val)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}
</style>
