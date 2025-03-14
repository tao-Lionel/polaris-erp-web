<template>
  <!-- 上传面单 -->
  <el-dialog
    title="上传面单"
    :visible.sync="showDialog"
    width="35%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="uploadForm" ref="uploadForm">
      <el-form-item
        prop="trackingNo"
        label="跟踪号"
        :rules="{ required: true, message: '跟踪号不能为空', trigger: 'blur' }"
      >
        <el-input size="small" v-model="uploadForm.trackingNo"></el-input>
      </el-form-item>
      <el-form-item
        label="上传面单"
        prop="faceSheet"
        :rules="{ required: true, message: '必须上传面单', trigger: 'blur' }"
      >
        <el-upload
          class="upload-inq inline-class"
          style="margin-bottom: 5px"
          ref="upload"
          accept=".pdf,.png"
          :file-list="fileList"
          action="String"
          :auto-upload="false"
          :on-change="signFileChange"
          :on-remove="handleRemove"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持以下格式：pdf、png，支持上传多个附件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" @click="uploadComfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadImgAndPdf, uploadStatement } from "@/api/order/invoiceManage"

export default {
  name: "uploadDeliveryNoteDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      uploadForm: {},
      fileList: [],
      uploadIds: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(row) {
      this.showDialog = true
      this.fileList = []
      this.uploadForm = {
        id: row.id,
        faceSheet: "",
        trackingNo: row.trackingNo
      }
    },
    signFileChange(file, fileList) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("不允许上传大于5M文件")
        return
      }
      const fileType = ["application/pdf", "image/png"]
      const status = fileType.some((item) => item === file.raw.type)
      if (!status) {
        this.$message.warning("请选择png或者PDF文件")
        return
      }

      let formdata = new FormData()
      formdata.append("applicationName", "")
      formdata.append("file", file.raw)
      uploadImgAndPdf(formdata).then((res) => {
        if (res.data.code == 0) {
          this.$message.success("上传成功")
          this.uploadIds.push(res.data.data.id)
          this.fileList = fileList
          this.uploadForm.faceSheet = res.data.data.id + ""
        } else if (res.data.code == 1) {
          this.$message.error(res.data.msg)
        }
      })
    },
    //保存面单
    uploadComfirm() {
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          uploadStatement(this.uploadForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("操作成功")
              this.showDialog = false
              this.$emit("updateList")
            } else {
              this.$message.error(res.data.msg)
              this.showDialog = false
              this.$emit("updateList")
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
