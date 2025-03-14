v2
<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button v-if="permissions.notice_add" type="primary" @click="handleAdd" size="small"> 新 增 </el-button>
          <!-- <el-button type="primary" @click="handlePublish" size="small"> 发 布 </el-button>
          <el-button type="primary" @click="handleUnpublish" size="small"> 撤销发布 </el-button> -->
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="announcementType">
              <el-select v-model="searchForm.announcementType" placeholder="公告类型" filterable size="small">
                <el-option
                  v-for="item in noticeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="publishStatus">
              <el-select v-model="searchForm.publishStatus" placeholder="公告状态" filterable size="small">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- 公告类型 -->
        <template slot="typeName" slot-scope="{ row }">
          <div>{{ row.typeName }}</div>
        </template>
        <template slot="publishStatusName" slot-scope="{ row }">
          <div :style="{ color: publishStatusColor[row.publishStatus] }">{{ row.publishStatusName }}</div>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="{ row }">
          <a
            v-if="row.publishStatus === 'UNPUBLISHED' && permissions.notice_edit"
            class="mr-10"
            @click="handleEdit(row)"
          >
            编辑
          </a>
          <a
            v-if="row.publishStatus === 'UNPUBLISHED' && permissions.notice_publish"
            class="mr-10"
            @click="handlePublish(row)"
          >
            发布
          </a>
          <a v-else-if="permissions.notice_unpublish" @click="handleUnpublish(row)">撤销发布</a>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getDictByType } from "@/util/auth"
import { tableOption } from "./list"
import {
  getAnnouncementListPageApi,
  publishAnnouncementApi,
  unPublishAnnouncementApi
} from "@/api/baseSetup/noticeCenter"

export default {
  name: "publishNoticeList",
  components: {},
  data() {
    return {
      //搜索条件
      searchForm: {
        announcementType: undefined,
        publishStatus: undefined
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption,
      tableData: [],
      selectList: [],
      noticeTypeOptions: [],
      statusOptions: [],
      publishStatusColor: {
        UNPUBLISHED: "#67C23A",
        PUBLISHED: "#F56C6C"
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.init()
  },
  mounted: function () {
    this.getList()
  },
  activated() {
    this.getList()
  },

  methods: {
    async init() {
      this.noticeTypeOptions = await getDictByType("announcement_type")
      this.statusOptions = await getDictByType("publish_status")
    },

    //加载列表数据
    async getList() {
      const params = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }

      const { data } = await getAnnouncementListPageApi(params)

      this.tableData = data.data.records
      this.page.total = data.data.total
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      this.$refs.searchFormRef.resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/noticeCenter/publishNotice/add"
      })
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/noticeCenter/publishNotice/edit",
        query: { id: row.id }
      })
    },
    // 发布
    async handlePublish(row) {
      // if (this.selectList.length !== 1) {
      //   this.$message.warning(`请勾选一条数据`)
      //   return
      // }
      let id = row.id

      const { data } = await publishAnnouncementApi({ id })
      if (data.code === 0) {
        this.$message.success(`发布成功`)
        this.getList()
      }
    },
    // 撤销发布
    async handleUnpublish(row) {
      // if (this.selectList.length !== 1) {
      //   this.$message.warning(`请勾选一条数据`)
      //   return
      // }
      let id = row.id

      const { data } = await unPublishAnnouncementApi({ id })
      if (data.code === 0) {
        this.$message.success(`撤销发布成功`)
        this.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
