<template>
  <div>
    <el-dialog title="接收订单" :visible.sync="showDialog" width="90%" @close="closeDialog">
      <div>
        <el-form ref="form" :model="form">
          <div style="display: flex; justify-content: space-between; margin: 0 10px 10px 0">
            <div style="color: red; margin: 0 0 10px 5px">提示：系统会自动将未接收的数量取消，请谨慎填写接收数量！</div>
            <div style="display: flex; gap: 10px">
              <el-dropdown split-button type="primary" size="small" @click="batchReceive('empty')">
                下载空模板
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="batchReceive('info')">下载带信息模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-upload
                ref="upload"
                :show-file-list="false"
                list-type="text"
                :accept="accept"
                action="String"
                :before-upload="onBeforeUpload"
                :http-request="onHttpRequest"
              >
                <el-button type="primary" size="small">上传数据</el-button>
              </el-upload>
            </div>
          </div>
          <avue-crud :data="form.tableData" :option="receiveOrderTableOption" :span-method="spanMethod">
            <template slot="shipWindowLeft" slot-scope="scope">
              {{ scope.row.shipWindowLeft }}<br />
              {{ scope.row.shipWindowRight }}
            </template>

            <template slot="receiveQuantity" slot-scope="scope">
              <el-form-item :prop="`tableData.${scope.row.$index}.receiveQuantity`" :rules="rules.receiveQuantity">
                <el-input-number
                  v-model="scope.row.receiveQuantity"
                  placeholder="请输入接收数量"
                  :controls="false"
                  size="small"
                  :min="0"
                  :max="scope.row.quantity"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </template>
          </avue-crud>
        </el-form>
      </div>
      <span slot="footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { receiveOrderTableOption } from "@/const/crud/order/orderManage/orderManage"
import {
  getReceiveOrderInfoApi,
  receiveOrderApi,
  receiveOrderDownLoadApi,
  receiveUpLoadShowApi
} from "@/api/order/orderManage"
import { downloadBlob, getFileExtension } from "@/util/auth"
import { downloadTemplate } from "@/api/order/invoiceManage"

export default {
  name: "receiveOrderDialog",
  components: {},
  data() {
    return {
      rules: {
        receiveQuantity: { required: true, message: "请输入接收数量", trigger: "blur" }
      },
      showDialog: false,
      receiveOrderTableOption,
      form: {
        tableData: []
      },
      accept: ".xls,.xlsx"
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(orderCodeList) {
      this.showDialog = true
      this.getDetail(orderCodeList)
    },
    async getDetail(orderCodeList) {
      const { data } = await getReceiveOrderInfoApi({ orderCodes: orderCodeList })
      if (data.code === 0) {
        this.setTableData(data.data)
      }
    },

    // 设置表格数据
    setTableData(data) {
      this.form.tableData = []
      data.forEach(({ detailInfoList, orderCode, sourceCode, shipWindowLeft, shipWindowRight }) => {
        const rowCount = detailInfoList.length
        detailInfoList.forEach((detail, index) => {
          this.form.tableData.push({
            orderCode,
            sourceCode,
            shipWindowLeft,
            shipWindowRight,
            ...detail,
            _row: index === 0 ? rowCount : 0, // 需要合并的行数，0代表不展示
            _col: index === 0 ? 1 : 0 // 需要合并的列数, 0代表不展示
          })
        })
      })
    },

    // 合并行
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        return {
          rowspan: row._row,
          colspan: row._col
        }
      }
    },

    // 根据orderCode分组
    groupDataByOrderCode(type = "submit") {
      // 创建一个对象来临时存储orderCode分组的数据
      const groupedData = {}

      const key = type === "submit" ? "cmdDetails" : "detailInfoCmdList"

      this.form.tableData.forEach((item) => {
        if (!groupedData[item.orderCode]) {
          groupedData[item.orderCode] = {
            orderCode: item.orderCode,
            [key]: []
          }
        }

        const details =
          type === "submit"
            ? {
                detailLineNo: item.detailLineNo,
                receiveQuantity: item.receiveQuantity
              }
            : {
                detailLineNo: item.detailLineNo,
                skuCode: item.skuCode,
                skuName: item.skuName,
                asin: item.asin,
                expectedQuantity: item.expectedQuantity,
                currentSkuAbleQuantity: item.currentSkuAbleQuantity,
                allSkuAbleQuantity: item.allSkuAbleQuantity,
                receiveQuantity: item.receiveQuantity
              }

        groupedData[item.orderCode][key].push(details)
      })

      return Object.values(groupedData)
    },

    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const paramsArr = this.groupDataByOrderCode("submit")

          try {
            await Promise.all(
              paramsArr.map(async (item) => {
                await receiveOrderApi(item)
              })
            )
            this.$message.success("接单成功")
            this.showDialog = false
            this.$emit("updateList")
          } catch (error) {
            this.$message.error("接单失败")
            console.log("error", error)
          }
        }
      })
    },
    closeDialog() {
      this.$refs.form.resetFields()
    },
    // 批量接收
    async batchReceive(type) {
      if (type === "empty") {
        //  下载空模板
        const { data } = await downloadTemplate({
          templateName: "订单接单模板.xlsx"
        })
        downloadBlob(data, "订单接单模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
      } else {
        const params = {
          downloadCmdList: this.groupDataByOrderCode("download")
        }

        const { data } = await receiveOrderDownLoadApi(params)
        downloadBlob(data, "接受订单.xls", "application/vnd.ms-excel;charset=utf-8")
        this.$message.success("下载成功")
      }
    },

    // 上传前校验
    onBeforeUpload(file) {
      const fileName = getFileExtension(file.name)
      const localFileType = this.accept.replace(/\./g, "").split(",")
      if (!localFileType.includes(fileName)) {
        this.$message.warning("请选择EXCEL文件上传!!")
        return false
      }
      const maxSize = 6
      if (file.size / 1024 / 1024 > maxSize) {
        this.$message.warning(`文件限制为${maxSize}M以内!!`)
        return false
      }
    },

    // 上传
    async onHttpRequest(param) {
      const formData = new FormData()
      formData.append("file", param.file)
      const { data } = await receiveUpLoadShowApi(formData)
      if (data.code === 0) {
        this.$message.success("上传成功")
        this.setTableData(data.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
