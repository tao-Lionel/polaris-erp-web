<template>
  <div class="delivery-wrapper">
    <basic-container>
      <!-- 头部 -->
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '送货单',
          list: [
            { label: '单据编号', value: deliveryNo },
            { label: '单据时间', value: dataFormat(billDate) },
            { label: '采购员', value: purchaseUserName || userInfo.displayname }
          ]
        }"
      ></detail-template>

      <!-- 交易对象 -->
      <detail-template
        :value="1"
        :options="{
          template: 2,
          title: '交易对象',
          list: [
            { label: '送货单位', value: supplierName },
            { label: '签收单位', value: corporationName }
          ]
        }"
      ></detail-template>

      <!-- 【送货明细】 -->
      <detail-wrapper
        :options="{
          title: '送货明细',
          openPadding: true,
          subHeader: [
            { label: '币别', value: currency },
            { label: '合同编号', value: poContractNo }
          ]
        }"
      >
        <avue-crud
          :data="data"
          style="padding: 0"
          class="iod-address close-table-select"
          :option="tableOption"
          @row-click="rowClick"
        >
          <template slot="deliveryPlanNo" slot-scope="scope">
            <!-- 交货计划单号 -->
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="deliveryPlanNo">
                <el-select
                  size="small"
                  filterable
                  remote
                  reserve-keyword
                  @focus="rowClick(scope.row)"
                  @change="deliveryPlanChange(scope.row, scope.row.$index, scope.row.deliveryPlanNo)"
                  v-model.trim="scope.row.deliveryPlanNo"
                  :remote-method="selectDeliveryPlan"
                  placeholder="请输入内容"
                  :disabled="isSubmit"
                >
                  <el-option
                    v-for="item in deliveryPlanoptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>

          <!-- 送货数量 -->
          <template slot="deliveryQuantity" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="deliveryQuantity">
                <el-input
                  size="small"
                  v-model.trim="scope.row.deliveryQuantity"
                  placeholder="数量"
                  clearable
                  :disabled="isSubmit"
                  :maxlength="10"
                  @change="deliveryQuantityChange(scope.row, scope.row.$index)"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!-- 箱数 -->
          <template slot="boxCount" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="boxCount">
                <el-input
                  size="small"
                  v-model.trim="scope.row.boxCount"
                  placeholder="箱数"
                  clearable
                  style="width: 110px"
                  :disabled="isSubmit"
                  :maxlength="8"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!-- 不含税单价 -->
          <template slot="noTaxPrice" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="noTaxPrice">
                <el-input-number
                  size="small"
                  v-model.trim="scope.row.noTaxPrice"
                  placeholder="不含税单价"
                  clearable
                  :precision="2"
                  :controls="false"
                  style="width: 110px; text-align: left"
                  :disabled="isSubmit"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </template>
          <!-- 含税单价 -->
          <template slot="hasTaxPrice" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="hasTaxPrice">
                <el-input-number
                  size="small"
                  v-model.trim="scope.row.hasTaxPrice"
                  placeholder="含税单价"
                  clearable
                  :precision="2"
                  :controls="false"
                  style="width: 110px; text-align: left"
                  :disabled="isSubmit"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </template>
          <!-- 单价 -->
          <template slot="price" slot-scope="scope">
            <!-- 交货计划单号 -->
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="price">
                <el-select
                  size="small"
                  filterable
                  remote
                  reserve-keyword
                  @focus="rowClick(scope.row)"
                  v-model.trim="scope.row.price"
                  :remote-method="selectPrice"
                  placeholder="请输入内容"
                  :disabled="isSubmit"
                >
                  <el-option v-for="item in pricePtions" :key="item.value" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>

          <!-- 长 -->
          <template slot="boxLength" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="boxLength">
                <el-input
                  size="small"
                  v-model.trim="scope.row.boxLength"
                  clearable
                  :disabled="isSubmit"
                  :maxlength="9"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>

          <!-- 宽 -->
          <template slot="boxWidth" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="boxWidth">
                <el-input
                  size="small"
                  v-model.trim="scope.row.boxWidth"
                  clearable
                  :disabled="isSubmit"
                  :maxlength="9"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!-- 高 -->
          <template slot="boxHeight" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="boxHeight">
                <el-input
                  size="small"
                  v-model.trim="scope.row.boxHeight"
                  clearable
                  :disabled="isSubmit"
                  :maxlength="9"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>

          <!-- 单箱毛重 -->
          <template slot="boxGrossWeight" slot-scope="scope">
            <el-form @submit.prevent.native status-icon :model="scope.row">
              <el-form-item prop="boxGrossWeight">
                <el-input
                  size="small"
                  v-model.trim="scope.row.boxGrossWeight"
                  clearable
                  :disabled="isSubmit"
                  :maxlength="9"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!-- 说明 -->
          <template slot="remarks" slot-scope="scope">
            <ul style="display: flex; align-items: center">
              <li>
                <el-form @submit.prevent.native :model="scope.row">
                  <el-form-item prop="remarks">
                    <el-input
                      size="small"
                      type="textarea"
                      style="width: 200px"
                      clearable
                      autosize
                      placeholder="不得超过200个字符"
                      :disabled="isSubmit"
                      :maxlength="200"
                      v-model="scope.row.remarks"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </li>
              <li class="table-opration" style="margin-left: 15px">
                <i class="icon-shanchu y-icon-delect" @click="handleDel(scope.row, scope.row.$index)"></i>

                <i
                  class="icon-xinzeng y-icon-delect"
                  v-if="scope.row.$index === data.length - 1"
                  @click="handleAdd"
                ></i>
              </li>
            </ul>
          </template>
        </avue-crud>
      </detail-wrapper>
      <!-- 交货信息 -->

      <detail-wrapper
        :options="{
          title: '交货信息'
        }"
      >
        <el-form @submit.prevent.native ref="baseform" :model="baseform" label-width="70px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="送货日期">
                <el-date-picker
                  type="date"
                  size="mini"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="baseform.deliveryDate"
                  :disabled="isSubmit"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签收人">
                <el-input
                  placeholder="请输入签收人"
                  size="mini"
                  v-model="baseform.signer"
                  :disabled="isSubmit"
                  :maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="交货地址">
                <el-input
                  placeholder="请输入交货地址"
                  size="mini"
                  type="textarea"
                  autosize
                  v-model="baseform.deliveryAddress"
                  :disabled="isSubmit"
                  :maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="手机号码">
                <el-input
                  placeholder="请输入11位手机号码"
                  size="mini"
                  v-model="baseform.signCellphone"
                  :disabled="isSubmit"
                  :maxlength="11"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </detail-wrapper>

      <detail-wrapper :options="{ title: '备注', openPadding: true }">
        <el-input
          class="rm-border"
          size="small"
          type="textarea"
          :rows="3"
          v-model="baseform.deliveryRemarks"
          :disabled="isSubmit"
          placeholder="500个字符以内"
          :maxlength="500"
        ></el-input>
      </detail-wrapper>

      <div class="pull-right">
        <el-button type="primary" size="small" @click="addData" :disabled="isSubmit" v-if="permissions.poDelivery_save"
          >保存</el-button
        >
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  savaDeliveryData,
  submitDeliveryData,
  getHistoryData,
  getUseDeliveryPlanNo,
  getPlanNoRelationData,
  getPoOrderPrice
} from "@/api/purchase/delivery/podeliverydetail.js"
import { tableOption } from "@/const/crud/purchase/delivery/podeliverydetail.js"
import { getPlatformSkuBySkuId } from "@/api/baseSetup/bseplatformsku"
import { deepClone } from "@/util/util"
import { mapGetters } from "vuex"
export default {
  name: "podeliverydetail",
  data() {
    return {
      isSubmit: false,
      tableOption: tableOption,
      data: [{}, {}, {}],
      list: [],
      poDelivery: {},
      baseform: {
        deliveryDate: "",
        deliveryAddress: "",
        signer: "",
        signCellphone: "",
        deliveryRemarks: ""
      },
      index: 0,
      poContractNo: "",
      currency: "",
      supplierName: "",
      corporationId: "",
      corporationName: "",
      purchaseUserName: "",
      deliveryNo: this.$route.query.deliveryNo,
      billDate: "",
      item: 20,
      istax: "",
      returnPlatformSkuListArr: [],
      deliveryPlanoptions: [],
      pricePtions: []
    }
  },

  mounted: function () {
    this.getData()
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    /**
     * 查找送货计划单
     */
    selectDeliveryPlan(queryString) {
      this.deliveryPlanoptions = []
      if (this.isNulls(queryString)) {
        return
      }
      if (this.index === 0) {
        this.poContractNo = ""
      }
      getUseDeliveryPlanNo({ deliveryPlanNo: queryString, poContractNo: this.poContractNo }).then((response) => {
        if (response.data.code == 0) {
          response.data.data.forEach((element) => {
            var obj = {
              value: element,
              label: element
            }
            this.deliveryPlanoptions.push(obj)
          })
        }
      })
    },

    /**
     * 变更交货计划
     */
    deliveryPlanChange(row, index, item) {
      if (index === 0) {
        this.data = [{}, {}, {}]
        this.poContractNo = ""
      }
      var checkFlag = false
      for (var i = 0; i < this.data.length; i++) {
        if (item == this.data[i].deliveryPlanNo && index != i) {
          this.$message.error("同一个送货单不能存在相同的交货计划单号!")
          this.data[this.index] = {}
          this.deliveryPlanoptions = []
          checkFlag = true
        }
      }
      if (checkFlag) return
      getPlanNoRelationData(item).then((response) => {
        if (response.data.code == 0) {
          var entity = response.data.data
          if (!this.isNulls(this.poContractNo) && this.poContractNo != entity.poContractNo) {
            this.$message.error("合同号不一致不能一起送货!")
            return
          }
          this.setbaseData(entity)
          this.setRowData(entity)
        }
      })
      this.deliveryPlanoptions = []
    },

    /**
     * 设置基础数据
     */
    setbaseData(entity) {
      //合同号
      this.poContractNo = entity.poContractNo
      //供应商
      this.supplierName = entity.supplierName
      //法人主体
      this.corporationName = entity.corporationName
      //采购员
      this.purchaseUserName = entity.purchaseUserName
      //币别
      this.currency = entity.currency
      //交货地址
      this.baseform.deliveryAddress = entity.deliveryAddress
      //签收人
      this.baseform.signer = entity.signer
      //手机号码
      this.baseform.signCellphone = entity.signCellphone

      if (entity.taxType == "1") {
        this.tableOption.column[13].label = "含税单价"
        this.tableOption.column[13].prop = "hasTaxPrice"
        this.istax = "含税"
      } else if (entity.taxType == "2") {
        // this.tableOption.column[13].label = "不含税单价";
        this.istax = "不含税"
      }
    },
    /**
     * 设置行内数据
     */
    setRowData(entity) {
      this.$set(this.data, this.index, entity)
    },

    /**
     * 获取价格
     */
    selectPrice(queryString) {
      this.pricePtions = []
      var deliveryPlanNo = this.data[this.index].deliveryPlanNo
      if (this.isNulls(deliveryPlanNo)) {
        this.$$message.error("请先填写交货计划单号")
        return
      }
      getPoOrderPrice({ deliveryPlanNo: deliveryPlanNo, price: queryString }).then((response) => {
        if (response.data.code == 0) {
          response.data.data.forEach((element) => {
            var obj = {
              value: element,
              label: element
            }
            this.pricePtions.push(obj)
          })
        }
      })
    },
    /**
     * 根据送货单号获取数据并展示
     */
    getData() {
      if (this.isNulls(this.deliveryNo)) {
        return
      }
      //后台获取数据并进行填充

      getHistoryData(this.deliveryNo).then((response) => {
        // debugger;
        if (response.data.code == 0) {
          var entity = response.data.data
          this.deliveryNo = entity.deliveryNo
          this.billDate = entity.createTime
          //采购员
          this.purchaseUserName = entity.purchaseUserName
          //送货单位
          this.supplierName = entity.supplierName
          //签收单位
          this.corporationName = entity.corporationName
          //币别
          this.currency = entity.currency
          //合同
          this.poContractNo = entity.poContractNo
          //是否含税
          if (entity.taxType == "1") {
            this.tableOption.column[13].label = "含税单价"
            this.tableOption.column[13].prop = "hasTaxPrice"
            this.istax = "含税"
          } else if (entity.taxType == "2") {
            // this.tableOption.column[13].label = "不含税单价";
            this.istax = "不含税"
          }
          //送货日期
          this.baseform.deliveryDate = entity.deliveryDate
          //交货地址
          this.baseform.deliveryAddress = entity.deliveryAddress
          //签收人
          this.baseform.signer = entity.signer
          //手机号码
          this.baseform.signCellphone = entity.signCellphone
          //送货备注
          this.baseform.deliveryRemarks = entity.deliveryRemarks
          //根据状态确定是否可输入
          if (entity.deliveryStatus != 0) {
            this.isSubmit = true
          }
          //填充明细数据
          this.data = entity.detailList
        }
      })
    },

    /**
     * 新增
     */
    handleAdd: function () {
      if (this.isSubmit) {
        return
      }
      this.data.push({})
    },
    /**
     * 删除
     */
    handleDel(row, index) {
      if (this.isSubmit) {
        return
      }
      if (this.data.length > 1) {
        this.data.splice(index, 1)
      } else {
        this.$message.error("送货产品不能少于1个")
        return
      }
    },
    /**
     * 确定操作行
     */
    rowClick: function (row, column, event) {
      this.index = row.$index
    },
    /**
     * 保存数据
     */
    addData() {
      if (this.isSubmit) {
        this.$message.error("已经确认安排了，不能再保存!")
        return
      }
      //保存前先进行数据检查
      this.checkData()
      if (this.list.length === 0) {
        return
      }
      var obj = {
        poDelivery: this.poDelivery,
        list: this.list
      }
      savaDeliveryData(obj).then((response) => {
        if (response.data.code == 0) {
          this.deliveryNo = response.data.data.deliveryNo
          this.billDate = response.data.data.createTime
          this.$message.success("保存成功")

          if (this.$parent.$refs.tagNavigate) {
            this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
          }
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },

    checkData() {
      //debugger;
      if (this.poContractNo == "") {
        this.$message.error("合同编号不能为空!")
        return
      }
      this.list = []
      var checkFlag = true
      console.log(1111, this.data)
      for (var i = 0; i < this.data.length; i++) {
        // debugger;
        var element = this.data[i]
        //计划单号
        // if (this.isNulls(element.deliveryPlanNo)) {
        //   continue;
        // }
        //sku
        if (this.isNulls(element.skuCode)) {
          this.$message.error("第" + (i + 1) + "行，SKU为空！")
          checkFlag = false
          break
        }
        //送货数量
        if (this.isNulls(element.deliveryQuantity)) {
          this.$message.error("第" + (i + 1) + "行，送货数量为空！")
          checkFlag = false
          break
        }
        //验证数字：/ ^\d+$/
        var regNuber = /^\+?[1-9]{1,8}\d*$/
        var regFloat = /^([0-9]{0,6})?(\.[0-9]{0,2})?$/
        var regFloat12 = /^([0-9]{0,10})?(\.[0-9]{0,2})?$/
        if (!regNuber.test(element.deliveryQuantity)) {
          this.$message.error("第" + (i + 1) + "行，送货数量请输入不超过8位的正整数！")
          checkFlag = false
          break
        }
        //检验还能签收的最大数量
        if (element.deliveryQuantity > element.maxQuantity) {
          this.$message.error("第" + (i + 1) + "行，送货数量最大为" + element.maxQuantity)
          checkFlag = false
          break
        }
        //箱数
        if (this.isNulls(element.boxCount)) {
          this.$message.error("第" + (i + 1) + "行，箱数为空！")
          checkFlag = false
          break
        }
        if (!regNuber.test(element.boxCount)) {
          this.$message.error("第" + (i + 1) + "行，箱数请输入不超过8位的正整数！")
          checkFlag = false
          break
        }
        //单价
        if (this.isNulls(element.price)) {
          this.$message.error("第" + (i + 1) + "行，单价为空！")
          checkFlag = false
          break
        }

        //长
        if (this.isNulls(element.boxLength)) {
          this.$message.error("第" + (i + 1) + "行，箱长为空！")
          checkFlag = false
          break
        }
        //长
        if (!regFloat.test(element.boxLength)) {
          this.$message.error("第" + (i + 1) + "行，箱长可输入6位整数，2位小数！")
          checkFlag = false
          break
        }

        //宽
        if (this.isNulls(element.boxWidth)) {
          this.$message.error("第" + (i + 1) + "行，箱宽为空！")
          checkFlag = false
          break
        }
        //宽
        if (!regFloat.test(element.boxWidth)) {
          this.$message.error("第" + (i + 1) + "行，箱宽可输入6位整数，2位小数！")
          checkFlag = false
          break
        }

        //高
        if (this.isNulls(element.boxHeight)) {
          this.$message.error("第" + (i + 1) + "行，箱高为空！")
          checkFlag = false
          break
        }
        //高
        if (!regFloat.test(element.boxHeight)) {
          this.$message.error("第" + (i + 1) + "行，箱高可输入6位整数，2位小数！")
          checkFlag = false
          break
        }

        //毛重
        if (this.isNulls(element.boxGrossWeight)) {
          this.$message.error("第" + (i + 1) + "行，毛重为空！")
          checkFlag = false
          break
        }
        //毛重
        if (!regFloat.test(element.boxGrossWeight)) {
          this.$message.error("第" + (i + 1) + "行，毛重可输入6位整数，2位小数！")
          checkFlag = false
          break
        }

        element.deliveryNo = this.deliveryNo
        this.list.push(element)
      }

      if (!checkFlag) {
        this.list = []
        return
      }

      if (this.isNulls(this.baseform.deliveryAddress)) {
        this.list = []
        this.$message.error("收货地址不能为空！")
        return
      }
      if (!this.isNulls(this.baseform.signCellphone)) {
        //验证数字：
        var regNuber = /^[0-9]+$/
        if (!regNuber.test(this.baseform.signCellphone) || this.baseform.signCellphone.length != 11) {
          this.$message.error("手机号需要为11位数字!")
          this.list = []
          return
        }
      }
      //主表信息
      this.poDelivery = {
        //送货单号
        deliveryNo: this.deliveryNo,
        //合同
        poContractNo: this.poContractNo,
        //交货日期
        deliveryDate: this.baseform.deliveryDate,
        //备注
        deliveryRemarks: this.baseform.deliveryRemarks,
        //地址
        deliveryAddress: this.baseform.deliveryAddress,
        //签收人
        signer: this.baseform.signer,
        //签收电话
        signCellphone: this.baseform.signCellphone
      }
    },

    //送货数量改变
    deliveryQuantityChange(row, index) {
      try {
        row.boxCount = Math.ceil(this.data[index].deliveryQuantity / this.data[index].boxQuantity)
        this.$set(this.data, index, row)
      } catch (error) {}
    },

    cancelData() {},
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
    dataFormat(time) {
      if (this.isNulls(time)) {
        return
      }
      time = new Date(time)
      return `${time.getFullYear()}-${
        time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)
      }-${time.getDate() >= 10 ? time.getDate() : "0" + time.getDate()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
