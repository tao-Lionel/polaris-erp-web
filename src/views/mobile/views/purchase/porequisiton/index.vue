<template>
  <!-- 请购单 -->
  <div id="m_porequisition">
    <!-- 提出组件后的注释 -->
    <!-- <van-tabs
            color="#2a8efe"
            line-width="30"
            title-active-color="#2a8efe"
            title-inactive-color="rgba(51,51,51,.85)"
            sticky
            swipeable
            swipe-threshold="3"
            @change="onChange">
            <van-tab :class="{'height_add':item.count<4}"
                     v-for="(item,index) in state"
                     :key="index"
                     :title="item">
                <div slot="title">
                    <div class="top">
                        <span :class="{'tag_class':true,'color_over':status==index}">{{item.count>999?"999+":item.count}}</span>
                    </div>
                    <p class="tab_p">{{item.name}}</p>
                </div> -->
    <VantTabs :state="state" @change="onChange">
      <van-list class="list_class" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item, index) in list" :key="index" @click="showPopUp(index)">
          <div>
            <p>
              <span class="re_no">{{ item.requisitionNo }}</span>
              <span class="span_right">{{ item.createByName }}</span>
            </p>
            <p>SKU:{{ item.skuCode }}</p>
            <p>数量:{{ item.requisitionQuantity }}</p>
          </div>
        </van-cell>
      </van-list>
    </VantTabs>
    <!-- </van-tab>
        </van-tabs> -->
    <van-popup v-model="showPop" class="pop_quisition" position="bottom">
      <van-icon name="close" class="pop_close" @click="popClose"></van-icon>
      <p>{{ contentPopUp.requisitionNo }}</p>
      <ul>
        <li>请购组：{{ contentPopUp.requisitionGroupName }}</li>
        <li>请购人：{{ contentPopUp.createByName }}</li>
        <li>SKU:{{ contentPopUp.skuCode }}</li>
        <li>型号：{{ contentPopUp.modelName }}</li>
        <li>数量：{{ contentPopUp.requisitionQuantity }}</li>
        <li>单箱数：{{ contentPopUp.boxs }}</li>
        <li>规格：{{ contentPopUp.specification }}</li>
        <li>SKU名称：{{ contentPopUp.skuName }}</li>
        <li>单据时间：{{ contentPopUp.createTime ? contentPopUp.createTime.split(" ")[0] : "" }}</li>
        <li>期望交货日期：{{ contentPopUp.expectDelivery ? contentPopUp.expectDelivery.split(" ")[0] : "" }}</li>
        <!-- <li>当前可用库存:xxxx</li>
                <li>当前在库库存：xxxx</li> -->
        <li>说明：{{ contentPopUp.remarks }}</li>
      </ul>

      <!-- <div class="pop_bun pop_bun2" v-if="status === 0">
                <el-button type="primary" @click="clickPass" v-if="permissions.purchase_porequisiton_submit">提交审核</el-button>
            </div> -->
      <FootButton
        v-if="status === 0"
        :buttons="[{ value: '提交审核', isShow: permissions.purchase_porequisiton_submit }]"
        @popPass="clickPass"
      ></FootButton>

      <!-- <div class="pop_bun" v-if="status < 4 && status > 0">
                <el-button
                        v-if="(permissions.purchase_porequisiton_audit&&status===1)||(permissions.purchase_porequisiton_auditSecond&&status===2)||(permissions.purchase_porequisiton_auditThird&&status===3)"
                        type="info"
                        @click="clickRefuse">
                    审核拒绝
                </el-button>
                <el-button
                        v-if="(permissions.purchase_porequisiton_audit&&status===1)||(permissions.purchase_porequisiton_auditSecond&&status===2)||(permissions.purchase_porequisiton_auditThird&&status===3)"
                        type="primary"
                        @click="clickPass" >审核通过</el-button>
            </div> -->
      <!-- {{(permissions.purchase_porequisiton_audit&&status===1)||(permissions.purchase_porequisiton_auditSecond&&status===2)||(permissions.purchase_porequisiton_auditThird&&status===3)}} -->
      <FootButton
        v-if="status < 4 && status > 0"
        :buttons="[
          {
            value: '审核拒绝',
            isShow:
              (permissions.purchase_porequisiton_audit && status === 1) ||
              (permissions.purchase_porequisiton_auditSecond && status === 2) ||
              (permissions.purchase_porequisiton_auditThird && status === 3)
          },
          {
            value: '审核通过',
            isShow:
              (permissions.purchase_porequisiton_audit && status === 1) ||
              (permissions.purchase_porequisiton_auditSecond && status === 2) ||
              (permissions.purchase_porequisiton_auditThird && status === 3)
          }
        ]"
        @popPass="clickPass"
        @popClose="clickRefuse"
      ></FootButton>

      <!-- 注释掉请购撤销的按钮，以后可能会添加 -->
      <!--  pop_bun1 -->
      <!-- <el-button type="info">撤销请购</el-button> -->
      <!-- <el-button type="primary" @click="handleAssignBuyer" >指派采购</el-button> -->
      <!-- <div class="pop_bun pop_bun2" v-if="status === 4">
                <el-button
                        v-if="permissions.purchase_porequisiton_create_order"
                        type="primary"
                        @click="clickCreateOrder" >生成订单</el-button>
            </div> -->

      <FootButton
        v-if="status === 4"
        :buttons="[{ value: '生成订单', isShow: permissions.purchase_porequisiton_create_order }]"
        @popPass="clickCreateOrder"
      ></FootButton>

      <!-- <div class="pop_bun pop_bun2" v-if="status == 5">
                <el-button type="primary">撤销请购</el-button>
            </div> -->
    </van-popup>
    <!-- 拒绝原因 -->
    <van-dialog
      v-model="showDialog"
      title="拒绝原因"
      show-cancel-button
      className="refuse_dialog"
      :before-close="beforeClose"
    >
      <van-field
        v-model="message"
        type="textarea"
        placeholder="请输入拒绝原因，不超过100个字符"
        maxlength="100"
        rows="4"
      ></van-field>
    </van-dialog>

    <!-- 指派采购 -->
    <van-dialog
      v-model="assignBuyerDialog"
      title="指派采购"
      show-cancel-button
      className="assigned_dialog"
      :before-close="beforeCloseAssign"
    >
      <el-form ref="addOrUpdateForm" :inline="true">
        <el-form-item label="采购员：">
          <el-select v-model="purchaseUserId" size="mini" filterable placeholder="请选择">
            <el-option
              v-for="item in purchaseUserOptions"
              :key="item.userId"
              :label="item.displayname"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelAssignBuyer()">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAssignBuyer()">确 定</el-button>
      </span>
    </van-dialog>
  </div>
</template>
<script>
// import Vue from 'vue';
import { Toast } from "vant"
import { fetchList, createOrder, updateList, assignBuyer, getStatusCounts } from "@/api/purchase/porequisiton"
// import { getMemberAllByGroupId } from '@/api/admin/user'
import { mapGetters } from "vuex"
import VantTabs from "../../common/mobileVantTabs"
import FootButton from "../../common/mobileFootButton"
import { deepClone } from "@/components/avue/utils/util.js"
export default {
  data() {
    return {
      status: 0,
      list: [],
      loading: false,
      finished: false,
      showPop: false,
      showDialog: false,
      message: "",
      contentPopUp: {},
      popUpIndex: 0,
      assignBuyerDialog: false,
      purchaseUserId: "",
      purchaseUserOptions: [],
      page: {
        currentPage: 0, // 当前页数
        pageSize: 20, // 每页显示多少条
        pages: 0 //总共页数
      },
      // stateNumber:[100,200,300,400,500,600,700,800,900,1000],
      state: [
        {
          id: 0,
          name: "未处理",
          stateOper: "submit",
          count: 0
        },
        {
          id: 1,
          name: "销售一审",
          stateOper: "auditAgree",
          stateOperF: "auditRefuse",
          count: 0
        },
        {
          id: 8,
          name: "销售二审",
          stateOper: "auditAgreeSecond",
          stateOperF: "auditRefuseSecond",
          count: 0
        },
        {
          id: 9,
          name: "销售三审",
          stateOper: "auditAgreeThird",
          stateOperF: "auditRefuseThird",
          count: 0
        },
        {
          id: 2,
          name: "生成订单",
          count: 0
        },
        {
          id: 3,
          name: "订单处理",
          count: 0
        },
        {
          id: 4,
          name: "合同处理",
          count: 0
        },
        {
          id: 5,
          name: "未入库",
          count: 0
        },
        {
          id: 6,
          name: "部分入库",
          count: 0
        },
        {
          id: 7,
          name: "入库完成",
          count: 0
        }
      ]
    }
  },
  components: {
    VantTabs,
    FootButton
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.StatusCountsInit()
  },
  methods: {
    StatusCountsInit() {
      getStatusCounts().then((response) => {
        var dataList = response.data.data
        var i, j
        for (i = 0; i < this.state.length; i++) {
          this.state[i].count = 0
          for (j = 0; j < dataList.length; j++) {
            if (this.state[i].id == dataList[j].status) {
              this.state[i].count = dataList[j].count
              break
            }
          }
        }
      })
    },
    onChange(index) {
      //初始化数据
      this.status = index
      this.list = []
      this.page.currentPage = 0
      this.finished = false
      //解决往前滚动的不加载问题
      this.loading = true
      this.onLoad()
    },
    onLoad() {
      var params = {
        current: ++this.page.currentPage,
        size: this.page.pageSize,
        status: this.state[this.status].id
      }

      fetchList(params).then((response) => {
        this.list = this.list.concat(response.data.data.records)
        this.page.pages = response.data.data.pages
        this.page.currentPage = response.data.data.current
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.page.currentPage === this.page.pages || this.page.pages === 0) {
          this.finished = true
        }
      })
    },
    showPopUp(index) {
      this.contentPopUp = deepClone(this.list[index])
      this.popUpIndex = index
      this.showPop = true
    },
    popClose() {
      this.contentPopUp = {}
      this.popUpIndex = 0
      this.showPop = false
    },
    //审核拒绝
    clickRefuse() {
      this.showDialog = true
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        if (!this.message) {
          Toast("请填写拒绝原因")
          done(false)
        } else {
          //调用接口拒绝
          this.handleUpdateListCommon(
            [this.contentPopUp.requisitionNo],
            this.state[this.status].stateOperF,
            this.message,
            done
          )
        }
      } else if (action === "cancel") {
        this.message = ""
        done()
      }
    },
    handleUpdateListCommon(requisitionNo, operateCode, remark, done) {
      // console.log(requisitionNo,operateCode,remark);
      updateList(requisitionNo, operateCode, remark).then((response) => {
        if (response.data.code === 0) {
          if (done) {
            this.message = ""
            done()
          }
          this.list.splice(this.popUpIndex, 1)
          //判断是通过还是不通过
          if (done) {
            Toast("已拒绝")
          } else {
            this.status === 0 ? Toast("提交成功") : Toast("审核通过")
          }

          this.StatusCountsInit()
          this.popClose()
        } else if (response.data.code === 1) {
          if (done) {
            done(false)
          }
          Toast(response.data.msg)
        } else {
          Toast("操作失败")
        }
      })
    },
    //审核通过
    clickPass() {
      //调用接口通过
      this.handleUpdateListCommon([this.contentPopUp.requisitionNo], this.state[this.status].stateOper, "")
    },
    clickCreateOrder() {
      createOrder([this.contentPopUp.requisitionNo]).then((response) => {
        if (response.data.code === 0) {
          this.list.splice(this.popUpIndex, 1)
          Toast("生成订单成功")
          this.StatusCountsInit()
          this.popClose()
        } else if (response.data.code === 1) {
          Toast(response.data.msg)
        } else {
          Toast("操作失败")
        }
      })
    }
    //指派采购(注释掉,暂不使用)
    // handleAssignBuyer(){
    //     var query = {
    //         'groupId':this.contentPopUp.purchaseGroupId
    //     }
    //     getMemberAllByGroupId(query).then(response => {
    //         if(response.data.data && response.data.data.length > 0){
    //             this.purchaseUserOptions = response.data.data;
    //         }
    //         this.assignBuyerDialog = true
    //     })
    // },
    // beforeCloseAssign(action, done){
    //     if (action === 'confirm') {
    //         if(!this.purchaseUserId){
    //             Toast('请先选择采购员');
    //             done(false);
    //         }else{
    //              assignBuyer([this.contentPopUp.requisitionNo],this.purchaseUserId).then(response => {
    //                 if(response.data.code==0){
    //                     Toast("指派采购成功");
    //                     done();
    //                     this.assignBuyerDialog = false;
    //                     this.popClose();
    //                 }else if(response.data.code==1){
    //                     Toast(response.data.msg);
    //                     done(false);
    //                     return;
    //                 }else{
    //                     Toast("操作失败");
    //                     done(false);
    //                     return;
    //                 }
    //             });
    //         }
    //     } else if(action === 'cancel'){
    //         this.purchaseUserId='';
    //         done();
    //     }
    // }
  }
}
</script>
<style lang="scss">
@import "./index.scss";
</style>
