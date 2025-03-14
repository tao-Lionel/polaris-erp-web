<template>
  <!-- 质检 -->
  <div id="m_wmsqualitycontrol">
    <VantTabs :state="state" swipeThreshold="4" @change="onChange">
      <van-list class="list_class" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item, index) in list" :key="index" @click="showPopUp(index)">
          <div>
            <!-- <p>
                            <span class="re_no">{{item.requisitionNo}}</span>
                            <span class="span_right">{{item.createByName}}</span>
                        </p>
                        <p>SKU:{{item.skuCode}}</p>
            <p>数量:{{item.requisitionQuantity}}</p>-->
            <p v-if="status === 0">签收编号：{{ item.wmsSignNo }}</p>
            <p v-else>质检编号：{{ item.wmsQualityControlNo }}</p>
            <p>SKU：{{ item.skuCode }}</p>
            <p>平台SKU：{{ item.platformSkuCode }}</p>
            <p v-if="status === 0">数量：{{ item.deliveryQuantity }}</p>
            <p v-if="status === 1 || status === 2">数量：{{ item.qcStandardQuantity }}</p>
            <p v-if="status === 3">数量：{{ item.qcUnstandardquantity }}</p>
            <!-- <p>箱数：{{item.boxCount}}</p> -->
          </div>
        </van-cell>
      </van-list>
    </VantTabs>
    <van-popup
      v-model="showPop"
      class="pop-quisition"
      :close-on-click-overlay="!permissions.warehouse_wmsqualitycontrol_quality"
      position="bottom"
    >
      <van-icon name="close" class="pop-close" @click="popClose"></van-icon>

      <el-form v-if="showPop" class="over-form">
        <el-form-item label="签收编号：">{{ contentPopUp.wmsSignNo }}</el-form-item>
        <el-form-item label="SKU：">{{ contentPopUp.skuCode }}</el-form-item>
        <el-form-item label="签收数量：">{{ contentPopUp.deliveryQuantity }}</el-form-item>
        <el-form-item label="FNSKU：">{{ contentPopUp.platformSkuCode }}</el-form-item>
        <el-form-item label="站点：">{{ contentPopUp.sitName }}</el-form-item>
        <el-form-item label="店铺：">{{ contentPopUp.storeAccount }}</el-form-item>

        <el-form
          ref="form"
          :model="contentPopUpForm"
          :rules="rules"
          v-if="permissions.warehouse_wmsqualitycontrol_quality"
        >
          <el-form-item label="良品数量：" prop="standardQuantity">
            <el-input size="mini" v-model="contentPopUpForm.standardQuantity"></el-input>
          </el-form-item>
          <el-form-item label="不良数量：" v-if="permissions.warehouse_wmsqualitycontrol_quality">
            {{ contentPopUpForm.unstandardQuantity }}
          </el-form-item>
          <el-form-item label="原因：" prop="remarks" v-if="permissions.warehouse_wmsqualitycontrol_quality">
            <el-input
              size="mini"
              type="textarea"
              maxlength="20"
              placeholder="限制20字符以内"
              v-model="contentPopUpForm.remarks"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <!-- 提出组件注销 -->
      <!-- <div class="pop-bun">
        <el-button type="info" @click="popClose">取消</el-button>
        <el-button type="primary" @click="clickPass">确定</el-button>
      </div> -->
      <FootButton
        v-if="permissions.warehouse_wmsqualitycontrol_quality"
        @popClose="popClose"
        @popPass="clickPass"
      ></FootButton>
    </van-popup>
  </div>
</template>
<script>
import { fetchList, getStatusCounts, changeStatus } from "@/api/warehouse/wmsqualitycontrol"
import { deepClone } from "@/components/avue/utils/util.js"
import { Toast } from "vant"
import { mapGetters } from "vuex"
import VantTabs from "../../common/mobileVantTabs"
import FootButton from "../../common/mobileFootButton"
export default {
  data() {
    let validateNumber = (rule, value, callback) => {
      let reg = /^(([+]?[0-9]+)|[-]?0)$/
      let num = value * 1
      if (!reg.test(value)) {
        callback(new Error("请输入非负整数"))
      } else if (num > this.contentPopUp.deliveryQuantity) {
        callback(new Error("需小于签收数量"))
      } else {
        this.contentPopUpForm.unstandardQuantity = this.contentPopUp.deliveryQuantity - num
        callback()
      }
    }
    let validateMark = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空"))
      } else {
        callback()
      }
    }
    return {
      status: 0,
      loading: false,
      finished: false,
      list: [],
      contentPopUp: {},
      contentPopUpForm: {
        standardQuantity: "",
        remarks: "",
        unstandardQuantity: ""
      },
      popUpIndex: 0,
      showPop: false,
      page: {
        currentPage: 0, // 当前页数
        pageSize: 20, // 每页显示多少条
        pages: 0 //总共页数
      },
      state: [
        {
          id: 0,
          name: "待检",
          count: 0
        },
        {
          id: 1,
          name: "合格",
          count: 0
        },
        {
          id: 3,
          name: "部分合格",
          count: 0
        },
        {
          id: 2,
          name: "不合格",
          count: 0
        }
      ],
      rules: {
        standardQuantity: [{ validator: validateNumber, trigger: "blur" }],
        remarks: [{ validator: validateMark, trigger: "blur" }]
      }
    }
  },
  components: {
    VantTabs,
    FootButton
  },
  created() {
    this.StatusCountsInit()
  },
  computed: {
    ...mapGetters(["permissions"])
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
      if (this.status !== 0) {
        return
      }
      this.contentPopUp = deepClone(this.list[index])

      this.popUpIndex = index
      this.showPop = true
    },
    popClose() {
      this.contentPopUp = {}
      this.contentPopUpForm = {
        standardQuantity: "",
        remarks: "",
        unstandardQuantity: ""
      }
      this.popUpIndex = 0
      this.showPop = false
    },
    clickPass() {
      // 检测
      if (!this.contentPopUpForm.standardQuantity) {
        Toast("良品数量不能为空，请修改")
        return
      }
      if (
        !/^(([+]?[0-9]+)|[-]?0)$/.test(this.contentPopUpForm.standardQuantity) ||
        this.contentPopUpForm.standardQuantity * 1 > this.contentPopUp.deliveryQuantity
      ) {
        Toast("良品数量有误，请修改")
        return
      }
      if (this.contentPopUpForm.unstandardQuantity && !this.contentPopUpForm.remarks) {
        Toast("不良原因不能为空")
        return
      }

      //通过验证，进行下一步操作
      changeStatus({
        deliveryDetailIds: this.contentPopUp.deliveryDetailId,
        standardQuantity: this.contentPopUpForm.standardQuantity,
        remarks: this.contentPopUpForm.remarks
      }).then(({ data }) => {
        if (data.code == 0) {
          this.list.splice(this.popUpIndex, 1)
          Toast("质检操作成功")
          this.StatusCountsInit()
          this.popClose()
        } else if (data.code == 1 && data.msg) {
          Toast(data.msg)
        } else {
          Toast("质检操作失败")
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/base";
#m_wmsqualitycontrol {
  //列表样式
  .list_class {
    background-color: #e5e8eb;
    padding: pxToRem(23);
    .van-cell {
      margin-bottom: pxToRem(23);
      border-radius: pxToRem(10);
      p {
        color: rgba(51, 51, 51, 0.85);
        font-size: pxToRem(30);
        line-height: pxToRem(56);
      }
      //   .re_no {
      //     font-size: pxToRem(34);
      //     font-weight: bold;
      //     color: #333;
      //     line-height: pxToRem(80);
      //   }
      //   .span_right {
      //     float: right;
      //     margin-right: pxToRem(10);
      //   }
    }
  }
  //弹框样式
  .pop-quisition {
    border-radius: pxToRem(40) pxToRem(40) 0 0;
    color: rgba(51, 51, 51, 0.85);
    font-size: pxToRem(30);
    padding: pxToRem(40);
    box-sizing: border-box;

    .el-form {
      .el-form-item__label {
        line-height: pxToRem(70);
        width: pxToRem(200);
      }
      .el-form-item__content {
        line-height: pxToRem(70);
        padding-left: pxToRem(200);
      }
      .el-form-item__error {
        margin-left: pxToRem(200);
        padding-top: 0;
      }
      .el-textarea__inner {
        //   为了保证与输入框内容对齐
        padding: 5px 8px;
      }
    }
    .over-form {
      margin-top: pxToRem(40);
      margin-bottom: pxToRem(80);
    }
    .pop-close {
      font-size: pxToRem(40);
      float: right;
    }
    p {
      font-size: pxToRem(34);
      color: #333;
      font-weight: bold;
      line-height: pxToRem(100);
    }
    li {
      line-height: pxToRem(70);
      word-break: break-all;
    }
    // .pop-bun {
    //   margin-top: pxToRem(40);
    //   button {
    //     width: 40%;
    //     height: pxToRem(90);
    //     margin: 0 5%;
    //     border-radius: pxToRem(10);
    //   }
    // }
  }
}
</style>
