<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height: 100%" class="hide_scroll">
      <el-menu unique-opened :default-active="nowTagValue" mode="vertical" :show-timeout="200" :collapse="keyCollapse">
        <sidebar-item
          :menu="menu"
          first
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import logo from "../logo"
import sidebarItem from "./sidebarItem"
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {}
  },
  created() {
    this.$store.dispatch("GetMenu").then((data) => {
      if (data.length === 0) return
      this.$router.$avueRouter.routerList = []
      this.$router.$avueRouter.formatRoutes(data, true)
    })
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route)
    }
  },
  mounted() {
    /*
  //  勿删除，空余时间再处理
   
   this.$nextTick(function(){
      if(this.menu.length>0){
        setTimeout(function(){
           const menuNode=document.getElementById('main-menu');
           const menuParent=menuNode.parentNode;
          if(menuNode){
            if(menuParent.offsetHeight<=menuNode.offsetHeight){
              const isActive=Array.from(menuNode.getElementsByClassName('is-active'));
                isActive.forEach(ele=>{
                    console.log(ele.classList.contains('el-menu-item'))
                  if(ele.classList.contains('el-menu-item')){
                    menuParent.scrollTop(100)
                    console.log(ele.getBoundingClientRect().top)
                  }
                })

              
            }
          }
        
        },1000)
       
      }
     
    })*/
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
// 隐藏左边外部滚动条
.hide_scroll {
  ::v-deep.el-scrollbar__wrap:first-child {
    overflow: auto;
  }
}
</style>
