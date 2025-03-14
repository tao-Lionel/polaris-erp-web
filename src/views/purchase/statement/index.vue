<template>
  <div class="contract">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        class="handle-cell-hidden"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="delRows" size="small" v-if="permissions.finance_statement_del"
            >删除</el-button
          >
          <el-button
            type="primary"
            @click="changStatus('submit')"
            v-if="permissions.finance_statement_submit"
            size="small"
            >提交</el-button
          >
          <el-button
            type="primary"
            @click="changStatus('antiSubmit')"
            v-if="permissions.finance_statement_antiSubmit"
            size="small"
            >撤销提交</el-button
          >
          <el-button
            type="primary"
            @click="changStatus('procurementReview')"
            v-if="permissions.finance_statement_procurementReview"
            size="small"
            >采购审核</el-button
          >
          <el-button
            type="primary"
            @click="changStatus('antiProcurementReview')"
            v-if="permissions.finance_statement_antiProcurementReview"
            size="small"
            >采购反审核</el-button
          >
          <el-button
            type="primary"
            @click="changStatus('financialReview')"
            v-if="permissions.finance_statement_financialReview"
            size="small"
            >财务审核</el-button
          >
          <el-button type="primary" size="small" @click="downLoadFile()">下载</el-button>
        </template>
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm">
            <el-form-item class="form-label" prop="statementTime">
              <el-date-picker
                size="small"
                v-model="searchForm.statementTime"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="statementNo">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.statementNo"
                placeholder="对账编号"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="statementStatus">
              <el-select
                multiple
                collapse-tags
                v-model="searchForm.statementStatus"
                size="small"
                placeholder="对账状态"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance" @submit.native.prevent>
            <el-form-item label="" prop="corporationId">
              <el-select v-model="searchForm.corporationId" size="small" clearable placeholder="法人主体">
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierNo" label="">
              <el-select v-model="searchForm.supplierNo" size="small" filterable clearable placeholder="供应商">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ifReplyDocument" label="">
              <el-select v-model="searchForm.ifReplyDocument" size="small" placeholder="是否有附件">
                <el-option
                  v-for="item in ifAttachOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="createByName" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.createByName"
                placeholder="制单员"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>

            <el-form-item prop="currency" label="">
              <el-select filterable v-model="searchForm.currency" size="small" placeholder="币种">
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.skuCode"
                placeholder="SKU"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="cabinetCode" label="">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.cabinetCode"
                placeholder="排柜号"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>

            <!-- <el-button native-type="submit" @click="searchChange" v-show="false"></el-button> -->
          </el-form>
        </template>
        <template slot="statementNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link :to="'/transaction/statementDetail/detail?statementNo=' + scope.row.statementNo">
              {{ scope.row.statementNo }}</router-link
            >
          </copy-text>
        </template>

        <template slot="purchaseOrderNos" slot-scope="scope">
          <span>{{ scope.row.purchaseOrderNos.join(",") }}</span>
        </template>

        <template slot="existSupplierCertification" slot-scope="scope">
          <i class="icon-shangchuan y-icon-edit" @click="uploadContractV2(scope.row)"></i>
          <i
            v-if="scope.row.replyDocumentUrl != '' && scope.row.replyDocumentUrl != null"
            class="icon-chakan y-reviews"
            @click="preViewMethods(scope.row.replyDocumentUrl)"
          ></i>
          <i
            v-if="scope.row.replyDocumentUrl != '' && scope.row.replyDocumentUrl != null"
            class="icon-xiazai y-reviews"
            @click="download(scope.row.replyDocumentUrl)"
          ></i>
        </template>

        <template slot="purchaseOrderNo" slot-scope="scope">
          <router-link
            :to="'/orderUpdate/index?purchaseOrderNo=' + scope.row.purchaseOrderNo"
            :title="scope.row.purchaseOrderNo"
            >{{ scope.row.purchaseOrderNo }}</router-link
          >
        </template>
      </avue-crud>

      <el-dialog
        v-resize-dialog
        class="dialog-wrapper"
        title="上传文件"
        :visible.sync="contractDialog"
        width="55%"
        @close="cleanContract"
      >
        <el-upload
          class="upload-inq inline-class"
          :class="{ 'is-dot': haveContract }"
          ref="upload"
          accept="application/pdf"
          action="String"
          :auto-upload="false"
          :on-change="signFileChange"
          :show-file-list="false"
          list-type="text"
        >
          <el-button size="small" type="primary">点击上传回签件</el-button>
          <avue-crud-input hidden v-model="haveContract" style="display: none" />
        </el-upload>
        <p style="margin: 5px 0 0 8px">{{ attachmentFileName }}</p>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="confrimUploadV2">保 存</el-button>
        </span>
      </el-dialog>

      <!-- 财务审核 -->
      <el-dialog title="财务审核" :visible.sync="auditDialog" width="30%">
        <el-input
          type="textarea"
          :rows="5"
          :maxlength="100"
          placeholder="请填写拒绝原因，不得超过100个字符。拒绝，必填"
          v-model="auditTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="financialOperateBatch(1)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="financialOperateBatch(0)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>

      <!-- 查看图片 -->
      <imgdialog ref="imgdialog"></imgdialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  deleteStatement,
  changeStatementStatus,
  uploadReplyDocument,
  updateContractUrl
  // financialOperateBatch
} from "@/api/purchase/statement"
import { uploadImgAndPdf, previewImgAndPdf, downloadImgAndPdf } from "@/api/purchase/inquiryorder/poinquiryorder"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { limitFilesMaxSize } from "@/util/tool"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { tableOption } from "@/const/crud/purchase/statement"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getTokenUrlFile, getTokenUrl } from "@/util/auth"
import operationlog from "@/views/purchase/log/index"
import imgdialog from "./imgDialog"
export default {
  name: "pocontract",
  data() {
    return {
      purchaseOrderNoData: [],
      delPicIdList: [],
      statementNo: "",
      picAttachType: "",
      dialogImageUrl: "",
      contractList: [],
      picVisible: false,
      contractDialog: false,
      currencyOptions: [],
      statusOptions: [
        {
          value: "-1",
          label: "无效"
        },
        {
          value: "0",
          label: "待提交"
        },
        {
          value: "1",
          label: "待采购审核"
        },
        {
          value: "2",
          label: "待财务审核"
        },
        {
          value: "3",
          label: "审核完成"
        }
      ],

      fileList: [],
      selectRows: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        statementNo: "",
        corporationId: "",
        supplierNo: "",
        currency: "",
        ifAttachOptions: "",
        statementStatus: "",
        statementTime: [],
        ifReplyDocument: "",
        createByName: "",
        skuCode: "",
        cabinetCode: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      imageData: "",
      pdfData: "",
      haveContract: "",
      attachmentFileName: "未选择任何文件",
      auditDialog: false,
      auditTextarea: "",
      corporationOptions: [],
      supplierOptions: [],
      ifAttachOptions: [
        {
          value: "0",
          label: "有"
        },
        {
          value: "1",
          label: "无"
        }
      ]
    }
  },
  created() {
    //获取币别下拉列表
    getAll().then((response) => {
      response.data.data.forEach((item) => {
        if (response.data.code == 0) {
          this.currencyOptions.push({
            value: item.currency,
            label: item.currency
          })
        }
      })
    })
    getCorporationList().then((response) => {
      var data = response.data.data
      if (data && data.length > 0) {
        this.corporationOptions = data
      }
    })
    getAllSupplier().then((res) => {
      if (res.data.code === 0) {
        res.data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    imgdialog,
    operationlog
  },
  methods: {
    financialOperateBatch(type) {
      if (type == 1) {
        if (!this.rejectMsg) {
          this.$message.warning("拒绝必须填写理由!")
          return
        }
      }
      let params = []
      this.selectRows.forEach((item) => {
        params.push({
          contractNo: item.poContractNo,
          rejectMsg: this.auditTextarea,
          type: type
        })
      })
      // let contractNo = this.selectRows.map(item => item.poContractNo).join(',')
      // let params = {
      //   contractNo: contractNo,
      //   rejectMsg: this.auditTextarea,
      //   type: type
      // }
      // financialOperateBatch(params).then((res) => {
      //   console.log(res)
      //   if (res.data.code === 0) {
      //     this.$message.success("操作成功")
      //     this.refreshChange()
      //     this.auditDialog = false
      //   } else {
      //     this.$message.error(res.data.msg)
      //     this.refreshChange()
      //     this.auditDialog = false
      //   }
      // })
    },
    //关闭弹框清空
    cleanContract() {
      this.contractList = []
      this.delPicIdList = []
      this.attachmentFileName = ""
      this.haveContract = ""
    },

    //确认上传V2
    confrimUploadV2() {
      console.log(this.haveContract)
      if (!this.haveContract) {
        this.$message.error("必须上传文件")
        return
      }
      const params = {
        statementNo: this.statementNo,
        url: this.haveContract
      }
      uploadReplyDocument(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("回签件保存成功")
          this.attachmentFileName = ""
          this.contractDialog = false
          this.refreshChange()
        }
      })
    },

    uploadContractV2(row) {
      this.statementNo = row.statementNo
      // this.haveContract = row.contractUrl
      this.contractDialog = true
    },
    //修改状态
    changStatus(type) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      // if (this.selectRows.length > 1) {
      //   this.$message.warning("只能勾选一条数据！")
      //   return
      // }

      const params = {
        statementNos: this.selectRows.map((item) => item.statementNo),
        order: type
      }

      changeStatementStatus(params).then((response) => {
        if (response.data.code == 0) {
          // 手动调用清除选择
          this.$refs.crud.selectClear()
          this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("修改失败")
          return
        }
      })
    },
    //删除按钮
    delRows() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作！")
        return
      }
      // if (this.selectRows.length > 1) {
      //   this.$message.warning("只能勾选一条数据！")
      //   return
      // }

      this.$confirm("此操作将删除选中的对账单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStatement({ statementNos: this.selectRows.map((item) => item.statementNo) }).then((response) => {
            if (response.data.code == 0) {
              // 手动调用清除选择
              this.$refs.crud.selectClear()
              this.getList(this.page, this.searchFormConfirm)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    getList(page, params) {
      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      page = page
        ? page
        : {
            currentPage: 1
          }
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //下载文件
    downLoadFile() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      // if (this.selectRows.length > 1) {
      //   this.$message.warning("只能勾选一条数据！")
      //   return
      // }

      const status2 = this.selectRows.some((item) => item.statementStatus !== 3)
      if (status2) {
        this.$message.warning("勾选的合同中存在未审核完成的合同！")
        return
      }

      this.downloadUrl = getTokenUrlFile(
        "/api/finance/internalSupplierStatement/downloadStatement?statementNos=" +
          this.selectRows.map((item) => item.statementNo)
      )

      window.location.href = this.downloadUrl
      this.$message.success("下载成功!")
    },

    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }

      const fileType = [
        // 'image/jpeg',
        // 'image/png',
        // 'image/jpg',
        "application/pdf"
      ]
      const status = fileType.some((item) => item === file.raw.type)
      if (!status) {
        this.$message.warning("请选择PDF文件")
        return
      }
      this.attachmentFileName = file.name

      let formdata = new FormData()
      formdata.append("applicationName", "")
      formdata.append("file", file.raw)

      uploadImgAndPdf(formdata)
        .then((res) => {
          if (res.data.code == 0) {
            this.haveContract = res.data.data.id
            // this.inquiryForm.fileName = file.name
            this.imageData = ""
            this.pdfData = ""
            this.$message.success("上传成功")
          } else if (res.data.code == 1) {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("上传失败")
          return
        })
    },
    // 下载
    download(url) {
      if (!url) {
        this.$message.warning("未上传文件")
        return
      }
      downloadImgAndPdf({ fileId: url }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const filename = res.headers["content-disposition"].split("=")[1]
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        this.$message.success("下载成功")
      })
    },
    //预览
    preViewMethods(id) {
      console.log(123)
      if (!id) {
        this.$message.warning("未上传文件")
        return
      }
      // if (this.imageData) {
      //   this.$refs.imgdialog.showImgUrl(this.imageData)
      //   return
      // }
      // if (this.pdfData) {
      //   window.open(this.pdfData)
      //   return
      // }
      previewImgAndPdf({ fileId: id }).then((res) => {
        console.log(res.data, 111)
        if (res.data.type === "application/pdf") {
          const blob = new Blob([res.data], { type: "application/pdf" })
          this.pdfData = URL.createObjectURL(blob)
          window.open(this.pdfData)
        } else {
          const href = window.URL.createObjectURL(res.data)
          this.imageData = href
          this.$refs.imgdialog.showImgUrl(href)
        }
      })
    },

    myFixed(value) {
      // debugger;
      if (this.isNulls(value)) {
        return
      }
      return (parseFloat(value) + 0.0).toFixed(2)
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.contract {
  .upload-demo {
    display: inline-block;
  }

  .upload-view {
    display: inline-block;
    padding-left: 10px;
  }

  .el-upload-list--text {
    display: none;
  }

  .grid-data {
    li {
      display: inline-block;
      width: 45%;
      text-align: center;
    }
  }

  .avue-crud__menu {
    overflow: initial;
  }

  .dialog-wrapper {
    .el-dialog__body {
      max-height: 500px;
      overflow-y: scroll;
    }
  }

  .is-dot::before {
    display: block;
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    overflow: hidden;
    background: #f56c6c;
    position: absolute;
    top: 8px;
    right: 0;
  }
}

.purchase-l {
  border-bottom: 1px solid #ebeef5;
  line-height: 32px;
}
</style>
