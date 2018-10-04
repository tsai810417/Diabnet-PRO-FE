<template>
  <div class="row">
    <div class=" col-md-12 col-lg-5">
      <div class="box box-default color-palette-box">
        <div class="box-header bg-gray-light">
          <h3 class="box-title"><i class="fal fa-info-square"></i> {{ $t('Patient_List_Title_PatientInfo') }}</h3>
        </div>
        <div class="box-body">
          <table class="table table-striped table-info">
            <tbody>
            <tr><th>{{ $t('Patient_Info_Title_Email') }}：</th><td>{{ShowInfo.Email}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_FirstName') }}：</th><td>{{ShowInfo.FirstName}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_LastName') }}：</th><td>{{ShowInfo.LastName}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_Gender') }}：</th><td>{{ShowInfo.Gender === 'M' ? $t('Patient_Gender_Male') : $t('Patient_Gender_Female')}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_BirthDay') }}：</th><td>{{SetDateShow(ShowInfo.Birthdate)}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_Weight') }}：</th><td>{{ShowInfo.Weight}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class=" col-md-12 col-lg-7">
      <div class="box box-default color-palette-box">
        <div class="box-header bg-gray-light">
          <h3 class="box-title"><i class="fal fa-stethoscope"></i> {{ $t('Patient_List_Title_Treatmentdata') }}</h3>
        </div>
        <div class="box-body">
          <table class="table table-striped table-info">
            <tbody>
            <tr><th>{{ $t('Patient_Info_Title_DiabeteCategory') }}：</th><td>{{ShowInfo.DiabeteCategory}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_YearOfDiagnosis') }}：</th><td>{{ShowInfo.Diagnosisyear}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_LowBloodGlucose') }}：</th><td>{{ShowInfo.LowBloodGlucose}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_HighBloodGlucose') }}：</th><td>{{ShowInfo.HighBloodGlucose}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_BloodGlucoseUnit') }}：</th><td>{{ShowInfo.BloodGlucoseUnit}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_InsulinPen') }}：</th><td>{{ShowInfo.InsulinPen}}</td></tr>
            <tr><th>{{ $t('Patient_Info_Title_BloodGlucoseMeters') }}：</th><td>{{ShowInfo.BloodGlucoseMeters}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-12">
      <div class="box">
        <div class="box-body bg-gray" v-html="$t('Patient_Info_Message')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'PatientInfo',
  data () {
    return {
      GetData: false,
      ShowInfo: {
        Email: '',
        FirstName: '',
        LastName: '',
        Gender: '',
        FamilyHistory: '',
        DiabeteCategory: '',
        InsulinTherapy: '',
        HighBloodGlucose: 0,
        LowBloodGlucose: 0,
        BloodGlucoseUnit: '',
        Latitude: 0,
        Longitude: 0,
        Pill: '',
        Avatar: {},
        InsulinPen: '',
        BloodGlucoseMeters: '',
        Birthdate: '',
        Diagnosisyear: 0,
        Weight: 0
      }
    }
  },
  beforeUpdate () {
    if (!this.GetData) {
      this.GetPatientInfo()
    }
  },
  created () {
    this.$parent.ShowPdfDown = false
  },
  computed: {
    vueParent () {
      return this.$parent
    },
    vueRoot () {
      return this.$parent.$parent
    },
    vueBase () {
      return this.$parent.$parent.$parent
    }
  },
  methods: {
    SetDateShow (DateString) {
      if (DateString) {
        return moment(DateString).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    GetPatientInfo () {
      this.vueRoot.ViewTitle = this.vueParent.PatientInfo.Name + '<small>' + this.$i18n.t('Patient_Btn_PatientInfo') + '</small>'
      const _this = this
      let searchData = {
        SId: this.vueParent.PatientInfo.SId,
        GroupSId: this.vueRoot.UserInfo.SId
      }
      const sendConfig = {
        method: 'post',
        url: 'Api/Patient/PatientTherapy',
        params: searchData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Bearer ' + _this.vueBase.SetToken.Token
        }
      }
      axios(sendConfig).then(function (r) {
        _this.ShowInfo = r.data
        _this.GetData = true
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
