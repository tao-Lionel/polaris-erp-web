<template>
  <div id="tableCompent">
    <div class="headerTitle">{{ headerTitle }}</div>
    <!-- <el-table
    :data="myTableData"
    style="width: 100%;"
    row-key="itemId"
    border
    lazy
    :load="loadChild"
    >
    row-key="id">
      <el-table-column
        v-for="(item,index) in myTableOption.columns"
        :key="index"
        :prop="item.prop"
        :label="item.label">
      </el-table-column>
  </el-table>
    </el-table> -->
    <avue-tree-table :option="option" @search="search" @clearData="clearData"></avue-tree-table>
  </div>
</template>

<script>
import { getChildByItemId } from "@/api/cockpit/analysis/businessAnalysis"
export default {
  name: "tableCompent",
  components: {},
  mounted() {
    this.initData()
  },
  props: {
    tableOption: {
      type: Object,
      required: false
    },
    tableData: {
      type: Array,
      required: false
    },
    headerTitle: {
      type: String
    }
  },
  data() {
    return {
      myTableData: [],
      option: this.tableOption,
      searchForm: {}
    }
  },
  methods: {
    initData() {
      //获取当前用户拥有的列
      // getUserTableAuth().then(res => {
      //   let datas = res.data.data;
      //   datas.forEach((obj, index) => {
      //     this.option.columns.push({
      //       text: obj.groupName,
      //       value: obj.groupId
      //     });
      //   });
      // });
    },
    //根据currentId 获取子级数据
    search(currentId) {
      var _this = this
      let param = {
        itemId: currentId
      }
      var query = Object.assign(this.searchForm, param)
      getChildByItemId(query).then((res) => {
        let data = res.data.data
        if (!data || !Array.isArray(data)) {
          return
        }
        data.forEach((d) => {
          d.id = d.itemId
          //销售费用-运费
          if (d.itemName == "销售费用-运费" || d.itemId === 12) {
            d.children = []
          }
        })
        var rootArr = _this.option.data
        rootI: for (var i = 0; i < rootArr.length; i++) {
          let child = rootArr[i]
          if (child.id == currentId) {
            child.children = data
            break
          }
          if (!child.children) {
            return
          }
          for (var j = 0; j < child.children.length; j++) {
            if (child.children[j].id == currentId) {
              child.children[j].children = data
              break rootI
            }
          }
        }
        // _this.option.data.forEach(d => {
        //   if (d.id == currentId) {
        //     d.children = data;
        //   }
        //   if(d.children){
        //     d.children.forEach(obj =>{
        //       if (obj.id == currentId) {
        //         obj.children = data;
        //       }
        //     })
        //   }
        // });
      })
    },
    clearData(currentId) {
      this.option.data.forEach((d) => {
        if (d.id == currentId) {
          if (d.children) {
            d.children = []
          }
        }
      })
    },
    //设置table数据
    setTableData(tableData, searchFormTemp) {
      console.log("查询：" + JSON.stringify(searchFormTemp))
      this.searchForm = searchFormTemp
      if (!tableData || tableData.length === 0) {
        return
      }
      //手动构造子级
      tableData.forEach((d) => {
        d.id = d.itemId
        d.children = []
      })
      this.option.data = tableData
    }
  }
}
</script>
<style lang="scss">
@import "./tableCompent.scss";
</style>
