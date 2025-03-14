<template>
  <!-- 下方第三方仓队列结果 -->
  <el-dialog
    title="提示"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%"
    :before-close="handleClose"
  >
    <p style="color: red; font-size: 15px; margin-bottom: 10px">
      <span v-if="examineLoading">正在处理数据，请不要进行任何操作，不要关闭此页面，谢谢！</span>
      <span v-else>下方第三方仓数据已处理完毕！</span>
    </p>
    <div style="font-size: 14px; padding: 6px 0; display: flex">
      <p>
        <span>总条数：</span><span>{{ selectRows.length }}</span>
      </p>
      <p style="margin: 0 20px">
        <span>成功条数：</span><span>{{ responseList.successCount }}</span>
      </p>
      <p>
        <span>失败条数：</span><span style="color: red">{{ responseList.failCount }}</span>
      </p>
    </div>
    <el-table :data="responseList.erList" :border="true" :max-height="400" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="code" label="单据编号" width="210px"></el-table-column>
      <el-table-column prop="success" label="成功/失败" width="85px">
        <template slot-scope="scope">
          <span v-if="scope.row.success">成功</span>
          <span v-else style="color: red">失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="失败原因"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="handleClose" :loading="examineLoading">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { syncOrderBatchApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "sendToThirdPartyWarehouseResDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      examineLoading: false,
      selectRows: [],
      responseList: {
        erList: [],
        successCount: 0,
        failCount: 0,
        fail: []
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows) {
      this.showDialog = true
      this.selectRows = selectRows
      this.handleSend()
    },

    // 下发
    async handleSend() {
      try {
        const batchOrderCodeList = this.selectRows.map((item) => ({ batchOrderCode: item.batchOrderCode }))
        this.examineLoading = true
        const BATCH_SIZE = 10 // 每次处理的批次大小
        const DELAY_TIME = 300 // 延迟时间

        const processBatch = async (batch, startIndex) => {
          // 处理当前批次的所有请求
          return Promise.all(
            batch.map(async (idObj, index) => {
              await syncOrderBatchApi(idObj)
                .then(({ data }) => {
                  const resultObj = {
                    code: idObj.batchOrderCode,
                    success: data.code === 0,
                    msg: data.code === 0 ? "" : data.msg
                  }
                  if (resultObj.success) {
                    this.responseList.successCount++
                    this.responseList.erList.push(resultObj)
                  } else {
                    this.responseList.failCount++
                    this.responseList.erList.unshift(resultObj)
                  }

                  return resultObj
                })
                .catch((error) => {
                  const errorObj = {
                    code: idObj.batchOrderCode,
                    success: false,
                    msg: error.message || "网络请求失败"
                  }
                  this.responseList.failCount++
                  this.responseList.erList.unshift(errorObj)
                  return errorObj
                })
            })
          )
        }

        //  循环处理批次
        for (let i = 0; i < batchOrderCodeList.length; i += BATCH_SIZE) {
          // 获取当前批次的数据
          const batch = batchOrderCodeList.slice(i, i + BATCH_SIZE)
          await processBatch(batch, i)

          // 如果不是最后一批，才添加延迟
          if (i + BATCH_SIZE < batchOrderCodeList.length) {
            await new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
          }
        }
      } catch (error) {
        console.log("error", error)
      } finally {
        this.examineLoading = false
      }
    },

    handleClose() {
      this.responseList = {
        erList: [],
        successCount: 0,
        failCount: 0
      }
      this.showDialog = false
      this.examineStatus = false
      this.$emit("updateList")
    }
  }
}
</script>

<style lang="scss" scoped></style>
