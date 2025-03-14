<template>
  <div id="reportConfiguration">
    <basic-container>
      <el-form inline>
        <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px">采购费用分配规则</p>
        <div>
          <el-form-item label="参与分配费用项目：" style="margin-bottom: 5px">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">添 加</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="海运费：" style="margin-bottom: 5px">
            <div class="flexAll">
              <div>按</div>
              <div style="margin: 0 10px">
                <el-select v-model="searchForm.corporationId" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in voluem"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div>分配到采购入库单的每个商品</div>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="关税费：" style="margin-bottom: 5px">
            <div class="flexAll">
              <div>按</div>
              <div style="margin: 0 10px">
                <el-select v-model="searchForm.corporationId" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in voluem"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div>分配到采购入库单的每个商品</div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: center; margin-top: 20px">
        <el-button
          size="small"
          style="padding: 9px 30px"
          type="primary"
          :loading="loadingStatus"
          @click="setWarehouseConfirm"
          >确认</el-button
        >
      </div>
    </basic-container>
  </div>
</template>

<script>
import {} from "@/api/financialStatements/index"
import { reportConfigurationOption } from "@/const/crud/financialStatements/index"
import { getAll } from "@/api/baseSetup/bsecorporation"
import { getObjByType } from "@/api/admin/dict"

import { preventShake } from "@/util/tool"
import { getUrlConcatToken, downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "bsecurrency",
  data() {
    return {
      voluem: [],
      searchForm: {},
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    }
  },
  components: {},
  created() {
    this.dataInit()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    // 数据初始化
    dataInit() {},
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ""
    }
  }
}
</script>

<style lang="scss">
#reportConfiguration {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .flexAll {
    display: flex;
  }
}
</style>
