<template>
  <div class="execution" id="dataExportConfigurationAddOrUpdate">
    <basic-container>
      <div class="orderManageDetail-step jbNav">
        <el-form
          :model="addFormData"
          :rules="addFormDataRules"
          label-position="top"
          label-width="70px"
          class="demo-form-inline"
          ref="baseInfoForm"
        >
          <detail-wrapper :options="{ title: '基本信息' }">
            <div class="form-box">
              <el-form-item label="分类" prop="category">
                <el-input placeholder="请输入" v-model="addFormData.category" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input placeholder="请输入" v-model="addFormData.name" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <el-input-number
                  style="width: 100%; text-align: left"
                  placeholder="请输入"
                  :controls="false"
                  :precision="0"
                  :min="0"
                  v-model="addFormData.orderNum"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="使用角色（多选）">
                <template slot="label" slot-scope="scope">
                  <div class="label-tip">
                    使用角色（多选）
                    <el-tooltip
                      effect="dark"
                      content="指定可使用该功能的角色，仅针对应用类型=公共导出页面有效"
                      placement="top"
                    >
                      <el-badge value="?" class="badge-item" type="info"> </el-badge>
                    </el-tooltip>
                  </div>
                </template>
                <el-select
                  v-model="addFormData.roleIdList"
                  size="small"
                  clearable
                  filterable
                  multiple
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="导出方式" prop="exportModel">
                <el-radio-group v-model="addFormData.exportModel">
                  <el-radio label="SYNC" value="">同步导出</el-radio>
                  <el-radio label="ASYNC" value="">异步导出</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="导出位置" prop="exportType">
                <template slot="label" slot-scope="scope">
                  <div class="label-tip">
                    导出位置
                    <el-tooltip
                      effect="dark"
                      content="公共导出配置：用于标识那些配置适用于所有用户共享的导出功能；业务特定导出配置：用于表示仅适用于特定业务页面的导出功能"
                      placement="top"
                    >
                      <el-badge value="?" class="badge-item" type="info"> </el-badge>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="addFormData.exportType">
                  <el-radio label="PAGE">全局导出配置</el-radio>
                  <el-radio label="BUTTON">业务特定导出配置</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态">
                <el-select placeholder="请选择" v-model="addFormData.status">
                  <el-option label="正常" value="ENABLE"></el-option>
                  <el-option label="停用" value="PROHIBIT"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="查询SQL" prop="sql">
                <el-input type="textarea" placeholder="请输入" :rows="8" v-model="addFormData.sql"> </el-input>
              </el-form-item>
            </div>
          </detail-wrapper>
        </el-form>
        <el-form
          :model="addFormData"
          :rules="tableDataRules"
          label-position="top"
          label-width="70px"
          class="demo-form-inline"
          ref="tableForm"
        >
          <detail-wrapper :options="{ title: '查询条件' }">
            <div class="config-table">
              <el-table :data="addFormData.paramInfoList" border stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="50"> </el-table-column>

                <el-table-column prop="type" label="类型" :render-header="addRedStar">
                  <template slot-scope="scope">
                    <el-form-item
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].type`"
                      :rules="tableDataRules.type"
                    >
                      <el-select
                        v-model="scope.row.type"
                        size="small"
                        clearable
                        placeholder="请选择"
                        style="width: 100%"
                        @clear="typeClear(scope.row)"
                        @change="typeChange(scope.row)"
                      >
                        <el-option v-for="item in filedType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select> </el-form-item></template
                ></el-table-column>
                <el-table-column label="code" :render-header="addRedStar">
                  <template slot-scope="scope">
                    <el-form-item
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].code`"
                      :rules="tableDataRules.code"
                    >
                      <el-input placeholder="请输入" v-model="scope.row.code"></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="name">
                  <template slot="header" slot-scope="scope">
                    <span style="color: red">*</span>
                    显示名称
                    <el-tooltip effect="dark" content="前端显示的查询条件字段名" placement="top">
                      <el-badge value="?" class="badge-item" type="info"> </el-badge>
                    </el-tooltip>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].name`"
                      :rules="tableDataRules.name"
                    >
                      <el-input placeholder="请输入" v-model="scope.row.name" maxlength="20"></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="province">
                  <template slot="header" slot-scope="scope">
                    <span style="color: red">*</span>
                    查询字段
                    <el-tooltip effect="dark" content="数据库表的查询字段" placement="top">
                      <el-badge value="?" class="badge-item" type="info"> </el-badge>
                    </el-tooltip>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].databaseCode`"
                      :rules="tableDataRules.databaseCode"
                    >
                      <el-input placeholder="请输入" v-model="scope.row.databaseCode"></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="city" label="查询条件" :render-header="addRedStar">
                  <template slot-scope="scope">
                    <el-form-item
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].conditionCode`"
                      :rules="tableDataRules.conditionCode"
                    >
                      <el-select
                        v-model="scope.row.conditionCode"
                        size="small"
                        clearable
                        placeholder="请选择"
                        style="width: 100%"
                        @change="conditionCodeChange(scope.row)"
                      >
                        <el-option
                          v-for="item in sqlCondition"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select> </el-form-item></template
                ></el-table-column>
                <el-table-column prop="value" width="200">
                  <template slot="header" slot-scope="scope">
                    <span style="color: red">*</span>
                    默认值/查询值SQL
                    <el-tooltip effect="dark" content="当类型为下拉框时，输入下拉选项的查询SQL" placement="top">
                      <el-badge value="?" class="badge-item" type="info"> </el-badge>
                    </el-tooltip>
                  </template>
                  <template slot-scope="scope">
                    <div v-if="judgeDisplayType(scope.row) === 1">
                      <el-input placeholder="请输入" v-model="scope.row.value"></el-input>
                    </div>

                    <div v-if="judgeDisplayType(scope.row) === 2">
                      <el-form-item
                        style="width: 100%"
                        :prop="`paramInfoList[${scope.$index}].value`"
                        :rules="tableDataRules.value"
                      >
                        <el-input
                          placeholder="请输入"
                          v-model="scope.row.value"
                          v-if="scope.row.conditionCode !== 'ORDER'"
                        ></el-input>
                        <el-select
                          v-else
                          v-model="scope.row.value"
                          size="small"
                          placeholder="请选择"
                          style="width: 100%"
                        >
                          <el-option label="降序" value="DESC"> </el-option>
                          <el-option label="升序" value="ASC"> </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div v-if="judgeDisplayType(scope.row) === 3">
                      <el-form-item
                        style="width: 100%"
                        :prop="`paramInfoList[${scope.$index}].value`"
                        :rules="tableDataRules.value"
                      >
                        <el-select
                          v-model="scope.row.value"
                          size="small"
                          clearable
                          placeholder="请选择"
                          style="width: 100%"
                        >
                          <el-option label="店铺" value="STORE"> </el-option>
                          <el-option label="品类" value="CATEGORY"> </el-option>
                          <el-option label="仓库" value="WAREHOUSE"> </el-option>
                          <el-option label="品牌" value="BRAND"> </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div v-if="judgeDisplayType(scope.row) === 4">
                      <el-form-item
                        style="width: 100%"
                        :prop="`paramInfoList[${scope.$index}].value`"
                        :rules="tableDataRules.value"
                      >
                        <el-input placeholder="请输入" v-model="scope.row.value"></el-input>
                      </el-form-item>
                    </div> </template
                ></el-table-column>
                <el-table-column prop="zip" label="日期格式" :render-header="addRedStar">
                  <template slot-scope="scope">
                    <el-form-item
                      v-if="scope.row.type == 'date' || scope.row.type == 'dateRange'"
                      style="width: 100%"
                      :prop="`paramInfoList[${scope.$index}].format`"
                      :rules="tableDataRules.value"
                    >
                      <el-select
                        v-model="scope.row.format"
                        size="small"
                        clearable
                        placeholder="请选择"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(item, ind) in formatList"
                          :key="ind"
                          :label="item.label"
                          :value="item.value"
                          v-show="scope.row.type == item.type"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <div v-else>- -</div>
                  </template>
                </el-table-column>
                <el-table-column prop="zip" width="180" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleAdd(scope)">添加</el-button>
                    <el-button type="text" style="color: #f56c6c" @click="handleDel(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                style="margin-top: 10px"
                type="text"
                @click="handleAdd"
                v-if="addFormData.paramInfoList.length === 0"
                >添加条件</el-button
              >
            </div>

            <div style="padding: 20px">
              <p class="operation-instructions">操作说明：</p>
              <p class="operation-instructions">1、默认值/查询值SQL：当类型=下拉框、默认、数据权限，必填</p>
              <p class="operation-instructions indentation">（1）当查询条件=排序时，仅限输入： DESC、ASC；</p>
              <p class="operation-instructions indentation">（2）当类型=下拉框时，需输入下拉选项的查询SQL（完整的）</p>
              <p class="operation-instructions">3、指定格式：当类型=日期、日期范围时，必填</p>
            </div>
          </detail-wrapper>
        </el-form>
      </div>
      <div class="button-bottom">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getExportConfigDetail, saveOrUpdateExportConfig } from "@/api/admin/dataExportConfiguration.js"
import { getAll as getRoleList } from "@/api/admin/role"
import { addFormDataRules, tableDataRules } from "./index.js"
import { getDictByType } from "@/util/auth.js"
import _ from "lodash"

export default {
  name: "dataExportConfigurationAddOrUpdate",

  data() {
    return {
      type: "add",
      addFormData: {
        id: "",
        category: "",
        name: "",
        orderNum: null,
        roleIdList: [],
        status: "ENABLE",
        exportType: "PAGE",
        exportModel: "SYNC",
        sql: "",
        paramInfoList: [
          {
            name: "",
            conditionCode: "",
            code: "",
            type: "",
            format: "",
            databaseCode: "",
            value: "",
            join: true
          }
        ]
      },
      editId: "",
      roleList: [],
      addFormDataRules: addFormDataRules,
      tableDataRules: tableDataRules,
      filedType: [],
      sqlCondition: [],
      formatList: [
        {
          value: "yyyy-MM",
          type: "date",
          label: "年月"
        },
        {
          value: "yyyy-MM-dd",
          type: "date",
          label: "年月日"
        },
        {
          value: "yyyy-MM-dd HH:mm:ss,yyyy-MM-dd HH:mm:ss",
          type: "dateRange",
          label: "日期区间"
        }
      ]
    }
  },

  created() {
    const { id, type } = this.$route.query
    this.editId = id
    this.type = type
  },
  async mounted() {
    this.getRoleList()
    this.filedType = await this.getDictByType("filed_type")
    this.sqlCondition = await this.getDictByType("sql_condition")
    if (this.type == "edit") {
      this.getExportConfigDetail()
    }
  },
  methods: {
    addRedStar(h, { column }) {
      return [h("span", { style: "color:red" }, "*"), h("span", column.label)]
    },
    async getExportConfigDetail() {
      const { data } = await getExportConfigDetail(this.editId)
      if (data.code === 0) {
        this.addFormData = data.data
        this.addFormData.paramInfoList.forEach((item, index) => {
          this.$set(this.addFormData, this.addFormData[index], item)
        })
      }
    },
    async getRoleList() {
      const { data } = await getRoleList()
      if (data.code === 0) {
        this.roleList = data.data
      }
    },
    async getDictByType(type) {
      const data = await getDictByType(type)
      return data
    },
    judgeDisplayType(row) {
      if (row.type == "default" && row.conditionCode == "ORDER") {
        return 2
      }
      if (row.type == "dataScope") {
        return 3
      }
      if (row.type == "select") {
        return 4
      }
      return 1
    },

    typeClear(row) {
      this.$set(row, "format", "")
    },
    handleAdd(scope) {
      this.addFormData.paramInfoList.splice(scope.$index + 1, 0, {
        name: "",
        conditionCode: "",
        code: "",
        type: "",
        format: "",
        databaseCode: "",
        value: "",
        join: true
      })
    },
    conditionCodeChange(row) {
      if (row.type == "default" && row.conditionCode == "ORDER") {
        row.value = "DESC"
      } else {
        // 条件切换 清空默认值
        row.value = ""
      }
    },
    typeChange(row) {
      if (row.type == "date") {
        row.format = "yyyy-MM"
      }
      row.value = ""
      if (row.type == "dataScope") {
        row.value = "STORE"
      }
      if (row.type == "dateRange") {
        row.format = "yyyy-MM-dd HH:mm:ss,yyyy-MM-dd HH:mm:ss"
      }
      this.$refs.tableForm.clearValidate()
    },
    isRequiredValue(row) {
      if (row.type == "select") {
        return true
      }

      return false
    },
    handleDel(index) {
      // if (this.addFormData.paramInfoList.length === 1) {
      //   this.$message({
      //     message: "只有一条数据不允许删除",
      //     type: "warning"
      //   })

      //   return
      // }
      this.addFormData.paramInfoList.splice(index, 1)
    },
    async handleSubmit() {
      await this.$refs.baseInfoForm.validate()
      if (this.addFormData.paramInfoList.length !== 0) {
        await this.$refs.tableForm.validate()
      }

      const postData = _.cloneDeep(this.addFormData)

      const validateParamInfoList = (list) => {
        for (const item of list) {
          if (item.type === "select") {
            if (!item.value.trim()) {
              this.$message.warning("当类型=下拉框，默认值\查询值SQL必填")
              return false
            }
          } else if (item.type === "default") {
            if (item.conditionCode == "sort") {
              if (!item.value.trim()) {
                this.$message.warning("当类型=默认，且条件=排序，默认值\查询值SQL必填")
                return false
              }
            }
          } else if (item.type === "dataScope") {
            if (!item.value.trim()) {
              this.$message.warning("当类型=数据范围，默认值\查询值SQL必填")
              return false
            }
          }
        }
        return true
      }
      const isValid = validateParamInfoList(postData.paramInfoList)
      if (!isValid) return

      postData.id == "" && delete postData.id
      const { data } = await saveOrUpdateExportConfig(postData)

      if (data.code == 0) {
        this.$message({
          message: "保存成功",
          type: "success"
        })

        this.$router.push("/admin/dataExportConfiguration")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#dataExportConfigurationAddOrUpdate {
  .form-box {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      flex: 1 1 30%;
      padding: 0 20px;
    }

    .el-form-item:last-child {
      flex: 1 1 100%; /* 最后一个元素单独一行 */
    }
    @media (max-width: 768px) {
      .el-form-item {
        flex: 1 1 calc(50% - 10px);
      }
    }

    @media (max-width: 480px) {
      .el-form-item {
        flex: 1 1 100%;
      }
    }
  }

  .has-gutter .is-leaf {
    background-color: #fafafa;
  }
  .button-bottom {
    display: flex;
    justify-content: flex-end;
  }
  ::v-deep .el-form-item__error {
    bottom: -12px !important;
  }

  .config-table {
    padding: 15px;
    .el-form-item {
      padding: 10px 0px;
    }
  }

  .label-tip,
  .config-table {
    .badge-item {
      height: 32px;
      ::v-deep .el-badge__content--info {
        font-size: 10px !important;
        height: 14px !important;
        line-height: 15px !important;
        padding: 0 5px !important;
      }
    }
  }
  .operation-instructions {
    color: #bcbcbc;
    font-size: 14px;
    line-height: 22px;
  }
  .indentation {
    text-indent: 6px;
  }
  ::v-deep .el-form-item__label {
    display: inline-block;
  }
}
</style>
