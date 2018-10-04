<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-xs-12">
        <div class="info-box">
          <div id="InfoAvator" v-if="Avatar"><img v-bind:src="Avatar" ></div>
          <span class="info-box-icon bg-aqua" v-else><i class="fal fa-user-md"></i></span>
          <div class="info-box-content card-info">
            <span class="info-box-text title">MY Profile</span>
            <span class="info-box-text name">{{vueParent.UserInfo.EMail}}</span>
            <span class="info-box-text email">{{vueParent.UserInfo.GroupName}}</span>
          </div><!-- /.info-box-content -->
          <div id="InfoLogo" v-if="Logo"><img v-bind:src="Logo"></div>
        </div><!-- /.info-box -->
      </div><!-- /.col -->
    </div>
    <div class="box box-success" id="MapBox">
      <div class="box-header with-border">
        <h3 class="box-title">{{ $t('Home_Title_PatientArea') }}</h3>

        <div class="box-tools pull-right">
          <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
          </button>
          <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
        </div>
      </div>
      <!-- /.box-header -->
      <div class="box-body no-padding">
        <div class="row">
          <div class="col-md-10 col-sm-9 showMap" style="height: 280px">
              <!-- Map will be created here -->
              <v-map ref="map" :zoom=5 :center="[29.286 ,110.610]">
                <v-tilelayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker v-for="(contact, makrIndex) in Marks" v-bind:lat-lng="contact.latLng" v-bind:key="makrIndex"></v-marker>
              </v-map>
          </div>
          <!-- /.col -->
          <div class="col-md-2 col-sm-3 showInfo">
            <div class="pad box-pane-right bg-custom-map-blue" style="min-height: 280px">
              <div class="description-block margin-bottom">
                <h3 class="">{{UserAmount}}</h3>
                <span class="">{{ $t('Home_Label_PatientCount') }}</span>
              </div>
              <!-- /.description-block -->
              <div class="description-block margin-bottom">
                <h3 class="">{{InsulinDevices}}</h3>
                <span class="">{{ $t('Home_Label_InsulinDevices') }}</span>
              </div>
              <!-- /.description-block -->
              <div class="description-block">
                <h3 class="">{{BloodGlucoseDevices}}</h3>
                <span class="">{{ $t('Home_Label_BloodGlucoseDevices') }}</span>
              </div>
              <!-- /.description-block -->
            </div>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.box-body -->
    </div>
    <div class="box box-default color-palette-box">
      <div class="box-header backcolorWhite">
        <div class="input-group col-sm-6">
          <span class="input-group-addon"><i class="fa fa-search"></i></span>
          <input type="text" class="form-control" v-bind:placeholder="$t('Home_ToolTip_PatientSearch')" v-model="Keyword">
          <span class="input-group-btn">
                        <button type="button" class="btn btn-info btn-flat" v-on:click="GetFilterData">{{ $t('Base_Btn_Search') }}</button>
                      </span>
        </div>
        <div class="box-tools">
          <div class="pull-left UnitChange">
            <label for="ChangeUnit">{{ $t('Patient_Info_Title_BloodGlucoseUnit') }}:</label>
            <select id="ChangeUnit" v-model="vueParent.BloodGlucoseUnit">
              <option value="mg/dL">mg/dl</option>
              <option value="mmo/l">mmo/l</option>
            </select>
          </div>
          <v-page class="pull-right" :setting="ResultData.pageSet" @page-change="pageChange"></v-page>
        </div>
        <div class="iconInfoArea"><span class="iconInfo showC3">Data Transmitted via CLIPSULIN</span><span class="iconInfo showGA1">Data Transmitted via GLUCONEXT</span><span class="iconInfo showUnder">{{ $t('Home_PatientList_Info_Under_normal_value') }}</span><span class="iconInfo showOver">{{ $t('Home_PatientList_Info_Over_normal_value') }}</span><span class="iconInfo showInrange">{{ $t('Home_PatientList_Info_In_range_normal_value') }}</span></div>
      </div>
      <div class="box-body table-responsive no-padding">
        <table class="table table-bordered table-striped">
          <tbody><tr>
            <th>{{ $t('Home_PatientList_Title_Name') }}</th>
            <th>{{ $t('Home_PatientList_Title_Email') }}</th>
            <th>{{ $t('Home_PatientList_Title_Device') }}</th>
            <th></th>
            <th><a href="#" @click="SetSortAction('LValue')">{{ $t('Home_PatientList_Title_InsulinDose') }}</a><i :class="{'fa-sort-numeric-up': getSortData('LValue') == 'ASC','fa-sort-numeric-down': getSortData('LValue') == 'DESC', 'fal': true }"></i></th>
            <th><a href="#" @click="SetSortAction('LDate')">{{ $t('Home_PatientList_Title_InsulinLogDateTime') }}</a><i :class="{'fa-sort-amount-up': getSortData('LDate') == 'ASC','fa-sort-amount-down': getSortData('LDate') == 'DESC', 'fal': true }"></i></th>
            <th><a href="#" @click="SetSortAction('BValue')">{{ vueParent.ShowBloodGlucoseTitle($t('Home_PatientList_Title_BloodGlucose')) }}</a><i :class="{'fa-sort-numeric-up': getSortData('BValue') == 'ASC','fa-sort-numeric-down': getSortData('BValue') == 'DESC', 'fal': true }"></i></th>
            <th></th>
            <th><a href="#" @click="SetSortAction('BDate')">{{ $t('Home_PatientList_Title_BloodGlucoseDateTime') }}</a><i :class="{'fa-sort-amount-up':getSortData('BDate') == 'ASC','fa-sort-amount-down': getSortData('BDate') == 'DESC', 'fal': true }"></i></th>
          </tr>
          <template v-for="(PatientItem,index) in ResultData.data">
            <tr v-bind:key="'Data_' + index" v-if="PatientItem.Devices.length > 0">
              <td v-bind:rowspan="PatientItem.Devices.length"><router-link v-bind:to="{ name:'PatientIndex', params: { SId: PatientItem.SId }}">{{ ShowName(PatientItem) }}</router-link></td>
              <td v-bind:rowspan="PatientItem.Devices.length">{{PatientItem.Email}}</td>
              <td>{{PatientItem.Devices[0].Name}}</td>
              <td v-html="showTag(PatientItem.Devices[0])"></td>
              <td>{{ShowValue(PatientItem.Devices[0].Lnsulin)}}</td>
              <td>{{SetDateShow(PatientItem.Devices[0].LRecordTime)}}</td>
              <td>{{ ShowValue(vueParent.CalcBloodGlucose(PatientItem.Devices[0].Bloodlucos)) }}</td>
              <td v-html="CheckBloodGlucose(PatientItem.Devices[0],PatientItem)"></td>
              <td>{{SetDateShow(PatientItem.Devices[0].BRecordTime)}}</td>
            </tr>
            <tr v-for="(DeviceItem,DeviceIndex) in PatientItem.Devices" v-bind:key="'Data_' + index + '_' + DeviceIndex" v-if="DeviceIndex > 0 && PatientItem.Devices.length > 0">
              <td>{{DeviceItem.Name}}</td>
              <td v-html="showTag(DeviceItem)"></td>
              <td>{{ShowValue(DeviceItem.Lnsulin)}}</td>
              <td>{{SetDateShow(DeviceItem.LRecordTime)}}</td>
              <td>{{ ShowValue(vueParent.CalcBloodGlucose(DeviceItem.Bloodlucos)) }}</td>
              <td v-html="CheckBloodGlucose(DeviceItem,PatientItem)"></td>
              <td>{{SetDateShow(DeviceItem.BRecordTime)}}</td>
            </tr>
          </template>
          <tr v-if="IsNoData && !GetData">
            <td colspan="6" class="text-center">{{ $t('Base_DataList_Loading') }}</td>
          </tr>
          <tr v-if="IsNoData && GetData">
            <td colspan="6" class="text-center">{{ $t('Base_DataList_NoRecord') }}</td>
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
  name: 'Home',
  components: {
    vPage
  },
  data: function () {
    return {
      Keyword: '',
      GetData: false,
      IsNoData: true,
      ResultData: {
        pageSet: {
          totalRow: 0, // required option
          pageSizeMenu: [20, 40, 60, 100]
        },
        per_page: 20,
        show_page: 1,
        total: 0,
        countOfPage: 1,
        SetSort: [
          {Key: 'LDate', Sort: 'DESC'}
        ],
        data: [],
        LatLngdata: []
      },
      Marks: [],
      Map: null,
      Logo: '',
      Avatar: '',
      UserAmount: '',
      InsulinDevices: '',
      BloodGlucoseDevices: ''
    }
  },
  computed: {
    vueParent () {
      return this.$parent
    },
    vueRoot () {
      return this.$parent.$parent
    },
    totalPage () {
      return Math.ceil(this.ResultData.total / this.ResultData.per_page)
    }
  },
  created () {
    this.GetRouterPage()
  },
  beforeUpdate () {
    if (!this.GetData) {
      this.GetPatientData()
    }
  },
  methods: {
    SetDateShow (DateString) {
      if (DateString) {
        return moment(DateString).format('YYYY-MM-DD A hh:mm')
      } else {
        return ''
      }
    },
    getSortData (findKey) {
      let CheckValue = ''
      this.ResultData.SetSort.forEach(SortSet => {
        if (SortSet.Key === findKey) {
          CheckValue = SortSet.Sort
        }
      })
      return CheckValue
    },
    SetSortAction (SetValue) {
      let GetItem = this.ResultData.SetSort.filter(elem => elem.Key === SetValue)
      if (GetItem.length > 0) {
        this.ResultData.SetSort.forEach((elem, eindex) => {
          if (elem.Key === SetValue) {
            switch (elem.Sort) {
              case 'DESC':
                elem.Sort = 'ASC'
                break
              case 'ASC':
                if (this.ResultData.SetSort.length > 1) {
                  this.ResultData.SetSort.splice(eindex, 1)
                } else {
                  elem.Sort = 'DESC'
                }
                break
            }
          }
        })
      } else {
        this.ResultData.SetSort = []
        this.ResultData.SetSort.push({
          Key: SetValue,
          Sort: 'DESC'
        })
      }
      this.GetPatientData()
    },
    GetRouterPage () {
      let RouterPage = this.$route.params.Page
      if (RouterPage) {
        this.ResultData.show_page = RouterPage
      }
    },
    SetViewMap (MakerData) {
    },
    GetPatientData () {
      const _this = this
      let searchData = {
        Page: this.ResultData.show_page,
        PageSize: this.ResultData.per_page,
        GroupSId: this.vueParent.UserInfo.SId,
        Sort: this.ResultData.SetSort,
        Keyword: this.Keyword
      }
      const sendConfig = {
        method: 'post',
        url: 'Api/Patient/HomeList',
        params: searchData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Bearer ' + _this.vueRoot.SetToken.Token
        }
      }
      this.vueParent.ViewTitle = ''
      axios(sendConfig).then(function (r) {
        _this.ResultData = r.data
        _this.ResultData.pageSet.goPage = _this.ResultData.show_page
        _this.IsNoData = r.data.data.length === 0
        _this.GetData = true
        _this.$ls.set('tempHomeList', _this.ResultData.current_page)
        let SetMapMark = []
        _this.ResultData.LatLngdata.forEach((dataInfo, dataIndex) => {
          SetMapMark.push({
            latLng: [dataInfo.Latitude, dataInfo.Longitude],
            name: dataInfo.FirstName + ' ' + dataInfo.LastName
          })
        })
        _this.Marks = SetMapMark
        _this.Logo = _this.vueParent.UserInfo.Groups[0].Logo
        _this.Avatar = _this.vueParent.UserInfo.Avatar
        _this.UserAmount = _this.vueParent.UserInfo.Groups[0].UserAmount
        _this.InsulinDevices = _this.vueParent.UserInfo.Groups[0].InsulinDevices
        _this.BloodGlucoseDevices = _this.vueParent.UserInfo.Groups[0].BloodGlucoseDevices
      }).catch(function (e) {
        console.log(e)
      })
    },
    GetFilterData () {
      this.GetData = false
      this.GetPatientData()
    },
    CheckBloodGlucose (CheckValue, BaseValue) {
      var result = ''
      if (CheckValue.Bloodlucos) {
        let showSet = 'showInrange'
        if (CheckValue.Bloodlucos > BaseValue.BHigh) {
          showSet = 'showOver'
        }
        if (CheckValue.Bloodlucos < BaseValue.BLow) {
          showSet = 'showUnder'
        }
        result = '<div class="showIcon ' + showSet + '"></div>'
      }
      return result
    },
    ShowValue (CheckValue) {
      let result = ''
      if (CheckValue > 0) {
        result = CheckValue
      }
      return result
    },
    ShowName (PatientItem) {
      let result = 'No Name'
      if (PatientItem.LastName !== '' && PatientItem.FirstName !== '') {
        result = PatientItem.FirstName + ' ' + PatientItem.LastName
      }
      return result
    },
    showTag (CheckValue) {
      let result = ''
      if (CheckValue.Serial) {
        if (CheckValue.Serial.toLowerCase() !== 'manual') {
          let showSet = ''
          if (CheckValue.Bloodlucos && !CheckValue.Lnsulin) {
            showSet = 'showGA1'
          } else {
            showSet = 'showC3'
          }
          result = '<div class="showIcon ' + showSet + '"></div>'
        }
      }
      return result
    },
    setPage (idx) {
      if (idx > 0 && this.ResultData.last_page >= idx) {
        // this.ResultData.show_page = idx
        // this.GetData = false
        this.$router.push('/Home/' + idx)
      }
    },
    pageChange (pInfo) {
      let that = this
      that.setPage(pInfo.pageNumber)
      // console.log(pInfo, that)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.GetData = false
      vm.GetPatientData()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.ResultData.show_page = to.params.Page
    this.GetData = false
    this.GetPatientData()
    next(vm => {
      vm.GetData = false
      vm.GetPatientData()
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
  div#InfoAvator {
    width: 90px;
    height: 90px;
    position: absolute;
    top: 0;
    left: 15px;
  }

  div#InfoAvator img {
    width: 100%;
    height: auto;
  }
</style>
