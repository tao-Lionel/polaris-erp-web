<template>
  <div class="error404">
    <div class="error404-body-con">
      <el-card class="box-card">
        <div class="error404-body-con-title">4<span>0</span>4</div>
        <p class="error404-body-con-message">YOU&nbsp;LOOK&nbsp;LOST</p>
        <div class="error404-btn-con">
          <el-button @click="goHome" size="large" type="text">返回首页</el-button>
          <el-button @click="backPage" size="large" class="con-right" type="primary">返回上一页</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error404",
  methods: {
    backPage() {
      this.$router.go(-2)
    },
    goHome() {
      this.$router.push({
        path: "/"
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes error404animation {
  0% {
    transform: rotateZ(0deg);
  }
  20% {
    transform: rotateZ(-60deg);
  }
  40% {
    transform: rotateZ(-10deg);
  }
  60% {
    transform: rotateZ(50deg);
  }
  80% {
    transform: rotateZ(-20deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.error404 {
  &-body-con {
    width: 700px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &-title {
      text-align: center;
      font-size: 240px;
      font-weight: 700;
      color: #2d8cf0;
      height: 260px;
      line-height: 260px;
      margin-top: 40px;
      span {
        display: inline-block;
        color: #19be6b;
        font-size: 230px;
        animation: error404animation 3s ease 0s infinite alternate;
      }
    }
    &-message {
      display: block;
      text-align: center;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: 12px;
      color: #dddde2;
    }
  }
  &-btn-con {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 40px;
    button {
      width: 200px;
    }
    .con-right {
      margin-left: 40px;
    }
  }
  @media screen and (max-width: 992px) {
    .error404-body-con {
      width: 100%;
      height: auto;
      &-title {
        font-size: 150px;
        margin-top: 0px;
        height: 220px;
        line-height: 220px;
        span {
          font-size: 150px;
        }
      }
      &-message {
        font-size: 20px;
        letter-spacing: 9px;
      }
    }
  }
  @media screen and (max-width: 490px) {
    .error404-body-con {
      &-title {
        font-size: 110px;
        height: 180px;
        line-height: 180px;
        span {
          font-size: 110px;
        }
      }
      &-message {
        letter-spacing: 5px;
      }
    }
    .error404-btn-con {
      width: 100%;
      .con-right {
        display: block;
        margin: 0 auto;
      }
    }
  }
}
</style>
