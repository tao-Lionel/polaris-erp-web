<template>
  <div id="porequisition">
    <basic-container class="createOrDetailPorequisiton">
      <div>
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '请购单',
            list: [{ label: '请购人', value: userInfo.displayname }]
          }"
        >
        </detail-template>

        <!-- 基本信息 -->
        <detail-wrapper :options="{ title: '基本信息', customContentStyle: { padding: '8px' } }">
          <el-form ref="groupForm" :model="groupInfo" status-icon :inline="true" :rules="groupRules">
            <el-form-item prop="poRequisitonType" label="单据类型" label-width="80px">
              <el-radio v-model="groupInfo.poRequisitonType" :label="2">DI订单</el-radio>
              <el-radio v-model="groupInfo.poRequisitonType" :label="1">普通订单</el-radio>
            </el-form-item>
            <el-form-item prop="expectDelivery" label="销售期望交期" label-width="150px">
              <el-date-picker
                size="mini"
                v-model="groupInfo.expectDelivery"
                type="date"
                clearable
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="remark" label-width="50px">
              <el-input
                v-model="groupInfo.remark"
                type="textarea"
                size="mini"
                clearable
                placeholder="不得超过200个字符"
                maxlength="200"
                :autosize="{ minRows: 2, maxRows: 6 }"
                style="width: 220px"
              ></el-input>
            </el-form-item>
          </el-form>
        </detail-wrapper>

        <!-- 请购产品 -->
        <detail-wrapper :options="{ title: '请购产品' }" style="position: relative">
          <div style="margin-left: 10px; position: absolute; top: 4px; left: 100px">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="text">添加请购明细</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">EXCEL导入</el-dropdown-item>
                <el-dropdown-item :command="2">复制导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <avue-crud
            :data="data"
            :option="tableOption"
            :page="page"
            @row-click="rowClick"
            style="padding: 4px; box-sizing: border-box"
            @current-change="currentChange"
          >
            <template slot="skuCode" slot-scope="scope">
              <!-- sku -->
              <el-form @submit.prevent.native status-icon :model="scope.row">
                <el-form-item prop="skuCode" :rules="scope.column.rules">
                  <el-autocomplete
                    size="mini"
                    class="inline-input"
                    clearable
                    v-model="scope.row.skuCode"
                    :fetch-suggestions="fetchSuggestions"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelectSkuCode"
                    :disabled="isSubmit"
                    @clear="clear(scope.row.$index)"
                  ></el-autocomplete>
                </el-form-item>
              </el-form>
            </template>
            <!-- 请购数量 -->
            <template slot="requisitionQuantity" slot-scope="scope">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form @submit.prevent.native status-icon :model="scope.row">
                    <el-form-item prop="requisitionQuantity" :rules="scope.column.rules">
                      <el-input
                        size="mini"
                        clearable
                        :disabled="isSubmit"
                        maxlength="9"
                        v-model.number="scope.row.requisitionQuantity"
                        type="number"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <p class="line-text" style="padding-top: 10px">单箱数：{{ scope.row.boxs }}</p>
                </el-col>
              </el-row>
            </template>
            <template slot="cabinetCode" slot-scope="scope">
              <div style="display: flex">
                <el-input v-model.trim="scope.row.cabinetCode" size="small" placeholder="请输入排柜号"></el-input>
                <el-button type="text" @click="fillData(scope.row, 'cabinetCode')" v-if="scope.row.$_id === 1"
                  >填充</el-button
                >
              </div>
            </template>
            <!-- 平台 -->
            <template slot="platformCode" slot-scope="scope">
              <el-form @submit.prevent.native status-icon :model="scope.row">
                <el-form-item prop="platformCode" :rules="scope.column.rules">
                  <div style="display: flex">
                    <el-select
                      v-model="scope.row.platformCode"
                      size="small"
                      placeholder="请选择"
                      @change="getSit(scope.row)"
                      clearable
                    >
                      <el-option
                        v-for="item in platform"
                        :key="item.platformTypeCode"
                        :label="item.platformTypeName"
                        :value="item.platformTypeCode"
                      >
                      </el-option>
                    </el-select>
                    <el-button type="text" @click="fillData(scope.row, 'platformCode')" v-if="scope.row.$_id === 1"
                      >填充</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </template>
            <!-- 站点 -->
            <template slot="sitCode" slot-scope="scope">
              <el-form @submit.prevent.native status-icon :model="scope.row">
                <el-form-item prop="sitCode" :rules="scope.column.rules">
                  <div style="display: flex">
                    <el-select
                      v-model="scope.row.sitCode"
                      :disabled="!scope.row.platformCode"
                      size="small"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in scope.row.sitArr"
                        :key="item.sitEnName"
                        :label="item.sitEnName"
                        :value="item.sitEnName"
                      >
                      </el-option>
                    </el-select>
                    <el-button type="text" @click="fillData(scope.row, 'sitCode')" v-if="scope.row.$_id === 1"
                      >填充</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </template>

            <!-- 操作 -->
            <template slot="oprateHandle" slot-scope="scope">
              <div style="text-align: right" v-if="isSubmit">
                <i class="icon-xinzeng y-icon-delect"></i>
                <i class="icon-shanchu y-icon-delect"></i>
              </div>
              <div style="text-align: right" v-if="!isSubmit">
                <i class="icon-xinzeng y-icon-delect" v-if="scope.row.$_id === dataAll.length" @click="handleAdd"></i>
                <i class="icon-shanchu y-icon-delect" @click="handleDel(scope.row.$_id)"></i>
              </div>
            </template>
          </avue-crud>
        </detail-wrapper>

        <!-- 操作按钮 -->
        <el-row class="pore-submit">
          <el-col :span="24">
            <div class="text-align-center">
              <el-button
                @click="handleWithdrawSubmit"
                size="small"
                :loading="loading"
                v-if="permissions.purchase_porequisiton_submit && isSubmit"
                >撤销提交</el-button
              >
              <el-button
                type="primary"
                @click="handleSubmit"
                size="small"
                :loading="loading"
                v-if="permissions.purchase_porequisiton_submit && !isSubmit"
                >提 交</el-button
              >
              <!-- <el-button
                type="primary"
                @click="handleSave"
                size="small"
                :loading="loading"
                v-if="permissions.purchase_porequisiton_save && !isSubmit"
                >保 存
              </el-button> -->
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 复制导入 -->
      <el-dialog
        title="商品导入"
        :visible.sync="copyStatus"
        width="30%"
        :close-on-click-modal="false"
        :before-close="copyCancel"
        center
      >
        <div style="display: flex">
          <div>
            <el-radio v-model="isRadio" :label="2">商品编码、库存</el-radio>
            <div style="padding: 10px 0 0 24px; font-size: 13px; color: red; line-height: 20px">
              <p>NV0M807-10-T 10</p>
              <p>NV0M807-10-TXL 10</p>
            </div>
          </div>
        </div>
        <el-input
          clearable
          style="padding: 0 10px; margin: 10px 0 5px; box-sizing: border-box"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          placeholder="请输入内容"
          v-model="copyForm"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="copyCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="copyConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>

    <commonImport
      ref="commonImport"
      :downloadUrl="downloadUrl"
      :fileSuffix="fileSuffix"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
    >
    </commonImport>
  </div>
</template>

<script>
import {
  saveList,
  submitList,
  updateList,
  importPreview,
  getPrdSkuInfoBySkusNoInner
} from "@/api/purchase/porequisiton"
import { getByLikeSkuCode } from "@/api/product/prdsku"
import { getPlayTypeAll, getSit } from "@/api/purchase/order/poorder"
import commonImport from "@/views/cockpit/commonImport"
import { mapGetters } from "vuex"
import { tableOptionCreate, groupRules } from "@/const/crud/purchase/porequisiton"

export default {
  name: "createPorequisiton",
  components: {
    commonImport
  },
  data() {
    return {
      isRadio: 2,
      copyForm: "",
      copyStatus: false,
      downloadUrl: "/purchase/porequisiton/poRequisitonDownload",
      fileSuffix: ".xlsx",
      excelDangerStatus: false,
      isSubmit: false,
      groupInfo: {
        expectDelivery: "",
        poRequisitonType: 1
      },
      requisitionGroupOptions: [],
      tableOption: tableOptionCreate,
      index: 0,
      data: [], // 分页数据
      dataAll: [
        {
          skuId: "",
          skuCode: "",
          skuCodeCheck: "",
          skuName: "",
          skuLength: "",
          skuWidth: "",
          skuHeight: "",
          packageLength: "",
          packageWidth: "",
          packageHeight: "",
          requisitionNo: "",
          requisitionQuantity: 0,
          platformCode: "",
          sitCode: "",
          poCode: "",
          cabinetCode: "",
          expectDelivery: "",
          remarks: "",
          notes: ""
        }
      ], // 总的数据
      list: [],
      // pickerOptions: {
      //   disabledDate: (time) => {
      //     let nowData = new Date()
      //     nowData = new Date(nowData.setDate(nowData.getDate() - 1))
      //     return time < nowData
      //   }
      // },
      lastRequisitionGroupId: null,
      platform: [],
      sit: [],
      loading: false,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [20]
      },
      searchSkuCode: "",
      groupRules
    }
  },
  created() {
    getPlayTypeAll().then((res) => {
      if (res.data.code === 0) {
        this.platform = res.data.data
      }
    })
    // 获取所有站点
    getSit([]).then((res) => {
      if (res.status === 200) {
        this.sit = res.data
      }
    })
    this.data = this.dataAll.slice(0, 1)
  },

  mounted: function () {},
  computed: {
    ...mapGetters(["permissions", "userInfo"])
  },
  methods: {
    fillData(row, key) {
      if (!row[key]) {
        this.$message.warning("请先选择或者填写数据，在进行填充！")
        return
      }
      if (key === "platformCode") {
        for (let i = 0; i < this.dataAll.length; i++) {
          this.$set(this.dataAll[i], key, row[key])
          for (let j = 0; j < this.platform.length; j++) {
            if (this.dataAll[i].platformCode === this.platform[j].platformTypeCode) {
              this.dataAll[i].platformId = this.platform[j].platformTypeId
            }
          }
        }
        this.dataAll.forEach((item) => {
          const sitArr = this.sit.filter((sitItem) => item.platformId === sitItem.sitType)
          this.$set(item, "sitArr", sitArr)
        })
      } else if (key === "sitCode") {
        for (let i = 0; i < this.dataAll.length; i++) {
          let sitArr = this.dataAll[i].sitArr
          for (let j = 0; j < sitArr.length; j++) {
            if (sitArr[j].sitEnName === row[key]) {
              this.$set(this.dataAll[i], key, row[key])
            }
          }
        }
      } else {
        this.dataAll.forEach((item) => {
          this.$set(item, key, row[key])
        })
      }
      this.$message.success("填充成功")
    },
    copyConfirm() {
      let arr = this.copyForm
        .trim()
        .split("\n")
        .map((item) => {
          item = item.trim().replace(/\t| /g, "~~~")
          let skuCodeArr = item.split("~~~")
          return {
            skuCode: skuCodeArr[0],
            requisitionQuantity: skuCodeArr[1] ? Number(skuCodeArr[1]) : 0
          }
        })
      const params = arr.map((item) => item.skuCode)
      const requisitionArr = []
      getPrdSkuInfoBySkusNoInner(params).then((res) => {
        if (res.data && res.data.length) {
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < res.data.length; j++) {
              if (arr[i].skuCode === res.data[j].skuCode) {
                requisitionArr.push({
                  skuId: res.data[j].skuId,
                  skuCode: res.data[j].skuCode,
                  skuCodeCheck: res.data[j].skuCode,
                  skuName: res.data[j].skuName,
                  skuLength: res.data[j].skuLength,
                  skuWidth: res.data[j].skuWidth,
                  skuHeight: res.data[j].skuHeight,
                  packageLength: res.data[j].packageLength,
                  packageWidth: res.data[j].packageWidth,
                  packageHeight: res.data[j].packageHeight,
                  requisitionNo: "",
                  requisitionQuantity: parseFloat(arr[i].requisitionQuantity)
                    ? parseFloat(arr[i].requisitionQuantity)
                    : "",
                  platformCode: "",
                  sitCode: "",
                  poCode: "",
                  cabinetCode: "",
                  expectDelivery: "",
                  remarks: "",
                  notes: ""
                })
              }
            }
          }
          this.page.currentPage = 1
          this.dataAll = requisitionArr
          this.data = requisitionArr.slice(
            (this.page.currentPage - 1) * this.page.pageSize,
            this.page.currentPage * this.page.pageSize
          )
          this.page.total = requisitionArr.length
          this.copyStatus = false
        }
      })
    },
    copyCancel() {
      this.copyForm = ""
      this.copyStatus = false
    },
    handleCommand(val) {
      val === 1 ? this.$refs.commonImport.syncFn() : (this.copyStatus = true)
    },
    currentChange(val) {
      document.getElementsByClassName("el-table__body-wrapper")[0].scrollTop = 0
      this.page.currentPage = val
      this.data = this.dataAll.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      )
    },
    async importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      let res = await importPreview(formdata)
      this.$refs.commonImport.closeFullScreen()
      if (res.data.code === 0) {
        if (res.data.data.poRequisitonList.length) {
          this.groupInfo.poCode = res.data.data.poRequisitonList[0].poCode
          this.groupInfo.cabinetCode = res.data.data.poRequisitonList[0].cabinetCode
        }
        let data = res.data.data.poRequisitonList
        for (let i = 0; i < data.length; i++) {
          data[i].skuCodeCheck = data[i].skuCode
          for (let j = 0; j < this.platform.length; j++) {
            if (data[i].platformCode === this.platform[j].platformTypeCode) {
              data[i].platformId = this.platform[j].platformTypeId
            }
          }
        }
        data.forEach((item) => {
          const sitArr = this.sit.filter((sitItem) => item.platformId === sitItem.sitType)
          this.$set(item, "sitArr", sitArr)
        })
        this.page.currentPage = 1
        this.data = data.slice(
          (this.page.currentPage - 1) * this.page.pageSize,
          this.page.currentPage * this.page.pageSize
        )
        this.dataAll = data
        this.page.total = data.length
        this.$refs.commonImport.syncFn()
        this.excelDangerStatus = false
        this.$message.success("导入成功")
      } else if (data.code == 1) {
        this.$message.error(data.msg)
      } else {
        this.$message.error("导入失败")
      }
    },
    /**
     * 确定操作行
     */
    rowClick: function (row, column, event) {
      this.index = row.$_id - 1
    },
    getSit(row) {
      if (!row.platformCode) return
      let platformTypeId = ""
      this.platform.forEach((item) => {
        if (item.platformTypeCode === row.platformCode) {
          platformTypeId = item.platformTypeId
        }
      })
      const sitArr = this.sit.filter((item) => platformTypeId === item.sitType)
      this.$set(row, "sitArr", sitArr)
      this.$set(row, "sitCode", "")
    },
    clear(index) {
      this.$set(this.data, index, {
        skuId: "",
        skuCode: "",
        skuName: "",
        modelName: "",
        specification: "",
        boxs: "",
        requisitionNo: "",
        requisitionQuantity: "",
        expectDelivery: "",
        remarks: "",
        skuCodeCheck: "",
        notes: ""
      })
    },
    /**
     * 模糊搜索,请求数据
     */
    fetchSuggestions(queryString, cb) {
      let queryParams = {
        isHideLoading: true,
        skuCode: queryString.trim(),
        purchaseState: true,
        codes: "1000,6000"
      }
      getByLikeSkuCode(queryParams).then((response) => {
        let restaurants = response.data.data
        cb(restaurants)
      })
    },
    /**
     * 选择
     */
    handleSelectSkuCode(item) {
      var flag = true
      if (flag) {
        this.dataAll[this.index].skuId = item.skuId
        this.dataAll[this.index].skuCode = item.skuCode
        this.dataAll[this.index].skuName = item.skuName
        this.dataAll[this.index].modelName = item.modelName
        this.dataAll[this.index].specification = item.specification
        this.dataAll[this.index].boxs = item.boxs
        this.dataAll[this.index].skuCodeCheck = item.skuCode
      } else {
        this.dataAll[this.index].skuCode = null
        this.$message.error("请购产品SKU:" + item.skuCode + "已经存在，不允许再次选择")
        return
      }
    },
    /**
     * 新增
     */
    handleAdd: function () {
      let obj = {
        skuId: "",
        skuCode: "",
        skuCodeCheck: "",
        skuName: "",
        skuLength: "",
        skuWidth: "",
        skuHeight: "",
        packageLength: "",
        packageWidth: "",
        packageHeight: "",
        requisitionNo: "",
        requisitionQuantity: 0,
        platformCode: "",
        sitCode: "",
        poCode: "",
        cabinetCode: "",
        expectDelivery: "",
        remarks: "",
        notes: ""
      }
      this.dataAll.push(obj)
      this.page.total++
      this.page.currentPage = Math.ceil(this.dataAll.length / this.page.pageSize)
      this.data = this.dataAll.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      )
    },
    /**
     * 删除
     */
    handleDel(id) {
      if (this.dataAll.length > 1) {
        this.dataAll.splice(id - 1, 1)
        this.page.total--
        this.dataAll.forEach((item, index) => {
          item.$_id = index + 1
        })
        this.page.currentPage = Math.ceil(this.dataAll.length / this.page.pageSize)
        this.data = this.dataAll.slice(
          (this.page.currentPage - 1) * this.page.pageSize,
          this.page.currentPage * this.page.pageSize
        )
      } else {
        this.$message.error("请购产品不能少于1行")
      }
    },
    /**
     * 保存
     */
    handleSave: function () {
      //保存或提交前验证
      this.checkSaveOrSubmitBefore()
      if (this.list.length == 0) {
        return
      }

      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i]
        let status = this.list.some((items, index) => {
          return (
            items.skuCode == item.skuCode &&
            items.platformCode == item.platformCode &&
            items.sitCode == item.sitCode &&
            items.poCode == item.poCode &&
            items.cabinetCode == item.cabinetCode &&
            i !== index
          )
        })
        if (status) {
          this.$message.warning(`请购单产品中存在两条SKU：${item.skuCode}相同的两条数据，请合并成为一条数据！`)
          return
        }
      }

      this.$nextTick(function () {
        // this.loading = true
        const params = {
          poRequisitonList: this.list,
          poRequisitonTotal: {
            remark: this.groupInfo.remark ? this.groupInfo.remark : "",
            poRequisitonType: this.groupInfo.poRequisitonType ? this.groupInfo.poRequisitonType : "",
            expectDelivery: this.groupInfo.expectDelivery
          }
        }

        saveList(params)
          .then((response) => {
            this.loading = false
            if (response.data.code === 0) {
              this.goBack()
              this.$message.success("新建请购单成功")
            } else {
              this.$message.error(response.data.msg)
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
            return
          })
      })
    },
    /**
     * 提交
     */
    handleSubmit: function () {
      this.checkSaveOrSubmitBefore()

      if (this.list.length == 0) {
        return
      }
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i]
        let status = this.list.some((items, index) => {
          return (
            items.skuCode == item.skuCode &&
            items.platformCode == item.platformCode &&
            items.sitCode == item.sitCode &&
            items.poCode == item.poCode &&
            items.cabinetCode == item.cabinetCode &&
            i !== index
          )
        })
        if (status) {
          this.$message.warning(`请购单产品中存在两条SKU：${item.skuCode}相同的两条数据，请合并成为一条数据！`)
          return
        }
      }

      const params = {
        poRequisitonList: this.list,
        poRequisitonTotal: {
          remark: this.groupInfo.remark ? this.groupInfo.remark : "",
          poRequisitonType: this.groupInfo.poRequisitonType ? this.groupInfo.poRequisitonType : "",
          expectDelivery: this.groupInfo.expectDelivery
        }
      }

      this.$nextTick(function () {
        this.loading = true
        submitList(params)
          .then((response) => {
            this.loading = false
            if (response.data.code === 0) {
              this.goBack()
              this.$message.success("新建请购单成功")
            } else {
              this.$message.error(response.data.msg)
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
            return
          })
      })
    },
    /**
     * 撤销提交
     */
    handleWithdrawSubmit: function () {
      this.list = []
      if (!this.isSubmit) {
        this.$message.error("请购单未提交，不需要撤销提交")
        return
      }
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index]
        if (element.requisitionNo) {
          this.list.push(element.requisitionNo)
        }
      }
      if (this.list.length == 0) {
        this.$message.error("请购产品不得少于一个")
        return
      }
      let operateCode = "withdrawSubmit"
      let remark = ""

      this.loading = true
      updateList(this.list, operateCode, remark)
        .then((response) => {
          this.loading = false
          this.handleResponse(response, "撤销提交成功", "withdrawSubmit")
        })
        .catch(() => {
          this.$message.error("操作失败")
          return
        })
    },
    /**
     * 保存或提交前校验数据
     */
    async checkSaveOrSubmitBefore() {
      this.list = []
      if (this.isSubmit) {
        this.$message.error("请购单已提交提交，不允许保存或提交")
        return
      }

      var flag = true
      var tip = ""
      var reg = /^[0-9]+$/
      for (let index = 0; index < this.dataAll.length; index++) {
        const element = this.dataAll[index]
        if (element.skuCode && element.skuCode != element.skuCodeCheck) {
          tip = "第" + (index + 1) + "行，SKU:" + element.skuCode + "，不存在"
          flag = false
          break
        }

        if (element.skuId) {
          if (element.skuCode != element.skuCodeCheck) {
            tip = "第" + (index + 1) + "行，修改SKU后未从下拉列表中选值"
            flag = false
            break
          }
          if (!element.requisitionQuantity) {
            tip = "SKU：" + element.skuCode + "，请购数量不能为空"
            flag = false
            break
          }
          if (!reg.test(element.requisitionQuantity)) {
            tip = "SKU：" + element.skuCode + "，请购数量必须为正整数"
            flag = false
            break
          }
          if (parseInt(element.requisitionQuantity) <= 0) {
            tip = "SKU：" + element.skuCode + "，请购数量必须为正整数"
            flag = false
            break
          }
          // 取消请购数量需要为单箱数的整数倍，目前存在不是为整数的情况
          // if (element.requisitionQuantity % element.boxs > 0) {
          //   tip = "SKU：" + element.skuCode + "，请购数量需要为单箱数的整数倍!"
          //   flag = false
          //   break
          // }
          if (!element.platformCode) {
            tip = "SKU：" + element.skuCode + "，平台不能为空"
            flag = false
            break
          }
          if (!element.sitCode) {
            tip = "SKU：" + element.skuCode + "，站点不能为空"
            flag = false
            break
          }
          if (element.remarks && element.remarks.length > 200) {
            tip = "SKU：" + element.skuCode + "，说明不得超过200个字符"
            flag = false
            break
          }
          var date = new Date(element.expectDelivery)
          this.list.push({
            index: index,
            requisitionNo: element.requisitionNo,
            skuId: parseInt(element.skuId),
            skuCode: element.skuCode,
            requisitionQuantity: element.requisitionQuantity,
            expectDelivery: this.groupInfo.expectDelivery,
            remarks: element.remarks,
            platformCode: element.platformCode,
            sitCode: element.sitCode,
            poCode: element.poCode,
            cabinetCode: element.cabinetCode,
            notes: element.notes,
            poRequisitonType: this.groupInfo.poRequisitonType
          })
        }
      }

      // 校验同个排柜号的单据备注必须一致
      for (let i = 0; i < this.dataAll.length; i++) {
        for (let j = 0; j < this.dataAll.length; j++) {
          if (
            this.dataAll[i].cabinetCode === this.dataAll[j].cabinetCode &&
            this.dataAll[i].notes !== this.dataAll[j].notes
          ) {
            tip = `排柜号：${this.dataAll[j].cabinetCode}，的明细数据存在单据备注不一致的情况，请修改`
            flag = false
            break
          }
        }
      }

      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }

      let valid = await new Promise((resolve, reject) => {
        this.$refs.groupForm.validate((valid) => {
          resolve(valid)
        })
      })
      if (!valid) {
        this.$message.error("请完善基本信息")
        return
      }

      if (this.list.length == 0) {
        this.list = []
        this.$message.error("请购产品不得少于一个")
        return
      }
      if (!this.groupInfo.poRequisitonType) {
        this.$message.error("请选择对应的单据类型")
        return
      }
    },
    /**
     * 相应处理
     */
    handleResponse: function (response, tip, operateCode) {
      if (response.data.code === 0) {
        if (operateCode != "withdrawSubmit") {
          for (let index = 0; index < response.data.data.length; index++) {
            let element = response.data.data[index]
            // debugger
            if (element) {
              this.data[element.index].requisitionNo = element.requisitionNo
            }
          }
        }
        if (operateCode == "submit") {
          this.isSubmit = true
        } else {
          this.isSubmit = false
        }

        if (this.$parent.$refs.tagNavigate) {
          this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
        }
        this.$notify({
          title: "成功",
          message: tip,
          type: "success",
          duration: 2000
        })
      } else if (response.data.code == 1) {
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("操作失败")
        return
      }
    },
    goBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
@import "./index.scss";

#porequisition {
  .el-dropdown-link {
    cursor: pointer;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-row .el-form-item {
    padding: 0px;
  }
}
</style>
