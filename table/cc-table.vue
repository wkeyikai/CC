<template>
  <div ref="view" class="cc-table-view" @scroll="scrollFunction">
    <div v-show="data.length==0" class="noData">{{'not data'}}</div>
    <cc-table-node ref="left" type="left" class="table-fixed-left"></cc-table-node>
    <cc-table-node ref="main" type="main" class="table-fixed-main"></cc-table-node>
    <cc-table-node ref="right" type="right" class="table-fixed-right"></cc-table-node>
  </div>
</template>
<script>
import ccTableNode from './cc-table-node'
export default {
  name: 'cc-table',
  components: { ccTableNode },
  props: ['data', 'grid'],
  data () {
    return {
      colTagName: 'cc-table-col',
      triggerIndex: -1,
      slotMapping: {},
      tables: {
        main: {},
        left: {},
        right: {}
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.setFixedTitle)
    this.init()
    this.$nextTick(() => {
      this.setFixedTitle()
    })
  },
  created () {
    // console.log('created',Object.keys(this.$slots).filter((val)=>{return val.indexOf('table-layout_title')>-1}))
  },
  methods: {
    renderInit ({ type, grids }) {
      let title = []
      let slotsNames = []
      grids.forEach(grid => {
        let cr = this.slotMapping[grid]
        let attr = cr.data.attrs
        let label = attr.label || ''
        let sort = attr.sort
        // let setting = {}
        title.push({ name: grid, label: label, sort: sort })
        // data slot
        let slotsName = {
          name: grid,
          cr: cr,
          scopedSlots: cr.data.scopedSlots
            ? cr.data.scopedSlots.default
            : name => {
              return name.txt
            },
          setting: {
            class: {
              [cr.data.staticClass]: cr.data.staticClass,
              'is-hidden': type === 'main' && attr.fixed !== undefined
            }
          }
        }
        slotsNames.push(slotsName)
      })
      return { title, slotsNames }
    },
    init () {
      let colTitle = {
        left: [],
        center: [],
        right: [],
        main: []
      }
      // get col tag and mapping grid
      // this.$slots.default.filter((v)=>{return v.componentOptions&&v.componentOptions.tag==this.colTagName}).forEach((v)=>{
      this.$slots.default
        .filter(v => {
          return v.tag === this.colTagName
        })
        .forEach(v => {
          if (v.data.attrs) {
            this.slotMapping[v.data.attrs.name] = v
          }
        })
      // split fixed and set new col sort
      this.grid.forEach(grid => {
        if (!this.slotMapping[grid]) return
        let fixed = this.slotMapping[grid].data.attrs.fixed
        let position =
          fixed !== undefined
            ? fixed === 'right'
              ? 'right'
              : 'left'
            : 'center'
        colTitle[position].push(grid)
      })
      colTitle.main = [...colTitle.left, ...colTitle.center, ...colTitle.right]
      let main = this.renderInit({ type: 'main', grids: colTitle.main })
      let left = this.renderInit({ type: 'left', grids: colTitle.left })
      let right = this.renderInit({ type: 'right', grids: colTitle.right })
      this.tables = {
        main,
        left,
        right
      }
      console.log('init', this.tables)
    },
    scrollFunction: function (e) {
      let scrollLeft = e.srcElement.scrollLeft
      let scrollTop = e.srcElement.scrollTop
      let titleFixed = ['main', 'left', 'right']
      titleFixed.forEach(type => {
        let ref = this.$refs[type]
        if (!ref) return
        ref.$refs.title[1].style.top = scrollTop + 'px'
      })
      // titleFixed.style.top = scrollTop + 'px'
      let leftFixedTable = this.$refs.left.$refs.table
      let rightFixedTable = this.$refs.right.$refs.table
      leftFixedTable.style.left = scrollLeft + 'px'
      rightFixedTable.style.right = 0 - scrollLeft + 'px'
      // console.log('scrollFunction',e.srcElement.scrollWidth,e.srcElement.scrollLeft+e.srcElement.clientWidth)
    },
    setFixedTitle: function () {
      let titleWidth = ['main', 'left', 'right']
      titleWidth.forEach(type => {
        let ref = this.$refs[type]
        if (!ref) return
        let title = ref.$refs.title
        let psTitle = title[0]
        let psFixTitle = title[1]
        let ps = psTitle.children
        let psFixed = psFixTitle.children
        // var width = this.$refs.tableTitle[0].clientWidth / ps.length+'px'
        // console.log(psFixTitle.style.width ,'|', psTitle.clientWidth)
        psFixTitle.style.width = psTitle.clientWidth + 'px'
        for (var i = 0; i < ps.length; i++) {
          // $(psFixed[i]).width(ps[i].clientWidth);
          // console.log(ps[i].clientWidth);
          // this.tdsWidth['main'][i] = ps[i].clientWidth + 'px'
          psFixed[i].style.width = ps[i].clientWidth + 'px'
          // psFixed[i].style.width = width
          // ps[i].style.width = width//width + 'px'//ps[i].clientWidth+'px';
        }
      })
      /* if(this.$refs.tableFootTitle){
                var psTitle = this.$refs.tableFootTitle[0];
                var psFixTitle = this.$refs.tableFootTitle[1];
                var ps = psTitle.getElementsByTagName("td");
                var psFixed = psFixTitle.getElementsByTagName("td");
                psFixTitle.style.width = psTitle.clientWidth + 'px';
                for (var i = 0; i < ps.length; i++) {
                    psFixed[i].style.width = ps[i].clientWidth + 'px';
                }
            } */
    },
    sortBy (key) {
      this.$emit('sortby', key)
    }
  },
  watch: {
    data () {
      this.init()
      this.$nextTick(() => {
        this.setFixedTitle()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
