<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangxiaowen (AukeyIT@aukeys.com)

  产品详情
  -->

<template>
  <div class="execution" id="prdDetail">
    <basic-container>
      <div class="spu-title">
        <!-- <span class="grid-content bg-purple" style="min-width:120px;">
          标准SPU:
          <span class="val-color">{{ spuCode }}</span>
        </span>
        <span> / </span> -->
        <span class="grid-content bg-purple">
          产品名称:
          <span class="val-color">{{ sku_response.skuName }}</span>
        </span>
        <!-- <span> / </span>
        <span class="grid-content bg-purple">
          型号:
          <span class="val-color">{{ spu_response.modelName }}</span>
        </span> -->
      </div>

      <div class="spu-content">
        <!-- <div class="prd-sku-select" style="">
          属性切换
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane size="small" v-for="(item, index) in spu_response.skuCodeList" :key="index" :label="item"
              :name="item"></el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane size="small" :label="skuCode" :name="skuCode"></el-tab-pane></el-tabs>
          展示过多时显示多选
          <el-select size="small" v-show="spareFlag" @change="selectNewSku" v-model="value4" filterable clearable
            placeholder="SKU">
            <el-option v-for="(item, index) in spare_skuList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div> -->

        <el-row style="background: #f7f8fb">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-carousel
                height="320px"
                :interval="3000"
                v-if="sku_response.skuPicList && sku_response.skuPicList.length > 0"
              >
                <el-carousel-item v-for="(pic, key) in sku_response.skuPicList" :key="key">
                  <img @click="imgShow(pic)" :src="pic" class="dt-img" :alt="pic" />
                  <!-- <img src="https://img.alicdn.com/simba/img/TB1BgZlTzTpK1RjSZKPSuu3UpXa.jpg" alt=""> -->
                </el-carousel-item>
                <!-- <el-carousel-item>
                <img src="https://img.alicdn.com/simba/img/TB1jrbHaLDH8KJjy1XcSuwpdXXa.jpg" alt="">
              </el-carousel-item>
              <el-carousel-item>
                <img src="https://img.alicdn.com/simba/img/TB1RQIeUBLoK1RjSZFuSutn0XXa.jpg" alt="">
              </el-carousel-item> -->
              </el-carousel>

              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </div>
          </el-col>
          <!-- sku头部信息 -->
          <el-col :span="16">
            <!-- grid-custom  -->
            <div class="grid-content bg-purple-light" style="margin-left: 20px">
              <!-- 品类 -->
              <!-- <p class="sku-name">{{ sku_response.skuName }}</p> -->
              <!-- 品牌 -->
              <!-- <p class="sku-name">{{ sku_response.skuName }}</p> -->
              <!-- <el-row>
              <el-col>
                <strong>SKU名称：</strong>
                <span>{{sku_response.skuName}}</span>
              </el-col>
            </el-row>-->
              <ul class="prod-status">
                <li>
                  <p class="prod-item">
                    <span>SPU：</span>
                    <span>{{ sku_response.spuCode }}</span>
                  </p>
                  <p class="prod-item">
                    <span>SKU：</span>
                    <span>{{ sku_response.skuCode }}</span>
                  </p>
                  <p class="prod-item">
                    <span>品类：</span>
                    <span>{{ sku_response.categoryName }}</span>
                  </p>
                  <p class="prod-item">
                    <span>品牌：</span>
                    <span>{{ sku_response.brandName }}</span>
                  </p>
                  <p class="prod-item">
                    <span>产品定位：</span>
                    <span>{{ sku_response.productPositioning }}</span>
                  </p>
                  <p class="prod-item">
                    <span>版本号：</span>
                    <span>{{ sku_response.skuGrade }}</span>
                  </p>
                  <!-- <p class="prod-item">
                    <span>状态：</span>
                    <span>{{ sku_response.currentSaleStatus }}</span>
                  </p> -->
                  <!-- <p :title="sku_response.saleGroupName" class="prod-item">
                    <span>所属销售部门：</span>
                    <span>{{ sku_response.saleGroupName }}</span>
                  </p> -->
                  <p class="prod-item" :title="sku_response.devGroupName">
                    <span>所属开发部门：</span>
                    <span>{{ sku_response.devGroupName }}</span>
                  </p>
                  <p class="prod-item">
                    <span>创建人：</span>
                    <span>{{ sku_response.createName }}</span>
                  </p>
                  <p class="prod-item">
                    <span>创建时间：</span>
                    <span>{{ sku_response.createTime }}</span>
                  </p>
                  <p class="prod-item">
                    <span>更新人：</span>
                    <span>{{ sku_response.updateName }}</span>
                  </p>
                  <p class="prod-item">
                    <span>更新时间：</span>
                    <span>{{ sku_response.updateTime }}</span>
                  </p>
                </li>
                <li>
                  <ul class="prd-attr" v-show="sku_response.attributeList && sku_response.attributeList.length > 0">
                    <li>属性值：</li>
                    <li v-for="(val, key) in sku_response.attributeList" :key="key" style="margin-right: 4px">
                      <!-- {{val.attributeName}}： -->
                      {{ val.attributeValueName }}
                      <span v-if="key !== sku_response.attributeList.length - 1">/</span>
                    </li>
                  </ul>
                </li>
              </ul>

              <div class="pd-table-wrapper" v-if="sku_response.purchaseList && sku_response.purchaseList.length > 0">
                <div class="pd-feed-price">
                  <p class="pd-feed-p">采购价格</p>
                </div>
                <div :style="tableStyle" class="pd-table-box">
                  <el-table height="150" border class="cancelFixedTop" :data="sku_response.purchaseList">
                    <el-table-column width="200" prop="supplierName" label="供应商">
                      <template slot-scope="scope">
                        <span class="el-row-text" :title="scope.row.supplierName">{{ scope.row.supplierName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxPrice" label="含税价"></el-table-column>
                    <el-table-column prop="noneTaxPrice" label="非税价"></el-table-column>
                    <el-table-column width="100" prop="isDefault" label="默认供应商"></el-table-column>
                    <el-table-column prop="period" label="交货天数"></el-table-column>
                    <el-table-column prop="period" label="FOB采购价格(USD)"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-tabs
        type="card"
        class="border-r"
        v-model="skuInfoType"
        @tab-click="skuInfoTabClick"
        style="margin-top: 10px; border: 1px solid #e9ecf1"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="装箱信息" name="1">
          <div class="prod-info">
            <!-- <p class="iod-header">装箱信息</p> -->
            <el-table border :data="info_1">
              <el-table-column label="产品净重(kg)" prop="skuWeight"></el-table-column>
              <el-table-column label="产品毛重(kg)" prop="skuGrossWeight"></el-table-column>
              <!-- <el-table-column label="箱毛重(kg)" prop="boxGrossWeight"></el-table-column> -->
              <el-table-column width="130px" label="产品长*宽*高(cm)" prop="productSize"></el-table-column>
              <el-table-column width="130px" label="包装长*宽*高(cm)" prop="wrapperSize"></el-table-column>
              <el-table-column width="130px" label="包装体积(cm³)" prop="packageVolume"></el-table-column>
              <el-table-column width="130px" label="外箱长*宽*高(cm)" prop="outsideWrapperSize"></el-table-column>
              <el-table-column width="130px" label="外箱体积(cm³)" prop="outerBoxVolume"></el-table-column>
              <el-table-column width="130px" label="外箱重量(kg)" prop="boxGrossWeight"></el-table-column>
              <el-table-column label="装箱数量" prop="boxs"></el-table-column>
              <!-- 多条规格用 / 分割-->
              <!-- <el-table-column label="托盘规格" prop="palletSpec"></el-table-column>
              <el-table-column label="打托数" prop="palletNumber"></el-table-column> -->
            </el-table>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="文件清单" name="2">
          <div class="prod-list-w">
            <p class="p-l-t">产品清单</p>
            <ul class="prod-list-b">
              <li :title="info_2.specification">
                <span>性能参数：</span>
                <span>{{ info_2.specification }}</span>
              </li>
              <li :title="info_2.funcRequire">
                <span>功能需求：</span>
                <span>{{ info_2.funcRequire }}</span>
              </li>
              <li :title="info_2.approveRequire">
                <span>认证需求：</span>
                <span>{{ info_2.approveRequire }}</span>
              </li>
              <li :title="info_2.otherDescribe">
                <span>产品描述：</span>
                <span>{{ info_2.otherDescribe }}</span>
              </li>
            </ul>
          </div>

          <div class="prod-list-w">
            <p class="p-l-t">包装清单</p>
            <ul>
              <li>
                <span>{{ info_2.packList }}</span>
              </li>
            </ul>
          </div>

          <div style="background: #fff" class="border-r">
            <p class="deg-title">设计清单</p>
            <el-table :show-header="false" border :data="info_2.designList">
              <el-table-column width="200px" label="" prop="item"></el-table-column>
              <el-table-column label="" prop="itemFileList">
                <template slot-scope="scope">
                  <p class="">
                    <span v-for="(item, key) in scope.row.itemFileList" :key="key"
                      >{{ item.attachmentName }}<span v-if="key < scope.row.itemFileList - 1">，</span></span
                    >
                    <span style="float: right">
                      <i
                        v-if="scope.row.itemFileList && scope.row.itemFileList.length > 0"
                        @click="viewDetail(scope.row)"
                        class="icon-chakan y-reviews"
                      ></i>
                    </span>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="海关要素" name="3">
          <div style="background:#fff;" class="border-r">
            <ul class="customs-w">
              <li>
                <span>海关编号：</span>
                <span>{{ info_3.customsCode }}</span>
              </li>
              <li :title="info_3.customsName">
                <span>海关名称：</span>
                <span>{{ info_3.customsName }}</span>
              </li>
              <li :title="info_3.customsNameEn">
                <span>海关名称（英文）：</span>
                <span>{{ info_3.customsNameEn }}</span>
              </li>
              <li>
                <span>法定退税率：</span>
                <span>{{ info_3.legalRefundRate }}</span>
              </li>
              <li>
                <span>品牌：</span>
                <span>{{ info_3.brandName }}</span>
              </li>
              <li>
                <span>供应商单位：</span>
                <span>{{ info_3.unitName }}</span>
              </li>
              <li>
                <span>海关法定单位：</span>
                <span>{{ info_3.customsLegalUnit }}</span>
              </li>
              <li>
                <span>材质：</span>
                <span>{{ info_3.material }}</span>
              </li>
              <li>
                <span>用途：</span>
                <span>{{ info_3.application }}</span>
              </li>
              <li>
                <span>申报要素：</span>
                <span>{{ info_3.declarationElement }}</span>
              </li>
            </ul>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="产品定价" name="4">
          <!-- <div style="background:#fff;" class="border-r">
            <el-button type="primary" size="small" style="margin:10px 0;" @click="toModify">修改</el-button>
            <el-table border class="cancelFixedTop" :data="info_4" @selection-change="selectionChange" max-height="450">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="calculateBatchId" label="测算批次号"></el-table-column>
              <el-table-column prop="platformCode" label="平台"></el-table-column>
              <el-table-column prop="sitCode" label="销售站点"></el-table-column>
              <el-table-column prop="asin" label="平台销售SKU / ASIN" width="155"></el-table-column>
              <el-table-column prop="linkSpu" label="链接SPU"></el-table-column>
              <el-table-column prop="linkSku" label="链接SKU"></el-table-column>
              <el-table-column prop="salesModel" label="模式"></el-table-column>
              <el-table-column prop="currency" label="币种"></el-table-column>
              <el-table-column prop="promotionExpensesRate" label="推广费比">
                <template slot-scope="scope">
                  {{ scope.row.promotionExpensesRate + "%" }}
                </template>
              </el-table-column>
              <el-table-column prop="sellingPriceStr" label="建议售价"></el-table-column>
              <el-table-column prop="sellingPriceNoTaxStr" label="不含税售价"></el-table-column>
              <el-table-column prop="supplyPriceStr" label="供货价"></el-table-column>
            </el-table>
          </div> -->
        </el-tab-pane>
      </el-tabs>

      <el-dialog title="文件列表" :visible.sync="centerDialogVisible" width="50%" center>
        <ul>
          <li v-for="(val, key) in viewList" :key="key">
            <el-row :gutter="24">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <span>{{ val.attachmentName }}</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <a @click="preViewMethods(val.addressUrl)">预览</a>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <a @click="download(val)">下载</a>
                </div>
              </el-col>
            </el-row>
          </li>
        </ul>

        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false" type="info" size="small" plain>关 闭</el-button>
        </span> -->
      </el-dialog>

      <preview ref="preView"></preview>

      <imgdialog ref="imgdialog"></imgdialog>

      <el-dialog title="修改" :visible.sync="djStatus" width="660px" @close="djcancel" center>
        <el-form
          ref="djUpdateForm"
          label-width="120px"
          :inline="true"
          :model="djUpdateForm"
          :rules="djUpdateRules"
          size="small"
          status-icon
        >
          <el-form-item label="ASIN" prop="asin">
            <el-input v-model="djUpdateForm.asin" size="small" maxlength="200" v-search-input-trim></el-input>
          </el-form-item>

          <el-form-item label="链接SPU" prop="linkSpu">
            <el-input v-model="djUpdateForm.linkSpu" size="small" maxlength="200" v-search-input-trim></el-input>
          </el-form-item>

          <el-form-item label="链接SKU" prop="linkSku">
            <el-input v-model="djUpdateForm.linkSku" size="small" maxlength="200" v-search-input-trim></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="djcancel">取 消</el-button>
          <el-button type="primary" size="small" @click="djconfirm('djUpdateForm')">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
    <!-- <div></div> -->
  </div>
</template>

<script>
// if (process.env.NODE_ENV === "development") {
//   // 调试结束删除mock调用,不删除上线也不影响,
//   try {
//     require("@/components/avue/utils/mock").MockData;
//     require("@/components/avue/utils/mock").MockData_sku;
//     require("@/components/avue/utils/mock").MockData_info;
//   } catch {}
// }
import {
  detail_spuList,
  detail_skuList,
  detail_skuInfo,
  getBySku,
  savePrdCalculatePrice
} from "@/api/product/prdarchives_detail"
import { saleStatusOption } from "../../../const/crud/product/prdarchives"
import { getTokenUrl } from "@/util/auth"
import preview from "@/components/yvue/pdf/index"
import imgdialog from "@/views/purchase/inquiryorder/imgDialog.vue"

export default {
  name: "prdDetail",
  data() {
    return {
      innerVisible: false,
      // openFlag: true,
      pdfUrl: null, //pdf预览地址
      spareFlag: false,
      viewList: [],
      centerDialogVisible: false,
      skuInfoType: "1",
      spu_response: {
        //spu详情
        spuName: "",
        modelName: "",
        skuCodeList: ""
      },
      sku_response: {
        skuName: "",
        saleStatus: "",
        devGroupName: "",
        maintainerName: "",
        saleGroupName: "",
        purchaseList: [],
        attributeList: [],
        skuPicList: []
      },
      info_1: [
        {
          skuWeight: "",
          boxs: "",
          skuGrossWeight: "",
          boxGrossWeight: "",
          productSize: "",
          wrapperSize: "",
          outsideWrapperSize: "",
          palletSpec: "",
          palletNumber: ""
        }
      ],
      info_2: {
        designList: []
      },
      info_3: {},
      info_4: [],
      spare_skuList: [], //放在下拉框里的sku
      // spuCode: this.$route.params.id || null,
      activeName: "", //当前选中的sku
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },

      // tableData: [],
      value4: "",
      dialogImageUrl: "",
      dialogVisible: false,
      multipleSelection: [],
      djUpdateForm: {},
      djUpdateRules: {
        asin: [{ required: true, message: "ASIN为空", trigger: "blur" }],
        linkSpu: [{ required: true, message: "链接SPU为空", trigger: "blur" }],
        linkSku: [{ required: true, message: "链接SKU为空", trigger: "blur" }]
      },
      djStatus: false
    }
  },
  mounted() {
    //this.getSpuList(this.spuCode);
    // this.spu_response.spuName = "自定义表头"
  },
  methods: {
    selectionChange(val) {
      this.multipleSelection = val
    },
    toModify() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请勾选数据！")
        return
      }

      if (this.multipleSelection.length > 1) {
        this.$message.warning("只能勾选1条数据！")
        return
      }
      this.djStatus = true
      this.djUpdateForm = this.multipleSelection[0]
    },
    djcancel() {
      this.$refs["djUpdateForm"].resetFields()
      this.djStatus = false
    },
    djconfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          savePrdCalculatePrice(this.djUpdateForm)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("修改成功")
                this.djStatus = false
                this.skuInfoType = "4"
                this.skuInfoTabClick()
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch((err) => {})
        }
      })
    },
    tableStyle() {
      return {
        height: "200px"
      }
    },
    preViewMethods(url) {
      /*
       * 文件目前仅支持pdf和图片两种预览
       * */
      const reg = /\.pdf\?/gi
      if (reg.test(url)) {
        this.$refs.preView.pdfFn(url)
      } else {
        this.$refs.imgdialog.showImgUrl(url)
      }
    },
    // openEnvent() {
    //   this.openFlag = !this.openFlag;
    // },
    imgShow(pic) {
      this.dialogImageUrl = pic
      this.dialogVisible = true
    },
    // preview(val) {
    // 预览
    //this.pdfUrl=getTokenUrl(val.addressUrl);
    // this.pdfUrl=getTokenUrl("http://47.98.203.55/pdf/aukey.pdf");
    // },
    download(val) {
      // 下载
      window.location = getTokenUrl(val.addressUrl)
    },
    viewDetail(val) {
      this.centerDialogVisible = true
      val.itemFileList.forEach((val) => {
        val.addressUrl = getTokenUrl(val.addressUrl)
      })
      this.viewList = val.itemFileList
    },
    skuInfoTabClick(e) {
      //切换sku 装箱、文件、海关
      if (this.skuInfoType === "4") {
        this.getBySku()
      } else {
        this.getSkuInfo(this.skuInfoType)
      }
    },
    beforeLeave(active, old) {
      // 产品定价不切换直接跳转到产品售价净利测算
      if (active == 4) {
        this.$router.push({
          path: "/product/prdsalegrossprofit",
          query: {
            skuCode: this.sku_response.parentSkuCode ? this.sku_response.parentSkuCode : undefined,
            pricingState: 2
          }
        })
        return false
      }
    },
    getBySku() {
      let params = {
        skus: this.skuCode
      }
      getBySku(params).then((res) => {
        if (res.data.code === 0) {
          this.info_4 = res.data.data
        }
      })
    },
    handleClick() {
      //切换sku
      this.value4 = ""
      this.getSkuDetail(this.activeName)
    },
    selectNewSku(val) {
      if (val.length < 1) return
      this.activeName = val
      this.getSkuDetail(val)
    },
    getSpuList(spuCode) {
      //请求spu列表
      this.spareFlag = false
      detail_spuList({ spuCode: spuCode }).then((res) => {
        if (res.data.code === 0) {
          let data = res.data.data
          this.spu_response = data
          // 如果sku太长，则截取前面8个 skuCodeList

          if (data.skuCodeList && data.skuCodeList.length > 6) {
            this.spareFlag = true
            this.spare_skuList = data.skuCodeList.slice(6, data.skuCodeList.length)
            this.spu_response.skuCodeList = data.skuCodeList.slice(0, 6)
          }
          this.activeName = this.spu_response.skuCodeList[0]
          this.getSkuDetail(this.activeName)
        }
      })
    },
    getSkuDetail(skuCode) {
      //sku列表
      detail_skuList({ skuCode: skuCode }).then((res) => {
        if (res.data.code === 0) {
          res.data.data.currentSaleStatus = saleStatusOption[res.data.data.saleStatus]
          let skuPicList = []
          res.data.data.skuPicList.forEach((val) => {
            //处理图片token
            val = getTokenUrl(val)
            skuPicList.push(val)
          })
          res.data.data.skuPicList = skuPicList

          // 测试数据
          // for(let o = 0;o<20;o++){
          //   res.data.data.purchaseList.push(res.data.data.purchaseList[0])
          // }

          this.sku_response = res.data.data
          console.log("sku_res", this.sku_response)
          this.skuInfoType = "1"
          this.skuInfoTabClick(this.skuInfoType)
        }
      })
    },
    getSkuInfo(type) {
      //获取 sku 装箱、文件、海关
      let params = {
        // skuCode: this.activeName,
        skuCode: this.skuCode,
        tabType: type
      }

      detail_skuInfo(params).then((res) => {
        if (res.data.code === 0) {
          if (params.tabType == 1) {
            console.log("res", res.data)
            this.info_1 = [res.data.data]
          } else if (params.tabType == 2) {
            this.info_2 = res.data.data
          } else if (params.tabType == 3) {
            this.info_3 = res.data.data
          }
        }
      })
    }
  },
  computed: {
    // spuCode () {
    //   const spuCode = this.$route.params.id
    //   return spuCode || null
    // }
    skuCode() {
      const skuCode = this.$route.query.skuCode
      return skuCode || null
    }
  },
  components: {
    preview,
    imgdialog
  },
  created() {
    // this.getSpuList(this.spuCode)
    console.log(this.skuCode)
    console.log("params", this.$route.params)
    this.getSkuDetail(this.skuCode)
  }
}
</script>

<style lang="scss">
@import "./index.scss";

.prod-status {
  li:nth-child(1) {
    min-width: 66.66%;
  }

  li:nth-child(2) {
    min-width: 33.33%;
    // background-color: red;
  }
}
</style>
