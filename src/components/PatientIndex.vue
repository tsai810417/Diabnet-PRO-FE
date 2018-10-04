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
      <div class="box-body row" v-if="ResultData.AvgData.AvgValue">
        <div class="col-sm-3 vcenter text-center">
          <h3>{{ $t('Patient_Label_AvgBloodGlucose') }}</h3>
          <p><span class="spText font45">{{vueRoot.CalcBloodGlucose(Math.round(ResultData.AvgData.AvgValue))}}</span> {{ vueRoot.ShowBloodGlucoseTitle('mg/dl') }}</p>
        </div>
        <div class="col-sm-9">
          <div class="row">
            <div class="col-sm-6 vcenter text-center">
              <h3>{{ $t('Patient_Label_TargetBloodGlucoseFinish') }}</h3>
              <p class="spText font45">{{Math.round((ResultData.AvgData.FinishCount/ResultData.AvgData.TotalCount)*100,2)}} %</p>
            </div>
            <div class="Echarts col-sm-6">
              <chart
                :options="PieSetOption"
                :loading="loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box box-default color-palette-box" v-if="BChartOption.series[0].data.length > 0" data-html2canvas-ignore="false">
      <div class="box-header bg-gray-light">
        <h3 class="box-title">{{ $t('Patient_Chart_Title_AvgBloodGlucoseValue') }}</h3>
      </div>
      <div class="box-body">
        <div class="BChart">
          <chart
            :options="BChartOption"
            :loading="loading"
            :auto-resize=true
          />
        </div>
      </div>
    </div>
    <div class="box box-default color-palette-box" v-if="LChartOption.series[0].data.length > 0" data-html2canvas-ignore="false">
      <div class="box-header bg-gray-light">
        <h3 class="box-title">{{ $t('Patient_Chart_Title_SumInsulinDose') }}</h3>
      </div>
      <div class="box-body">
        <div class="BChart">
          <chart
            :options="LChartOption"
            :loading="loading"
            :auto-resize=true
          />
        </div>
      </div>
    </div>
    <div class="box box-default color-palette-box">
      <div class="box-header bg-gray-light">
        <h3 class="box-title">{{ $t('Patient_List_Title_LogList') }}</h3>
        <div class="box-tools">
          <div class="pull-left UnitChange">
            <label for="ChangeUnit">{{ $t('Patient_Info_Title_BloodGlucoseUnit') }}:</label>
            <select id="ChangeUnit" v-model="vueRoot.BloodGlucoseUnit">
              <option value="mg/dL">mg/dl</option>
              <option value="mmo/l">mmo/l</option>
            </select>
          </div>
          <v-page class="pull-right" :setting="ResultData.pageSet" @page-change="pageChange"></v-page>
        </div>
      </div>
      <div class="box-body table-responsive no-padding">
        <table class="table table-hover table-print">
          <tbody><tr>
            <th>{{ $t('Patient_LogList_Title_LogDateTime') }}</th>
            <th>{{ $t('Patient_LogList_Title_Device') }}</th>
            <th>{{ $t('Patient_LogList_Title_LogValue') }}</th>
          </tr>
          <tr v-for="(LogInfo,LogIndex) in ResultData.LogData" v-bind:key="LogIndex">
            <td>{{SetDateShow(LogInfo.RecordTime)}}</td>
            <td>{{LogInfo.Name}}</td>
            <td>{{LogInfo.Kind === 2 ? vueRoot.CalcBloodGlucose(LogInfo.Value) : LogInfo.Value}} {{vueRoot.ShowBloodGlucoseTitle(getUnit(LogInfo.Kind))}}</td>
          </tr>
          <tr v-if="ResultData.LogData.length === 0">
            <td colspan="3" class="text-center">{{ $t('Patient_LogList_NoRecord') }}</td>
          </tr>
          </tbody></table>
      </div>
      <div class="box-footer">
        <div class="box-tools">
          <v-page :setting="ResultData.pageSet" @page-change="pageChange"></v-page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import vPage from './vPage'

export default {
  name: 'PatientIndex',
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
      ResultData: {
        pageSet: {
          totalRow: 0, // required option
          pageSizeMenu: [20, 40, 60, 100]
        },
        per_page: 20,
        show_page: 1,
        total: 0,
        countOfPage: 1,
        AvgData: [],
        LogData: [],
        BChartDatas: [],
        LChartDatas: []
      },
      loading: false,
      PieSetOption: {
        title: {
          text: '20%',
          top: 'middle',
          left: '40%',
          textStyle: {
            fontSize: 60,
            color: '#00AFA6'
          }
        },
        tooltip: {},
        series: [
          {
            color: ['#6BC2B6', '#D39488'],
            type: 'pie',
            name: this.$i18n.t('Patient_Label_TargetBloodGlucoseFinish'),
            radius: ['80%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                color: '#00AFA6',
                show: false,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 228, name: this.$i18n.t('Patient_Chart_ToolTip_Finish')},
              {value: 1, name: this.$i18n.t('Patient_Chart_ToolTip_Fail')}
            ]
          }
        ]
      },
      BChartOption: {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var res = params[0].seriesName + ' ' + params[0].name
            res += '<br/>  Max: ' + params[0].value[4]
            res += '<br/>  Min: ' + params[0].value[3]
            res += '<br/>  Avg: ' + (params[0].value[2] - 2)
            return res
          }
        },
        xAxis: {
          data: []
        },
        yAxis: [
          {
            type: 'value',
            scale: true,
            boundaryGap: [0.01, 0.01],
            min: function (value) {
              return 0
            },
            max: function (value) {
              return 200
            }
          }
        ],
        series: [{
          name: '平均血糖',
          type: 'k',
          itemStyle: {
            normal: {
              color: '#6BC2B6',
              borderColor: '#00AFA6',
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: '#00AFA6'
              }
            },
            emphasis: {
              color: '#8AD4D4',
              color0: 'white'
            }
          },
          markLine: {
            silent: true,
            data: [{
              yAxis: 70
            }, {
              yAxis: 180
            }]
          },
          data: []
        }]
      },
      LChartOption: {
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: [
          {
            type: 'value',
            scale: true,
            boundaryGap: [0.01, 0.01]
          }
        ],
        series: [{
          name: this.$i18n.t('Patient_Chart_Title_SumInsulinDose'),
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#AADCEF',
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: '#28A89F'
              }
            },
            emphasis: {
              color: '#8AD4D4',
              color0: 'white'
            }
          },
          data: []
        }]
      }
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
      }).on('blur', function () {
        let getDate = $(this).val().split(' - ')
        if (getDate.length > 1) {
          _this.startDate = moment(getDate[0]).format('YYYY-MM-DD')
          _this.endDate = moment(getDate[1]).add(0, 'd').format('YYYY-MM-DD')
        }
      })
    })
    this.$parent.ShowPdfDown = true
    this.$parent.PdfName = 'PatientLog'
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
  mounted () {

  },
  methods: {
    SetDateShow (DateString) {
      return moment(DateString).format('YYYY-MM-DD A hh:mm')
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
      this.ResultData.show_page = 1
      this.GetPatientLog()
    },
    setPage (idx) {
      if (idx > 0) {
        this.ResultData.show_page = idx
        this.GetPatientLog()
      }
    },
    GetPatientLog () {
      this.vueRoot.ViewTitle = this.vueParent.PatientInfo.Name + '<small>' + this.$i18n.t('Patient_Btn_LogList') + '</small>'
      const _this = this
      if (this.startDate === '') {
        this.endDate = moment(new Date()).format('YYYY-MM-DD')
        this.startDate = moment(new Date()).add(-1, 'd').format('YYYY-MM-DD')
      }
      let searchData = {
        Page: this.ResultData.show_page,
        PageSize: this.ResultData.per_page,
        PatientSId: this.vueParent.PatientInfo.SId,
        GroupSId: this.vueRoot.UserInfo.SId,
        BeginDate: this.startDate + ' 00:00:00',
        EndDate: this.endDate + ' 23:59:59'
      }
      const sendConfig = {
        method: 'post',
        url: 'Api/Patient/PatientList',
        params: searchData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Bearer ' + _this.vueBase.SetToken.Token
        }
      }
      axios(sendConfig).then(function (r) {
        _this.ResultData.pageSet.language = _this.$i18n.locale
        _this.BChartOption.series[0].markLine.data[0].yAxis = _this.vueParent.PatientInfo.LowBloodGlucose
        _this.BChartOption.series[0].markLine.data[1].yAxis = _this.vueParent.PatientInfo.HighBloodGlucose
        _this.ResultData = r.data
        _this.ResultData.pageSet.goPage = _this.ResultData.show_page
        _this.GetData = true
        _this.PieSetOption.series[0].data = [
          {value: _this.ResultData.AvgData.FinishCount, name: _this.$i18n.t('Patient_Chart_ToolTip_Finish')},
          {value: _this.ResultData.AvgData.TotalCount - _this.ResultData.AvgData.FinishCount, name: _this.$i18n.t('Patient_Chart_ToolTip_Fail')}
        ]
        _this.PieSetOption.title.text = Math.round((_this.ResultData.AvgData.FinishCount / _this.ResultData.AvgData.TotalCount) * 100, 2) + '%'
        if (_this.ResultData.AvgData.FinishCount && _this.ResultData.AvgData.TotalCount) {
          // console.log(_this.PieSetOption.title.text.length)
          if (_this.PieSetOption.title.text.length === 4) {
            _this.PieSetOption.title.left = screen.width <= 1024 ? '26%' : '38%'
            _this.PieSetOption.title.left = screen.width <= 1440 && screen.width > 1024 ? '33%' : _this.PieSetOption.title.left
            if (screen.width > 1920) {
              _this.PieSetOption.title.left = '41%'
            }
            // console.log(screen.width, _this.PieSetOption.title.left)
          } else {
            _this.PieSetOption.title.left = screen.width <= 1024 ? '32%' : '40%'
            _this.PieSetOption.title.left = screen.width <= 1440 && screen.width > 1024 ? '38%' : _this.PieSetOption.title.left
            if (screen.width > 1920) {
              _this.PieSetOption.title.left = '43%'
            }
            // console.log(screen.width, _this.PieSetOption.title.left)
          }
          _this.PieSetOption.title.textStyle.fontSize = 54
        }
        if (_this.ResultData.BChartDatas) {
          _this.BChartOption.xAxis.data = []
          _this.BChartOption.series[0].data = []
          _this.ResultData.BChartDatas.forEach(Item => {
            _this.BChartOption.xAxis.data.push(moment(Item.LogDate).format('YYYY-MM-DD'))
            _this.BChartOption.series[0].data.push([
              Item.AvgData - 2,
              Item.AvgData + 2,
              Item.LowData,
              Item.MaxData
            ])
          })
          _this.BChartOption.tooltip.formatter = function (params) {
            var res = params[0].seriesName + ' ' + params[0].name
            res += '<br/>  ' + _this.$i18n.t('Patient_Chart_ToolTip_ChartMaxValue') + ' : ' + params[0].value[4]
            res += '<br/>  ' + _this.$i18n.t('Patient_Chart_ToolTip_ChartMinValue') + ' : ' + params[0].value[3]
            res += '<br/>  ' + _this.$i18n.t('Patient_Chart_ToolTip_ChartAvgValue') + ' : ' + (params[0].value[2] - 2)
            return res
          }
        }
        if (_this.ResultData.LChartDatas) {
          _this.LChartOption.xAxis.data = []
          _this.LChartOption.series[0].data = []
          _this.ResultData.LChartDatas.forEach(Item => {
            _this.LChartOption.xAxis.data.push(moment(Item.LogDate).format('YYYY-MM-DD'))
            _this.LChartOption.series[0].data.push(Item.UseValue)
          })
        }
      }).catch(function (e) {
        console.log(e)
      })
    },
    getUnit (Kind) {
      let result = 'g'
      switch (Kind) {
        case 2:
          result = 'mg/dl'
          break
        case 1:
          result = 'U'
          break
      }
      return result
    },
    pageChange (pInfo) {
      // let that = this
      // this.ResultData.show_page = pInfo.pageSize
      // this.ResultData.show_page = pInfo.pageNumber
      this.setPage(pInfo.pageNumber)
      // console.log(pInfo, that)
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
  .Echarts {
    height: 200px;
  }
  .Echarts .echarts {
      width: auto;
    height: 200px;
    }
  .BChart {
    height: 400px;
  }
  .BChart .echarts {
    width: auto;
  }
  .middle {
     float: none;
     display: inline-block;
     vertical-align: middle;
   }
  .spText {
    color: #28A89F;
    Size: 18px;
    font-weight: bold;
  }
  .vcenter {
    margin-top: 50px;
  }
</style>
