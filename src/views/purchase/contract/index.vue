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
          <el-button type="primary" v-if="permissions.contract_del" @click="delRows" size="small">删除</el-button>
          <el-button type="primary" v-if="permissions.contract_approve" @click="changStatus(0)" size="small"
            >提交审核</el-button
          >
          <el-button type="primary" v-if="permissions.contract_approve" @click="changStatus(1)" size="small"
            >撤销提交</el-button
          >
          <el-button type="primary" v-if="permissions.contract_financial_approve" @click="approve" size="small"
            >财务审核</el-button
          >
          <el-button type="primary" size="small" v-if="permissions.contract_download" @click="downLoadFile()">
            下载
          </el-button>
          <el-button type="primary" size="small" @click="handleBatchUpload()"> 批量上传 </el-button>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item class="form-label" prop="searchDate">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="合同开始日期"
                end-placeholder="合同结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.poContractNo"
                placeholder="合同编号,支持多个"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                multiple
                collapse-tags
                v-model="searchForm.status"
                size="small"
                placeholder="合同状态"
                clearable
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <avue-crud-input
                clearable
                v-model="searchForm.purchaseOrderNo"
                placeholder="采购单号"
                size="small"
                class="searchInput"
              ></avue-crud-input>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance" @submit.native.prevent>
            <el-form-item prop="supplierName">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationName">
              <el-select v-model="searchForm.corporationName" size="small" placeholder="法人主体" filterable>
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationName"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="settleaccountTypeName">
              <el-select v-model="searchForm.settleaccountTypeName" size="small" placeholder="结算方式" filterable>
                <el-option
                  v-for="item in settleaccountTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="currency">
              <el-select
                multiple
                filterable
                collapse-tags
                v-model="searchForm.currency"
                size="small"
                placeholder="币别"
                clearable
              >
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="delFlag">
              <el-select v-model="searchForm.delFlag" size="small" placeholder="合同有效性" clearable>
                <el-option
                  v-for="item in delFlagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.skuCode"
                placeholder="SKU"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="spuCode">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.spuCode"
                placeholder="SPU"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="ifAttach">
              <el-select v-model="searchForm.ifAttach" size="small" placeholder="是否有附件" clearable>
                <el-option
                  v-for="item in ifAttachOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseName">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.purchaseName"
                placeholder="采购员"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-button native-type="submit" @click="searchChange" v-show="false"></el-button>
          </el-form>
        </template>
        <template slot="poContractNo" slot-scope="scope">
          <span v-if="scope.row.delFlag == 0">
            <copy-text hoverToShow>
              <router-link
                :to="'/showNonTaxContractPic/index?paramcontractNo=' + scope.row.poContractNo"
                :title="scope.row.poContractNo"
                >{{ scope.row.poContractNo }}</router-link
              >
            </copy-text>
          </span>
          <span v-if="scope.row.delFlag == 1">{{ scope.row.poContractNo }}</span>
        </template>

        <template slot="amount" slot-scope="scope">
          <span v-if="scope.row.delFlag == 0">
            <a @click="showInAndOutStockInfo(scope.row.poContractNo)">
              {{ myFixed(scope.row.amount) }}
            </a>
          </span>
          <span v-if="scope.row.delFlag == 1">{{ myFixed(scope.row.amount) }}</span>
        </template>

        <template slot="existSupplierCertification" slot-scope="scope">
          <i class="icon-shangchuan y-icon-edit" @click="uploadContractV2(scope.row)"></i>
          <i
            v-if="scope.row.contractUrl != '' && scope.row.contractUrl != null"
            class="icon-chakan y-reviews"
            @click="preViewMethods(scope.row.contractUrl)"
          ></i>
          <i
            v-if="scope.row.contractUrl != '' && scope.row.contractUrl != null"
            class="icon-xiazai y-reviews"
            @click="download(scope.row.contractUrl)"
          ></i>
        </template>

        <template slot="purchaseOrderNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="'/orderUpdate/index?purchaseOrderNo=' + scope.row.purchaseOrderNo"
              :title="scope.row.purchaseOrderNo"
              >{{ scope.row.purchaseOrderNo }}</router-link
            >
          </copy-text>
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.poContractNo)">{{ formatData(scope.row.status) }}</a>
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

      <!-- 库存明细 -->
      <el-dialog v-resize-dialog title="库存详情" :visible.sync="inAndOutStockInfoDialog">
        <avue-crud :data="inAndOutStockInfoData" :option="inAndOutStockInfoDialogOption"> </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="inAndOutStockInfoDialog = false" size="small">关闭</el-button>
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
          <el-button type="info" size="small" @click="financialOperateBatch(0)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="financialOperateBatch(1)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>

      <!-- 查看图片 -->
      <imgdialog ref="imgdialog"></imgdialog>

      <batchUploadContract ref="batchUploadContractRef" @updateList="updateList"></batchUploadContract>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  delRows,
  changStatus,
  uploadFile,
  getSettleaccountTypeOptions,
  showInAndOutStockInfo,
  updateContractUrl,
  financialOperateBatch,
  batchFinancialOperateV2Api
} from "@/api/purchase/contract/pocontract"
import { uploadImgAndPdf, previewImgAndPdf, downloadImgAndPdf } from "@/api/purchase/inquiryorder/poinquiryorder"
import { limitFilesMaxSize } from "@/util/tool"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { tableOption, inAndOutStockInfoDialogOption } from "@/const/crud/purchase/contract/pocontract"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { getTokenUrlFile } from "@/util/auth"
import operationlog from "@/views/purchase/log/index"
import imgdialog from "./imgDialog"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import batchUploadContract from "./batchUploadContract.vue"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

export default {
  name: "pocontract",
  components: {
    imgdialog,
    operationlog,
    batchUploadContract
  },
  data() {
    return {
      inAndOutStockInfoDialogOption: inAndOutStockInfoDialogOption,
      inAndOutStockInfoDialog: false,
      inAndOutStockInfoData: [],
      delPicIdList: [],
      picContractNo: "",
      picAttachType: "",
      contractList: [],
      contractDialog: false,
      currencyOptions: [],
      statusOptions: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "财务审核"
        },
        {
          value: "2",
          label: "审核通过"
        }
      ],
      delFlagOptions: [
        {
          value: "0",
          label: "有效"
        },
        {
          value: "1",
          label: "无效"
        }
      ],
      ifAttachOptions: [
        {
          value: "0",
          label: "有"
        },
        {
          value: "1",
          label: "无"
        }
      ],

      settleaccountTypeOptions: [],
      selectRows: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        poContractNo: "", //合同编号
        supplierName: "", //供应商
        searchDate: "",
        invoiceNo: "",
        status: "",
        corporationName: "",
        settleaccountTypeId: "",
        currency: "",
        delFlag: "",
        ifAttach: "",
        skuCode: "",
        spuCode: "",
        purchaseName: "",
        settleaccountTypeName: ""
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
      supplierOptions: [],
      corporationList: []
    }
  },
  created() {
    //获取结算方式下拉列表
    getSettleaccountTypeOptions().then((response) => {
      if (response.data.code == 0) {
        response.data.data.forEach((item) => {
          this.settleaccountTypeOptions.push({
            value: item.settleaccountTypeId,
            label: item.settleaccountName
          })
        })
      }
    })
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
    this.getSupplierAll()
    this.getCorporation()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    financialOperateBatch(type) {
      if (type === 0) {
        if (!this.auditTextarea) {
          this.$message.warning("拒绝必须填写理由!")
          return
        }
      }
      let params = []
      this.selectRows.forEach((item) => {
        params.push({
          code: item.poContractNo,
          success: type,
          error: this.auditTextarea
          // contractNo: item.poContractNo,
          // rejectMsg: this.auditTextarea,
          // type: type
        })
      })
      batchFinancialOperateV2Api(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.$refs.crud.selectClear()
          this.refreshChange()
          this.auditDialog = false
        } else {
          this.$message.error(res.data.msg)
          this.$refs.crud.selectClear()
          this.refreshChange()
          this.auditDialog = false
        }
      })

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
    modifySupplier(val) {
      this.searchForm.supplierName = val.replace(/,/g, " ")
      console.log(this.searchForm.supplierName)
      if (this.searchForm.supplierName.indexOf("BEAUTIFUL") !== -1) {
        this.searchForm.supplierName = this.searchForm.supplierName.replace(".", ".,")
      }
    },
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "财务审核",
        2: "审核通过"
      }
      return obj[id]
    },
    // 查看库存信息
    showInAndOutStockInfo(poContractNo) {
      showInAndOutStockInfo({ contractNo: poContractNo }).then(({ data }) => {
        console.info(data.data)
        if (data.code == 0) {
          if (data.data.length > 0) {
            this.inAndOutStockInfoDialog = true
            this.inAndOutStockInfoData = data.data
          } else {
            this.$message.info("未查询到出入库明细信息")
            return
          }
        } else {
          this.$message.error("查询采购明细失败")
          return
        }
      })
    },
    // 查看日志
    showOperateLog(poContractNo) {
      // if (poContractNo.indexOf("-") > -1) {
      //   poContractNo = poContractNo.substring(0, poContractNo.lastIndexOf("-"))
      // }
      console.info(poContractNo)
      this.$refs.operationlog.showOperateLogDialog(poContractNo, 11)
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
        poContractNo: this.picContractNo,
        contractUrl: this.haveContract
      }
      updateContractUrl(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("回签件保存成功")
          this.attachmentFileName = ""
        }
      })
      this.contractDialog = false
      this.refreshChange()
    },

    //确认上传
    confrimUpload() {
      if (!this.delPicIdList.length > 0) {
        if (!this.contractList.length > 0) {
          this.$message.error("必须至少上传一张图片")
          return
        }
      }
      let limitFlag = limitFilesMaxSize(this.contractList)
      if (!limitFlag) {
        this.$message.error("上传图片总大小不得超过20M!!")
        return
      }

      var formData = new FormData()
      this.contractList.forEach((file) => {
        if (file.picId) {
          //picId.push(file.picId);
        } else {
          formData.append("files", file.raw)
        }
      })
      formData.append(
        "row",
        JSON.stringify({
          contractNo: this.picContractNo,
          attachType: this.picAttachType,
          delPicIdList: this.delPicIdList
        })
      )
      uploadFile(formData).then((response) => {
        if (response.data.code == 0) {
          // 手动调用清除选择
          this.$refs.crud.selectClear()
          this.getList(this.page)
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          })

          this.contractDialog = false
          this.cleanContract()
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    uploadContractV2(row) {
      this.picContractNo = row.poContractNo
      // this.haveContract = row.contractUrl
      this.contractDialog = true
    },
    //财务审核
    approve() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      let val = this.selectRows.every((obj) => obj.status == 1)
      console.log(this.selectRows)
      console.log(val)
      if (!val) {
        this.$message.warning("请选择合同状态为[财务审核]的单据")
        return
      }

      this.auditDialog = true
    },
    //修改状态 type 0：提交审核 1：撤销提交
    changStatus(type) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      var flag = true
      var contractNoList = []
      //提交审核
      if (type == 0) {
        this.selectRows.forEach((item) => {
          // if(!item.existCompanyCertification){
          //   this.$message.warning(item.poContractNo + "请先上传我司签章件!");
          //   flag = false;
          //   return;
          // }
          if (item.status == 0) {
            contractNoList.push(item.poContractNo)
          } else {
            this.$message.warning("请勾选合同状态为[未处理]的数据")
            flag = false
            return
          }
        })
        //撤销提交
      } else if (type == 1) {
        this.selectRows.forEach((item) => {
          if (item.status == 1) {
            contractNoList.push(item.poContractNo)
          } else {
            this.$message.warning("请勾选合同状态为[财务审核]的数据")
            flag = false
            return
          }
        })
      }
      if (!flag) {
        return
      }
      let _this = this
      changStatus(contractNoList, type).then((response) => {
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
        this.$message.warning("请勾选数据操作")
        return
      }
      var contractNoList = []
      this.selectRows.forEach((item) => {
        contractNoList.push(item.poContractNo)
      })
      this.$confirm("此操作将删除选中合同, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRows(contractNoList).then((response) => {
            if (response.data.code == 0) {
              // 手动调用清除选择
              this.$refs.crud.selectClear()
              this.getList(this.page)
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
            this.getList(this.page)
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

      if (this.selectRows.length > 100) {
        this.$message.warning("一次批量最多只能下载100份合同")
        return
      }

      const status = this.selectRows.every((item) => item.supplierName === this.selectRows[0].supplierName)
      if (!status) {
        this.$message.warning("勾选的合同必须是同个供应商！")
        return
      }

      const status1 = this.selectRows.some((item) => item.delFlag === 1)
      if (status1) {
        this.$message.warning("勾选的合同中存在无效合同！")
        return
      }

      const status2 = this.selectRows.some((item) => item.status !== 2)
      if (status2) {
        this.$message.warning("勾选的合同中存在未审核合同！")
        return
      }

      // if (this.selectRows[0].delFlag == 1) {
      //   this.$message.warning("无效合同!");
      //   return;
      // }
      // if(this.selectRows[0].status !== 2) {
      //   this.$message.warning('非审核通过的合同状态下，不允许下载采购合同！');
      //   return;
      // }
      var contractNo = ""
      this.selectRows.forEach((item, index) => {
        contractNo += "poContractNoList=" + item.poContractNo + "&"
      })
      contractNo = contractNo.substring(0, contractNo.length - 1)
      console.log(111, contractNo)

      this.downloadUrl = getTokenUrlFile("/api/purchase/pocontract/downloadV2?" + contractNo)
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
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    },
    // 批量上传
    handleBatchUpload() {
      this.$refs.batchUploadContractRef.openDialog()
    },
    updateList() {
      this.$refs.crud.selectClear()
      this.getList(this.page)
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
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
