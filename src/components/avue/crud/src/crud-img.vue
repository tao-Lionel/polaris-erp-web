<template>
  <div :class="b()">
    <img v-if="status" :src="text" :width="setPx(imgWidth, '100%')" :height="setPx(imgHeight)" alt="" />
    <el-button v-else :size="size" @click="handleViews">查 看</el-button>
    <el-dialog
      :visible.sync="box"
      width="60%"
      :class="{ 'avue-crud-img--fullscreen': fullscreen }"
      :fullscreen="fullscreen"
      modal-append-to-body
      append-to-body
    >
      <avue-carousel :option="option"></avue-carousel>
    </el-dialog>
  </div>
</template>

<script>
import create from "../../utils/create"
import crudCompoents from "../../mixins/crud-compoents.js"
import { setPx } from "../../utils/util"
export default create({
  name: "crud-img",
  mixins: [crudCompoents()],
  data() {
    return {
      box: false
    }
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    dataType: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "small"
    },
    listType: {
      type: String,
      default: ""
    },
    value: {},
    imgWidth: {},
    imgHeight: {}
  },
  computed: {
    option() {
      if (this.status) return {}
      let list = []
      this.text.forEach((ele) => {
        if (this.isArray) {
          list.push({
            src: ele
          })
        } else {
          list.push({
            title: ele[this.labelKey],
            src: ele[this.valueKey]
          })
        }
      })
      return {
        autoplay: true,
        type: this.type,
        fullscreen: this.fullscreen,
        interval: 3000,
        data: list
      }
    },
    isArray() {
      return this.dataType === "array"
    },
    status() {
      return this.listType === "picture-img"
    }
  },
  watch: {},
  created() {
    this.setPx = setPx
  },
  mounted() {},
  methods: {
    handleViews() {
      this.box = true
    }
  }
})
</script>

<style lang="scss">
.avue-crud-img {
  display: flex;
  align-items: center;
  justify-content: center;
  &--fullscreen {
    .el-dialog__body {
      height: 100%;
    }
  }
}
</style>
