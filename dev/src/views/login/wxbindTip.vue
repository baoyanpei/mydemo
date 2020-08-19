<template>
  <div class="login-tip-container">
    <a href="/#/login">
      <img src="/static/login/logo5.png" class="logo1" />
    </a>
    <!-- <img src="/static/login/logo4.png" class="logo2" /> -->
    <div class="wx-bind-border">
      <div class="wx-bind-container">
        <div class="loginTipForm">
          <div class="title">
            {{status_desc}}
            <div style="font-size:14px;">
              <a href="/#/login" style="color:#00b7d3">
                已经绑定,重新登录>>
              </a>
            </div>
          </div>
          <div>1.您未关注“易正信息”微信公众号，扫描下方二维码关注“易正信息”</div>
          <div style="text-align: center"><img src="/static/login/tips/wx_qrcode.jpg" width="260" /></div>
          <div>2.点击公众号“我的”按钮输入手机号后，注册账号</div>
          <div style="text-align: center"><img src="/static/login/tips/wx_login.png" width="260" /></div>
          <div>3.注册成功后，重新扫码<a href="/#/login" style="color:#00b7d3">登录</a></router-link>
          </div>
          <div id="qrcode_container_tip" style="text-align: center"></div>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  export default {
    name: 'WXBindTip',
    components: {},
    data() {

      return {
        status_code: '',
        status_desc: ''
      }
    },
    computed: {

    },
    created() {

    },
    mounted() {
      console.log('this.$route.params', this.$route.params)

      this.status_code = this.$route.params.status_code
      console.log('this.status_code', this.status_code)
      if (this.status_code !== undefined) {
        if (this.status_code === '1009') {
          this.status_desc = '您还未绑定手机号码？'
        } else if (this.status_code === '1014') {
          this.status_desc = '您还没有关注公众号'
        } else {
          this.status_desc = '您还未绑定手机号码？'
        }
      }else{
        this.status_desc = '您还未绑定手机号码？'
      }
      let _WxLogin = new WxLogin({
        self_redirect: false,
        id: "qrcode_container_tip",
        appid: "wx8b4f74263bc9ba20",
        scope: "snsapi_login",
        redirect_uri: "http://admin.yidebim.com/",
        state: "qrcode",
        style: "",
        href: ""
      });

    },
    destroyed() {},
    methods: {

    }
  }

</script>

<style lang="scss">
  @import "./wxbindTip";

</style>
