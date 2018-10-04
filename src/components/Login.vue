<template>
  <div class="login-box center-block">
    <div class="login-logo">
      <router-link v-bind:to="{ name: 'Home'}"><img src="static/dist/img/logo_50.png" style="width: 310px;"></router-link>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">{{ $t('Login_Title_loginBox') }}</p>
      <form action="" method="post">
        <div class="form-group has-feedback">
          <input type="email" class="form-control" placeholder="Email" v-model="LoginInfo.userName">
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" class="form-control" placeholder="Password" v-model="LoginInfo.passWord">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
          <div class="col-xs-8">
            <div class="checkbox icheck">
              <p><label>
                <input type="checkbox"> {{ $t('login_Label_MemEmail') }}
              </label></p>
              <p><label>
                <input type="checkbox"> {{ $t('Login_Label_MemPassword') }}
              </label></p>
            </div>
          </div>
          <!-- /.col -->
          <div class="col-xs-4">
            <button type="button" class="btn btn-primary btn-block btn-flat" v-on:click="GoLogin">{{ $t('Login_Btn_Login') }}</button>
          </div>
          <!-- /.col -->
        </div>
      </form>

    </div>
    <!-- /.login-box-body -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      LoginInfo: {
        userName: '',
        passWord: ''
      }
    }
  },
  created () {
    $(function () {
      $('body').removeAttr('class').addClass('hold-transition').addClass('login-page')
      $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' /* optional */
      })
    })
    if (this.vueRoot.SetToken) {
      this.$router.push('Home/1')
    }
  },
  computed: {
    vueRoot () {
      return this.$parent
    }
  },
  methods: {
    GoLogin: function () {
      const _this = this
      axios({
        method: 'post',
        url: 'Api/Login',
        params: {username: this.LoginInfo.userName, password: this.LoginInfo.passWord},
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(function (r) {
        _this.vueRoot.SetToken = r.data
        if (_this.vueRoot.SetToken) {
          _this.$ls.set('SetToken', _this.vueRoot.SetToken)
          _this.$router.push('Home/1')
        } else {
          alert('登入失敗')
        }
      }).catch(function (e) {
        console.log(e)
      })
    }
  }
}
</script>
