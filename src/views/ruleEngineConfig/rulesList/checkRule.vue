<template>
  <div class="execution" id="rulesDetails" ref="rulesDetails">
    <basic-container style="height: 100%">
      <h3 class="title">
        基础信息
        <el-tag
          size="mini"
          style="margin-left: 10px"
          type="warning"
          v-if="!detailsData.isPrd && detailsData.testVersion"
          >测试{{ detailsData.testVersion }}.0</el-tag
        >
        <el-tag size="mini" style="margin-left: 10px" type="success" v-if="detailsData.isPrd && detailsData.prdVersion"
          >线上{{ detailsData.prdVersion }}.0</el-tag
        >
      </h3>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="名称："> {{ detailsData.name }} </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="编码："> {{ detailsData.code }} </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="分类：">
                {{ detailsData.className }}
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="备注："> {{ detailsData.remark }} </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <h3 class="title">规则配置</h3>
      <div :style="{ minHeight: `${rulesDetailsHeight - 330}px` }">
        <div class="rule-box" v-for="(item, index) in detailsData?.details?.statements" :key="index">
          <p class="rule-title" @click="toggleAccordion(index)">
            <span style="margin-right: auto">{{ index + 1 }}</span>
            <span class="rule-title-right">
              <i
                style="margin-right: 10px"
                class="el-icon-arrow-right icon-arrow"
                :class="{ 'icon-arrow-down': expandedArr[index], 'icon-arrow-right': !expandedArr[index] }"
              ></i>
            </span>
          </p>
          <!-- <transition
            v-on:before-enter="beforeEnter"
            v-on:after-enter="afterEnter"
            v-on:before-leave="beforeLeave"
            v-on:after-leave="afterLeave"
          > -->
          <div class="rule-content" v-show="expandedArr[index]">
            <div v-for="(item1, index1) in item.conditionGroups.conditions" :key="index1">
              <p class="condition-title" v-if="index1 == 0">条件</p>
              <p class="condition-title" v-else-if="item.conditionGroups.conditions.length - 1 == index1">
                {{ findLabelOrName(optionData?.boolSelects, item.conditionGroups.operator[1]) }}

                <!-- 或者 -->
              </p>
              <!-- 条件组 -->
              <div class="cond-group">
                <div class="cond-item" v-if="false">
                  <el-row :gutter="12">
                    <el-col :span="3"><i></i></el-col>
                    <el-col :span="3"> <span style="color: red">*</span>左值</el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3"> <span style="color: red">*</span>计算符</el-col>
                    <el-col :span="3"> <span style="color: red">*</span>右值</el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3"> <i></i></el-col>
                  </el-row>
                </div>
                <div class="cond-item" v-for="(item2, index2) in item1.expressions" :key="index2">
                  <el-row :gutter="12">
                    <el-col :span="2">
                      <span v-if="index2 == item1.expressions.length - 1 && index2 !== 0">
                        {{ findLabelOrName(optionData?.boolSelects, item1.operator[1]) }}
                      </span>
                      <i v-else></i>
                    </el-col>
                    <el-col :span="22">
                      <el-tag size="small" class="tag-item">
                        {{ findLabelOrName(optionData.leftSelects, item2.leftValue.generalRuleValueType) }}</el-tag
                      >

                      <el-tag size="small" class="tag-item">
                        {{
                          findLabelOrName(
                            optionData[findMappingName(optionData.leftSelects, item2.leftValue.generalRuleValueType)],
                            item2.leftValue.code
                          )
                        }}</el-tag
                      >

                      <span class="tag-item">{{
                        findLabelOrName(
                          optionData?.operatorSelectMap?.[capitalizeFirstLetter(item2.operator[0])],
                          item2.operator[1]
                        )
                      }}</span>

                      <el-tag size="small" type="warning" class="tag-item">{{
                        findLabelOrName(optionData.rightSelects, item2.rightValue.generalRuleValueType)
                      }}</el-tag>

                      <template v-if="isFixedValuetype(item2.rightValue.generalRuleValueType)">
                        <el-tag
                          size="small"
                          type="warning"
                          class="tag-item"
                          v-if="item2.rightValue.generalRuleValueType !== 'NULL'"
                        >
                          {{
                            item2.rightValue.generalRuleValueType == "BOOL"
                              ? item2.rightValue.value == "true"
                                ? "是"
                                : "否"
                              : item2.rightValue.value
                          }}
                        </el-tag>
                      </template>
                      <template v-else>
                        <el-tag size="small" type="warning" class="tag-item">{{
                          findLabelOrName(
                            optionData[findMappingName(optionData.rightSelects, item2.rightValue.generalRuleValueType)],
                            item2.rightValue.code
                          )
                        }}</el-tag>

                        <el-tag
                          size="small"
                          type="warning"
                          class="tag-item"
                          v-if="
                            (item2.rightValue.generalRuleValueType == 'OPTION' && item2.rightValue.checked == true) ||
                            (item2.rightValue.generalRuleValueType == 'OPTION' && item2.rightValue.checked == false)
                          "
                        >
                          {{
                            item2.rightValue.checked
                              ? "全选"
                              : findMapLabelOrName(item2.rightValue.optionsList, item2.rightValue.value)
                          }}
                        </el-tag>
                      </template>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>

            <!-- 执行结果 -->
            <p class="condition-title">执行结果</p>
            <div class="result">
              <div class="result-item cond-item" v-for="(its, ind1) in item.statementResult.results" :key="ind1">
                <el-row :gutter="12">
                  <el-col :span="2"><i></i></el-col>
                  <el-col :span="4">
                    <el-tag type="success" size="small" v-if="!isFixedValuetype(its.type)">
                      {{ findLabelOrName(optionData.resultSelects, its.type) }}
                      {{
                        `-${findLabelOrName(optionData[findMappingName(optionData.resultSelects, its.type)], its.code)}`
                      }}
                      {{ its.value ? `-${its.checked ? "全选" : findMapLabelOrName(its.optionsList, its.value)}` : "" }}
                    </el-tag></el-col
                  >

                  <el-col :span="18" v-if="isFixedValuetype(its.type)">
                    <el-tag class="tag-item" type="success" size="small"
                      >{{ findLabelOrName(optionData.resultSelects, its.type) }}
                    </el-tag>
                    <el-tag class="tag-item" type="success" size="small">{{ its.code }} </el-tag
                    ><el-tag class="tag-item" type="success" size="small">
                      {{ its.type == "BOOL" ? (its.value == "true" ? "是" : "否") : its.value }}
                    </el-tag>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <!-- </transition> -->
        </div>
      </div>

      <div class="add-button-group" v-if="done">
        <el-button
          type="primary"
          @click="handlePublish"
          v-if="permissions.baseSetup_rule_rule_publish && !detailsData.isPrd"
          >发 布</el-button
        >
        <el-button
          type="primary"
          v-if="permissions.baseSetup_rule_rule_edit && detailsData.isLatest"
          plain
          @click="handleEdit"
          >编 辑</el-button
        >
        <el-button
          type="primary"
          v-if="permissions.baseSetup_rule_rule_oldEnabled && !detailsData.isLatest"
          plain
          @click="handleEdit"
          >旧版启用</el-button
        >

        <el-button type="primary" v-if="permissions.baseSetup_rule_rule_copy" @click="handleReApply"
          >复制规则</el-button
        >
      </div>
      <ExecutionDetails ref="executionDetails" />
    </basic-container>
  </div>
</template>

<script>
import {
  getRuleDetail,
  getRuleEditorInfo,
  copyGeneralRule,
  justPublish,
  getOptionSet
} from "@/api/ruleEngineConfig/rulesList.js"
import { getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import { mapGetters } from "vuex"
import ExecutionDetails from "../components/executionDetails.vue"
import request from "@/router/axios"

export default {
  name: "rulesDetails",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },

      expandedArr: [],
      sceneId: "",
      id: "",
      detailsData: {
        details: {
          statements: []
        }
      },
      sceneClassificationList: [],
      optionData: {},
      rulesDetailsHeight: 0,
      done: false,
      allOptionMap: {}
    }
  },
  components: { ExecutionDetails },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {},
  async mounted() {
    this.sceneId = this.$route.query.sceneId
    this.id = this.$route.query.id
    await Promise.all([this.getFactorList(), this.getClassificationPage(this.sceneId), this.getOptionSet()])
    this.getDetail()

    this.rulesDetailsHeight = this.$refs.rulesDetails.getBoundingClientRect().height
  },
  methods: {
    isFixedValuetype(type) {
      const fixedItem = this.optionData?.rightSelects?.find((item) => item.value === "FIXED")
      return fixedItem && fixedItem.children.some((child) => child.value === type)
    },
    capitalizeFirstLetter(str) {
      if (!str) return str // 检查字符串是否为空
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    findMappingName(data, searchKey) {
      if (!Array.isArray(data) || data.length === 0) {
        return null
      }
      for (const item of data) {
        // 检查 `value` 是否匹配
        if (item.value === searchKey) {
          return item.mappingName || null // 返回对应的 mappingName，如果不存在返回 null
        }
      }

      // 如果没有找到匹配的值，返回 null
      return null
    },
    findMapLabelOrName(data, searchKey) {
      const result = searchKey.split(",").map((item) => this.findLabelOrName(data, item))
      return result.join("，") || ""
    },
    findLabelOrName(data, searchKey) {
      if (!Array.isArray(data) || data.length === 0) {
        return null
      }

      for (const item of data) {
        // 检查 `code` 是否匹配
        if (item.code === searchKey) {
          return item.name || null
        }

        // 检查 `value` 是否匹配
        if (item.value === searchKey) {
          return item.label || null
        }

        // 递归检查 `children` 是否存在并且是否有匹配项
        if (Array.isArray(item.children) && item.children.length > 0) {
          const result = this.findLabelOrName(item.children, searchKey)
          if (result !== null) {
            return result
          }
        }
      }

      // 如果没有找到匹配的值，返回 null
      return null
    },
    async getFactorList() {
      const { data } = await getRuleEditorInfo({
        page: 1,
        pageSize: 9999,
        sceneId: this.sceneId
      })
      if (data.code === 0) {
        this.optionData = data.data
      }
    },
    async getClassificationPage(val) {
      const { data } = await getClassDisplayJson({
        classId: val,
        onlyNextLevel: false
      })
      this.sceneClassificationList = data.data
    },
    async getOptionSet() {
      const { data } = await getOptionSet({ id: this.id, sceneId: this.sceneId })
      if (data.code === 0) {
        this.allOptionMap = data.data
      }
    },
    async getDetail() {
      const { data } = await getRuleDetail({
        id: this.id,
        sceneId: this.sceneId
      })
      if (data.code == 0) {
        this.detailsData = data.data
        this.detailsData.className = this.findPathByValue(this.sceneClassificationList, this.detailsData.classId)

        this.expandedArr = new Array(this.detailsData.details?.statements?.length).fill(true)
        this.detailsData.details?.statements.forEach((item) => {
          item.conditionGroups.conditions?.forEach(async (item1) => {
            item1.expressions.forEach(async (item2) => {
              if (item2.rightValue?.generalRuleValueType === "OPTION") {
                // const fItem = this.optionData.rightOptions.find((it) => it.code === item2.rightValue.code)

                // if (!fItem || !fItem.url) return
                // await request({
                //   url: fItem.url,
                //   method: "post",
                //   data: {
                //     ...fItem,
                //     sceneId: this.sceneId,
                //     classId: this.detailsData.classId
                //   }
                // }).then((res) => {
                //   if (res.data.code == 0) {
                //     this.$set(item2.rightValue, "optionsList", res.data.data || [])
                //     if (res.data.data.length === item2.rightValue.value.split(",").length) {
                //       this.$set(item2.rightValue, "checked", true)
                //     } else {
                //       this.$set(item2.rightValue, "checked", false)
                //     }
                //   }
                // })
                item2.rightValue.optionsList = this.allOptionMap[item2.rightValue.code] || []

                if (item2.rightValue.optionsList.length === item2.rightValue.value.split(",").length) {
                  this.$set(item2.rightValue, "checked", true)
                } else {
                  this.$set(item2.rightValue, "checked", false)
                }
              }
            })
          })
          item.statementResult.results.forEach(async (its) => {
            if (its.type === "OPTION") {
              // const fItem = this.optionData.resultOptions.find((it) => it.code === its.code)

              // if (!fItem || !fItem.url) return
              // await request({
              //   url: fItem.url,
              //   method: "post",
              //   data: {
              //     ...fItem,
              //     sceneId: this.sceneId,
              //     classId: this.detailsData.classId
              //   }
              // }).then((res) => {
              //   if (res.data.code == 0) {
              //     this.$set(its, "optionsList", res.data.data || [])
              //     if (res.data.data.length === its.value.split(",").length) {
              //       this.$set(its, "checked", true)
              //     } else {
              //       this.$set(its, "checked", false)
              //     }
              //   }
              // })
              its.optionsList = this.allOptionMap[its.code] || []
              if (its.optionsList.length === its.value.split(",").length) {
                this.$set(its, "checked", true)
              } else {
                this.$set(its, "checked", false)
              }
            }
          })
        })
        this.done = true
      }
    },

    findPathByValue(tree, targetValue) {
      // 用于递归查找路径的辅助函数
      const dfs = (node, path) => {
        // 将当前节点的 label 添加到路径中
        path.push(node.label)

        // 如果找到目标 id，返回路径
        if (node.id === targetValue) {
          return path
        }

        // 遍历子节点进行递归查找
        if (node.children) {
          for (let child of node.children) {
            const result = dfs(child, [...path])
            if (result) return result // 如果找到路径，则返回结果
          }
        }
        return null
      }

      for (let root of tree) {
        const result = dfs(root, [])
        if (result) return result.join("/") // 拼接路径为字符串并返回
      }
      return ""
    },
    toggleAccordion(index) {
      let status = this.expandedArr[index]
      this.$set(this.expandedArr, index, !status)
    },
    // 进入时动态计算高度
    beforeEnter(el) {
      console.log("el进入", el)
      // el.style.height = "0"
      // el.offsetHeight // 强制重绘
      // el.style.transition = "height 0.3s ease"
      el.style.height = el.scrollHeight + "px"
    },
    afterEnter(el) {
      // 重置height，让元素可以自动调整高度
      el.style.height = ""
    },
    // 离开时收缩高度
    beforeLeave(el) {
      console.log("离开", el)
      el.style.height = el.scrollHeight + "px"
      el.offsetHeight // 强制重绘
      // el.style.transition = "height 0.3s ease"
      el.style.height = "0"
    },

    afterLeave(el) {
      el.style.height = ""
    },

    addConfiguration() {
      console.log("添加配置")
    },
    handleEdit() {
      this.$router.push({
        path: "/baseSetup/ruleEngineConfig/rulesList/editRule",
        query: { id: this.id, sceneId: this.sceneId }
      })
    },
    async handleReApply() {
      this.$router.push({
        path: "/baseSetup/ruleEngineConfig/rulesList/copyRule",
        query: {
          id: this.detailsData.id,
          sceneId: this.sceneId,
          copy: true
        }
      })
    },
    handleExecution() {
      this.$refs.executionDetails.openDialog(463)
    },
    async handlePublish() {
      const { data } = await justPublish({
        id: Number(this.id),
        isPrd: true
      })
      console.log("点击发布", data)
      if (data.code == 0) {
        this.$message({
          type: "success",
          message: "发布成功"
        })
        this.$router.$avueRouter.closeTag()
        this.$router.push({
          path: "/baseSetup/ruleEngineConfig/rulesList/index"
          // query: { refresh: true }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#rulesDetails {
  height: 100%;

  .title {
    font-size: 18px;
    margin-left: 20px;
    padding: 10px 0;
  }
  .rule-box {
    border: 1px solid #ebeef5;
    border-radius: 5px;
    // height: 300px;
    margin: 10px 0;
    .rule-title {
      display: flex;
      font-size: 14px;
      padding: 10px 20px;
      font-weight: bold;
      // border-bottom: 1px solid #ebeef5;
      cursor: pointer; /* 鼠标悬停显示手形 */
      font-weight: bold;
      .rule-title-right {
        display: flex;
        justify-content: flex-end;
        .el-icon-delete {
          color: red;
          font-size: 16px;
        }
      }
    }

    .rule-content {
      overflow: hidden;
      background-color: rgba(242, 242, 242, 1);
      height: calc(100% - 63px);
      padding: 10px 20px;
      background-color: rgba(242, 242, 242, 1);
      border-top: 1px solid #ebeef5;
      .condition-title {
        font-size: 14px;
        color: rgba(102, 102, 102);
        line-height: 22px;
      }

      .cond-group {
        border: 1px solid #ebeef5;
        background-color: #fff;
        margin: 4px 0;
        border-radius: 4px;
      }
      .cond-item {
        // height: 40px;
        box-sizing: border-box;
        padding: 6px 20px;
        border-bottom: 1px solid #ebeef5;
        &:last-child {
          border-bottom: none;
        }
      }
      .cond-item-button {
        display: flex;
        justify-content: flex-end;
        align-content: center;
        font-size: 16px;
        margin-top: 8px;
      }
      .add-condition-button {
        padding: 8px 0;
        border: 1px dashed #ebeef5;
        background-color: #fff;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 20px;
        &:hover {
          background-color: #edf7f7;
        }
      }
      .result {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        .result-item {
          box-sizing: border-box;
          // height: 48px;
          border-bottom: 1px solid #ebeef5;
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
  .add-configuration {
    background-color: #fff;
    border: 1px solid #ebeef5;
    text-align: center;
    font-size: 14px;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background-color: #edf7f7;
    }
  }

  .icon-arrow {
    transition: transform 0.3s ease;
  }
  .icon-arrow-down {
    transform: rotate(90deg); /* 箭头向下的旋转角度 */
  }
  .icon-arrow-right {
    transform: rotate(0deg); /* 箭头向右的初始角度 */
  }
  .add-button-group {
    margin: 20px 0;
  }

  .tag-item {
    margin-right: 10px;
  }
}

::v-deep .el-form-item {
  margin-bottom: 0;
}
::v-deep .el-collapse-item__header {
  position: relative;
}
::v-deep .el-collapse-item__arrow {
  position: absolute;
  right: 10px;
  top: 20px;
}
::v-deep .cond-item .el-col {
  margin-bottom: 0px !important;
}
</style>
