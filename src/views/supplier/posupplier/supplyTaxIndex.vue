<template>
  <div>
    <basic-container id="supplyTax">
      <div class="banner-text">
        <!-- <el-row :gutter="20" class="supplyTax-header">
          <span><strong>税务资质：</strong>
            <el-button type="text" @click="showOperateLog()">{{tqMsg}}</el-button>
          </span>
          <el-button
            size="mini"
            type="primary"
            v-if="permissions.purchase_posupplier_save"
            @click="saveForm(0)"
          >保存</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="permissions.purchase_posupplier_submit"
            @click="saveForm(1)"
          >提交</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="permissions.purchase_posupplier_submit"
            @click="changeStatusButton(0)"
          >撤销提交</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="permissions.purchase_posupplier_confrim"
            @click="showConfrim()"
          >审核</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="permissions.purchase_posupplier_cancel"
            @click="changeStatusButton(3)"
          >取消资质</el-button>
        </el-row> -->

        <div class="posupplier-last-header flex-spance-between">
          <div class="">
            <span
              ><strong>税务资质：</strong>
              <el-button type="text" @click="showOperateLog()">{{ tqMsg }}</el-button>
            </span>
          </div>

          <div>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              v-if="permissions.purchase_posupplier_save"
              @click="saveForm(0)"
              >保 存</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-upload"
              v-if="permissions.purchase_posupplier_submit"
              @click="saveForm(1)"
              >提 交</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-back"
              v-if="permissions.purchase_posupplier_submit"
              @click="changeStatusButton(0)"
              >撤 提</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-check"
              v-if="permissions.purchase_posupplier_confrim"
              @click="showConfrim()"
              >审 核</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-back"
              v-if="permissions.purchase_posupplier_cancel"
              @click="changeStatusButton(3)"
              >取消资质</el-button
            >
          </div>
        </div>
        <el-form :inline="true" :model="formValue" :rules="rules" ref="ruleForm" class="demo-form-inline">
          <el-row :gutter="24">
            <!-- <el-col :span="3" >
              <div class="grid-content bg-purple">
                <span >*增值税率</span>
              </div>
            </el-col>-->
            <!-- <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="增值税率" prop="vatRate">
                  <div>
                    <el-input
                      size="mini"
                      placeholder="请输入内容"
                      v-model="formValue.vatRate"
                      :disabled="disabledTag"
                      style="width:70%">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </el-form-item>
              </div>
            </el-col> -->
            <el-col :span="12" style="padding-left: 15px">
              <div class="grid-content bg-purple">
                <el-form-item label="纳税人认定时间">
                  <!-- <span>纳税人认定时间</span> -->
                  <el-date-picker
                    size="mini"
                    :disabled="disabledTag"
                    v-model="formValue.confirmDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 60%"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <!-- <el-row :gutter="24">
            <el-col :span="3">
              <div class="grid-content bg-purple">
                  <span>纳税人认定时间</span>
              </div>
            </el-col>-->
          <!-- <el-col :span="24">
              <div class="grid-content bg-purple">
                <el-form-item label="纳税人认定时间">
                  <span>纳税人认定时间</span> -->
          <!-- <el-date-picker
                    size="small"
                    :disabled="disabledTag"
                    v-model="formValue.confirmDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width:60%;"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row> -->

          <el-row :gutter="24">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span class="span-height">一般纳税人认定通知书</span>

                <div class="y-upload-box">
                  <el-upload
                    :disabled="disabledTag"
                    class="upload-demo"
                    action="string"
                    list-type="picture"
                    accept="image/jpeg, image/png, image/jpg"
                    :on-preview="handlePreview"
                    :on-remove="certificateFileRemove"
                    :before-upload="onBeforeUploadImage"
                    :http-request="uploadNotice"
                    :on-change="noticeChange"
                    :limit="1"
                    :on-exceed="certificateFileHandleExceed"
                    :file-list="certificateFile"
                  >
                    <el-button size="small" :disabled="disabledTag" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-button size="small" type="primary" @click="downLoadAduitDetails(certificateFile, 3)"
                    >点击下载</el-button
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="padding-left: 0px">
              <div class="grid-content bg-purple picture-30">
                <span class="span-height">验厂报告</span>
                <div class="y-upload-box">
                  <el-upload
                    :disabled="disabledTag"
                    class="upload-demo"
                    action
                    list-type="picture"
                    :http-request="uploadNotice"
                    :on-preview="handlePreview"
                    :on-remove="aduitDetailsRemove"
                    accept="image/jpeg, image/png, image/jpg"
                    :before-upload="onBeforeUploadImage"
                    multiple
                    :limit="3"
                    :on-change="reprotChange"
                    :on-exceed="handleExceed"
                    :file-list="aduitDetails"
                  >
                    <el-button size="small" :disabled="disabledTag" type="primary">点击上传</el-button>
                    <!-- <i :disabled="disabledTag" class="el-icon-plus"></i> -->
                  </el-upload>
                  <el-button size="small" type="primary" @click="downLoadAduitDetails(aduitDetails, 2)"
                    >点击下载</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="padding-left: 18px">
              <div class="grid-content bg-purple">
                <span class="span-height">供应商进项发票</span>
                <br />
                <span class="span-height color-ccc">请提供供应商近半年每个月的进项发票，最多6张</span>

                <el-upload
                  action
                  list-type="picture-card"
                  :disabled="disabledTag"
                  :http-request="uploadNotice"
                  :on-preview="handlePictureCardPreview"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :on-remove="invoiceReceiptsFilesRemove"
                  :on-change="invoiceReceiptsChange"
                  :file-list="invoiceReceiptsFiles"
                  :on-exceed="noticeExceed"
                  :limit="6"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span class="span-height">供应商销项发票</span>
                <br />
                <span class="span-height color-ccc">请提供供应商近半年每个月的进项发票，最多6张</span>

                <el-upload
                  action
                  :disabled="disabledTag"
                  :http-request="uploadNotice"
                  list-type="picture-card"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="salesInvoiceFilesRemove"
                  :on-change="salesInvoiceChange"
                  :file-list="salesInvoiceFiles"
                  :limit="6"
                  :on-exceed="noticeExceed"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </div>
            </el-col>
          </el-row>

          <!--  <el-row :gutter="24">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <span class="span-height">验厂报告</span>
                <div class="y-upload-box">
                  <el-upload
                    :disabled="disabledTag"
                    class="upload-demo"
                    action
                    list-type="picture"
                    :http-request="uploadNotice"
                    :on-preview="handlePreview"
                    :on-remove="aduitDetailsRemove"
                    accept="image/jpeg, image/png, image/jpg"
                    :before-upload="onBeforeUploadImage"
                    multiple
                    :limit="3"
                    :on-change="reprotChange"
                    :on-exceed="handleExceed"
                    :file-list="aduitDetails"
                  >
                    <el-button size="small" :disabled="disabledTag" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-button
                    size="small"
                    type="primary"
                    @click="downLoadAduitDetails(aduitDetails,2)"
                  >点击下载</el-button>
                </div>
              </div> 
            </el-col>
          </el-row>-->

          <!-- <el-row :gutter="24">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <span class="span-height">供应商进项发票</span>
                <br>
                <span class="span-height">请提供供应商近半年每个月的进项发票，最多6张</span>

                <el-upload
                  action
                  list-type="picture-card"
                  :disabled="disabledTag"
                  :http-request="uploadNotice"
                  :on-preview="handlePictureCardPreview"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :on-remove="invoiceReceiptsFilesRemove"
                  :on-change="invoiceReceiptsChange"
                  :file-list="invoiceReceiptsFiles"
                  :on-exceed="noticeExceed"
                  :limit="6"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog>
              </div>
            </el-col>
          </el-row> -->

          <!-- <el-row :gutter="24">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <span class="span-height">供应商销项发票</span>
                <br>
                <span class="span-height">请提供供应商近半年每个月的进项发票，最多6张</span>

                <el-upload
                  action
                  :disabled="disabledTag"
                  :http-request="uploadNotice"
                  list-type="picture-card"
                  accept="image/jpeg, image/png, image/jpg"
                  :before-upload="onBeforeUploadImage"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="salesInvoiceFilesRemove"
                  :on-change="salesInvoiceChange"
                  :file-list="salesInvoiceFiles"
                  :limit="6"
                  :on-exceed="noticeExceed"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog>
              </div>
            </el-col>
          </el-row> -->

          <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="30%">
            <!-- :before-close="handleClose"> -->
            <el-radio v-model="confrimType" label="1">同意</el-radio>
            <el-radio v-model="confrimType" label="2">拒绝</el-radio>
            <el-input
              type="textarea"
              :rows="2"
              :maxlength="100"
              placeholder="请填写相关信息反馈给开发人员，不得超过100个字符。"
              v-model="confrimTextarea"
            ></el-input>
            <span slot="footer" class="dialog-footer">
              <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
              <el-button type="primary" @click="handleConfrim()">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 操作日志 -->
          <pooperatelog ref="pooperatelog"></pooperatelog>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { saveOrSubmitForm, getInfo, changeStatus, delPic } from "@/api/posupplier/supplyTax"
import { getTokenUrl, getToken } from "@/util/auth"
import { removePrdSkuImage } from "@/api/product/prdskupic/prdskupic"
import { mapGetters } from "vuex"
import pooperatelog from "@/views/supplier/log/index"
export default {
  components: {
    pooperatelog
  },
  data() {
    var validateNumber = function (rules, value, callback) {
      if (!/^(?:1[0-6]|[0-9])$/.test(value)) {
        callback(new Error("请填写0-16的正整数"))
      } else {
        callback()
      }
    }
    return {
      rules: {
        vatRate: [
          { required: true, message: "请输入增值税率", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ]
      },
      delPicIdList: [],
      disabledTag: false,
      confrimTextarea: "",
      confrimTitle: "税务资质审核",
      confrimType: "1",
      confrimDialog: false,
      tqMsg: "无税务资质",
      formValue: {
        supplierNo:
          typeof this.$route.query.paramSupplierNo == "undefined" ? this.gycode : this.$route.query.paramSupplierNo,
        vatRate: 16
      },
      certificateFile: [],
      aduitDetails: [],
      invoiceReceiptsFiles: [],
      salesInvoiceFiles: [],
      formData: {},
      dialogVisible: false,
      dialogImageUrl: ""
    }
  },
  created() {
    if (this.formValue.supplierNo == "" || typeof this.formValue.supplierNo == "undefined") {
      this.$message.error("请先完善[基本信息]")
      return
    }
    getInfo(this.formValue.supplierNo).then((response) => {
      var returnData = response.data.data
      if (response.data.data) {
        this.formValue = returnData
        this.formValue.vatRate = this.formValue.vatRate * 100
        if (this.formValue.taxQualification == 0) {
          this.tqMsg = "无税务资质"
          this.disabledTag = false
        } else if (this.formValue.taxQualification == 1) {
          this.disabledTag = true
          this.tqMsg = "资质申请中"
        } else if (this.formValue.taxQualification == 2) {
          this.disabledTag = true
          this.tqMsg = "有税务资质"
        }

        returnData.picUrl.forEach((pic) => {
          var url = pic.invoiceAttach
          const file = {}
          file.name = url.substring(url.indexOf("_") + 1)
          // var filePath = url.substring(0, url.indexOf("_") + 1);
          file.url = getTokenUrl(url)
          file.picId = pic.invoiceHistoryId
          if (pic.invoiceType == 0) {
            this.invoiceReceiptsFiles.push(file)
          } else if (pic.invoiceType == 1) {
            this.salesInvoiceFiles.push(file)
          } else if (pic.invoiceType == 2) {
            this.aduitDetails.push(file)
          } else if (pic.invoiceType == 3) {
            this.certificateFile.push(file)
          }
        })
      }
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  props: {
    gycode: [String, Number]
  },
  methods: {
    showOperateLog() {
      this.$refs.pooperatelog.showOperateLogDialog(this.formValue.supplierNo, 3)
    },
    showConfrim() {
      this.confrimType = "1"
      this.confrimTextarea = ""
      this.confrimDialog = true
    },
    handleConfrim() {
      if (this.confrimType == 2) {
        if (!this.confrimTextarea) {
          this.$message.error("请填写拒绝原因")
          return
        }
      }
      this.changeStatusButton(this.confrimType)
      this.confrimDialog = false
    },
    downLoadPic(files) {
      if (files.length == 0) {
        this.$message.warning("无文件可下载")
        return
      }
      files.forEach((pic) => {
        if (pic.picId) {
          window.location.href = pic.url
        } else {
          this.$message.warning("无文件可下载")
        }
      })
    },
    downLoadAduitDetails(files, type) {
      // var fileLists = "";
      // let accessToken;
      // files.forEach(pic => {
      //   if (pic.picId) {
      //     accessToken = pic.url.substring(pic.url.indexOf("access_token"));
      //     // window.open(pic.url);
      //     // //window.location.href=pic.url;

      //     fileLists = fileLists + "&fileList[]=" + pic.url;
      //   }
      // });
      var count = 0
      files.forEach((item) => {
        if (item.picId) {
          count++
        }
      })
      if (count == 0) {
        this.$message.warning("无文件可下载")
      } else {
        location.href =
          window.location.origin +
          "/api/supplier/posuppliertax/downLoadPic?supplierNo=" +
          this.formValue.supplierNo +
          "&type=" +
          type +
          "&access_token=" +
          getToken()
      }
    },
    /**
     * buttonType 0：撤销提交 1：审核 2：审核拒绝 3：取消资质
     *
     */
    changeStatusButton(buttonType) {
      changeStatus({
        supplierNo: this.formValue.supplierNo,
        type: buttonType,
        msg: this.confrimTextarea
      }).then((response) => {
        if (response.data.code == 0) {
          var returnRes = response.data.data
          if (returnRes.taxQualification == 0) {
            this.tqMsg = "无税务资质"
            this.disabledTag = false
          } else if (returnRes.taxQualification == 1) {
            this.tqMsg = "资质申请中"
            this.disabledTag = true
          } else if (returnRes.taxQualification == 2) {
            this.tqMsg = "有税务资质"
            this.disabledTag = true
          }

          this.$notify({
            title: "成功",
            message: "操作成功",
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
      })
    },
    onBeforeUploadImage(file) {
      if (file.name.indexOf(",") != -1 || file.name.indexOf("[") != -1 || file.name.indexOf("]") != -1) {
        this.$message.error("文件名包含敏感字符,请修改后重新上传")
        return false
      }
      if (file.name.length > 40) {
        this.$message.error("文件名长度超出40个字符，请重新命名后上传")
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png")) {
        this.$message.error("上传文件只能是图片格式!")
        return false
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!")
        return false
      }
    },
    salesInvoiceChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error("当前文件已经存在!")
        fileList.pop()
      }
      this.salesInvoiceFiles = fileList
    },
    invoiceReceiptsChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error("当前文件已经存在!")
        fileList.pop()
      }
      this.invoiceReceiptsFiles = fileList
    },
    reprotChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error("当前文件已经存在!")
        fileList.pop()
      }
      this.aduitDetails = fileList
    },
    noticeChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.certificateFile = fileList
    },
    //保存 type:0 保存 1:提交
    saveForm(type) {
      if (!this.aduitDetails.length > 0) {
        this.$message.error("必须至少上传一张验厂报告")
        return
      }
      // if (!this.invoiceReceiptsFiles.length > 0) {
      //   this.$message.error("必须至少上传一张供应商进项发票");
      //   return;
      // }
      // if (!this.salesInvoiceFiles.length > 0) {
      //   this.$message.error("必须至少上传一张供应商销项发票");
      //   return;
      // }
      //this.aduitDetails  this.invoiceReceiptsFiles this.salesInvoiceFiles this.certificateFile
      //检查文件大小
      let size = 0
      this.aduitDetails.forEach((f) => {
        if (f.size) {
          size += f.size
        }
      })
      this.invoiceReceiptsFiles.forEach((f) => {
        if (f.size) {
          size += f.size
        }
      })
      this.salesInvoiceFiles.forEach((f) => {
        if (f.size) {
          size += f.size
        }
      })
      this.certificateFile.forEach((f) => {
        if (f.size) {
          size += f.size
        }
      })
      if (size / 1024 / 1024 > 20) {
        this.$message.error("上传图片总大小不得超过20M!!")
        return
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.formData = new FormData()
          this.certificateFile.forEach((file) => {
            if (file.picId) {
              //picId.push(file.picId);
            } else {
              this.formData.append("certificateFile", file.raw, file.raw.name) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            }
          })
          this.aduitDetails.forEach((file) => {
            if (file.picId) {
              //picId.push(file.picId);
            } else {
              this.formData.append("aduitDetails", file.raw, file.raw.name) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            }
          })
          this.invoiceReceiptsFiles.forEach((file) => {
            if (file.picId) {
              //picId.push(file.picId);
            } else {
              this.formData.append("invoiceReceiptsFiles", file.raw, file.raw.name) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            }
          })
          this.salesInvoiceFiles.forEach((file) => {
            if (file.picId) {
              //picId.push(file.picId);
            } else {
              this.formData.append("salesInvoiceFiles", file.raw, file.raw.name) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            }
          })
          this.formData.append("delPicIdList", this.delPicIdList)
          this.formData.append("row", JSON.stringify(this.formValue))
          var _this = this

          saveOrSubmitForm(this.formData, type)
            .then((response) => {
              if (response.data.code == 0) {
                //回写上传图片的地址和唯一ID
                for (let index = 0; index < this.certificateFile.length; index++) {
                  const element = this.certificateFile[index]
                  if (!element.picId) {
                    this.certificateFile.splice(index, 1)
                  }
                }
                for (let index = 0; index < this.aduitDetails.length; index++) {
                  const element = this.aduitDetails[index]
                  if (!element.picId) {
                    this.aduitDetails.splice(index, 1)
                    index--
                  }
                }
                for (let index = 0; index < this.invoiceReceiptsFiles.length; index++) {
                  const element = this.invoiceReceiptsFiles[index]
                  if (!element.picId) {
                    this.invoiceReceiptsFiles.splice(index, 1)
                    index--
                  }
                }
                for (let index = 0; index < this.salesInvoiceFiles.length; index++) {
                  const element = this.salesInvoiceFiles[index]
                  if (!element.picId) {
                    this.salesInvoiceFiles.splice(index, 1)
                    index--
                  }
                }
                const returnRes = response.data.data
                if (returnRes.taxQualification == 0) {
                  _this.tqMsg = "无税务资质"
                  this.disabledTag = false
                } else if (returnRes.taxQualification == 1) {
                  _this.tqMsg = "资质申请中"
                  this.disabledTag = true
                } else if (returnRes.taxQualification == 2) {
                  _this.tqMsg = "有税务资质"
                  this.disabledTag = true
                }
                returnRes.picUrl.forEach((pic) => {
                  const file = {}
                  file.url = getTokenUrl(pic.invoiceAttach)
                  file.name = pic.invoiceAttach.substring(pic.invoiceAttach.indexOf("_") + 1)
                  file.picId = pic.invoiceHistoryId
                  if (pic.invoiceType == 0) {
                    this.invoiceReceiptsFiles.push(file)
                  } else if (pic.invoiceType == 1) {
                    this.salesInvoiceFiles.push(file)
                  } else if (pic.invoiceType == 2) {
                    this.aduitDetails.push(file)
                  } else if (pic.invoiceType == 3) {
                    this.certificateFile.push(file)
                  }
                })

                this.$notify({
                  title: "成功",
                  message: "操作成功",
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
            })
            .finally(() => {})
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    uploadNotice() {},
    aduitDetailsRemove(file, fileLis) {
      this.aduitDetails = fileLis
      if (file.picId) {
        this.delPicIdList.push(file.picId)
        // delPic(file.picId).then(response => {
        //   if (response.data.code == 0) {
        //     this.$notify({
        //       title: "成功",
        //       message: "删除成功",
        //       type: "success",
        //       duration: 2000
        //     });
        //   } else if (response.data.code == 1) {
        //     this.$message.error(response.data.msg);
        //     return;
        //   } else {
        //     this.$message.error("操作失败");
        //     return;
        //   }
        // });
      }
    },
    invoiceReceiptsFilesRemove(file, fileLis) {
      this.invoiceReceiptsFiles = fileLis
      if (file.picId) {
        this.delPicIdList.push(file.picId)
        // delPic(file.picId).then(response => {
        //   if (response.data.code == 0) {
        //     this.$notify({
        //       title: "成功",
        //       message: "删除成功",
        //       type: "success",
        //       duration: 2000
        //     });
        //   } else if (response.data.code == 1) {
        //     this.$message.error(response.data.msg);
        //     return;
        //   } else {
        //     this.$message.error("操作失败");
        //     return;
        //   }
        // });
      }
    },
    salesInvoiceFilesRemove(file, fileLis) {
      this.salesInvoiceFiles = fileLis
      if (file.picId) {
        this.delPicIdList.push(file.picId)
        // delPic(file.picId).then(response => {
        //   if (response.data.code == 0) {
        //     this.$notify({
        //       title: "成功",
        //       message: "删除成功",
        //       type: "success",
        //       duration: 2000
        //     });
        //   } else if (response.data.code == 1) {
        //     this.$message.error(response.data.msg);
        //     return;
        //   } else {
        //     this.$message.error("操作失败");
        //     return;
        //   }
        // });
      }
    },
    certificateFileRemove(file, fileLis) {
      this.certificateFile = fileLis
      if (file.picId) {
        this.delPicIdList.push(file.picId)
        // delPic(file.picId).then(response => {
        //   if (response.data.code == 0) {
        //     this.$notify({
        //       title: "成功",
        //       message: "删除成功",
        //       type: "success",
        //       duration: 2000
        //     });
        //   } else if (response.data.code == 1) {
        //     this.$message.error(response.data.msg);
        //     return;
        //   } else {
        //     this.$message.error("操作失败");
        //     return;
        //   }
        // });
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    certificateFileHandleExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传 1 个文件`)
    },
    noticeExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传 6 个文件`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传 3 个文件`)
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除图片吗`);
    // },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss">
#supplyTax {
  .el-row {
    margin-bottom: 20px;
    margin-left: 0 !important;
    margin-top: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-form-item {
    // margin-bottom: 0px;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    // display: inline-block;
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
  }
  .y-upload-box {
    position: relative;
    > button {
      position: absolute;
      left: 100px;
      top: 0;
    }
  }
  .banner-text {
    border-radius: 5px;
    border: 1px solid #e9ecee;
    margin-top: 12px;
  }
  .span-height {
    line-height: 30px;
  }
  .supplyTax-header {
    background: #f6f9fb;
    padding: 14px 18px;
    border-bottom: 1px solid #e9ecee;
  }
  // .el-upload-list{
  //   display: flex;
  // }
  .el-upload-list--picture {
    .el-upload-list__item {
      width: 58%;
      height: 120px;
    }
    .el-upload-list__item-thumbnail {
      width: 100px;
      height: 100px;
    }
    .el-upload-list__item-name {
      margin-top: 40px;
      margin-right: 0px;
    }
  }

  .picture-30 {
    .el-upload-list__item {
      width: 48%;
      float: left;
      margin-left: 2px;
    }
  }
  .color-ccc {
    color: #ccc;
  }

  //重复
  .posupplier-last-header {
    // display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #f6f9fb;
    padding: 14px 18px;
    border-bottom: 1px solid #e9ecee;
  }
  .el-dialog__header {
    background: white;
    border-bottom: none;
  }
}
</style>
