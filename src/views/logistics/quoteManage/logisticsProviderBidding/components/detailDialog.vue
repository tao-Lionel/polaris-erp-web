<template>
  <el-dialog title="查看详情" :visible.sync="showDialog" width="1000px">
    <el-form>
      <detail-wrapper :options="{ title: '招标信息' }">
        <el-row>
          <el-col span="12">
            <span>招标需求单号：</span>
            <span>{{ form.inviteTenderCode }}</span>
          </el-col>
          <el-col span="12">
            <span>需求状态：</span>
            <span>{{ form.inviteTenderStatusNameForBidder }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="6">
            <span>起运国家：</span>
            <span>{{ form.countryOfOriginName }}</span>
          </el-col>
          <el-col span="6">
            <span>目的国家：</span>
            <span>{{ form.destinationCountryName }}</span>
          </el-col>
          <el-col span="6">
            <span>起运港口：</span>
            <span>{{ form.portOfOriginName }}</span>
          </el-col>
          <el-col span="6">
            <span>目的港口：</span>
            <span>{{ form.destinationPortName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <span>计划发运时间：</span>
            <span>{{ form.plannedShipmentStartDate }} 至 {{ form.plannedShipmentEndDate }}</span>
          </el-col>
          <el-col span="12">
            <span>箱型：</span>
            <span>{{ form.containerTypeName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <span>招标时间：</span>
            <span>{{ form.tenderStartTime }} 至 {{ form.tenderEndTime }}</span>
          </el-col>
          <el-col span="12">
            <span>船司：</span>
            <span>{{ form.shippingLine }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <span>是否加急：</span>
            <span>{{ form.isEmergency ? "加急" : "不加急" }}</span>
          </el-col>
          <el-col span="12">
            <span>期望到港时间：</span>
            <span>{{ form.expectedArrivalTime }}</span>
          </el-col>
        </el-row>
      </detail-wrapper>

      <detail-wrapper :options="{ title: '投标信息', customContentStyle: { padding: '10px' } }">
        <avue-crud :data="tableData" :option="detailTableOption">
          <!-- <template slot="priceValidityStartTime" slot-scope="scope">
            <span>{{ scope.row.priceValidityStartTime }} 至 {{ scope.row.priceValidityEndTime }}</span>
          </template> -->

          <template slot="uploadedFileUrl" slot-scope="scope">
            <div v-if="scope.row.uploadedFileUrl">
              <el-popover v-if="scope.row.isImg" placement="right" trigger="click">
                <img style="max-width: 600px" :src="scope.row.imgUrl" />
                <el-button type="text" slot="reference">
                  <i class="el-icon-view y-reviews"> </i>
                </el-button>
              </el-popover>

              <i
                class="el-icon-download y-reviews"
                style="font-size: 16px"
                @click="handleDownload(scope.row.uploadedFileUrl)"
              >
              </i>
            </div>
          </template>

          <template slot="requiredCapacity" slot-scope="scope">
            <!-- 已开标时再展示中标舱位量 -->
            <div v-if="form.inviteTenderStatus === 'OPENED'">{{ scope.row.requiredCapacity }}</div>
            <div v-else>待开标</div>
          </template>

          <template slot="remark" slot-scope="scope">
            <!-- 已开标时再展示备注 -->
            <div v-if="form.inviteTenderStatus === 'OPENED'">{{ scope.row.remark }}</div>
            <div v-else>待开标</div>
          </template>

          <template slot="tenderRecordStatus" slot-scope="scope">
            <!-- 已开标时再展示是否中标 -->
            <div v-if="form.inviteTenderStatus === 'OPENED'">
              <span v-show="scope.row.tenderRecordStatus === 'N'" style="color: #f56c6c">否</span>
              <span v-show="scope.row.tenderRecordStatus === 'Y'" style="color: #67c23a">是</span>
            </div>
            <div v-else>待开标</div>
          </template>
        </avue-crud>
      </detail-wrapper>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detailTableOption } from "../list"
import { getDetailApi } from "@/api/logistics/logisticsProviderBidding.js"
import { getTokenUrl, downloadFileByUrl } from "@/util/auth"

export default {
  name: "logisticsProviderBiddingDetailDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      detailTableOption,
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(id) {
      this.showDialog = true
      this.getDetail(id)
    },
    async getDetail(id) {
      const { data } = await getDetailApi(id)
      this.form = data.data

      this.tableData = data.data?.wmsTenderRecordVos?.map((item) => {
        let confirmInfo = {}
        // 有确定中标的信息 则在wmsTenderRecordVos 中匹配 中标舱位量和备注
        if (data.data?.wmsTenderConfirmVos?.length > 0) {
          confirmInfo = data.data.wmsTenderConfirmVos.find((f) => f.tenderRecordId === item.id)
        }
        return {
          ...item,
          requiredCapacity: confirmInfo?.requiredCapacity,
          remark: confirmInfo?.remark,
          imgUrl: item.uploadedFileUrl ? getTokenUrl(item.uploadedFileUrl) : "",
          isImg: item.uploadedFileUrl ? this.getFileExt(item.uploadedFileUrl) : " "
        }
      })
    },
    // 下载
    handleDownload(fileUrl) {
      downloadFileByUrl(getTokenUrl(fileUrl), this.getFileName(fileUrl))
    },
    // 截取文件名
    getFileName(fileUrl) {
      return fileUrl.substring(fileUrl.lastIndexOf("-") + 1)
    },
    // 判断是不是图片
    getFileExt(fileName = "") {
      const index = fileName.lastIndexOf(".")
      const ext = index !== -1 ? fileName.substring(index + 1) : ""
      return ["png", "jpg", "jpeg", "gif"].includes(ext)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col {
  padding: 10px;
}
::v-deep .el-popover__reference {
  padding: 0;
}
</style>
