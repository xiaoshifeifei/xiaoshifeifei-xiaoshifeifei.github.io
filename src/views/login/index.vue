<template>
  <div class="outer" ref="outer1">
    <div class="login-container">
      <header class="header">
        <img alt class="image" src="@/assets/img/logs.png">
        <div class="header-title">运输管理系统</div>
      </header>
      <transition mode="in-out" name="form-fade">
        <el-form
          :model="loginForm"
          :rules="loginRules"
          :validate-on-rule-change="false"
          auto-complete="on"
          class="login-form"
          label-position="left"
          ref="loginForm"
          v-show="isShowForm"
        >
          <div class="title-container">
            <div class="title">运输管理系统</div>
            <!-- <lang-select class="set-language"/> -->
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <i class="fas fa-user"></i>
            </span>
            <el-input
              auto-complete="on"
              clearable
              maxlength="20"
              name="username"
              placeholder="手机号"
              ref="submit"
              type="text"
              v-model="loginForm.username"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <i class="fas fa-key"></i>
            </span>
            <el-input
              :type="passwordType"
              auto-complete="on"
              clearable
              name="password"
              placeholder="密码"
              v-model="loginForm.password"
            />
            <span @click="showPwd" class="show-pwd">
              <i class="fas fa-eye" v-if="eyeshow==10"></i>
              <i class="fas fa-eye-slash" v-if="eyeshow==20"></i>
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            @click="sublogin"
            @keyup:13="sublogin"
            style="width:100%;margin-bottom:30px;"
            type="primary"
          >登录</el-button>

          <div class="other-op">
            <span @click="gotoRegister('1')">注册账号</span>
            <span @click="gotoRegister('2')">忘记密码</span>
          </div>
        </el-form>
      </transition>
      <div class="copyright">
        版权所有：福建众诚高科信息科技有限公司
        <div>© 2019 运输管理系统</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import md5 from 'js-md5'
import request from '@/utils/request.js'

export default {
  name: 'Login',
  data() {
    return {
      isShowForm: false,
      validatecode: '',
      userData: {},
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ]
      },
      passwordType: 'password',
      loading: false,
      eyeshow: 20
    }
  },
  mounted() {
    this.isShowForm = true
    this.$refs.outer1.addEventListener(
      'keyup',
      e => {
        if (e.keyCode === 13) {
          this.sublogin()
        }
      },
      false
    )
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.eyeshow = 10
      } else {
        this.passwordType = 'password'
        this.eyeshow = 20
      }
    },
    sublogin() {
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('roleRootData')

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log(111)

          z.ld()
          request({
            url: '/sys/login/user',
            method: 'post',
            params: {
              username: this.loginForm.username,
              password: this.loginForm.password
                ? md5(this.loginForm.password)
                : '',
              passwordNew: this.loginForm.password
                ? md5(this.loginForm.password)
                : ''
            }
          })
            .then(res => {
              console.log('res返回的请求数据',res)

              this.userData = res.data
              this.$store.dispatch('LogOn', this.userData.token)
              this.$router.push({ path: '/' })
              z.lc()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },
    gotoRegister(num) {
      // num 1注册 2忘记密码
      this.$router.replace({
        path: '/signupSubmit',
        query: { purpose: num }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #666;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
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
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #666 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__content {
    background-color: #fff !important;
    max-height: 50px;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-input__inner {
    height: 100%;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
$dark_gray: #889aa4;
$light_gray: #666;
.outer {
  width: 100%;
  height: 100%;
}
header.header {
  height: 9%;
  display: flex;
  align-items: center;
  max-height: 80px;
  .header-title {
    margin-left: 10px;
    font-size: 24px;
    line-height: 1em;
    text-indent: 20px;
    border-left: 2px solid #38a8ff;
    color: #38a8ff;
    flex-shrink: 0;
    margin-top: 1%;
  }

  .image {
    width: 300px;
    height: 70px;
    margin-left: 10%;
    margin-top: 1%;
  }
}
.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url(../../assets/img/car.jpg);
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  .login-form {
    position: absolute;
    top: 25.8%;
    right: 10%;
    width: 416px;
    height: 324px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    background-color: #fff;
    max-height: 400px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
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
    height: 40px;
    .title {
      width: 100%;
      font-size: 16px;
      color: #333;
      font-family: 'Microsoft Yahei';
      line-height: 40px;
      text-align: center;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
    }
  }
  .show-pwd {
    position: absolute;
    right: 5px;
    top: 12px;
    font-size: 16px;
    // color: $dark_gray;
    color: black;
    cursor: pointer;
    user-select: none;
  }
}

.login #captcha {
  //   width: 300px;
  width: 100%;
  margin-bottom: 20px;
  display: inline-block;
}

.login .show {
  display: block;
}

.login .hide {
  display: none;
}

.login #notice {
  color: red;
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}

.copyright {
  position: absolute;
  left: 50%;
  bottom: 2%;
  transform: translateX(-50%);
  color: 888;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
  line-height: 1.2em;
}
.other-op {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  margin: 0 auto;
  span {
    line-height: 1em;
    text-align: center;
    color: #409eff;
    padding: 0px 10px;
    cursor: pointer;
  }
  span:first-child {
    border-right: 2px solid #409eff;
  }
}
</style>
