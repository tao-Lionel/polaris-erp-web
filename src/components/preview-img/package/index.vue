<template>
  <transition name="viewer-fade">
    <div ref="ydPreview" tabindex="-1" :class="[{ 'yd-preview': showMask }]" :style="{ 'z-index': zIndex }">
      <div v-if="showMask" class="preview__mask"></div>
      <span v-if="showCloseBtn" class="preview__btn preview__close" @click="handleClose">
        <svg
          t="1669452473618"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4022"
          width="48"
          height="48"
        >
          <path
            d="M571.733333 512l268.8-268.8c17.066667-17.066667 17.066667-42.666667 0-59.733333-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 452.266667 243.2 183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333L452.266667 512 183.466667 780.8c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 19.2 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8L512 571.733333l268.8 268.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z"
            p-id="4023"
            fill="#ffffff"
          ></path>
        </svg>
      </span>
      <div class="preview__canvas">
        <template v-for="(url, i) in urlList">
          <img
            v-if="i === index"
            ref="img"
            :key="url"
            :src="currentImg"
            :style="imgStyle"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown"
          />
        </template>
        <svg v-if="loading" class="preview__loading" viewBox="25 25 50 50">
          <circle class="preview__loading-path" cx="50" cy="50" r="20" fill="none" />
        </svg>
      </div>
      <div class="preview__btn preview__actions" :style="{ bottom: bottomBtn + 'px' }">
        <div class="actions__inner">
          <svg
            @click.stop="handleActions('zoomIn')"
            class="actions__icon"
            t="1669452513061"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4278"
            width="48"
            height="48"
          >
            <path
              d="M945.066667 898.133333l-189.866667-189.866666c55.466667-64 87.466667-149.333333 87.466667-241.066667 0-204.8-168.533333-373.333333-373.333334-373.333333S96 264.533333 96 469.333333 264.533333 842.666667 469.333333 842.666667c91.733333 0 174.933333-34.133333 241.066667-87.466667l189.866667 189.866667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c8.533333-12.8 8.533333-34.133333-2.133333-46.933334zM469.333333 778.666667C298.666667 778.666667 160 640 160 469.333333S298.666667 160 469.333333 160 778.666667 298.666667 778.666667 469.333333 640 778.666667 469.333333 778.666667z"
              p-id="4279"
              fill="#ffffff"
            ></path>
            <path
              d="M597.333333 437.333333h-96V341.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v96H341.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h96V597.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-96H597.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"
              p-id="4280"
              fill="#ffffff"
            ></path>
          </svg>
          <svg
            @click.stop="handleActions('zoomOut')"
            class="actions__icon"
            t="1669452664869"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4529"
            width="48"
            height="48"
          >
            <path
              d="M945.066667 898.133333l-189.866667-189.866666c55.466667-64 87.466667-149.333333 87.466667-241.066667 0-204.8-168.533333-373.333333-373.333334-373.333333S96 264.533333 96 469.333333 264.533333 842.666667 469.333333 842.666667c91.733333 0 174.933333-34.133333 241.066667-87.466667l189.866667 189.866667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c8.533333-12.8 8.533333-34.133333-2.133333-46.933334zM469.333333 778.666667C298.666667 778.666667 160 640 160 469.333333S298.666667 160 469.333333 160 778.666667 298.666667 778.666667 469.333333 640 778.666667 469.333333 778.666667z"
              p-id="4530"
              fill="#ffffff"
            ></path>
            <path
              d="M597.333333 437.333333H341.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h256c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"
              p-id="4531"
              fill="#ffffff"
            ></path>
          </svg>

          <svg
            @click.stop="handleActions('left')"
            class="actions__icon"
            t="1669452861191"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8599"
            width="48"
            height="48"
          >
            <path
              d="M511.4 124C290.5 124.3 112 303 112 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-0.3 13 6.3 12.9l167-0.8c5.2 0 9-4.9 7.7-9.9L369.8 727c-1.6-6.5-10-8.3-14.1-3L315 776.1c-10.2-8-20-16.7-29.3-26-29.4-29.4-52.5-63.6-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5c-16.1 38.1-39.2 72.3-68.6 101.7-7.5 7.5-15.3 14.5-23.4 21.2-3.4 2.8-3.9 7.7-1.2 11.1l39.4 50.5c2.8 3.5 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-221.1-179.4-400.2-400.6-399.9z"
              p-id="8600"
              fill="#ffffff"
            ></path>
          </svg>
          <svg
            @click.stop="handleActions('right')"
            class="actions__icon"
            t="1669452818298"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8349"
            width="48"
            height="48"
          >
            <path
              d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2-29.4-29.4-52.5-63.6-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5c-16.1 38.1-39.2 72.3-68.6 101.7-9.3 9.3-19.1 18-29.3 26L668.2 724c-4.1-5.3-12.5-3.5-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 0.8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
              p-id="8350"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </div>
      <template v-if="!isSingle">
        <span @click="prevEvent" class="preview__btn preview__prev" :class="{ 'is-disabled': !infinite && isFirst }">
          <svg
            t="1669452168825"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3772"
            width="48"
            height="48"
          >
            <path
              d="M384 512L731.733333 202.666667c17.066667-14.933333 19.2-42.666667 4.266667-59.733334-14.933333-17.066667-42.666667-19.2-59.733333-4.266666l-384 341.333333c-10.666667 8.533333-14.933333 19.2-14.933334 32s4.266667 23.466667 14.933334 32l384 341.333333c8.533333 6.4 19.2 10.666667 27.733333 10.666667 12.8 0 23.466667-4.266667 32-14.933333 14.933333-17.066667 14.933333-44.8-4.266667-59.733334L384 512z"
              p-id="3773"
              fill="#ffffff"
            ></path>
          </svg>
        </span>
        <span @click="nextEvent" class="preview__btn preview__next" :class="{ 'is-disabled': !infinite && isLast }">
          <svg
            t="1669452135423"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3522"
            width="48"
            height="48"
          >
            <path
              d="M731.733333 480l-384-341.333333c-17.066667-14.933333-44.8-14.933333-59.733333 4.266666-14.933333 17.066667-14.933333 44.8 4.266667 59.733334L640 512 292.266667 821.333333c-17.066667 14.933333-19.2 42.666667-4.266667 59.733334 8.533333 8.533333 19.2 14.933333 32 14.933333 10.666667 0 19.2-4.266667 27.733333-10.666667l384-341.333333c8.533333-8.533333 14.933333-19.2 14.933334-32s-4.266667-23.466667-14.933334-32z"
              p-id="3523"
              fill="#ffffff"
            ></path>
          </svg>
        </span>
      </template>
    </div>
  </transition>
</template>

<script>
// 节流函数
function rafThrottle(fn) {
  let locked = false
  return function (...args) {
    if (locked) return
    locked = true
    window.requestAnimationFrame((_) => {
      fn.apply(this, args)
      locked = false
    })
  }
}

// 给DOM注册监听事件
function on(element, event, handler) {
  if (document.addEventListener) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false)
    }
  } else {
    if (element && event && handler) {
      element.attachEvent("on" + event, handler)
    }
  }
}

// 移除DOM的事件监听
function off(element, event, handler) {
  if (document.removeEventListener) {
    if (element && event) {
      element.removeEventListener(event, handler, false)
    }
  } else {
    if (element && event) {
      element.detachEvent("on" + event, handler)
    }
  }
}

export default {
  name: "PreviewImg",
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 999
    },
    // 默认显示第几张图片
    initialIndex: {
      type: Number,
      default: 0
    },
    // 是否挂载到body
    appendToBody: {
      type: Boolean,
      default: true
    },
    // 是否显示蒙层
    showMask: {
      type: Boolean,
      default: true
    },
    // 是否显示关闭按钮
    showCloseBtn: {
      type: Boolean,
      default: false
    },
    // 按钮组件的位置
    bottomBtn: {
      type: Number,
      default: 30
    },
    // 图片索引变化
    changeIndex: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      index: this.initialIndex,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      infinite: true,
      loading: false
    }
  },
  computed: {
    currentImg() {
      return this.urlList[this.index]
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`
      }
      style.maxWidth = style.maxHeight = "100%"
      return style
    },
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === this.urlList.length - 1
    },
    isSingle() {
      return this.urlList.length <= 1
    }
  },
  watch: {
    currentImg() {
      this.$nextTick(() => {
        const $img = this.$refs.img[0]
        if (!$img.complete) {
          this.loading = true
        }
      })
    },
    // 监听(图片索引)index变化
    index: {
      handler: function (val) {
        this.reset()
        // 当前显示的图片索引
        this.changeIndex(val)
      },
      immediate: true
    }
  },
  mounted() {
    this.deviceSupportInstall()
    // 是否挂载到body上
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },
  methods: {
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    // 鼠标拖拽事件
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return
      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, "mousemove", this._dragHandler)
      on(document, "mouseup", (ev) => {
        off(document, "mousemove", this._dragHandler)
      })
      e.preventDefault()
    },
    handleImgLoad(e) {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = "加载失败"
    },
    prevEvent() {
      if (this.isFirst && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index - 1 + len) % len
    },
    nextEvent() {
      if (this.isLast && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index + 1) % len
    },
    handleActions(action, options = {}) {
      if (this.loading) return

      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
          }
          break
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case "right":
          transform.deg += rotateDeg
          break
        case "left":
          transform.deg -= rotateDeg
          break
      }
      transform.enableTransition = enableTransition
    },
    handleClose() {
      this.deviceSupportUninstall()
      this.$emit("close")
    },
    // 注册键盘按钮事件
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle((e) => {
        const keyCode = e.keyCode
        switch (keyCode) {
          case 27:
            this.handleClose()
            break
          case 37:
            this.prevEvent()
            break
          case 38:
            this.handleActions("zoomIn")
            break
          case 39:
            this.nextEvent()
            break
          case 40:
            this.handleActions("zoomOut")
            break
        }
      })
      on(document, "keydown", this._keyDownHandler)
    },
    // 卸载键盘按钮事件
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler)
      this._keyDownHandler = null
    }
  },
  // 从body中移除
  destroyed() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style scoped>
.yd-preview {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.preview__mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.5;
  background: #000;
}
.preview__btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.8;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}
.preview__close {
  top: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  font-size: 40px;
  color: #fff;
}
.preview__canvas {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview__canvas:active {
  cursor: grab;
}
.preview__actions {
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  width: 282px;
  height: 44px;
  padding: 0 23px;
  background-color: #606266;
  border-color: #fff;
  border-radius: 22px;
}
.actions__inner {
  width: 100%;
  height: 100%;
  text-align: justify;
  cursor: default;
  font-size: 23px;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.actions__icon {
  cursor: pointer;
  width: 30px;
}
.preview__next,
.preview__prev {
  top: 50%;
  width: 44px;
  height: 44px;
  font-size: 24px;
  color: #fff;
  background-color: #606266;
  border-color: #fff;
}
.preview__prev {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 40px;
}
.preview__next {
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 40px;
  text-indent: 2px;
}
.preview__prev svg {
  width: 28px;
  margin-right: 3px;
}
.preview__next svg {
  width: 28px;
  margin-left: 3px;
}
.preview__loading {
  position: absolute;
  height: 50px;
  width: 50px;
  animation: loading-rotate 2s linear infinite;
}
.preview__loading-path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2px;
  stroke: rgba(255, 255, 255, 0.8);
  stroke-linecap: round;
}
@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
.is-disabled {
  cursor: no-drop !important;
}
.viewer-fade-enter-active {
  -webkit-animation: viewer-fade-in 0.3s;
  animation: viewer-fade-in 0.3s;
}
.viewer-fade-leave-active {
  -webkit-animation: viewer-fade-out 0.3s;
  animation: viewer-fade-out 0.3s;
}
@keyframes viewer-fade-in {
  0% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes viewer-fade-out {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translate3d(0, -20px, 0);
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>
