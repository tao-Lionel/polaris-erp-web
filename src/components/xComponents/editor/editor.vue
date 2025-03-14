<template>
  <div class="editor-new">
    <myEditor id="tinymce" v-model="content" :init="config" v-if="show"></myEditor>

    <el-dialog title="提示" :visible.sync="showUploadMaterial" width="30%" :before-close="handleClose">
      <el-upload
        action=""
        accept="image/*"
        :before-upload="onBeforeUpload"
        :http-request="onHttpRequest"
        :on-success="uploadUrlFn"
        :multiple="true"
        :show-file-list="false"
        :limit="20"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUploadMaterial = false">取 消</el-button>
        <el-button type="primary" @click="showUploadMaterial = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tinymce from "tinymce"
import MyEditor from "@tinymce/tinymce-vue"
import "tinymce/themes/silver/theme"
import "tinymce/plugins/paste"
import "tinymce/plugins/imagetools"
import "tinymce/plugins/image"
import { getTokenUrl } from "@/util/auth"
// import { uploadFileApi } from "@/api/common"

const TOOL = {
  default: [
    "undo redo removeformat pastetext | fontselect fontsizeselect | formatselect | bold italic underline strikethrough | forecolor backcolor",
    "alignleft aligncenter alignright alignjustify | outdent indent bullist numlist | image media link table | letterspacing lineheight code fullscreen preview paste "
  ],
  simple: "fontsizeselect | formatselect | bold italic | forecolor backcolor | align | image link"
}

export default {
  name: "XEditor",
  components: { MyEditor },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    // 初始值
    value: {
      type: String,
      default: ""
    },
    // 设置只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 默认宽度
    width: {
      type: String,
      default: "100%"
    },
    // 默认高度
    height: {
      type: String,
      default: "600px"
    },
    // 工具默认
    tool: {
      type: String,
      default: "default"
    },
    // 显示自定义上传图片的组件
    showMyUpload: { type: Boolean, default: false },
    // 上传图片的方法
    uploadFileApi: {
      type: Function,
      required: true
    },
    // 解决光标位置不对问题
    cursorReset: { type: Boolean, default: false },
    // 预览图片的地址
    previewUrl: { type: String, required: true }
  },
  data() {
    return {
      cursorFlag: true,
      photoList: "",
      showUploadMaterial: false,
      editorSetUp: null,
      show: true,
      editor: null,
      content: "",
      id: "",
      flag: true,
      // tool: 'default',
      config: {
        deprecation_warnings: false, // 关闭警告通知
        selector: "",
        language: "zh_CN",
        convert_urls: false,
        menubar: false,
        branding: false,
        readonly: this.readonly,
        paste_data_images: true,
        // , "paste wordcount code fullscreen preview letterspacing"
        plugins: ["lists advlist image imagetools link media table fullscreen powerpaste"],
        font_formats:
          "Arial=arial,helvetica,sans-serif;Times New Roman=times new roman,times;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif",
        fontsize_formats: "10px 12px 14px 16px 18px 20px 24px 28px 36px 48px",
        toolbar: [],
        width: this.width,
        height: this.height,
        init_instance_callback: (result) => {
          // focus blur
          result.on("input undo redo execCommand Change SetContent KeyUp", () => {
            // console.log(`init_instance_callback====`, result.getContent());
            this.flag = false
            // 把数据去掉 class  避免被项目的样式影响
            const cont = result.getContent().replace(/\s+class=(["']{1})((?!\1).)+\1/g, "")
            this.$emit("input", cont)
          })
        },
        images_upload_handler: async (blobInfo, success, failure, progress) => {
          const file = blobInfo.blob()
          const res = await this.uploadFile({ file })
          if (res.status === 1) {
            success(res.data?.filePath)
            setTimeout(() => {
              this.$emit("input", tinymce.activeEditor.getContent())
            }, 200)
          }
        },
        setup: (editor) => {
          const _this = this
          _this.editorSetUp = editor
          // 定义一个名为 uploadImage 的toolbar
          editor.ui.registry.addButton("uploadImage", {
            text: '<button class="upload-btn">上传图片</button>',
            tooltip: "上传图片",
            enabled: true,
            onAction: () => {
              _this.showUploadMaterial = true
              // this.onHttpRequest()
            }
          })
          editor.on("input", function (e) {
            _this.cursorFlag = false
          })
        }
      }
    }
  },
  deactivated() {
    this.show = false
  },
  activated() {
    this.show = true
  },
  computed: {},
  methods: {
    async uploadFile({ file }) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("applicationName", "")
      const res = await this.uploadFileApi(formData)
      const { data } = res
      if (data.code === 0) {
        const { fileUrl, fileName, id } = data.data
        const response = {
          status: 1,
          data: { filePath: `${this.previewUrl}${fileUrl}`, fileName }
        }
        return response
      }
      throw new Error()
    },
    onChange(e) {
      this.$emit("input", this.content)
    },
    async onHttpRequest(param) {
      const formData = new FormData()
      formData.append("file", param.file, param.file.name)
      formData.append("applicationName", "")
    },
    uploadUrlFn(photoList) {
      const cnt = photoList.map((i) => `<img style='max-width:100%' src='${i}'></img>`).join("")
      this.editorSetUp.execCommand("mceInsertContent", false, cnt)
      setTimeout(() => {
        this.photoList = []
      }, 1000)
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (this.content === "" && this.cursorFlag) {
          this.content = newValue
        }
        // 判断输入是空串就赋值为null, 解决空串光标位置不正确的问题
        // if (newValue == "") this.content = ""
        // 重置光标
        if (!this.cursorReset && !this.content) {
          this.$nextTick(() => {
            tinymce.activeEditor?.selection?.select(tinymce.activeEditor.getBody(), true)
            tinymce.activeEditor?.selection?.collapse(false)
          })
        }

        this.flag = true
      },
      immediate: true
    }
  },
  created() {
    const list = [...TOOL.default]
    // 需要展示 则拼上去组件名
    this.showMyUpload && (list[list.length - 1] += " | uploadImage")
    this.config.toolbar = list
  },
  mounted() {
    this.editor = tinymce.init(this.config)
  }
}
</script>
<style lang="scss" scoped>
$theme: #f0780e;
.editor-new {
  ::v-deep .upload-btn {
    color: #fff;
    border-radius: 4px;
    background-color: $theme;
    border-color: $theme;
    line-height: 28px;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    height: 28px;
    padding: 0 15px;
    font-size: 14px;
  }
}
</style>
