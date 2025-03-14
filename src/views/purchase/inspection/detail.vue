<!-- 作者：王斌 -->
<template>
  <div class="delivery-wrapper">
    <basic-container>
      <el-form :model="basicForm" ref="basicForm" :rules="formAndTableRules">
        <div style="overflow: hidden">
          <detail-template
            :value="1"
            :options="{
              template: 1,
              title: '验货单',
              list: [
                { label: '单据编号', value: inspectionNo },
                { label: '单据时间', value: dataFormat(billDate) },
                { label: '验货时间', value: dataFormat(inspectionDate) },
                { label: '验货员', value: inspector },
                { label: '制单人', value: createName }
              ]
            }"
          ></detail-template>
          <!-- 【验货对象】 -->

          <detail-wrapper :options="{ title: '验货对象' }">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="供应商"
                  prop="supplierName"
                  label-width="70px"
                  :rules="formAndTableRules.supplierName"
                >
                  <el-autocomplete
                    size="mini"
                    class="inline-input"
                    clearable
                    v-model.trim="basicForm.supplierName"
                    :fetch-suggestions="fetchSuggestions"
                    placeholder="请输入检索"
                    :trigger-on-focus="false"
                    @select="handleSelectSupplier"
                    :disabled="isSubmit"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="115px"
                  label="验收联系方式"
                  prop="callphone"
                  :rules="formAndTableRules.callphone"
                >
                  <el-input
                    size="mini"
                    v-model="basicForm.callphone"
                    style="width: 200px"
                    :disabled="isSubmit"
                    placeholder="请输入11位手机号码"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label-width="85px"
                  label="验收地址"
                  prop="inspectionAdress"
                  :rules="formAndTableRules.inspectionAdress"
                >
                  <el-input
                    size="mini"
                    placeholder="不得超过200个字符的验货地址"
                    type="textarea"
                    autosize
                    v-model="basicForm.inspectionAdress"
                    maxlength="200"
                    style="maxheight: 70px"
                    :disabled="isSubmit"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>

          <!-- <el-row class="margginTB30">
            <el-col>
              <div class="floatLeft margginLR10">
                <strong>【验货对象】</strong>
              </div>
              <div class="floatLeft margginLR20">
                <el-form-item
                  label="供应商"
                  prop="supplierName"
                  :rules="formAndTableRules.supplierName"
                >
                  <el-autocomplete
                    size="small"
                    class="inline-input"
                    clearable
                    v-model.trim="basicForm.supplierName"
                    :fetch-suggestions="fetchSuggestions"
                    placeholder="请输入检索"
                    :trigger-on-focus="false"
                    @select="handleSelectSupplier"
                    :disabled="isSubmit"
                  ></el-autocomplete>
                </el-form-item>

                <el-form-item label="验收联系方式" prop="callphone" :rules="formAndTableRules.callphone">
                  <el-input
                    size="small"
                    v-model="basicForm.callphone"
                    style="width: 200px;"
                    :disabled="isSubmit"
                    placeholder="请输入11位手机号码"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="验收地址"
                  prop="inspectionAdress"
                  :rules="formAndTableRules.inspectionAdress"
                >
                  <el-input
                    size="small"
                    placeholder="不得超过200个字符的验货地址"
                    style="width: 300px;"
                    type="textarea"
                    :rows="2"
                    v-model="basicForm.inspectionAdress"
                    maxlength="200"
                    :disabled="isSubmit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row> -->

          <detail-wrapper :options="{ title: '验货明细', openPadding: true }">
            <avue-crud :data="basicForm.data" :option="tableOption" @row-click="rowClick">
              <!-- sku -->
              <template slot="skuCode" slot-scope="scope">
                <!-- <el-form status-icon :model="scope.row"> -->
                <el-form-item :prop="'data.' + scope.row.$index + '.skuCode'" :rules="formAndTableRules.skuCode">
                  <el-autocomplete
                    size="mini"
                    class="inline-input"
                    clearable
                    v-model.trim="scope.row.skuCode"
                    :fetch-suggestions="fetchSkuSuggestions"
                    placeholder="请输入检索"
                    :trigger-on-focus="false"
                    @select="handleSelectSku"
                    :disabled="isSubmit"
                  ></el-autocomplete>
                </el-form-item>
                <!-- </el-form> -->
              </template>
              <!-- 计划数量 -->
              <template slot="planQuantity" slot-scope="scope">
                <!-- <el-form status-icon :model="scope.row"> -->
                <el-form-item
                  :prop="'data.' + scope.row.$index + '.planQuantity'"
                  :rules="formAndTableRules.planQuantity"
                >
                  <el-input
                    size="mini"
                    v-model="scope.row.planQuantity"
                    style="max-width: 150px"
                    :disabled="isSubmit"
                    placeholder="计划数量"
                    maxlength="9"
                  ></el-input>
                </el-form-item>
                <!-- </el-form> -->
              </template>
              <!-- 说明 -->
              <template slot="remark" slot-scope="scope">
                <ul>
                  <li class="inline-class">
                    <!-- <el-form :model="scope.row"> -->
                    <el-form-item prop="remark">
                      <el-input
                        size="small"
                        type="textarea"
                        style="max-width: 200px; max-height: 60px"
                        clearable
                        autosize
                        placeholder="不得超过100个字符"
                        :disabled="isSubmit"
                        maxlength="100"
                        v-model="scope.row.remark"
                      ></el-input>
                    </el-form-item>
                    <!-- </el-form> -->
                  </li>
                  <li class="table-opration inline-class">
                    <i class="icon-shanchu y-icon-delect" @click="handleDel(scope.row, scope.row.$index)"></i>
                    <i
                      class="icon-xinzeng y-icon-delect"
                      v-if="scope.row.$index === basicForm.data.length - 1"
                      @click="handleAdd"
                    ></i>
                  </li>
                </ul>
              </template>
            </avue-crud>
          </detail-wrapper>

          <!-- 验货文件 -->
          <detail-wrapper :options="{ title: '验货文件', openPadding: true }">
            <div v-if="splitArr(basicForm.attachFileUrl).length == 0">无</div>
            <div v-if="splitArr(basicForm.attachFileUrl).length > 0">
              <el-popover placement="left" trigger="click" popper-class="subHight2">
                <span v-for="(item, index) in splitArr(basicForm.attachFileUrl)" :key="index">
                  <img style="max-width: 600px" :src="item" />
                </span>
                <el-button type="text" slot="reference" class="color-grey">查看</el-button> </el-popover
              >&nbsp;&nbsp;
              <el-button type="text" class="color-grey" @click="downloadzip">下载</el-button>
            </div>
          </detail-wrapper>
          <detail-wrapper :options="{ title: '验货备注', openPadding: true }">
            <el-input
              class="rm-border"
              size="small"
              placeholder="不得超过500个字符的验货备注"
              type="textarea"
              :rows="4"
              v-model="basicForm.inspectionRemark"
              maxlength="500"
              :disabled="isSubmit"
            ></el-input>
          </detail-wrapper>
          <!-- <el-row class="margginTB30">
            <el-col>
              <div class="floatLeft margginLR10">
                <strong>【验货备注】</strong>
              </div>
              <div class="floatLeft margginLR10">
                <el-input
                  size="small"
                  placeholder="不得超过500个字符的验货备注"
                  style="width: 500px;"
                  type="textarea"
                  :rows="4"
                  v-model="basicForm.inspectionRemark"
                  maxlength="500"
                  :disabled="isSubmit"
                ></el-input>
              </div>
            </el-col>
          </el-row> -->
          <el-row class="margginTB30">
            <el-col>
              <div class="floatRight margginLR10">
                <el-button icon="el-icon-plus" size="small" type="primary" @click="saveData" :disabled="isSubmit"
                  >保存</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import {
  getObj,
  addObj,
  putObj,
  delObj,
  getInspectionAddress,
  increase
} from "@/api/purchase/inspection/poinspectiondetail.js"
import { tableOption, formAndTableRules } from "@/const/crud/purchase/inspection/poinspectiondetail.js"
import { fetchList } from "@/api/purchase/inspection/poinspection.js"
import { getSupplierLikeNameIncludeProhibit } from "@/api/supplier/posupplier.js"
import { getAll } from "@/api/baseSetup/bsecorporation.js"
import { getByLikeSkuCodeAndCreateAuditComplete } from "@/api/product/prdsku"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { numberToString } from "@/const/crud/purchase/inquiryorder/poinquiryorder"

export default {
  name: "poinspectiondetail",
  data() {
    return {
      formAndTableRules: formAndTableRules,
      //搜索条件，和前端控件绑定
      searchForm: {
        value1: "",
        value2: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 1000 // 每页显示多少条
      },
      //  data: [{
      //       skuCode:'',
      //       skuName:'',
      //       modelName:'',
      //       planQuantity:'',
      //       remark:'',
      // }],

      isSubmit: false, //是否不可操作

      tableOption: tableOption,
      inspectionNo: this.$route.query.inspectionNo,
      billDate: "",
      inspector: "",
      createName: "",
      inspectionDate: "",

      basicForm: {
        supplierNo: "",
        supplierName: "",
        inspectionAdress: "",
        callphone: "",
        inspectionRemark: "",
        attachFileUrl: "",
        data: [
          {
            //table数据
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            planQuantity: "",
            remark: ""
          },
          {
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            planQuantity: "",
            remark: ""
          },
          {
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            planQuantity: "",
            remark: ""
          },
          {
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            planQuantity: "",
            remark: ""
          },
          {
            skuId: "",
            skuCode: "",
            skuName: "",
            modelName: "",
            planQuantity: "",
            remark: ""
          }
        ]
      }
    }
  },
  created() {
    this.getDisplayData()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //数据回显
    getDisplayData() {
      if (this.isNulls(this.inspectionNo)) {
        return
      }

      fetchList(
        Object.assign({
          current: this.page.currentPage,
          size: this.page.pageSize,
          inspectionNo: this.inspectionNo + ", ,"
        })
      ).then((response) => {
        if (response.data.code == 0) {
          var entity = response.data.data.records[0]
          this.billDate = entity.createTime
          this.inspectionDate = entity.inspectionDate
          this.createName = entity.createName
          this.inspector = entity.inspector
          this.basicForm.supplierNo = entity.supplierNo
          this.basicForm.supplierName = entity.supplierName
          this.basicForm.callphone = entity.callphone
          this.basicForm.inspectionAdress = entity.inspectionAdress
          this.basicForm.inspectionRemark = entity.inspectionRemark
          this.basicForm.attachFileUrl = entity.attachFile
          response.data.data.records.forEach((val) => {
            val.planQuantity = numberToString(val.planQuantity)
          })
          this.basicForm.data = response.data.data.records

          if (entity.status == 0) {
            this.isSubmit = false
          } else {
            this.isSubmit = true
          }
        } else {
          this.$message.error("数据查询异常!")
        }
      })
    },
    /**
     * 模糊搜索,请求数据
     */
    fetchSuggestions(queryString, cb) {
      //当为空的时候不进行查询
      if (queryString.trim() == "") {
        cb()
        return
      }
      var obj = {
        supplierName: queryString,
        isHideLoading: true
      }
      getSupplierLikeNameIncludeProhibit(obj).then((response) => {
        if (response.data.code == 0) {
          var arr = [{}]
          var list = response.data.data
          for (var i = 0; i < list.length; i++) {
            var temp = {
              value: list[i].supplierName,
              supplierNo: list[i].supplierNo
            }
            arr.push(temp)
          }
          cb(arr)
        }
      })
    },
    //查询验收地址和联系方式默认值
    handleSelectSupplier(item) {
      //console.log(item.supplierNo);
      this.basicForm.supplierNo = item.supplierNo
      getInspectionAddress(item.supplierNo).then((response) => {
        if (response.data.code == 0 && response.data.data != null) {
          this.basicForm.inspectionAdress = response.data.data.inspectionAddress
          this.basicForm.callphone = response.data.data.cellphone
        }
      })
    },
    /**
     * 模糊搜索,请求数据
     */
    fetchSkuSuggestions(queryString, cb) {
      //当为空的时候不进行查询
      if (queryString.trim() == "") {
        cb()
        return
      }

      let queryParams = {
        skuCode: queryString.trim(),
        isHideLoading: true
      }
      getByLikeSkuCodeAndCreateAuditComplete(queryParams).then((response) => {
        let restaurants = response.data.data
        console.log(restaurants)
        cb(restaurants)
      })
    },
    /**
     * 确认选择
     */
    handleSelectSku(item) {
      // console.log(item)
      var flag = true
      for (let index = 0; index < this.basicForm.data.length; index++) {
        const element = this.basicForm.data[index]
        if (this.index != index && item.skuId == element.skuId) {
          flag = false
          break
        }
      }
      if (flag) {
        this.basicForm.data[this.index].skuId = item.skuId
        this.basicForm.data[this.index].skuCode = item.skuCode
        this.basicForm.data[this.index].skuName = item.skuName
        this.basicForm.data[this.index].modelName = item.modelName
      } else {
        this.$message.error("选择的SKU:" + item.skuCode + "已经存在，不允许再次选择!")
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
     * 新增
     */
    handleAdd: function () {
      if (this.isSubmit) {
        return
      }
      this.basicForm.data.push({
        skuId: "",
        skuCode: "",
        skuName: "",
        modelName: "",
        planQuantity: "",
        remark: ""
      })
    },
    /**
     * 删除
     */
    handleDel(row, index) {
      if (this.isSubmit) {
        return
      }
      if (this.basicForm.data.length > 1) {
        this.basicForm.data.splice(index, 1)
      } else {
        this.$message.error("验货产品不能少于1个")
        return
      }
    },

    /**
     * 保存数据
     */
    saveData() {
      //清空没有选择sku的行,要再验证通过后删除，否则会报错
      var data = this.basicForm.data.filter((row, index) => {
        return row.skuId && row.skuId != ""
      })
      if (data.length == 0) {
        this.basicForm.data = [this.basicForm.data[0]]
        // this.inquiryForm.tableData=[];
        // this.$set(this.inquiryForm.tableData, 0, [this.inquiryForm.tableData[0]])
      } else {
        this.basicForm.data = data
        // this.$set(this.inquiryForm.tableData, data)
      }

      this.$nextTick(function () {
        if (!this.saveClickValidate()) {
          return
        }
        var poInspection = {
          inspectionNo: this.inspectionNo,
          supplierNo: this.basicForm.supplierNo,
          inspector: this.basicForm.inspector,
          callphone: this.basicForm.callphone,
          inspectionAdress: this.basicForm.inspectionAdress,
          inspectionRemark: this.basicForm.inspectionRemark
        }
        var list = []
        //var checkmsg = '';
        for (let index = 0; index < this.basicForm.data.length; index++) {
          const element = this.basicForm.data[index]
          if (this.isNulls(element.skuId)) {
            //checkmsg = checkmsg + "第"+ (index +1) +"行sku不是系统中带出的;";
            continue
          }
          var poInspectionDetail = {
            skuId: element.skuId,
            planQuantity: element.planQuantity,
            remark: element.remark
          }
          list.push(poInspectionDetail)
        }
        // if(checkmsg != ''){
        //   this.$message.error(checkmsg);
        //   return;
        // }
        if (list.length == 0) {
          this.$message.error("请选择系统中带出的SKU")
          return
        }
        var obj = {
          poInspection: poInspection,
          list: list
        }

        increase(obj).then((response) => {
          console.log(response.data.data)
          if (response.data.code == 0) {
            var entity = response.data.data
            this.inspectionNo = entity.inspectionNo
            this.createName = entity.createName
            this.billDate = entity.createTime
            this.$message.success("保存成功!")
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
            }
          } else {
            this.$message.error(response.data.msg)
          }
        })
      })
    },

    saveClickValidate() {
      let letRowIsNull = this.basicForm.data.filter((row, index) => {
        return !row.skuId || row.skuId == ""
      })
      if (letRowIsNull.length > 0) {
        return "请选择SKU"
      }
      let flag = true
      this.$refs["basicForm"].validate((valid, rules) => {
        if (!valid) {
          flag = valid
          Object.keys(rules).forEach((item, index) => {
            if (index === 0) {
              this.$message.error(rules[item][0].message)
            }
          })
        }
      })
      //检查供应商
      if (this.isNulls(this.basicForm.supplierNo)) {
        this.$message.error("请选择系统中带出的供应商!")
        flag = false
      }
      return flag
    },

    splitArr(str) {
      var arr = []
      if (this.isNulls(str)) {
        return arr
      }
      var arr2 = str.split(",")
      for (var k = 0; k < arr2.length; k++) {
        arr.push(getTokenUrl(arr2[k]))
      }
      return arr
    },
    //下载文件
    downloadzip() {
      this.downloadUrl = getTokenUrlFile("/api/purchase/poinspection/downloadZip/" + this.inspectionNo)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
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

.subHight2 {
  max-height: 500px;
  max-width: 800px;
  overflow-y: scroll;
  overflow-x: hidden;

  img {
    width: 100%;
  }
}

::v-deep.el-form-item__error {
  padding-top: 0px;
}
</style>
