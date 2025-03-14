<template>
  <!-- 其它入库单 -->
  <div id="transfer_detail">
    <basic-container class>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '其他入库单',
          list: [
            { label: '单据编号', value: otherInStock.orderNo },
            { label: '单据日期', value: otherInStock.createTime },
            { label: '制单人', value: otherInStock.createByName || userInfo.displayname }
          ]
        }"
      ></detail-template>

      <el-form ref="otherInStockForm" :model="otherInStock" :rules="basicInfoFormRules" status-icon>
        <!-- 基本信息 -->
        <detail-wrapper :options="{ title: '基本信息' }">
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="销售组" prop="groupId" label-width="70px">
                <el-select v-model="otherInStock.groupId" size="small" clearable filterable :disabled="disabledFlag"
                  placeholder="请选择" @change="handleSelectGroupId(otherInStock.groupId)">
                  <el-option v-for="item in salesGroupOptions" :key="item.groupId" :label="item.name"
                    :value="item.groupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="法人主体" prop="corporationId" label-width="85px">
                <el-select
                  v-model="otherInStock.corporationId"
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
            <el-col :span="6">
              <!-- 平台 -->
              <el-form-item prop="platform" label="平台" label-width="85px" :rules="basicInfoFormRules.platform">
                <el-select
                  v-model="otherInStock.platform"
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
            <el-col :span="6">
              <!-- 站点 -->
              <el-form-item prop="site" label="站点" label-width="85px" :rules="basicInfoFormRules.site">
                <el-select v-model="otherInStock.site" size="small" clearable :disabled="disabledFlag">
                  <el-option
                    v-for="item in sitCountryOptions"
                    :key="item.bsePlatformSitId"
                    :label="item.sitEnName"
                    :value="item.sitEnName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入库日期" prop="inboundTime" label-width="85px">
                <el-date-picker
                  v-model="otherInStock.inboundTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  size="small"
                  clearable
                  :disabled="disabledFlag"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <!-- 发货信息 -->
        <detail-wrapper :options="{ title: '发货信息' }">
          <el-row>
            <el-col :span="8">
              <el-form-item label="仓库" label-width="55px" prop="warehouseId">
                <div v-if="disabledFlag || otherDisabledFlag">
                  {{ otherInStock.warehouseName }}
                </div>
                <el-select
                  v-else
                  v-model="otherInStock.warehouseId"
                  size="small"
                  filterable
                  clearable
                  :disabled="disabledFlag || otherDisabledFlag"
                  placeholder="请选择"
                  @change="handleSelectWarehouseIn(otherInStock.warehouseId)"
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
            <el-col :span="8">
              <el-form-item label="业务类型" label-width="90px" prop="businessTypeId">
                <el-select
                  v-model="otherInStock.businessTypeId"
                  size="small"
                  filterable
                  clearable
                  :disabled="disabledFlag || otherDisabledFlag"
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
            <!-- <el-col :span="8">
              <el-form-item label="供应商" label-width="70px" prop="supplierNo" :rules="basicInfoFormRules.supplierNo">
                <el-select v-model="otherInStock.supplierNo" size="small" filterable clearable :disabled="disabledFlag"
                  placeholder="请选择">
                  <el-option v-for="item in supplierOptions" :key="item.supplierNo" :label="item.supplierName"
                    :value="item.supplierNo"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <div class="iod-address">
            <p class="iod-address-title">备注:</p>
            <el-input
              class="iod-address-name address-con"
              maxlength="80"
              :disabled="disabledFlag"
              v-model="otherInStock.remark"
            />
          </div>
        </detail-wrapper>

        <!-- 产品信息 -->
        <div class="border-rang">
          <div class="title-wrapper">
            <span class="title">产品信息</span>
            <div style="float: right">
              <el-button
                :disabled="disabledFlag || otherDisabledFlag"
                type="primary"
                size="mini"
                @click="selectProduct()"
                round
                >选择产品</el-button
              >
            </div>
          </div>
          <avue-crud
            class="app-container"
            :data="otherInStock.tableData"
            :option="otherInStockDetailOption"
            @row-click="rowClick"
          >
            <!--数量 -->
            <template slot="operateQuantity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].operateQuantity'"
                :rules="basicInfoFormRules.operateQuantity"
              >
                <el-input-number
                  :disabled="disabledFlag || otherDisabledFlag"
                  size="mini"
                  max="9999"
                  :controls="false"
                  style="width: 100%"
                  min="1"
                  v-model="scope.row.operateQuantity"
                  @change="operateQuantityChange"
                ></el-input-number>
              </el-form-item>
              <!-- </el-form> -->
            </template>
            <!-- 库位 -->
            <template slot="stockLocation" slot-scope="scope">
              <!-- { @change="selectChange(scope.row,scope.row.$index,scope.row.stockLocationId)" -->
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].stockLocationId'"
                :rules="basicInfoFormRules.stockLocationId"
              >
                <el-select
                  v-model="scope.row.stockLocationId"
                  clearable
                  size="mini"
                  :disabled="disabledFlag || otherDisabledFlag"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in stockLocationOptions"
                    :key="item.stockLocationId"
                    :label="item.locationCode"
                    :value="item.stockLocationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 平台 -->
            <!-- <template slot="platform" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].platform'" :rules="basicInfoFormRules.platform">
                <el-select v-model="scope.row.platform" clearable size="mini" @change="changePlatform">
                  <el-option v-for="item in platformOption" :key="item.platformTypeId" :label="item.platformTypeCode"
                    :value="item.platformTypeCode"></el-option>
                </el-select>
              </el-form-item>
            </template> -->
            <!-- 站点 -->
            <!-- <template slot="site" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].site'" :rules="basicInfoFormRules.site">
                <el-select v-model="scope.row.site" size="mini" clearable>
                  <el-option v-for="item in sitCountryOptions" :key="item.bsePlatformSitId" :label="item.sitEnName"
                    :value="item.sitEnName"></el-option>
                </el-select>
              </el-form-item>
            </template> -->

            <!-- 单价 -->
            <!-- <template slot="price" slot-scope="scope">
              <el-form-item
                :prop="'tableData['+scope.row.$index+'].price'"
                :rules="basicInfoFormRules.price"
              >
                <el-input
                  :disabled="disabledFlag"
                  size="mini"
                  clearable
                  v-model="scope.row.price"
                  @change="operateQuantityChange"
                ></el-input>
              </el-form-item>
       
            </template> -->

            <!-- 自定义操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <div v-if="!(disabledFlag || otherDisabledFlag)">
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
          v-if="permissions.other_in_stock_approve"
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
              <!-- <el-form-item prop="platformSkuCode">
                <el-input v-model="searchForm.platformSkuCode" size="small" placeholder="输入平台SKU查询，多个逗号隔开"></el-input>
              </el-form-item> -->
              <el-form-item prop="spuCode">
                <el-input
                  v-model="searchForm.spuCode"
                  v-search-input
                  size="small"
                  placeholder="输入SPU查询，多个逗号隔开"
                ></el-input>
              </el-form-item>
              <el-form-item prop="skuCode">
                <el-input
                  v-model="searchForm.skuCode"
                  v-search-input
                  size="small"
                  placeholder="输入SKU查询，多个逗号隔开"
                ></el-input>
              </el-form-item>
              <el-form-item prop="skuName">
                <el-input v-model="searchForm.skuName" size="small" placeholder="输入产品名称搜索"></el-input>
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
// import { getPlatformSkuAndSkuInfo as getProductList } from "@/api/baseSetup/bseplatformsku"
// import { getBsePlatformSkuWmsStockPage as getProductList } from "@/api/warehouse/wmsstock";
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getBussinessType } from "@/api/warehouse/wmsbusinesstype"
import { otherInStockDetailOption, productTableOption } from "@/const/crud/warehouse/otherinstock/wmsotherinstock"
import { getSavedInfo, saveOtherInStock, getProductList } from "@/api/warehouse/otherinstock/wmsotherinstock"
import { getAll as getSupplierList } from "@/api/supplier/posupplier"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { getStockLocationInfo as getStockLocationList } from "@/api/baseSetup/wmsstocklocation/wmsstocklocation"
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
    /** 判断小数*/
    var validatePass = function (rules, value, callback) {
      if (!/^(([1-9]{1}[0-9]{0,5})|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback(new Error("请输入正数且最多2位小数"))
      } else {
        callback()
      }
    }
    return {
      disabledFlag: false,
      otherDisabledFlag: false,
      stockLocationOptions: [],
      bunsinessTypeOptions: [],
      salesGroupOptions: [],
      corporationOptions: [],
      supplierOptions: [],
      countryId: "",
      warehouseOptions: [],
      otherInStock: {
        type: "",
        corporationId: "",
        orderNo: "",
        createTime: "",
        businessTypeId: "",
        countryId: "",
        warehouseId: "",
        // groupId: "",
        tableData: [],
        detailList: []
        // platformCode: '',
        // sitEnName: ''
      },
      basicInfoFormRules: {
        groupId: [{ required: true, message: "请先选择销售组", trigger: "change" }],
        corporationId: [{ required: true, message: "请先选择法人主体", trigger: "change" }],
        warehouseId: [{ required: true, message: "请先选择发货仓", trigger: "change" }],
        stockLocationId: [{ required: true, message: "请先选择库位", trigger: "change" }],
        businessTypeId: [{ required: true, message: "请先选择业务类型", trigger: "change" }],
        platform: [{ required: true, message: "请先选择平台", trigger: "blur", type: "string" }],
        site: [{ required: true, message: "请先选择站点", trigger: "blur", type: "string" }],
        operateQuantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
          // {
          //   validator: validateNumber,
          //   message: "只能输入正整数",
          //   trigger: "blur"
          // }
        ],
        inboundTime: [
          {
            required: true,
            message: "请选择入库时间",
            trigger: "blur"
          }
        ]
        // supplierNo: [{ required: true, message: '请先选择供应商', trigger: 'blur' }]
        // price: [
        //   { required: true, message: "单价不能为空", trigger: "blur" },
        //   {
        //     validator: validatePass,
        //     trigger: "blur"
        //   }
        // ]
      },
      ///--------////
      // loading: false,
      otherInStockDetailOption: otherInStockDetailOption,
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
      tableLoading: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        skuCode: "",
        spuCode: "",
        skuName: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      platformOption: [],
      sitCountryOptions: []
    }
  },
  created() {
    this.otherInStock.orderNo = this.$route.query.orderNo
    this.loadAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    numberToString(val) {
      if (val === 0) return "0"
      if (!val) return ""
      if (typeof val === "string") {
        return val
      } else {
        return val.toString()
      }
    },
    //selectChange(row, index, stockLocationId) {
    // debugger;
    // row.stockLocationId = stockLocationId;
    //console.log(this.otherInStock.tableData,this.otherInStock.tableData.length, index, row)
    //this.$set(this.otherInStock.tableData, index, row);
    // },
    /**
     * 页面初始化
     */
    loadAll: function () {
      //获取平台
      getPlaTypeAll().then((res) => {
        this.platformOption = res.data.data
        console.log(this.platformOption)
      })
      //加载法人主体
      this.getCorporation()
      //加载供应商
      // this.getSupplier()

      //加载保存数据
      if (this.otherInStock.orderNo) {
        getSavedInfo({ orderNo: this.otherInStock.orderNo }).then((response) => {
          var data = response.data.data
          if (response.data.code == 0) {
            if (data.dataStatus != 0) {
              this.disabledFlag = true
            }
            tempHouseId = data.warehouseId
            tempGroupId = data.groupId
            this.otherInStock.createTime = data.createTime
            this.otherInStock.createByName = data.createByName
            this.otherInStock.businessTypeId = data.businessType
            this.otherInStock.warehouseId = data.warehouseId
            this.otherInStock.warehouseName = data.warehouseName
            this.otherInStock.groupId = data.groupId
            this.otherInStock.type = data.type
            this.otherInStock.corporationId = data.corporationId
            // this.otherInStock.supplierNo = data.supplierNo
            this.otherInStock.remark = data.remark
            this.otherInStock.platform = data.platform
            this.otherInStock.site = data.site
            this.otherInStock.inboundTime = data.inboundTime
            if (this.userInfo.userId != data.createBy) {
              this.getGroupAll(data.groupId)
              this.disabledFlag = true
            } else {
              this.getGroupAll()
              if (data.type == 3) {
                this.otherDisabledFlag = true
              }
            }

            // 加载业务类型
            this.getBussinessType()
            data.details.forEach((val) => {
              val.operateQuantity = this.numberToString(val.operateQuantity)
              // val.price = this.numberToString(val.price);
            })
            console.log("tableData", data.saveDetailList)
            this.$set(this.otherInStock, "tableData", data.details)
            //加载库位
            this.getStockLocation()

            if (this.otherInStock.funcState != 0) {
              var obj = {
                warehouseId: this.otherInStock.warehouseId,
                warehouseName: this.otherInStock.warehouseName
              }
              this.warehouseOptions.push(obj)
            }
            //如果库位被禁用 则手动Push
            this.otherInStock.tableData.forEach((item) => {
              if (item.locationCodeApproveStatus != 2) {
                var obj = {
                  stockLocationId: item.stockLocationId,
                  locationCode: item.locationCode
                }
                this.stockLocationOptions.push(obj)
              }
            })
          } else {
            this.$message.error("加载页面失败")
            return
          }
        })
      } else {
        //加业务类型
        this.getBussinessType()
        //加载销售组
        this.getGroupAll()
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
      console.log(this.otherInStock.tableData)
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
      if (this.otherInStock.type) {
        type = this.otherInStock.type
      } else {
        type = 1
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
      const element = deepClone(this.otherInStock.tableData[this.tableIndex])
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (!element.operateQuantity) {
        element.operateQuantity = ""
        return false
      }
      if (!reg.test(element.operateQuantity)) {
        this.$message.warning("只能输入正整数")
        element.operateQuantity = ""
        this.$set(this.otherInStock.tableData, this.tableIndex, element)
        return false
      }
      // element.money = (element.price * element.operateQuantity).toFixed(2);
      // if (!element.money||element.money=='NaN') {
      //   element.money = 0;
      // }

      this.$set(this.otherInStock.tableData, this.tableIndex, element)
    },
    /**
     * 销售组更事件
     */
    handleSelectGroupId: function (groupId) {
      if (tempGroupId) {
        if (this.otherInStock.tableData.length > 0) {
          this.otherInStock.groupId = tempGroupId
          this.$message.warning("请先清除掉选择的产品信息再切换销售组")
          return false
        }
      }
      tempGroupId = groupId
    },
    /**
     * 发货仓变更事件
     */
    handleSelectWarehouseIn: function (oldWarehouseId) {
      if (tempHouseId) {
        if (this.otherInStock.tableData.length > 0) {
          this.otherInStock.warehouseId = tempHouseId
          this.$message.warning("请先清除掉选择的产品信息再切换仓库")
          return false
        }
      }
      tempHouseId = oldWarehouseId
      if (this.otherInStock.tableData.length > 0) {
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
      // this.otherInStock.warehouseId;
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
      const element = this.otherInStock.tableData[index]
      this.otherInStock.tableData.splice(index, 1)
    },
    //选择产品
    selectProduct() {
      // if (!this.otherInStock.groupId) {
      //   this.$message.warning("请先选择销售组")
      //   return
      // }
      if (!this.otherInStock.warehouseId) {
        this.$message.warning("请先选择仓库")
        return
      }
      this.getStockLocation()
      this.searchChange(this.searchFormConfirm, this.page)
      this.productDialog = true
    },
    handleSave(isSubmit) {
      if (this.otherInStock.tableData.length <= 0) {
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
        var obj = this.otherInStock
        obj.businessType = this.otherInStock.businessTypeId
        obj.dataStatus = isSubmit == true ? 1 : 0
        obj.detailList = this.otherInStock.tableData
        var flag = true
        var optIdList = []
        this.stockLocationOptions.forEach((item) => {
          optIdList.push(item.stockLocationId)
        })
        //判断库存是否被禁用
        this.otherInStock.tableData.forEach((item) => {
          if (optIdList.indexOf(item.stockLocationId) == -1) {
            flag = false
            this.$message.error("库位" + item.locationCode + "不存在或禁用,请修改")
          }
        })
        var warehouseIdList = []
        this.warehouseOptions.forEach((item) => {
          warehouseIdList.push(item.warehouseId)
        })
        if (warehouseIdList.indexOf(this.otherInStock.warehouseId) == -1) {
          flag = false
          this.$message.error("仓库" + this.otherInStock.warehouseName + "不存在或禁用,请修改")
        }
        if (!flag) {
          // _this.loading = false;
          return
        }
        console.log("obj", obj)
        saveOtherInStock(obj).then((response) => {
          if (response.data.code == 0) {
            if (!this.otherInStock.orderNo) {
              //上传成功后把单号复制
              this.otherInStock.createTime = response.data.data.createTime
              this.otherInStock.orderNo = response.data.data.orderNo
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
        // .finally(() => {
        //   _this.loading = false;
        // });
      }
    },
    /**
     * 保存前检验数据
     */
    saveClickValidate(data) {
      let flag = true
      this.$refs["otherInStockForm"].validate((valid, rules) => {
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
            this.otherInStock.groupId = this.salesGroupOptions[0].groupId
          }
        }
      })
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
     * 查供应商
     */
    // getSupplier () {
    //   getSupplierList().then(response => {
    //     var data = response.data.data
    //     if (data && data.length > 0) {
    //       this.supplierOptions = data
    //       if (this.supplierOptions.length == 1) {
    //         this.otherInStock.supplierNo = this.supplierOptions[0].supplierNo
    //       }
    //     }
    //   })
    // },

    /**
     * 查询库位
     */ getStockLocation() {
      //仓库ID不为空时查库位
      if (this.otherInStock.warehouseId) {
        this.stockLocationOptions = []

        var query = {
          warehouseId: this.otherInStock.warehouseId
        }
        getStockLocationList(query).then((response) => {
          var data = response.data.data

          this.stockLocationOptions = data

          /* if (data && data.length > 0) {
            data.forEach(item => {
              this.stockLocationOptions.push(item);
            });
          }
          */
        })
      }
    },
    /**
     * 选择产品table加载
     */
    getList(page, params) {
      this.tableLoading = true
      this.page.currentPage = page.currentPage

      // params.groupId = this.otherInStock.groupId
      // params.supplierNo = this.otherInStock.supplierNo
      params.corporationId = this.otherInStock.corporationId
      params.warehouseId = this.otherInStock.warehouseId
      getProductList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
            // page: {
            //   current: page.currentPage,
            //   size: page.pageSize
            // }
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.productData = response.data.data.records

        this.page.total = response.data.data.total
        this.tableLoading = false
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
      //this.selectList = JSON.parse(JSON.stringify(tableData));
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
      //验证
      var flag = true
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        let options = this.otherInStock.tableData.filter((obj) => {
          return obj.bsePlatformSkuId == element.bsePlatformSkuId && obj.skuId == element.skuId
        })

        if (options.length == 1) {
          let opt = options[0]
          var taxType = opt.taxType == 1 ? "含税" : "非税"
          this.$message.warning("平台SKU:" + opt.platformSkuCode + "(" + opt.skuCode + ")，已存在，不允许重复")
          flag = false
          return false
        }
      }
      if (!flag) {
        return
      }
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        //默认为非税
        element.taxType = 2
        element.operateQuantity = ""
        var otl = this.otherInStock.tableData.length

        this.$set(this.otherInStock.tableData, this.otherInStock.tableData.length, element)

        if (this.stockLocationOptions.length === 1) {
          this.$set(this.otherInStock.tableData[otl], "stockLocationId", this.stockLocationOptions[0].stockLocationId)
          // this.otherInStock.tableData[
          //   otl
          // ].stockLocationId = this.stockLocationOptions[0].stockLocationId;
        }

        // this.otherInStock.tableData.push(element);
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
        this.otherInStock.warehouseId = null
      }
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
