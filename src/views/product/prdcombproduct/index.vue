<template>
  <div id="combproduct">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="data"
        :option="tableOption"
        @search-change="handleSubmit"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button @click="addCombPrd" type="primary" size="small">新增</el-button>
          <el-button @click="editCombPrd" type="primary" size="small">编辑</el-button>
          <el-button @click="auditCombPrd" type="primary" size="small">审核</el-button>
          <el-button @click="setStatusShow" type="primary" size="small">设置销售状态</el-button>
          <el-button @click="importData" type="primary" size="small">导入</el-button>
        </template>
        <template slot="search">
          <el-form-item prop="code">
            <el-input v-model="searchForm.code" size="small" placeholder="组合商品编码" clearable></el-input>
          </el-form-item>
          <el-form-item class="rig-ali" prop="name">
            <el-input v-model="searchForm.name" size="small" placeholder="组合商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item class="rig-ali" prop="skuCode">
            <el-input v-model="searchForm.skuCode" size="small" placeholder="被组合商品SKU" clearable></el-input>
          </el-form-item>
          <el-form-item prop="saleStatus">
            <el-select v-model="searchForm.saleStatus" size="small" placeholder="销售状态" clearable>
              <el-option
                v-for="item in saleStatusOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="checkStatus">
            <el-select v-model="searchForm.checkStatus" size="small" placeholder="审核状态" clearable>
              <el-option
                v-for="item in checkStatusOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="code" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              :to="'/product/prdcombproduct/detail?id=' + scope.row.id + '&type=detail'"
              :title="scope.row.code"
              >{{ scope.row.code }}</router-link
            >
          </copy-text>
        </template>
      </avue-crud>
      <!-- 设置销售状态 -->
      <el-dialog
        title="设置销售状态"
        :visible.sync="setStatusDialog"
        width="35%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :data="statusData" ref="status">
          <el-form-item
            label="销售状态:"
            prop="saleStatus"
            :rules="[{ required: true, message: '请先选择销售状态', trigger: 'blur' }]"
          >
            <el-select v-model="statusData.saleStatus" size="small" placeholder="销售状态" clearable>
              <el-option
                v-for="item in saleStatusOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="setStatusDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="setStatus">提 交</el-button>
        </span>
      </el-dialog>

      <commonImport
        ref="commonImport"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        @import="importExcelBtn"
      >
      </commonImport>

      <el-dialog
        title="提示"
        :visible.sync="dialogStatus"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="40%"
        :before-close="closeDialog"
      >
        <el-table :data="failList" :border="true" :max-height="400" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"> </el-table-column>
          <el-table-column prop="code" label="组合商品编码" width="110px"></el-table-column>
          <el-table-column prop="errorMsg" label="错误信息"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="closeDialog">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { tableOption } from "../../../const/crud/product/prdcombproduct"
import { fetchList, auditBundle, batchSales, batchImportBundle } from "@/api/product/prdcombproduct"
import { getObjByType } from "@/api/admin/dict"
import { mapGetters } from "vuex"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "../../../components/avue/utils/util"
import commonImport from "@/views/cockpit/commonImport"

export default {
  name: "prdcombproduct",
  data() {
    return {
      data: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      searchForm: {
        //搜索条件
        code: "",
        name: "", //产品名称
        skuCode: "",
        saleStatus: "",
        checkStatus: ""
      },
      searchFormConfirm: {}, //确定的搜索条件
      selectRows: [],
      saleStatusOption: [
        { label: "在售", value: "ON_SALE" },
        { label: "停售", value: "STOP_SALE" }
      ],
      checkStatusOption: [
        { label: "待审核", value: "WAIT_REVIEW" },
        { label: "审核通过", value: "PASS" },
        { label: "驳回", value: "REJECT" }
      ],
      setStatusDialog: false,
      statusData: {
        saleStatus: "ON_SALE"
      },
      excelDangerStatus: false,
      downloadUrl: "/product/bundle/downloadImportBundleTemplate",
      fileSuffix: ".xlsx",
      failList: [],
      dialogStatus: false
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },

  created() {},
  activated() {
    this.refreshChange()
  },
  mounted() {
    this.getList(this.page, this.searchFormConfirm)
  },
  methods: {
    importData() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        var _this = this
        this.loading = true
        let formdata = new FormData()
        formdata.append("file", file.raw)
        batchImportBundle(formdata).then((res) => {
          _this.loading = false
          if (res.data.code == 0) {
            _this.$message.success("导入成功")
            _this.$refs.commonImport.syncFn()
            this.getList(this.page, this.searchFormConfirm)
          } else if (res.data.code == 1) {
            _this.$message.warning(res.data.msg)
            this.failList = res.data.data
            this.dialogStatus = true
          } else {
            _this.$message.error("导入失败")
          }
          _this.$refs.commonImport.closeFullScreen()
        })
      }
    },
    closeDialog() {
      this.dialogStatus = false
    },
    addCombPrd() {
      this.$router.push({
        path: "/product/prdcombproduct/create",
        query: { type: "create" }
      })
    },
    editCombPrd() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请先勾选需要编辑的单据")
        return
      }
      if (this.selectRows.length > 1) {
        this.$message.error("只能编辑一条单据")
        return
      }
      let isStatus = this.selectRows.every((item) => item.checkStatus == "审核通过")
      console.log(isStatus)
      if (isStatus) {
        this.$message.warning("已选中的商品已审核通过,无法编辑")
        return
      }
      let id = this.selectRows.map((item) => item.id)
      this.$router.push({
        path: "/product/prdcombproduct/edit",
        query: { id, type: "edit" }
      })
    },
    auditCombPrd() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请先勾选需要审核的单据")
        return
      }
      let isStatus = this.selectRows.every((item) => item.checkStatus == "审核通过")
      console.log(isStatus)
      if (isStatus) {
        this.$message.warning("请勾选未审核的单据")
        return
      }
      let ids = this.selectRows.map((item) => item.id)
      let params = {
        ids: ids,
        checkStatus: "PASS",
        checkRemark: ""
      }
      auditBundle(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
          this.refreshChange()
        }
      })
    },
    setStatusShow() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.error("请先勾选需要操作的单据")
        return
      }
      this.setStatusDialog = true
    },
    setStatus() {
      let ids = this.selectRows.map((item) => item.id)
      batchSales({ ids, saleStatus: this.statusData.saleStatus }).then((res) => {
        if (res.data.code == 0) {
          this.$message.success("操作成功")
          this.setStatusDialog = false
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
          this.setStatusDialog = false
          this.refreshChange()
        }
      })
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    sizeChange(val) {
      //切换每页显示数量
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
    },
    getList(page, params) {
      //查询请求
      let pages = {
        page: page.currentPage,
        pageSize: page.pageSize
      }
      fetchList({ ...pages, ...params }).then((res) => {
        if (res.data.code === 0) {
          let data_res = res.data.data
          console.log("resdata", data_res)
          let records = data_res.records || []
          this.data = records
          console.log("列表数据", this.data)
          this.page.total = data_res.total
          this.page.pageSize = data_res.size
          this.page.currentPage = data_res.current
        }
      })
    },
    refreshChange() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
      this.getList(this.page, this.searchFormConfirm)
      // console.log("点击刷新", this.page);
    },
    handleSubmit(val) {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
      this.clearSelectClear()
    },
    selectionChange(data) {
      this.selectRows = data
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    verification() {
      //验证是否全部为空
      let str = ""
      for (let name in this.archivesForm) {
        str += this.archivesForm[name].replace(/\s/g, "")
      }
      if (str.length < 1) {
        this.$message.error("查询条件不能全部为空")
        return false
      } else {
        return true
      }
    },
    searchReset() {
      this.searchFormConfirm = {}
      this.searchForm = {}
    }
  },
  components: {
    commonImport
  }
}
</script>
<style lang="scss" scoped>
.mini-img {
  height: 40px;
  width: 80px;
  object-fit: cover;
}

.big-img {
  height: 300px;
  width: 300px;
  object-fit: cover;
}
</style>
