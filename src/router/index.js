import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'
import ParkingList from '@/view/ParkingList'
import EmptyList from '@/view/EmptyList'
import login from '../view/login'
import projectList from '../view/projectList'
import home from '../view/Home'
Vue.use(Router)

const base = process.env.NODE_ENV === 'production' ? '/thxz/' : '/'

export default new Router({
  mode: 'history',
  base,
  routes: [
    {
      path: '/emptyspace',
      name: 'emptyspace',
      component: EmptySpace
    },
    {
      path: '/',
      name: 'map',
      component: map
    },
    {
      path: 'emptylist',
      name: 'emptylist',
      component: EmptyList
    },
    {
      path: '/parkinglist',
      name: 'parkinglist',
      component: ParkingList
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/projectList',
      name:'projectList',
      component:projectList
    },
  
    {
      path:'/home',
      name:'home',
      component:home
    },
  ]
})
