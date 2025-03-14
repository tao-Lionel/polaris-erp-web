<template>
  <div v-loading.fullscreen.lock="loading" element-loading-text="正在处理中" id="sign">
    <basic-container>
      <div>
        <el-row>
          <el-col :span="24">
            <div class="float-left" v-if="isSearch" style="margin-right: 30px">
              <!-- <el-form ref="searchForm" :model="search" status-icon :rules="searchFormRules"> -->
              <el-form ref="searchForm" @submit.prevent.native :model="search" status-icon :rules="searchFormRules">
                <!-- @keyup.prevent.native="varifiModel" -->
                <el-form-item prop="deliveryNo">
                  <el-input
                    ref="deliveryNo"
                    v-model="search.deliveryNo"
                    clearable
                    size="small"
                    maxlength="200"
                    style="display: inline-block"
                    placeholder="请输入送货单号检索/或扫码检索"
                  ></el-input>
                </el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  native-type="submit"
                  @click="searchDeliveryInfo"
                  v-if="isSearch"
                  style="margin: 0 20px"
                  >搜 索</el-button
                >

                <el-button
                  type="primary"
                  size="small"
                  @click="sign"
                  :disabled="!isSign"
                  v-if="permissions.warehouse_wmssign_sign"
                  >签 收</el-button
                >
              </el-form>
            </div>
            <!-- <div class="float-left" style="margin-top: 3px;">
              <el-button
                type="primary"
                size="small"
                @click="searchDeliveryInfo"
                v-if="permissions.purchase_porequisiton_create && isSearch"
                style="margin-right: 20px;"
              >搜 索</el-button>
              <el-button
                type="primary"
                size="small"
                @click="sign"
                :disabled="!isSign"
                v-if="permissions.purchase_porequisiton_create"
              >签 收</el-button>
            </div>
            <div style="clear:both"></div> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="float_right font-size-20" v-if="permissions.warehouse_wmssign_list">
              <a style="font-size: 20px" @click="openListPage()">签收列表</a>
            </div>
            <div class="float_right font-size-20" v-if="!permissions.warehouse_wmssign_list">
              <a style="font-size: 20px"></a>
            </div>
          </el-col>
        </el-row>
        <el-row style="border: 1px solid #dcdfe6; min-height: 500px; padding: 25px">
          <el-col :span="24" v-if="show">
            <div class="total-box">
              <strong>总箱数：{{ wmsSignVo.boxCount }}</strong>
            </div>
            <component :is="activeComponent" :gycode="gycode"></component>
          </el-col>
        </el-row>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getByDeliveryNo, addObj } from "@/api/warehouse/wmssign"
import basicInfoIndex from "@/views/purchase/delivery/printContent"
import { mapGetters } from "vuex"
import { preventShake } from "@/util/tool"
export default {
  name: "createPorequisiton",
  data() {
    //验证规则
    var validateChange = (rule, value, callback) => {
      // debugger
      const reg_request = /SH+[0-9]{11}$/gi
      const regResult = reg_request.test(value)
      if (!regResult) {
        callback(new Error("送货单格式不正确"))
      }

      if (this.show && this.gycode && value != this.gycode) {
        this.show = false
        this.isSign = true
        this.gycode = ""
        this.wmsSignVo = {}
        callback()
      } else {
        callback()
      }
    }
    return {
      gycode: "",
      loading: false,
      show: false,
      isSearch: true,
      isSign: true,
      activeComponent: basicInfoIndex,
      search: {
        deliveryNo: ""
      },
      searchFormRules: {
        deliveryNo: [
          { required: true, message: "请输入送货单号", trigger: "blur" },
          { required: true, validator: validateChange, trigger: "blur" }
        ]
      },
      wmsSignVo: {},
      boxCount: ""
    }
  },
  created() {
    if (this.$route.query.deliveryNo) {
      this.gycode = this.$route.query.deliveryNo
      this.isSearch = false
      //this.queryDeliveryInfo();
    }
  },
  activated: function () {
    this.$nextTick(function () {
      this.$refs.deliveryNo.focus()
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /*
    varifiModel() {
      let _this = this;
      preventShake.preventShake(function(bool) {
        if (bool) {
          if (_this.search.deliveryNo) {
            // 校验错误
            const reg = new RegExp("[0-9a-zA-Z]", "ig");
            let str = _this.search.deliveryNo.match(reg);
            _this.search.deliveryNo = str ? str.join("") : "";

            // 单号 自动请求  //SH2019032900010     SH2019032900009
            const reg_request = /SH+[0-9]{13}$/gi;

            if (reg_request.test(_this.search.deliveryNo)) {
              //单号正确
              if (
                _this.permissions.purchase_porequisiton_create &&
                _this.isSearch
              ) {
                str = _this.search.deliveryNo.match(reg_request);
                _this.search.deliveryNo = str[0];

                _this.searchDeliveryInfo(); //自动请求
              }
            }
          }
        }
      }, 200);
    },

    */
    /**
     * 加载页面
     */
    queryDeliveryInfo: function () {
      var query = {
        deliveryNo: this.gycode
      }
      getByDeliveryNo(query).then((response) => {
        if (response.data.code == 0) {
          if (response.data.data) {
            var entity = response.data.data
            if (entity.status == 0) {
              this.isSign = true
            } else if (entity.status == 1) {
              this.isSign = false
              if (this.isSearch) {
                //this.$message.warning("该送货单已经签收");
                this.$notify({
                  title: "温馨提示",
                  message: "该送货单已被签收",
                  type: "success"
                })
              }
            }
            this.wmsSignVo = entity
            this.show = true
          } else {
            this.$message.warning("输入送货单不存在或未处理")
            return
          }
        }
      })
    },
    /**
     * 搜索
     */
    searchDeliveryInfo: function () {
      if (this.search.deliveryNo) {
        this.$set(this.search, "deliveryNo", this.search.deliveryNo.toUpperCase())
        const reg = new RegExp("[0-9a-zA-Z]", "ig")
        let str = this.search.deliveryNo.match(reg)
        this.search.deliveryNo = str ? str.join("") : ""

        const reg_request = /SH+[0-9]{11}$/gi
        if (reg_request.test(this.search.deliveryNo)) {
          //单号正确
          if (this.permissions.purchase_porequisiton_create && this.isSearch) {
            str = this.search.deliveryNo.match(reg_request)
            this.search.deliveryNo = str[0]
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "送货单号格式不正确"
          })
          this.search.deliveryNo = ""
        }
      }

      this.$nextTick(function () {
        this.loading = true
        this.$refs["searchForm"].validate((valid) => {
          this.loading = false
          if (valid) {
            this.gycode = this.search.deliveryNo.trim()
            this.queryDeliveryInfo()
          } else {
            console.log("error submit!!")
            return false
          }
        })
      })
      // this.$refs["searchForm"].validate(valid => {
      //   if (valid) {
      //     this.gycode = this.search.deliveryNo.trim();
      //     this.queryDeliveryInfo();
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    //签收
    sign: function () {
      var flag = true
      if (this.isSearch) {
        this.$refs["searchForm"].validate((valid) => {
          if (valid) {
            if (!this.wmsSignVo) {
              flag = false
              this.$message.error("请先搜索送货单信息")
              return false
            }
            if (this.gycode != this.search.deliveryNo.trim()) {
              flag = false
              this.$message.error("请先搜索送货单信息")
              return false
            }
          } else {
            flag = false
            return false
          }
        })
      }
      if (!flag) {
        return
      }

      var wmsSign = {
        deliveryNo: this.gycode
      }
      this.loading = true
      addObj(wmsSign).then((response) => {
        this.loading = false
        if (response.data.code == 0) {
          this.isSign = false
          this.$notify({
            title: "成功",
            message: "签收成功",
            type: "success",
            duration: 2000
          })
          if (this.$parent.$refs.tagNavigate) {
            this.$parent.$refs.tagNavigate.clearTagCache("/wmssign/list")
          }
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    /**
     * 打开签收页面
     */
    openListPage: function () {
      this.$router.push({
        path: "/wmssign/list"
      })
    }
  }
}
</script>
<style lang="scss">
@import "./index.scss";
</style>
