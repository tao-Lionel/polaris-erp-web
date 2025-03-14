<template>
  <div id="transfer_detail">
    <basic-container class>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '其他出库单',
          list: [
            { label: '单据编号', value: otherOutStock.orderNo },
            { label: '单据日期', value: otherOutStock.createTime },
            { label: '制单人', value: otherOutStock.createByName || userInfo.displayname }
          ]
        }"
      ></detail-template>

      <el-form ref="otherOutStockForm" :model="otherOutStock" :rules="basicInfoFormRules" status-icon>
        <!-- 基本信息 -->
        <detail-wrapper :options="{ title: '基本信息' }">
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="销售组" prop="groupId" label-width="70px">
                <el-select v-model="otherOutStock.groupId" size="small" clearable filterable :disabled="disabledFlag"
                  placeholder="请选择" @change="handleSelectGroupId(otherOutStock.groupId)">
                  <el-option v-for="item in salesGroupOptions" :key="item.groupId" :label="item.name"
                    :value="item.groupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="法人主体" prop="corporationId" label-width="85px">
                <el-select
                  v-model="otherOutStock.corporationId"
                  size="small"
                  clearable
                  :disabled="disabledFlag"
                  placeholder="请选择"
                  @change="changeCorporationId"
                >
                  <el-option
                    v-for="item in corporationOptions"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- 平台 -->
              <el-form-item prop="platform" label="平台" label-width="85px" :rules="basicInfoFormRules.platform">
                <el-select
                  v-model="otherOutStock.platform"
                  clearable
                  size="mini"
                  @change="changePlatform"
                  :disabled="disabledFlag"
                >
                  <el-option
                    v-for="item in platformOption"
                    :key="item.platformTypeId"
                    :label="item.platformTypeCode"
                    :value="item.platformTypeCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- 站点 -->
              <el-form-item prop="site" label="站点" label-width="85px" :rules="basicInfoFormRules.site">
                <el-select v-model="otherOutStock.site" size="small" clearable :disabled="disabledFlag">
                  <el-option
                    v-for="item in sitCountryOptions"
                    :key="item.bsePlatformSitId"
                    :label="item.sitEnName"
                    :value="item.sitEnName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <!-- 发货信息 -->
        <detail-wrapper :options="{ title: '发货信息' }">
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库" prop="warehouseId" label-width="55px">
                <div v-if="disabledFlag">
                  {{ otherOutStock.warehouseName }}
                </div>
                <el-select
                  v-else
                  v-model="otherOutStock.warehouseId"
                  size="small"
                  filterable
                  clearable
                  :disabled="disabledFlag"
                  placeholder="请选择"
                  @change="handleSelectWarehouseOut(otherOutStock.warehouseId)"
                >
                  <el-option
                    v-for="item in warehouseOptions"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务类型" prop="businessTypeId" label-width="90px">
                <el-select
                  v-model="otherOutStock.businessTypeId"
                  size="small"
                  filterable
                  clearable
                  :disabled="disabledFlag"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in bunsinessTypeOptions"
                    :key="item.businessTypeId"
                    :label="item.businessTypeDescribe"
                    :value="item.businessTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="iod-address">
            <p class="iod-address-title">备注:</p>
            <el-input
              class="iod-address-name address-con"
              maxlength="80"
              :disabled="disabledFlag"
              v-model="otherOutStock.remark"
            />
          </div>
          <!-- <div class="flex-spance-between target-edit">
              <el-form-item label="备注" prop="remark">
                <el-input  maxlength="80" :disabled="disabledFlag" v-model="otherOutStock.remark"/>
              </el-form-item>
            </div> -->
        </detail-wrapper>

        <!-- 产品信息 -->
        <div class="border-rang">
          <div class="title-wrapper">
            <span class="title">产品信息</span>
            <div style="float: right">
              <el-button :disabled="disabledFlag" type="primary" size="mini" @click="selectProduct()" round
                >选择产品</el-button
              >
            </div>
          </div>
          <avue-crud
            class="app-container"
            :data="otherOutStock.tableData"
            :option="otherOutStockDetailOption"
            @row-click="rowClick"
          >
            <!-- 出库数量 -->
            <template slot="operateQuantity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].operateQuantity'"
                :rules="basicInfoFormRules.operateQuantity"
              >
                <el-input
                  :disabled="disabledFlag"
                  size="mini"
                  clearable
                  maxlength="4"
                  v-model="scope.row.operateQuantity"
                  @change="operateQuantityChange"
                ></el-input>
              </el-form-item>
              <!-- </el-form> -->
            </template>

            <!-- 自定义操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <div v-if="!disabledFlag">
                <i class="icon-shanchu y-icon-delect" @click="handleDelRow(scope.row, scope.row.$index)"></i>
              </div>
              <div v-else>
                <i class="icon-shanchu y-icon-delect"></i>
              </div>
            </template>
          </avue-crud>
        </div>
      </el-form>

      <!-- 操作按钮 -->
      <div style="margin: 20px 10px 0px 0px; float: right">
        <el-button :disabled="disabledFlag" type="primary" @click="handleSave(false)" size="small">保 存</el-button>
        <el-button
          :disabled="disabledFlag"
          type="primary"
          @click="handleSave(true)"
          size="small"
          v-if="permissions.other_out_stock_approve"
          >保存并提交审核</el-button
        >
      </div>

      <!--查看产品详情-->
      <el-dialog title="选择产品" :visible.sync="productDialog" width="60%" height="60%" center>
        <avue-crud
          ref="productCrud"
          :page="page"
          :data="productData"
          :option="productTableOption"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
        >
          <!-- 搜索条件 -->
          <template slot-scope="scope" slot="search">
            <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
              <!-- <el-form-item label="平台SKU" prop="platformSkuCode">
                <el-input v-model="searchForm.platformSkuCode" size="small" placeholder="输入平台SKU查询，多个逗号隔开"></el-input>
              </el-form-item> -->
              <el-form-item label="标准SPU" prop="spuCode">
                <el-input
                  v-model="searchForm.spuCode"
                  v-search-input
                  size="small"
                  placeholder="搜索多个SPU用英文,分隔"
                ></el-input>
              </el-form-item>
              <el-form-item label="SKU" prop="skuCode">
                <el-input
                  v-model="searchForm.skuCode"
                  v-search-input
                  size="small"
                  placeholder="搜索多个SKU用英文,分隔"
                ></el-input>
              </el-form-item>
              <el-form-item label="产品名称" prop="skuName">
                <el-input v-model="searchForm.skuName" size="small" placeholder="输入产品名称"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="productDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confirmProduct">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getProductList } from "@/api/warehouse/wmsstock"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getBussinessType } from "@/api/warehouse/wmsbusinesstype"
import { otherOutStockDetailOption, productTableOption } from "@/const/crud/warehouse/otherOutStock/wmsotheroutstock"
import { getSavedInfo, saveOtherOutStock, getPrice, getNumInfo } from "@/api/warehouse/otherOutStock/wmsotheroutstock"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"

let tempHouseId = null
let tempGroupId = null
export default {
  name: "transfer_detail",
  data() {
    /**是否是整数 */
    var validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入正整数"))
      }
    }
    return {
      disabledFlag: false,
      bunsinessTypeOptions: [],
      salesGroupOptions: [],
      corporationOptions: [],
      countryId: "",
      warehouseOptions: [],
      otherOutStock: {
        type: "",
        orderNo: "",
        createTime: "",
        businessTypeId: "",
        corporationId: "",
        // transferType: this.$route.query.transferType,
        countryId: "",
        warehouseId: "",
        groupId: "",
        tableData: []
      },
      basicInfoFormRules: {
        groupId: [{ required: true, message: "请先选择销售组", trigger: "change" }],
        corporationId: [{ required: true, message: "请先选择法人主体", trigger: "change" }],
        warehouseId: [{ required: true, message: "请先选择发货仓", trigger: "change" }],
        businessTypeId: [{ required: true, message: "请先选择业务类型", trigger: "change" }],
        platform: [{ required: true, message: "请先选择平台", trigger: "blur", type: "string" }],
        site: [{ required: true, message: "请先选择站点", trigger: "blur", type: "string" }],
        operateQuantity: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          {
            validator: validateNumber,
            message: "只能输入正整数",
            trigger: "blur"
          }
        ]
      },
      ///--------////
      // loading: false,
      otherOutStockDetailOption: otherOutStockDetailOption,
      tableIndex: 0,
      productDialog: false,
      productTableOption: productTableOption,
      productData: [],
      selectList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // tableLoading: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        platformSkuCode: "",
        spuCode: "",
        skuCode: "",
        skuName: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      platformOption: [],
      sitCountryOptions: []
    }
  },
  created() {
    this.otherOutStock.orderNo = this.$route.query.orderNo
    this.loadAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    /**
     * 页面初始化
     */
    loadAll: function () {
      //获取平台
      getPlaTypeAll().then((res) => {
        this.platformOption = res.data.data
        console.log(this.platformOption)
      })

      this.getCorporation()
      //加载保存数据
      if (this.otherOutStock.orderNo) {
        getSavedInfo({ orderNo: this.otherOutStock.orderNo }).then((response) => {
          var data = response.data.data

          if (response.data.code == 0) {
            if (data.dataStatus != 0) {
              this.disabledFlag = true
            }
            this.otherOutStock.createTime = data.createTime
            this.otherOutStock.createByName = data.createByName
            // console.log(typeof data.businessType)
            this.otherOutStock.businessTypeId = data.businessType
            this.otherOutStock.warehouseId = data.warehouseId
            this.otherOutStock.warehouseName = data.warehouseName
            this.otherOutStock.groupId = data.groupId
            this.otherOutStock.type = data.type
            this.otherOutStock.remark = data.remark
            this.otherOutStock.corporationId = data.corporationId
            this.otherOutStock.platform = data.platform
            this.otherOutStock.site = data.site
            this.otherOutStock.tableData = data.details //data.saveDetailList
            if (this.userInfo.userId != data.createBy) {
              this.getGroupAll(data.groupId)
              this.disabledFlag = true
            } else {
              this.getGroupAll()
              //如果业务类型为盘盈
              if (data.type == 2) {
                this.disabledFlag = true
              }
            }
            //加载业务类型
            this.getBussinessType()
            tempHouseId = data.warehouseId
            tempGroupId = data.groupId
          } else {
            this.$message.error("加载页面失败")
            return
          }
        })
      } else {
        //加载销售组
        this.getGroupAll()
        //加载业务类型
        console.log(111)
        this.getBussinessType()
        console.log(222)
      }
    },

    //根据平台查询站点
    getPlatformSit(val) {
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.sitCountryOptions = res.data.data
      })
      console.log(this.otherOutStock.tableData)
    },
    //选中平台-获取平台下的所有站点
    changePlatform(val) {
      const obj = this.platformOption.find((o) => o.platformTypeCode === val)
      const id = obj ? obj.platformTypeId : undefined
      //清空站点值
      // console.log(val)
      this.sitCountryOptions = []
      this.getPlatformSit(id)
    },

    //获取业务类型
    getBussinessType() {
      var type
      if (this.otherOutStock.type) {
        type = this.otherOutStock.type
      } else {
        type = 0
      }
      var query = {
        type: type
      }
      getBussinessType(query).then((response) => {
        var data = response.data.data.records
        if (data && data.length > 0) {
          this.bunsinessTypeOptions = data
        }
      })
    },
    //数量校验
    operateQuantityChange() {
      const element = this.otherOutStock.tableData[this.tableIndex]
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (!element.operateQuantity) {
        element.operateQuantity = ""
        return false
      }
      if (!reg.test(element.operateQuantity)) {
        this.$message.warning("只能输入正整数")
        element.operateQuantity = ""
        this.$set(this.otherOutStock.tableData, this.tableIndex, element)
        return false
      }
      if (parseInt(element.operateQuantity) > parseInt(element.availableQuantity)) {
        this.$message.warning("出库数量大于可调数量[" + element.availableQuantity + "]")
        element.operateQuantity = ""
        this.$set(this.otherOutStock.tableData, this.tableIndex, element)
        return false
      }
      //alert(element.operateQuantity);
      // this.$set()

      // element.money = (element.price * element.operateQuantity).toFixed(2);
      // if (!element.money||element.money=='NaN') {
      //   element.money = 0;
      // }
      // this.$set(this.otherOutStock.tableData, this.tableIndex, element);
    },
    /**
     * 销售小组变更事件
     */
    handleSelectGroupId: function (groupId) {
      if (tempGroupId) {
        if (this.otherOutStock.tableData.length > 0) {
          this.otherOutStock.groupId = tempGroupId
          this.$message.warning("请先清除掉选择的产品信息再切换销售组")
          return false
        }
      }
      tempGroupId = groupId
      //发货仓
      // let options = this.warehouseOptions.filter(obj => {
      //   return obj.warehouseId == oldWarehouseId;
      // });
      // //若清空选项
      // if (options.length == 1) {
      //   //发货仓
      //   let opt = options[0];
      // } else {
      //   this.selectList = [];
      //   this.productData = [];
      // }
      // this.otherOutStock.warehouseId;
    },
    /**
     * 发货仓变更事件
     */
    handleSelectWarehouseOut: function (oldWarehouseId) {
      if (tempHouseId) {
        if (this.otherOutStock.tableData.length > 0) {
          this.otherOutStock.warehouseId = tempHouseId
          this.$message.warning("请先清除掉选择的产品信息再切换仓库")
          return false
        }
      }
      tempHouseId = oldWarehouseId
      if (this.otherOutStock.tableData.length > 0) {
        this.$message.warning("请先清除掉选择的产品信息再切换仓库")
        return false
      }
      //发货仓
      let options = this.warehouseOptions.filter((obj) => {
        return obj.warehouseId == oldWarehouseId
      })
      //若清空选项
      if (options.length == 1) {
        //发货仓
        let opt = options[0]
      } else {
        this.selectList = []
        this.productData = []
      }
      // this.otherOutStock.warehouseId;
    },
    //选中行事件
    rowClick: function (row, column, event) {
      this.setCurrentIndex(row.$index)
    },
    setCurrentIndex(currentIndex) {
      //当前选中行
      this.tableIndex = currentIndex
    },
    //删除一行
    handleDelRow(row, index) {
      const element = this.otherOutStock.tableData[index]
      this.otherOutStock.tableData.splice(index, 1)
    },
    //选择产品
    selectProduct() {
      // if (!this.otherOutStock.groupId) {
      //   this.$message.warning("请先选择销售组")
      //   return
      // }
      if (!this.otherOutStock.warehouseId) {
        this.$message.warning("请先选择仓库")
        return
      }
      this.searchChange(this.searchFormConfirm, this.page)
      this.productDialog = true
    },
    handleSave(isSubmit) {
      if (this.otherOutStock.tableData.length <= 0) {
        this.$message.warning("请先选择产品")
        return
      }
      if (this.saveClickValidate()) {
        const tip = isSubmit ? "保存并提交审核" : "保存"
        var _this = this
        // _this.loading = true;
        /**
         * 发送保存请求
         */
        this.otherOutStock.tableData.forEach((item) => {
          item.price = item.taxPrice
          item.noneTaxPrice = item.poPrice
        })
        var obj = {
          orderNo: this.otherOutStock.orderNo,
          warehouseId: this.otherOutStock.warehouseId,
          businessType: this.otherOutStock.businessTypeId,
          corporationId: this.otherOutStock.corporationId,
          //状态查看 bse_status_order_record表
          order: isSubmit == true ? 1 : 0,
          groupId: this.otherOutStock.groupId,
          remark: this.otherOutStock.remark,
          detailList: this.otherOutStock.tableData,
          platform: this.otherOutStock.platform,
          site: this.otherOutStock.site
        }
        saveOtherOutStock(obj)
          .then((response) => {
            if (response.data.code == 0) {
              if (!this.otherOutStock.orderNo) {
                //上传成功后把单号复制
                this.otherOutStock.createTime = response.data.data.createTime
                this.otherOutStock.orderNo = response.data.data.orderNo
              }
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              })
              if (!isSubmit) {
                //刷新父页面不关闭
                if (this.$parent.$refs.tagNavigate) {
                  this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
                }
              } else {
                if (this.$parent.$refs.tagNavigate) {
                  this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
                }
              }
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("操作失败")
              return
            }
          })
          .finally(() => {
            _this.loading = false
          })
      }
    },
    /**
     * 保存前检验数据
     */
    saveClickValidate(data) {
      let flag = true
      this.$refs["otherOutStockForm"].validate((valid, rules) => {
        if (!valid) {
          flag = valid
          Object.keys(rules).forEach((item, index) => {
            if (index === 0) {
              this.$message.error(rules[item][0].message)
            }
          })
        }
      })
      return flag
    },
    //验证明细
    checkTableRows() {
      //验证是否选择中sku
      let letRowIsNull = this.otherOutStock.tableData.filter((row, index) => {
        return !row.skuId || row.skuId == ""
      })
      if (letRowIsNull.length > 0) {
        return "请选择SKU"
      }
      var fallSku = []
      //验证如果含税 含税单价和交易税率是否填写
      this.otherOutStock.tableData.filter((row, index) => {
        if (row.taxType == 1) {
          if (!row.taxPrice || !row.taxRate) {
            fallSku.push(row.skuName)
          }
        }
      })
      if (fallSku.length > 0) {
        return "请填写SKU:" + fallSku.join(",") + "，的含税单价或交易税率"
      }
      //验证附件是否上传
      if (!this.inquiryForm.inquiryEvidence || this.inquiryForm.inquiryEvidence == "") {
        return "请上传询价凭证"
      }
    },
    /**
     * 查法人
     */
    getCorporation() {
      //1为非税
      var obj = {
        taxQualification: [1]
      }
      getCorporationList(obj).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
          this.corporationOptions.forEach((item) => {
            if (item.corporationName == "甜秘密创新有限公司") {
              this.otherInStock.corporationId = item.corporationId
            }
          })
        }
      })
    },
    /**
     * 查询销售组
     */
    getGroupAll: function (groupId) {
      var params
      if (!groupId) {
        params = {
          groupFunctionName: "销售类",
          authority: false
        }
      } else {
        params = {
          groupId: groupId,
          authority: false
        }
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
          if (this.salesGroupOptions.length == 1) {
            this.otherOutStock.groupId = this.salesGroupOptions[0].groupId
          }
        }
      })
    },
    /**
     * 选择产品table加载
     */
    getList(page, params) {
      this.searchFormConfirm.warehouseId = this.otherOutStock.warehouseId
      this.searchFormConfirm.groupId = this.otherOutStock.groupId
      this.searchFormConfirm.corporationId = this.otherOutStock.corporationId
      this.searchFormConfirm.platform = this.otherOutStock.platform
      this.searchFormConfirm.site = this.otherOutStock.site
      this.searchFormConfirm.type = "1"
      // this.tableLoading = true;
      this.page.currentPage = page.currentPage

      getProductList(
        Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          ...params,
          ...this.searchFormConfirm
        })
      ).then((response) => {
        this.productData = response.data.data.records
        this.page.total = response.data.data.total
        // this.tableLoading = false;
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
      this.page.currentPage = 1
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
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      //this.selectList = tableData;
      this.selectList = deepClone(tableData)
    },
    //清除选中
    clearSelectClear() {
      this.$refs.productCrud.selectClear()
    },
    /**
     * 确定选中产品
     */
    confirmProduct() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请勾选数据")
        return
      }
      console.log(this.selectList)
      //验证
      var flag = true
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        let options = this.otherOutStock.tableData.filter((obj) => {
          return (
            // obj.bsePlatformSkuId == element.bsePlatformSkuId &&
            // obj.taxType == element.taxType &&
            // obj.stockLocationId == element.stockLocationId
            obj.skuCode == element.skuCode
          )
        })
        if (options.length == 1) {
          let opt = options[0]
          var taxType = opt.taxType == 1 ? "含税" : "非税"
          this.$message.warning("SKU：" + opt.skuCode + "已存在，不允许重复")
          // this.$message.warning(
          //   "平台SKU:" +
          //   opt.platformSkuCode +
          //   "(" +
          //   taxType +
          //   ")，库位" +
          //   opt.locationCode +
          //   "已存在，不允许重复"
          // )
          flag = false
          return false
        }
      }
      if (!flag) {
        return
      }

      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        this.otherOutStock.tableData.push(element)
      }
      this.productDialog = false
      this.clearSelectClear()
    },
    // 改变法人主体
    changeCorporationId(val) {
      if (val) {
        let { corporationCode } = this.corporationOptions.find((item) => item.corporationId === val)
        // 获取仓库
        getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
          if (res.data.code === 0) {
            this.warehouseOptions = res.data.data
          }
        })
      } else {
        this.warehouseOptions = []
        this.otherOutStock.warehouseId = null
      }
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
