import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'
import ParkingList from '@/view/ParkingList'
import EmptyList from '@/view/EmptyList'
import login from '../view/login'
import projectList from '../view/projectList'
import home from '../view/Home'
import simulation from '../view/Simulation'
Vue.use(Router)

const base = process.env.NODE_ENV === 'production' ? '/indoorun/app/wxmini/' : '/'

export default new Router({
  mode: 'history',
  base,
  routes: [
    {
      path: '/map',
      name: 'map',
      component: map
    },
    {
      path:'/',
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
    {
      path:'/simulation',
      name:'simulation',
      component:simulation
    },
  ]
})
