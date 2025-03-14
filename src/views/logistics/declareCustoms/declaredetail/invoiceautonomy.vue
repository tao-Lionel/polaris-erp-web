<template>
  <div id="cus-invoiceauto">
    <basic-container>
      <div class="invoiceauto-container">
        <el-row>
          <el-col :span="24"><p class="text-center title">发票</p></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"></el-col>
          <el-col :span="6"></el-col>
          <el-col :span="2"
            >编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NO:</el-col
          >
          <el-col :span="4" class="verticalAlignCenter">{{ invicoeInfo.contractNumber }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-row>
              <el-col :span="3">商号<br />Sold to<br />Massers:</el-col>
              <el-col :span="21" class="verticalAlignBottom">APEMAN INTERNATIONAL CO.，LIMITED</el-col>
            </el-row>
          </el-col>
          <el-col :span="4"></el-col>
          <el-col :span="2"
            >日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;DATE:</el-col
          >
          <el-col :span="4" class="verticalAlignCenter">{{ invicoeInfo.declareDate }}</el-col>
        </el-row>
        <el-table :data="tableData3" :span-method="arraySpanMethod">
          <el-table-column prop="markNo" label="标记号码 Mark & No"></el-table-column>
          <el-table-column prop="customsName" label="货物名称、型号规格 Description"></el-table-column>
          <el-table-column prop="declareQuantity" label="数量 Quantity"></el-table-column>
          <el-table-column prop="customsLegalUnit" label="单位 Unit"></el-table-column>
          <el-table-column prop="declarePrice" label="单价 Unit price"></el-table-column>
          <el-table-column prop="amount" label="总金额 Amount"></el-table-column>
        </el-table>
        <br /><br />
        <el-row>
          <el-col :span="14">
            <el-row>
              <el-col :span="3">唛头<br />Marks</el-col>
              <el-col :span="20">N/M</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { convertCurrency, dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
import { getContract } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
export default {
  name: "invoiceauto",
  components: {},
  created() {
    this.getInvoice()
  },
  mounted() {},
  data() {
    return {
      tableData3: [],
      invicoeInfo: {},
      totalAmount: null
    }
  },
  props: {
    numberNo: String
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == this.tableData3.length - 1) {
        if (columnIndex == 1) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else if (columnIndex >= 2 && columnIndex <= 3) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getInvoice() {
      getContract(this.numberNo).then((res) => {
        this.totalAmount = 0
        this.invicoeInfo = res.data.data
        this.invicoeInfo.declareDate = dateFormat(this.invicoeInfo.declareDate)
        this.tableData3 = this.invicoeInfo.detail
        this.tableData3.forEach((data) => {
          data.amount = (data.declareQuantity * data.declarePrice).toFixed(2)
          this.totalAmount += parseFloat((data.declareQuantity * data.declarePrice).toFixed(2))
        })
        let obj = {}
        obj.markNo = "总计"
        obj.customsName = convertCurrency(this.totalAmount)
        obj.price = "TOTAL:"
        obj.amount = this.totalAmount.toFixed(2)
        this.tableData3.push(obj)
      })
    }
  }
}
</script>
<style lang="scss">
@import "./invoiceautonomy.scss";
</style>
