<template>
  <div>
    <el-dialog
      title="确定中标物流商"
      :visible.sync="showDialog"
      width="1100px"
      top="10vh"
      custom-class="customDialog"
      @close="close"
    >
      <el-form>
        <detail-wrapper :options="{ title: '招标信息' }">
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
              <span>{{ form.plannedShipmentStartDate }}至{{ form.plannedShipmentEndDate }}</span>
            </el-col>
            <el-col span="6">
              <span>箱型：</span>
              <span>{{ form.containerTypeName }}</span>
            </el-col>
            <el-col span="6">
              <span>需求舱位量：</span>
              <span>{{ form.inviteTenderRequiredCapacity }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="6">
              <span>是否加急：</span>
              <span>{{ form.isEmergency ? "加急" : "不加急" }}</span>
            </el-col>
            <el-col span="12">
              <span>招标时间：</span>
              <span>{{ form.tenderStartTime }}至{{ form.tenderEndTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-show="form.isEmergency === 1" span="6">
              <span>期望到港时间：</span>
              <span>{{ form.expectedArrivalTime }}</span>
            </el-col>
            <el-col span="18">
              <span>船司：</span>
              <span>{{ form.shippingLine }}</span>
            </el-col>
          </el-row>
        </detail-wrapper>
      </el-form>

      <detail-wrapper :options="{ title: '投标信息', customContentStyle: { padding: '10px' } }">
        <avue-crud ref="crud" :data="tableData" :option="confirmTableOption" @selection-change="selectionChange">
          <!-- <template slot="priceValidityStartTime" slot-scope="scope">
            <span>{{ scope.row.priceValidityStartTime }} 至{{ scope.row.priceValidityEndTime }}</span>
          </template> -->

          <template slot="requiredCapacity" slot-scope="{ row }">
            <el-input
              v-model="row.requiredCapacity"
              placeholder="请输入"
              size="small"
              @change="validateNumber($event, row, 'requiredCapacity')"
            ></el-input>
          </template>
          <template slot="remark" slot-scope="{ row }">
            <el-input v-model="row.remark" placeholder="请输入备注" size="small"></el-input>
          </template>

          <template slot="tenderRecordStatus" slot-scope="scope">
            <span v-show="scope.row.tenderRecordStatus === 'N'" style="color: #f56c6c">否</span>
            <span v-show="scope.row.tenderRecordStatus === 'Y'" style="color: #67c23a">是</span>
          </template>
        </avue-crud>
      </detail-wrapper>
      <span slot="footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确定中标</el-button>
      </span>
    </el-dialog>

    <editWinningBidDialog ref="editWinningBidDialogRef" @save="save"></editWinningBidDialog>
  </div>
</template>

<script>
import { confirmTableOption } from "../list"
import editWinningBidDialog from "./editWinningBidReasonDialog.vue"
import { confirmTenderApi, getDetailApi } from "@/api/logistics/logisticsProviderTendering.js"

export default {
  name: "confirmWinningBidDialog",
  components: { editWinningBidDialog },
  data() {
    return {
      showDialog: false,
      form: {},
      confirmTableOption,
      tableData: [],
      selectList: []
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
      this.tableData = data.data?.wmsTenderRecordVos || []

      // 回显已经中标的物流商
      if (this.form?.wmsTenderConfirmVos && this.form?.wmsTenderConfirmVos.length > 0) {
        this.tableData = data.data?.wmsTenderRecordVos.map((item) => {
          const confirmInfo = this.form?.wmsTenderConfirmVos.find((f) => f.tenderRecordId === item.id)
          return {
            ...item,
            requiredCapacity: confirmInfo?.requiredCapacity || "",
            remark: confirmInfo?.remark || ""
          }
        })

        const selectRows = this.tableData.filter((item) => item.tenderRecordStatus === "Y")
        this.$refs.crud.toggleSelection(selectRows, true)
      }
    },
    //选中数据
    selectionChange(val) {
      this.selectList = val
    },
    validateNumber(val, row, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        row[key] = newVal
      } else {
        row[key] = null
      }
    },

    submit() {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }

      for (let item of this.selectList) {
        if (!item.requiredCapacity) {
          this.$message.warning(`请输入中标舱位量`)
          return
        }
      }

      // 如果已经有中标的物流商再去确定中标时，会填写修改原因
      if (this.form?.wmsTenderConfirmVos?.length > 0) {
        this.$refs.editWinningBidDialogRef.openDialog()
        return
      } else {
        this.handleConfirm()
      }
    },
    save(reason) {
      this.handleConfirm(reason)
    },
    async handleConfirm(reason) {
      const tenderRecordConfirmDetails = this.selectList?.map((item) => {
        return {
          tenderRecordId: item.id,
          tenderRecordCode: "",
          requiredCapacity: item.requiredCapacity,
          remark: item.remark
        }
      })
      const params = {
        inviteTenderId: this.form.id,
        inviteTenderCode: this.form.inviteTenderCode,
        tenderRecordConfirmDetails,
        operationRemark: reason
      }
      const { data } = await confirmTenderApi(params)
      if (data.code === 0) {
        this.$message.success("确定中标成功")
        this.close()
        this.$emit("updateList")
        this.showDialog = false
      }
    },
    close() {
      this.$refs.crud.selectClear()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col {
  padding: 10px;
}
::v-deep .customDialog {
  height: 80vh;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 130px);
  }
}
</style>
