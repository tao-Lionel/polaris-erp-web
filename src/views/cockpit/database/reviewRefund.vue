<template>
  <div
    class="execution"
    id="skufee"
    v-loading="loading"
    element-loading-text="提交中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <!-- 按钮 -->
        <template slot-scope="scope" slot="menuLeft">
          <!-- <el-button  v-if="permissions.cusDeclare_declare_customs" type="primary" size="small" @click="showDeclareAtCustoms">更换SKU</el-button> -->
          <el-upload
            class="upload-inq inline-class"
            ref="upload"
            accept=".xls,.xlsx"
            action="String"
            :auto-upload="false"
            :on-change="signFileChange"
            :show-file-list="false"
          >
            <el-button type="primary" size="small">导 入</el-button>
          </el-upload>
        </template>

        <!-- 搜索1 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="s1" label="账号">
              <el-select clearable v-model="searchForm.s1" size="small" placeholder="请选择">
                <el-option
                  v-for="item in account"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="s2" label="站点">
              <el-select clearable v-model="searchForm.s2" size="small" placeholder="请选择">
                <el-option
                  v-for="item in account"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="s3" label="Sellersku">
              <el-input
                v-model="searchForm.s3"
                size="small"
                placeholder="请输入Sellersku检索"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <!-- 搜索2 -->
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="s4" label="SKU">
              <el-input v-model="searchForm.s4" size="small" placeholder="请输入SKU检索" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="s5" label="返款日期">
              <el-date-picker
                size="small"
                v-model="searchForm.s5"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="s6" label="事业部">
              <el-select clearable v-model="searchForm.s6" size="small" placeholder="请选择">
                <el-option
                  v-for="item in account"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="s7" label="销售组">
              <el-select clearable v-model="searchForm.s7" size="small" placeholder="请选择">
                <el-option
                  v-for="item in account"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { getTradeReportList } from "@/api/cockpit/database/tradereport"
import { tableOption } from "@/const/crud/cockpit/database/reviewRefund"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
export default {
  name: "tradereport",
  components: {},
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchFormConfirm: {},
      searchForm: {},
      tableLoading: false,
      tableOption: tableOption,
      selectRows: [],
      tableData: [],
      account: [
        { value: 1, label: "A1" },
        { value: 2, label: "A2" }
      ],
      form: {},
      loading: false,
      tabPositionModel: "0"
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    refreshChange(params) {
      this.getList(this.page, params)
    },
    getList(page, params) {
      this.tableLoading = true
      getTradeReportList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      )
        .then((response) => {
          this.tableData = response.data.records
          this.page.total = response.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      if (file.name.split(".")[1] != "xls" && file.name.split(".")[1] != "xlsx") {
        this.$message.warning("请选EXCEL文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 30) {
        this.$message.warning("文件文件限制为30M以内!!")
        return
      }
    }
  }
}
</script>

<style lang="scss">
@import "./reviewRefund.scss";
</style>
