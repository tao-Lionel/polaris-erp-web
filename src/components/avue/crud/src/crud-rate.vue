<template>
  <el-rate
    v-model="text"
    style="margin-top: 10px"
    @change="handleChange"
    @click.native="handleClick"
    :max="max"
    :readonly="readonly"
    :show-text="showText"
    :icon-classes="iconClasses"
    :void-icon-class="voidIconClass"
    :disabled="disabled"
    :colors="colors"
  ></el-rate>
</template>

<script>
import create from "../../utils/create"
import crudCompoents from "../../mixins/crud-compoents.js"
import crudFun from "../../mixins/crud-fun.js"
export default create({
  name: "crud-rate",
  mixins: [crudCompoents(), crudFun()],
  props: {
    value: {
      type: Number,
      default: 0
    },
    colors: {
      type: Array
    },
    max: {
      type: Number,
      default: 5
    },
    iconClasses: {
      type: Array
    },
    texts: {
      type: Array
    },
    showText: {
      type: Boolean,
      default: false
    },
    voidIconClass: {
      type: String
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
})
</script>
