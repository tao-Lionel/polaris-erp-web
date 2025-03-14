<template>
  <el-dialog title="执行明细" :visible.sync="dialogVisible" width="60%" @open="open" close-on-press-escape>
    <div class="env-map">
      <div class="tree-wrapper">
        <vue2-org-tree :data="treeData" :horizontal="false" :labelWidth="100" @on-node-click="onNodeClick" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>

    <el-dialog width="30%" title="内容" :visible.sync="innerVisible" append-to-body>
      <el-card class="box-card" v-for="(item, index) in innerData" :key="index">
        <div v-for="(value, key) in item" :key="key" class="text item">
          <strong style="color: #2196f3">{{ key }}</strong>
          <template v-if="typeof value === 'object' && !Array.isArray(value)">
            <div v-for="(subValue, subKey) in value" :key="subKey">
              <span style="color: #667eea">{{ subKey }}</span
              >: {{ subValue }}
            </div>
            <br />
          </template>
          <template v-else-if="Array.isArray(value)">
            <div v-for="(arrItem, arrIndex) in value" :key="arrIndex">
              <strong>{{ key }}[{{ arrIndex }}]:</strong>
              <template v-if="typeof arrItem === 'object'">
                <div v-for="(subArrValue, subArrKey) in arrItem" :key="subArrKey">
                  <span style="color: #667eea">{{ subArrKey }}</span> : {{ subArrValue }}
                </div>
              </template>
              <template v-else>
                {{ arrItem }}
              </template>
            </div>
            <br />
          </template>
          <template v-else>
            {{ value }}
            <br />
          </template>
        </div>
      </el-card>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getExecuteDetailsById } from "@/api/ruleEngineConfig/rulesList.js"
import Vue2OrgTree from "vue2-org-tree"
import "vue2-org-tree/dist/style.css"

export default {
  props: {
    type: {
      default: "rule"
    }
  },
  data() {
    return {
      dialogVisible: false,
      treeData: {},
      treeProps: {
        label: "label", // 数据对象中的文本字段名
        children: "children" // 数据对象中的子节点字段名
      },
      currentRow: null,
      result: null,
      innerVisible: false,
      innerData: null
    }
  },
  components: { Vue2OrgTree },
  methods: {
    onNodeClick(e, data) {
      console.log("ee", e, data)
      this.innerVisible = true
      this.innerData = data[`${data.label}#${data.id}`].ExecuteGroupContents
    },
    async openDialog(id) {
      console.log("id", id)
      const { data } = await getExecuteDetailsById({ id })
      if (data.code == 0) {
        if (!data.data) {
          this.$message.info("无执行明细数据")
          return
        }
        this.treeData = JSON.parse(data.data)
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  width: 100%;
  height: 400px;
  overflow: auto; /* 添加滚动功能 */
  border: 1px solid #ddd; /* 可选：增加边框以便观察效果 */
  position: relative; /* 以确保树形图能够滚动 */
}

/* 滚动条样式 */
.tree-wrapper::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
  height: 8px; /* 设置水平滚动条高度 */
}

/* 滚动条轨道 */
.tree-wrapper::-webkit-scrollbar-track {
  background: #f5f5f5; /* 滚动条轨道背景色 */
  border-radius: 4px; /* 滚动条轨道的圆角 */
}

/* 滚动条滑块 */
.tree-wrapper::-webkit-scrollbar-thumb {
  background: rgba(188, 191, 193, 0.4);
  border-radius: 4px; /* 滑块的圆角 */
}

/* 滑块悬停效果 */
.tree-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(188, 191, 193, 0.5);
}

/* 可选：调整滚动条两端按钮的颜色（如果有） */
.tree-wrapper::-webkit-scrollbar-button {
  display: none; /* 隐藏两端按钮 */
}
::v-deep .org-tree-node-label .org-tree-node-label-inner {
  padding: 6px 10px !important;
  word-break: normal;
}
</style>
