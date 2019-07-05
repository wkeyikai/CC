
import Vue from 'vue'
import ccTable from './table/cc-table'
import ccSort from './table/cc-sort'
const cc = {
  install () {
    Vue.component('ccSort', ccSort)
    Vue.component('ccTable', ccTable)
  }
}
Vue.use(cc)

export default cc
