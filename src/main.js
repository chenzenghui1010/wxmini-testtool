// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'

import router from './router'
import Vuex from 'vuex'
import store from './store'

import AlertBox from './AlertBox.js'
import HeaderTip from './HeaderTip.js'
import {FloatAlert} from "./FloatAlert";
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

import {idrWxManager} from "../indoorunMap/map";

Vue.use(Mint);
// import './mock'

Vue.config.productionTip = false

Vue.use(Vuex)

window.debugtest = true

window.Alertboxview = new AlertBox()

window.HeaderTip = new HeaderTip()

window.FloatView = new FloatAlert()

var userAgent = navigator.userAgent.toLowerCase();

var isAndroid = userAgent.match(/android/i) == "android";

if (!isAndroid) {
  
  idrWxManager.init()
}

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

