<template>
  <div class="notice-page">
    <el-tabs v-model="announcementType" @tab-click="handleClickTab" class="ml-15 mr-10">
      <el-tab-pane v-for="item in noticeTypeList" :key="item.name" :label="item.label" :name="item.value">
      </el-tab-pane>
    </el-tabs>

    <div class="notice-main">
      <div class="notice-list" @scroll="handleScroll">
        <div
          v-for="item in noticeList"
          :key="item.id"
          class="notice-item"
          :class="{ unread: item.readStatus === 'UNREAD', active: item.id === activeNoticeId }"
          @click="handelNoticeItem(item)"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start">
            <span class="title">{{ item.title }}</span>
            <div style="font-size: 12px" :style="{ color: noticeTypeColor[item.type] }">
              {{ noticeTypeList.find((c) => c.value === item.type)?.label }}
            </div>
          </div>
          <span style="font-size: 12px">{{ item.publishTime }}</span>
        </div>
        <div v-if="!hasMore" style="font-size: 12px; color: #909399; text-align: center; margin: 10px 0">
          ~没有更多数据了~
        </div>
      </div>
      <div class="notice-content">
        <template v-if="noticeDetail?.id">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
              margin-bottom: 20px;
            "
          >
            <h1 class="mb-5">{{ noticeDetail.title }}</h1>
            <div>发布时间：{{ noticeDetail.publishTime }}</div>
          </div>
          <div v-html="noticeDetail.content"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  getPublishAnnouncementListPageApi,
  getAnnouncementDetailApi,
  getAnnouncementReadApi
} from "@/api/baseSetup/noticeCenter"
import { getDictByType } from "@/util/auth"

export default {
  name: "noticeList",
  components: {},
  data() {
    return {
      noticeTypeList: [],
      announcementType: "",
      noticeList: [],
      noticeTypeColor: {
        EMERGENCY_NOTICE: "#F56C6C",
        VERSION_UPDATE: "#67C23A",
        OTHER_ANNOUNCEMENT: "#303133"
      },
      noticeDetail: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pages: 0 // 总页数
      },
      hasMore: true,
      activeNoticeId: null
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {
    this.init()
    this.getList()
  },
  activated() {
    this.getList()
  },
  beforeDestroy() {},

  methods: {
    async init() {
      this.noticeTypeList = await getDictByType("announcement_type")
      this.noticeTypeList.unshift({ label: "全部公告", value: "", name: "ALL" })
    },
    async getList() {
      const params = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        announcementType: this.announcementType !== "0" ? this.announcementType : undefined
      }

      const { data } = await getPublishAnnouncementListPageApi(params)

      const { pages, records, total } = data.data
      this.page.pages = pages
      // 当前页数小于等于总页数，并且总条数大于当前列表的长度
      if (this.page.currentPage <= this.page.pages && total > this.noticeList.length) {
        this.noticeList = this.noticeList.concat(records)
        this.hasMore = true
      } else {
        this.hasMore = false
      }

      if (!this.activeNoticeId) {
        this.resetSelectNotice()
      }
    },

    // 重置选择的公告
    async resetSelectNotice() {
      this.activeNoticeId = this.noticeList[0]?.id
      await this.getDetail(this.activeNoticeId)
      await this.getReadNotice(this.noticeList[0])
    },

    async getDetail(id) {
      if (!id) {
        this.noticeDetail = {}
        return
      }
      const { data } = await getAnnouncementDetailApi({ id })
      this.noticeDetail = data.data
    },

    handelNoticeItem(item) {
      this.getDetail(item.id)
      this.activeNoticeId = item.id
      this.getReadNotice(item)
    },

    // 更新公告状态
    async getReadNotice(item) {
      const { data } = await getAnnouncementReadApi({ id: item.id })
      if (data.code === 0) {
        item.readStatus = data.data
      }
    },

    // 切换tab
    async handleClickTab(tab) {
      this.page.currentPage = 1
      this.noticeList = []
      await this.getList()
      this.resetSelectNotice()
    },
    handleScroll(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target

      if (scrollTop + clientHeight >= scrollHeight && this.hasMore) {
        console.log("触底了")
        // 触底 加载下一页
        this.page.currentPage++
        this.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-page {
  background-color: #fff;
  margin: 0 0 0 10px;
  padding: 8px 10px;
  border-radius: 6px;
  .notice-main {
    display: flex;
    .notice-list {
      width: 300px;
      border-right: 1px solid #aaa;
      overflow-y: scroll;
      height: calc(100vh - 195px);
    }
    .notice-item {
      margin-top: 10px;
      position: relative;
      padding: 10px 8px 10px 10px;
      border-radius: 6px;
      &:hover {
        cursor: pointer;
        font-weight: bold;
      }
      &:after {
      }
    }
    .unread {
      &:before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #f56c6c;
        border-radius: 50%;
        margin-right: 5px;
        position: absolute;
        top: 11px;
        left: 4px;
      }
    }
    .active {
      &:after {
        content: "";
        display: inline-block;
        width: 2px;
        background-color: var(--primary-color);
        height: 50px;
        position: absolute;
        top: 12px;
        right: 0px;
      }
    }
    .title {
      width: 190px;
      margin: 0px 5px 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .notice-content {
      flex: 1;
      padding: 10px 20px;
      height: calc(100vh - 208px);
      overflow-y: auto;
    }
  }
}

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
