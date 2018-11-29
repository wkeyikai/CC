
import Vue from 'vue'
import ccTable from './table/cc-table'
import ccTableCol from './table/cc-table-col'
const cc = {
    install () {
        Vue.component('ccTable', ccTable)
        Vue.component('ccTableCol', ccTableCol)
    }
}
Vue.use(cc)

export default cc
