<template>
  <el-button
    class="y-button"
    :type="type || 'primary'"
    :size="size || 'small'"
    :plain="plain"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :icon="icon || ''"
    :autofocus="autofocus"
    :native-type="nativeType || 'button'"
    @click.native="clickButton"
    >{{ data }}</el-button
  >
</template>
<script>
export default {
  name: "y-button",
  props: {
    type: "",
    size: "",
    data: "",
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    loading: Boolean,
    disabled: Boolean,
    icon: "",
    autofocus: Boolean,
    nativeType: ""
  },
  methods: {
    clickButton() {
      this.$emit("click-button")
    }
  }
}
</script>
