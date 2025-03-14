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
  -->

<template>
  <div class="execution" id="prdskupic">
    <basic-container>
      <ul class="prdskupic-ul">
        <li>
          <p class="sku-code">SKU</p>
          <el-input
            @keyup.enter.native="searchLoading"
            v-model="skuCode"
            size="small"
            placeholder="请输入SKU搜索"
          ></el-input>
        </li>
        <!-- <li>
          <p class="sku-code">　　SKU名称</p>
          <el-input
            @keyup.enter.native="searchLoading"
            v-model="skuName"
            size="small"
            placeholder="请输入SKU名称搜索"
          ></el-input>
        </li> -->
        <li class="pull-right">
          <el-button
            v-if="permissions.product_prdskupic_search"
            size="small"
            icon="el-icon-delete"
            plain
            @click="searchReset()"
            >清空</el-button
          >
          <el-button
            v-if="permissions.product_prdskupic_search"
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="searchLoading()"
            >搜索</el-button
          >
        </li>
      </ul>
      <el-row>
        <el-col :span="24" class="border-col">
          <!-- <el-upload
              class="upload-demo"
              v-model="form.picAddr"
              ref="upload"
              :action="urlIMage"
              accept="image/jpeg,image/png,image/jpg"
              list-type="picture-card"
              :before-upload="onBeforeUploadImage"
              :http-request="UploadImage"
              :on-change="fileChange"
              :file-list="fileList"
              :on-preview="teston"
              :on-remove="fileRemove"
              :multiple="true"
            > 
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
          </el-upload> urlIMage-->
          <el-upload
            class="upload-demo dialog-img"
            v-model="form.picAddr"
            multiple
            ref="upload"
            action="String"
            accept="image/jpeg, image/png, image/jpg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :before-upload="onBeforeUploadImage"
            :http-request="UploadImage"
            :on-change="fileChange"
            :file-list="fileList"
            :on-remove="fileRemove"
            :before-remove="removeBefore"
            :limit="20"
            :on-exceed="handleExceed"
            :disabled="!permissions.product_prdskupic_addordel || addFlag"
          >
            <i class="el-icon-plus i-center"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" title="图片">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { uploadSkuImage, getPrdSkuImageUrl, removePrdSkuImage } from "@/api/product/prdskupic/prdskupic"
import { getSkuStatus } from "@/api/product/prdsku"
import { getTokenUrl } from "@/util/auth"
import { mapGetters } from "vuex"
import { preventShake } from "@/util/tool"
export default {
  name: "prdsku",
  data() {
    return {
      fileList: [],
      form: {},
      prdPics: [],
      skuCode: null,
      skuName: null,
      formData: {},
      skuId: null,
      addFlag: true,
      dialogImageUrl: "",
      dialogVisible: false
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    searchReset() {
      this.skuCode = null
      this.skuName = null
      this.fileList = []
    },
    searchLoading() {
      this.fileList = []
      // console.info("搜素图片地址");
      var param = {}
      if (!this.skuCode || this.skuCode == "") {
        if (!this.skuName || this.skuName == "") {
          this.$message.error("请输入SKU之后再进行搜索!")
          return
        }
      }
      param.skuCode = this.skuCode
      param.skuName = this.skuName
      getSkuStatus(param).then((res) => {
        if (!res.data.data.id) {
          this.$message.error("SKU不存在或无权限查看!")
          return
        }
        if (res.data.data.createStatus == 4 && res.data.data.sealStatus == 6) {
          this.skuId = res.data.data.id
          let _this = this
          preventShake.preventShake((bool) => {
            if (bool) {
              _this.getImageUrl(param)
            }
          })
        } else {
          this.$message.error("请确认SKU是否封样完成!")
        }
      })
    },
    UploadImage(param) {
      this.formData = new FormData()
      this.formData.append("file", param.file, param.file.name)
      this.formData.append("sku_id", this.skuId)
      this.formData.append("type", 2)
      uploadSkuImage(this.formData).then((data) => {
        console.log(data.data.data)
        const uTmp = getTokenUrl(data.data.data[0].picAddr)
        param.file.url = uTmp
        param.file.picId = data.data.data[0].picId
        // this.$message({
        //     showClose: true,
        //     message: '添加成功',
        //     type: 'success'
        // });
        this.$notify({
          title: "成功",
          message: param.file.name + "添加成功",
          type: "success"
        })
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 图片上传所需要的方法
     */
    onBeforeUploadImage(file) {
      let isSkuID = this.skuId != null && this.skuId != ""
      let is20COUNT = this.fileList.length <= 20
      let isIMAGE = file.type === "image/jpeg" || "image/jpg" || "image/png"
      let isLt1M = file.size / 1024 / 1024 < 5
      if (!isSkuID) {
        this.$message.error("请先搜索指定SKU!")
      }
      if (!is20COUNT) {
        this.$message.error("列表图片不得超过20个!")
      }
      if (!isIMAGE) {
        // this.$message.error(file.name+'上传文件不是是图片格式!')
        this.$notify.error({
          title: "错误",
          message: file.name + "上传文件不是是图片格式!"
        })
      }
      // console.log(isLt1M)
      if (!isLt1M) {
        this.$notify.error({
          title: "错误",
          message: file.name + "上传文件超过 5MB!"
        })
        //this.$message.error(file.name+'上传文件超过 5MB!')
      }
      if (file.name.length > 44) {
        this.$notify.error({
          title: "错误",
          message: file.name + "图片名称长度超过40!"
        })
        //this.$message.error(file.name+"图片名称长度超过40!");
        return false
      }
      //     let isEXIST = true;
      //     let existFile = this.fileList.slice(0, this.fileList.length - 1).find(f => f.name === file.name)
      // 　　if (existFile) {
      // 　　　　this.$message.error('当前文件已经存在!');
      // 　　　　this.fileList.pop()
      //         isEXIST=false;
      // 　　}&& isEXIST
      return isSkuID && is20COUNT && isIMAGE && isLt1M
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    removeBefore(file, fileList) {},
    fileRemove(file, fileList) {
      // this.fileList =fileList;
      // //移除图片
      // this.fileList.push(file)
      var picId = null
      if (file.picId) {
        picId = file.picId
      } else {
        picId = file.raw.picId
      }
      if (picId) {
        removePrdSkuImage(picId).then((data) => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
        })
      }
    },
    getImageUrl(param) {
      getPrdSkuImageUrl(param).then((response) => {
        this.$message({
          showClose: true,
          message: "查询成功",
          type: "success"
        })
        this.addFlag = false
        var records = response.data.data.records
        if (records.length > 0) {
          //var imageList=[];
          this.prdPics = records[0].prdSkuPics
          this.prdPics.forEach((pic) => {
            const uTmp = getTokenUrl(pic.picAddr)
            const file = {}
            file.url = uTmp
            file.picId = pic.picId
            //imageList.push(file);
            //this.fileList=imageList
            this.fileList.push(file)
          })
        } //else{
        //   this.addFlag=true
        //   this.$message.error('请确认该是SKU是否已封样完成!!')
        // }
      })
    },
    beforeOpen() {
      this.fileList = []
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
