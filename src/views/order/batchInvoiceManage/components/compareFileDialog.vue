<template>
  <el-dialog v-if="showDialog" title="核对SBOL" :visible.sync="showDialog" width="90%">
    <div class="dialog-content">
      <div v-if="SBOLList?.length > 0" class="sbol-wrap">
        <div style="position: relative">
          <span @click="prevEvent" class="preview__btn preview__prev">
            <svg
              t="1669452168825"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3772"
              width="48"
              height="48"
            >
              <path
                d="M384 512L731.733333 202.666667c17.066667-14.933333 19.2-42.666667 4.266667-59.733334-14.933333-17.066667-42.666667-19.2-59.733333-4.266666l-384 341.333333c-10.666667 8.533333-14.933333 19.2-14.933334 32s4.266667 23.466667 14.933334 32l384 341.333333c8.533333 6.4 19.2 10.666667 27.733333 10.666667 12.8 0 23.466667-4.266667 32-14.933333 14.933333-17.066667 14.933333-44.8-4.266667-59.733334L384 512z"
                p-id="3773"
                fill="#ffffff"
              ></path>
            </svg>
          </span>

          <span @click="nextEvent" class="preview__btn preview__next">
            <svg
              t="1669452135423"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3522"
              width="48"
              height="48"
            >
              <path
                d="M731.733333 480l-384-341.333333c-17.066667-14.933333-44.8-14.933333-59.733333 4.266666-14.933333 17.066667-14.933333 44.8 4.266667 59.733334L640 512 292.266667 821.333333c-17.066667 14.933333-19.2 42.666667-4.266667 59.733334 8.533333 8.533333 19.2 14.933333 32 14.933333 10.666667 0 19.2-4.266667 27.733333-10.666667l384-341.333333c8.533333-8.533333 14.933333-19.2 14.933334-32s-4.266667-23.466667-14.933334-32z"
                p-id="3523"
                fill="#ffffff"
              ></path>
            </svg>
          </span>
          <div class="file-page">{{ fileIndex + 1 }} / {{ SBOLList.length }}</div>
          <div v-if="isPdf">
            <iframe :src="fileUrl.url" width="100%" height="800" frameborder="0" scrolling="no"></iframe>
          </div>
          <preview-img
            v-else
            ref="previewImg"
            :urlList="[fileUrl.url]"
            :appendToBody="false"
            :showMask="false"
            :bottomBtn="100"
          ></preview-img>
        </div>
      </div>
      <div v-else class="no-data">暂无SBOL附件</div>

      <div class="form-wrap">
        <div class="tip">
          勾选了 <span class="red"> &nbsp;{{ selectRows.length }} &nbsp;</span> 单，当前第&nbsp;<span class="green">
            {{ currentOrderIndex + 1 }}&nbsp;
          </span>
          单，提交后自动跳转下一单
        </div>

        <el-form :model="form" ref="form" inline label-width="220px" label-suffix="：">
          <el-form-item label="发货批次单号">
            <span>{{ batchOrderCode }}</span>
          </el-form-item>
          <el-form-item label="承运商">
            <span>{{ detail.platformTransportCarrierName }}</span>
          </el-form-item>
          <el-form-item label="PO号">
            <span>{{ detail.sourceNo }}</span>
          </el-form-item>
          <el-form-item label="ARN号">
            <span>{{ detail.extendCode }}</span>
          </el-form-item>
          <el-form-item label="发货总托数">
            <span>{{ detail.totalPallet }}</span>
          </el-form-item>
          <el-form-item label="发货总标准托数">
            <span>{{ detail.totalNormalPallet }}</span>
          </el-form-item>
          <el-form-item label="发货总箱数">
            <span>{{ detail.totalCarton }}</span>
          </el-form-item>
          <el-form-item label="实际提货时间" prop="requiredShipDate">
            <el-date-picker
              v-model="form.requiredShipDate"
              type="date"
              size="small"
              placeholder="实际提货时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="货车提单号(PRO号)" prop="trackingNo">
            <el-input v-model="form.trackingNo" size="small" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="abnormalType" label="异常类型">
            <el-select v-model="form.abnormalType" filterable size="small" placeholder="异常类型" clearable>
              <el-option v-for="item in abnormalTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" size="small" placeholder="请输入" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button :loading="loading" size="small" type="primary" @click="submit"> 保 存 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTokenUrl, getDictByType, getFileExtension } from "@/util/auth"
import { getSBOLAttachmentListApi, confirmSBOLApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "compareFileDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        trackingNo: "",
        abnormalType: "",
        remark: "",
        requiredShipDate: ""
      },
      currentOrderIndex: 0, // 当前订单索引
      batchOrderCode: "",
      selectRows: [],
      SBOLList: [],
      fileIndex: 0, // 当前的文件索引
      loading: false,
      abnormalTypeOptions: [],
      detail: {}, // 详情
      fileUrl: {},
      isPdf: false
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(selectRows) {
      this.currentOrderIndex = 0
      this.selectRows = selectRows
      this.showDialog = true
      this.form = {
        trackingNo: "",
        abnormalType: "",
        remark: "",
        requiredShipDate: ""
      }
      this.setInfo()
      this.getSBOLAttachmentList()
      this.abnormalTypeOptions = await getDictByType("fo_order_abnormal_type")
    },
    setInfo() {
      this.detail = this.selectRows[this.currentOrderIndex]
      const { batchOrderCode, trackingNo, abnormalType, remark, requiredShipDate } =
        this.selectRows[this.currentOrderIndex]
      this.batchOrderCode = batchOrderCode
      this.form = {
        trackingNo,
        abnormalType,
        remark,
        requiredShipDate
      }
    },
    // 获取附件
    async getSBOLAttachmentList() {
      this.fileIndex = 0
      const { data } = await getSBOLAttachmentListApi(this.batchOrderCode)

      if (data.code === 0) {
        this.SBOLList = data.data

        this.showFile()
      }
      this.loading = false
    },

    showFile() {
      this.fileUrl = this.SBOLList[this.fileIndex]
      if (this.fileUrl?.name) {
        this.isPdf = getFileExtension(this.fileUrl.name) === "pdf"
        if (this.isPdf) {
          this.fileUrl.url = getTokenUrl(this.fileUrl.url) + "&type=previewPdf"
        } else {
          this.fileUrl.url = getTokenUrl(this.fileUrl.url)
        }
      }
    },

    prevEvent() {
      const len = this.SBOLList.length
      this.fileIndex = (this.fileIndex - 1 + len) % len
      console.log("fileIndex====", this.fileIndex)
      this.showFile()
    },
    nextEvent() {
      const len = this.SBOLList.length
      this.fileIndex = (this.fileIndex + 1) % len
      console.log("fileIndex====", this.fileIndex)
      this.showFile()
    },

    async nextOrder() {
      this.$refs.form?.resetFields()
      this.currentOrderIndex++
      if (this.selectRows?.length > this.currentOrderIndex) {
        this.setInfo()
        await this.getSBOLAttachmentList()
      } else {
        setTimeout(() => {
          this.$message.success("核对完成")
          this.$emit("updateList")
          this.showDialog = false
        }, 0)
      }
      this.loading = false
    },

    submit() {
      this.loading = true
      if (this.SBOLList?.length <= 0) {
        this.nextOrder()
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 如果选了异常类型，所有的 confirmFlag 都为 false
          const params = {
            ...this.form,
            omsFoBatchOrderCode: this.batchOrderCode,
            omsSBOLCheckDetailDTOList: this.SBOLList.map((item, index) => {
              return {
                omsAttachId: item.omsAttachId,
                confirmFlag:
                  this.form.abnormalType && this.form.abnormalType !== "NON"
                    ? false
                    : index === this.fileIndex
                    ? true
                    : false
              }
            })
          }
          try {
            console.log("params======", params)
            const { data } = await confirmSBOLApi(params)
            if (data.code === 0) {
              this.$message.success(`发货批次单 ${this.batchOrderCode} 确认成功`)
            }
          } catch (err) {
            this.$message.error(`发货批次单 ${this.batchOrderCode} 确认失败`)
            console.log(err)
          } finally {
            this.nextOrder()
          }
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  .el-dialog__body {
    // overflow-y: auto;
    height: calc(100% - 130px);
  }
}

.dialog-content {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
  height: 100%;
}

.preview__btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.8;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}

.preview__next,
.preview__prev {
  top: 30%;
  width: 44px;
  height: 44px;
  font-size: 24px;
  color: #fff;
  background-color: #606266;
  border-color: #fff;
}
.preview__prev {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 10px;
}
.preview__next {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 10px;
  text-indent: 2px;
}

.sbol-wrap {
  position: relative;
  flex: 1;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    opacity: 1 !important;
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent !important;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(188, 191, 193, 0.4);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(188, 191, 193, 0.75);
  }
}

.file-page {
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.form-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  padding-left: 10px;
  border-left: 1px solid #dcdfe6;

  ::v-deep .el-form {
    display: flex;
    flex-direction: column;
  }
}

.tip {
  display: flex;
  font-size: 14px;
  margin-bottom: 30px;
  .red {
    font-size: 18px;
    color: red;
  }
  .green {
    font-size: 18px;
    color: green;
  }
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 20px;
  flex: 1;
}
</style>
