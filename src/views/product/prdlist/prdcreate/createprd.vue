<template>
  <div id="createPrd">
    <basic-container>
      <!--头部以及标题信息信息-->
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: titleName,
          list: []
        }"
      >
      </detail-template>

      <!--商品信息模块-->
      <div class="iod-target-top border-rang y-prd-info">
        <p class="iod-target target-title">商品信息</p>

        <el-form label-position="top" :model="prdmodal" :rules="prdmodalRules" ref="prdmodal" class="info-form">
          <el-form-item label="标准SPU" prop="spu">
            <el-autocomplete
              size="mini"
              :popper-append-to-body="false"
              v-model="prdmodal.spu"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearch"
              placeholder="请输入产品编码"
              @select="handleSelect"
              :disabled="isEditfl && isUpGrade"
              v-search-input-trim
            ></el-autocomplete>
          </el-form-item>

          <el-form-item label="产品名称" prop="productName">
            <el-input
              size="mini"
              v-search-input-trim
              v-model="prdmodal.productName"
              placeholder="请输入产品名称"
              :disabled="isUpGrade"
            ></el-input>
          </el-form-item>

          <el-form-item label="品类" class="rig-ali" prop="category">
            <el-cascader
              size="mini"
              expand-trigger="hover"
              v-model="prdmodal.category"
              :show-all-levels="false"
              :options="treeCategoryData"
              @change="getCategory"
              :disabled="isUpGrade"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="品牌" prop="brand">
            <el-select
              size="mini"
              clearable
              v-model="prdmodal.brand"
              filterable
              placeholder="请选择"
              :disabled="isUpGrade"
            >
              <el-option v-for="item in brandArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属开发组" prop="developGroupId">
            <el-select
              size="mini"
              v-model="prdmodal.developGroupName"
              placeholder="请选择"
              @change="changeDevelopGroup"
              :disabled="isUpGrade"
            >
              <el-option
                v-for="item in developGroupArr"
                :key="item.groupId"
                :label="item.name"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!--产品属性模块-->
      <div class="iod-target-top border-rang margin-top-20 y-prd-attr">
        <p class="iod-target target-title">产品属性</p>
        <el-form
          label-position="top"
          class="demo-ruleForm"
          :model="prdAttrForm"
          :rules="prdAttrRules"
          ref="prdAttrForm"
        >
          <el-form-item label="属性类:" prop="prdAttrs" class="product-form-item">
            <el-checkbox-group v-model="prdAttrForm.prdAttrs">
              <el-checkbox
                @change="handleCheckedAttr(attr)"
                v-for="(attr, index) in attributes"
                :label="attr.attributeId"
                :key="index"
                :name="attr.attributeId"
                :disabled="disableAtt && isUpGrade"
              >
                <div :title="attr.attributeName" class="checkbox-word">{{ attr.attributeName }}</div>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="属性值:" prop="prdAttrValues" style="min-height: 120px" class="product-form-item">
            <el-row v-for="(atvalue, index) in attrValues" :key="index">
              <el-col
                class="atVlaue"
                :class="atvalue.systemStatus == 1 ? `beforeStar` : null"
                :span="2"
                :title="atvalue.attributeName"
                >{{ atvalue.attributeName }}</el-col
              >
              <el-col :span="22">
                <el-checkbox-group v-model="prdAttrForm.prdAttrValues">
                  <el-checkbox
                    @change="handleCheckedValue(val)"
                    v-for="(val, index) in atvalue.attributeValues"
                    :label="val.attributeValueId"
                    :key="index"
                    :disabled="disableAtt && isUpGrade"
                  >
                    <div :title="val.attributeValueName" class="checkbox-word">{{ val.attributeValueName }}</div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <el-row v-if="attrValues.length === 0">
              <span style="color: #d0d0d0">暂无属性值，在上方属性类别进行勾选。</span>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: right; padding: 20px">
        <el-button
          type="primary"
          size="small"
          :loading="createLoading"
          :disabled="disableAtt && isUpGrade"
          class="cont-mar"
          @click="fastCreateAttr()"
          >快速生成</el-button
        >
      </div>

      <!--属性组合模块-->
      <!--产品属性模块-->
      <div class="iod-target-top border-rang margin-top-20">
        <p class="iod-target target-title">属性组合</p>

        <div class="validate_wrapper">
          <avue-crud
            ref="crud"
            v-model="form"
            :data="attrTableData"
            :option="attrTableOption"
            @row-del="delRowAttr"
            class="handle-cell-hidden"
          >
            <!-- 属性编码 -->
            <template slot-scope="scope" slot="skuCode">
              <el-form status-icon :model="scope.row">
                <el-form-item prop="skuCode" :rules="scope.column.rules" style="margin-bottom: 0">
                  <el-input
                    v-model="scope.row.skuCode"
                    size="mini"
                    :maxlength="30"
                    @blur="toUpperCase(scope)"
                    v-search-input-trim
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
            <!-- 属性名称 -->
            <template slot-scope="scope" slot="skuName">
              <el-form status-icon :model="scope.row">
                <el-form-item prop="skuName" :rules="scope.column.rules" style="margin-bottom: 0">
                  <el-input
                    v-model="scope.row.skuName"
                    size="mini"
                    :maxlength="200"
                    @blur="specialTrim(scope)"
                    v-search-input-trim
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
            <!-- 产品定位 -->
            <template slot-scope="scope" slot="productPositioning">
              <el-form status-icon :model="scope.row">
                <el-form-item prop="productPositioning" :rules="scope.column.rules" style="margin-bottom: 0">
                  <el-select
                    size="mini"
                    v-model="scope.row.productPositioning"
                    placeholder="请选择"
                    style="width: 120px"
                  >
                    <el-option
                      v-for="item in productPositionArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="text"
                    @click="fillData('productPositioning')"
                    v-if="scope.row.$index === 0 && attrTableData.length > 1"
                    >批量填充</el-button
                  >
                </el-form-item>
              </el-form>
            </template>

            <template slot-scope="scope" slot="purchaseCycle">
              <el-input-number
                size="small"
                v-model="scope.row.purchaseCycle"
                controls-position="right"
                :min="0"
                :max="99999"
              ></el-input-number>
            </template>

            <template slot-scope="scope" slot="baseInfo">
              <el-button type="text" icon="el-icon-edit" @click="baseInfoCli(scope.row)">
                <span>编辑</span>
              </el-button>
              <el-button
                type="text"
                @click="fillData('baseInfo')"
                v-if="scope.row.$index === 0 && attrTableData.length > 1"
                >批量填充</el-button
              >
            </template>

            <template slot-scope="scope" slot="signList">
              <el-button type="text" icon="el-icon-upload" @click="signListCl(scope.row)">上传</el-button>
              <el-button type="text" @click="batchSignListCl" v-if="scope.row.$index === 0 && attrTableData.length > 1"
                >批量上传</el-button
              >
            </template>
            <template slot-scope="scope" slot="pictureDe">
              <el-badge
                v-if="scope.row.pictureDe && scope.row.pictureDe.length > 0"
                :value="scope.row.pictureDe ? scope.row.pictureDe.length : 0"
                class="item"
              >
                <el-button type="text" icon="el-icon-upload" @click="picUpCl(scope.row)">pic</el-button>
              </el-badge>

              <el-button v-else type="text" icon="el-icon-upload" @click="picUpCl(scope.row)">pic</el-button>
              <el-button
                type="text"
                style="margin-left: 10px"
                @click="batchPicUpCl(scope.row)"
                v-if="scope.row.$index === 0 && attrTableData.length > 1"
                >批量上传</el-button
              >
            </template>
          </avue-crud>
        </div>
      </div>
      <!--底端按钮模块-->
      <div class="y-submit">
        <el-button
          size="small"
          type="primary"
          v-if="permissions.prdlist_newprd_confirm"
          @click="submitFinsh(0)"
          :loading="buttonLoading"
          >确认信息</el-button
        >
        <el-button size="small" type="primary" @click="submitCancel()">取消</el-button>
        <el-button
          size="small"
          type="primary"
          v-if="permissions.prdlist_newprd_submit"
          @click="submitFinsh(1)"
          :loading="buttonLoading"
          >提交审核</el-button
        >
      </div>

      <!--基本信息-->
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="info-dialog"
        title="编辑基本信息"
        :visible.sync="baseSkuInfoVisi"
        width="400x"
      >
        <div class="formDiv">
          <el-form :model="baseSkuForm" :rules="baseSkuRules" ref="baseSkuForm" label-position="right">
            <el-form-item label="规　　格：" prop="specification">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="不得超过200位字符"
                maxlength="200"
                v-model="baseSkuForm.specification"
              ></el-input>
            </el-form-item>

            <el-form-item label="功能需求：" prop="funcRequire">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="不得超过200位字符"
                maxlength="200"
                v-model="baseSkuForm.funcRequire"
              ></el-input>
            </el-form-item>
            <el-form-item label="认证需求：" prop="approveRequire">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="不得超过200位字符"
                maxlength="200"
                v-model="baseSkuForm.approveRequire"
              ></el-input>
            </el-form-item>
            <el-form-item label="包装清单：" prop="packList">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="不得超过200位字符"
                maxlength="200"
                v-model="baseSkuForm.packList"
              ></el-input>
            </el-form-item>
            <el-form-item label="其他描述：" prop="otherDescribe">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="不得超过200位字符"
                maxlength="200"
                v-model="baseSkuForm.otherDescribe"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="baseInfoCancel()">取 消</el-button>
          <el-button size="small" type="primary" @click="baseInfoConfirm('baseSkuForm')">确 定</el-button>
        </div>
      </el-dialog>
      <transition name="slide-fade">
        <!-- 设计清单 -->
        <template>
          <div v-if="show" class="bg-listFile">
            <el-container class="listFile">
              <el-main class="uploadFlie">
                <avue-crud ref="crud" :data="uploadfileData" :option="uploadfileOption" class="avueUpFile">
                  <template slot-scope="scope" slot="designRequire">
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item < 4"
                      class="validate_wrapper2"
                      v-model="scope.row.designRequire"
                      placeholder="请输入设计要求"
                    ></el-input>
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.designRequire"
                      placeholder="请输入设计要求"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="completeTime">
                    <el-date-picker
                      size="small"
                      class="validate_wrapper2"
                      v-if="scope.row.item < 4"
                      v-model="scope.row.completeTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请输入日期"
                    ></el-date-picker>
                    <el-date-picker
                      size="small"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.completeTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请输入日期"
                    ></el-date-picker>
                  </template>
                  <template slot-scope="scope" slot="remarks">
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      class="validate_wrapper2"
                      v-if="scope.row.item < 4"
                      v-model="scope.row.remarks"
                      placeholder="请输入备注"
                    ></el-input>
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.remarks"
                      placeholder="请输入备注"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="fileList">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      accept="application/pdf,image/jpg,image/jpeg,image/png,image/bmp"
                      action="String"
                      :file-list="signListFile"
                      :auto-upload="false"
                      :on-change="signFileChange"
                      :show-file-list="fileShow"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-upload"
                        v-loading.fullscreen.lock="fullscreenLoading"
                        @click="uploadFileFn(scope.row)"
                      >
                        <span>上传</span>
                      </el-button>
                    </el-upload>
                    <el-badge
                      :value="scope.row.signListFile ? scope.row.signListFile.length : 0"
                      v-if="scope.row.signListFile && scope.row.signListFile.length > 0"
                      class="item"
                    >
                      <el-button type="text" icon="icon-chakan" @click="viewDetail(scope.row)"></el-button>
                    </el-badge>
                  </template>
                </avue-crud>
                <!-- </el-form> -->
              </el-main>
              <el-footer style="padding-top: 20px">
                <el-button size="small" type="primary" @click="uploadlistCom()">确认</el-button>
                <el-button size="small" type="primary" plain @click="uploadlistCan()">取消</el-button>
              </el-footer>
            </el-container>
          </div>
        </template>
      </transition>

      <transition name="slide-fade">
        <!-- 设计清单 -->
        <template>
          <div v-if="show4" class="bg-listFile">
            <el-container class="listFile">
              <el-main class="uploadFlie">
                <avue-crud ref="crud" :data="batchUploadfileData" :option="uploadfileOption" class="avueUpFile">
                  <template slot-scope="scope" slot="designRequire">
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item < 4"
                      class="validate_wrapper2"
                      v-model="scope.row.designRequire"
                      placeholder="请输入设计要求"
                    ></el-input>
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.designRequire"
                      placeholder="请输入设计要求"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="completeTime">
                    <el-date-picker
                      size="small"
                      class="validate_wrapper2"
                      v-if="scope.row.item < 4"
                      v-model="scope.row.completeTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请输入日期"
                    ></el-date-picker>
                    <el-date-picker
                      size="small"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.completeTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请输入日期"
                    ></el-date-picker>
                  </template>
                  <template slot-scope="scope" slot="remarks">
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      class="validate_wrapper2"
                      v-if="scope.row.item < 4"
                      v-model="scope.row.remarks"
                      placeholder="请输入备注"
                    ></el-input>
                    <el-input
                      size="small"
                      v-search-input-trim
                      maxlength="200"
                      v-if="scope.row.item >= 4"
                      v-model="scope.row.remarks"
                      placeholder="请输入备注"
                    ></el-input>
                  </template>
                  <template slot-scope="scope" slot="fileList">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      accept="application/pdf,image/jpg,image/jpeg,image/png,image/bmp"
                      action="String"
                      :file-list="bathSignListFile"
                      :auto-upload="false"
                      :on-change="batchSignFileChange"
                      :show-file-list="false"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-upload"
                        v-loading.fullscreen.lock="fullscreenLoading"
                        @click="batchUploadFileFn(scope.row)"
                      >
                        <span>上传</span>
                      </el-button>
                    </el-upload>
                    <el-badge
                      :value="scope.row.signListFile ? 1 : 0"
                      v-if="scope.row.signListFile && scope.row.signListFile.length > 0"
                      class="item"
                    >
                      <el-button type="text" icon="icon-chakan" @click="batchViewDetail(scope.row)"></el-button>
                    </el-badge>
                  </template>
                </avue-crud>
              </el-main>
              <el-footer style="padding-top: 20px">
                <el-button size="small" type="primary" @click="batchUploadlistCom()">确认</el-button>
                <el-button size="small" type="primary" plain @click="batchUploadlistCan()">取消</el-button>
              </el-footer>
            </el-container>
          </div>
        </template>
      </transition>

      <transition name="slide-fade">
        <el-dialog title="上传图片" :visible.sync="show2">
          <el-upload
            class="dialog-img"
            action="String"
            accept="image/jpeg, image/png, image/jpg"
            list-type="picture-card"
            :file-list="showImageList"
            :on-change="imageFileChange"
            :auto-upload="false"
            :on-remove="imageRemove"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :limit="20"
            multiple
          >
            <i class="el-icon-plus i-center"></i>
          </el-upload>

          <el-footer style="padding-top: 20px">
            <el-button type="primary" size="small" @click="imageFileCom()" :loading="imageLoading">确认</el-button>
            <el-button type="primary" size="small" plain @click="show2 = !show2">取消</el-button>
          </el-footer>
        </el-dialog>
      </transition>

      <transition name="slide-fade">
        <el-dialog title="批量上传图片" :visible.sync="show3">
          <el-upload
            class="dialog-img"
            action="String"
            accept="image/jpeg, image/png, image/jpg"
            list-type="picture-card"
            :file-list="showBatchImageList"
            :on-change="batchImageFileChange"
            :auto-upload="false"
            :on-remove="batchImageRemove"
            :on-preview="handlePictureCardPreview"
            :on-exceed="batchHandleExceed"
            :limit="1"
          >
            <i class="el-icon-plus i-center"></i>
          </el-upload>

          <el-footer style="padding-top: 20px">
            <el-button type="primary" size="small" @click="batchImageFileCom" :loading="imageLoading">确认</el-button>
            <el-button type="primary" size="small" plain @click="show3 = !show3">取消</el-button>
          </el-footer>
        </el-dialog>
      </transition>

      <el-dialog :visible.sync="dialogVisible" :title="showImageName">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>

      <el-dialog title="查看文件" :visible.sync="centerDialogVisible" width="40%" center>
        <ul>
          <li v-for="(val, key) in viewList" :key="key">
            <el-row :gutter="24">
              <el-col :span="15">
                <div class="grid-content bg-purple" style="text-align: left">
                  <span :title="val.name" class="el-row-text">{{ val.name }}</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="preViewMethods(val)">预览</el-button>
                </div>
              </el-col>
              <el-col :span="3" v-if="permissions.prdlist_createprd_designlist_uplaod">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="download(val)">下载</el-button>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="deletePic(val)">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </li>
        </ul>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" class="prd-el-button" @click="centerDialogVisible = false" type="primary" plain>
            关 闭
          </el-button>
        </span>
      </el-dialog>

      <el-dialog title="查看文件" :visible.sync="batchCenterDialogVisible" width="40%" center>
        <ul>
          <li v-for="(val, key) in viewList" :key="key">
            <el-row :gutter="24">
              <el-col :span="15">
                <div class="grid-content bg-purple" style="text-align: left">
                  <span :title="val.name" class="el-row-text">{{ val.name }}</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="preViewMethods(val)">预览</el-button>
                </div>
              </el-col>
              <el-col :span="3" v-if="permissions.prdlist_createprd_designlist_uplaod">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="download(val)">下载</el-button>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">
                  <el-button type="text" class="watchFileBtn" @click="batchDeletePic(val)">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </li>
        </ul>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" class="prd-el-button" @click="batchCenterDialogVisible = false" type="primary" plain>
            关 闭
          </el-button>
        </span>
      </el-dialog>

      <preview ref="preView"></preview>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import {
  getProcessSpu,
  fastCreate,
  getCreateInvoicesInfo,
  uplaodDesignFile,
  uplaodDesignFileV2,
  getMakeUpAttr,
  submitPrdAlone,
  submitPrdEditAlone
} from "@/api/product/prdlist/prdlist"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchModelAll } from "@/api/product/prdskumodel"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchListAttr, fetchListAttrById, getAttributeByCategoryId } from "@/api/product/prdattribute"
import {
  tableOption,
  uploadfileOption,
  prdmodal,
  prdmodalRules,
  prdAttrForm,
  prdAttrRules,
  uploadfileData,
  checkDesignFile,
  makeUpAttrFn,
  baseSkuRules,
  baseSkuForm,
  fliterImageFile
} from "@/const/crud/product/prdlist/createPrd/createPrd"
import { getTokenUrl } from "@/util/auth"
import { uploadSkuImage, uploadSkuImageV2 } from "@/api/product/prdskupic/prdskupic"
import { preventShake, limitFilesMaxSize } from "@/util/tool"
import preview from "@/components/yvue/pdf/index"
import { getGroupAllByParams as getGroupApi } from "@/api/adminUser/adminGroup"
import { getObjByType } from "@/api/baseSetup/bseplatformtype"
import { deepClone } from "@/util/util"

export default {
  name: "prdlcreate",
  components: {
    preview
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      showImageName: "样品图片",
      isEditfl: false,
      createLoading: false,
      certainSumit: true,
      id: this.$route.params.id,
      titleName: "新品创建", //标题
      form: {},
      show: false,
      show2: false,
      show3: false,
      show4: false,
      restaurants: [],
      /** 商品信息 */
      prdmodal: prdmodal,
      prdmodalRules: prdmodalRules,
      /** 商品信息 */
      baseSkuRules: baseSkuRules, //SKU基本信息规则
      baseSkuForm: baseSkuForm, //SKU基本信息
      baseSkuInfoVisi: false, //sku基本信息弹框出现
      baseSkuCurrentRow: {}, //sku基本信息临时列
      /** 产品属性 */
      prdAttrForm: {
        prdAttrs: [],
        prdAttrValues: []
      },
      prdAttrRules: prdAttrRules,
      /** 产品属性 */
      /**属性组合 */
      treeCategoryData: [],
      brandArr: [],
      prdModelArr: [],
      attributes: [],
      attrValues: [], //[{attributeName:"颜色",values:[{valueId:1,valueName:'红'}]}],
      developGroupArr: [], //开发小组
      attriCreates: [],
      createArr: [],
      attrTableData: [],
      attrTableOption: tableOption,
      attrcurrentRow: { signList: [] },
      uploadfileOption: uploadfileOption,
      uploadfileData: uploadfileData,
      signListFile: [],
      currentRow: {},
      batchCurrentRow: {},
      fileShow: false,
      /* 清单上传变量 */
      /**图片上传变量 */
      currentImageRow: {},
      /**图片上传变量 */
      /***文件查看***/
      centerDialogVisible: false,
      batchCenterDialogVisible: false,
      viewList: [],
      imageDelId: [], //图片移除ID
      fileDelId: [], //文件移除ID
      skuDelId: [], //需要移除的SKUID
      disableAtt: false, //产品属性一栏禁用属性
      buttonLoading: false,
      fileList: [], //临时文件列表变量
      batchFileList: [],
      fileRemove: [], //临时文件移除
      fullscreenLoading: false, //
      showImageList: [],
      showBatchImageList: [],
      imageLoading: false,
      productPositionArr: [],
      batchUploadfileData: []
    }
  },
  created() {
    //查看单据编号下的所有信息
    this.init()
    const invoiceId = this.$route.params.id
    if (invoiceId && invoiceId != -1) {
      this.watchAllInfoByIn(invoiceId)
    } else {
      //新建
      this.watchDataInit()
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    isUpGrade() {
      return this.$route.query.isUpGrade ? this.$route.query.isUpGrade : 0
    },
    routerSkuCode() {
      return this.$route.query.skuCode ? this.$route.query.skuCode : undefined
    }
  },
  watch: {
    "prdmodal.category": function (newValue, oldValue) {
      if (!newValue) return
      this.attributes = []
      this.attrValues = []
      const params = {
        categoryId: newValue[0]
      }
      getAttributeByCategoryId(params).then((response) => {
        if (response.data.code === 0) {
          this.attributes = deepClone(response.data.data)
          if (!this.prdAttrForm.prdAttrs) {
            this.prdAttrForm.prdAttrs = []
          }
          //判断属性是否有系统属性，有的话默认勾选
          this.attributes.forEach((obj, i) => {
            if (obj.systemStatus == 1) {
              this.prdAttrForm.prdAttrs.push(obj.attributeId)
              this.handleCheckedAttr(obj)
            }
          })
        }
      })
    }
  },
  methods: {
    fillData(key) {
      this.attrTableData.forEach((item) => {
        if (key === "baseInfo") {
          this.$set(item, "specification", this.attrTableData[0].specification)
          this.$set(item, "funcRequire", this.attrTableData[0].funcRequire)
          this.$set(item, "approveRequire", this.attrTableData[0].approveRequire)
          this.$set(item, "packList", this.attrTableData[0].packList)
          this.$set(item, "otherDescribe", this.attrTableData[0].otherDescribe)
        } else if (key === "productPositioning") {
          this.$set(item, key, this.attrTableData[0][key])
        } else {
          const value = deepClone(this.attrTableData[0][key])
          this.$set(item, key, value)
        }
      })
      this.$message.success("批量填充成功")
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      this.showImageName = "样品图片"
    },
    init() {
      //品类
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
      //型号
      fetchModelAll({
        current: 1,
        size: -1
      }).then((response) => {
        let records = response.data.data.records
        records.forEach((ele) => {
          this.prdModelArr.push({ value: ele.modelId, label: ele.modelName })
        })
      })
      //品牌
      fetchBrandAll({
        current: 1,
        size: -1
      }).then((response) => {
        let records = response.data.data.records
        records.forEach((ele) => {
          this.brandArr.push({ value: ele.brandId, label: ele.brandName })
        })
      })
      //开发小组
      getGroupApi({ groupFunctionName: "开发类", authority: true }).then((res) => {
        this.developGroupArr = res.data.data //销售小组
      })
      // 产品定位
      getObjByType("product_positioning").then((res) => {
        this.productPositionArr = res.data.data
      })
    },
    //数据初始化
    watchDataInit() {
      this.isEditfl = false
      this.titleName = "新品创建" //标题
      this.form = {}
      this.show = false
      this.show2 = false
      this.restaurants = []
      this.treeCategoryData = []
      this.attrValues = [] //[{attributeName="颜色";values=[{valueId=1;valueName='红'}]}];
      // data= [];
      this.prdAttrForm.prdAttrs = []
      this.prdAttrForm.prdAttrValues = []
      this.prdmodal = {}
      this.attriCreates = []
      this.createArr = []
      this.attrTableData = []
      this.attrcurrentRow = { signList: [] }
      /* 清单上传变量 */
      this.signListFile = []
      this.currentRow = {}
      this.fileShow = false
      /* 清单上传变量 */
      /**图片上传变量 */
      this.currentImageRow = {}
      /**图片上传变量 */
      /***文件查看***/
      this.centerDialogVisible = false
      this.batchCenterDialogVisible = false
      this.viewList = []
      this.imageDelId = [] //图片移除ID
      this.fileDelId = [] //文件移除ID
      this.skuDelId = [] //需要移除的SKUID
      this.disableAtt = false //产品属性一栏禁用属性
    },
    //查看单据内的所有信息并赋值
    watchAllInfoByIn(id) {
      this.isEditfl = true
      this.id = id
      if (this.id) {
        //标题变更
        this.titleName = "新品编辑"
        //获取编辑内容填充
        this.getEditInfo(this.id)
        this.getAttrMakeUp(this.id)
      } else {
        this.titleName = "新品创建"
      }
    },
    //从后台获取相关信息
    getEditInfo(id) {
      getCreateInvoicesInfo(
        Object.assign({ invoiceId: id, isUpGrade: this.isUpGrade, skuCode: this.routerSkuCode })
      ).then((response) => {
        this.prdmodal = response.data.data.spuInfo //商品信息模块
        this.attrTableData = response.data.data.skuInfo //属性组合模块
        this.attrTableOption.menu = !this.isLook
      })
    },
    //获取所有单据SKU对应的属性组合
    getAttrMakeUp(id) {
      this.disableAtt = true
      let attrTmp = []
      let valsTmp = []
      if (this.$router.currentRoute.params.id) {
        getMakeUpAttr(Object.assign({ invoiceId: id })).then((res) => {
          attrTmp = deepClone(res.data.data.attrClass)
          valsTmp = deepClone(res.data.data.attrValues)
          this.$set(this.prdAttrForm, "prdAttrs", attrTmp) //设置是否选中
          this.$set(this.prdAttrForm, "prdAttrValues", valsTmp)
          this.handleCheckedAttr(-1)
        })
      }
    },
    querySearch(queryString, cb) {
      this.prdmodal.spuId = null
      this.prdmodal.spu = queryString
      let params = {}
      params.spuCode = queryString
      getProcessSpu(
        Object.assign(
          {
            isHideLoading: true,
            current: 1,
            size: 10
          },
          params
        )
      ).then((response) => {
        this.restaurants = this.loadSpuAll(response.data.data.records)
        let restaurants = this.restaurants
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    createFilter(queryString) {
      return (state) => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    loadSpuAll(records) {
      //加载spu信息
      let arr = []
      records.forEach((element) => {
        arr.push({
          spu: element,
          value: element.spuCode
        })
      })
      return arr
    },
    uploadfileDataInit() {
      this.uploadfileData = [
        { item: 0, itemName: "外观设计文件" },
        { item: 1, itemName: "包装盒设计文件" },
        { item: 2, itemName: "说明书设计文件" },
        { item: 3, itemName: "包装说明文件" },
        { item: 4, itemName: "其他文件1" },
        { item: 5, itemName: "其他文件2" },
        { item: 6, itemName: "其他文件3" }
      ]
    },
    handleSelect(item) {
      //初始化一下数据
      this.prdmodal = {
        spuId: null,
        productName: null,
        model: null,
        brand: null,
        category: [],
        spu: null,
        unit: null,
        gruop: null,
        developGroupId: null,
        developGroupName: null,
        productPositioning: null
      }
      this.prdmodal.spu = item.spu.spuCode
      this.prdmodal.spuId = item.spu.spuId
      this.prdmodal.productName = item.spu.spuName
      this.prdmodal.model = item.spu.modelId
      this.prdmodal.brand = item.spu.brandId
      this.prdmodal.unit = item.spu.unitId
      this.prdmodal.gruop = item.spu.groupId
      this.prdmodal.category = item.spu.categoryIds
      this.prdmodal.developGroupId = item.spu.developGroupId
      this.prdmodal.developGroupName = item.spu.developGroupName
      this.prdmodal.productPositioning = item.spu.productPositioning
    },
    //选中开发组
    changeDevelopGroup(groupId) {
      this.prdmodal.developGroupId = groupId
    },
    handleCheckedAttr(value) {
      if (value == -1) {
        //查询属性值通过属性类数组ID
        this.prdAttrForm.prdAttrs
        let paramById = {}
        paramById.id = this.prdAttrForm.prdAttrs
        fetchListAttrById(
          Object.assign(
            {
              current: 1,
              size: -1
            },
            paramById
          )
        ).then((res) => {
          this.attrValues = res.data.data.records
        })
      } else {
        if (this.prdAttrForm.prdAttrs.indexOf(value.attributeId) != -1) {
          //勾选
          fetchListAttr(
            Object.assign(
              {
                current: 1,
                size: -1
              },
              { attributeId: value.attributeId }
            )
          ).then((response) => {
            if (response.data.data.records.length > 0) {
              if (response.data.data.records[0].attributeValues) {
                this.attrValues.push(response.data.data.records[0])
              }
            }
          })
        } else {
          //取消勾选
          let attrValueNull = this.attrValues.filter((fi) => fi.attributeId == value.attributeId)
          this.attrValues = this.attrValues.filter((fi) => fi.attributeId != value.attributeId)
          attrValueNull[0].attributeValues.forEach((val) => {
            if (this.prdAttrForm.prdAttrValues.indexOf(val.attributeValueId) != -1) {
              this.prdAttrForm.prdAttrValues = this.prdAttrForm.prdAttrValues.filter(
                (prdattVa) => prdattVa != val.attributeValueId
              )
            }
          })
          //20190709添加，防止直接取消属性，其值未取消。
          this.handleCheckedValue(1)
        }
      }
      this.attriCreates = this.attrValues
    },
    handleCheckedValue(value) {
      this.createArr = []
      this.attriCreates.forEach((ele) => {
        let obj = {}
        obj.attributeId = ele.attributeId
        obj.attributeName = ele.attributeName
        obj.sort = ele.sort
        obj.attributeValues = []
        ele.attributeValues.forEach((ele2) => {
          this.prdAttrForm.prdAttrValues.forEach((ele3) => {
            if (ele2.attributeValueId == ele3) {
              obj.attributeValues.push(ele2)
            }
          })
        })
        this.createArr.push(obj)
      })
    },
    //快速生成
    fastCreateAttr() {
      this.certainSumit = false
      this.attrTableData = []
      this.$refs["prdmodal"].validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.$refs["prdAttrForm"].validate((valid1) => {
            this.createLoading = false
            if (valid1) {
              //需要spu 属性数组
              this.createArr.forEach((item) => {
                if (item.attributeValues && item.attributeValues.length) {
                  item.attributeValues.forEach((valueItem) => {
                    if (valueItem.attributeValueCode === null) {
                      valueItem.attributeValueCode = ""
                    }
                  })
                }
              })
              let formdata = new FormData()
              formdata.append("attrs", JSON.stringify(this.createArr))
              if (this.prdmodal.spuId) {
                formdata.append("prdSpuId", this.prdmodal.spuId)
              }
              formdata.append("prdSpu", this.prdmodal.spu)
              formdata.append("prdSpuName", this.prdmodal.productName)
              fastCreate(formdata).then((res) => {
                if (res.data.code != 0) {
                  this.$message.error(res.data.msg)
                  return
                }
                if (res.data.data.maxSize == 20) {
                  this.$message.error(res.data.data.mesage)
                } else {
                  this.attrTableData = res.data.data.records
                }
              })
            } else {
              console.log("error submit!!")
            }
          })
        } else {
          console.log("error submit!!")
        }
      })
    },
    delRowAttr(row) {
      if (this.attrTableData.length == 1) {
        this.$message.error("至少需要保留一条属性组合")
        return
      }
      if (row.skuId) {
        this.skuDelId.push(row.skuId)
      }
      let minIndex = parseInt(this.attrTableData[0].skuCode.split(this.prdmodal.spu)[1])
      this.attrTableData = this.attrTableData.filter((att) => att.skuCode != row.skuCode)
      this.attrTableData = makeUpAttrFn(this.attrTableData, minIndex, this.prdmodal.spu)
    },

    //SKU基本信息
    baseInfoCli(row) {
      this.baseSkuCurrentRow = row
      this.baseSkuForm.specification = row.specification
      this.baseSkuForm.funcRequire = row.funcRequire
      this.baseSkuForm.approveRequire = row.approveRequire
      this.baseSkuForm.packList = row.packList
      this.baseSkuForm.otherDescribe = row.otherDescribe
      this.baseSkuInfoVisi = true
    },
    //SKU基本信息弹框取消按钮
    baseInfoCancel() {
      this.baseSkuInfoVisi = false
    },
    //SKU基本信息弹框确认按钮
    baseInfoConfirm(baseSkuForm) {
      this.$refs[baseSkuForm].validate((valid) => {
        if (valid) {
          this.baseSkuCurrentRow.specification = this.baseSkuForm.specification
          this.baseSkuCurrentRow.funcRequire = this.baseSkuForm.funcRequire
          this.baseSkuCurrentRow.approveRequire = this.baseSkuForm.approveRequire
          this.baseSkuCurrentRow.packList = this.baseSkuForm.packList
          this.baseSkuCurrentRow.otherDescribe = this.baseSkuForm.otherDescribe
          this.baseSkuInfoVisi = false
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    /**
     * 清单列表
     */
    signListCl(row) {
      this.attrcurrentRow = row
      this.uploadfileDataInit()
      if (this.attrcurrentRow.signList) {
        this.uploadfileData = this.attrcurrentRow.signList
      }
      //初始化上传清单数据
      this.show = !this.show
    },
    batchSignListCl(row) {
      //初始化上传清单数据
      this.batchUploadfileData = [
        { item: 0, itemName: "外观设计文件" },
        { item: 1, itemName: "包装盒设计文件" },
        { item: 2, itemName: "说明书设计文件" },
        { item: 3, itemName: "包装说明文件" },
        { item: 4, itemName: "其他文件1" },
        { item: 5, itemName: "其他文件2" },
        { item: 6, itemName: "其他文件3" }
      ]
      this.show4 = !this.show4
    },
    uploadFileFn(row) {
      this.currentRow = row
    },
    batchUploadFileFn(row) {
      this.batchCurrentRow = row
    },
    signFileChange(file, fileList) {
      this.fullscreenLoading = true
      //文件上传
      if (!this.currentRow.signListFile) {
        this.$set(this.currentRow, "signListFile", [])
      }
      let res = checkDesignFile(file, this.currentRow.signListFile)
      if (!res.flag) {
        this.fullscreenLoading = false
        fileList.pop()
        this.$message.error(res.msg)
        return
      }
      if (!this.currentRow.signListFile) {
        this.currentRow.signListFile = []
      }
      let formdata = new FormData()
      formdata.append("listId", "-1")
      formdata.append("file", file.raw)
      //上传文件校验
      //有关联的
      uplaodDesignFile(formdata)
        .then((res) => {
          if (res.data.code) {
            let fileTmp = {}
            fileTmp.listAddtressId = res.data.code
            fileTmp.addressUrl = res.data.data
            fileTmp.name = file.name
            //上传成功
            this.currentRow.signListFile.push(fileTmp)
          }
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },
    batchSignFileChange(file, fileList) {
      this.fullscreenLoading = true
      if (!this.batchCurrentRow.signListFile) {
        this.$set(this.batchCurrentRow, "signListFile", [])
      }
      let idList = []
      this.attrTableData.forEach((item) => {
        idList.push("-1")
      })
      let formdata = new FormData()
      formdata.append("idList", idList)
      formdata.append("file", file.raw)
      //上传文件校验
      //有关联的
      uplaodDesignFileV2(formdata)
        .then((res) => {
          if (res.data.code === 0) {
            const signListFile = res.data.data.map((item) => {
              return {
                listAddtressId: item.listAddtressId,
                addressUrl: item.addressUrl,
                name: file.name
              }
            })
            //上传成功
            this.batchCurrentRow.signListFile = signListFile
          }
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },
    /*清单确认操作*/
    uploadlistCom() {
      this.attrcurrentRow.signList = this.uploadfileData
      this.show = !this.show
    },
    /*清单取消操作*/
    uploadlistCan() {
      this.show = !this.show
    },
    batchUploadlistCom() {
      const status = this.batchUploadfileData.some((item) => {
        return (
          item.designRequire || item.remarks || item.completeTime || (item.signListFile && item.signListFile.length)
        )
      })
      if (!status) {
        this.show4 = !this.show4
        return
      }

      this.attrTableData.forEach((item, index) => {
        if (item.signList && item.signList.length) {
          item.signList.forEach((listItem, listIndex) => {
            let obj = this.batchUploadfileData[listIndex]
            listItem.designRequire = obj.designRequire ? obj.designRequire : ""
            listItem.remarks = obj.remarks ? obj.remarks : ""
            listItem.completeTime = obj.completeTime ? obj.completeTime : ""

            if (listItem.signListFile && listItem.signListFile.length) {
              listItem.signListFile.forEach((fileItem) => {
                this.fileDelId.push(fileItem.listAddtressId)
              })
            }

            listItem.signListFile = deepClone(obj.signListFile)

            if (listItem.signListFile && listItem.signListFile.length) {
              listItem.signListFile = [listItem.signListFile[index]]
            } else {
              listItem.signListFile = []
            }
          })
        } else {
          item.signList = deepClone(this.batchUploadfileData)
          item.signList.forEach((listItem) => {
            if (listItem.signListFile && listItem.signListFile.length) {
              listItem.signListFile = [listItem.signListFile[index]]
            }
          })
        }
      })
      this.$message.success("批量上传成功")
      this.show4 = !this.show4
    },
    /*清单取消操作*/
    batchUploadlistCan() {
      this.batchCurrentRow = {}
      this.show4 = !this.show4
    },
    viewDetail(row) {
      //文件查看
      this.currentRow = row
      if (row.signListFile) {
        row.signListFile.forEach((des) => {
          des.name = des.addressUrl.substring(des.addressUrl.lastIndexOf("_") + 1, des.addressUrl.length)
        })
        this.viewList = row.signListFile
      } else {
        this.viewList = []
      }
      this.centerDialogVisible = true
    },
    batchViewDetail(row) {
      if (row.signListFile) {
        row.signListFile.forEach((des) => {
          des.name = des.addressUrl.substring(des.addressUrl.lastIndexOf("_") + 1, des.addressUrl.length)
        })
        this.viewList = [row.signListFile[0]]
      } else {
        this.viewList = []
      }
      this.batchCenterDialogVisible = true
    },
    download(val) {
      // 下载
      window.location = getTokenUrl(val.addressUrl)
    },
    preViewMethods(val) {
      let reg = (reg = /^.*.pdf$/)
      if (reg.test(val.addressUrl)) {
        let url = getTokenUrl(val.addressUrl)
        this.$refs.preView.pdfFn(url)
      } else {
        this.dialogImageUrl = getTokenUrl(val.addressUrl)
        this.dialogVisible = true
        this.showImageName = "设计图片"
      }
    },
    deletePic(val) {
      this.$confirm("是否继续删除该文件?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除
          //需要删除 查看的信息和
          this.fileDelId.push(val.listAddtressId) //保存需要移除的文件ID
          this.viewList = this.viewList.filter((v) => v.listAddtressId !== val.listAddtressId)
          this.currentRow.signListFile = this.viewList
        })
        .catch((res) => {})
    },
    batchDeletePic(val) {
      this.$confirm("是否继续删除该文件?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除
          this.viewList = this.viewList.filter((v) => v.listAddtressId !== val.listAddtressId)
          this.batchCurrentRow.signListFile = []
        })
        .catch((res) => {})
    },
    /**清单列表 */
    /**图片上传 */
    picUpCl(row) {
      this.fileList = []
      this.fileRemove = []
      this.showImageList = []
      this.currentImageRow = row
      if (!this.currentImageRow.pictureDe) {
        this.currentImageRow.pictureDe = []
      }
      if (row.pictureDe) {
        row.pictureDe.forEach((pic) => {
          pic.url = getTokenUrl(pic.picAddr)
          this.showImageList.push(pic) //需要展示的图片列表信息
        })
      }
      this.show2 = !this.show2
    },
    batchPicUpCl(row) {
      this.batchFileList = []
      this.showBatchImageList = []
      this.show3 = !this.show3
    },
    imageFileCom() {
      this.imageLoading = true
      let res = fliterImageFile(this.fileList, this.fileRemove, this.imageDelId)
      this.fileList = res.fileList
      let bl = true
      if (this.currentImageRow.pictureDe) {
        let idst = this.imageDelId
        this.currentImageRow.pictureDe = this.currentImageRow.pictureDe.filter((de) => {
          //移除已有的ID
          bl = idst.indexOf(de.picId) == -1
          return bl
        })
      }
      let limitFlag = limitFilesMaxSize(this.fileList)
      if (!limitFlag) {
        this.$message.error("上传图片总大小不得超过20M!!")
        this.imageLoading = false
        return
      }
      if (this.fileList && this.fileList.length > 0) {
        this.formData = new FormData()
        this.fileList.forEach((file) => {
          this.formData.append("file", file.raw, file.name)
        })
        this.formData.append("sku_id", "-1")
        this.formData.append("type", 0)
        uploadSkuImage(this.formData)
          .then((data) => {
            if (data.data.code == -1) {
              this.imageLoading = false
              this.$message.error(data.data.msg)
            } else {
              let imgArr = data.data.data
              if (imgArr) {
                imgArr.forEach((img) => {
                  let file = {}
                  file.url = getTokenUrl(img.picAddr)
                  file.picAddr = img.picAddr
                  file.picId = img.picId
                  this.currentImageRow.pictureDe.push(file)
                })
              }
              this.imageLoading = false
              this.show2 = !this.show2
            }
          })
          .catch(() => {
            this.imageLoading = false
          })
      } else {
        this.show2 = !this.show2
        this.imageLoading = false
      }
    },
    batchImageFileCom() {
      this.imageLoading = true
      let limitFlag = limitFilesMaxSize(this.batchFileList)
      if (!limitFlag) {
        this.$message.error("上传图片总大小不得超过20M!!")
        this.imageLoading = false
        return
      }
      if (this.batchFileList && this.batchFileList.length > 0) {
        this.formData = new FormData()
        this.batchFileList.forEach((file) => {
          this.formData.append("file", file.raw, file.name)
        })

        let skuIds = []
        this.attrTableData.forEach((item) => {
          skuIds.push("-1")
        })
        this.formData.append("skuIds", skuIds)
        this.formData.append("type", 0)

        uploadSkuImageV2(this.formData)
          .then((data) => {
            if (data.data.code == -1) {
              this.imageLoading = false
              this.$message.error(data.data.msg)
            } else {
              let imgArr = data.data.data
              if (imgArr) {
                this.attrTableData.forEach((item) => {
                  if (item.pictureDe && item.pictureDe.length) {
                    this.imageDelId = [...this.imageDelId, ...item.pictureDe.map((item) => item.picId)]
                  }
                })
                imgArr.forEach((img, index) => {
                  let file = {}
                  file.url = getTokenUrl(img.picAddr)
                  file.picAddr = img.picAddr
                  file.picId = img.picId
                  this.$set(this.attrTableData[index], "pictureDe", [file])
                })
                this.imageLoading = false
                this.show3 = !this.show3
                this.$message.success("批量上传成功")
              }
            }
          })
          .catch(() => {
            this.imageLoading = false
          })
      } else {
        this.show3 = !this.show3
        this.imageLoading = false
      }
    },
    handleExceed(files, fileList) {
      this.$message.error("样品图片不得上传超过20个!")
    },
    batchHandleExceed() {
      this.$message.error("样品图片不得上传超过1个!")
    },
    imageFileChange(file, fileList) {
      if (file.name.length > 44) {
        this.$notify.error({
          title: "错误",
          message: file.name + "图片名称长度不得超过40!"
        })
        fileList.pop()
        return
      }
      const is20COUNT = fileList.length <= 20
      const isIMAGE = file.raw.type === "image/jpeg" || file.raw.type === "image/jpg" || file.raw.type === "image/png"
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!is20COUNT) {
        this.$notify.error({
          title: "错误",
          message: "列表图片不得超过20个!"
        })
        fileList.pop()
        return
      }
      if (!isLt1M) {
        this.$notify.error({
          title: "错误",
          message: file.name + "图片超过5M"
        })
        fileList.pop()
        return
      }
      if (!isIMAGE) {
        this.$notify.error({
          title: "错误",
          message: "上传文件只能是图片格式!"
        })
        fileList.pop()
        return
      }
      this.fileList.push(file)
      this.showImageList.push(file)
      return false
    },
    batchImageFileChange(file, fileList) {
      if (file.name.length > 44) {
        this.$notify.error({
          title: "错误",
          message: file.name + "图片名称长度不得超过40!"
        })
        fileList.pop()
        return
      }
      const is20COUNT = fileList.length <= 1
      const isIMAGE = file.raw.type === "image/jpeg" || file.raw.type === "image/jpg" || file.raw.type === "image/png"
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!is20COUNT) {
        this.$notify.error({
          title: "错误",
          message: "列表图片不得超过1个!"
        })
        fileList.pop()
        return
      }
      if (!isLt1M) {
        this.$notify.error({
          title: "错误",
          message: file.name + "图片超过5M"
        })
        fileList.pop()
        return
      }
      if (!isIMAGE) {
        this.$notify.error({
          title: "错误",
          message: "上传文件只能是图片格式!"
        })
        fileList.pop()
        return
      }
      this.batchFileList.push(file)
      this.showBatchImageList.push(file)
      return false
    },
    //图片移除
    imageRemove(file, fileList) {
      //删除的文件
      this.fileRemove.push(file)
      this.showImageList = this.showImageList.filter((sh) => sh.uid !== file.uid)
    },
    batchImageRemove(file, fileList) {
      this.showBatchImageList = this.showBatchImageList.filter((sh) => sh.uid !== file.uid)
      this.batchFileList = []
    },
    /*提交创建单据*/
    submitFinsh(type) {
      let _this = this
      preventShake.preventShake((bool) => {
        if (bool) {
          _this.submitInfo(type)
        }
      })
    },
    submitCancel() {
      this.prdmodal = {}
      this.attrTableData = [] //属性组合模块
      this.$router.$avueRouter.closeTag()
      this.$router.push({ path: "/product/prdlist" })
    },
    submitInfo(type) {
      this.$refs["prdmodal"].validate((val) => {
        if (val) {
          for (let i = 0; i < this.attrTableData.length; i++) {
            if (!this.attrTableData[i].productPositioning) {
              this.$message.warning(`请填写属性组合第${i + 1}行中${this.attrTableData[i].skuCode}的产品定位`)
              return
            }
            if (!this.attrTableData[i].pictureDe || !this.attrTableData[i].pictureDe.length) {
              this.$message.warning(`请上传属性组合第${i + 1}行中${this.attrTableData[i].skuCode}的图片`)
              return
            }
          }

          if (val) {
            if (this.id && this.id != -1 && !this.isUpGrade) {
              //编辑
              let formData = new FormData()
              let delParam = {}
              delParam.fileIds = this.fileDelId
              delParam.imageIds = this.imageDelId
              delParam.skuIds = this.skuDelId
              formData.append("prdSpuDto", JSON.stringify(this.prdmodal)) //spu信息
              formData.append("skuInfos", JSON.stringify(this.attrTableData)) //sku信息
              formData.append("processStep", type)
              formData.append("id", this.id)
              formData.append("delParam", JSON.stringify(delParam))
              submitPrdEditAlone(formData)
                .then((res) => {
                  if (res.data.code == 0) {
                    this.$message.success("确认成功!")
                    this.submitCancel()
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
                .finally(() => {
                  this.buttonLoading = false
                })
            } else {
              //新增
              let formData = new FormData()
              formData.append("prdSpuDto", JSON.stringify(this.prdmodal)) //spu信息
              formData.append("skuInfos", JSON.stringify(this.attrTableData)) //sku信息
              formData.append("processStep", type)
              formData.append("isUpGrade", this.isUpGrade)

              submitPrdAlone(formData)
                .then((res) => {
                  if (res.data.code == 0) {
                    this.$message.success("操作成功!")
                    this.submitCancel()
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
                .finally(() => {
                  this.buttonLoading = false
                })
            }
          }
        }
      })
    },
    toUpperCase(scope) {
      if (scope.row.skuCode) {
        scope.row.skuCode = scope.row.skuCode.replace(/\s/g, "").toUpperCase()
      }
    },
    specialTrim(scope) {
      if (scope.row.skuName) {
        scope.row.skuName = scope.row.skuName.replace(/\s/g, "")
      }
    }
  }
}
</script>

<style lang="scss">
@import "./createprd.scss";
</style>
