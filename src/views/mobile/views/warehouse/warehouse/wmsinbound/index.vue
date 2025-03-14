<template>
  <div id="m_wmsinbound">
    <!-- 入库 -->
    <VantTabs :state="state" @change="onChange">
      <van-list class="list_class" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item, index) in list" :key="index" @click="showPopUp(index)">
          <div>
            <p>质检编号：{{ item.wmsQualityControlNo }}</p>
            <p>SKU：{{ item.skuCode }}</p>
            <p>平台SKU：{{ item.platformSkuCode }}</p>
            <p>数量：{{ item.qcQuantity }}</p>
          </div>
        </van-cell>
      </van-list>
    </VantTabs>
    <!-- :class="{'pop_quisition':true,'height-90':permissions.wmsInbound_inStore}" -->
    <van-popup
      v-model="showPop"
      class="pop_quisition"
      :close-on-click-overlay="!permissions.wmsInbound_inStore"
      position="bottom"
    >
      <van-icon name="close" class="pop_close" @click="popClose"></van-icon>

      <el-form ref="form" :model="contentPopUp" v-if="showPop" :rules="rules">
        <el-form-item label="签收编号：">{{ contentPopUp.wmsQualityControlNo }}</el-form-item>
        <el-form-item label="SKU：">{{ contentPopUp.skuCode }}</el-form-item>
        <el-form-item label="良品数量：">{{ contentPopUp.qcQuantity }}</el-form-item>
        <el-form-item label="平台SKU：">{{ contentPopUp.platformSkuCode }}</el-form-item>
        <el-form-item label="站点：">{{ contentPopUp.sitName }}</el-form-item>
        <el-form-item label="店铺：">{{ contentPopUp.storeAccount }}</el-form-item>
        <el-form-item label="库位：" v-if="permissions.wmsInbound_inStore">
          <el-select v-model="locationIdSel" size="small" @change="setLocation()" placeholder="请选择">
            <el-option
              v-for="item in locationOptions"
              :key="item.stockLocationId"
              :label="item.locationCode"
              :value="item.stockLocationId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- <div class="pop_bun">
                <el-button type="info" @click="popClose">取消</el-button>
                <el-button type="primary" @click="clickPass">确定</el-button>
            </div> -->
      <FootButton v-if="permissions.wmsInbound_inStore" @popClose="popClose" @popPass="clickPass"></FootButton>
    </van-popup>
  </div>
</template>
<script>
import { fetchList, getStockLocation, getStatusCounts, inStore } from "@/api/warehouse/wmsinbound.js"
import { deepClone } from "@/components/avue/utils/util.js"
import { mapGetters } from "vuex"
import VantTabs from "../../../common/mobileVantTabs"
import FootButton from "../../../common/mobileFootButton"
import { Toast } from "vant"
export default {
  data() {
    return {
      status: 0,
      loading: false,
      finished: false,
      list: [],
      contentPopUp: {},
      popUpIndex: 0,
      showPop: false,
      page: {
        currentPage: 0,
        pageSize: 20,
        pages: 0
      },
      state: [
        {
          id: 2,
          name: "待入库",
          count: 0
        },
        {
          id: 1,
          name: "已入库",
          count: 0
        }
      ],
      locationIdSel: "",
      locationId: "",
      locationOptions: []
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
    setLocation() {
      this.locationId = this.locationIdSel
    },
    showPopUp(index) {
      if (this.status !== 0) {
        return
      }
      //获取库位信息
      var params = {
        warehouseId: this.list[index].warehouseId,
        locationSkuId: this.list[index].skuId
      }
      getStockLocation(params).then((response) => {
        if (response.data.code == 0) {
          if (response.data.data.locationList != null || response.data.data.locationList.length > 0) {
            this.locationOptions = response.data.data.locationList
            if (!this.isNulls(response.data.data.ensureLactionId)) {
              this.locationId = response.data.data.ensureLactionId
              this.locationIdSel = response.data.data.ensureLactionCode
            }
          }
        }
      })

      this.contentPopUp = deepClone(this.list[index])
      this.popUpIndex = index
      this.showPop = true
    },
    popClose() {
      this.contentPopUp = {}
      this.popUpIndex = 0
      this.locationIdSel = ""
      this.locationId = ""
      this.locationOptions = []
      this.showPop = false
    },
    clickPass() {
      //确定后的数据流向
      if (this.isNulls(this.locationId)) {
        Toast("请选择库位信息!")
        return
      }
      var obj = { wmsQualityControlNos: this.contentPopUp.wmsQualityControlNo, locationId: this.locationId }
      inStore(obj).then((response) => {
        if (response.data.code == 0) {
          var map = response.data.data
          if (map.success.length != 0) {
            Toast("入库成功")
            this.list.splice(this.popUpIndex, 1)
            this.StatusCountsInit()
            this.popClose()
            return
          }
          if (map.error.length != 0) {
            Toast("入库失败\n" + map.error[0])
          }
        } else if (data.code == 1 && data.msg) {
          Toast(data.msg)
        } else {
          Toast("入库操作失败!")
        }
      })
    },
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss">
@import "../../../../style/base";
#m_wmsinbound {
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
  .pop_quisition {
    border-radius: pxToRem(40) pxToRem(40) 0 0;
    color: rgba(51, 51, 51, 0.85);
    font-size: pxToRem(30);
    padding: pxToRem(40);
    box-sizing: border-box;

    .el-form {
      margin-top: pxToRem(40);
      margin-bottom: pxToRem(80);
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

    .pop_close {
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
    // .pop_bun {
    // margin-top: pxToRem(40);
    // button {
    //     width: 40%;
    //     height: pxToRem(90);
    //     margin: 0 5%;
    //     border-radius: pxToRem(10);
    // }
    // }
  }
  // .height-90{
  //     max-height: 90%;
  //     .el-form{
  //         height:80%;
  //     }
  // }
}
</style>
