<template>
  <div id="taxContract">
    <div class="down-button">
      <el-button size="small" type="primary" @click="downWord()">下载</el-button>
      <!-- <el-button size="small" type="primary" @click="contractPrint()">打印</el-button> -->
    </div>

    <div class="non-tax-w">
      <div class="contract-common" id="printPage">
        <p class="title">购货合同</p>
        <div class="border-box">
          <!--  class="color-red" -->
          <p class="box-title">需货方（以下简称<span>甲方</span>）</p>
          <p>
            需货方：
            <span>{{ partyA }}</span>
          </p>
          <p>
            合同编号：
            <span>{{ contractNo }}</span>
          </p>

          <p>
            地址:
            <span>{{ addressA }}</span>
          </p>
          <p>
            签订地点：
            <span>深圳</span>
          </p>
          <p>
            签订日期：
            <span>{{ signDate }}</span>
          </p>
        </div>

        <div class="border-box" style="margin-top: 16px">
          <!--  class="color-red" -->
          <p class="box-title">供货方（以下简称<span>乙方</span>）</p>
          <p>
            供货方:
            <span>{{ partyB }}</span>
          </p>
          <p>
            地址:
            <span>{{ addressB }}</span>
          </p>
        </div>
        <div class="block">
          <p class="box-title">为保护供需双方的合法权益，根据《中华人民共和国合同法》，经协商一致签订本合同：</p>
          <p class="box-title">一、货物名称、规格型号、计量单位、数量、单价、金额、供货时间</p>
          <table class="table-center">
            <thead>
              <tr class="table-head">
                <td width="12%">采购单号</td>
                <td width="12%">交货日期</td>
                <td width="10%">SKU</td>
                <td width="12%">货物名称</td>
                <td width="12%">型号</td>
                <td width="10%">数量</td>
                <td width="10%">单位</td>
                <td width="12%">含税单价</td>
                <td width="12%">金额</td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="goods.length == 0">
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr v-for="(item, index) in goods" :key="index">
                <td>{{ item.purchaseOrderNo }}</td>
                <td>{{ item.planDeliveryStr }}</td>
                <td>{{ item.skuCode }}</td>
                <td>{{ item.skuName }}</td>
                <td>{{ item.modelName }}</td>
                <td>{{ item.purchaseQuantity }}</td>
                <td>{{ item.unitName }}</td>
                <td>{{ myFixed(item.price) }}</td>
                <td>{{ myFixed(item.money) }}</td>
              </tr>
              <tr>
                <td colspan="8" class="text-left">合计（大写）: {{ allMoneyCN }}({{ currencyName }})</td>
                <td>{{ currencySymbol }}{{ myFixed(allMoney) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 重复信息格式 -->
        <!-- 
                <div class="block">
                    <p class="blod"></p>
                    <ul>
                    
                    </ul>
                    <p></p>
                </div> 
        -->
        <div class="block">
          <p class="box-title">二、质量要求</p>
          <ul>
            <li>1．本合同货物的技术标准、质量及包装要求等应以双方确认样板为标准要求为准。</li>
            <li>
              2．与本合同货物相关的配件及随机备品，无论是免费的还是需要另行付费的，均属于货物的一部分，其质量标准、包装、交货等要求与货物要求相同，并应以甲乙双方确认样板为标准。
            </li>
            <li>3．乙方应附随货物书面提供出厂合格证，质量检验报告，合同编号等信息。</li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">三、包装要求</p>
          <ul>
            <li>
              1．乙方应根据货物的规格、重量、精密程度选用适宜的包装物、填充物，包装物应该坚固、结实、整洁、美观，并符合法律、行业和甲方标准。
            </li>
            <li>
              2．任何货物均要求有木、纸、塑料、泡末类包装物，其上要有标签；精密贵重产品要有相应防护措施，以防造成货物外观磨损及减小搬运震动伤害。
            </li>
            <li>3．乙方尽最大限度使用环保材料，逐渐减少不可降解材料的使用量；尽量循环使用包装物。</li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">四、交货地点</p>
          <p>乙方负责将货物运至甲方指定仓库或港口，运费由 乙 方负责。</p>
        </div>

        <div class="block">
          <p class="box-title">五、所有权及风险转移</p>
          <ul>
            <li>
              1．除非另有书面协议，货物的所有权和风险在甲方指定的地点被交付后即发生转移（该交付必须经过甲方书面确认），但转移不影响乙方违约或不履约时甲方的权利和应获得的补偿。
            </li>
            <li>
              2．甲方在验收过程中及合同规定的14个月保质期内发现乙方货物不符合双方确认的封样标准时，因产品本身品质问题引起的退货超出5%的部分，乙方给予甲方更换新机处理。
            </li>
            <li>
              3．因货物不符合合同规定，且甲方选择退货的，自甲方书面通知乙方退货之时，无论通知发出之时货物存放在何处，货物的所有权及风险均转移至乙方，但不影响甲方可能享有的对货物的留置权。
            </li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">六、产品质量验收</p>
          <ul>
            <li>
              1．甲方有权在任何时间、任何地点检验、测试、监督乙方履行本协议项下的职责。甲方也有权派遣检验员到乙方的场所检验产品的生产、包装、运输。验收不合格的，甲方有权拒绝支付货款并要求乙方赔偿甲方全部损失，损失标准由甲乙双方协商确认。
            </li>
            <li>
              2．甲方按照甲乙双方确认样板为标准，在收到产品时进行外包装检验，对箱内产品的数量进行抽验和对质量进行抽查验证。
            </li>
            <li>3．任何验收均不得视为对乙方承担产品质量保证责任及履行本协议项下其他义务的豁免。</li>
            <li>
              4.如果任何被检验或测试的产品不符合本协议第二条约定的甲方的技术规范及要求的，甲方有权拒绝接受该批产品。乙方应免费更换被拒绝接受的产品或采取一切必要的补救措施以达到甲方的技术规范及要求。并赔偿甲方因此造成的损失。
            </li>
            <li>
              5.乙方在交付产品之前应对产品的质量、规格、性能、数量、重量进行准确和全面的检验，并出具质量合格证，证明产品符合本协议的约定。
            </li>
            <li>6.甲方有权保留在使用产品时发现乙方交货产品的质量与协议约定标准不符情况下的追索权。</li>
            <li>
              7.产品出现亚马逊条码贴错，漏贴，以及漏放错发配件等，乙方按造成损失1:100赔偿甲方，甲方有权保留对此造成连带损失追索的权利
            </li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">七、异议及缺陷处理</p>
          <ul>
            <li>1．甲方发现乙方提供的产品不符合封样标准，应以书面形式向乙方提出异议和处理意见。</li>
            <li>
              2．对产品的内在不符合封样标准的，甲方应在交货之日起&nbsp;14&nbsp;个月保修期内以书面形式向乙方提出异议；
            </li>
            <li>
              3．乙方接到甲方书面异议后，应在三个工作日内给予书面回复；否则，即视为乙方接受甲方提出的异议和处理意见；该意见对双方具有约束力。
            </li>
            <li>
              4．乙方应当按甲方指示妥善处理。如果乙方未能在甲方确定的时间内完成处理工作导致延迟交货的，应承担违约责任，并赔偿甲方因此造成的损失。
            </li>
            <li>5．处理及消除产品缺陷的费用由乙方承担。</li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">八、付款时间及方式：</p>
          <ul>
            <li>1．货款应在乙方工厂验货合格之后，甲方一次性付完余款，货物由乙方送到甲方公司。</li>
            <li>2．付款条件:{{ settleaccountName }}，含13%增值税。</li>
            <li>3．付款方式：银行转账</li>
            <li>4．甲方的付款行为不得视为对乙方承担产品质量保证责任及履行本协议项下其他义务的豁免。</li>
            <li>
              5.为保证双方利益，在合作期间，在同等等级报价必须是市场最低价格。如价格幅度波动比较大乙方第一时间通知甲方。乙方以当次行情报价，甲方下达购货合同之后，则以双方确认购货合同价格为基准。
            </li>
            <li>
              6.合作期间，如乙方与甲方员工有回扣或其它形式贿赂行为，损害甲方利益或风险，一经核实，将终止支付一年内所有货款；如有甲方员工提出回扣或其它不正当要求时，请乙方提供有力证据，甲方将对其进行开除处理，情节严重者送司法机关依法处理。
            </li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">九、甲乙双方的责任</p>
          <p>（一）甲方责任</p>
          <ul>
            <li>1．甲方应向乙方提供完整并且正确的产品名称、规格型号、订货数量等信息。</li>
            <li>2．甲方应在合同规定的期限内向乙方支付货款。</li>
            <li>
              3．外观专利风险：乙方所供货商品，不存在外观及适用性侵权，如甲方在销售乙方所供商品时中发生侵权投诉，相应责任完全由乙方承担，给甲方造成损失的，所有损失均由乙方权全承担。
            </li>
          </ul>
          <p>（二）乙方责任</p>
          <ul>
            <li>1．乙方应按照本合同及订单约定的交货方式、交货时间、数量、质量、包装等向甲方交付货物；，&nbsp;</li>
            <li>
              2．在货物的保质期内向甲方承担免费维修、人为损坏除外。如果自生产日期超过14个月，主板、镜头、电机叁大件为人为损坏或者无法使用，翻新材料费用由甲方承担。
            </li>
          </ul>
        </div>

        <div class="block">
          <p class="box-title">十、违约责任</p>
          <ul>
            <li>1．甲、乙双方按合同规定履行权利及义务，若违反合同规定，违约方应承担违约责任。</li>
            <li>2．甲方逾期付款的，应每日按订货总额的千分之五支付违约赔偿金给乙方。</li>
            <li>3．乙方违反本合同或订单中的任何条款、义务、保证的，甲方有权采取以下任何一项或多项补救措施：</li>
            <li>
              <ul>
                <li>
                  3.1．由于乙方原因不能按规定的时间交货，每延迟交货一天，乙方应向甲方合同总金额的5&permil;作为延迟履行金，并赔偿甲方因此造成的损失。
                </li>
                <li>
                  3.2．乙方延迟交货&nbsp;15&nbsp;日以上的，甲方有权单方解除本合同。乙方应向甲方支付合同总金额的&nbsp;10%作为违约金；
                </li>
                <li>
                  3.3．返修或退货：乙方产品不符合封样标准，甲方有权选择要求乙方返修或退货，乙方应在收到甲方书面通知&nbsp;7天内按照甲方要求妥善处理。由此给甲方造成损失的乙方应予赔偿，赔偿包括返修货退货而产生物流费用。（仅限深圳）
                </li>
                <li>
                  3.4．保密协议：甲方在乙方所下订单，乙方必须保密(包括产品名称，单价，数量，包装等）如有泄露甲方有权终止订单。
                </li>
              </ul>
            </li>
          </ul>
          <p></p>
        </div>

        <div class="block">
          <p class="box-title">十一、不可抗力</p>
          <p>
            由于地震、台风、水灾、火灾、战争以及其它不能预见并且对其发生及后果不能防止或避免的不可抗力因素，致使直接影响合同的履行或者不能按约定的条件履行时，遇有上述不可抗力因素的乙方，应立即将情况以书面形式通知甲方，并在十五日内提供详细说明及证明合同不能履行、或者部分不能履行、或者需要延期履行的有效文件，此项证明文件应由事件发生地的公证机构出具。根据事件对履行合同的影响程度，由甲乙双方协商决定是否解除合同，或者部分履行合同，或者延期履行合同。
          </p>
        </div>

        <div class="block">
          <p class="box-title">十二、争议解决方式</p>
          <p>本合同发生纠纷，双方应及时协商解决，双方经协商无法达成一致意见的，任何一方可向甲方所在地人民法院起诉。</p>
        </div>

        <div class="block">
          <p class="box-title">十三、其他</p>
          <ul>
            <li>1．本合同适用中华人民共和国法律及法规。</li>
            <li>2．本合同中任何条款应违反法律强制性规定无效的，不影响合同中其他条款的法律效力。</li>
            <li>3．本合同一式贰份，双方各执壹份，经双方有权代表签字并加盖公章或合同专用章后生效。</li>
          </ul>
        </div>

        <table class="block">
          <tbody>
            <tr class="table-head table-center">
              <td width="50%">
                <span class="blod">甲方</span>
              </td>
              <td width="50%">
                <span class="blod">乙方</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>单位名称：</span>
                <span>{{ partyA }}</span>
              </td>
              <td>
                <span>单位名称：</span>
                <span>{{ partyB }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>地址：</span>
                <span>{{ addressA }}</span>
              </td>
              <td>
                <span>地址：</span>
                <span>{{ addressB }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>审批代表（签字）：</span>
                <span>{{ legalA }}</span>
              </td>
              <td>
                <span>法人代表（签字）：</span>
                <span>{{ legalB }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>联系电话：</span>
                <span>{{ phoneA }}</span>
              </td>
              <td>
                <span>联系电话：</span>
                <span>{{ phoneB }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>开户行：</span>
                <span>{{ bankA }}</span>
              </td>
              <td>
                <span>开户行：</span>
                <span>{{ bankB }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>账号：</span>
                <span>{{ accountA }}</span>
              </td>
              <td>
                <span>账号：</span>
                <span>{{ accountB }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { showContract, downloadContract } from "@/api/purchase/contract/pocontractTemplate.js"
import { getTokenUrlFile } from "@/util/auth"
export default {
  data() {
    return {
      partyA: "广州市甜秘密创新科技有限公司",
      contractNo: this.$route.query.paramcontractNo,
      addressA: "广州市白云区黄边北路国际设计大厦南塔26-27楼",
      signDate: "",
      partyB: "",
      addressB: "",
      goods: [],
      legalA: "",
      phoneA: "0755-3689 4114",
      bankA: "上海浦东发展银行股份有限公司深圳横岗支行",
      accountA: "79200154740005190",
      legalB: "",
      phoneB: "",
      bankB: "",
      accountB: "",
      allMoney: "",
      allMoneyCN: "",
      currencyName: "",
      currencySymbol: "",
      downloadUrl: "",
      settleaccountName: ""
    }
  },
  mounted: function () {
    this.getData()
    // this. downWord();
  },
  methods: {
    getData() {
      // this.contractNo = "F83010F";
      showContract(this.contractNo).then((response) => {
        if (response.data.code == 0) {
          var list = response.data.data
          var contractData = list[0]
          console.log(contractData)
          //法人主体
          this.partyA = contractData.corporationName
          //法人地址
          this.addressA = contractData.corporationAddress
          //法人电话
          this.phoneA = contractData.corporationTelephone
          //法人开户行
          this.bankA = contractData.corporationTeBankOfDeposit
          //法人账号
          this.accountA = contractData.corporationbankAccount
          //签订日期
          this.signDate = contractData.contractDateStr
          //供应商
          this.partyB = contractData.supplierName
          //供应商地址
          this.addressB = contractData.postalAdress
          //合计金额
          this.allMoney = contractData.allMoney
          //合计大写
          this.allMoneyCN = contractData.allMoneyCN
          //币别名称
          this.currencyName = contractData.currencyName
          //币别符号
          this.currencySymbol = contractData.currencySymbol
          //结算方式
          this.settleaccountName = contractData.settleaccountName
          //开户行
          this.bankB = contractData.openingBank
          //账号
          this.accountB = contractData.accountNo
          //遍历详情信息
          this.goods = list
        } else {
          his.$message.error("合同信息获取失败!")
        }
      })
    },

    downWord() {
      this.downloadUrl = getTokenUrlFile("/api/purchase/pocontract/download/" + this.contractNo)
      window.location.href = this.downloadUrl
    },
    contractPrint() {
      this.$print(window.document.getElementById("printPage"))
    },
    myFixed(value) {
      // debugger;
      if (this.isNulls(value)) {
        return
      }
      return (parseFloat(value) + 0.0).toFixed(2)
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
<style style lang="scss">
@import "./index.scss";

#taxContract {
  .down-button {
    margin-left: 30px;
  }

  .non-tax-w {
    width: 75%;
    margin: 20px auto;
    min-width: 210mm;
  }

  @media screen and (max-width: 1440px) {
    .non-tax-w {
      width: 90%;
    }
  }
}
</style>
