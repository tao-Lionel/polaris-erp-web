<template>
  <div ref="currentCurdRef" :class="[b(), { 'media-1': tableOption.isMedia }]">
    <el-card :class="b('box')">
      <div
        slot="header"
        :class="b('title')"
        v-if="vaildData(tableOption.title, false) || vaildData(tableOption.dateBtn, config.dateBtn)"
      >
        <span>{{ tableOption.title }}</span>
        <date-group
          @change="dateChange"
          v-if="vaildData(tableOption.dateBtn, config.dateBtn)"
          :default="vaildData(tableOption.dateDefault, config.dateDefault)"
          :size="isMediumSize"
        ></date-group>
      </div>
      <!-- 表格功能列 -->
      <!-- {'open-height':tableOption.openHeight}, -->
      <div :class="[b('header'), 'minHeight']" v-if="vaildData(tableOption.header, true)">
        <!-- <div style="float:left"> -->
        <div>
          <el-button
            type="primary"
            @click="rowAdd"
            :icon="config.addBtnIcon"
            :size="isMediumSize"
            v-if="vaildData(tableOption.addBtn, config.addBtn)"
            >{{ config.addBtnTitle }}</el-button
          >
          <slot name="menuLeft"></slot>
        </div>
        <div style="float: right">
          <slot name="menuRight"></slot>
        </div>
      </div>
      <div :class="b('menu')" v-if="vaildData(tableOption.header, true)">
        <div :class="b('left')">
          <!-- <el-form @submit.native.prevent="submitSearch" :model="searchForm"
              :inline="true"
              ref="searchForm"
              v-if="searchShow ">-->
          <el-form :inline="true" ref="searchForm" :model="searchForm" @submit.native.prevent v-if="searchShow">
            <!-- 循环列搜索框 -->
            <!-- <el-form-item
              :prop="column.prop"
              label=""
              v-for="(column, index) in columnOption"
              :key="index"
              v-if="column.search"
            >
              <component
                :is="getSearchType(column.type)"
                :inputStyle="column.inputStyle"
                :size="isMediumSize"
                v-model="searchForm[column.prop]"
                :type="getType(column)"
                :props="column.props || tableOption.props"
                :format="column.format"
                :parent="column.parent"
                :onlyTrim="column.onlyTrim || false"
                :defaultExpandAll="column.defaultExpandAll"
                :filterable="column.searchFilterable"
                :filter-method="column.searchFilterMethod"
                :formatter="column.formatter"
                :value-format="column.valueFormat"
                :multiple="config.searchMultiple.includes(column.type) && vaildData(column.searchMmultiple, false)"
                :clearable="column.searchClearable"
                :placeholder="column.searchPlaceholder || column.label"
                :dic="setDic(column.dicData, DIC[column.dicData])"
              ></component>
            </el-form-item> -->
            <el-form-item class="avue-slot-search">
              <slot name="search"></slot>
              <el-button type="text" @click="openSearchAdvanced" v-if="vaildData(tableOption.searchAdvanced, false)"
                >高级搜索
                <i
                  class="el-icon--right"
                  :class="[{ 'el-icon-arrow-down': !searchAdvamcedShow, 'el-icon-arrow-up': searchAdvamcedShow }]"
                ></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div :class="b('right')">
          <div v-if="searchShow" class="avue-crud_mg">
            <!-- <el-button
                    :icon="config.refreshBtnIcon"
                    circle
                    :size="isMediumSize"
                    @click="refreshChange"
                    v-if="vaildData(tableOption.refreshBtn,config.refreshBtn)"
                ></el-button>-->
            <el-button
              :icon="config.columnBtnIcon"
              circle
              :size="isMediumSize"
              @click="columnBox = true"
              v-if="vaildData(tableOption.columnBtn, config.columnBtn)"
            ></el-button>
            <el-button
              v-show="tableOption.tableMenuSearch"
              :icon="config.searchboxBtnIcon"
              circle
              :size="isMediumSize"
              @click="searchShow = !searchShow"
              v-if="searchShow && vaildData(tableOption.searchBtn, config.searchBtn)"
            ></el-button>
            <el-button
              v-if="vaildData(tableOption.showSearchBtn, config.showSearchBtn)"
              type="primary"
              ref="searchBtn"
              @click="searchChange"
              :icon="config.searchBtnIcon"
              :size="isMediumSize"
              >{{ config.searchBtnTitle }}</el-button
            >
            <el-button
              @click="searchReset"
              :icon="config.emptyBtnIcon"
              :size="isMediumSize"
              v-if="searchShow && vaildData(tableOption.resetBtn, config.resetBtn)"
              >{{ config.emptyBtnTitle }}</el-button
            >
            <slot name="searchMenu"></slot>
          </div>
        </div>
      </div>

      <div :class="b('searchAdvanced')" v-show="searchAdvamcedShow">
        <!-- <el-form @submit.prevent.native :inline="true"> -->
        <slot name="searchAdvanced"></slot>
        <!-- </el-form> -->
      </div>

      <!-- 标签插入 -->
      <slot name="tableBeforeSlot"></slot>
      <el-tag class="avue-tip" v-if="vaildData(tableOption.tip, config.tip) && tableOption.selection">
        <i class="el-icon-info avue-tip__icon">&nbsp;</i>
        <span class="avue-tip__name">
          {{ config.tipStartTitle }}
          <span class="avue-tip__name--bold">{{ selectLen }}</span>
          {{ config.tipEndTitle }}
        </span>
        <span
          class="avue-tip__btn"
          @click="selectClear"
          v-if="vaildData(tableOption.selectClearBtn, config.selectClearBtn) && tableOption.selection"
          >{{ config.tipBtnTitle }}</span
        >
      </el-tag>
      <!-- 返回数据列表 -->
      <el-table
        class="table-content-area"
        :class="{ cancelFixedTop: option.cancelFixedTop }"
        :data="list"
        :size="controlSize"
        :row-key="getRowKeys"
        :highlight-current-row="tableOption.highlightCurrentRow"
        @current-change="currentRowChange"
        :show-summary="tableOption.showSummary"
        :summary-method="tableSummaryMethod"
        :empty-text="tableOption.emptyText"
        :span-method="tableSpanMethod"
        :stripe="tableOption.stripe"
        :show-header="tableOption.showHeader"
        :default-sort="tableOption.defaultSort"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :header-cell-class-name="headerCellClassName"
        ref="table"
        :width="setPx(tableOption.width, config.width)"
        :border="tableOption.border"
        @selection-change="selectionChange"
        @sort-change="sortChange"
        @header-dragend="headerDragend"
        @select="selectRow"
        @select-all="selectAll"
        @clear-sort="clearSort"
        @clear-filter="clearFilter"
        :height="tableOption.fixHeight ? tableOption.fixHeight : tableAutoHeight"
        :max-height="tableOption.fixMaxHeight ? tableOption.fixMaxHeight : tableMaxHeight"
        :tree-props="tableOption.treeProps"
        :default-expand-all="tableOption.defaultExpandAll"
      >
        <!-- v-loading="tableLoading" -->
        <!-- :height="tableAutoHeight" -->
        <!--         :max-height="tableOption.maxHeight" -->
        <!-- :height="
          tableOption.height == 'auto'
            ? clientHeight - vaildData(tableOption.calcHeight, config.calcHeight)
            : tableOption.height
        " -->
        <!-- 暂无数据提醒 -->
        <template slot="empty">
          <slot name="empty" v-if="$slots.empty"></slot>
          <span @click="refreshChange" v-else style="cursor: pointer">暂无数据，点击刷新</span>
        </template>

        <!-- 选择框 -->
        <el-table-column
          v-if="option.selection"
          type="selection"
          align="center"
          width="60"
          :fixed="option.selectionFixed"
          :reserve-selection="true"
          :selectable="selectable"
        ></el-table-column>

        <!-- 折叠面板  -->
        <el-table-column
          type="expand"
          width="30"
          align="center"
          v-if="tableOption.expand"
          toggle-row-selection="selected"
        >
          <template slot-scope="props">
            <slot :row="props.row" name="expand"></slot>
          </template>
        </el-table-column>

        <!-- 序号 -->
        <el-table-column
          v-if="tableOption.index"
          :label="vaildData(tableOption.indexLabel, config.indexLabel)"
          type="index"
          :index="indexMethod"
          width="60"
          align="center"
        ></el-table-column>
        <!-- 循环列 -->
        <el-table-column
          v-if="columnIndex.indexOf(column.prop) != -1 && !column.hidden"
          v-for="column in columnOption"
          :prop="column.prop"
          :key="column.prop"
          filter-placement="bottom-end"
          :filters="column.filters"
          :filter-method="column.filterMethod"
          :filter-multiple="vaildData(column.filterMultiple, config.filterMultiple)"
          :show-overflow-tooltip="column.overHidden"
          :min-width="column.minWidth"
          :sortable="
            typeof column.sortable == 'boolean' ? column.sortable : column.sortable == 'custom' ? 'custom' : true
          "
          :align="vaildData(column.align, tableOption.align)"
          :header-align="vaildData(column.headerAlign, tableOption.headerAlign)"
          :width="column.width"
          :label="column.label"
          :fixed="column.fixed"
        >
          <template slot="header" slot-scope="scope">
            <slot v-if="column.slotHeader" :name="column.slotHeader" :column="scope.column"></slot>
            <span v-else>
              <span v-if="column.required" style="color: red">*</span>
              <span>{{ scope.column.label }}</span>
            </span>
          </template>
          <crud-components
            v-if="column.children"
            :columnOption="column.children"
            :tableOption="tableOption"
            :tableForm="tableForm"
            :columnIndex="columnIndex"
            :DIC="DIC"
          >
            <template slot-scope="scope" v-for="item in column.children" :slot="item.prop">
              <slot
                :row="scope.row"
                :dic="scope.dic"
                :type="getType(column)"
                :size="isMediumSize"
                :label="scope.label"
                :name="item.prop"
                v-if="item.solt"
              ></slot>
            </template>
          </crud-components>
          <template slot-scope="scope">
            <!-- <template v-if="cellEditFlag(scope.row, column)">
              <component
                :is="getSearchType(column.type)"
                size="mini"
                v-model="scope.row[column.prop]"
                :type="getType(column)"
                :disabled="btnDisabled"
                :props="column.props || tableOption.props"
                :format="column.format"
                :parent="column.parent"
                :defaultExpandAll="column.defaultExpandAll"
                :value-format="column.valueFormat"
                :multiple="column.multiple"
                :clearable="vaildData(column.clearable, false)"
                :placeholder="column.label"
                :dic="setDic(column.dicData, DIC[column.dicData])"
              ></component>
            </template> -->
            <!-- <copy-text v-if="column.solt && vaildData(column.copy, true)" hoverToShow>
              <template v-slot>
                <slot
                  :row="scope.row"
                  :column="column"
                  :dic="setDic(column.dicData, DIC[column.dicData])"
                  :label="detail(scope.row, column)"
                  :name="column.prop"
                ></slot>
              </template>
            </copy-text> -->
            <template v-if="column.solt">
              <slot
                :row="scope.row"
                :column="column"
                :dic="setDic(column.dicData, DIC[column.dicData])"
                :label="detail(scope.row, column)"
                :name="column.prop"
              ></slot>
            </template>
            <!-- <template v-else-if="column.type === 'upload'">
              <avue-crud-img
                :listType="column.listType"
                :imgWidth="column.imgWidth"
                :fullscreen="column.imgFullscreen"
                :imgHeight="column.imgHeight"
                :type="column.imgType"
                :dataType="column.dataType"
                :size="isMediumSize"
                :value="scope.row[column.prop]"
              ></avue-crud-img>
            </template> -->
            <template v-else>
              <template v-if="!vaildData(column.copy, true)">
                <span class="el-row-text" :title="detail(scope.row, column)" v-html="detail(scope.row, column)"></span>
              </template>
              <copy-text v-else-if="vaildData(column.copy, true)" :text="detail(scope.row, column)" hoverToShow>
              </copy-text>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-if="vaildData(tableOption.menu, config.menu)"
          :label="config.menuTitle"
          :align="tableOption.menuAlign"
          :header-align="tableOption.menuHeaderAlign"
          :width="vaildData(tableOption.menuWidth, config.menuWidth)"
        >
          <template slot-scope="scope">
            <el-dropdown v-if="menuType === 'menu'" style="margin-right: 9px">
              <el-button type="primary" :size="isMediumSize">
                {{ config.menuBtnTitle }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="vaildData(tableOption.viewBtn, true)"
                  @click.native="rowView(scope.row, scope.$index)"
                  >{{ config.viewBtnTitle }}</el-dropdown-item
                >
                <el-dropdown-item
                  divided
                  v-if="vaildData(tableOption.editBtn, true)"
                  @click.native="rowEdit(scope.row, scope.$index)"
                  >{{ config.editBtnTitle }}</el-dropdown-item
                >
                <el-dropdown-item
                  divided
                  v-if="vaildData(tableOption.delBtn, true)"
                  @click.native="rowDel(scope.row, scope.$index)"
                  >{{ config.delBtnTitle }}</el-dropdown-item
                >
                <slot
                  name="menuBtn"
                  :row="scope.row"
                  :type="menuText()"
                  :dic="scope.dic"
                  :size="isMediumSize"
                  :label="scope.label"
                  :index="scope.$index"
                ></slot>
              </el-dropdown-menu>
            </el-dropdown>
            <template v-else-if="['button', 'text', 'icon'].includes(menuType)">
              <el-button
                :type="menuText('primary')"
                :icon="scope.row.$cellEdit ? config.cellSaveBtnIcon : config.cellEditBtnIcon"
                :size="isMediumSize"
                :disabled="btnDisabled"
                @click.stop="rowCell(scope.row, scope.$index)"
                v-if="vaildData(tableOption.cellBtn, config.cellBtn)"
                >{{ menuIcon(scope.row.$cellEdit ? config.cellSaveBtnTitle : config.cellEditBtnTitle) }}</el-button
              >
              <el-button
                :type="menuText('success')"
                :icon="config.viewBtnIcon"
                :size="isMediumSize"
                :disabled="btnDisabled"
                @click.stop="rowView(scope.row, scope.$index)"
                v-if="vaildData(tableOption.viewBtn, config.viewBtn)"
                >{{ menuIcon(config.viewBtnTitle) }}</el-button
              >
              <el-button
                :type="menuText('primary')"
                :icon="config.editBtnIcon"
                :size="isMediumSize"
                :disabled="btnDisabled"
                @click.stop="rowEdit(scope.row, scope.$index)"
                v-if="vaildData(tableOption.editBtn, config.editBtn)"
                >{{ menuIcon(config.editBtnTitle) }}</el-button
              >
              <el-button
                :type="menuText('danger')"
                :icon="config.delBtnIcon"
                :size="isMediumSize"
                :disabled="btnDisabled"
                @click.stop="rowDel(scope.row, scope.$index)"
                v-if="vaildData(tableOption.delBtn, config.delBtn)"
                >{{ menuIcon(config.delBtnTitle) }}</el-button
              >
            </template>
            <slot
              name="menu"
              :row="scope.row"
              :type="menuText()"
              :dic="scope.dic"
              :disabled="btnDisabled"
              :size="isMediumSize"
              :label="scope.label"
              :index="scope.$index"
            ></slot>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <div :class="b('pagination')" v-if="pageFlag">
        <el-pagination
          :current-page.sync="defaultPage.currentPage"
          :background="vaildData(defaultPage.pageBackground, config.pageBackground)"
          :page-size="defaultPage.pageSize"
          :page-sizes="defaultPage.pageSizes"
          @size-change="sizeChange"
          @current-change="currentChange"
          :layout="vaildData(tableOption.paginationLayout, 'total, sizes, prev, pager, next, jumper')"
          :total="defaultPage.total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 表单 -->
    <el-dialog
      v-if="boxVisible"
      lock-scroll
      :custom-class="vaildData(tableOption.customClass, config.customClass)"
      :fullscreen="tableOption.dialogFullscreen"
      :modal-append-to-body="false"
      :append-to-body="true"
      :title="dialogTitle"
      :close-on-press-escape="tableOption.dialogEscape"
      :close-on-click-modal="tableOption.dialogClickModal"
      :modal="tableOption.dialogModal"
      :show-close="tableOption.dialogCloseBtn"
      :visible.sync="boxVisible"
      :width="vaildData(tableOption.dialogWidth, config.dialogWidth)"
      @close="closeDialog"
    >
      <div :class="b('dialog', ['overflow'])">
        <avue-form
          v-model="tableForm"
          ref="tableForm"
          :disabled="keyBtn"
          :uploadBefore="uploadBefore"
          :uploadAfter="uploadAfter"
          :option="formOption"
        >
          <template slot-scope="scope" v-for="item in columnOption" :slot="item.prop">
            <slot
              :value="scope.value"
              :column="scope.column"
              :dic="scope.dic"
              :disabled="scope.disabled"
              :size="scope.size"
              :row="tableForm"
              :index="tableIndex"
              :name="item.prop + 'Form'"
              v-if="item.formsolt"
            ></slot>
          </template>
        </avue-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 弹出框按钮组 -->
        <slot name="menuForm" :row="tableForm" :type="boxType"></slot>
        <el-button type="primary" @click="rowUpdate" size="small" v-if="boxType == 'edit'" :loading="keyBtn">{{
          vaildData(tableOption.updateBtnTitle, config.updateBtnTitle)
        }}</el-button>
        <el-button type="primary" @click="rowSave" size="small" :loading="keyBtn" v-else-if="boxType == 'add'">{{
          vaildData(tableOption.saveBtnTitle, config.saveBtnTitle)
        }}</el-button>
        <el-button size="small" @click="closeDialog">{{
          vaildData(tableOption.cancelBtnTitle, config.cancelBtnTitle)
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 动态列 -->
    <el-dialog
      lock-scroll
      :modal-append-to-body="false"
      :append-to-body="true"
      :title="config.columnBtnTitle"
      :visible.sync="columnBox"
      width="60%"
      custom-class="noWatch"
    >
      <el-button size="mini" type="primary" style="margin-bottom: 10px" @click="clearLocalStorage()">
        恢复默认
      </el-button>
      <el-checkbox-group v-model="columnIndex" @change="columnIndexChange" style="display: flex">
        <VueDraggable
          v-model="columnList"
          :animation="150"
          group="people"
          filter=".no-drag"
          draggable=".draggable"
          @update="onChangeTableCol"
          style="width: 100%"
        >
          <el-col
            :span="6"
            v-for="(item, index) in columnList"
            :key="index"
            :class="option.dialogDisable && option?.dialogDisable?.includes(item.index) ? 'no-drag' : 'draggable'"
          >
            <el-checkbox
              :disabled="option.dialogDisable && option.dialogDisable.includes(item.index)"
              :label="item.prop"
            >
              {{ item.label }}
              <span v-if="item?.fixed" class="lock-wrapper has-lock" @click.prevent="handleColUnLock(item, index)">
                <i class="el-icon-lock"> </i>
              </span>
              <span v-else class="lock-wrapper" @click.prevent="handleColLock(item, index)">
                <i class="el-icon-unlock"></i>
              </span>
            </el-checkbox>
          </el-col>
        </VueDraggable>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>
<script>
import dateGroup from "../../date-group"
import create from "../../utils/create"
import crud from "../../mixins/crud.js"
import column from "../../mixins/column.js"
import crudComponents from "./crud-components"
import config from "./config.js"
import { createLayoutManager } from "@/util/autoCalculateTableHeight.js"
import { validatenull, asyncValidator } from "../../utils/validate.js"
import { setTimeout } from "timers"
import { deepCloneIgnoreNull } from "../../utils/util"
import { VueDraggable } from "vue-draggable-plus"
import { tableOption } from "@/const/crud/option"

export default create({
  name: "crud",
  mixins: [crud(), column()],
  components: {
    crudComponents,
    dateGroup,
    VueDraggable
  },
  data() {
    return {
      clientHeight: document.documentElement.clientHeight,
      defaultForm: {
        tableForm: {},
        searchForm: {}
      },
      defaultPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [],
        background: true // 背景颜色
      },
      defaultParam: ["$index"],
      keyBtn: false,
      config: config,
      list: {
        type: Array,
        default: () => {
          return []
        }
      },
      searchAdvamcedShow: false,
      searchShow: true,
      //搜索条件
      searchForm: {},
      //确定的搜索条件
      searchFormConfirm: {},
      boxVisible: false,
      boxType: "add",
      columnIndex: [],
      columnBox: false,
      columnList: [],
      tableForm: {},
      tableOption: {},
      tableFormRules: {},
      tableIndex: -1,
      tableSelect: [],
      tableSelectListAll: {}, // 保存每页选中的数据
      rowSelectFlag: false,
      tableAutoHeight: null,
      tableMaxHeight: null,
      loadCalcColWidth: false // 是否动态计算列宽
    }
  },
  created() {
    // 初始化数据
    this.dataInit()
    // 初始化列
    this.columnInit()

    //初始化分页
    this.pageInit()
    this.$emit("on-load", this.defaultPage)
  },
  computed: {
    btnDisabled() {
      return this.keyBtn && this.tableOption.cellBtn
    },
    pageFlag() {
      return !validatenull(this.page.total)
    },
    dialogTitle() {
      const key = `${this.boxType}Title`
      return this.tableOption[key] || this.config[key]
    },
    columnOption() {
      return this.tableOption.column || []
    },
    sumColumnList() {
      return this.tableOption.sumColumnList || []
    },
    selectLen() {
      return Object.values(this.tableSelectListAll).flat().length
    },
    searchFlag() {
      if (this.$slots.search) return true
      else return !validatenull(this.searchForm)
    },
    formOption() {
      let option = this.deepClone(this.tableOption)
      option.submitBtn = false
      option.submitPostion = "right"
      option.boxType = this.boxType
      option.dicFlag = false
      option.dicData = this.DIC
      option.emptyBtn = false
      return option
    }
  },
  watch: {
    value: {
      handler() {
        this.formVal()
      },
      deep: true
    },
    page: {
      handler() {
        this.pageInit()
      },
      deep: true
    },
    columnOption() {
      this.columnInit()
    },
    data() {
      this.dataInit()
    }
  },

  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    spanMethod: Function,
    summaryMethod: Function,
    beforeClose: Function,
    beforeOpen: Function,
    rowClassName: Function,
    cellClassName: Function,
    headerCellClassName: Function,
    uploadBefore: Function,
    uploadAfter: Function,
    spanSelection: Function,
    page: {
      type: Object,
      default() {
        return {}
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },

    data: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    option: {
      type: Object,
      default: () => ({})
    },
    // 决定这一行的 CheckBox 是否可以勾选
    selectable: {
      type: Function,
      default: () => {
        return true
      }
    },
    rowKey: {
      type: String,
      default: () => {
        return "id"
      }
    }
  },
  mounted: function () {
    this.$refs.currentCurdRef.addEventListener("keyup", this.handleKeydown)
    this.$nextTick(() => {
      // 初始化 LayoutManager，并传递回调函数以更新数据属性
      this.layoutManager = new createLayoutManager({
        contentAreaSelector: ".table-content-area",
        tableOption: this.tableOption,
        page: this.page,
        onResizeCallback: ({ contentHeight, maxHeight }) => {
          if (maxHeight) {
            this.tableMaxHeight = maxHeight
            // return
          }
          this.tableAutoHeight = contentHeight
          this.$set(this, "tableAutoHeight", contentHeight)
        }
      })
      // this.setSearchLabel()
    })
    this.loadCalcColWidth = true
  },
  activated() {
    window.addEventListener("keyup", this.handleKeydown)
    const tableBodyWrapper = document.querySelector(".el-table__body-wrapper")
    if (tableBodyWrapper) {
      tableBodyWrapper.style.overflowY = "auto"
    }
  },
  deactivated() {
    window?.removeEventListener("keyup", this.handleKeydown)
    this.tableAutoHeight = "auto"
  },
  destroyed() {
    // this.removeSearchLabelListeners()
  },
  methods: {
    handleKeydown(e) {
      if (e.target === this.$refs.searchBtn?.$el) {
        return
      }

      // 排除分页
      if (e.target.parentElement.classList.contains("el-pagination__editor")) return

      let isModalVisible = false
      const modalList = document.querySelectorAll(".el-dialog__wrapper")
      Array.from(modalList).forEach((modal) => {
        if (!modal.style.display) {
          // 如果弹窗是可见的（不为 none 且在文档流中），设置标志为 true
          isModalVisible = true
        }
      })

      if (isModalVisible) {
        return // 如果有弹窗可见，则不处理键盘事件
      }

      e.preventDefault()
      e.stopPropagation()
      if (e.key === "Enter") {
        const selectList = document.querySelectorAll(".el-select")
        selectList.forEach((item) => {
          item.__vue__.visible = false
          item.__vue__.blur()
        })

        if (this.$refs.searchBtn) {
          this.$refs.searchBtn?.$el.click()
        }
      }
    },
    onsubmitSearch() {
      // alert(55);
      // this.searchChange();
    },

    menuIcon(value) {
      return this.menuType === "icon" ? "" : value
    },
    menuText(value) {
      return this.menuType === "text" ? "text" : value
    },
    closeDialog() {
      this.tableIndex = -1
      this.tableForm = {}
      this.boxVisible = false
      this.keyBtn = false
      this.hide()
    },
    cancelDisable() {
      this.keyBtn = false
    },
    columnIndexChange() {
      //设置隐藏
      var curCols = this.columnIndex
      this.tableOption.column.forEach((col) => {
        col.hide = curCols.indexOf(col.prop) < 0
      })

      this.saveColumnsOption(this.tableOption.column)
    },
    // 列改变回调
    headerDragend(newWidth, oldWidth, column, event) {
      this.tableOption.column.forEach((col) => {
        if (column.property == col.prop) {
          col.width = newWidth
          return false
        }
      })

      this.saveColumnsOption(this.tableOption.column)
    },
    saveColumnsOption(columns) {
      if (this.vaildData(this.tableOption.enableLocalStorage, true)) {
        let columnsDic = {}

        columns.forEach((col) => {
          let colProperty = {}
          let hasProperty = false
          if (col.width) {
            colProperty.width = col.width
            hasProperty = true
          }
          if (col.hide) {
            colProperty.hide = col.hide
            hasProperty = true
          }
          // 存贮列表排序字段
          if (col.sortIndex || col.sortIndex === 0) {
            colProperty.sortIndex = col.sortIndex
            hasProperty = true
          }
          // 存贮列表固定字段
          if (col.fixed) {
            colProperty.fixed = col.fixed
            hasProperty = true
          }
          if (hasProperty) {
            columnsDic[col.prop] = colProperty
          }
        })
        localStorage.setItem(this.localStorageKey, JSON.stringify(columnsDic))
      }
    },
    //清除表格本地样式
    clearLocalStorage() {
      this.$confirm("确定清除表格本地样式，恢复默认样式吗？")
        .then(() => {
          localStorage.removeItem(this.localStorageKey)
          window.location.reload()
        })
        .catch((res) => {
          console.log("res", res)
        })
    },
    selectClear() {
      this.tableSelectListAll = {}
      this.$refs.table?.clearSelection()
    },
    clearSort() {
      this.$refs.table.clearSort()
      // 高亮状态样式重置
      this.$refs.table.columns.forEach((item) => {
        item.order = ""
      })
    },
    clearFilter() {
      this.$refs.table.clearFilter()
    },
    indexMethod(index) {
      return index + 1 + ((this.defaultPage.currentPage || 1) - 1) * (this.defaultPage.pageSize || 10)
    },
    refreshChange() {
      this.$emit("refresh-change", {
        page: this.defaultPage,
        searchForm: deepCloneIgnoreNull(this.searchForm) //使用已确定的搜索条件deepCloneIgnoreNull(this.searchForm)   *** this.searchFormConfirm
      })
    },
    pageInit() {
      this.defaultPage.total = this.page.total || 0
      this.defaultPage.currentPage = this.page.currentPage || 1
      this.defaultPage.pageSize = this.page.pageSize || 10
      this.defaultPage.pageSizes = this.page.pageSizes || [10, 20, 30, 40, 50, 100, 200]
      this.defaultPage.background = this.page.background || true
    },
    rulesInit() {
      this.tableFormRules = {}
      this.columnOption.forEach((ele) => {
        if (ele.rules) this.tableFormRules[ele.prop] = ele.rules
      })
    },
    columnInit() {
      const safe = this
      this.columnIndex = []
      this.columnList = []

      function addChild(list) {
        list.forEach((ele, index) => {
          const children = ele.children
          if (!validatenull(children)) {
            safe.tableOption.columnBtn = false
            addChild(children)
          }
          if (validatenull(ele.hide) || !ele.hide) safe.columnIndex.push(ele.prop)
          if (ele.showClomnu !== false && !ele.hidden) {
            let obj = {
              label: ele.label,
              prop: ele.prop,
              index: index,
              fixed: ele.fixed
            }
            safe.columnList.push(safe.deepClone(obj))
          }
        })
      }
      addChild(this.columnOption)
    },
    formVal() {
      Object.keys(this.value).forEach((ele) => {
        this.tableForm[ele] = this.value[ele]
      })
      this.$emit("input", this.tableForm)
    },
    dataInit() {
      //初始化序号
      this.data.forEach((ele, index) => {
        ele.$index = index
        // 设置分页多选
        ele.$_id = ele.$_id ? ele.$_id : this.indexMethod(index)
      })
      if (this.data.length >= 200) {
        console.log("是否大于2000")
        this.batchDealData()
      } else {
        this.list = this.data
      }

      //初始化序号
      // this.list.forEach((ele, index) => {
      //   ele.$index = index
      //   // 设置分页多选
      //   ele.$_id = ele.$_id ? ele.$_id : this.indexMethod(index)
      // })
      // 是否动态计算列宽
      if (this.loadCalcColWidth || this.tableOption.calcColWidth) {
        console.time("calcColWidth")
        this.calcColWidth()
        console.timeEnd("calcColWidth")
      }
      this.loadCalcColWidth = false
    },
    batchDealData(batchSize = 100, delay = 600) {
      const totalDataLength = this.data.length

      // 根据 batchSize 分批处理数据
      const batches = []
      for (let i = 0; i < totalDataLength; i += batchSize) {
        batches.push(this.data.slice(i, i + batchSize))
      }

      let batchIndex = 0 // 当前处理的批次索引

      const processBatch = () => {
        if (batchIndex < batches.length) {
          const currentBatch = batches[batchIndex]

          if (batchIndex === 0) {
            this.list = [...currentBatch] // 第一次直接赋值
          } else {
            this.list = [...this.list, ...currentBatch] // 追加后续批次数据
          }

          batchIndex++

          if (batchIndex < batches.length) {
            // 在 delay 毫秒后处理下一批
            setTimeout(() => {
              this.$nextTick(() => {
                processBatch()
              })
            }, delay)
          } else {
            console.log("All batches processed.")
          }
        }
      }

      // 启动第一次批处理
      processBatch()
    },
    formInit() {
      this.defaultForm = this.formInitVal(this.columnOption)
      this.tableForm = this.deepClone(this.defaultForm.tableForm)
      this.searchForm = this.deepClone(this.defaultForm.searchForm)
      this.searchShow = this.vaildData(this.tableOption.searchShow, this.config.searchShow)
      this.formVal()
    },
    // 搜索清空
    searchReset() {
      this.$refs["searchForm"].resetFields()
      //搜索清空也不重置搜索条件this.searchFormConfirm={};
      this.$emit("search-reset")
      // this.$nextTick(() => {
      //   this.removeLabelShrink()
      // })
      // 清空条件后再掉一次搜索
      this.$nextTick(() => {
        this.searchChange()
      })
    },
    // 页大小回调
    sizeChange(val) {
      this.defaultPage.currentPage = 1
      this.defaultPage.pageSize = val
      this.$emit("on-load", this.defaultPage, this.searchFormConfirm /*deepCloneIgnoreNull(this.searchForm)*/)
      this.$emit("size-change", val)
      //this.toggleSelection(this.tableSelect);
      //页大小变化时，清空所有选择的内容
      // this.tableSelect=[];
      this.selectClear()
    },
    //日期组件回调
    dateChange(val) {
      this.$emit("date-change", val)
    },
    // 页码回调
    currentChange(val) {
      this.$emit("on-load", this.defaultPage, this.searchFormConfirm /*deepCloneIgnoreNull(this.searchForm)*/)
      this.$emit("current-change", val)
      this.updateSelection()
    },
    // 更新表格选中的行
    updateSelection() {
      this.$nextTick(() => {
        const tableSelectListAll = this.tableSelectListAll[this.defaultPage.currentPage] || []
        if (tableSelectListAll.length > 0) {
          this.rowSelectFlag = true
        }
        this.toggleSelection(tableSelectListAll)
      })
    },
    //设置单选
    currentRowChange(currentRow, oldCurrentRow) {
      this.$emit("current-row-change", currentRow, oldCurrentRow)
    },
    //设置多选选中
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row)
    },
    // 选中实例
    toggleSelection(rows, selected = true) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row, selected)
        })
      } else {
        this.selectClear()
      }
      this.rowSelectFlag = false
    },
    // 选择回调
    selectionChange(val) {
      // 解决触发 调用toggleRowSelection 自动触发selectionChange 问题
      if (this.rowSelectFlag) return
      // 合并行后，点击表格全选，返回的数据是未合并之前的，需要通过spanSelection方法根据不同的业务特殊处理
      const list = typeof this.spanSelection === "function" ? this.spanSelection(val) : val
      this.updateTableSelect(list)
      this.$emit("selection-change", this.tableSelect, Object.values(this.tableSelectListAll).flat()) //选中回调
    },
    selectRow(selection, row) {
      this.$emit("selection-row", selection, row)
    },
    selectAll(selection) {
      this.$emit("selection-all", selection)
    },
    // 更新tableSelect
    updateTableSelect(selection) {
      this.tableSelect = selection
      this.$set(this.tableSelectListAll, this.defaultPage.currentPage, selection)
    },
    // 排序回调
    sortChange(val) {
      this.defaultPage.currentPage = 1
      this.$emit("sort-change", val)
      this.selectClear()
    },

    // 搜索回调
    searchChange() {
      //搜索时页面自动回到第一页
      this.defaultPage.currentPage = 1
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.$emit("search-change", this.searchFormConfirm, this.defaultPage)
      this.selectClear()
    },
    // 行双击
    rowDblclick(row, event) {
      this.$emit("row-dblclick", row, event)
    },
    // 行单机
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column)
    },
    // 新增
    rowAdd(row = {}) {
      this.boxType = "add"
      this.tableForm = this.deepClone({ ...this.defaultForm.tableForm, ...row })
      this.clearDefaultParam()
      this.$emit("input", this.tableForm)
      this.show()
    },
    rowCell(row, index) {
      if (row.$cellEdit) this.rowCellUpdate(row, index)
      else this.rowCellEdit(row, index)
    },
    // 编辑
    rowEdit(row, index) {
      this.tableForm = this.deepClone(row)
      this.clearDefaultParam()
      this.$emit("input", this.tableForm)
      this.tableIndex = index
      this.boxType = "edit"
      this.show()
    },
    // 单元格编辑
    rowCellEdit(row, index) {
      row.$cellEdit = !row.$cellEdit
      this.$set(this.list, index, row)
    },
    //单元格更新
    rowCellUpdate(row, index) {
      asyncValidator(this.tableFormRules, row)
        .then((res) => {
          this.keyBtn = true
          this.$emit(
            "row-update",
            row,
            index,
            () => {
              row.$cellEdit = !row.$cellEdit
              this.$set(this.list, index, row)
            },
            () => {
              this.keyBtn = false
            }
          )
        })
        .catch((errors) => {
          this.$message.warning(errors[0])
        })
    },
    //查看
    rowView(row, index) {
      this.tableForm = this.deepClone(row)
      this.clearDefaultParam()
      this.$emit("input", this.tableForm)
      this.tableIndex = index
      this.boxType = "view"
      this.keyBtn = true
      this.show()
    },
    // 删除
    rowDel(row, index) {
      this.$emit("row-del", row, index)
    },
    // 保存
    rowSave() {
      this.$refs["tableForm"].validate((vaild) => {
        if (vaild) {
          this.keyBtn = true
          this.$emit("row-save", this.deepClone(this.tableForm), this.closeDialog, this.cancelDisable, () => {
            this.keyBtn = false
          })
        }
      })
    },
    // 更新
    rowUpdate() {
      this.$refs["tableForm"].validate((vaild) => {
        if (vaild) {
          this.keyBtn = true
          const index = this.tableIndex
          this.$emit("row-update", this.deepClone(this.tableForm), index, this.closeDialog, this.cancelDisable, () => {
            this.keyBtn = false
          })
        }
      })
    },
    // 显示表单
    show(cancel) {
      const callack = () => {
        if (cancel !== true) {
          this.boxVisible = true
          this.$nextTick(() => {
            this.$refs["tableForm"].cascadeInit()
            this.$refs["tableForm"].clearValidate()
          })
        }
      }
      if (typeof this.beforeOpen === "function") this.beforeOpen(callack, this.boxType)
      else callack()
    },
    // 隐藏表单
    hide(cancel) {
      const callack = () => {
        if (cancel !== false) {
          this.$refs["tableForm"].resetForm()
          this.$refs["tableForm"].clearValidate()
        }
      }
      if (typeof this.beforeClose === "function") this.beforeClose(callack, this.boxType)
      else callack()
    },
    //清空多余字段
    clearDefaultParam() {
      this.defaultParam.forEach((ele) => {
        delete this.tableForm[ele]
      })
    },
    //清空表单
    resetForm() {
      this.$refs["tableForm"].resetForm()
      this.$emit("input", this.tableForm)
    },
    //合并行
    tableSpanMethod(param) {
      if (typeof this.spanMethod === "function") return this.spanMethod(param)
    },
    //合集统计逻辑
    tableSummaryMethod(param) {
      //如果自己写逻辑则调用summaryMethod方法
      if (typeof this.summaryMethod === "function") return this.summaryMethod(param)
      const { columns, data } = param
      const sums = []
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          let currItem = this.sumColumnList.find((item) => item.name === column.property)
          if (index === 0) {
            sums[index] = this.tableOption.sumText || config.sumText
          } else if (currItem) {
            switch (currItem.type) {
              case "count":
                sums[index] = "计数:" + data.length
                break
              case "avg":
                let avgValues = data.map((item) => Number(item[column.property]))
                let nowindex = 1
                sums[index] = avgValues.reduce((perv, curr) => {
                  let value = Number(curr)
                  if (!isNaN(value)) {
                    return (perv + curr) / nowindex++
                  } else {
                    return perv
                  }
                }, 0)
                sums[index] = "平均:" + sums[index].toFixed(2)
                break
              case "sum":
                let values = data.map((item) => Number(item[column.property]))
                sums[index] = values.reduce((perv, curr) => {
                  let value = Number(curr)
                  if (!isNaN(value)) {
                    return perv + curr
                  } else {
                    return perv
                  }
                }, 0)
                sums[index] = "Σ:" + sums[index].toFixed(2)
                break
            }
          } else {
            sums[index] = "-"
          }
        })
      }
      return sums
    },
    getRowKeys: function (row) {
      if (row[this.rowKey]) {
        return row[this.rowKey]
      }
      return row.$_id
    },
    // 拖拽列触发
    onChangeTableCol(evt) {
      let obj = {}
      this.columnList.forEach((col, index) => {
        obj[col.prop] = index
      })

      this.tableOption.column.forEach((col) => {
        col.sortIndex = obj[col.prop]
      })
      this.tableOption.column.sort((a, b) => a.sortIndex - b.sortIndex)
      this.saveColumnsOption(this.tableOption.column)
    },
    // 锁定列
    handleColLock(item, index) {
      this.handleColLockAndUnlock(item, index, "left")
    },
    // 解锁列
    handleColUnLock(item, index) {
      this.handleColLockAndUnlock(item, index, null)
    },
    // 改变锁定、解锁列的值
    handleColLockAndUnlock(item, index, val) {
      // 在dialogDisable中的不允许锁定解锁
      if (this.option.dialogDisable && this.option.dialogDisable.includes(item.index)) return
      this.$set(this.columnList[index], "fixed", val)
      this.tableOption.column.forEach((col) => {
        if (item.prop === col.prop) {
          col.fixed = val
        }
      })
      this.saveColumnsOption(this.tableOption.column)
    },
    openSearchAdvanced() {
      this.searchAdvamcedShow = !this.searchAdvamcedShow
      // this.searchAdvamcedShow && this.setSearchLabel(".avue-crud__searchAdvanced")
    },
    doLayout() {
      this.$refs.table?.doLayout()
    }
  }
})
</script>
<style lang="scss" scoped>
.avue-crud_mg {
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-right: 10px;
  height: 100%;
  // min-width: 210px;
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
::v-deep .avue-crud__right {
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}

.com-contents {
  display: block;
  padding: 0;
  margin: 0;
  // 兼容
  display: contents;
}
::v-deep .avue-crud__left {
  width: calc(100% - 200px);
  .avue-slot-search {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0px !important;
    @extend .com-contents;
    > div {
      &::before {
        display: none;
      }
      &::after {
        display: none;
      }

      @extend .com-contents;
      > .el-form {
        @extend .com-contents;
      }
    }
    > div > .el-form {
      float: none !important;
    }
    > form > .el-form-item:last-child {
      float: none;
    }
  }
  // .el-form-item {
  //   margin-top: 5px;
  // }
  .el-button {
    padding: 5px 0 0 0;
  }
}

.lock-wrapper {
  color: var(--primary-color);
  display: inline-flex;
  border: 1px solid var(--primary-color);
  padding: 2px;
  border-radius: 50%;
  font-size: 12px;
}
.has-lock {
  color: #909399;
  border: 1px solid #909399;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
  .lock-wrapper {
    color: #c0c4cc;
    border: 1px solid #c0c4cc;
  }
}
</style>
