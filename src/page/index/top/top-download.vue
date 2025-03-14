<template>
  <div id="top-download">
    <div class="download-div" @click="downLoadStatus = true">
      <el-badge :value="downloadCount" class="item" type="primary">
        <i class="el-icon-download"></i>
      </el-badge>
    </div>

    <el-dialog
      title="下载文件"
      :visible.sync="downLoadStatus"
      width="1000px"
      top="10vh"
      @open="openDownloadList"
      @close="closeDownloadList"
      custom-class="noWatch"
      class="dialogShowScroll"
    >
      <div style="color: red; font-size: 13px; line-height: 20px">
        <p>提示：</p>
        <p>1、文件的数据量为1万条，生成文件的时间大约需要1分钟，2万条大约需要2分钟，依此类推。</p>
        <p>2、业务可根据文件的生成时间，手动点击“刷新”按钮更新文件的生成状态，当状态为“已完成”时才能下载文件</p>
      </div>
      <div style="text-align: right; margin: 10px 0" @click="openDownloadList">
        <el-button type="primary" size="mini">刷新</el-button>
      </div>
      <el-table :data="downloadList" border max-height="600" style="width: 100%">
        <el-table-column prop="fileTaskCode" label="文件ID" width="180"> </el-table-column>
        <el-table-column prop="fileTaskName" label="文件名称"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200"> </el-table-column>
        <el-table-column prop="fileTaskStatusName" label="状态" width="100"> </el-table-column>
        <el-table-column prop="address" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="downloadFile(scope.row)"
              :disabled="scope.row.fileTaskStatus !== 'FINISHED'"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { newGetTokenUrl } from "@/util/auth"
import request from "@/router/axios"

export default {
  name: "top-download",
  components: {},
  data() {
    return {
      downLoadStatus: false,
      downloadList: []
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["userInfo", "downloadCount"])
  },
  props: [],
  methods: {
    requestPost(url, obj) {
      return request({
        url: url,
        method: "post",
        data: obj
      })
    },
    openDownloadList() {
      this.requestPost("/baseSetup/syncExport/list", { userId: this.userInfo.userId }, true).then((res) => {
        if (res.data.code === 0) {
          this.downloadList = res.data.data
          this.$store.commit("SET_DOWNLOAD_COUNT", "")
        }
      })
    },
    closeDownloadList() {
      this.downLoadStatus = false
    },
    downloadFile(row) {
      window.open(newGetTokenUrl("download/" + row.fileDownUrl))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  height: 80vh;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 130px);
  }
}
</style>
