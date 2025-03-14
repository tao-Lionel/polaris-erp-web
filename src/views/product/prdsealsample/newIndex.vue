<template>
  <div>
    <basic-container id="sealSampleTable">
      <div>
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '封样确认单',
            list: [{ label: 'SKU', value: this.$route.query.skuCode }]
          }"
        ></detail-template>

        <!-- <div style="width:100%; padding-bottom:10px;">
          <p class="prd-title">封样确认单</p>
          <p class="prd-sku">SKU:{{this.$route.query.skuCode}}</p>
        </div>-->
        <el-form label-width="115px" :rules="rules" :model="formInline" ref="ruleForm" class="demo-form-inlin">
          <detail-wrapper :options="{ title: '产品重量' }">
            <el-row :gutter="24">
              <el-col :span="12">
                <div class="bg-purple product_size">
                  <el-form-item label="产品净重(kg)" prop="skuWeight">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.skuWeight"
                      size="mini"
                      @change="validateNumber($event, 'skuWeight')"
                      placeholder="请输入产品净重"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="bg-purple product_size">
                  <el-form-item label="产品毛重(kg)" prop="skuGrossWeight">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.skuGrossWeight"
                      size="mini"
                      @change="validateNumber($event, 'skuGrossWeight')"
                      placeholder="请输入产品毛重"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <!-- <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="箱毛重(kg)" prop="boxGrossWeight">
                    <el-input-number
                      :disabled="editFlag"
                      v-model="formInline.boxGrossWeight"
                      size="mini"
                      placeholder="请输入箱毛重"
                      :controls="false"
                      :min="0"
                    ></el-input-number>
                  </el-form-item>
                </div>
              </el-col> -->
            </el-row>
          </detail-wrapper>

          <detail-wrapper :options="{ title: '产品尺寸' }">
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="产品长(cm)" prop="skuLength">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.skuLength"
                      size="mini"
                      @change="validateNumber($event, 'skuLength')"
                      placeholder="请输入产品长"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="产品宽(cm)" prop="skuWidth">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.skuWidth"
                      size="mini"
                      @change="validateNumber($event, 'skuWidth')"
                      placeholder="请输入产品宽"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="产品高(cm)" prop="skuHeight">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.skuHeight"
                      size="mini"
                      @change="validateNumber($event, 'skuHeight')"
                      placeholder="请输入产品高"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </detail-wrapper>
          <detail-wrapper :options="{ title: '包装尺寸' }">
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="包装长(cm)" prop="packageLength">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.packageLength"
                      size="mini"
                      @change="validateNumber($event, 'packageLength', 'PACKAGE')"
                      placeholder="请输入包装长"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="包装宽(cm)" prop="packageWidth">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.packageWidth"
                      size="mini"
                      @change="validateNumber($event, 'packageWidth', 'PACKAGE')"
                      placeholder="请输入包装宽"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="包装高(cm)" prop="packageHeight">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.packageHeight"
                      size="mini"
                      @change="validateNumber($event, 'packageHeight', 'PACKAGE')"
                      placeholder="请输入包装高"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="包装体积(cm³)" prop="packageVolume" label-width="115px">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.packageVolume"
                      size="mini"
                      @change="validateNumber($event, 'packageVolume')"
                      placeholder="请输入包装体积"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </detail-wrapper>
          <detail-wrapper :options="{ title: '装箱信息' }" style="position: relative">
            <!-- <el-button type="primary" class="fillbtns" size="small" @click="toFill">按包装尺寸填充</el-button> -->
            <el-row>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="外箱长(cm)" prop="outerBoxLength">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.outerBoxLength"
                      size="mini"
                      @change="validateNumber($event, 'outerBoxLength', 'OUTERBOX')"
                      placeholder="请输入外箱长"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="外箱宽(cm)" prop="outerBoxWidth">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.outerBoxWidth"
                      size="mini"
                      @change="validateNumber($event, 'outerBoxWidth', 'OUTERBOX')"
                      placeholder="请输入外箱宽"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="外箱高(cm)" prop="outerBoxHeight">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.outerBoxHeight"
                      size="mini"
                      @change="validateNumber($event, 'outerBoxHeight', 'OUTERBOX')"
                      placeholder="请输入外箱高"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="外箱体积(cm³)" prop="outerBoxVolume" label-width="130px">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.outerBoxVolume"
                      size="mini"
                      @change="validateNumber($event, 'outerBoxVolume')"
                      placeholder="请输入外箱体积"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="外箱毛重(kg)" prop="boxGrossWeight" label-width="130px">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.boxGrossWeight"
                      size="mini"
                      @change="validateNumber($event, 'boxGrossWeight')"
                      placeholder="请输入外箱毛重"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="装箱数量" prop="boxs">
                    <el-input
                      :disabled="editFlag"
                      v-model="formInline.boxs"
                      size="mini"
                      @change="validateNumber($event, 'boxs')"
                      placeholder="请输入装箱数量"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </detail-wrapper>

          <!-- <detail-wrapper :options="{ title: '托盘信息' }">
            <el-row :gutter="24" v-for="(item, index) in formInline.palletInfoList" :key="item">
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="托盘规格" prop="palletSpec">
                    <el-input
                      :disabled="editFlag"
                      v-model="item.palletSpec"
                      size="mini"
                      placeholder="请输入托盘规格"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple product_size">
                  <el-form-item label="打托数" prop="palletNumber">
                    <el-input
                      :disabled="editFlag"
                      v-model="item.palletNumber"
                      size="mini"
                      placeholder="请输入打托数"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div style="line-height: 40px">
                  <i class="icon-shanchu y-icon-delect" @click="handleDelRow(index)"></i>
                  <i
                    class="icon-xinzeng y-icon-add"
                    v-show="index === formInline.palletInfoList.length - 1"
                    @click="handleAddRow"
                  ></i>
                </div>
              </el-col>
            </el-row>
          </detail-wrapper> -->

          <detail-wrapper :options="{ title: '*产品开发图片' }" v-if="false">
            <el-upload
              :disabled="editFlag"
              class="upload-demo"
              v-model="formInline.picAddr"
              ref="upload"
              action="string"
              accept="image/jpeg, image/png, image/jpg"
              list-type="picture-card"
              :before-upload="onBeforeUploadImage"
              :on-preview="handlePictureCardPreview"
              :http-request="UploadImage"
              :on-change="fileChange"
              :file-list="fileList"
              :on-remove="fileRemove"
              :multiple="true"
              :limit="20"
              :on-exceed="handleExceed"
            >
              <el-button :disabled="editFlag" size="mini" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件,且不超过5M,最大20张</div>
            </el-upload>
          </detail-wrapper>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form>
        <div style="overflow: hidden; padding: 20px">
          <div class="pull-right">
            <el-button :disabled="editFlag" size="mini" type="primary" @click="save('ruleForm', 0)">保存</el-button>
            <el-button size="mini" type="primary" @click="cancel">取消</el-button>
            <el-button
              :disabled="editFlag"
              size="mini"
              type="primary"
              v-if="permissions.sealSample_confrim"
              @click="save('ruleForm', 1)"
              >提交封样</el-button
            >
          </div>
        </div>
      </div>
    </basic-container>
  </div>
</template>
<style lang="scss">
@import "./index.scss";
</style>
<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  updateStatus,
  getPrdSkuImageUrl,
  upgradeSku
} from "@/api/product/prdsealsample"
import { getTokenUrl } from "@/util/auth"
import { removePrdSkuImage } from "@/api/product/prdskupic/prdskupic"
import { limitFilesMaxSize } from "@/util/tool"
import { mapGetters } from "vuex"
export default {
  data() {
    var validatePass = function (rules, value, callback) {
      if (!/^(([1-9]{1}[0-9]{0,5})|(0{1}))(\.\d{0,2})?$/.test(value)) {
        callback(new Error("请检查:数字是否过大,或最多2位小数"))
      } else if (value == 0) {
        callback(new Error("请检查:是否大于0"))
      } else {
        callback()
      }
    }
    var validatePass1 = function (rules, value, callback) {
      if (!/^(?!0+$)([1-9][0-9]{0,5})(\.\d{1,2})?$/.test(value)) {
        callback(new Error("请检查:是否为正整数"))
      } else {
        callback()
      }
    }
    var checkInteger = function (rules, value, callback) {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error("请检查:是否为正整数"))
      } else if (!/^.{0,6}$/.test(value)) {
        callback(new Error("请检查数字是否过大"))
      } else {
        callback()
      }
    }
    return {
      editFlag: false,
      // saveLoading: false,
      picIdList: [],
      formInline: {
        palletInfoList: [
          {
            palletSpec: "",
            palletNumber: ""
          }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      form: {},
      prdPics: [],
      formData: {},

      rules: {
        skuWeight: [
          { required: true, message: "请输入产品净重", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        skuGrossWeight: [
          { required: true, message: "请输入产品毛重", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        // boxGrossWeight: [
        //   { required: true, message: "请输入箱毛重", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        skuLength: [
          { required: true, message: "请输入产品长", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        skuWidth: [
          { required: true, message: "请输入产品宽", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        skuHeight: [
          { required: true, message: "请输入产品高", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        packageLength: [
          { required: true, message: "请输入包装长", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        packageWidth: [
          { required: true, message: "请输入包装宽", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        packageHeight: [
          { required: true, message: "请输入包装高", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        packageVolume: [{ required: true, message: "请输入包装体积", trigger: "blur" }],
        // outerBoxLength: [
        //   { required: true, message: "请输入外箱长", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        // outerBoxWidth: [
        //   { required: true, message: "请输入外箱宽", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        // outerBoxHeight: [
        //   { required: true, message: "请输入外箱高", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        // outerBoxVolume: [{ required: true, message: "请输入外箱体积", trigger: "blur" }],
        // outerBoxWeight: [
        //   { required: true, message: "请输入外箱重量", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ],
        // boxs: [
        //   { required: true, message: "请输入装箱数量", trigger: "blur" },
        //   // { type: "integer", message: "请输入正整数" },
        //   { validator: checkInteger, trigger: "blur" }
        // ],
        purchasePrice: [
          { required: true, message: "请输入FOB采购价格(USD)", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
        // palletNumber: [
        //   { required: true, message: "请输入打托数", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" },
        //   { validator: validatePass1, trigger: "blur" }
        // ],
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    //保存数据的KEY值，必须是路由的全路径，这个是约定，和关闭tag清空本地数据KEY一致
    key() {
      return this.$route.fullPath
    },
    sealSampleId() {
      if (!this.$route.query.sealSampleId) {
        return ""
      } else {
        return this.$route.query.sealSampleId
      }
    },
    skuId() {
      return this.$route.query.skuId
    },
    edit() {
      return this.$route.query.edit
    }
  },
  /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
  //页面离开之前进行数据缓存到本地
  beforeRouteUpdate(to, from, next) {
    this.saveData();
    next();
  },
  //页面离开之前进行数据缓存到本地
  beforeRouteLeave(to, from, next) {
    this.saveData();
    next();
  },
  watch: {
    //观察路由参数是否变化，用于多开时
    key() {
      this.loadData();
    }
  },*/
  created() {
    //首次创建加载数据
    this.loadData()
    // this.editFlag=eval(this.$route.query.disabled);
    this.editFlag = JSON.parse(this.$route.query.disabled)
    /*以上两种方式都可以转换*/

    // alert(this.$route.query.disabled)
    // alert(this.editFlag)
  },
  methods: {
    // calcVolume (key) {
    //   console.log(1191919)
    //   if (!this.formInline[key]) {
    //     return;
    //   }

    // },
    toFill() {
      this.formInline.outerBoxLength = this.formInline.packageLength
      this.formInline.outerBoxWidth = this.formInline.packageWidth
      this.formInline.outerBoxHeight = this.formInline.packageHeight
      this.formInline.outerBoxVolume = this.formInline.packageVolume
    },
    validateNumber(val, key, keycol) {
      if (!val) return
      this.formInline[key] = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (this.formInline[key] == 0) {
        this.formInline[key] = ""
      }

      if (!keycol) return
      const keyObj = {
        OUTERBOX: {
          title: ["outerBoxLength", "outerBoxWidth", "outerBoxHeight"],
          value: "outerBoxVolume"
        },
        PACKAGE: {
          title: ["packageLength", "packageWidth", "packageHeight"],
          value: "packageVolume"
        }
      }
      const maxCount = keyObj[keycol].title.reduce((prev, crv) => {
        const countArr = String(this.formInline[crv]).split(".")
        return countArr.length === 2 ? prev + countArr[1].length : prev + 0
      }, 0)
      let volumeCount = 1
      keyObj[keycol].title.forEach((item) => {
        volumeCount *= Number(String(this.formInline[item]).replace(".", ""))
      })
      volumeCount = volumeCount / Math.pow(10, maxCount)
      volumeCount = isNaN(volumeCount) || volumeCount == 0 ? "" : volumeCount
      this.$set(this.formInline, keyObj[keycol].value, volumeCount)
    },
    loadData() {
      //加载数据，如果本地没有，则取服务器上的数据
      if (!this.loadDataLocal()) {
        this.loadDataRemote()
      }
    },
    loadDataLocal() {
      var retFlag = false
      /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
      var localDataStr = sessionStorage.getItem(this.key);
      if (localDataStr) {
        console.log("load localData");
        retFlag = true;
        var savedat=JSON.parse(localDataStr);
        //this.formInline = JSON.parse(localDataStr);
        this.fileList=savedat.fileList;
        this.formInline=savedat.formInline;

      }*/
      return retFlag
    },
    //从远程服务器上加载数据
    loadDataRemote() {
      console.log("load loadDataRemote")
      getObj(this.sealSampleId, this.skuId).then((response) => {
        var returnData = response.data.data
        if (!returnData) {
          this.formInline.skuId = this.$route.query.skuId
        } else {
          this.formInline = returnData
          if (!this.formInline.palletInfoList || this.formInline.palletInfoList.length == 0) {
            this.formInline.palletInfoList = [
              {
                palletSpec: "",
                palletNumber: ""
              }
            ]
          }
          returnData.prdSkuPicList.forEach((pic) => {
            const file = {}
            file.url = getTokenUrl(pic.picAddr)
            file.picId = pic.picId
            this.fileList.push(file)
          })
        }
      })
    },
    /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
    saveData() {
      
      var savdat={'formInline':this.formInline,'fileList':this.fileList};
      
      sessionStorage.setItem(this.key, JSON.stringify(savdat));
    },*/
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制只能上传 20 个图片`)
    },
    /**
     * 图片上传所需要的方法
     */
    onBeforeUploadImage(file) {
      if (file.name.indexOf(",") != -1 || file.name.indexOf("[") != -1 || file.name.indexOf("]") != -1) {
        this.$message.error("文件名包含敏感字符,请修改后重新上传")
        return false
      }
      if (file.name.length > 40) {
        this.$message.error("文件名长度超出40个字符，请重新命名后上传")
        return false
      }
      // const isIMAGE = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isIMAGE) {
      //   this.$message.error("上传文件只能是图片格式!");
      //   return;
      // }
      if (!(file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png")) {
        this.$message.warning("上传文件只能是图片格式!")
        return false
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!")
        return false
      }
      //return isIMAGE && isLt1M;
    },
    UploadImage(param) {},
    fileChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error("当前文件已经存在!")
        fileList.pop()
      }
      this.fileList = fileList
    },
    fileRemove(file, fileList) {
      this.fileList = fileList
      var picId = null
      if (file.picId) {
        picId = file.picId
      } else {
        picId = file.raw.picId
      }
      if (picId) {
        this.picIdList.push(picId)
        // removePrdSkuImage(picId).then(data => {
        //   this.$message({
        //     showClose: true,
        //     message: "删除成功",
        //     type: "success"
        //   });
        // });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    cancel() {
      if (this.$parent.$refs.tagNavigate) {
        this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, false)
      }
    },
    save(formName, dataStatus) {
      // this.saveLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData = new FormData()

          let palletInfoList = []
          console.log("1111", this.formInline.palletInfoList)
          for (let item of this.formInline.palletInfoList) {
            if (item.palletSpec && item.palletNumber) {
              palletInfoList.push(item)
            }
          }
          console.log("palletInfoList", palletInfoList)
          this.formInline.palletInfoList = palletInfoList.length > 0 ? palletInfoList : undefined

          this.formInline.dataStatus = dataStatus
          this.formData.append("row", JSON.stringify(this.formInline))
          this.formData.append("delPicIdList", this.picIdList)
          const picId = []
          let limitFlag = limitFilesMaxSize(this.fileList)
          if (!limitFlag) {
            this.$message.error("上传图片总大小不得超过20M!!")
            // this.saveLoading = false;
            return
          }
          this.fileList.forEach((file) => {
            if (file.picId) {
              picId.push(file.picId)
            } else {
              this.formData.append("file", file.raw, file.raw.name) //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            }
          })

          this.formData.append("picId", picId.join(","))
          addObj(this.formData).then((response) => {
            if (response.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000
              })
              if (dataStatus == 1) {
                if (this.$parent.$refs.tagNavigate) {
                  this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
                }
              } else {
                this.fileList.forEach((file) => {
                  if (file.picId) {
                    picId.push(file.picId)
                  } else {
                    response.data.data.forEach((item) => {
                      if (item.picName == file.name) {
                        file.picId = item.picId
                      }
                    })
                  }
                })
                if (this.$parent.$refs.tagNavigate) {
                  this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
                }
                // this.cancel()
              }
              /*先注释掉，采用全局无条件按路由缓存，不做单独的缓存
              //移除缓存数据
              sessionStorage.removeItem(this.key);
              */
              //window.location.href=window.location.
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("操作失败")
              return
            }
          })
          // .finally(() => {
          //   this.saveLoading = false;
          // });
        } else {
          // this.saveLoading = false;
          return false
        }
      })
    }
    // handleDelRow(index) {
    //   if (this.formInline.palletInfoList.length === 1) {
    //     this.$message.warning("最少选择一条")
    //     return
    //   }
    //   this.formInline.palletInfoList.splice(index, 1)
    // },
    // handleAddRow() {
    //   this.formInline.palletInfoList.push({
    //     palletSpec: "",
    //     palletNumber: ""
    //   })
    // }
  }
}
</script>

<style lang="scss">
.product_size .el-input-number--mini {
  width: 100%;
}
#sealSampleTable {
  .fillbtns {
    position: absolute;
    top: 11px;
    left: 90px;
    padding: 5px 16px;
    margin-left: 20px;
  }
}
</style>
