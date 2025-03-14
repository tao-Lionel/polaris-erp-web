<template>
  <div class="y-table">
    <el-table
      :data="data"
      :border="option.border"
      v-loading="tableLoading"
      :header-cell-class-name="headerCellClassName"
    >
      <!-- 控制行 -->
      <el-table-column
        v-for="(column, index) in option.column"
        :key="index"
        :label="column.label"
        :prop="column.prop"
        align="center"
      >
        <template slot-scope="scope">
          <!-- 插入的列table_003 -->
          <slot v-if="column.solt" :name="column.prop" :row="scope.row"></slot>
          <!--正常显示 -->
          <span :title="scope.row[column.prop]" class="y-table-row" v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "y-table",
  data() {
    return {
      headerCellClassName() {
        return "headerCellClassName"
      }
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    option: {
      type: Object,
      default() {
        return []
      }
    },
    tableLoading: Boolean
  },
  computed: {},
  methods: {},
  components: {}
}
</script>

<style lang="scss">
.y-table {
  .headerCellClassName {
    color: #949aa7;
    font-weight: 500;
  }
  .y-table-row {
    cursor: pointer;
  }
}
</style>
