<template>
  <div id="cus-invoiceself">
    <basic-container>
      <div class="invoiceself-container">
        <el-row>
          <el-col :span="24" class="text-center">
            <p class="text-font">天津自贸通外贸服务股份有限公司</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center">
            <p class="text-font2">Tianjin Free Trade Service Co.Ltd.</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center2">
            <p class="text-font3">NO.3 YUNNAN ROAD,TIANJIN CHINA</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center">
            <p class="text-font4">商业发票<br />COMMERCIAL INVOICE</p>
          </el-col>
        </el-row>
        <el-row class="content">
          <el-col :span="12">
            <el-row>
              <el-col :span="6" class="text-right">TO:</el-col>
              <el-col :span="14"></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="3">INV NO:</el-col>
              <el-col :span="12">{{ invicoeInfo.contractNumber }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="3">DATE:</el-col>
              <el-col :span="12">{{ invicoeInfo.declareDate }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="3">PO NO:</el-col>
              <el-col :span="12">{{ invicoeInfo.contractNumber }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="6" class="text-right">ROUTE:</el-col>
              <el-col :span="14"></el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--  -->
        <el-row class="tableContent">
          <el-table :header-cell-style="headerDisplay" :span-method="spanMethod" border :data="tableData">
            <el-table-column prop="markNo" label="MARK"> </el-table-column>
            <el-table-column prop="customsName" label="DESCRIPTION"> </el-table-column>
            <el-table-column prop="declareQuantity" label="QUANTITY"> </el-table-column>
            <el-table-column prop="customsLegalUnit" label="UNIT"> </el-table-column>
            <el-table-column prop="declarePrice" label="UNIT PRICE"> </el-table-column>
            <el-table-column prop="amount" label="AMOUNT"> </el-table-column>
          </el-table>
        </el-row>
        <el-row class="bottom">
          <el-col :span="12">
            <el-row>
              <el-col :span="6" class="text-right">境内货源地:</el-col>
              <el-col :span="1"></el-col>
              <el-col :span="14">{{ invicoeInfo.signContractSite }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { getContract } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
import { fixedInvoiceTable } from "@/const/crud/logistics/declareCustoms/declaredetail/detail"
import { dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
export default {
  name: "invoiceself",
  components: {},
  created() {
    this.getInvoice()
  },
  mounted() {},
  data() {
    return {
      tableData: fixedInvoiceTable(),
      totalAmount: null,
      invicoeInfo: {}
    }
  },
  props: {
    numberNo: String
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0 && columnIndex >= 0 && columnIndex <= 1) {
        return { rowspan: 2, colspan: 1 }
      } else if (rowIndex == 1 && columnIndex >= 0 && columnIndex <= 1) {
        return { rowspan: 0, colspan: 0 }
      }
      if (rowIndex == 0 && columnIndex == 4) {
        return { rowspan: 1, colspan: 1 }
        console.log(column) //return{rowspan:1,colspan:2}
      }
      if (rowIndex == 0 && columnIndex == 2) {
        return { rowspan: 2, colspan: 2 }
      } else if (rowIndex == 0 && columnIndex == 3) {
        return { rowspan: 0, colspan: 0 }
      } else if (rowIndex == 1 && columnIndex >= 2 && columnIndex <= 3) {
        return { rowspan: 0, colspan: 0 }
      }
      if (columnIndex == 0 && rowIndex == 2) {
        return { rowspan: this.tableData.length - 2, colspan: 1 }
      } else if (columnIndex == 0 && rowIndex > 2) {
        return { rowspan: 0, colspan: 0 }
      }
      if (rowIndex == 2 && columnIndex == 2) {
        return { rowspan: 1, colspan: 2 }
      }
      if (rowIndex == 2 && columnIndex == 3) {
        return { rowspan: 0, colspan: 0 }
      }
      if (rowIndex == 2 && columnIndex == 4) {
        return { rowspan: 0, colspan: 0 }
      }
      if (rowIndex == 2 && columnIndex == 5) {
        return { rowspan: 1, colspan: 2 }
      }
    },
    headerDisplay({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return { display: "none" }
      }
    },
    getInvoice() {
      getContract(this.numberNo).then((res) => {
        this.tableData = fixedInvoiceTable()
        this.totalAmount = 0
        this.invicoeInfo = res.data.data
        this.invicoeInfo.declareDate = dateFormat(this.invicoeInfo.declareDate)
        let curr = ""
        this.invicoeInfo.detail.forEach((data) => {
          data.amount = (data.declareQuantity * data.declarePrice).toFixed(2)
          this.totalAmount += parseFloat((data.declareQuantity * data.declarePrice).toFixed(2))
          curr = data.currency
        })
        this.tableData = this.tableData.concat(this.invicoeInfo.detail)
        this.tableData[1].declarePrice = curr
        this.tableData[1].amount = curr
        let obj = {}
        obj.markNo = ""
        obj.customsName = "TOTAL"
        obj.declarePrice = curr
        obj.amount = this.totalAmount.toFixed(2)
        console.log(this.tableData)
        this.tableData.push(obj)
      })
    }
  }
}
</script>
<style lang="scss">
@import "./invoiceselftrade.scss";
</style>
