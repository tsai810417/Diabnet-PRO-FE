<template>
<div>
  <div class="box box-default color-palette-box" data-html2canvas-ignore="false">
    <div class="box-header bg-gray-light">
      <div class="col-sm-6">
        <div class="form-group">
          <label>{{ $t('Patient_Label_SearchRange') }}:</label>
          <div class="input-group">
            <div class="input-group-addon">
              <i class="fa fa-calendar"></i>
            </div>
            <input type="text" class="form-control pull-right" id="reservation">
            <span class="input-group-btn">
                        <button type="button" class="btn btn-info btn-flat" v-on:click="SetDateRange">{{ $t('Base_Btn_Search') }}</button>
                      </span>
          </div>
          <!-- /.input group -->
        </div>
      </div>
      <div class="col-sm-6">
        <div class="input-group pull-right">
          <div class="form-group">
            <label>{{ $t('Patient_Label_ShowRange') }}:</label>
            <div class="btn-group">
              <template v-for="(DateInfo,DateIndex) in getDateList">
                <button type="button" class="btn btn-default" v-bind:class="{ active: DateInfo.IsAction}" v-bind:key="DateIndex" v-on:click="SetDateRangeButton(DateInfo.Value)">{{DateInfo.Name}}</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-body row">
      <template v-for="(AvgInfo, AvgIndex) in ResultData.AvgData">
        <div class="col-sm-4 text-center" v-bind:key="AvgIndex" v-if="AvgInfo.Value != null">
          <div class="circle-area " v-bind:class="{ 'circle-small': AvgInfo.Kind != 2 }">
            <div class="circle-text " v-bind:class="{ 'circle-blue': AvgInfo.Kind != 2,'circle-yellow': AvgInfo.Kind === 2 }">
              <label>{{Math.round(AvgInfo.Value)}}</label>
              <div>{{getUnit(AvgInfo.Kind)}}</div>
            </div>
          </div>
          <label>Avg/Day</label>
        </div>
      </template>
    </div>
  </div>
  <div class="box box-default color-palette-box">
    <div class="box-header bg-gray-light">
      <h3 class="box-title">{{ $t('Patient_List_Title_LogChart') }}</h3>
      <div class="box-tools">
        <div class="pull-left UnitChange">
          <label for="ChangeUnit">{{ $t('Patient_Info_Title_BloodGlucoseUnit') }}:</label>
          <select id="ChangeUnit" v-model="vueRoot.BloodGlucoseUnit">
            <option value="mg/dL">mg/dl</option>
            <option value="mmo/l">mmo/l</option>
          </select>
        </div>
        <ul class="info-list pull-right">
          <li class="bg-bs-red">{{ $t('Patient_logChart_ToolTip_LowBloodGlucose') }}</li>
          <li class="bg-bs-blue">{{ $t('Patient_logChart_ToolTip_BloodGlucose') }}</li>
          <li class="bg-bs-yellow">{{ $t('Patient_logChart_ToolTip_HighBloodGlucose') }}</li>
          <li class="bg-bs-green">{{ $t('Patient_logChart_ToolTip_Insulin') }}</li>
          <li class="bg-bs-black">{{ $t('Patient_logChart_ToolTip_Calories') }}</li>
        </ul>
      </div>
    </div>
    <div class="box-body table-responsive no-padding">
      <table class="table table-bordered table-striped table-block-view">
        <tbody>
        <tr class="bg-custom-blue">
          <th>{{ $t('Patient_logChart_Title_logDate') }}</th>
          <th>12{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>1{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>2{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>3{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>4{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>5{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>6{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>7{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>8{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>9{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>10{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>11{{ $t('Patient_logChart_Title_AM') }}</th>
          <th>12{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>1{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>2{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>3{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>4{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>5{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>6{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>7{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>8{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>9{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>10{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>11{{ $t('Patient_logChart_Title_PM') }}</th>
          <th>{{ $t('Patient_logChart_Title_DayAvgValue') }}</th>
        </tr>
        <tr v-for="(DataInfo,DataIndex) in ResultData" v-bind:key="DataIndex">
          <td class="text-center table-valign-center">{{SetDateShow(DataInfo.RecordDate)}}</td>
          <template v-for="(HourValue,HourIndex) in 24">
            <td v-bind:key="HourIndex" v-html="GetHourData(HourValue-1, DataInfo.RecordLog)"></td>
          </template>
          <td class="text-center" v-html="GetDayAvg(DataInfo.RecordLog)"></td>
        </tr>
        <tr v-if="ResultData.length === 0">
          <td class="text-center" colspan="26">{{ $t('Patient_LogList_NoRecord') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import vPage from './vPage'

export default {
  name: 'PatientChart',
  components: {
    vPage
  },
  data () {
    return {
      dataRange: '',
      startDate: '',
      endDate: '',
      getDateList: [
        {Name: this.$i18n.t('Patient_Btn_ShowToDay'), Value: 1, IsAction: true},
        {Name: this.$i18n.t('Patient_Btn_Show7Day'), Value: 7, IsAction: false},
        {Name: this.$i18n.t('Patient_Btn_Show30Day'), Value: 30, IsAction: false},
        {Name: this.$i18n.t('Patient_Btn_Show90Day'), Value: 90, IsAction: false}
      ],
      ResultData: []
    }
  },
  created () {
    const _this = this
    $(function () {
    // Date range picker
      $('#reservation').daterangepicker({
        dateLimit: {
          days: 90
        },
        locale: {
          format: 'YYYY-MM-DD'
        }
      }).on('apply.daterangepicker', function (ev, picker) {
        _this.startDate = picker.startDate.format('YYYY-MM-DD')
        _this.endDate = moment(picker.endDate).add(0, 'd').format('YYYY-MM-DD')
      })
    })
    this.$parent.ShowPdfDown = true
    this.$parent.PdfName = 'PatientChart'
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
    },
    totalPage () {
      return Math.ceil(this.ResultData.total / this.ResultData.per_page)
    }
  },
  methods: {
    SetDateShow (DateString) {
      return moment(DateString).format('YYYY/MM/DD')
    },
    SetDateRange () {
      this.getDateList.forEach(function (Item, Index) {
        Item.IsAction = false
      })
      this.ResultData.show_page = 1
      let getDateVal = $('#reservation').val()
      let getDate = getDateVal.split(' - ')
      if (getDate.length > 1) {
        this.startDate = moment(getDate[0].trim()).format('YYYY-MM-DD')
        this.endDate = moment(getDate[1].trim()).add(0, 'd').format('YYYY-MM-DD')
      }
      this.GetPatientLog()
    },
    SetDateRangeButton (Days) {
      this.getDateList.forEach(function (Item, Index) {
        Item.IsAction = Item.Value === Days
      })
      this.endDate = moment(new Date()).format('YYYY-MM-DD')
      this.startDate = moment(new Date()).add(0 - Days, 'd').format('YYYY-MM-DD')
      this.GetPatientLog()
    },
    GetHourData (Hour, LogData) {
      let _this = this
      let result = ''
      let Insulin = []
      let Eats = []
      let BooldGlucos = []
      LogData.forEach(function (Data, Index) {
        if (Data.RecordHour === Hour) {
          switch (Data.Kind) {
            case 1:
              Insulin.push(Data.Value)
              break
            case 2:
              BooldGlucos.push(Data.Value)
              break
            case 3:
              Eats.push(Data.Value)
              break
          }
        }
      })
      result += '<div class="value-area">\n'
      BooldGlucos.forEach((Item, Index) => {
        let showClass = 'bg-bs-blue'
        if (Item > (18 * 10)) {
          showClass = 'bg-bs-yellow'
        }
        if (Item < (3.9 * 18)) {
          showClass = 'bg-bs-red'
        }
        result += '              <p class="' + showClass + '">' + _this.vueRoot.CalcBloodGlucose(Item) + '</p>\n'
      })
      Eats.forEach((Item, Index) => {
        result += '              <p class="bg-bs-black">' + Item + '</p>\n'
      })
      Insulin.forEach((Item, Index) => {
        result += '              <p class="bg-bs-green">' + Item + '</p>\n'
      })
      result += '            </div>'
      return result
    },
    GetDayAvg (LogData) {
      let result = ''
      let Insulin = []
      let InsulinTotal = 0
      let Eats = []
      let EatTotal = 0
      let BooldGlucos = []
      let BooldGlucosTotal = 0
      LogData.forEach(function (Data, Index) {
        switch (Data.Kind) {
          case 1:
            Insulin.push(Data.Value)
            InsulinTotal += Data.Value
            break
          case 2:
            BooldGlucos.push(Data.Value)
            BooldGlucosTotal += Data.Value
            break
          case 3:
            Eats.push(Data.Value)
            EatTotal += Data.Value
            break
        }
      })
      if (BooldGlucos.length > 0) {
        result += 'BG(' + BooldGlucos.length + '):' + this.vueRoot.CalcBloodGlucose(Math.ceil(BooldGlucosTotal / BooldGlucos.length)) + this.getUnit(2) + '<br />\n'
      }
      if (Eats.length > 0) {
        result += 'CB:' + Math.ceil(EatTotal / Eats.length) + '<br />\n'
      }
      if (Insulin.length > 0) {
        result += 'IN:' + Math.ceil(InsulinTotal / Insulin.length) + this.getUnit(1) + '<br />\n'
      }
      return result
    },
    setPage (idx) {
      if (idx > 0) {
        this.GetPatientLog()
      }
    },
    GetPatientLog () {
      this.vueRoot.ViewTitle = this.vueParent.PatientInfo.Name + '<small>' + this.$i18n.t('Patient_Btn_LogChart') + '</small>'
      const _this = this
      if (this.startDate === '') {
        this.startDate = moment(new Date()).add(-1, 'd').format('YYYY-MM-DD')
        this.endDate = moment(new Date()).format('YYYY-MM-DD')
      }
      let searchData = {
        PatientSId: this.vueParent.PatientInfo.SId,
        GroupSId: this.vueRoot.UserInfo.SId,
        BeginDate: this.startDate + ' 00:00:00',
        EndDate: this.endDate + ' 23:59:59'
      }
      const sendConfig = {
        method: 'post',
        url: 'Api/Patient/PatientChart',
        params: searchData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Bearer ' + _this.vueBase.SetToken.Token
        }
      }
      axios(sendConfig).then(function (r) {
        _this.ResultData = r.data
        _this.GetData = true
      }).catch(function (e) {
        console.log(e)
      })
    },
    getUnit (Kind) {
      let result = 'U'
      switch (Kind) {
        case 2:
          result = this.vueRoot.ShowBloodGlucoseTitle('mg/dl')
      }
      return result
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.GetData = false
      vm.GetPatientLog()
    })
  }
}
</script>

<style>
  ul.info-list {
    list-style: none;
  }
  ul.info-list li {
    float:left;
    margin-left: 5px;
    padding: 3px 5px;
    border-radius: 5px;
  }
</style>
