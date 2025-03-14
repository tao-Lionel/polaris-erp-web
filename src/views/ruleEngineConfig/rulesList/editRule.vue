<template>
  <div class="execution" id="editRulesDetails" ref="rulesDetails">
    <basic-container>
      <h3 class="title">
        基础信息
        <el-tag size="mini" style="margin-left: 10px" type="warning" v-if="!form.isPrd && form.testVersion"
          >测试{{ form.testVersion }}.0</el-tag
        >
        <el-tag size="mini" style="margin-left: 10px" type="success" v-if="form.isPrd && form.prdVersion"
          >线上{{ form.prdVersion }}.0</el-tag
        >
      </h3>

      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
          <el-row :gutter="12">
            <el-col :span="8"
              ><el-form-item label="名称：" prop="name">
                <el-input
                  clearable
                  class="el-input--small"
                  placeholder="支持输入中英文、数字"
                  size="mini"
                  v-model="form.name"
                ></el-input>
                <!-- :disabled="!!id && !copy" -->
              </el-form-item></el-col
            >

            <el-col :span="8">
              <el-form-item label="分类：" prop="classId">
                <el-cascader
                  size="small"
                  style="width: 100%"
                  v-model="form.classIdArr"
                  :options="sceneClassificationList"
                  :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                  clearable
                  @change="classIdArrChange"
                  :show-all-levels="false"
                ></el-cascader>
                <!-- :disabled="!!id && !copy" -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="备注：">
                <el-input
                  clearable
                  class="el-input--small"
                  placeholder="暂无数据"
                  size="mini"
                  v-model="form.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <h3 class="title">规则配置</h3>

      <div :style="{ minHeight: `${rulesDetailsHeight - 260}px` }" class="rule-content-box">
        <div class="rule-box" v-for="(item, index) in details.statements" :key="index">
          <p class="rule-title" @click="toggleAccordion(index)">
            <span class="rule-title-right">
              <span style="margin-right: auto">{{ index + 1 }}</span>
              <el-popover placement="top" width="160" v-model="item.copyVisible">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <el-input-number
                    style="width: 60px"
                    :controls="false"
                    v-model="item.copyCount"
                    :mini="1"
                    size="mini"
                    clearable
                  />
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item.copyVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="copyFullRule(index, item)">确定</el-button>
                  </div>
                </div>
                <i slot="reference" style="margin-right: 10px" class="el-icon-copy-document" @click.self.stop></i>
              </el-popover>

              <i
                style="margin-right: 10px"
                class="el-icon-download"
                v-if="details.statements.length > 1 && index !== details.statements.length - 1"
                @click.self.stop="moveToBottom(index)"
              ></i>
              <i
                style="margin-right: 10px"
                class="el-icon-download move-top"
                v-if="details.statements.length > 1 && index !== 0"
                @click.self.stop="moveToTop(index)"
              ></i>

              <i style="margin-right: 10px" class="el-icon-top" v-if="index !== 0" @click.self.stop="moveUp(index)"></i>
              <i
                style="margin-right: 10px"
                class="el-icon-bottom"
                v-if="index !== details.statements.length - 1"
                @click.self.stop="moveDown(index)"
              ></i>

              <i
                style="margin-right: 10px"
                class="el-icon-arrow-right icon-arrow"
                :class="{ 'icon-arrow-down': expandedArr[index], 'icon-arrow-right': !expandedArr[index] }"
              ></i>

              <i class="el-icon-delete" @click.self.stop="deleteRule(details.statements, index)"></i>
            </span>
          </p>
          <!-- <transition
            v-on:before-enter="beforeEnter"
            v-on:after-enter="afterEnter"
            v-on:before-leave="beforeLeave"
            v-on:after-leave="afterLeave"
          > -->
          <div class="rule-content" v-show="expandedArr[index]">
            <div v-for="(it, ind) in item.conditionGroups.conditions" :key="ind">
              <p class="condition-title" v-if="ind == 0">条件</p>
              <p class="condition-title" v-else-if="item.conditionGroups.conditions.length - 1 == ind">
                <el-select size="small" v-model="item.conditionGroups.operator">
                  <el-option
                    v-for="ele in optionData.boolSelects"
                    :key="ele.value"
                    :label="ele.label"
                    :value="ele.value"
                  >
                  </el-option>
                </el-select>
              </p>
              <!-- 条件组 -->
              <div class="cond-group">
                <div class="cond-item">
                  <el-row :gutter="12" class="row-condition-item">
                    <el-col :span="3"><i></i></el-col>
                    <el-col :span="3"> <span style="color: red">*</span>左值</el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3"> <span style="color: red">*</span>计算符</el-col>
                    <el-col :span="3"> <span style="color: red">*</span>右值</el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3"> <i></i></el-col>
                    <el-col :span="3">
                      <span class="cond-item-button">
                        <a @click="removeConditions(item.conditionGroups.conditions, ind)"
                          ><i class="el-icon-delete" style="color: red; margin-left: 8px"></i></a
                      ></span>
                    </el-col>
                  </el-row>
                </div>
                <div class="cond-item" v-for="(its, ind) in it.expressions" :key="ind">
                  <el-row :gutter="12">
                    <el-col :span="3">
                      <el-select
                        clearable
                        filterable
                        size="mini"
                        v-model="it.operator"
                        v-if="it.expressions.length - 1 == ind && it.expressions.length > 1"
                      >
                        <el-option
                          v-for="item in optionData.boolSelects"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <i v-else></i>
                    </el-col>
                    <!-- ============================ -->
                    <el-col :span="3">
                      <el-select
                        clearable
                        size="mini"
                        filterable
                        v-model="its.leftValue.generalRuleValueType"
                        placeholder="左值"
                        @change="leftValueChange($event, its.leftValue)"
                      >
                        <el-option
                          v-for="ele in optionData.leftSelects"
                          :key="ele.code"
                          :label="ele.label"
                          :value="ele.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="3">
                      <el-select
                        clearable
                        filterable
                        size="mini"
                        class="cjwwwwww"
                        v-model="its.leftValue.code"
                        @change="leftValueCodeChange($event, its.leftValue)"
                        placeholder="请选择"
                        @visible-change="toggleOptionsVisibility($event, its.leftValue, `virtualList1${index}${ind}`)"
                        :filter-method="(val) => dataFilter(val, its.leftValue, `virtualList1${index}${ind}`)"
                      >
                        <virtual-list
                          :ref="`virtualList1${index}${ind}`"
                          :key="its.leftValue.mappingName"
                          :data-key="'code'"
                          :data-sources="its.leftValue.leftTwoOption || []"
                          :keeps="30"
                          :estimate-size="40"
                          class="virtual-list"
                        >
                          <template #item="{ item }">
                            <el-tooltip
                              :key="item.value"
                              :content="item.name"
                              placement="right"
                              :open-delay="300"
                              :hide-after="0"
                              trigger="hover"
                              transition="none"
                            >
                              <el-option :key="item.code" :label="item.name" :value="item.code"> </el-option>
                            </el-tooltip>
                          </template>
                        </virtual-list>
                      </el-select>
                    </el-col>
                    <el-col :span="3">
                      <el-select clearable size="mini" filterable v-model="its.operator" placeholder="计算符">
                        <el-option
                          v-for="ele in its.leftValue.operatorList"
                          :key="ele.value"
                          :label="ele.label"
                          :value="ele.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="3">
                      <el-cascader
                        :props="{ emitPath: false }"
                        size="mini"
                        placeholder="右值"
                        v-model="its.rightValue.generalRuleValueType"
                        :options="optionData.rightSelects"
                        :show-all-levels="false"
                        @change="rightValueChange($event, its.rightValue)"
                        clearable
                        filterable
                      ></el-cascader>
                    </el-col>
                    <el-col :span="3">
                      <el-select
                        v-if="showSelect(its.rightValue.generalRuleValueType)"
                        clearable
                        filterable
                        size="mini"
                        placeholder="请输入值"
                        v-model="its.rightValue.code"
                        @change="rightOptionChange($event, its.rightValue)"
                        @visible-change="toggleOptionsVisibility($event, its.rightValue, `virtualList2${index}${ind}`)"
                        :filter-method="(val) => dataFilter(val, its.rightValue, `virtualList2${index}${ind}`)"
                      >
                        <virtual-list
                          :ref="`virtualList2${index}${ind}`"
                          :key="its.rightValue.mappingName"
                          :data-key="'code'"
                          :data-sources="its.rightValue.leftTwoOption || []"
                          :keeps="30"
                          :estimate-size="40"
                          class="virtual-list"
                        >
                          <template #item="{ item }">
                            <el-tooltip
                              :key="item.value"
                              :content="item.name"
                              placement="right"
                              :open-delay="300"
                              :hide-after="0"
                              trigger="hover"
                              transition="none"
                            >
                              <el-option :key="item.value" :label="item.name" :value="item.code"> </el-option>
                            </el-tooltip>
                          </template>
                        </virtual-list>
                      </el-select>

                      <el-input
                        v-else-if="needToDisplayInput(its.rightValue.generalRuleValueType)"
                        size="mini"
                        placeholder="请输入值"
                        v-model="its.rightValue.value"
                        clearable
                      >
                      </el-input>
                      <el-date-picker
                        v-else-if="its.rightValue.generalRuleValueType === 'DATE'"
                        size="mini"
                        v-model="its.rightValue.value"
                        type="datetime"
                        placeholder="选择日期时间"
                        clearable
                        value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>

                      <el-input-number
                        v-else-if="its.rightValue.generalRuleValueType === 'NUMBER'"
                        style="width: 100%"
                        :controls="false"
                        v-model="its.rightValue.value"
                        size="mini"
                        placeholder="请输入数字"
                        clearable
                      />
                      <el-select
                        v-else-if="its.rightValue.generalRuleValueType == 'BOOL'"
                        v-model="its.rightValue.value"
                        size="mini"
                        placeholder="请选择"
                        clearable
                      >
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                      </el-select>
                      <i v-else-if="its.rightValue.generalRuleValueType == 'NULL'"></i>
                      <el-input v-else size="mini" placeholder="请输入" v-model="its.rightValue.value" clearable>
                      </el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-tooltip
                        v-if="its.rightValue.code"
                        class="item"
                        effect="dark"
                        :content="its.rightValue.optionString || '无内容'"
                        placement="top"
                        :key="`${index}-${ind}`"
                      >
                        <el-select
                          v-if="its.rightValue.generalRuleValueType == 'OPTION'"
                          clearable
                          filterable
                          size="mini"
                          class="select_tag_dis"
                          style="width: 220px !important"
                          v-model="its.rightValue.value"
                          placeholder="请选择"
                          multiple
                          @change="handleOptionChange($event, its.rightValue)"
                          @visible-change="
                            toggleFetchOptionsVisibility($event, its.rightValue, `virtualList4${index}${ind}`)
                          "
                          :filter-method="(val) => dataFetchFilter(val, its.rightValue, `virtualList4${index}${ind}`)"
                        >
                          <div class="checkboxWrapper" v-if="its.rightValue.actualOptionsList.length">
                            <el-checkbox v-model="its.rightValue.checked" @change="checkChange($event, its.rightValue)">
                              全选
                            </el-checkbox>
                          </div>
                          <virtual-list
                            :ref="`virtualList4${index}${ind}`"
                            key="actualOptionsList"
                            :data-key="'value'"
                            :data-sources="its.rightValue.actualOptionsList || []"
                            :keeps="30"
                            :estimate-size="40"
                            class="virtual-list"
                          >
                            <template #item="{ item }">
                              <!-- v-for="ele in its.rightValue.optionsList" -->
                              <el-tooltip
                                :key="item.value"
                                :content="item.label"
                                placement="right"
                                :open-delay="300"
                                :hide-after="0"
                                trigger="hover"
                                transition="none"
                              >
                                <el-option :key="item.value" :label="item.label" :value="item.value"> </el-option>
                              </el-tooltip> </template
                          ></virtual-list>
                        </el-select>
                      </el-tooltip>
                      <i></i>
                    </el-col>
                    <el-col :span="3">
                      <span class="cond-item-button"
                        ><a @click="addConditionItem(it.expressions)"><i class="el-icon-circle-plus-outline"></i></a>
                        <a @click="removeConditionItem(it.expressions, ind)"
                          ><i class="el-icon-delete" style="color: red; margin-left: 8px"></i></a
                      ></span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div
                v-if="item.conditionGroups.conditions.length - 1 == ind"
                class="add-condition-button"
                @click="addCondition(item.conditionGroups.conditions)"
              >
                + 添加条件
              </div>
            </div>

            <!-- 执行结果 -->
            <p class="condition-title">执行结果</p>
            <div class="result">
              <div class="result-item cond-item" v-for="(k, kInd) in item.statementResult.results" :key="kInd">
                <el-row :gutter="12">
                  <el-col :span="3">
                    <el-cascader
                      :props="{ emitPath: false }"
                      size="mini"
                      v-model="k.type"
                      :options="optionData.resultSelects"
                      :show-all-levels="false"
                      clearable
                      filterable
                      @change="resultsLeftChange($event, k)"
                    ></el-cascader>
                  </el-col>
                  <el-col :span="18">
                    <el-row :gutter="12" v-if="resultValueShow(k.type)">
                      <el-col :span="8">
                        <el-select
                          clearable
                          filterable
                          size="mini"
                          v-model="k.code"
                          style="width: 100%"
                          placeholder="请选择"
                          @change="resultOptionChange($event, k)"
                          @visible-change="toggleOptionsVisibility($event, k, `virtualList3${index}${kInd}`)"
                          :filter-method="(val) => dataFilter(val, k, `virtualList3${index}${kInd}`)"
                        >
                          <virtual-list
                            :ref="`virtualList3${index}${kInd}`"
                            :key="k.mappingName"
                            :data-key="'code'"
                            :data-sources="k.leftTwoOption || []"
                            :keeps="30"
                            :estimate-size="40"
                            class="virtual-list"
                          >
                            <template #item="{ item }">
                              <el-tooltip
                                :key="item.value"
                                :content="item.name"
                                placement="right"
                                :open-delay="300"
                                :hide-after="0"
                                trigger="hover"
                                transition="none"
                              >
                                <el-option :key="item.value" :value="item.code" :label="item.name"> </el-option
                              ></el-tooltip> </template
                          ></virtual-list> </el-select
                      ></el-col>
                      <el-col :span="8">
                        <el-tooltip class="item" effect="dark" :content="k.optionString || '无内容'" placement="top">
                          <el-select
                            v-if="k.type == 'OPTION'"
                            placeholder="选项"
                            clearable
                            filterable
                            size="mini"
                            style="width: 100%"
                            v-model="k.value"
                            multiple
                            @change="resultOptionValueChange($event, k)"
                            @visible-change="toggleFetchOptionsVisibility($event, k, `virtualList5${index}${kInd}`)"
                            :filter-method="(val) => dataFetchFilter(val, k, `virtualList5${index}${kInd}`)"
                          >
                            <virtual-list
                              :ref="`virtualList5${index}${kInd}`"
                              key="resultActualOptionsList"
                              :data-key="'value'"
                              :data-sources="k.actualOptionsList || []"
                              :keeps="30"
                              :estimate-size="40"
                              class="virtual-list"
                            >
                              <!-- v-for="item in k.optionsList" -->

                              <template #item="{ item }">
                                <el-option :key="item.value" :label="item.label" :value="item.value">
                                </el-option> </template
                            ></virtual-list>
                          </el-select>
                        </el-tooltip>
                      </el-col>
                    </el-row>

                    <el-row :gutter="12" v-else-if="!resultValueShow(k.type)">
                      <!-- 单个的时候默认不显示 自动回填  超过一个就显示 不回填且必填 -->
                      <el-col :span="8" v-if="item.statementResult.results.length > 1">
                        <el-input size="small" v-model="k.code" placeholder="请输入code" clearable> </el-input>
                      </el-col>
                      <!-- 布尔类型：下拉框 -->
                      <el-col :span="8" v-if="k.type === 'BOOL'">
                        <el-select v-model="k.value" size="mini" clearable placeholder="请选择">
                          <el-option label="是" :value="true" />
                          <el-option label="否" :value="false" />
                        </el-select>
                      </el-col>

                      <!-- 日期类型：日期选择器 -->
                      <el-col :span="8" v-else-if="k.type === 'DATE'">
                        <el-date-picker
                          size="mini"
                          v-model="k.value"
                          type="datetime"
                          clearable
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-col>

                      <!-- 数字类型：数字输入框 -->
                      <el-col :span="8" v-else-if="k.type === 'NUMBER'">
                        <el-input-number
                          style="width: 100%"
                          :controls="false"
                          v-model="k.value"
                          size="mini"
                          clearable
                          placeholder="请输入数字"
                        />
                      </el-col>
                      <template v-else>
                        <el-col :span="8">
                          <el-input size="mini" v-model="k.value" placeholder="请输入值" clearable> </el-input>
                        </el-col>
                      </template>

                      <!-- 布尔值 下拉框，日期是日期组件 -->
                    </el-row>
                  </el-col>

                  <el-col :span="3">
                    <span class="cond-item-button"
                      ><a @click="handleAddResult(item.statementResult.results)"
                        ><i class="el-icon-circle-plus-outline"></i
                      ></a>
                      <a @click="handleDeleteResult(item.statementResult.results, kInd)"
                        ><i class="el-icon-delete" style="color: red; margin-left: 8px"></i></a
                    ></span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <!-- </transition> -->
        </div>

        <div class="add-configuration" @click="addConfiguration">
          <i class="el-icon-plus"></i>
          添加条件配置
        </div>
        <div class="add-button-group">
          <el-button
            type="primary"
            v-if="permissions.baseSetup_rule_rule_publish"
            @click="handlePublish({ isPrd: true })"
            >发 布</el-button
          >
          <el-button
            type="primary"
            v-if="permissions.baseSetup_rule_rule_saveDraft"
            plain
            @click="handlePublish({ isPrd: false })"
            >保存草稿</el-button
          >
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getSceneClassificationPage, getClassDisplayJson } from "@/api/ruleEngineConfig/classification.js"
import {
  addRule,
  updateRule,
  getRulePage,
  getRuleEditorInfo,
  getRuleDetail,
  getOptionSet
} from "@/api/ruleEngineConfig/rulesList.js"
import { getDictByType } from "@/util/auth"

import { getVariablesPage } from "@/api/ruleEngineConfig/variables.js"
import { getFunctionPage } from "@/api/ruleEngineConfig/functionList.js"
import request from "@/router/axios"
import { cloneDeep } from "lodash"
import { mapGetters } from "vuex"
import VirtualList, { VirtualListItem } from "vue-virtual-scroll-list"

export default {
  name: "rulesDetails",
  data() {
    return {
      form: {
        name: "",
        code: "",
        sceneId: "",
        classIdArr: [],
        classId: "",
        remark: "",
        details: ""
      },
      formRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              // 检查是否包含空格
              if (/\s/.test(value)) {
                callback(new Error("名称中不能包含空格"))
              } else if (/[()]/.test(value)) {
                callback(new Error("名称中不能包含英文括号(),请使用中文括号"))
              } else {
                callback() // 校验通过
              }
            },
            trigger: "change" // 校验在 input 内容变化时触发
          }
        ],
        // code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        classId: [{ required: true, message: "请选择场景", trigger: "blur" }]
      },
      details: {
        statements: [
          {
            conditionGroups: {
              conditions: [
                {
                  expressions: [
                    {
                      leftValue: {
                        generalRuleValueType: "",
                        code: "",
                        value: null,
                        operatorList: [],
                        mappingName: "",
                        leftTwoOption: []
                      },
                      operator: "",
                      rightValue: {
                        generalRuleValueType: "",
                        code: "",
                        value: "",
                        mappingName: "",
                        optionsList: [],
                        actualOptionsList: [], // 实际用来显示选项
                        checked: false,
                        leftTwoOption: []
                      }
                    }
                  ],
                  operator: ""
                }
              ],
              operator: ""
            },
            statementResult: {
              results: [
                {
                  type: "",
                  // leftValue: null,
                  // rightValueList: null,
                  // expression: "",
                  // defaultValue: null,
                  code: "",
                  value: "",
                  optionsList: [],
                  actualOptionsList: [], // 实际用来显示选项
                  name: "",
                  leftTwoOption: []
                }
              ]
            },
            copyCount: 1,
            copyVisible: false
          }
        ]
      },
      copyCondition: null,
      copyExpression: null,
      copyStatements: null,
      copyResults: null,
      activeNames: ["1"],
      expandedArr: [true],
      editTitleStatus: false,
      // 分类列表
      sceneClassificationList: [],
      rulesList: [],
      variablesList: [],
      functionList: [],
      boolOperatorType: [], // 条件
      numberOperatorType: [],
      operatorTypeList: [], // 操作符列表
      sceneId: 1, // 场景值
      optionData: {},

      id: "",
      // 详情数据
      detailsData: {},
      rulesDetailsHeight: 0,
      copy: false,
      checked: false,
      allOptionMap: {}
    }
  },
  components: { "virtual-list": VirtualList, VirtualListItem },
  watch: {},

  async created() {
    const { sceneId, id, copy } = this.$route.query
    this.sceneId = sceneId
    this.id = id
    this.copy = copy ? true : false
    this.getClassificationPage(this.sceneId)

    // 布尔操作类型-
    this.boolOperatorType = await getDictByType("bool_operator_type")
    this.rulesDetailsHeight = this.$refs.rulesDetails.getBoundingClientRect().height
    await this.getFactorList()
    if (this.id) {
      await this.getOptionSet()
      this.getDetail()
    }

    this.copyExpression = JSON.parse(
      JSON.stringify(this.details.statements[0].conditionGroups.conditions[0].expressions[0])
    )
    this.copyResults = JSON.parse(JSON.stringify(this.details.statements[0].statementResult.results[0]))
    this.copyCondition = JSON.parse(JSON.stringify(this.details.statements[0].conditionGroups.conditions[0]))
    this.copyStatements = JSON.parse(JSON.stringify(this.details.statements[0]))
  },
  async mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    dataFilter(val, row, refName) {
      row.searchQuery = val
      if (val) {
        //val存在
        row.leftTwoOption = this.optionData[row.mappingName].filter((item) => {
          if (!!~item.name.indexOf(val) || !!~item.name.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else {
        // if (row.code) {
        //   row.leftTwoOption = this.optionData[row.mappingName].filter((it) => it.code === row.code)
        // } else {
        //   row.leftTwoOption = this.optionData[row.mappingName]
        // }
        row.leftTwoOption = this.optionData[row.mappingName]
      }
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName][0].reset()
      })
    },

    toggleOptionsVisibility(isVisible, item, refName) {
      item.isOptionsVisible = isVisible // 控制选项的加载
      if (!this.optionData[item.mappingName]) return
      const resArr = JSON.parse(JSON.stringify(this.optionData[item.mappingName]))
      if (isVisible) {
        item.leftTwoOption = resArr
      } else {
        JSON.parse(JSON.stringify(item)).code
          ? (item.leftTwoOption = resArr.filter((it) => it.code === item.code))
          : (item.leftTwoOption = [])
      }
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName][0].scrollToIndex(1)
      })
      // =====
      document.querySelectorAll(".el-scrollbar__bar.is-vertical > div").forEach((div) => {
        div.style.display = "none"
        div.style.important = true
      })
      // 处理下拉选项的宽度
      if (isVisible) {
        document.querySelectorAll(".el-select-dropdown__list").forEach((element) => {
          element.style.maxWidth = "100%"
        })
      } else {
        document.querySelectorAll(".el-select-dropdown__list").forEach((element) => {
          element.style.maxWidth = ""
        })
      }
    },
    /**
     *  右值选项 过滤及虚拟滚动 关键词=====
     */
    dataFetchFilter(val, row, refName) {
      row.searchFetchQuery = val
      if (val) {
        //val存在
        row.actualOptionsList = row.optionsList.filter((item) => {
          if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else {
        // if (row.code) {
        //   row.actualOptionsList = row.optionsList.filter((it) => row.value.includes(it.value))
        // } else {
        //   row.actualOptionsList = JSON.parse(JSON.stringify(row.optionsList))
        // }
        row.actualOptionsList = JSON.parse(JSON.stringify(row.optionsList))
      }
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName][0].reset()
      })
    },
    /**
     *  右值选项 过滤及虚拟滚动 list=====
     */
    toggleFetchOptionsVisibility(isVisible, item, refName) {
      item.isFetchOptionsVisible = isVisible // 控制选项的加载

      const resArr = JSON.parse(JSON.stringify(this.optionData[item.mappingName]))
      if (isVisible) {
        item.actualOptionsList = JSON.parse(JSON.stringify(item.optionsList))
      } else {
        item.value && item.value.length
          ? (item.actualOptionsList = item.optionsList.filter((it) => item.value.includes(it.value)))
          : (item.actualOptionsList = [])
      }
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName][0].scrollToIndex(1)
      })
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
        // this.detailsData.className = this.findPathByValue(this.sceneClassificationList, this.detailsData.classId)
        const dealDetailsData = cloneDeep(data.data.details)

        const { classId, id, name, remark, code, details, isPrd, prdVersion, testVersion } = data.data
        this.form = {
          ...this.form,
          isPrd,
          prdVersion,
          testVersion,
          classId,
          id,
          name,
          remark,
          code,
          classIdArr: this.findPathByValue(this.sceneClassificationList, classId)
        }

        // this.details.statements = details.statements
        const resTemplate = this.filterAndFillData(this.details, details)
        this.updateExpressions(resTemplate, this.optionData)
        // this.details = resTemplate
        dealDetailsData.statements.forEach((item, index) => {
          item.conditionGroups.conditions.forEach((item1, index1) => {
            item1.expressions.forEach((item2, index2) => {
              const { rightValue } =
                this.details.statements[index].conditionGroups.conditions[index1].expressions[index2]
              if (rightValue.generalRuleValueType !== "OPTION") {
                if (rightValue.generalRuleValueType == "BOOL") {
                  this.$nextTick(() => {
                    rightValue.value = item2.rightValue.value == "true"
                  })
                  return
                }
                this.$nextTick(() => {
                  rightValue.value = item2.rightValue.value
                })
              } else {
                this.$nextTick(() => {
                  rightValue.value = item2.rightValue.value.split(",")
                  rightValue.actualOptionsList = rightValue.optionsList?.filter((it) =>
                    rightValue.value.includes(it.value)
                  )

                  rightValue.optionString = rightValue.actualOptionsList.map((it) => it.label).join(",")
                })
              }
            })
          })
          item.statementResult.results.forEach((item1, index1) => {
            const result = this.details.statements[index].statementResult.results[index1]

            if (result.type !== "OPTION") {
              if (result.type == "BOOL") {
                this.$nextTick(() => {
                  result.value = result.value == "true"
                })
                return
              }
              this.$nextTick(() => {
                result.value = result.value
              })
            } else {
              this.$nextTick(() => {
                if (typeof result.value == "string") {
                  result.value = result.value.split(",")
                }
                result.actualOptionsList = result.optionsList?.filter((it) => result.value.includes(it.value))
                result.optionString = result.actualOptionsList.map((it) => it.label).join(",")
              })
            }
          })
        })
        this.expandedArr = new Array(this.detailsData.details?.statements?.length).fill(true)
        if (this.copy) {
          this.form = {
            ...this.form,
            id: "",
            isPrd: null,
            prdVersion: "",
            testVersion: ""
          }
        }
      }
    },
    /**
     * @description: 处理原始数据 还原编辑界面
     */
    async updateExpressions(data, optionData) {
      const copyData = JSON.parse(JSON.stringify(data))
      // return
      // 遍历 statements -> conditionGroups -> conditions -> expressions
      for (const statement of copyData.statements) {
        const conditionGroups = statement.conditionGroups
        if (conditionGroups && conditionGroups.conditions) {
          for (const condition of conditionGroups.conditions) {
            if (condition.expressions) {
              for (const expression of condition.expressions) {
                // 处理 leftValue
                const leftValue = expression.leftValue
                const leftVal = leftValue.generalRuleValueType
                const leftItem = optionData.leftSelects.find((item) => item.value === leftVal)
                if (leftItem) {
                  leftValue.mappingName = leftItem.mappingName
                  const matchedLeftItem = optionData[leftValue.mappingName].find((item) => item.code === leftValue.code)
                  leftValue.leftTwoOption = [matchedLeftItem]
                  leftValue.operatorList = optionData.operatorSelectMap[matchedLeftItem?.operatorType] || []
                }

                // 处理 rightValue
                const rightValue = expression.rightValue
                const rightValueClone = cloneDeep(expression.rightValue)
                // 右值 value
                const value = cloneDeep(rightValue.value)

                const rightVal = rightValue.generalRuleValueType
                const rightItem = optionData.rightSelects.find((item) => item.value === rightVal)

                if (rightItem) {
                  rightValue.mappingName = rightItem.mappingName
                  const matchedRightItem = optionData[rightValue.mappingName].find(
                    (item) => item.code === rightValue.code
                  )

                  rightValue.leftTwoOption = [matchedRightItem]
                  rightValue.operatorList = optionData.operatorSelectMap[matchedRightItem?.operatorType] || []
                  rightValue.optionsList = this.allOptionMap[matchedRightItem.code] || []
                  if (rightValue.generalRuleValueType == "OPTION") {
                    // && typeof value === "string"
                    // rightValue.value = value.split(",")
                    rightValue.checked = rightValue.value.length === rightValue.optionsList.length
                    rightValue.actualOptionsList = rightValue.optionsList?.filter((it) =>
                      rightValue.value.includes(it.value)
                    )
                  }
                } else {
                }

                if (rightValue.generalRuleValueType === "BOOL") {
                  rightValue.value = rightValue.value === "true" ? true : false
                }
              }
            }
          }
        }
        if (statement.statementResult && statement.statementResult.results) {
          for (const result of statement.statementResult.results) {
            const typeVal = result.type
            const typeItem = optionData.resultSelects.find((item) => item.value === typeVal)
            if (typeItem) {
              result.mappingName = typeItem.mappingName
              result.optionsList = optionData[result.mappingName] || []

              const matchedRightItem = optionData[result.mappingName].find((item) => item.code === result.code)
              result.leftTwoOption = [matchedRightItem]
            }
            if (result.type === "BOOL") {
              result.value = result.value === "true" ? true : false
            }
            if (result.type === "OPTION") {
              result.optionsList = this.allOptionMap[result.code] || []
              if (result.type == "OPTION" && typeof result.value === "string") {
                result.value = result.value.split(",")
                result.checked = result.value.length === result.optionsList.length
              }
            }
          }
        }
      }

      this.$set(this, "details", copyData)
    },
    filterAndFillData(template, data) {
      if (Array.isArray(template)) {
        // 如果模板是数组
        return Array.isArray(data) ? data.map((item, index) => this.filterAndFillData(template[0], item)) : []
      } else if (typeof template === "object" && template !== null) {
        // 如果模板是对象
        const result = {}
        for (const key in template) {
          if (data && data.hasOwnProperty(key)) {
            // 如果 data 中存在该键，递归克隆并回填数据
            result[key] = this.filterAndFillData(template[key], data[key])
          } else {
            // 保留模板中的默认值
            result[key] = template[key]
          }
        }

        // 检查并处理 operator 字段的情况
        if (result.hasOwnProperty("operator")) {
          if (Array.isArray(result.operator) && result.operator.length === 2) {
            result.operator = result.operator[1]
          }
        }

        return result
      } else {
        // 否则，直接返回模板的值
        return data !== undefined ? data : template
      }
    },
    // 递归查找路径函数
    findPathByValue(options, targetValue) {
      for (const item of options) {
        // 如果当前节点的值匹配目标值，直接返回包含该节点值的数组
        if (item.id === targetValue) return [item.id]

        // 继续递归查找子节点，但仅限于 children 不为空数组的情况
        if (item.children && item.children.length > 0) {
          const path = this.findPathByValue(item.children, targetValue)
          // 如果路径找到，返回包含当前节点值的完整路径
          if (path.length) return [item.id, ...path]
        }
      }
      // 未找到目标值时返回空数组
      return []
    },
    async resultOptionChange(val, row) {
      const fItem = this.optionData[row.mappingName].find((item) => item.code === val)
      row.name = fItem ? fItem.name : ""
      if (!fItem || !fItem.url) return
      await request({
        url: fItem.url,
        method: "post",
        data: {
          ...fItem,
          sceneId: this.sceneId,
          classId: this.form.classId
        }
      }).then((res) => {
        if (res.data.code == 0) {
          row.optionsList = res.data.data || []
          // this.$
        }
      })
    },

    resultOptionValueChange(val, result) {
      result.optionString = result.optionsList
        .filter(({ value }) => val.includes(value))
        .map(({ label }) => label)
        .join(",")
      console.log("val,result", val, result)
    },
    copyFullRule(index, item) {
      const copyItem = this.details.statements[index]
      const copyCount = Math.max(1, Math.floor(item.copyCount))
      const copiedItems = Array.from({ length: copyCount }, () =>
        JSON.parse(JSON.stringify({ ...copyItem, copyVisible: false, copyCount: 1 }))
      )
      const initCopiedItems = cloneDeep(copiedItems)
      this.details.statements.splice(index + 1, 0, ...copiedItems)
      this.$message.success(`成功复制 ${copyCount} 份`)
      this.$set(item, "copyVisible", false)
      this.$set(item, "copyCount", 1)

      // 记录新插入项的索引范围
      const startIdx = index + 1

      this.$nextTick(() => {
        // 遍历新插入的每一项
        initCopiedItems.forEach((copiedItem, copiedIndex) => {
          const conditions = copiedItem?.conditionGroups?.conditions || []
          conditions.forEach((condition, condIndex) => {
            const expressions = condition?.expressions || []
            // 遍历每个 expression 并更新其 rightValue.value
            expressions.forEach((expression, expIndex) => {
              const rightValue = expression?.rightValue
              if (rightValue) {
                // 将值更新为 copiedItems 中对应的值
                const originalItem = this.details.statements[startIdx + copiedIndex]
                const originalExpression = originalItem?.conditionGroups?.conditions[condIndex]?.expressions[expIndex]
                if (originalExpression?.rightValue) {
                  originalExpression.rightValue.value = rightValue.value
                }
              }
            })
          })
        })
      })

      const originalLength = this.expandedArr.length
      const newLength = this.details.statements.length
      this.expandedArr = [...this.expandedArr, ...Array(newLength - originalLength).fill(true)]
    },
    deleteRule(targetItem, index) {
      if (targetItem.length == 1) {
        this.$message.warning("请至少保留一个规则")
        return
      }
      this.$delete(targetItem, index)
      this.$message.success(`条件组删除成功`)
    },
    classIdArrChange(val) {
      if (val.length > 0) {
        this.form.classId = val[val.length - 1]
      } else {
        this.form.classId = ""
      }
    },
    handleAddResult(targetItem) {
      // this.details.statements[index].statementResult.results.push(this.copyResults)
      this.$set(targetItem, targetItem.length, JSON.parse(JSON.stringify(this.copyResults)))
    },
    handleDeleteResult(targetItem, index) {
      // this.details.statements[index].statementResult.results.splice(index, 1)
      if (targetItem.length == 1) {
        this.$message({
          type: "warning",
          message: "只有一条数据，无法删除"
        })
        return
      }
      this.$delete(targetItem, index)
    },
    resultValueShow(value) {
      return ["VARIABLE", "FUNCTION", "RULE", "OPTION"].includes(value)
    },
    fixedValueShow(value) {
      return ["BOOL", "NUMBER", "STRING", "COLLECTION", "DATE", "DICT"].includes(value)
    },
    removeConditions(target, index) {
      if (target.length === 1) {
        this.$message.warning("至少需要一个条件组")
        return
      }
      target.splice(index, 1)
    },
    removeConditionItem(targetItem, index) {
      if (targetItem.length === 1) {
        this.$message.warning("至少需要一个条件")
        return
      }

      targetItem.splice(index, 1)
    },
    addConditionItem(targetItem) {
      // 添加新的条件
      this.$set(targetItem, targetItem.length, JSON.parse(JSON.stringify(this.copyExpression)))
    },
    showSelect(value) {
      return ["VARIABLE", "FUNCTION", "RULE", "OPTION"].includes(value)
    },
    needToDisplayInput(value) {
      // "VARIABLE", "FUNCTION", "RULE",
      return ["STRING", "COLLECTION"].includes(value)
    },
    rightValueChange(val, row) {
      if (!val) {
        row.mappingName = ""
        return
      }
      const fItem = this.optionData.rightSelects.find((item) => item.value === val)
      if (fItem) {
        row.mappingName = fItem.mappingName
      }
      row = this.clearEmptyValues(row, ["generalRuleValueType", "mappingName"])
      if (row.generalRuleValueType !== "OPTION") {
        row.value = ""
      }
    },
    resultsLeftChange(val, row) {
      if (!val) {
        row.mappingName = ""
        return
      }
      const fItem = this.optionData.resultSelects.find((item) => item.value === val)
      if (fItem) {
        row.mappingName = fItem.mappingName
      }
      row = this.clearEmptyValues(row, ["type", "mappingName"])
    },
    rightOptionChange(val, row) {
      row.value = ""
      row.checked = false

      const fItem = this.optionData[row.mappingName].find((item) => item.code === val)
      if (!fItem || !fItem.url) return
      request({
        url: fItem.url,
        method: "post",
        data: {
          ...fItem,
          sceneId: this.sceneId,
          classId: this.form.classId
        }
      }).then((res) => {
        if (res.data.code == 0) {
          row.optionsList = res.data.data || []
        }
      })
    },
    // 处理选项值变化
    handleOptionChange(val, rightValue) {
      const elSelectTags = document.querySelector(".el-select__tags")
      if (elSelectTags) {
        const span = elSelectTags.querySelector("span")
        const input = elSelectTags.querySelector("input")
        if (span && input) {
          // 添加自定义 CSS 类
          const style = document.createElement("style")
          style.innerHTML = `
            .el-select.select_tag_dis .el-select__tags>.hide-span-important {
              display: none !important;
            }
            .el-select.select_tag_dis .el-select__tags>.show-span-important {
              display: inline-block !important;
            }
          `
          document.head.appendChild(style)

          input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
              span.classList.add("hide-span-important")
              span.classList.remove("show-span-important")
            } else {
              span.classList.add("show-span-important")
              span.classList.remove("hide-span-important")
            }
          })

          input.addEventListener("blur", () => {
            span.classList.add("show-span-important")
            span.classList.remove("hide-span-important")
          })
        }
      }
      const resValues = rightValue.optionsList.map((item) => item.value)
      if (val.length == resValues.length) {
        rightValue.checked = true
      } else {
        rightValue.checked = false
      }
      rightValue.optionString = rightValue.optionsList
        .filter(({ value }) => val.includes(value))
        .map(({ label }) => label)
        .join(",")
    },
    checkChange(e, rightValue) {
      let resValues = rightValue.optionsList.map((item) => item.value)
      // 如果checkbox为false，则为反选，选择数组为空
      if (!e) {
        rightValue.value = []
      } else {
        // 如果checkbox为true，则为全选，选择数组添加所有数据
        let res = [...resValues]
        rightValue.value = res
        rightValue.optionString = rightValue.optionsList.map((item) => item.label).join(",")
      }
    },
    leftValueChange(val, row) {
      if (!val) {
        row.mappingName = ""
        return
      }
      const fItem = this.optionData.leftSelects?.find((item) => item.value === val)
      if (fItem) {
        row.mappingName = fItem.mappingName
      }

      row = this.clearEmptyValues(row, ["mappingName", "generalRuleValueType"])
    },

    leftValueCodeChange(val, item) {
      const fItem = this.optionData[item.mappingName]?.find((item2) => {
        return item2.code == val
      })
      if (!fItem) {
        item.operatorList = []
        return
      }
      item.operatorList = this.optionData.operatorSelectMap[fItem.operatorType]
      item.operatorType = fItem.operatorType
    },
    async getFactorList() {
      const { data } = await getRuleEditorInfo({
        page: 1,
        pageSize: 9999,
        sceneId: this.sceneId
      })
      if (data.code === 0) {
        this.optionData = JSON.parse(JSON.stringify(data.data))
      }
    },
    async getRulePage() {
      const { data } = await getRulePage({
        page: 1,
        pageSize: 9999,
        sceneId: this.sceneId
      })
      if (data.code == 0) {
        this.rulesList = data.data.records
      }
    },

    async getVariablesPage() {
      const { data } = await getVariablesPage({
        page: 1,
        pageSize: 9999,
        sceneId: this.sceneId
      })
      if (data.code == 0) {
        this.variablesList = data.data.records
      }
    },
    async getFunctionPage() {
      const { data } = await getFunctionPage({
        page: 1,
        pageSize: 9999,
        sceneId: this.sceneId
      })
      if (data.code == 0) {
        this.functionList = data.data.records
      }
    },
    filterOptions(originalArray, needFilter = []) {
      return originalArray.filter((item) => !needFilter.includes(item.value))
    },
    getClassificationPage(val) {
      getClassDisplayJson({
        classId: val,
        onlyNextLevel: false,
        sceneId: this.sceneId
      }).then((res) => {
        this.sceneClassificationList = this.removeEmptyChildrenNodes(res.data.data)
        const { defaultClassId } = this.$route.query
        if (defaultClassId) {
          this.form.classIdArr = this.findPathByValue(this.sceneClassificationList, defaultClassId)
          this.form.classId = defaultClassId
        }
      })
    },
    removeEmptyChildrenNodes(tree) {
      return tree
        .map((node) => {
          // 深拷贝节点，避免修改原数据
          const newNode = { ...node }

          // 如果有子节点，递归移除空子节点
          if (newNode.children && newNode.children.length > 0) {
            newNode.children = this.removeEmptyChildrenNodes(newNode.children)
          }

          // 如果子节点为空，删除 children 属性
          if (!newNode.children || newNode.children.length === 0) {
            delete newNode.children
          }

          return newNode
        })
        .filter((node) => node.children || node.children === undefined) // 过滤掉所有 children 为空的节点
    },
    buildTree(data) {
      const map = {}
      data.forEach((item) => {
        item.children = []
        map[item.id] = item
      })

      const tree = []

      data.forEach((item) => {
        if (item.parentId !== -1 && item.parentId !== null) {
          // 找到父节点并将当前项加入父节点的 children
          if (map[item.parentId]) {
            map[item.parentId].children.push(item)
          }
        } else {
          // 如果没有 parentId 或 parentId 为 -1，将其加入树的顶层
          tree.push(item)
        }
      })

      // 移除空的 children 数组
      function removeEmptyChildren(nodes) {
        nodes.forEach((node) => {
          if (node.children.length === 0) {
            delete node.children
          } else {
            removeEmptyChildren(node.children)
          }
        })
      }

      removeEmptyChildren(tree)
      return tree
    },
    handleChange(val) {
      console.log(val)
    },
    addCondition(target) {
      // target.push(this.copyCondition)
      // 确保 targetItem 是响应式的
      this.$set(target, target.length, JSON.parse(JSON.stringify(this.copyCondition)))
    },
    toggleAccordion(index) {
      let status = this.expandedArr[index]
      this.$set(this.expandedArr, index, !status)
    },
    // 进入时动态计算高度
    beforeEnter(el) {
      el.style.height = el.scrollHeight + "px"
    },
    afterEnter(el) {
      // 重置height，让元素可以自动调整高度
      el.style.height = ""
    },
    // 离开时收缩高度
    beforeLeave(el) {
      el.style.height = el.scrollHeight + "px"
      el.offsetHeight // 强制重绘
      // el.style.transition = "height 0.3s ease"
      el.style.height = "0"
    },

    afterLeave(el) {
      el.style.height = ""
    },
    addConfiguration() {
      this.$set(
        this.details.statements,
        this.details.statements.length,
        JSON.parse(JSON.stringify(this.copyStatements))
      )
      this.expandedArr.push(true)

      // this.details.statements.push(this.copyStatements)
    },

    editRuleName() {
      this.editTitleStatus = true
    },
    lowercaseFirstLetter(str) {
      if (!str) return str // 检查是否为空字符串
      return str.charAt(0).toLowerCase() + str.slice(1)
    },
    async handlePublish(opt) {
      const postData = cloneDeep({
        ...this.form,
        details: this.details,
        sceneId: this.sceneId,
        ...opt
      })

      delete postData.classIdArr

      const { details } = postData
      // const details0316 = cloneDeep(details)

      // this.details.statements[0].conditionGroups.conditions[0].expressions

      details.statements.forEach((item, index1) => {
        item.conditionGroups.conditions.forEach(async (item1) => {
          item1.expressions.forEach((item2) => {
            const value = item2.rightValue.value
            if (Array.isArray(value)) {
              item2.rightValue.value = value.length > 0 ? value.join(",") : ""
            }
          })
        })

        if (!item.conditionGroups.operator) delete item.conditionGroups.operator
        const fEle = this.optionData.boolSelects.find((ele) => {
          return ele.value == item.conditionGroups.operator
        })
        if (fEle) {
          item.conditionGroups.operator = [this.lowercaseFirstLetter(fEle.type), item.conditionGroups.operator]
        }
        item.conditionGroups.conditions.forEach((item2, index2) => {
          if (!item2.operator) {
            delete item2.operator
          }
          const fEle1 = this.optionData.boolSelects.find((ele) => {
            return ele.value == item2.operator
          })
          if (fEle1) {
            item2.operator = [this.lowercaseFirstLetter(fEle1.type), item2.operator]
          }

          item2.expressions?.forEach((item3, index3) => {
            if (!item3.operator) {
              delete item3.operator
            }
            const fItem3 = this.optionData[item3.leftValue.mappingName]?.find((ele) => {
              return ele.code === item3.leftValue.code
            })

            if (fItem3) {
              const item3Operator = JSON.parse(JSON.stringify(item3.operator))
              item3.operator = [this.lowercaseFirstLetter(fItem3.operatorType), item3Operator]
            }
          })
        })

        item.statementResult.results.forEach((item4, index4) => {
          if (
            item.statementResult.results.length === 1 &&
            ["BOOL", "NUMBER", "STRING", "COLLECTION", "DATE"].includes(item4.type)
          ) {
            item4.code = item4.code ? item4.code : `结果${index4 + 1}`
          }
          const value = item4.value
          if (Array.isArray(value)) {
            item4.value = value.length > 0 ? value.join(",") : ""
          }
        })
      })

      await this.$refs.form.validate()

      let leftValueEmpty = false // 用于判断 leftValue 是否有空值
      let rightValueGeneralRuleValueTypeEmpty = false // 用于判断 rightValue类型是否空
      let rightValueCodeEmpty = false // 用于判断 rightValue.code 是否有空值
      let rightValueValueEmpty = false // 用于判断 rightValue.value 是否有空值
      let operatorEmpty = false // 用于判断 操作符 是否有空值

      details.statements.forEach((statement) => {
        if (statement.conditionGroups && statement.conditionGroups.conditions) {
          statement.conditionGroups.conditions.forEach((condition) => {
            if (condition.expressions) {
              condition.expressions.forEach((expression) => {
                // 判断 leftValue 是否为空
                if (!expression.leftValue || !expression.leftValue.code) {
                  leftValueEmpty = true
                }

                if (!expression.operator || !expression.operator[1]) {
                  operatorEmpty = true
                }
                if (!expression.rightValue || !expression.rightValue.generalRuleValueType) {
                  rightValueGeneralRuleValueTypeEmpty = true
                }

                // 判断 rightValue.code 是否为空
                if (!expression.rightValue || !expression.rightValue.code) {
                  if (["VARIABLE", "FUNCTION", "RULE", "OPTION"].includes(expression.rightValue.generalRuleValueType)) {
                    rightValueCodeEmpty = true
                  }
                }

                // 判断 rightValue.value 是否为空
                if (
                  expression.rightValue == null || // 检查 null 或 undefined
                  expression.rightValue.value === "" || // 检查空字符串
                  expression.rightValue.value === undefined // 检查未定义的值
                ) {
                  if (
                    ["BOOL", "NUMBER", "STRING", "COLLECTION", "DATE"].includes(
                      expression.rightValue?.generalRuleValueType
                    )
                  ) {
                    rightValueValueEmpty = true
                  }
                }
              })
            }
          })
        }
      })

      if (leftValueEmpty) {
        this.$message.warning("条件左值不能为空！")
        return
      }
      if (operatorEmpty) {
        this.$message.warning("操作符不能为空！")
        return
      }
      if (rightValueGeneralRuleValueTypeEmpty) {
        this.$message.warning("条件右值类型不能为空！")
        return
      }
      if (rightValueCodeEmpty) {
        this.$message.warning("条件右值code编码不能为空！")
        return
      }

      if (rightValueValueEmpty) {
        this.$message.warning("条件右值的值字段不能为空！")
        return
      }
      let resultType = details.statements.some((item) =>
        item.statementResult.results.some((nextItem) => nextItem.type === "")
      )
      let resultCode = details.statements.some((item) =>
        item.statementResult.results.some((nextItem) => nextItem.code === "")
      )
      if (resultType) {
        this.$message.warning("执行结果中的结果类型不能为空！")
        return
      }
      if (resultCode) {
        this.$message.warning("执行结果中的编码code不能为空！")
        return
      }
      // return

      if (this.id && !this.copy) {
        const { data } = await updateRule(postData)

        if (data.code == 0) {
          this.$message.success("保存成功")
          this.$router.$avueRouter.closeTag()
          this.$router.push({
            path: "/baseSetup/ruleEngineConfig/rulesList/index"
          })
        }
      } else {
        if (this.copy) {
          delete postData.id
        }

        const { data } = await addRule({ ...postData, code: this.form.name })

        if (data.code == 0) {
          this.$message.success("新增成功")
          this.$router.$avueRouter.closeTag()
          this.$router.push({
            path: "/baseSetup/ruleEngineConfig/rulesList/index",
            query: { refresh: true }
          })
        }
      }
    },
    /**
     * 清空对象中为空的值
     * @param {Object} obj 要清空的对象
     * @param {Array} skipFields 要跳过的字段列表
     */
    clearEmptyValues(obj, skipFields = []) {
      for (const key in obj) {
        if (skipFields.includes(key)) continue // 跳过指定的字段
        if (typeof obj[key] === "string") {
          obj[key] = "" // 清空字符串
        } else if (Array.isArray(obj[key])) {
          obj[key] = [] // 清空数组
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          this.clearEmptyValues(obj[key], skipFields) // 递归清空子对象
        } else if (typeof obj[key] === "number") {
          obj[key] = "" // 清空数组
        }
      }
      return obj
    },
    moveDown(index) {
      // 判断是否可以移动
      if (index < 0 || index >= this.details.statements.length - 1) {
        console.log("无法移动")
        return
      }
      // 使用 $set 交换当前元素和下一个元素的位置
      const temp = this.details.statements[index]
      this.$set(this.details.statements, index, this.details.statements[index + 1])
      this.$set(this.details.statements, index + 1, temp)
      this.$message.success("下移成功")
    },
    moveUp(index) {
      // 判断是否可以移动
      if (index <= 0 || index >= this.details.statements.length) {
        console.log("无法移动")
        return
      }

      // 使用 $set 交换当前元素和上一个元素的位置
      const temp = this.details.statements[index]
      this.$set(this.details.statements, index, this.details.statements[index - 1])
      this.$set(this.details.statements, index - 1, temp)
      this.$message.success("上移成功")
    },
    moveToBottom(index) {
      // 判断是否可以移动
      if (index < 0 || index >= this.details.statements.length - 1) {
        console.log("无法移动")
        return
      }

      const item = this.details.statements[index]
      this.details.statements.splice(index, 1)
      this.$set(this.details.statements, this.details.statements.length, item)
      this.$message.success("置底成功")
    },
    moveToTop(index) {
      if (index <= 0 || index >= this.details.statements.length) {
        console.log("无法移动")
        return
      }

      const item = this.details.statements[index]
      this.details.statements.splice(index, 1)
      this.details.statements.splice(0, 0, item)
      this.$message.success("置顶成功")
    }
  }
}
</script>

<style lang="scss" scoped>
#editRulesDetails {
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
      font-size: 14px;
      padding: 8px 20px;
      font-weight: bold;
      // border-bottom: 1px solid #ebeef5;
      cursor: pointer; /* 鼠标悬停显示手形 */
      font-weight: bold;

      .rule-title-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
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
      padding: 4px 20px;
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
        margin-top: 10px;
        margin-bottom: 6px;
        &:hover {
          background-color: #edf7f7;
        }
      }
      .result {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        .result-item {
          border-bottom: 1px solid #ebeef5;
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    .rule-content-box {
      position: relative;
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
  .add-button-group {
    margin: 20px 0;
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
.checkboxWrapper {
  padding: 8px 20px;
  border-bottom: 1px solid #ccc;
}
.move-top {
  transform: rotate(180deg); /* 旋转180度 */
}
.row-condition-item {
  display: flex;
  align-items: center;
}

.show-span-important {
  display: inline-block !important;
}

.hide-span-important {
  display: none !important;
}

.virtual-list {
  max-width: 100%;
  max-height: 274px; /* 与 el-select 的下拉菜单高度一致 */
  overflow-y: auto;

  scrollbar-width: none; /* 对 Firefox 生效 */
  -ms-overflow-style: none; /* 对 IE 和 Edge 生效 */
}
.virtual-list::-webkit-scrollbar {
  display: none; /* 对 Chrome 和 Safari 生效 */
}
</style>
