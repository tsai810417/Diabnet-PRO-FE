import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Contents from '@/components/Content'
import Home from '@/components/Home'
import Patient from '@/components/Patient'
import PatientIndex from '@/components/PatientIndex'
import PatientChart from '@/components/PatientChart'
import PatientInfo from '@/components/PatientInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home/:Page',
      component: Contents,
      children: [{
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/Patient/:SId',
        component: Patient,
        children: [
          {
            path: '/',
            name: 'PatientIndex',
            component: PatientIndex
          },
          {
            path: 'Chart',
            name: 'PatientChart',
            component: PatientChart
          },
          {
            path: 'Info',
            name: 'PatientInfo',
            component: PatientInfo
          }
        ]
      }]
    }
  ]
})
