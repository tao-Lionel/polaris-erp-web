<template>
  <div class="admin-dialog">
    <el-dialog title="职务" @close="closeDialog" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-row v-for="(k, v) in data" :key="v">
        <div class="admin-info">
          <el-col style="text-align: left">组: {{ k.groupName }}</el-col>
          <el-col style="text-align: left">职务: {{ k.userPositionName }}/{{ k.dataShareName }}</el-col>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { Dialog } from "element-ui"
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    data: Array,
    isShowDialog: Boolean
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    closeDialog() {
      this.$emit("adminDialog", false)
    }
  },
  mounted() {
    // console.log('子组件',this.data)
  },
  watch: {
    isShowDialog(a, b) {
      if (a) {
        this.dialogVisible = a
        // this.isShowDialog=this.isShowDialog
      } else {
      }
    }
  }
}
</script>
<style></style>
