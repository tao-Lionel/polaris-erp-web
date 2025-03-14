<template>
  <div class="bseTransportCarrierDetail">
    <basic-container>
      <!--头部以及标题信息信息-->
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '物流商详情',
          list: []
        }"
      >
      </detail-template>

      <div>
        <el-form label-width="70px" class="demo-form-inline">
          <detail-wrapper :options="{ title: '物流商信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="物流商编码" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.transportCarrierCode"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物流商名称" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.carrierName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系人" label-width="70px">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.contactName"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系方式" label-width="70px">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.contactNo"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="状态">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.approveStatusStr"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="启用/禁用" label-width="90px">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.delFlagStatus"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.createUser"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.createTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="更新人">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.updateUser"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="更新时间">
                  <el-input
                    class="el-input--small"
                    v-model="baseMsg.updateTime"
                    placeholder="暂无数据"
                    :disabled="true"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--平台物流映射模块-->
      <!-- <div>
        <el-form class="demo-form-inline">
          <detail-wrapper :options="{ title: '平台物流映射' }">
            <el-form-item v-for="(item, index) in basePlatformMsg" :key="index">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="平 台" label-width="70px">
                    <el-input class="el-input--small" v-model="item.platformTypeName" placeholder="暂无数据" :disabled="true"
                      size="mini"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="销售站点" label-width="90px">
                    <el-input class="el-input--small" v-model="item.sitName" placeholder="暂无数据" :disabled="true"
                      size="mini"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="平台物流商编码" label-width="120px">
                    <el-input class="el-input--small" v-model="item.bsePlatformTransportCarrierCode" placeholder="暂无数据"
                      :disabled="true" size="mini"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="平台物流商名称" label-width="120px">
                    <el-input class="el-input--small" v-model="item.bsePlatformTransportCarrierName" placeholder="暂无数据"
                      :disabled="true" size="mini"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </detail-wrapper>
        </el-form>
      </div> -->

      <!--仓库物流映射模块-->
      <div v-if="false">
        <el-form class="demo-form-inline">
          <detail-wrapper :options="{ title: '仓库物流渠道' }">
            <el-form-item v-for="(item, index) in baseOverseaMsg" :key="index">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="海外仓服务商" label-width="120px">
                    <el-input
                      class="el-input--small"
                      v-model="item.providerName"
                      placeholder="暂无数据"
                      :disabled="true"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="海外仓渠道编码" label-width="130px">
                    <el-input
                      class="el-input--small"
                      v-model="item.bseOverseaCarrierCode"
                      placeholder="暂无数据"
                      :disabled="true"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="海外仓渠道名称" label-width="130px">
                    <el-input
                      class="el-input--small"
                      v-model="item.bseOverseaCarrierName"
                      placeholder="暂无数据"
                      :disabled="true"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </detail-wrapper>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
// import { getPrdCalculateRuleDetail } from '@/api/baseSetup/bseplatformtype'
import { getDetail } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"

// import { deepClone } from "../../../../util/util"
export default {
  name: "prdlcreate",
  data() {
    return {
      baseMsg: {},
      basePlatformMsg: [],
      baseOverseaMsg: []
    }
  },
  created() {
    const id = this.$route.params.id
    this.init(id)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async init(id) {
      const res = await getDetail({ id })
      console.log(res.data.data)
      this.baseMsg = res.data.data.bseTransportCarrierResultVo
      this.basePlatformMsg = res.data.data.bsePlatformCarrierVos
      this.baseOverseaMsg = res.data.data.bseOverSeaProviderCarrierVos
    }
  },
  components: {}
}
</script>

<style lang="scss">
// @import "./prdcreate.scss";
.bseTransportCarrierDetail .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}
</style>
