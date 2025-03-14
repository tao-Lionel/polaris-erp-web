<template>
  <div
    class="execution"
    id="tradeReport"
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
        :option="tableOptionCompute"
        @on-load="getList"
        @search-change="searchChange"
        @size-change="sizeChange"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
      >
        <!-- 按钮 -->
        <template slot-scope="scope" slot="menuLeft">
          <el-button type="primary" @click="replaceSKU" size="small" v-if="permissions.trade_report_replace_sku"
            >更换SKU</el-button
          >
          <el-button type="primary" @click="showUploadDialog" size="small" v-if="permissions.trade_report_import"
            >导 入</el-button
          >
        </template>

        <!-- 搜索1 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="storeAccount" label="店铺">
              <el-input
                v-model="searchForm.storeAccount"
                size="small"
                placeholder="请输入店铺名称"
                v-search-input
              ></el-input>
            </el-form-item>

            <!-- <el-form-item prop="sitList" label="站点">
                <el-select clearable v-model="searchForm.sitList" size="small" placeholder="请选择" multiple>
                  <el-option
                  v-for="item in searchBsePlatformSitOptions"
                  :key="item.bsePlatformSitId"
                  :label="item.countryCode"
                  :value="item.bsePlatformSitId"
                ></el-option>
                </el-select>
              </el-form-item> -->

            <el-form-item prop="sellerSku" label="Seller Sku">
              <el-input
                v-model="searchForm.sellerSku"
                size="small"
                placeholder="请输入Sellersku"
                v-search-input
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode" label="sku">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="请输入sku" v-search-input></el-input>
            </el-form-item>
          </el-form>
        </template>

        <!-- 搜索2 -->
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="searchDate" label="日期">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="orderTypeIdList" label="订单类型">
              <el-select clearable v-model="searchForm.orderTypeIdList" size="small" placeholder="请选择" multiple>
                <el-option
                  v-for="item in orderTypeOptons"
                  :key="item.orderTypeId"
                  :label="item.orderType"
                  :value="item.orderTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="tableBeforeSlot">
          <el-radio-group @change="changeSit" size="small" v-model="tabPositionModel" style="margin-bottom: 15px">
            <el-radio-button label="US">US</el-radio-button>
            <el-radio-button label="UK">UK</el-radio-button>
            <el-radio-button label="FR">FR</el-radio-button>
            <el-radio-button label="DE">DE</el-radio-button>
            <el-radio-button label="IT">IT</el-radio-button>
            <el-radio-button label="ES">ES</el-radio-button>
            <el-radio-button label="CA">CA</el-radio-button>
            <el-radio-button label="JP">JP</el-radio-button>
            <el-radio-button label="AU">AU</el-radio-button>
            <!-- <el-radio-button label="MX">MX</el-radio-button> -->
          </el-radio-group>
        </template>
        <!-- 操作日志 -->
        <template slot="operateLog" slot-scope="scope">
          <i
            class="icon-rizhi y-reviews"
            @click="
              showOperateLog(
                scope.row.bsePlatformSitId,
                scope.row.storeId,
                scope.row.reportDate,
                scope.row.type,
                scope.row.orderId,
                scope.row.sellerSku
              )
            "
          ></i>
        </template>
      </avue-crud>

      <!-- 上传文件 -->
      <el-dialog
        class="upload-dialog"
        title="导入"
        :visible.sync="uploadDialog"
        width="450px"
        center
        @close="formReset"
      >
        <tip type="list" :title="['1、必须选择账号和站点才能导入', '2、请直接导入下载的CSV文件不要做任何调整']" />
        <el-form ref="uploadForm" :model="upload" :rules="uploadFormRules" status-icon>
          <el-form-item label="平台" prop="platformTypeId">
            <el-select
              v-model="upload.platformTypeId"
              size="small"
              filterable
              placeholder="请选择"
              @change="changePlatform"
              :disabled="true"
            >
              <el-option
                v-for="item in plaTypeOption"
                :key="item.platformTypeId"
                :label="item.platformTypeCode"
                :value="item.platformTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="站点" prop="bsePlatformSitId">
            <el-select
              v-model="upload.bsePlatformSitId"
              size="small"
              filterable
              clearable
              placeholder="请选择"
              @change="changePlatformSit"
            >
              <el-option
                v-for="item in bsePlatformSitOptions"
                :key="item.bsePlatformSitId"
                :label="item.countryCode"
                :value="item.bsePlatformSitId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="店铺" prop="storeId">
            <el-select v-model="upload.storeId" size="small" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in baseStoreOptions"
                :key="item.storeId"
                :label="item.storeAccount"
                :value="item.storeId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="" prop="file">
            <el-upload
              class="upload-inq inline-class"
              ref="upload"
              accept=".csv"
              action="String"
              :auto-upload="false"
              :on-change="signFileChange"
              :show-file-list="false"
            >
              <el-button style="margin-left: 10px" type="primary" size="small">上传数据</el-button>
              &nbsp;&nbsp;
              <span>{{ upload.attachmentFileName }}</span>
            </el-upload>
          </el-form-item>
        </el-form>
        <!-- <div style="border: 1px solid #ccc6c6;background: #f7f00e;margin-top: 20px;">
            <div style="float: left;padding: 10px;">注意事项：</div>
            <div style="float: left;">
              <div style="padding: 10px;">1、必须选择账号和站点才能导入；</div>
              <div style="padding: 10px;">2、请直接导入下载的CSV文件不要做任何调整</div>
            </div>
            <div style="clear:both"></div>
          </div> -->
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="submitUpload('uploadForm')">确定</el-button>
        </span>
      </el-dialog>

      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>

      <querySkuInfo ref="querySkuInfo" @handleSelectSku="handleSelectSku"></querySkuInfo>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, importObj, saveReplaceSku } from "@/api/cockpit/database/cocamazontradereport"
import { getAllOrderType } from "@/api/cockpit/database/cocordertype"
import { tableOption, uploadFormRules, hiddenTableOption } from "@/const/crud/cockpit/database/tradereport"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { preventShake } from "@/util/tool"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getAll as getAllStore } from "@/api/baseSetup/bsestore"
import { getSitInfoByPlatformId, getSitInfo } from "@/api/baseSetup/bseplatformsit"
import querySkuInfo from "@/views/cockpit/querySkuInfo"
import pooperatelog from "@/views/cockpit/log/index"
import { formatDate } from "@/filters/index"
import { mapGetters } from "vuex"
import tip from "@/views/cockpit/tip"
export default {
  name: "tradereport",
  components: {
    querySkuInfo,
    pooperatelog,
    tip
  },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchFormConfirm: {},
      searchForm: {
        storeAccount: "",
        sitList: [],
        sellerSku: "",
        skuCode: "",
        searchDate: "",
        orderTypeIdList: [],
        tabCard: ""
      },
      loading: false,
      form: {},
      tableData: [],
      tableOption: tableOption,
      hiddenTableOption: hiddenTableOption,
      tabPositionModel: "US",
      selectRows: [],
      searchBsePlatformSitOptions: [],
      orderTypeOptons: [],
      //导入相关
      uploadDialog: false,
      upload: {
        platformTypeId: "",
        bsePlatformSitId: "",
        storeId: "",
        attachmentFileName: "",
        file: null
      },
      plaTypeOption: [],
      bsePlatformSitOptions: [],
      baseStoreOptions: [],
      uploadFormRules: uploadFormRules,
      //更换SKU
      replaceSkuForm: {
        dataRows: [],
        skuId: ""
      }
    }
  },
  created() {},
  mounted: function () {
    this.initInfo()
  },
  computed: {
    ...mapGetters(["permissions"]),
    //监听tag
    tableOptionCompute() {
      let tableOptionsClone = deepClone(this.tableOption)
      tableOptionsClone.column = tableOptionsClone.column.filter((item) => {
        return this.hiddenTableOption[this.tabPositionModel].name.indexOf(item.prop) === -1
      })
      return tableOptionsClone
    }
  },
  methods: {
    //查看操作日志
    showOperateLog: function (bsePlatformSitId, storeId, reportDate, type, orderId, sellerSku) {
      var id =
        bsePlatformSitId + "-" + storeId + "-" + formatDate(new Date(reportDate), "yyyy-MM-dd hh:mm:ss") + "-" + type
      if (orderId) {
        id = id + "-" + orderId
      } else {
        id = id + "-" + ""
      }
      if (sellerSku) {
        id = id + "-" + sellerSku
      } else {
        id = id + "-" + ""
      }
      this.$refs.pooperatelog.showOperateLogDialog(id, 2)
    },
    changeSit() {
      this.page.currentPage = 1
      this.getList(this.page, this.searchFormConfirm)
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    //搜索回调
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, params)
    },
    refreshChange(params) {
      this.getList(this.page, params)
    },
    getList(page, params) {
      this.searchFormConfirm = Object.assign(this.searchFormConfirm, { tabCard: this.tabPositionModel })
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
        this.clearSelectClear()
      })
    },
    selectionChange(selected) {
      this.selectRows = selected
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    initInfo() {
      //平台
      getPlaTypeAll().then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          this.plaTypeOption = res.data.data
        }
      })

      //查询站点
      // let param = {
      //   platformTypeCode: 'AMAZON'
      // }
      // getSitInfo(param).then(res =>{
      //   if(res.data.data && res.data.data.length > 0){
      //     this.searchBsePlatformSitOptions = res.data.data;
      //   }
      // })

      //订单类型
      getAllOrderType().then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          this.orderTypeOptons = res.data.data
        }
      })
    },
    //选中平台-获取平台下的所有站点
    changePlatform(val) {
      this.upload.bsePlatformSitId = ""
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          this.bsePlatformSitOptions = res.data.data
        }
      })
    },
    //选中站点
    changePlatformSit(val) {
      this.upload.storeId = ""
      let param = {
        bsePlatformSitId: val
      }
      getAllStore(param).then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          this.baseStoreOptions = res.data.data
        }
      })
    },
    formReset() {
      this.$refs["uploadForm"].resetFields()
      this.baseStoreOptions = []
      this.bsePlatformSitOptions = []
      this.upload.attachmentFileName = ""
    },
    showUploadDialog() {
      this.uploadDialog = true
      //平台类型
      let options = this.plaTypeOption.filter((obj) => {
        return obj.platformTypeCode == "AMAZON"
      })
      if (options.length == 1) {
        //平台类型
        let opt = options[0]
        this.upload.platformTypeId = opt.platformTypeId
        this.changePlatform(this.upload.platformTypeId)
      }
    },
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      var arr = file.name.split(".")
      if (arr[arr.length - 1] != "csv") {
        this.$message.warning("请选CSV文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 6) {
        this.$message.warning("文件文件限制为6M以内!!")
        return
      }
      this.upload.attachmentFileName = file.name
      this.upload.file = file
    },
    submitUpload(formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formdata = new FormData()
          formdata.append("file", this.upload.file.raw)
          formdata.append("storeId", this.upload.storeId)
          formdata.append("bsePlatformSitId", this.upload.bsePlatformSitId)
          importObj(formdata).then((response) => {
            if (response.data.code == 0) {
              _this.$message.success("操作成功")
              _this.clearSelectClear()
              _this.refreshChange()
              _this.uploadDialog = false
            } else if (response.data.code == 1) {
              _this.$message.warning(response.data.msg)
              return
            } else if (response.data.code == 2) {
              _this.$message.warning(response.data.msg)
              _this.uploadDialog = false
            } else {
              _this.$message.error("操作失败")
              return
            }
          })
        }
      })
    },
    //处理响应
    handleResponse(response, operationCode, operation) {
      this.loading = false
      if (response.data.code == 0) {
        this.clearSelectClear()
        this.getList(this.page, this.searchFormConfirm)
        if (operationCode == "uploadFile") {
          this.uploadDialog = false
        }
        this.$notify({
          title: "成功",
          message: operation + "成功",
          type: "success",
          duration: 2000
        })
      } else if (response.data.code == 1) {
        this.$message.error(response.data.msg)
        return
      } else if (response.data.code == 2) {
        this.clearSelectClear()
        // this.handleSearchFilter();
        this.getList(this.page, this.searchFormConfirm)
        if (operationCode == "uploadFile") {
          this.uploadDialog = false
        }
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("操作失败")
        return
      }
    },
    //更换SKU
    replaceSKU() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("未勾选数据")
        return
      }
      this.$refs.querySkuInfo.querySku()
    },
    handleSelectSku(sku) {
      //构造ids

      var _this = this
      // this.replaceSkuForm.skuId = sku.skuId;
      // this.replaceSkuForm.dataRows = this.selectRows;
      preventShake.preventShake((bool) => {
        if (bool) {
          saveReplaceSku(_this.selectRows, sku.skuId)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("操作成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.$refs.querySkuInfo.closeDialog()
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./tradereport.scss";
</style>
