<template>
  <el-dialog
    :title="detailList[currentIndex]?.typeName"
    :visible.sync="showDialog"
    width="80%"
    style="height: 90%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="notice-dialog noWatch"
    top="5vh"
  >
    <div v-if="detailList.length" style="height: 550px; overflow: auto">
      <div
        style="display: flex; justify-content: center; flex-direction: column; align-items: center; margin-bottom: 20px"
      >
        <h1 class="mb-5">{{ detailList[currentIndex]?.title }}</h1>
        <div>发布时间：{{ detailList[currentIndex]?.publishTime }}</div>
      </div>
      <div v-html="detailList[currentIndex]?.content"></div>
    </div>
    <span slot="footer">
      <el-button v-if="currentIndex === detailList.length - 1" size="small" @click="handleCheckALL">查看更多</el-button>
      <el-button v-if="currentIndex > 0" size="small" @click="handlePrev">上一条</el-button>
      <el-button size="small" type="primary" @click="handleNext">
        {{ currentIndex === detailList.length - 1 ? "知道了" : `下一条${currentIndex + 1}/${detailList.length}` }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAnnouncementAlertListApi, getAnnouncementReadApi } from "@/api/baseSetup/noticeCenter"

export default {
  name: "noticeDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      title: "版本更新",
      detailList: [],
      currentIndex: 0
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog() {
      this.currentIndex = 0
      this.showDialog = true
      this.getUnreadAnnouncement()
    },
    // 获取前三条未读公告
    async getUnreadAnnouncement() {
      const { data } = await getAnnouncementAlertListApi()
      if (data.code === 0) {
        if (data.data.length > 0) {
          this.detailList = data.data
        }
      }
    },
    handlePrev() {
      if (this.currentIndex === 0) return
      this.currentIndex--
    },
    async handleNext() {
      await this.getReadNotice()
      if (this.currentIndex === this.detailList.length - 1) {
        this.showDialog = false
      } else {
        this.currentIndex++
      }
    },

    // 更新公告状态
    async getReadNotice() {
      const { data } = await getAnnouncementReadApi({ id: this.detailList[this.currentIndex].id })
      if (data.code === 0) {
      }
    },

    async handleCheckALL() {
      await this.getReadNotice()
      this.$router.push({
        path: "/noticeCenter/notice/list"
      })
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  opacity: 1 !important;
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background-color: transparent !important;
}
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: rgba(188, 191, 193, 0.4);
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(188, 191, 193, 0.75);
}
::v-deep .el-card__body {
  padding: 20px 5px;
}
</style>
