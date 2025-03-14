<template>
  <el-dialog
    title="测试试算"
    :visible.sync="dialogVisible"
    width="40%"
    @open="open"
    top="5vh"
    close-on-press-escape
    :before-close="closeDialog"
  >
    <div class="env-map">
      <el-form ref="form" :model="form">
        <el-form-item label-width="200px" :label="`${item.name}：`" v-for="item in paramsArray" :key="item.code">
          <el-input-number
            v-model="form[item.code]"
            :controls="false"
            v-if="item.generalRuleValueType === 'DATE'"
          ></el-input-number>

          <el-select v-model="form[item.code]" placeholder="请选择" v-else-if="item.generalRuleValueType === 'BOOL'">
            <el-option label="是" :value="true"> </el-option>
            <el-option label="否" :value="false"> </el-option>
          </el-select>
          <el-select
            multiple
            filterable
            clearable
            style="width: 100%"
            collapse-tags
            v-model="form[item.code]"
            placeholder="请选择"
            @visible-change="visibleChange"
            v-else-if="item.isOption"
          >
            <el-option v-for="i in item.optionsList" :key="i.value + 1" :label="i.label" :value="i.value"> </el-option>
          </el-select>

          <el-input v-model="form[item.code]" v-else></el-input>
        </el-form-item>
        <el-form-item label-width="200px" label="验算结果：">
          <p v-if="typeof result === 'string'" style="word-wrap: break-word; white-space: pre-wrap">{{ result }}</p>
          <template v-else>
            <p v-for="(value, key) in result" :key="key">{{ key }}: {{ value }}</p>
          </template>
        </el-form-item>
      </el-form>
      <div class="tree-wrapper" v-if="Object.keys(treeData).length > 0">
        <vue2-org-tree
          :data="treeData"
          :props="treeProps"
          :horizontal="false"
          :labelWidth="100"
          @on-node-click="onNodeClick"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">计 算</el-button>
    </span>
    <el-dialog width="60%" title="内容" :visible.sync="innerVisible" append-to-body top="5vh">
      <el-collapse>
        <el-collapse-item
          v-for="(group, groupIndex) in innerData"
          :key="groupIndex"
          :title="`输出值： ${group['输出值']}`"
          :name="groupIndex + '-' + key"
        >
          <ul>
            <li
              style="word-break: break-word; white-space: normal"
              v-for="(childValue, childKey) in group.children"
              :key="childKey"
            >
              <strong>{{ childKey }}:</strong> {{ childValue }}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { ruleExecute, ruleGetInputObjs } from "@/api/ruleEngineConfig/rulesList.js"
import { variablesExecute } from "@/api/ruleEngineConfig/variables.js"
import { functionExecute, functionGetInputObjs } from "@/api/ruleEngineConfig/functionList.js"
import { cloneDeep } from "lodash"
import Vue2OrgTree from "vue2-org-tree"
import "vue2-org-tree/dist/style.css"
import request from "@/router/axios"

export default {
  props: {
    type: {
      default: "rule"
    }
  },

  data() {
    return {
      dialogVisible: false,
      executeAPI: {
        rule: ruleExecute,
        function: functionExecute
      },
      paramAPI: {
        rule: ruleGetInputObjs,
        function: functionGetInputObjs
      },
      paramsArray: [],
      form: {},

      treeData: {},
      treeProps: {
        label: "label", // 数据对象中的文本字段名
        children: "children" // 数据对象中的子节点字段名
      },
      currentRow: null,
      result: null,
      innerVisible: false,
      innerData: null,
      activeNames: ["1"],
      sceneId: ""
    }
  },
  watch: {
    optionsList: {
      handler(newVal, oldVal) {
        console.log("newVal, oldVal", newVal, oldVal)
      },
      deep: true
    }
  },

  components: { Vue2OrgTree },
  methods: {
    onNodeClick(e, data) {
      console.log("ee", data[`${data.label}#${data.id}`].ExecutingInfoList)
      this.innerData = data[`${data.label}#${data.id}`]?.ExecutingInfoList?.map((item) => {
        const outputValues = item["输出值"]
          ? Object.entries(item["输出值"])
              .map(([key, value]) => `${key}：${value}`)
              .join("，")
          : "输出值为空" // 默认值

        // 将 item 的所有键值对转换为 children 对象
        const children = Object.entries(item).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
        return {
          [`输出值`]: outputValues,
          children
        }
      })
      console.log(" this.innerData ", this.innerData)
      if (!this.innerData) {
        this.$message.info("无内容数据")
        return
      }
      this.innerVisible = true
    },

    async openDialog(row) {
      this.dialogVisible = true
      this.result = null
      this.paramsArray = []
      this.currentRow = row
      this.sceneId = row.sceneId

      const { code, name, isPrd } = row
      const { data } = await this.paramAPI[this.type]({
        code,
        name,
        isPrd,
        sceneId: row.sceneId,
        classId: row.classId
      })
      if (data.code == 0) {
        this.paramsArray = data.data
        for (const ele of this.paramsArray) {
          if (ele.isOption) {
            if (!ele.optionUrl) return
            await request({
              url: ele.optionUrl,
              method: "post",
              data: {
                ...ele,
                code: ele.optionCode,
                sceneId: row.sceneId,
                classId: row.classId
              }
            }).then((res) => {
              if (res.data.code == 0) {
                console.log("res.data.data", res.data.data)
                ele.optionsList = res.data.data || []
              }
            })
          }
        }
        data.data?.forEach((item) => {
          // console.log("item", item)
          if (item.code) {
            // 使用 Vue.$set 确保动态添加的属性是响应式的
            if (item.generalRuleValueType === "NUMBER") {
              this.$set(this.form, item.code, null)
            } else {
              this.$set(this.form, item.code, "")
            }
          }
        })
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.treeData = {}
    },
    transformObjectValues(obj) {
      return Object.entries(obj).reduce((result, [key, value]) => {
        if (value === "") {
          result[key] = null // 如果值是空字符串，赋值为 null
        } else if (Array.isArray(value)) {
          result[key] = value.join(",") // 如果值是数组，转为逗号分隔的字符串
        } else {
          const numericValue = Number(value) // 尝试将值转为数字
          result[key] = isNaN(numericValue) ? value : numericValue // 判断是否为 NaN
        }
        return result
      }, {})
    },
    async handleConfirm() {
      let postData = {
        code: this.currentRow.code,
        time: this.getCurrentTime(),
        envMap: this.transformObjectValues(this.form),
        isPrd: this.currentRow.isPrd,
        sceneId: this.sceneId
      }

      const { data } = await this.executeAPI[this.type](postData)
      if (data.code === 0) {
        this.result = data.data.result && Object.keys(data.data.result)?.length ? data.data.result : data.data.error
      }
      console.log("data===>", data.data)
      this.treeData = data.data.executeInfo.children[0]
    },
    getCurrentTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    visibleChange(val) {
      if (val) {
        document.querySelectorAll(".el-select-dropdown__list").forEach((element) => {
          element.style.maxWidth = "100%"
        })
      } else {
        document.querySelectorAll(".el-select-dropdown__list").forEach((element) => {
          element.style.maxWidth = ""
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.env-map {
  padding: 20px;
}

::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.tree-wrapper {
  width: 100%;
  min-height: 100px;
  max-height: 400px;
  overflow: auto; /* 添加滚动功能 */
  border: 1px solid #ddd; /* 可选：增加边框以便观察效果 */
  position: relative; /* 以确保树形图能够滚动 */
  text-align: center;
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
::v-deep .env-map .el-input__inner {
  max-height: 40px !important;
}
</style>
