<template>
  <div>
    <!-- Main Header -->
    <header class="main-header">
      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <div class="logo-img">
          <img src="static/dist/img/logo_long.png">
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar" data-html2canvas-ignore="false">

      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- Sidebar Menu -->
        <ul class="sidebar-menu" data-widget="tree">
          <!-- Optionally, you can add icons to the links -->
          <li>
            <router-link v-bind:to="{ name: 'Home', params: { Page: 1}}">
              <i class="fal fa-home fa-lg"></i>
              <span>{{ $t('Base_Menu_GoHome') }}</span></router-link>
          </li>
          <li>
            <a href="#">
            <i class="fal fa-language fa-lg"></i>
            <span>語系</span>
            </a>
            <ul class="treeview-menu">
              <li>
                <a href="#" v-on:click="setLocal('en')">
                  <span>English</span>
                </a>
              </li>
              <li>
                <a href="#" v-on:click="setLocal('zh-tw')">
                  <span>繁體中文</span>
                </a>
              </li>
              <li>
                <a href="#" v-on:click="setLocal('zh-cn')">
                  <span>簡體中文</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" v-on:click="LogoutUser">
              <i class="fal fa-sign-out-alt fa-lg"></i>
              <span>{{ $t('Base_Menu_Logout') }}</span>
            </a>
          </li>
        </ul>
        <!-- /.sidebar-menu -->
      </section>
      <!-- /.sidebar -->
    </aside>
    <div class="content-wrapper">
      <section class="content-header">
        <h1 v-if="ViewTitle == ''">
          {{ $t('Base_Title_Home') }}<small> - {{ $t('Patient_Title_Data') }}</small>
        </h1>
        <h1 v-else v-html="ViewTitle">
        </h1>
      </section>
      <section class="content container-fluid">
        <router-view></router-view>
      </section>
    </div>
    <!-- Main Footer -->
    <footer class="main-footer">
      <!-- To the right -->
      <div class="pull-right hidden-xs">
        DIABNEXT - Strictly Confidential
      </div>
      <!-- Default to the left -->
      <strong>Copyright &copy; 2018
        <a href="#">DIABNEXT</a>.</strong> All rights reserved.
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Contents',
  data () {
    return {
      ViewTitle: '',
      GetData: false,
      UserInfo: {
        SId: '',
        Name: 'China',
        Group: 'Test',
        Avatar: '',
        Logo: '',
        GroupSid: '',
        Groups: []
      },
      BloodGlucoseUnitModel: true,
      BloodGlucoseUnit: 'mg/dL',
      BloodGlucoseDivide: 1,
      UserGroups: [
        {
          SId: '',
          Name: 'Test'
        }
      ]
    }
  },
  created () {
    $(function () {
      $('html').attr('style', 'height: auto; min-height: 100%;')
      $('body').removeAttr('class').attr('class', 'skin-blue sidebar-mini sidebar-collapse').attr('style', 'height: auto; min-height: 100%;').resize()
    })
    if (this.vueRoot.SetToken === null) {
      this.$router.push('/')
    }
    let getTempData = this.$ls.get('tempUserInfo')
    if (!getTempData) {
      this.GetData = false
      this.GetUserInfo()
    } else {
      this.GetData = true
      this.UserInfo = getTempData
    }
  },
  mounted () {
    if (this.vueRoot.SetToken !== null) {
      if (!this.GetData) {
        this.GetUserInfo()
      }
    } else {
      this.$router.push('/')
    }
  },
  computed: {
    vueRoot () {
      return this.$parent
    }
  },
  watch: {
    BloodGlucoseUnit (val) {
      if (val === 'mg/dL') {
        this.BloodGlucoseDivide = 1
        this.BloodGlucoseUnitModel = true
      } else {
        this.BloodGlucoseDivide = 18
        this.BloodGlucoseUnitModel = false
      }
    }
  },
  methods: {
    GetUserInfo () {
      const _this = this
      if (_this.vueRoot.SetToken) {
        const sendConfig = {
          method: 'get',
          url: 'Api/Login',
          params: {SId: _this.vueRoot.SetToken.SId},
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Bearer ' + _this.vueRoot.SetToken.Token
          }
        }
        axios(sendConfig).then(function (r) {
          _this.UserInfo = r.data
          _this.$ls.set('tempUserInfo', _this.UserInfo)
        }).catch(function (e) {
          console.log(e)
        })
      }
    },
    LogoutUser () {
      this.$ls.clear()
      this.vueRoot.SetToken = null
      this.$router.push('/')
    },
    setLocal (setLang) {
      this.$i18n.locale = setLang
    },
    ChnageBloodGlucoseUnit () {
      this.BloodGlucoseUnit = this.BloodGlucoseUnitModel ? 'mg/dL' : 'mmol/l'
    },
    CalcBloodGlucose (Value) {
      let CalcValue = (Value / this.BloodGlucoseDivide).toFixed(2)
      return CalcValue.toString().replace('.00', '')
    },
    ShowBloodGlucoseTitle (Title) {
      return Title.replace('mg/dL', this.BloodGlucoseUnit).replace('mg/dl', this.BloodGlucoseUnit)
    }
  }
}
</script>
