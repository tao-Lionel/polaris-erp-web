<template>
  <!-- 基础属性 -->
  <div class="attr-dialog" id="attr-dialog">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="modalObj.title"
      :visible.sync="myModalShow"
      center
      v-if="myModalShow"
      width="520px"
    >
      <el-form :model="myRowForm" ref="myRowForm">
        <!-- v-if="addAttr||eidtAttr" -->
        <el-form-item
          prop="categoryId"
          label="品类"
          :rules="[{ required: true, message: '请选择品类', trigger: 'change' }]"
        >
          <el-select
            style="width: 150px"
            v-model="myRowForm.categoryId"
            size="small"
            placeholder="选择品类"
            :disabled="isAdd"
          >
            <el-option
              v-for="item in categoryArr"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="attributeName"
          label="属性名称"
          v-if="true"
          :rules="[
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { min: 1, max: 30, message: '属性名称不得超过30位字符', trigger: 'blur' }
          ]"
        >
          <el-input
            placeholder="30字符以内"
            v-model="myRowForm.attributeName"
            :validate-event="!isAdd"
            size="small"
            :disabled="isAdd"
            clearable
            maxlength="30"
            minlength="1"
            v-search-input-trim
          ></el-input>
        </el-form-item>
        <!-- v-if="eidtValue" -->
        <!-- <el-form-item v-if="true" prop="attributeName" label="属性名称">
          <el-tag>{{myRowForm.attributeName}}</el-tag>
        </el-form-item>-->
        <el-row v-for="(domain, index) in myRowForm.attributeValues" :key="domain.key" :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="属性值"
              :prop="'attributeValues.' + index + '.attributeValueName'"
              :rules="[
                { required: true, message: '属性值不能为空', trigger: 'blur' },
                { min: 1, max: 30, message: '属性值名称不得超过30位字符', trigger: 'blur' }
              ]"
            >
              <el-input
                placeholder="30字符以内"
                v-model="domain.attributeValueName"
                size="small"
                :maxlength="30"
                :minlength="1"
                clearable
                onlyTrim
              ></el-input>
              <!-- <el-input placeholder="30字符以内" v-else v-model="domain.attributeValueName" size="small"  :maxlength="30" :minlength="1" clearable onlyTrim>
                <template  v-if="visi" slot="append">
                  <i @click.prevent="removeDomain(domain)" class="el-icon-delete"></i>
                </template>
              </el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简码" label-width="20px" :key="domain.key">
              <el-input
                placeholder="30字符以内"
                v-if="index === 0"
                v-model="domain.attributeValueCode"
                size="small"
                :maxlength="30"
                :minlength="1"
                clearable
                onlyTrim
              ></el-input>
              <el-input
                placeholder="30字符以内"
                v-else
                v-model="domain.attributeValueCode"
                size="small"
                @change="validateCode"
                :maxlength="30"
                :minlength="1"
                clearable
                onlyTrim
              >
                <template v-if="visi" slot="append">
                  <i @click.prevent="removeDomain(domain)" class="el-icon-delete"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button
            class="add-attr"
            size="small"
            title="添加新属性"
            icon="el-icon-plus"
            @click="addDomain"
            v-if="visi"
          ></el-button>
          <!-- <el-button v-if="eidtAttr" type="primary" @click="eidtAttrRow(myRowForm)">提交</el-button>
          <el-button v-if="eidtValue" type="primary" @click="eidtAttrValueRow(myRowForm)">提交</el-button>-->
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button size="small" type="primary" @click="sugmitForm()">提交</el-button>
        <el-button size="small" @click="myModalShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "attr-dialog",
  data() {
    return {
      myModalShow: false,
      myRowForm: JSON.parse(this.rowForm),
      myRules: this.rules,
      myVisi: this.visi,
      myAddAttr: this.addAttr,
      myEidtAttr: this.eidtAttr,
      myEidtValue: this.eidtValue,
      myCategoryArr: this.categoryArr,
      editNewList: Object
    }
  },
  props: {
    isAdd: Boolean,
    modalObj: Object,
    modalShow: Boolean,
    rowForm: String,
    rules: Object,
    categoryArr: Array,
    visi: {
      type: Boolean,
      default: false
    },
    addAttr: {
      type: Boolean,
      default: false
    },
    eidtAttr: {
      type: Boolean,
      default: false
    },
    addValue: {
      type: Boolean,
      default: false
    },
    eidtValue: {
      type: Boolean,
      default: false
    }
  },
  updated() {
    this.editNewList = this.myRowForm.attributeValues
  },
  methods: {
    showDialog(bool) {
      this.myModalShow = bool
    },
    //新增修改给form重新赋值
    setRowForm(row) {
      this.myRowForm = JSON.parse(row)
    },
    /**
     * 属性值节点移除
     */
    removeDomain(item) {
      var index = this.myRowForm.attributeValues.indexOf(item)
      if (index !== -1) {
        this.myRowForm.attributeValues.splice(index, 1)
      }
      // this.$emit("removeDomain", item);
    },
    /**
     * 属性值节点添加
     */
    addDomain() {
      this.myRowForm.attributeValues.push({
        attributeValueName: "",
        attributeValueCode: null,
        key: Date.now()
      })
    },
    /**
     * 提交表单
     */
    sugmitForm() {
      this.$refs["myRowForm"].validate((valid) => {
        if (!valid) {
          return
        }

        for (let i = 0; i < this.myRowForm.attributeValues.length; i++) {
          const status = /^[0-9a-zA-Z\-\_\/]*$/.test(this.myRowForm.attributeValues[i].attributeValueCode)
          if (this.myRowForm.attributeValues[i].attributeValueCode === "") {
            this.myRowForm.attributeValues[i].attributeValueCode = null
          }
          if (this.myRowForm.attributeValues[i].attributeValueCode && !status) {
            this.$message.warning(
              `属性值${this.myRowForm.attributeValues[i].attributeValueName}的简码存在特殊字符，只允许输入数字、英文、-、_、/，请修改！`
            )
            return
          }
        }

        // this.rowForm.attributeValues = this.editNewList;
        //新增属性操作
        if (this.addAttr) {
          this.$emit("addAttrRow", this.myRowForm)
        }
        //编辑属性操作
        if (this.eidtAttr) {
          this.$emit("eidtAttrRow", this.myRowForm)
        }
        //新增属性值操作
        if (this.addValue) {
          this.$emit("addAttrValueRow", this.myRowForm)
        }
        //编辑属性值操作
        if (this.eidtValue) {
          this.$emit("eidtAttrValueRow", this.myRowForm)
        }
      })
    },
    /**
     * 属性新增
     */
    addAttrRow(rowForm) {
      this.$refs[rowForm].validate((valid) => {
        if (valid) {
          this.$emit("addAttrRow", rowForm)
        } else {
          return false
        }
      })
    },
    /**
     * 属性编辑
     */
    eidtAttrRow(rowForm) {
      this.$refs[rowForm].validate((valid) => {
        if (valid) {
          this.$emit("eidtAttrRow", rowForm)
        } else {
          return false
        }
      })
    },
    /**
     * 属性值编辑
     */
    eidtAttrValueRow(rowForm) {
      this.$refs[rowForm].validate((valid) => {
        if (valid) {
          this.$emit("eidtAttrValueRow", rowForm)
        } else {
          return false
        }
      })
    }
  },
  computed: {},
  watch: {
    // rowForm(a,b){
    //   console.log(this.myRowForm);
    //   if(typeof this.myRowForm==="object"){
    //     this.myRowForm=JSON.parse(this.rowForm)
    //   }
    // }
  }
}
</script>

<style lang="scss">
#attr-dialog {
  .el-form-item__label {
    width: 100px;
  }
  .add-attr {
    display: block;
    margin-left: 85px;
    margin-top: 10px;
    width: 385px;
    background-color: #f7f8fb;
    border: 1px dotted #d5d7dc;
  }
  .el-dialog__body {
    max-height: 60vh;
    overflow-y: scroll;
  }
}
</style>
