<template>
  <!-- 合同自贸通报关 -->
  <div class="execution" id="contractFreeTradeCustomsDeclaration">
    <basic-container>
      <el-row>
        <el-col :span="24">
          <div class="text-align-center title"><strong>天津自贸通外贸服务股份有限公司</strong></div>
          <div class="text-align-center title"><strong>TIANJIN FREE TRADE SERVICE CO.LTD.</strong></div>
          <div class="text-align-center title"><strong>NO.3 YUNNAN ROAD, TIANJIN CHINA</strong></div>
          <div class="text-align-center title"><strong>售货确认书</strong></div>
          <div class="text-align-center title"><strong>SALES CONFIRMATION</strong></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>SOLD TO：</span>
        </el-col>
        <el-col :span="8" :offset="4">
          <span>S/C.NO(合同号）：{{ contractInfo.contractNumber }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="16">
          <span>S/C.DATE(合同日期）： {{ contractInfo.declareDate }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <span>下列签字双方同意按以下条款达成交易：</span> <br />
          <span>WE HEREBY CONFIRM HAVING SOLD TU YOU THE FOLLING GOODS ON TERMS ANDCONDITIONS AS SPECIFIED BELOW:</span>
          <br />
          <span>兹确认售于你方下列货物，其成交条款如下：</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span>PORT OF LOADING：{{ contractInfo.signContractSite }}</span>
        </el-col>
        <el-col :span="8" :offset="4">
          <span>PORT OF DESTINATION：{{ contractInfo.goalCountryName }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <avue-crud :data="CSDTableData" :option="CSDTableOption">
            <!--数量及单位-->
            <template slot="declareQuantity" slot-scope="scope">
              {{ scope.row.declareQuantity }} {{ scope.row.customsLegalUnit }}
            </template>
            <!--币别及单价-->
            <template slot="declarePrice" slot-scope="scope">
              <span v-if="scope.row.$index != lastIndex"
                >{{ scope.row.currency }}&nbsp;&nbsp;&nbsp;{{ scope.row.declarePrice }}</span
              >
            </template>
            <!--总金额-->
            <template slot="amount" slot-scope="scope">
              <span v-if="scope.row.$index != lastIndex">{{ scope.row.amount }}</span>
              <span v-else>{{ scope.row.currency }}&nbsp;&nbsp;&nbsp;{{ scope.row.amount }}</span>
            </template>
          </avue-crud>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>唛头（MARKS)：</span>
        </el-col>
        <el-col :span="6">
          <!-- <span>AS PER INVOICE</span> -->
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>装运期限（TIME OF SHIPMENT)：</span>
        </el-col>
        <el-col :span="6">
          <!-- <span>BEFORE  2019-1-31</span> -->
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>包装（PACKING)：</span>
        </el-col>
        <el-col :span="6">
          <span>{{ contractInfo.packageSum }} CTNS</span>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>付款条件（TERMS OF PAYMENT)：</span>
        </el-col>
        <el-col :span="6">
          <!-- <span>T/T Before Shipment</span> -->
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>保险（INSURANCE)：</span>
        </el-col>
        <el-col :span="6">
          <!-- <span>AS ARRANGE</span> -->
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>买方确认</span>
        </el-col>
        <el-col :span="6" :offset="12">
          <span> 卖方确认</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <span>CONFIRMED BY BUYERS</span>
        </el-col>
        <el-col :span="6" :offset="12">
          <span> CONFIRMED BY SELLERS</span>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { getContract } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
import { dateFormat } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
import { mapGetters } from "vuex"
export default {
  name: "contractFreeTradeCustomsDeclaration",
  components: {},
  created() {
    this.getContractNumber()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  props: {
    numberNo: String
  },
  data() {
    return {
      CSDTableOption: {
        menu: false,
        header: false,
        selection: false,
        border: true,
        stripe: true,
        menu: false,
        menuAlign: "center",
        align: "center",
        editBtn: false,
        delBtn: false,
        addBtn: false,
        dic: [],
        column: [
          {
            label: "COMMODITY AND SPECIFICATION",
            prop: "customsNameEn",
            sortable: false
          },
          {
            label: "QUANTITY",
            prop: "declareQuantity",
            solt: true,
            sortable: false
          },
          {
            label: "UNIT PRICE",
            prop: "declarePrice",
            solt: true,
            sortable: false
          },
          {
            label: "AMOUNT",
            prop: "amount",
            solt: true,
            sortable: false
          }
        ]
      },
      CSDTableData: [],
      labelPosition: "right",
      contractInfo: {},
      lastIndex: 0
    }
  },
  methods: {
    getContractNumber() {
      // console.log(this.numberNo)
      getContract(this.numberNo).then((res) => {
        this.contractInfo = res.data.data
        this.contractInfo.declareDate = dateFormat(this.contractInfo.declareDate)
        this.CSDTableData = this.contractInfo.detail
        let totalQua = 0
        let totalAmount = 0
        let currencyCode = ""
        this.CSDTableData.forEach((data) => {
          currencyCode = data.currency
          data.amount = (data.declareQuantity * data.declarePrice).toFixed(2)
          totalAmount += parseFloat((data.declareQuantity * data.declarePrice).toFixed(2))
          totalQua += data.declareQuantity
        })
        this.totalAmount = totalAmount.toFixed(2)
        this.CSDTableData.push({
          customsNameEn: "TOTAL:",
          declareQuantity: totalQua,
          amount: this.totalAmount,
          currency: currencyCode
        })
        this.lastIndex = this.CSDTableData.length - 1
      })
    }
  }
}
</script>
<style lang="scss">
#contractFreeTradeCustomsDeclaration {
  .text-align-center {
    text-align: center;
  }
  .title {
    border-radius: 4px;
    min-height: 36px;
    font-size: 22px;
  }
}
</style>
