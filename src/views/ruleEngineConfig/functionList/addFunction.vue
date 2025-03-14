<template>
  <el-dialog
    :title="title"
    :visible="localVisible"
    width="80%"
    :before-close="handleClose"
    top="5vh"
    @opened="opened"
    @close="close"
    :close-on-click-modal="false"
  >
    <div class="function-dialog-content">
      <el-form ref="addFunctionForm" :model="addForm" :rules="addFormRules" label-width="120px" label-position="right">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="addForm.name" clearable size="small" placeholder="支持输入中英文、数字"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="分类：" prop="classId">
              <!-- :disabled="isEdit" -->
              <el-cascader
                size="small"
                style="width: 100%"
                v-model="addForm.classIdArr"
                :options="sceneClassificationList"
                :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                @change="classIdArrChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="addForm.remark" size="small" placeholder="请输入备注 "></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="function-list">
        <div class="function-left">
          <el-tabs stretch v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all">
              <div class="function-left-content">
                <div class="left-content-search">
                  <el-row :gutter="8">
                    <el-col :span="16">
                      <el-input
                        v-model="allSearchForm.filterAll"
                        size="small"
                        clearable
                        placeholder="请输入名称"
                        @input="conditionFilterTextChange($event, 'all')"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-cascader
                        size="small"
                        style="width: 100%"
                        v-model="allSearchForm.classIdArr"
                        :options="sceneClassificationList"
                        :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                        clearable
                        @change="conditionClassIdChange($event, 'all')"
                      ></el-cascader>
                    </el-col>
                  </el-row>
                </div>
                <!-- 拖拽区域 -->
                <div class="function-left-condition-list">
                  <p
                    draggable="true"
                    @dragstart="(event) => onDragStartMceNonEditable(event, item.code, getFactorName(item))"
                    class="condition-list-item"
                    v-for="item in allSearchForm.options"
                    :key="item.id"
                    :data-code="item.code"
                    @click="handleAddFactor($event, item, getFactorName(item))"
                  >
                    {{ item.name }}
                    <el-tag type="" size="mini" effect="plain" v-if="item.displayName == '变量'">{{
                      item.displayName
                    }}</el-tag>
                    <el-tag type="success" size="mini" effect="plain" v-else-if="item.displayName == '函数'">{{
                      item.displayName
                    }}</el-tag>
                    <el-tag type="warning" size="mini" effect="plain" v-else>{{ item.displayName }}</el-tag>
                  </p>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="规则" name="first">
              <div class="function-left-content">
                <div class="left-content-search">
                  <el-row :gutter="8">
                    <el-col :span="16">
                      <el-input
                        v-model="rulesSearchForm.filterRules"
                        size="small"
                        clearable
                        placeholder="请输入名称"
                        @input="conditionFilterTextChange($event, 'rules')"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-cascader
                        size="small"
                        style="width: 100%"
                        v-model="rulesSearchForm.classIdArr"
                        :options="sceneClassificationList"
                        :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                        clearable
                        @change="conditionClassIdChange($event, 'rules')"
                      ></el-cascader>
                    </el-col>
                  </el-row>
                </div>
                <!-- 拖拽区域 -->
                <div class="function-left-condition-list">
                  <p
                    draggable="true"
                    @dragstart="(event) => onDragStartMceNonEditable(event, item.code, 'rules')"
                    class="condition-list-item"
                    v-for="item in rulesSearchForm.options"
                    :key="item.id"
                    :data-code="item.code"
                    @click="handleAddFactor($event, item, 'rules')"
                  >
                    {{ item.name }}
                  </p>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="函数" name="second">
              <div class="function-left-content">
                <div class="left-content-search">
                  <el-row :gutter="8">
                    <el-col :span="16">
                      <el-input
                        v-model="functionsSearchForm.filterVariables"
                        size="small"
                        placeholder="请输入名称"
                        clearable
                        @input="conditionFilterTextChange($event, 'functions')"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-cascader
                        size="small"
                        style="width: 100%"
                        v-model="functionsSearchForm.classIdArr"
                        :options="sceneClassificationList"
                        :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                        clearable
                        @change="conditionClassIdChange($event, 'functions')"
                      ></el-cascader>
                    </el-col>
                  </el-row>
                </div>
                <!-- 拖拽区域 -->
                <div class="function-left-condition-list" style="height: 360px">
                  <p
                    draggable="true"
                    @dragstart="(event) => onDragStartMceNonEditable(event, item.code, 'functions')"
                    class="condition-list-item"
                    v-for="item in functionsSearchForm.options"
                    :key="item.id"
                    :data-code="item.code"
                    @click="handleAddFactor($event, item, 'functions')"
                  >
                    {{ item.name }}
                  </p>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="变量" name="third">
              <div class="function-left-content">
                <div class="left-content-search">
                  <el-row :gutter="8">
                    <el-col :span="16">
                      <el-input
                        v-model="variablesSearchForm.filterVariables"
                        size="small"
                        placeholder="请输入名称"
                        clearable
                        @input="conditionFilterTextChange($event, 'variables')"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-cascader
                        size="small"
                        style="width: 100%"
                        v-model="variablesSearchForm.classIdArr"
                        :options="sceneClassificationList"
                        :props="{ checkStrictly: true, label: 'label', value: 'id' }"
                        clearable
                        @change="conditionClassIdChange($event, 'variables')"
                      ></el-cascader>
                    </el-col>
                  </el-row>
                </div>
                <!-- 拖拽区域 -->
                <div class="function-left-condition-list" style="height: 360px">
                  <p
                    draggable="true"
                    @dragstart="(event) => onDragStartMceNonEditable(event, item.code, 'variables')"
                    class="condition-list-item"
                    v-for="item in variablesSearchForm.options"
                    :key="item.id"
                    :data-code="item.code"
                    @click="handleAddFactor($event, item, 'variables')"
                  >
                    {{ item.name }}
                  </p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="function-right">
          <div class="operator-box">
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol('+')">+</el-button>
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol('-')">-</el-button>
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol('*')">*</el-button>
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol('/')">/</el-button>
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol('(')">(</el-button>
            <el-button type="text" class="operator-symbol" @click="handleAddSymbol(')')">)</el-button>
            <!-- <el-button class="operator-symbol" @click="getContentText()">查看文本信息</el-button> -->
          </div>

          <div class="function-body" id="editorContainer" ref="editorContainer"></div>
          <div id="validation-message" style="color: red; margin-top: 8px"></div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="localVisible = false" size="small">取 消</el-button>
      <el-button
        type="primary"
        plain
        @click="handleSave({ isPrd: true })"
        v-if="permissions.baseSetup_rule_function_publish"
        size="small"
        >发 布</el-button
      >
      <el-button
        type="primary"
        @click="handleSave({ isPrd: false })"
        v-if="permissions.baseSetup_rule_function_saveDraft"
        size="small"
        >保存草稿</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list"
import tinymce from "tinymce/tinymce"
import "tinymce/themes/silver/theme"
import "tinymce/icons/default/icons"
import { cloneDeep, capitalize, debounce } from "lodash"
import { addFunction, updateFunction, listFunctionEditorInfoBySceneId } from "@/api/ruleEngineConfig/functionList.js"
import { mapGetters } from "vuex"

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    sceneClassificationList: {
      default: () => []
    },
    detailsData: {
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    copyFlag: {
      type: Boolean,
      default: false
    },
    sceneId: {
      default: () => ""
    },
    classId: {
      default: () => ""
    }
    // addForm: {
    //   default: () => {}
    // }
  },
  components: {
    VirtualList
  },
  data() {
    return {
      localVisible: this.value,
      activeName: "all",
      addFormRules: {
        // code: [{ required: true, message: "请输入编码", trigger: "blur" }],
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
        classId: [{ required: true, message: "请选择分类", trigger: "blur" }]
      },
      addForm: {
        name: "",
        code: "",
        remark: "",
        // status: "",
        sceneId: "",
        classId: "",
        classIdArr: [],
        inputParameters: "",
        // details: null,
        contentArray: [],
        content: ""
      },

      editor: null,
      dataTransfer: null,
      currentDragItem: null,
      rulesSearchForm: {
        filterRules: "",
        classId: "",
        classIdArr: [],
        options: []
      },
      variablesSearchForm: {
        filterVariables: "",
        classId: "",
        classIdArr: [],
        options: []
      },
      functionsSearchForm: {
        filterFunctions: "",
        classId: "",
        classIdArr: [],
        options: []
      },
      allSearchForm: {
        filterAll: "",
        classId: "",
        classIdArr: [],
        options: []
      },
      variablesList: [],
      allVariablesList: [],
      dragListData: {},
      filterRules: "",
      filterVariables: "",
      title: "新增函数",
      debouncedSymbolMatching: null // 存储防抖函数
    }
  },
  watch: {
    value(val) {
      this.localVisible = val
    },
    localVisible(val) {
      this.$emit("input", val)
    },
    "addForm.classIdArr": {
      handler(val) {
        console.log("val", val)
        if (val && val.length) {
          this.addForm.classId = val[val.length - 1]
        } else {
          this.addForm.classId = ""
        }
      }
    },
    sceneId(val) {
      console.log("场景id", val)
    },
    classId(val) {
      if (this.title !== "新增函数") return
      if (val) {
        this.addForm.classIdArr = this.findPathByValue(this.sceneClassificationList, val)
      } else {
        this.addForm.classIdArr = []
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    // 创建防抖函数并绑定上下文
    this.debouncedSymbolMatching = debounce(this.symbolMatching.bind(this), 600)
  },
  beforeDestroy() {
    if (this.editor) {
      tinymce.remove(this.editor) // 销毁 TinyMCE 实例
      this.editor = null
    }
  },
  mounted() {},
  methods: {
    async getDragList() {
      const { data } = await listFunctionEditorInfoBySceneId({ sceneId: this.sceneId })
      if (data.code == 0) {
        this.dragListData = data.data
        this.variablesSearchForm.options = data.data.variables
        this.rulesSearchForm.options = data.data.rules
        this.functionsSearchForm.options = data.data.functions
        this.allSearchForm.options = data.data.all
      }
    },

    /**
     * 点击添加操作符
     */
    handleAddSymbol(symbolString) {
      const html = this.createEditableSpan(
        symbolString,
        "symbol",
        {},
        {
          color: "#1890ff",
          padding: "4px",
          "font-size": "16px"
        }
      )
      this.editor.insertContent(html)
      this.debouncedSymbolMatching({ data: symbolString })
      this.validateContent()
    },
    initTinyMCE() {
      return new Promise((resolve, reject) => {
        tinymce.init({
          target: this.$refs.editorContainer,
          // selector: "#editorContainer",
          inline: true,
          menubar: false,
          plugins: "paste",
          toolbar: "bold italic | alignleft aligncenter alignright alignjustify",
          placeholder: "输入公式",
          setup: (editor) => {
            this.editor = editor
            editor.on("drop", (event) => {
              editor.focus()
              event.preventDefault()

              if (event.dataTransfer?.getData) {
                // 获取拖拽的数据并去除 meta 标签
                const htmlContent = event.dataTransfer.getData("text/html").replace(/<meta[^>]*>/g, "")

                // 插入内容到光标位置
                if (htmlContent) {
                  editor.selection.setContent(htmlContent) // 在当前光标位置插入内容
                }

                this.validateContent()
              }
            })
            editor.on("input", (event) => {
              // console.log("imput=====>", event)
              //   const htmlContent = editor.getContent()

              //   // fixme 需要对/[()\[\]{}]/这些符号也要替换 ，目前方案是替换完后  后面在执行一个函数 来回显匹配符号的配对颜色

              this.debouncedSymbolMatching(event)
              // this.symbolMatching(event)
              this.validateContent()
            })
            editor.on("init", (event) => {
              this.debouncedSymbolMatching(event, true)
            })
          },
          init_instance_callback: (editor) => {
            console.log("成功", editor)
            resolve(editor)
          },
          setup_error_callback: (error) => {
            console.log("失败", error)
            reject(error)
          }
        })
      })
    },
    symbolMatching(event, isInit = false) {
      let htmlContent = this.editor.getContent()
      console.log("当前内容：==>", htmlContent)

      // 预设的颜色数组
      const colors = ["red", "blue", "green", "orange", "purple", "pink"]

      // 使用栈来跟踪括号的层次
      let stack = []
      let index = 0 // 用于标记括号顺序，确保栈处理的一致性

      // 处理内容中的括号
      const modifiedContent = htmlContent.replace(
        /(<span[^>]*?mceNonEditable[^>]*?>.*?<\/span>)|([()\[\]{}])/g,
        (match, nonEditableSpan, rawBracket) => {
          if (nonEditableSpan) {
            return nonEditableSpan // 如果是不可编辑的 <span>，直接返回，不处理
          }

          // 下面的逻辑只会对普通文本括号进行处理
          let color
          if (/[({\[]/.test(rawBracket)) {
            color = colors[stack.length % colors.length]
            stack.push({ color, index: index++ })
          } else if (/[)}\]]/.test(rawBracket)) {
            color = stack.length > 0 ? stack.pop().color : colors[0]
          } else {
            return match
          }

          return `<span contenteditable="false" style="display: inline-block; pointer-events: none; color: ${color};">${rawBracket}</span>`
        }
      )

      // 如果是初始化回显内容时，不进行字符输入相关的处理
      if (!isInit && event && /[()\[\]{}]/.test(event.data)) {
        // 如果输入的是括号字符，更新编辑器内容
        this.editor.setContent(modifiedContent)

        const paragraphs = this.editor.dom.select("p")

        // 如果存在 <p> 标签
        if (paragraphs.length > 0) {
          const lastP = paragraphs[paragraphs.length - 1] // 获取最后一个 <p> 标签
          const range = this.editor.dom.createRng() // 创建一个新的 Range
          range.setStart(lastP, lastP.childNodes.length) // 设置起始位置为 <p> 标签的最后一个子节点之后
          range.setEnd(lastP, lastP.childNodes.length) // 设置结束位置为相同的位置，确保光标在最后

          // 将光标设置到最后一个 <p> 标签的末尾
          this.editor.selection.setRng(range)
        }
      } else if (isInit) {
        // 在初始化时，仅更新编辑器内容，不触发输入相关的处理
        this.editor.setContent(modifiedContent)
      }
    },
    onDragStart(event, item) {
      // console.log("onDragStart", event)
      // event.dataTransfer.setData("text/html", item.text)
    },
    async opened() {
      this.title = this.isEdit ? "编辑函数" : this.copyFlag ? "复制函数" : "新增函数"
      if (!this.editor) {
        this.$nextTick(async () => {
          await this.initTinyMCE()
        })
      }

      // this.getVariablesPage()
      await this.getDragList()

      if (this.isEdit || this.copyFlag) {
        const { id, name, code, remark, sceneId, classId, contentArray, content } = this.detailsData
        this.addForm = {
          id,
          name,
          code,
          remark,
          sceneId,
          classId,
          classIdArr: this.findPathByValue(this.sceneClassificationList, classId),
          contentArray,
          content
        }

        this.addForm.executionData = JSON.parse(contentArray)
        if (!this.addForm.executionData || Object.keys(this.addForm.executionData).length === 0) {
          this.editor.setContent("")
          return
        }

        let html = ""
        let currentPIndex = null // 当前处理的 pIndex
        let currentPContent = "" // 当前 <p> 内容

        this.addForm.executionData.forEach((item, index) => {
          const isNewParagraph = item.pIndex !== currentPIndex // 判断是否切换到新的段落
          if (isNewParagraph) {
            // 如果切换到新段落，先把上一个段落闭合
            if (currentPContent) {
              html += `<p>${currentPContent}</p>`
              currentPContent = ""
            }
            currentPIndex = item.pIndex // 更新当前段落索引
          }

          let spanHtml = "" // 用于存储当前项的 HTML

          if (item.type === "factor") {
            spanHtml = this.createEditableSpan(
              // item.text,
              this.getLabel(item.code),
              "factor",
              {
                "data-code": item.code.split(" ").join("_"),
                "data-sort": item.sort
              },
              {
                padding: "2px 4px",
                "background-color": "#e1e3e4",
                border: "1px solid #dcdfe6",
                display: "inline-block",
                "border-radius": "4px",
                margin: "5px"
              }
            )
          } else if (item.type === "symbol") {
            spanHtml = this.createEditableSpan(
              item.text,
              "symbol",
              {},
              {
                color: "#1890ff",
                padding: "4px",
                "font-size": "16px"
              }
            )
          } else {
            spanHtml = this.createEditableSpan(
              item.text,
              "text",
              {},
              {
                color: "#606266",
                padding: "4px",
                "font-size": "16px"
              }
            )
          }

          currentPContent += spanHtml // 将生成的 span 添加到当前段落内容

          // 如果是最后一个元素，将段落闭合
          if (index === this.addForm.executionData.length - 1 && currentPContent) {
            html += `<p>${currentPContent}</p>`
          }
        })
        this.editor.setContent(html)
        this.debouncedSymbolMatching(null, true)
      }
    },
    close() {
      this.addForm = {
        id: "",
        name: "",
        code: "",
        remark: "",
        sceneId: "",
        classId: "",
        classIdArr: [],
        contentArray: [],
        content: ""
      }
      this.editor?.setContent("")
    },
    handleClose() {
      this.localVisible = false
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getLabel(code) {
      const { functions, rules, variables } = this.dragListData
      return [...functions, ...rules, ...variables].find((item) => item.code == code)?.name || ""
    },
    async handleSave(opt) {
      const valid = await this.$refs.addFunctionForm.validate()
      // console.log("valid", valid)
      const postData = cloneDeep({
        ...this.addForm,
        ...this.getContentText(),
        sceneId: this.sceneId,
        ...opt
      })
      console.log("postData", postData)

      // return
      if (this.isEdit) {
        const { data } = await updateFunction(postData)
        if (data.code == 0) {
          this.$message.success("保存成功")
          this.localVisible = false
          // 刷新列表  编辑状态还原
          this.$emit("success", false)
        }
      } else {
        const { data } = await addFunction({ ...postData, code: this.addForm.name })
        if (data.code == 0) {
          this.$message.success("保存成功")
          this.localVisible = false
          // 刷新列表  编辑状态还原
          this.$emit("success", false)
        }
      }
    },
    onUpdate() {},

    /**
     * 添加参数
     */
    handleAddFactor(event, item, sort) {
      console.log("event", event, item)
      const html = this.createEditableSpan(
        item.name,
        "factor",
        {
          "data-code": item.code.split(" ").join("_"),
          "data-sort": sort
        },
        {
          padding: "2px 4px",
          "background-color": "#e1e3e4",
          border: "1px solid #dcdfe6",
          display: "inline-block",
          "border-radius": "4px",
          margin: "5px"
        }
      )
      this.editor.insertContent(html)
    },
    onDragStartMceNonEditable(event, code, sort) {
      const sortMapping = {
        variables: this.dragListData.variables,
        rules: this.dragListData.rules,
        functions: this.dragListData.functions
      }

      const itemList = sortMapping[sort]
      const item = itemList ? itemList.find((i) => i.code === code) : null

      if (item) {
        // 把 item 数据存入 dataTransfer，以便在 drop 时使用
        const html = this.createEditableSpan(
          item.name, // 节点显示的文本内容
          "factor", // 节点类型
          {
            "data-code": item.code.split(" ").join("_"), // 自定义属性
            "data-sort": sort
          },
          {
            padding: "2px 4px", // 样式
            "background-color": "#e1e3e4",
            border: "1px solid #dcdfe6",
            display: "inline-block",
            "border-radius": "4px",
            margin: "5px"
          }
        )
        event.dataTransfer.setData("text/html", html)
      }
    },
    getFactorName(item) {
      return item.displayName == "变量" ? "variables" : item.displayName == "函数" ? "functions" : "rules"
    },
    getContentText() {
      const htmlContent = this.editor.getContent()

      console.log("=====->", htmlContent)
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, "text/html")
      let nodes = doc.body.childNodes

      const allNodes = []
      let pIndex = 0 // 用于记录当前 <p> 标签的索引

      Array.from(nodes).forEach((node) => {
        if (node.tagName === "P") {
          // 如果是 <p> 标签，添加它的子节点并记录当前索引
          Array.from(node.childNodes).forEach((child) => {
            allNodes.push({ node: child, pIndex }) // 添加 pIndex 标记
          })
          pIndex++
        } else {
          // 直接添加其他类型的节点（非 <p>）
          allNodes.push({ node, pIndex: null })
        }
      })

      // 定义优先匹配的多字符运算符和单字符运算符
      const multiCharSymbols = /(>=|<=|&&|\|\|)/g
      const singleCharSymbols = /([+\-*/();,=><{}])/g

      const contentArray = []

      allNodes.forEach(({ node, pIndex }) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim()

          if (!text) {
            // 跳过仅包含换行符或空白的文本节点
            return
          }

          // 先分离多字符运算符
          const segments = text.split(multiCharSymbols).filter(Boolean)

          segments.forEach((segment) => {
            if (multiCharSymbols.test(segment)) {
              // 匹配多字符运算符
              contentArray.push({ text: segment, type: "symbol", pIndex })
            } else {
              // 分离单字符运算符
              const subSegments = segment.split(singleCharSymbols).filter(Boolean)

              subSegments.forEach((subSegment) => {
                if (singleCharSymbols.test(subSegment)) {
                  contentArray.push({ text: subSegment.trim(), type: "symbol", pIndex })
                } else if (subSegment.trim()) {
                  // 确保非空字符
                  contentArray.push({ text: subSegment, type: "text", pIndex })
                }
              })
            }
          })
        } else if (node.tagName === "SPAN") {
          // 处理 <span> 标签内容
          const attributes = this.getAttributes(node)
          const code = attributes["data-code"] || null
          delete attributes["data-code"]
          const type = attributes["data-type"] || null
          delete attributes["data-type"]
          const sort = attributes["data-sort"] || null
          delete attributes["data-sort"]

          contentArray.push({
            text: node.textContent || "",
            code,
            type,
            sort,
            pIndex // 记录所属 <p> 标签的索引
          })
        }
      })

      let content = ""
      contentArray.forEach((item) => {
        if (item.code) {
          content += item.code
        } else {
          content += item.text
        }
      })

      return {
        contentArray: JSON.stringify(contentArray),
        content: content,
        inputParameters: JSON.stringify(
          this.packageDetails(contentArray, [...this.dragListData.variables, ...this.dragListData.rules])
        )
      }
    },
    getAttributes(node) {
      // 提取节点的所有属性并转换为键值对
      const attrs = {}
      if (node.attributes) {
        Array.from(node.attributes).forEach((attr) => {
          attrs[attr.name] = attr.value
        })
      }
      return attrs
    },
    packageDetails(dataArray, originalArray) {
      const result = {}

      dataArray.forEach((item) => {
        // 根据 dataArray 中的 `code` 值查找 originalArray 中的对象
        const foundItem = originalArray.find((obj) => obj.code.split(" ").join("_") === item.code)

        if (foundItem) {
          // 以 code 为键名，foundItem 为键值
          result[item.code] = foundItem
        }
      })

      return result
    },

    conditionFilterTextChange(val, key) {
      // const currentClassId = this[`${key}SearchForm`].classIdArr.length
      //   ? this[`${key}SearchForm`].classIdArr[this[`${key}SearchForm`].classIdArr.length - 1]
      //   : ""
      // const lowerVal = val.toLowerCase()

      // if (!val) {
      //   this[`${key}SearchForm`].options = this.dragListData[key].filter((item) => {
      //     if (currentClassId) {
      //       return item.classId == currentClassId
      //     }
      //     return true // 不过滤
      //   })
      //   return
      // }

      // this[`${key}SearchForm`].options = this.dragListData[key]
      //   .filter((item) => {
      //     if (currentClassId) {
      //       return item.classId == currentClassId
      //     }
      //     return true // 不过滤
      //   })
      //   .filter((item) => {
      //     return item.name.toLowerCase().includes(lowerVal)
      //   })

      const searchForm = this[`${key}SearchForm`]
      const currentClassId = searchForm.classIdArr.length ? searchForm.classIdArr[searchForm.classIdArr.length - 1] : ""
      const lowerVal = val.toLowerCase()

      const filteredByClassId = this.dragListData[key].filter((item) => {
        return currentClassId ? item.classId == currentClassId : true
      })

      if (!val) {
        searchForm.options = filteredByClassId
        return
      }

      searchForm.options = filteredByClassId.filter((item) => {
        return item.name.toLowerCase().includes(lowerVal)
      })
    },

    conditionClassIdChange(val, key) {
      console.log("(val, )", val)
      console.log("(, key)", key)

      const searchForm = this[`${key}SearchForm`]
      console.log("searchForm", searchForm)
      const currentText = searchForm[`filter${capitalize(key)}`]
      const lowerVal = currentText.toLowerCase()

      const filteredByText = (item) => item.name.toLowerCase().includes(lowerVal)

      if (val.length) {
        searchForm.options = this.dragListData[key]
          .filter((item) => item.classId == val[val.length - 1])
          .filter(filteredByText)
      } else {
        searchForm.options = this.dragListData[key].filter(filteredByText)
      }
    },
    /**
     * 递归查找路径函数
     */
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
    /**
     * 生成可插入编辑器的 HTML 节点字符串
     * @param {string} text 节点显示的文本内容
     * @param {string} type 节点类型，例如 "factor", "symbol", "text"
     * @param {Object} attributes 附加的自定义属性，例如 data-code, data-sort 等
     * @param {Object} styles 样式对象，键值对形式
     * @returns {string} 返回生成的 HTML 字符串
     */
    createEditableSpan(text, type, attributes = {}, styles = {}) {
      // 将 styles 对象转为字符串
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key}:${value}`)
        .join(";")

      // 将 attributes 对象转为字符串
      const attributesString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
      if (type == "text" || type == "symbol") {
        return `${text}`
      }

      // 返回生成的 HTML 字符串
      return `<span contenteditable="false" class="mceNonEditable" data-type="${type}" style="${styleString}" ${attributesString}>${text}</span>`
    },
    // 数学公式校验函数
    validateMathExpression(expression) {
      // 将 span 包裹的内容替换为 Ω，并去掉所有空格
      const trimmedExpression = expression
        .replace(/\s+/g, "") // 去掉空格
        .replace(/^<p[^>]*>(.*?)<\/p>$/g, "$1") // 去掉最外层的 p 标签
        .replace(/<span[^>]*data-type="symbol"[^>]*>(.*?)<\/span>/g, (_, content) => content) // 提取 symbol 的内容
        .replace(/<span[^>]*data-type="[^"]+"[^>]*>(.*?)<\/span>/g, "Ω")

      console.log("trimmedExpression", trimmedExpression)

      // 校验括号匹配
      let stack = []
      for (let i = 0; i < trimmedExpression.length; i++) {
        const char = trimmedExpression[i]

        if (char === "(" || char === "{") {
          stack.push(char)
        } else if (char === ")" || char === "}") {
          if (stack.length === 0) {
            return `括号不匹配：多余的${char === ")" ? "右括号" : "右花括号"}`
          }
          const lastOpen = stack.pop()
          if ((char === ")" && lastOpen !== "(") || (char === "}" && lastOpen !== "{")) {
            return `括号类型不匹配：${lastOpen} 与 ${char}`
          }
        }

        if (char === "（" || char === "）") {
          return "公式中不能包含中文括号"
        }
      }

      if (stack.length > 0) {
        const unmatched = stack[stack.length - 1]
        return `括号不匹配：多余的${unmatched === "(" ? "左括号" : "左花括号"}`
      }

      return "公式合法"
    },
    validateContent() {
      // 可选：触发完整公式校验
      const validationMessage = this.validateMathExpression(this.editor.getContent())
      const messageContainer = document.getElementById("validation-message")
      if (validationMessage !== "公式合法") {
        messageContainer.textContent = validationMessage
      } else {
        messageContainer.textContent = ""
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.function-dialog-content {
  padding: 10px;

  .function-list {
    display: flex;

    .function-left {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      width: 400px;
      background-color: rgba(242, 242, 242, 0.6);
      height: 450px;
      .function-left-content {
        padding: 10px;
        .left-content-search {
        }

        .function-left-condition-list {
          border: 1px solid #dcdfe6;
          height: 350px;
          border-radius: 4px;
          overflow-y: auto;
          background-color: #fff;

          .condition-list-item {
            margin: 4px;
            padding: 8px;
            background-color: rgba(242, 242, 242, 0.7);
            border-radius: 2px;
            cursor: pointer;
          }
        }
      }
    }

    .function-right {
      flex: 1;
      margin-left: 20px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .operator-box {
        padding: 10px;
        border-radius: 4px;
        background-color: rgba(242, 242, 242, 0.6);
        .operator-symbol {
          // border: none;
          // background-color: transparent;
          color: #1890ff;
          margin: 0 10px;
        }
      }
      .function-body {
        flex: 1;
        padding: 10px;
        border: 1px solid #dcdfe6;
        margin-top: 10px;
        border-radius: 4px;
        .condition-list-item {
          padding: 5px;
          background-color: pink;
          display: inline-block;
          margin: 5px;
        }
      }
    }
  }
}

/* 自定义滚动条 */
/* 滚动条整体样式 */
::-webkit-scrollbar {
  opacity: 0.4 !important;
  width: 10px !important; /* 宽度 */
  height: 10px; /* 高度（横向滚动条） */
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: rgba(188, 191, 193, 0.4);
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.7); /* 轨道背景颜色，不透明 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(188, 191, 193, 0.75);
}

::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
::v-deep .el-tabs__header {
  margin-bottom: 0 !important;
}
::v-deep .el-dialog__footer {
  padding: 10px !important;
}
.mce-content-body:not([dir="rtl"])[data-mce-placeholder]:not(.mce-visualblocks)::before {
  padding-left: 10px;
}
</style>
