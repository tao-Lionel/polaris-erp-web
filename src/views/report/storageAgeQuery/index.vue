<template>
  <div id="storageAgeQuery">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="平台站点库龄" name="first">
          <platformStorageAge></platformStorageAge>
        </el-tab-pane>
        <el-tab-pane label="仓库库龄" name="second">
          <warehouseStorageAg></warehouseStorageAg>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import warehouseStorageAg from "./warehouseStorageAg.vue"
import platformStorageAge from "./platformStorageAge.vue"

export default {
  name: "storageAgeQueryList",
  components: {
    warehouseStorageAg,
    platformStorageAge
  },
  data() {
    return {
      activeName: "first"
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss"></style>
