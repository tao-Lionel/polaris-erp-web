<template>
  <el-dropdown
    ref="button"
    split-button
    :type="type"
    :size="size"
    @click="handleClick"
    class="buttonClass"
    @command="handleCommand"
  >
    {{ buttonText }}
    <el-dropdown-menu ref="popMenu" slot="dropdown" class="popMenuClass">
      <slot></slot>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script type="text/babel">
export default {
  props: {
    buttonText: String,
    type: String,
    size: String,
    command: String
  },
  data() {
    return {}
  },
  updated() {
    this.$refs.popMenu.$el.style.width = this.$refs.button.$el.clientWidth + "px"
  },
  methods: {
    handleClick() {
      this.$emit("command", this.command || "buttonClick")
    },
    handleCommand(command) {
      this.$emit("command", command)
    }
  }
}
</script>

<style lang="scss">
.popMenuClass {
  margin-top: 2px !important;
}
.popMenuClass .popper__arrow {
  display: none !important;
}

.buttonClass {
  margin-left: 10px;
  margin-top: 1px;
}
.buttonClass + .el-button {
  margin-left: 10px;
}
</style>
