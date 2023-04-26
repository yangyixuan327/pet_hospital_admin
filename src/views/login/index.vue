<template xmlns="http://www.w3.org/1999/html">
    <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">欢迎来到虚拟宠物医院学习系统</h3>
      </div>
      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          placeholder="Account"
          name="userName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin">Login</el-button>
      <el-button style="width:100%; margin-left: 0px" type="primary" @click=" showDialog= true ">Register</el-button>
    </el-form>

    <el-dialog class = "register" title="注册" :visible.sync="showDialog" width="50%" center>
      <el-form :model="form" status-icon :rules="registerRules" ref="form">
        <el-form-item class="form-item" label="账号 Account" label-width="130px" prop="account">
          <el-input v-model="form.account" autocomplete="off"/>
        </el-form-item>
        <el-form-item class="form-item" label="用户名 Username" label-width="130px" prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item class="form-item" label="密码 Password" label-width="130px" prop="password">
          <el-input v-model="form.password" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer >
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="dialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {sign_up} from "@/api/user";

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct username'))
        this.validateCheck = false
      } else {
        callback()
        this.validateCheck = true
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
        this.validateCheck = false
      } else {
        callback()
        this.validateCheck = true
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
        this.validateCheck = false
      } else {
        callback()
        this.validateCheck = true
      }
    }
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      userType: 'user',
      showDialog: false,
      form: {
        name: '',
        account: '',
        password: ''
      },
      registerRules: {
        name: [{ trigger: 'blur', validator: validateUsername }],
        account: [{ trigger: 'blur', validator: validateUsername }],
        password: [{ trigger: 'blur', validator: validatePassword2 }]
      },
      validateCheck: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(res => {
            if (res === 404) {
              this.$message({
                message: '登录失败，请检查用户名和密码',
                type: 'error'
              })
              console.log('登录失败!!')
            } else {
              this.$router.push({ path: '/' })
              this.loading = false
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              console.log('登录成功!!')
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
    dialogConfirmOnClicked() {
      if (this.form.account && this.form.name && this.form.password && this.validateCheck) {
        const user = {
          name: this.form.name,
          account: this.form.account,
          password: this.form.password,
          role: 'user'
        }
        sign_up(user).then(response => {
          console.log('Create new user' + response)
          this.$message({
            message: '注册成功',
            type: 'success'
          })
          this.form = []
        })
        this.showDialog = false
      } else if (!this.validateCheck) {
        this.$message({
          message: '请注意格式规范',
          type: 'info'
        })
      } else {
        this.$message({
          message: '请填入完整信息',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
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
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .register {
    .form-item {
      input {
        color: black;
        caret-color: black;
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
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

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
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

  .chooseUser{
    width: 220px;
    position: relative;
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>
