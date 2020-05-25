<template>
  <div class="login-container_signup_submit">
    <el-form
      :model="loginForm"
      :rules="loginRules"
      auto-complete="off"
      autocomplete="osdfff"
      class="login-form"
      label-position="left"
      ref="loginForm"
    >
      <div class="title-container">
        <h3 class="title">{{curType === '1' ? '注册' : '忘记密码'}}</h3>
      </div>

      <el-form-item prop="tel">
        <el-input
          auto-complete="off"
          autocomplete="off"
          cur_="text"
          name="tel"
          placeholder="请输入手机号"
          ref="tel"
          v-model="loginForm.tel"
        />
      </el-form-item>

      <el-form-item class="ident-code" prop="validCode" style="position:relative">
        <el-input
          auto-complete="off"
          autocomplete="off"
          cur_="number"
          name="validCode"
          placeholder="请输入短信验证码"
          ref="validCode"
          style="width:50%"
          v-model="loginForm.validCode"
        />
        <el-button
          :plain="canClick"
          @click="getIdentCode"
          cur_="info"
          style="position:absolute;right:4px;top:50%;transform:translateY(-50%)"
        >{{canGetIdentCode?'点击获取短信验证码':identBtnText}}</el-button>
      </el-form-item>

      <el-form-item prop="userName" v-if="curType === '1'">
        <el-input
          auto-complete="off"
          autocomplete="off"
          cur_="text"
          name="userName"
          placeholder="请输入姓名"
          ref="userName"
          v-model="loginForm.userName"
        />
      </el-form-item>

      <el-form-item prop="idNo" v-if="curType === '1'">
        <el-input
          auto-complete="off"
          autocomplete="off"
          cur_="text"
          name="idNo"
          placeholder="请输入身份证号码"
          ref="idNo"
          v-model="loginForm.idNo"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :type="passwordType"
          auto-complete="off"
          autocomplete="off"
          name="password"
          placeholder="请输入密码"
          ref="password"
          v-model="loginForm.password"
        />
        <span @click="showPwd(1)" class="show-pwd">
          <i class="fas fa-eye" v-if="passwordType === 'text'"></i>
          <i class="fas fa-eye-slash" v-else></i>
        </span>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          :type="passwordType2"
          auto-complete="off"
          autocomplete="off"
          name="password"
          placeholder="请确认密码"
          ref="password2"
          v-model="loginForm.password2"
        />
        <span @click="showPwd(2)" class="show-pwd">
          <i class="fas fa-eye" v-if="passwordType2 === 'text'"></i>
          <i class="fas fa-eye-slash" v-else></i>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        @click.native.prevent="handleLogin"
        size="small"
        style="width:100%;margin-bottom:30px;"
        type="primary"
      >{{curType === '1' ? '注册' : '提交'}}</el-button>
      <div class="small_notice">
        已经注册？
        <span @click="login">登录</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request.js'
import md5 from 'js-md5'
import * as z from '@/utils/com.js'

export default {
  name: 'signup_submit',
  data() {
    return {
      curType: '1',
      canGetIdentCode: true,
      identBtnText: '',
      loginForm: {
        tel: '',
        password: '',
        password2: '',
        validCode: '',
        userName: '',
        idNo: ''
      },
      loginRules: {
        tel: [{
          required: true,
          trigger: 'blur',
          message: '请输入正确的手机格式',
          pattern: /^1[3456789]\d{9}$/
        }],
        validCode: [{
          required: true,
          trigger: 'blur',
          message: '请输入验证码'
        }],
        userName: [{
          required: true,
          trigger: 'blur',
          message: '请输入姓名'
        }],
        idNo: [{
          required: true,
          trigger: 'blur',
          message: '请输入身份证号码'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          message: '请输入密码'
        }],
        password2: [{
          required: true,
          trigger: 'blur',
          message: '请确认密码'
        }]
      },
      passwordType: 'password',
      passwordType2: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,

      canClick: true
    }
  },
  mounted() {
    this.curType = this.$route.query.purpose
  },
  watch: {
    $route: {
      handler(route) {
        this.curType = route.query.purpose
      },
      immediate: true
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd(num) {
      if (num === 1) {
        if (this.passwordType === 'text') {
          this.passwordType = 'password'
        } else {
          this.passwordType = 'text'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      }
      if (num === 2) {
        if (this.passwordType2 === 'text') {
          this.passwordType2 = 'password'
        } else {
          this.passwordType2 = 'text'
        }
        this.$nextTick(() => {
          this.$refs.password2.focus()
        })
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(validate => {
        if (validate) {
          if (this.loginForm.password !== this.loginForm.password2) {
            return this.$message.error('密码确认有误，请重新输入')
          }
          this.loading = true
          let parm = {}
          if (this.curType === '1') {
            parm = {
              loginName: this.loginForm.tel,
              password: this.loginForm.password
                ? md5(this.loginForm.password)
                : '',
              confirmPwd: this.loginForm.password2
                ? md5(this.loginForm.password2)
                : '',
              validCode: this.loginForm.validCode,
              userName: this.loginForm.userName,
              idNo: this.loginForm.idNo
            }
          } else {
            parm = {
              loginName: this.loginForm.tel,
              password: this.loginForm.password
                ? md5(this.loginForm.password)
                : '',
              confirmPwd: this.loginForm.password2
                ? md5(this.loginForm.password2)
                : '',
              validCode: this.loginForm.validCode,
            }
          }
          request({
            url:
              this.curType === '1'
                ? '/sys/register/registeredUser'
                : '/org/orguser/modifypassword',
            method: 'post',
            data: parm
          })
            .then(res => {
              if (res.msg === 'success') {
                if (this.curType === '1') {
                  this.$message.success('注册成功')
                } else {
                  this.$message.success('修改密码成功')
                }
              } else {
                this.$message.success(res.msg)
              }
              setTimeout(() => {
                this.$refs.loginForm.clearValidate()
                this.$refs.loginForm.resetFields()
                this.canGetIdentCode = true
                this.$router.replace({ path: '/login' })
              }, 1000)

              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getIdentCode() {
      if (!this.loginForm.tel) {
        return this.$message.warning('请输入手机号')
      }
      if (!this.canGetIdentCode) {
        return false
      }
      z.ld()
      request({
        url: 'sys/sms/getsendsmscode',
        method: 'post',
        data: { phone: this.loginForm.tel }
      })
        .then(() => {
          z.lc()
          this.$message.success('短信发送成功，请在手机上查收')
          this.setBtnStatus()
        })
        .catch(() => {
          z.lc()
          this.$message.error('短信发送失败，请尝试重新发送')
        })
    },
    setBtnStatus() {
      this.canGetIdentCode = false
      this.identBtnText = '60秒后重新发送'
      let s = 59

      const timer = setInterval(() => {
        this.identBtnText = `${s}秒后重新发送`
        s--
        if (s <= 0) {
          window.clearInterval(timer)
          this.canGetIdentCode = true
        }
      }, 1000)
    },
    login() {
      this.$refs.loginForm.clearValidate()
      this.$refs.loginForm.resetFields()
      this.canGetIdentCode = true
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container_signup_submit .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container_signup_submit {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container_signup_submit {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-cur_ {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.small_notice {
  font-size: 14px;
  color: #fff;
  text-align: right;
  line-height: 2em;
  span {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
