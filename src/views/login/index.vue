<template>
  <div class="login-container">
    <img src="/static/login/logo1.png" class="logo1" />
    <img src="/static/login/logo2.png" class="logo2" />
    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left"
      :validate-on-rule-change="true">
      <div class="loginFormBg">

      </div>

      <div class="loginFormQrcode" v-show="loginType==='qrcode'">
        <!-- <img src="/static/login/title1.png" style="height:26px;" /> -->
        <div class="title_name">易得智慧建筑实名制</div>
        <div id="qrcode_container"></div>
        <div class="qrcode_question">
          <router-link to="wxbindtip" replace style="color:#00b7d3">还未绑定手机号码？</router-link>
        </div>
      </div>
      <div class="loginFormContent" v-show="loginType==='mobile'">
        <div class="title-container">
          <!-- <img src="/static/login/title1.png" style="height:26px;" /> -->
          <div class="title_name">易得智慧建筑实名制</div>
        </div>
        <div style="padding:0px 35px 0px 35px">
          <el-form-item prop="username" :rules="ruleUsername">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="loginForm.username" :placeholder="$t('login.username')" name="username" type="text"
              auto-complete="on" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item prop="password" :rules="rulePassword">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$t('login.password')"
                  name="password" auto-complete="on" @keyup.enter.native="handleLogin" style="width:65%;" />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon icon-class="eye" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-button type="primary" @click="getSmsCode" class="btnSmsCode"
                :disabled="btnSmsCode.disable || time > 0">{{
                btnSmsCodeText }}</el-button>
            </el-col>
          </el-row>
          <el-button :loading="loading" type="primary" class="btnLogin" style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin">登 录</el-button>
        </div>

      </div>
      <!-- <div class="loginFormType">
        <el-tooltip class="item" effect="dark" content="使用二维码登录" placement="top">
          <font-awesome-icon @click="switchLoginType('qrcode')" v-show="loginType==='mobile'" icon="qrcode" size="2x"
            pull="right" :style="{ color: 'white' ,cursor:'pointer'}" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="使用手机短信验证码登录" placement="top">
          <font-awesome-icon @click="switchLoginType('mobile')" v-show="loginType==='qrcode'" icon="mobile-alt" size="2x"
            pull="right" :style="{ color: 'white' ,cursor:'pointer'}" />
        </el-tooltip>

      </div> -->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
  import request from '@/utils/request'
  import moment from 'moment'
  import {
    getSmsCodeTime,
    setSmsCodeTime,
    removeSmsCodeTime
  } from '@/utils/smscode'
  import {
    validateMobileNumber
  } from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  // import SocialSign from './socialsignin'

  export default {
    name: 'Login',
    components: {
      LangSelect,
      // SocialSign
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateMobileNumber(value)) {
          callback(new Error('请输入有效的手机号码'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('短信验证码至少为6位数字'))
        } else {
          callback()
        }
      }
      return {
        loginType: 'mobile', // mobile qrcode
        loginForm: {
          username: '',
          password: ''
        },
        time: 0,
        second: 0,
        initSmsCodeTime: 60, //倒计时初始化时间
        smscodeTime: 0,
        ruleUsername: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        rulePassword: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        smsCodeRule: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        btnSmsCode: {
          disable: false
        },
        loadingFull: null
      }
    },
    computed: {
      btnSmsCodeText: function () {
        return this.time > 0 ? this.time + 's 后重新获取' : '获取短信验证码';
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)

      const _smscodeTime = getSmsCodeTime()
      if (_smscodeTime !== undefined) {
        const _nowX = moment().format('X')
        if (_nowX - _smscodeTime < this.initSmsCodeTime) {
          this.second = this.initSmsCodeTime - (_nowX - _smscodeTime)
          this.start()
        } else {
          this.second = this.initSmsCodeTime
          removeSmsCodeTime()
        }
      } else {
        this.second = this.initSmsCodeTime
      }
    },
    mounted() {
      // let id = this.$route.params.id

      // console.log(window.location.href)
      const code = this.getQueryString("code")
      const state = this.getQueryString("state")
      console.log(code, state)

      if (code !== '' && state !== '') {
        const param = {
          code: code,
          state: state
        }
        this.loadingFull = this.$loading({
          lock: true,
          text: '正在验证登录，请稍后...',
          // spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          customClass: 'loadLoginCss'
        });
        this.$store.dispatch('loginByWXQRCode', param).then((res) => {
          this.loading = false
          // console.log('result', res)
          this.loadingFull.close();
          if (res.status === 'success') {
            window.location.href = '/#/main';
          } else {
            if (res.status_code === '1014' || res.status_code === '1009') {
              this.$router.push({
                name: 'wxbindtip',
                params: {
                  status_code: res.status_code
                }
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          }



        }).catch(() => {
          this.loading = false
        })
      } else {

      }
      // 设置语言
      this.$store.dispatch('setLanguage', 'zh')
      let _WxLogin = new WxLogin({
        self_redirect: false,
        id: "qrcode_container",
        appid: "wx8b4f74263bc9ba20",
        scope: "snsapi_login",
        redirect_uri: "http://admin.man.yidebim.com:8898/",
        state: "qrcode",
        style: "",
        href: "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsKICBkaXNwbGF5OiBub25lOwp9CgouaW1wb3dlckJveCAucXJjb2RlIHsKICB3aWR0aDogMTYwcHg7CiAgYm9yZGVyOiAwcHg7Cn0KCi5pbXBvd2VyQm94IC5zdGF0dXNfdHh0LAouaW1wb3dlckJveCAuc3RhdHVzIHAgewogIGNvbG9yOiB3aGl0ZTsKfQo="
      });


    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      getQueryString(name) {
        let url = window.location.href.split('#')[0];
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let num = url.indexOf("?");
        url = url.substr(num + 1);
        let result = url.substr(0).match(reg);
        if (result != null) {
          return unescape(result[2]);
        } else {
          return '';
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false

              // console.log('this.$route.query.from', this.$route.query.from)
              let from = this.$route.query.from
              console.log('from1234', from)
              if (from !== undefined && from !== '') {
                this.$router.push({
                  path: from
                })
              } else {
                this.$router.push({
                  path: '/main'
                })
              }

            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      switchLoginType(type) {
        this.loginType = type
        console.log('type', type)
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      },
      getSmsCode() {
        setSmsCodeTime(moment().format('X'))
        this.$refs.loginForm.clearValidate(['username', 'password'])
        this.$refs.loginForm.validateField('username', valid => {
          if (valid === '') {
            this.start()
            this.$store.dispatch('GetSmsCode', this.loginForm.username).then(() => {
              this.$message({
                message: '短信验证码已经发出！',
                type: 'success'
              })
            }).catch(() => {
              this.stop()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
        // this.$refs.loginForm.validateField('username', valid => {
        //   if (valid === '') {
        //     request({
        //       url: '/api/sms/code',
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json'
        //       },
        //       data: {
        //         "method": "get",
        //         "user": this.loginForm.username,
        //         "code": "",
        //         "ver": "10",
        //       }
        //     })

        //   }
        // });

      },
      timer: function () {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        } else {
          this.btnSmsCode.disabled = false;
        }
      },
      start: function () {
        this.time = this.second;
        this.timer();
      },
      stop: function () {
        this.time = 0;
        this.btnSmsCode.disabled = false;
      }
    }
  }

</script>

<style lang="scss">
  @import "./index";

</style>
