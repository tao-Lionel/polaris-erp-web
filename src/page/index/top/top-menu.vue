<template>
  <div class="top-menu">
    <el-menu mode="horizontal" text-color="#333">
      <template v-for="(item, index) in items">
        <el-menu-item :index="item.parentId + ''" @click.native="openMenu(item)" :key="index">
          <template slot="title">
            <i v-if="item.parentId !== 1" :class="item.icon" :title="item.label"></i>
            <a v-else :href="item.href" target="_blank">
              <i :class="item.icon" :title="item.label"></i>
            </a>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "top-menu",
  data() {
    return {
      activeIndex: "0",
      items: [
        {
          label: "首页",
          href: "/wel/index",
          icon: "icon-shouye menu_homepage",
          parentId: 0
        }
        // {
        //   label: '帮助文档',
        //   href: '/help/index.html',
        //   icon: 'icon-bangzhu menu_helppage',
        //   parentId: 1
        // }
      ]
    }
  },
  created() {},
  computed: {
    ...mapGetters(["tagCurrent", "menu"])
  },
  methods: {
    openMenu(item) {
      if (item.parentId === 1) {
        return
      }
      this.$store.dispatch("GetMenu", item.parentId).then(() => {
        let itemActive,
          childItemActive = 0
        if (item.href) {
          itemActive = item
        } else {
          if (this.menu[childItemActive].length == 0) {
            itemActive = this.menu[childItemActive]
          } else {
            itemActive = this.menu[childItemActive].children[childItemActive]
          }
        }
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: itemActive.label,
            src: itemActive.href
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu_homepage {
  font-size: 26px !important;
}

.menu_helppage {
  font-size: 22px !important;
}
</style>
