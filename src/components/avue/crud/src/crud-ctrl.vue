<template>
  <div :class="b()">
    <el-button v-for="item in localList" :key="item.title" type="text" size="small" @click.stop="clickItem(item)">
      {{ item.title }}
    </el-button>

    <div v-if="moreList.length > 0">
      <el-dropdown trigger="click">
        <el-button type="text" size="small">更多</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in moreList"
            :key="item.title"
            @click.native="clickItem(item)"
            :style="item.style"
          >
            {{ item.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import crudCompoents from "../../mixins/crud-compoents.js"
import create from "../../utils/create"

export default create({
  name: "crud-ctrl",
  components: {},
  props: {
    list: {
      type: Array,
      required: true
    },
    // 默认的可见项目数量
    defaultShowNumber: {
      type: Number,
      default: 3
    }
  },
  mixins: [crudCompoents()],
  data() {
    return {
      localList: [],
      moreList: []
    }
  },
  watch: {
    list: {
      handler(val) {
        this.init()
      },
      deep: true
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
      this.localList = []
      this.moreList = []
      // 过滤出需要显示的项目
      const visibleItems = this.list.filter((item) => item.show)

      // 如果可见项目数量超过显示上限，则分割为主列表和更多列表
      if (visibleItems.length > this.defaultShowNumber) {
        this.localList = visibleItems.slice(0, this.defaultShowNumber)
        this.moreList = visibleItems.slice(this.defaultShowNumber)
      } else {
        this.localList = visibleItems
      }
    },
    clickItem(obj) {
      // 回调方法
      obj.clickFn(obj.item)
    }
  }
})
</script>

<style lang="scss" scoped>
.avue-crud-ctrl {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  ::v-deep .el-button {
    padding: 4px 5px;
  }
  ::v-deep .el-button + .el-button {
    margin-left: 0px;
  }
}
</style>
