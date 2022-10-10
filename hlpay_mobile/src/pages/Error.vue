<template>
  <q-page class="full-width column no-wrap justify-start fixed">
    <div class="fixed-center full-width">
      <div class="btn-num-box-center ">
        <q-icon name="fa-solid fa-xmark" color="negative" size="64px" />
      </div>
      <div class="btn-num-box-center text-h5 text-weight-bolder q-mt-lg text-negative">支付失败</div>
      <q-item class="items-center full-width q-mt-md ">
        <q-btn size="lg" class="full-width btn-submit-box" @click="closeCurrentWindow" color="primary"> 关闭 </q-btn>
      </q-item>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Error',
  components: {},
  data () {
    return {}
  },
  methods: {
    closeCurrentWindow () {
      setTimeout(function () {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            this.WeixinJSBridge.call('closeWindow') // 安卓手机关闭代码
          },
          false
        )
        this.WeixinJSBridge.call('closeWindow') // 苹果手机关闭代码
      }, 300)
      // 以下是普通浏览器关闭代码
      window.opener = null
      window.open('about:blank', '_top').close()
    }
  }
}
</script>

<style lang="scss">
.btn-num-box-center {
  text-align: center;
}
.btn-submit-box {
  /* Gradient */

  background: radial-gradient(122.27% 198.92% at -22.27% -27.38%, #0070ba 0%, #1546a0 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 24px 48px -18px rgba(21, 70, 160, 0.5);
  border-radius: 20px;
}
</style>
