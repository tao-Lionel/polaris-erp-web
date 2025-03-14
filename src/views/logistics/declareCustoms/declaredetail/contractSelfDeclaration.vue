<template>
  <!-- 合同自主报关 -->
  <div class="execution" id="contractSelfDeclaration">
    <basic-container>
      <el-row>
        <el-col :span="24">
          <div class="text-align-center title"><strong>合同</strong></div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="2">
          <span>卖方<br />Sellers：</span>
        </el-col>
        <el-col :span="22">
          <div>
            <span>{{ contractInfo.sellerName }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="2">
          <span>地址<br />Address：</span>
        </el-col>
        <el-col :span="10">
          <div>
            <span>{{ contractInfo.address }}</span>
          </div>
          <!--深圳市龙岗区平湖街道华南大道华南国际 印刷纸品包装物流区（一期）P11栋126号第一层-->
        </el-col>
        <el-col :span="2" :offset="4">
          <span>合同号<br />Contract No：</span>
        </el-col>
        <el-col :span="6">
          <div>
            <span>{{ contractInfo.contractNumber }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="2">
          <span>电话<br />TEL：</span>
        </el-col>
        <el-col :span="4">
          <div>
            <span><!--20190220001--></span>
          </div>
        </el-col>
        <el-col :span="2">
          <span>传真<br />FAX：</span>
        </el-col>
        <el-col :span="4">
          <div><span></span></div>
          <!--YR20190220001-->
        </el-col>
        <el-col :span="2" :offset="4">
          <span>日期<br />Date：</span>
        </el-col>
        <el-col :span="6">
          <div>
            <span>{{ contractInfo.declareDate }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="2">
          <span>买方<br />Buyers：</span>
        </el-col>
        <el-col :span="10">
          <div><span>APEMAN INTERNATIONAL CO.，LIMITED</span></div>
        </el-col>
        <el-col :span="2" :offset="4">
          <span>签约地点<br />Signed at：</span>
        </el-col>
        <el-col :span="6">
          <div>
            <span>{{ contractInfo.signContractSite }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="2">
          <span>地址<br />Address：</span>
        </el-col>
        <el-col :span="22">
          <div><span>FLAT/ RM A27，9/F SILVERCORP INT’L TOWER 707-713 NATHAN RD MONGKOK KL</span></div>
        </el-col>
      </el-row>

      <el-row class="bottom-solid">
        <el-col :span="24">
          <span>经买卖双方确认根据下列条款订立本合同</span>
          <br />
          <span
            >This contract is made out by the Selers and Buyers as per the following terms and conditions mutuilly
            confirmed:</span
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <avue-crud :data="CSDTableData" :option="CSDTableOption"> </avue-crud>
          <!-- <el-table border :data="CSDTableData" id="table-base">
              <el-table-column label="(1)货物名称及规格*Name of commodity" prop="A1" :render-header="renderHeader"></el-table-column>
              <el-table-column label="(2)数 量*Quantity"  prop="A2" :render-header="renderHeader"></el-table-column>
              <el-table-column label="(3)单 位*Unit"  prop="A3" :render-header="renderHeader"></el-table-column>
              <el-table-column label="(4)单价*Unit Price"  prop="A3" :render-header="renderHeader"></el-table-column>
              <el-table-column label="(5)金额*Amount"  prop="A3" :render-header="renderHeader"></el-table-column>
            </el-table> -->
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <span>数量及总值允许有 2 %的增减。</span>
          <br />
          <span>more or less both in amount and quantity allowed.</span>
        </el-col>
        <el-col :span="6" :offset="6">
          <span>总值</span>
          <br />
          <span>Total Amount:</span>
        </el-col>
        <el-col :span="4">
          <br />
          <span>{{ totalAmount }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <span>（6）合同总值（大写）</span>
          <br />
          <span>Total Value in Word:</span>
        </el-col>
        <el-col :span="6" :offset="6">
          <br />
          <span>{{ totalCurrency }}：{{ totalAmountCn }}</span>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { getContract } from "@/api/logistics/declareCustoms/declaredetail/customsDeclaration"
import { dateFormat, convertCurrency } from "@/const/crud/logistics/declareCustoms/declaredetail/util"
export default {
  name: "contractSelfDeclaration",
  components: {},
  created() {
    this.getContractNumber()
  },
  mounted: function () {},
  computed: {
    // ...mapGetters(['permissions'])
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
            label: "(1)货物名称及规格 Name of commodity",
            prop: "customsName",
            sortable: false
          },
          {
            label: "(2)数 量 Quantity",
            prop: "declareQuantity",
            sortable: false
          },
          {
            label: "(3)单 位Unit",
            prop: "customsLegalUnit",
            sortable: false
          },
          {
            label: "(4)单价Unit Price",
            prop: "declarePrice",
            sortable: false
          },
          {
            label: "(5)金额Amount",
            prop: "amount",
            sortable: false
          }
        ]
      },
      CSDTableData: [],
      labelPosition: "right",
      contractInfo: {},
      totalAmount: null,
      totalAmountCn: null,
      totalCurrency: "总计欧元"
    }
  },
  methods: {
    //自定义表头
    renderHeader(h, { column, $index }) {
      let temp = column.label.split("*")
      return h("div", {}, [h("span", temp[0]), h("br"), h("span", temp[1])])
    },
    getContractNumber() {
      getContract(this.numberNo).then((res) => {
        this.contractInfo = res.data.data
        this.contractInfo.declareDate = dateFormat(this.contractInfo.declareDate)
        this.CSDTableData = this.contractInfo.detail
        this.totalAmount = 0
        var currency = ""
        this.CSDTableData.forEach((data) => {
          if (currency == "") {
            currency = data.currencyName
          }
          data.amount = (data.declareQuantity * data.declarePrice).toFixed(2)
          this.totalAmount += parseFloat((data.declareQuantity * data.declarePrice).toFixed(2))
        })
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2))
        this.totalAmountCn = convertCurrency(this.totalAmount)
        this.totalCurrency = "总计" + currency
      })
    }
  }
}
</script>
<style lang="scss">
#contractSelfDeclaration {
  .text-align-center {
    text-align: center;
  }
  .title {
    border-radius: 4px;
    min-height: 36px;
    font-size: 22px;
  }
  #contractSelfDeclarationTable tr td div {
    margin-top: 16px;
    border-bottom: 1px solid #bdbfc5;
  }
  #contractSelfDeclarationTable td {
    padding: 2px 0px 0px 3px;
  }
  .bottom-solid .el-col div span {
    padding: 12px 0px 0px 0px;
    display: inline-block;
    border: 1px solid;
    border-top-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-left-width: 0px;
  }
  #table-base th div {
    line-height: 16px;
    text-align: center;
  }
}
</style>
