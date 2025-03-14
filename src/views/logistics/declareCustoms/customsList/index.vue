<template>
  <!-- 采购换货 -->
  <div
    class="execution"
    id="customsDeclarationList"
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
          <el-dropdown-button
            v-if="permissions.cusDeclare_export"
            type="primary"
            size="small"
            buttonText="导出"
            @command="exporgHandleCommand"
          >
            <el-dropdown-item command="0">列表导出</el-dropdown-item>
            <el-dropdown-item command="1">明细导出</el-dropdown-item>
            <el-dropdown-item command="2">详情导出</el-dropdown-item>
          </el-dropdown-button>

          <el-dropdown-button
            v-if="permissions.cusDeclare_audit"
            type="primary"
            size="small"
            buttonText="审核"
            command="1"
            @command="showAuditDialog"
          >
            <el-dropdown-item command="0" v-if="permissions.cusDeclare_unaudit">反审核</el-dropdown-item>
          </el-dropdown-button>
          &nbsp;
          <el-button
            v-if="permissions.cusDeclare_declare_customs"
            type="primary"
            size="small"
            @click="showDeclareAtCustoms"
            >报关</el-button
          >

          <el-button
            v-if="permissions.cusDeclare_merge_declare"
            type="primary"
            size="small"
            @click="mergeDeclareAtCustoms"
            >合并关单</el-button
          >

          <el-button v-if="permissions.cusDeclare_clear_declare" type="primary" size="small" @click="clearDeclareExport"
            >清关导出</el-button
          >
        </template>

        <!-- 搜索1 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="startDate">
              <el-date-picker
                size="small"
                v-model="searchForm.startDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                @change="handleChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="declareCustomNo">
              <el-input
                v-model="searchForm.declareCustomNo"
                size="small"
                placeholder="报关单号"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="declareTypeId">
              <el-select clearable v-model="searchForm.declareTypeId" size="small" placeholder="类型">
                <el-option
                  v-for="item in typeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>

        <!-- 搜索2 -->
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="transportCarrierId">
              <el-select
                size="small"
                v-model="searchForm.transportCarrierId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="物流商"
              >
                <el-option
                  v-for="item in transportCarrierOptions"
                  :key="item.transportCarrierId"
                  :label="item.carrierName"
                  :value="item.transportCarrierId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                size="small"
                v-model="searchForm.status"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="状态"
              >
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transferNo">
              <el-input v-model="searchForm.transferNo" size="small" placeholder="调拨单号" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="contractNumber">
              <el-input
                v-model="searchForm.contractNumber"
                size="small"
                placeholder="合同协议号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="destinationCountryId">
              <el-select
                size="small"
                v-model="searchForm.destinationCountryId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="运抵国"
              >
                <el-option
                  v-for="item in bsecountryOptions"
                  :key="item.countryId"
                  :label="item.countryShortName"
                  :value="item.countryId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>

        <template slot="declareTypeId" slot-scope="scope">
          <span>{{ typeObj[scope.row.declareTypeId] }}</span>
        </template>
        <!-- 报关单路由 -->
        <template slot="declareCustomNo" slot-scope="scope">
          <router-link
            class="el-row-text"
            :to="'/declareCustoms/detail/' + scope.row.declareCustomNo + '/' + scope.row.declareTypeName"
            :title="scope.row.c1"
            v-if="permissions.cusDeclare_look_declare"
          >
            {{ scope.row.declareCustomNo }}
          </router-link>
          <span v-else>{{ scope.row.declareCustomNo }}</span>
          <!-- <router-link
              v-if="permissions.prdlist_edit"
              :to="'/product/openTag/edit/'+scope.row.invoiceId"
                :title="scope.row.invoiceNo" >
                {{scope.row.invoiceNo}}
              </router-link>
              <el-tag type="info" disable-transitions v-else>
                {{scope.row.invoiceNo}}
              </el-tag> -->
        </template>
        <!-- 报关数量 -->
        <template slot="declareQuantityTotal" slot-scope="scope">
          <a @click="showSkuInfo(scope.row.declareCustomNo)">{{ scope.row.declareQuantityTotal }}</a>
          <!-- :href='scope.row.annexFileAddr' -->
        </template>
        <!-- 海关单 -->
        <template slot="customsNumber" slot-scope="scope">
          <a class="y-cursor el-row-text" href="javascript:void(0)" @click="showPdf(scope.row.annexFileAddr)">{{
            scope.row.customsNumber
          }}</a>
          <!-- :href='scope.row.annexFileAddr' -->
        </template>
        <!-- 日志 -->
        <template slot="operate" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row)"></i>
        </template>
      </avue-crud>

      <!-- 反审核 -->
      <el-dialog title="反审核" :visible.sync="auditDialog" width="30%">
        <el-form :model="auditForm" ref="auditForm">
          <el-form-item prop="reason" label="">
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="100"
              placeholder="请填写反审核原因，不得超过100个字符"
              v-model="auditForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditDialog = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="handleAudit" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 产品详情 -->
      <el-dialog class="sku-dialog" title="产品详情" :visible.sync="skuDialog" center>
        <avue-crud class="app-container" :data="skuTableData" :option="skuTableOption"> </avue-crud>
      </el-dialog>

      <!-- 报关 -->
      <el-dialog title="报关" :visible.sync="declareAtCustomsDialog" width="400px">
        <el-form :model="declareAtCustomsForm" ref="declareAtCustomsForm">
          <el-form-item prop="customsNumber" label="海关单号" :rules="ruleDeclare">
            <el-input
              v-model="declareAtCustomsForm.customsNumber"
              size="mini"
              maxlength="18"
              placeholder=""
              v-search-input-trim
            ></el-input>
          </el-form-item>
          <el-form-item class="dc-upload-wrapper" prop="attchmentFile" label="　　附件">
            <el-upload
              class="upload-demo inline-class"
              ref="upload"
              accept="application/pdf"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :show-file-list="false"
            >
              <el-button size="small">点击上传</el-button>
            </el-upload>
            <span>{{ declareAtCustomsForm.attachmentFileName }}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="declareAtCustomsDialog = false">取 消</el-button> -->
          <el-button type="primary" size="small" @click="handleDeclareAtCustoms" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 操作日志 -->
      <cusLog ref="cusLog"></cusLog>
      <pdfdownlook ref="pdfDownLook" :download="true"></pdfdownlook>
    </basic-container>
  </div>
</template>

<script>
import {
  getDeclareList,
  exportListBefore,
  mergeDeclare,
  reviewDeclare,
  declareAtCustomsSave,
  getDeclareLogList,
  getSkuInfo
} from "@/api/logistics/declareCustoms/customsList/customsList"
import { getAll as getBsetransportcarrierAll } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import { tableOption, skuTableOption } from "@/const/crud/logistics/declareCustoms/customsList/customsList"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { getUrlConcatToken } from "@/util/auth"
import cusLog from "@/views/logistics/declareCustoms/cuslog/index"
import { getTokenUrl } from "@/util/auth"
import pdfdownlook from "@/components/yvue/pdf/index"
import { getCountry } from "@/api/baseSetup/bsecountry"
export default {
  name: "customsDeclarationList",
  components: {
    cusLog,
    pdfdownlook
  },
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{1,18}$/
      if (!reg.test(value)) {
        callback(new Error("18数字或字母"))
      } else {
        callback()
      }
    }
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchFormConfirm: {},
      searchForm: {
        startDate: [],
        declareTypeId: "",
        transportCarrierId: [],
        destinationCountryId: ""
      },
      tableOption: tableOption,
      selectRows: [],
      tableData: [],
      typeSelect: [
        { value: 1, label: "自贸通报关" },
        { value: 2, label: "自主报关" }
      ],
      typeObj: { 1: "自贸通报关", 2: "自主报关" },
      transportCarrierOptions: [],
      //审核
      auditDialog: false,
      auditForm: {
        declareCustoms: "",
        status: "1",
        auditTextarea: null
      },
      // 报关
      declareAtCustomsDialog: false,
      declareAtCustomsForm: {
        customsNumber: "",
        file: {},
        attachmentFileName: "未选择任何文件"
      },
      form: {},
      loading: false,
      ruleDeclare: [
        { message: "海关单号不能为空", trigger: "blur" },
        { validator: validatePass, trigger: "blur" }
      ],
      statusOptions: [
        {
          label: "待审核",
          value: 0
        },
        {
          label: "待报关",
          value: 1
        },
        {
          label: "报关完成",
          value: 2
        }
      ],
      skuTableOption: skuTableOption,
      skuTableData: [],
      skuDialog: false,
      bsecountryOptions: []
    }
  },
  created() {},
  mounted: function () {
    //加载物流商
    this.getBsetransportcarrierAll()
    this.getCountry()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    handleChange(value) {
      console.log("time", value)
    },
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
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
      this.getList(this.page, params)
    },
    getList(page, params) {
      getDeclareList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.records
        this.page.total = response.data.total
      })
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    //导出回调
    exporgHandleCommand(command) {
      if (parseInt(command) == 0 || parseInt(command) == 1) {
        let sDate = ""
        if (this.searchFormConfirm.startDate) {
          sDate =
            "&startDate=" + this.searchFormConfirm.startDate[0] + "&startDate=" + this.searchFormConfirm.startDate[1]
        }
        let dType = ""
        if (this.searchFormConfirm.declareTypeId) {
          dType = "&declareType=" + this.searchFormConfirm.declareTypeId
        }
        let dNo = ""
        if (this.searchFormConfirm.declareCustomNo) {
          dNo = "&declareCustoms=" + this.searchFormConfirm.declareCustomNo
        }
        let dNorr = []
        if (this.selectRows.length > 0) {
          this.selectRows.forEach((ele) => {
            dNorr.push(ele.declareCustomNo)
          })
        }
        let declareStr = ""
        if (dNorr.length > 0) {
          declareStr = dNorr.join(",")
          if (dNo == "") {
            dNo = "&declareCustoms=" + declareStr
          } else {
            dNo = dNo + "," + declareStr
          }
        }
        let transportCarrierId = ""
        if (this.searchFormConfirm.transportCarrierId) {
          this.searchFormConfirm.transportCarrierId.forEach((obj) => {
            transportCarrierId = transportCarrierId + "&transportCarrierId=" + obj
          })
        }
        let declareStatus = ""
        if (this.searchFormConfirm.status) {
          this.searchFormConfirm.status.forEach((obj) => {
            declareStatus = declareStatus + "&status=" + obj
          })
        }
        let tNo = ""
        if (this.searchFormConfirm.transferNo) {
          tNo = "&transferNo=" + this.searchFormConfirm.transferNo
        }
        let cNo = ""
        if (this.searchFormConfirm.contractNumber) {
          cNo = "&contractNumber=" + this.searchFormConfirm.contractNumber
        }
        let destinationCountryId = ""
        if (this.searchFormConfirm.destinationCountryId) {
          this.searchFormConfirm.destinationCountryId.forEach((obj) => {
            destinationCountryId = destinationCountryId + "&destinationCountryId=" + obj
          })
        }
        let commandCopy = "&command=" + command
        let paramBefore = {}
        paramBefore.startDate = this.searchFormConfirm.startDate
        paramBefore.declareType = this.searchFormConfirm.declareTypeId
        paramBefore.declareCustoms = this.searchFormConfirm.declareCustomNo
        paramBefore.transportCarrierId = this.searchFormConfirm.transportCarrierId
        paramBefore.status = this.searchFormConfirm.status
        paramBefore.transferNo = this.searchFormConfirm.transferNo
        paramBefore.contractNumber = this.searchFormConfirm.contractNumber
        paramBefore.command = command
        paramBefore.destinationCountryId = this.searchFormConfirm.destinationCountryId
        if (declareStr != "") {
          paramBefore.declareCustoms += "," + declareStr
        }
        exportListBefore(Object.assign(paramBefore)).then((response) => {
          if (!response.data.data) {
            this.$message.warning(response.data.msg)
            return
          }
          window.location =
            getUrlConcatToken(`/api/declarecustoms/cusdeclarecustoms/exportList`) +
            sDate +
            dType +
            dNo +
            transportCarrierId +
            declareStatus +
            tNo +
            cNo +
            commandCopy +
            destinationCountryId
        })
      } else if (parseInt(command) == 2) {
        if (this.selectRows.length == 1) {
          let type = -1
          if (this.selectRows[0].declareTypeName == "自主报关") {
            type = 2
          } else if (this.selectRows[0].declareTypeName == "自贸通报关") {
            type = 1
          }
          window.location =
            getUrlConcatToken(`/api/declarecustoms/cusdeclarecustoms/exportDeclare`) +
            "&declareType=" +
            type +
            "&declareCustoms=" +
            this.selectRows[0].declareCustomNo
        } else {
          this.$message.warning("请勾选一条数据!!")
        }
      }
    },
    //审核操作[待审核状态可审核，关单自动同步过来时默认是待审核状态]
    showAuditDialog(command) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (command == "1") {
        let arrT = []
        let arrF = []
        this.selectRows.forEach((sele) => {
          if (sele.status != 0) {
            arrF.push(sele.declareCustomNo)
          } else {
            arrT.push(sele.declareCustomNo)
          }
        })
        if (arrF.length > 0) {
          this.$message.warning(arrF + "未处于待审核状态")
          return
        }
        this.auditForm = {
          declareCustoms: arrT.join(","),
          status: 1,
          reason: null
        }
        this.handleAudit()
      } else if (command == "0") {
        //做数据状态校验
        let arrT = []
        let arrF = []
        this.selectRows.forEach((sele) => {
          if (sele.status != 1) {
            arrF.push(sele.declareCustomNo)
          } else {
            arrT.push(sele.declareCustomNo)
          }
        })
        if (arrF.length > 0) {
          this.$message.warning(arrF + "未处于待报关状态")
          return
        }
        this.auditForm = {
          declareCustoms: arrT.join(","),
          status: 0,
          reason: null
        }
        this.auditDialog = true
      }
    },
    handleAudit() {
      if (this.auditForm.status == 0) {
        if (!this.auditForm.reason || this.auditForm.reason.trim() == "") {
          this.$message.warning("请填写反审核原因")
          return
        }
      }
      var _this = this
      _this.loading = true
      //请求审核接口
      preventShake.preventShake((bool) => {
        if (bool) {
          reviewDeclare(Object.assign(_this.auditForm))
            .then((res) => {
              if (res.data.data) {
                _this.clearSelectClear()
                _this.refreshChange()
                if (_this.auditForm.status == 1) {
                  _this.$message.success("审核成功")
                } else if (_this.auditForm.status == 0) {
                  _this.auditDialog = false
                  _this.$message.success("反审核成功")
                }
              } else {
                _this.$message.warning(res.data.msg)
              }
            })
            .catch(() => {
              _this.$message.error("审核异常")
              return
            })
            .finally(() => {
              _this.loading = false
            })
        }
      })
    },
    //报关
    showDeclareAtCustoms() {
      if (this.selectRows.length != 1) {
        this.$message.warning("请勾选一条报关单")
        return
      }
      let status = this.selectRows[0].status
      if (status != 1) {
        this.$message.warning("请勾选一条待报关数据")
        return
      }
      this.declareAtCustomsForm = {
        customsNumber: "",
        file: {},
        attachmentFileName: "未选择任何文件"
      }
      this.declareAtCustomsDialog = true
    },
    //报关附件-文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 30) {
        this.$message.warning("不允许上传大于30M文件")
        return
      }
      this.declareAtCustomsForm.file = file
      this.declareAtCustomsForm.attachmentFileName = file.name
    },
    //报关保存
    handleDeclareAtCustoms() {
      if (!this.declareAtCustomsForm.file.name) {
        this.$message.warning("请上传附件")
        return
      }
      this.$refs.declareAtCustomsForm.validate((val) => {
        if (!val) {
          return
        }
        var _this = this
        if (_this.declareAtCustomsForm.file.name.length > 44) {
          _this.$message.warning("文件名称长度不得超过40!!")
          return
        }
        _this.loading = true
        let formData = new FormData()
        formData.append("declareCustoms", this.selectRows[0].declareCustomNo)
        formData.append("customsNumber", _this.declareAtCustomsForm.customsNumber)
        formData.append("file", _this.declareAtCustomsForm.file.raw)
        preventShake.preventShake((bool) => {
          if (bool) {
            declareAtCustomsSave(formData)
              .then((res) => {
                if (res.data.data) {
                  _this.clearSelectClear()
                  _this.refreshChange()
                  _this.$message.success("报关成功")
                  _this.declareAtCustomsDialog = false
                } else {
                  _this.$message.warning(res.data.msg)
                }
              })
              .catch(() => {
                _this.$message.error("报关失败")
                return
              })
              .finally(() => {
                _this.loading = false
              })
          }
        })
      })
    },
    //合并关单【法人/类型/运抵国相同的情况下才能合并】
    mergeDeclareAtCustoms() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      if (this.selectRows.length < 2) {
        this.$message.warning("一次选择两个或两个以上报关单")
        return
      }
      if (this.selectRows.length > 10) {
        this.$message.warning("一次只允许10条记录合并")
        return
      }
      let erroArr = []
      let suArr = []
      this.selectRows.forEach((ele) => {
        if (ele.status == 1 || ele.status == 2) {
          erroArr.push(ele.declareCustomNo)
        } else {
          suArr.push(ele.declareCustomNo)
        }
      })
      if (erroArr.length > 0) {
        this.$message.warning("报关单:" + erroArr + ",不处在待审核状态，不支持合并!!")
        return
      }
      this.loading = true
      mergeDeclare(Object.assign({ declareCustoms: suArr }))
        .then((res) => {
          if (res.data.data) {
            this.clearSelectClear()
            this.refreshChange()
            this.$message.success("关单合并成功!!")
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error("关单合并失败")
          return
        })
        .finally(() => {
          this.loading = false
        })
    },
    //清关导出
    clearDeclareExport() {
      if (this.selectRows.length != 1) {
        this.$message.warning("请勾选一条报关单")
        return
      }
      window.location =
        getUrlConcatToken(`/api/declarecustoms/cusdeclarecustoms/exportClearDeclare`) +
        "&declareCustoms=" +
        this.selectRows[0].declareCustomNo
    },
    //产品详情信息
    showSkuInfo(declareCustomNo) {
      getSkuInfo(declareCustomNo).then((response) => {
        this.skuTableData = response.data.data
        this.skuDialog = true
      })
    },
    //查看操作日志
    showOperateLog(row) {
      this.$refs.cusLog.showOperateLogDialog(row.declareCustomNo, 0)
    },
    showPdf(url) {
      this.$refs.pdfDownLook.pdfFn(url)
    },
    //查询物流商
    getBsetransportcarrierAll: function () {
      var query = {}
      getBsetransportcarrierAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportCarrierOptions = data
        }
      })
    },
    //加载国家
    getCountry: function () {
      getCountry().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.bsecountryOptions = data
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
