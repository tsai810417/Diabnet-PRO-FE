<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-aqua" v-show="PatientInfo.Avatar === ''">
            <i class="fal fa-user-alt"></i>
          </span>
          <span class="info-box-icon" v-show="PatientInfo.Avatar !== ''">
            <img v-bind:src="PatientInfo.Avatar">
          </span>
          <div class="info-box-content card-info">
            <span class="info-box-text title">PATIENT Profile</span>
            <span class="info-box-text name">{{PatientInfo.Name}}</span>
            <span class="info-box-text email">{{PatientInfo.Email}}</span>
          </div>
          <!-- /.info-box-content -->
          <div id="InfoLogo" v-if="Logo"><img v-bind:src="Logo"></div>
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
      <div class="col-lg-8 col-md-6 col-xs-12"  data-html2canvas-ignore="false">
        <router-link v-bind:to="{ name:'PatientIndex', params: { SId: PatientInfo.SId }}" class="btn btn-app bg-blue"><i class="fal fa-list-alt"></i> {{ $t('Patient_Btn_LogList') }}</router-link>
        <router-link v-bind:to="{ name:'PatientChart', params: { SId: PatientInfo.SId }}" class="btn btn-app bg-green"><i class="fal fa-th"></i> {{ $t('Patient_Btn_LogChart') }}</router-link>
        <router-link v-bind:to="{ name:'PatientInfo', params: { SId: PatientInfo.SId }}" class="btn btn-app bg-light-blue"><i class="fal fa-address-card"></i> {{ $t('Patient_Btn_PatientInfo') }}</router-link>
        <div class="downBtnArea pull-right" v-if="ShowPdfDown">
          <button type="button" class="btn btn-primary downBtn" id="SetPdf" :data-filename="PdfName"  >
            <i class="fal fa-file-pdf"></i> {{ $t('Base_Btn_Download') }}</button>
        </div>
      </div>
      <!-- /.col -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Patient',
  data () {
    return {
      ShowPdfDown: false,
      PdfName: '',
      GetData: false,
      PatientInfo: {
        SId: '',
        Name: '',
        Email: ''
      },
      Logo: ''
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  computed: {
    vueParent () {
      return this.$parent
    },
    vueRoot () {
      return this.$parent.$parent
    }
  },
  beforeUpdate () {
    if (!this.GetData) {
      this.GetPatientInfo()
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.PatientInfo.SId = this.$route.params.SId
    },
    GetPatientInfo: function () {
      const _this = this
      let searchData = {
        SId: this.PatientInfo.SId,
        GroupSId: this.vueParent.UserInfo.SId
      }
      const sendConfig = {
        method: 'post',
        url: 'Api/Patient/PatientInfo',
        params: searchData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Bearer ' + _this.vueRoot.SetToken.Token
        }
      }
      axios(sendConfig).then(function (r) {
        _this.PatientInfo = r.data
        if (_this.PatientInfo.Name !== '') {
        } else {
          _this.PatientInfo.Name = 'No Name'
        }
        if (_this.PatientInfo.Avatar.indexOf('{') > -1) {
          let ImageObj = JSON.parse(_this.PatientInfo.Avatar)
          _this.PatientInfo.Avatar = ImageObj.url
        }
        _this.GetData = true
        _this.Logo = _this.vueParent.UserInfo.Groups[0].Logo
      }).catch(function (e) {
        console.log(e)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.GetData = false
      vm.GetPatientInfo()
    })
  }
}
</script>

<style>

  div#InfoLogo {
    width: 90px;
    height: 90px;
    position: absolute;
    top: 0;
    right: 15px;
  }

  div#InfoLogo img {
    width: 100%;
    height: auto;
  }
  .info-box-icon>img {
    vertical-align: inherit;
  }
</style>
