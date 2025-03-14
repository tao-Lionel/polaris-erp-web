<template>
  <div>
    <basic-container>
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" size="small" placeholder="请输入标题" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" clearable filterable size="small">
            <el-option
              v-for="item in noticeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详情" prop="content">
          <x-editor
            v-model="form.content"
            width="80%"
            height="580px"
            :uploadFileApi="uploadAnnouncementFileAPi"
            :cursorReset="cursorReset"
            previewUrl="api/baseSetup/announcement/download?fileUrl="
          ></x-editor>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-button type="primary" size="small" @click="submitForm">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  saveOrUpdateAnnouncementApi,
  getAnnouncementDetailApi,
  uploadAnnouncementFileAPi
} from "@/api/baseSetup/noticeCenter"
import { getDictByType } from "@/util/auth"

export default {
  name: "publishNoticeAdd",
  components: {},
  data() {
    return {
      form: {
        title: "",
        type: "",
        content: ""
      },
      noticeTypeOptions: [],
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择公告类型", trigger: "change" }],
        content: [{ required: true, message: "请输入公告详情", trigger: "blur" }]
      },
      id: this.$route.query.id ? Number(this.$route.query.id) : null,
      uploadAnnouncementFileAPi: uploadAnnouncementFileAPi,
      cursorReset: false
    }
  },
  created() {},
  mounted: async function () {
    this.noticeTypeOptions = await getDictByType("announcement_type")
    if (this.id) {
      this.getDetail()
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  activated() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const { data } = await getAnnouncementDetailApi({ id: this.id })
      if (data.code === 0) {
        this.cursorReset = true
        this.form = data.data
      }
    },
    submitForm() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.id) {
            this.form.id = this.id
          }
          const { data } = await saveOrUpdateAnnouncementApi(this.form)
          if (data.code === 0) {
            this.$message.success("保存成功")
            this.cancel()
          }
        }
      })
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.$router.$avueRouter.closeTag()
      this.$router.push({
        path: "/noticeCenter/publishNotice/list",
        query: null
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
