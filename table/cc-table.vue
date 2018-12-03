<template>
    <div class="cc-table--scope">
        <div class="cc-relative" :style="{width:tableWidth,height:tableHeight}">
            <div class="cc-fix" :style="{width:tableWidth,height:tableHeight}" @scroll="scrollFunction" ref="scroll">
                <table class="cc-table" :style="{width:tableWidth,height:tableHeight}">
                    <thead>
                        <tr v-for="(row,idx) in ['tableTitle','tableTitleFixed']" ref="tableTitle" :key="idx">
                            <td v-for="(col,i) in title" :key="i" :ref="row+col.name">
                                <sort-click v-if="col.sort" :title="col.label" v-on:sortby="sortBy" :keys="col.sort" :column="column" :type="type" ></sort-click>
                                <template v-else>{{col.label}}</template>
                            </td>
                        </tr>
                    </thead>
                    <thead style="z-index:100;position:absolute;top:0px;left:0px;background-color:#ffffff;">
                        <tr>
                            <td ref="fixedLeftGrid" v-for="(item,i) in fixedLeft" :key="i" style="height:37px;">
                                {{item.label||"  "}}
                            </td>
                        </tr>
                    </thead>
                    <thead style="z-index:100;position:absolute;top:0px;background-color:#ffffff;" :style="{right:scrollRight+'px'}">
                        <tr>
                            <td ref="fixedRightGrid" v-for="(item,i) in fixedRight" :key="i" style="height:37px;">
                                {{item.label||"  "}}
                            </td>
                        </tr>
                    </thead>
                    <template>
                    <cc-tbody ref="centerData" :grids="baseGrid">
                    </cc-tbody>
                    <cc-tbody ref="fixedLeftData" :grids="fixedLeftGrid" fixed="left" style="position:absolute;overflow: hidden;" :style="{bottom:scrollBottom+'px'}">
                    </cc-tbody>
                    <cc-tbody ref="fixedRightData" :grids="fixedRightGrid" fixed="right" style="position:absolute;overflow: hidden;" :style="{bottom:scrollBottom+'px',right:scrollRight+'px'}">
                    </cc-tbody>
                    </template>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'cc-table',
    components: {
        'cc-tbody': {
            props: ['grids', 'fixed'],
            data () {
                return { title: [] }
            },
            render (h) {
                let slotsNames = []
                let slotMapping = this.$parent.slotMapping
                // console.log('this=>',this.$parent.$slots.default[0].data.attrs)
                // console.log('this=>',this.$parent.$slots.default[0].data.scopedSlots.default)
                // console.log(this.grids)
                let title = []
                let rowSlots = []
                this.grids.forEach((grid) => {
                    // console.log(grid,slotMapping[grid])
                    let cr = slotMapping[grid]
                    if (cr) {
                        // title
                        let attr = slotMapping[grid].data.attrs
                        let label = attr.label || ''
                        let sort = attr.sort
                        title.push({name: grid, label: label, sort: sort})
                        // console.log(cr.data.staticClass)
                        // data slot
                        slotsNames.push({
                            name: grid,
                            // data:slotMapping[grid]?slotMapping[grid].data.scopedSlots:undefined,
                            cr: cr,
                            scopedSlots: cr.data.scopedSlots ? cr.data.scopedSlots.default : (name) => { return name.txt },
                            class: cr.data.staticClass ? {class: cr.data.staticClass} : {}
                        })
                    } else {
                        title.push({label: grid})
                        slotsNames.push({
                            name: grid,
                            // cr: cr,
                            scopedSlots: (name) => { return name.txt }
                            // class: cr.data.staticClass ? {class: cr.data.staticClass} : {}
                        })
                    }
                })
                this.$parent.data.forEach((val, i) => {
                    let slots = []
                    slotsNames.forEach((slot, j) => {
                        let props = {
                            index: i,
                            row: val,
                            txt: val[slot.name]
                        }
                        // console.log(slot.name,slot.cr.data.scopedSlots)
                        let txt = slot.scopedSlots(props)
                        slots.push(h('td', slot.class, txt))// h('td', vnode))
                    })
                    // @click="selected=entry" class="trigger" :class="{target:selected == entry}"
                    let trSet = {
                        /* on: {
                            click: function(e) {
                                console.log('click',e)
                            }
                        }, */
                        class: 'trigger'
                    }
                    rowSlots.push(h('tr', trSet, slots))
                })
                if (this.$parent.data.length === 0) {
                    rowSlots = [h('tr', {class: 'cc-no--data'}, [h('td', 'no data')])]
                }
                this.title = title
                // slots = [h('tr', [h('td','1'),h('td','2')]),h('tr', [h('td','2'),h('td','1')])]
                // return h('tbody', rowSlots)
                let tbodySet = {ref: 'tbody'}
                if (this.fixed) {
                    tbodySet.style = {
                        position: 'absolute',
                        top: '37px', // tmp
                        // right: '15px',
                        backgroundColor: 'rgb(194, 231, 255)'
                    }
                }
                tbodySet.on = { mousewheel: (e) => {
                        this.$parent.$refs.scroll.scrollTop = this.$parent.$refs.scroll.scrollTop + (e.deltaY > 0 ? 50 : -50)
                    }
                }
                return h('tbody', tbodySet, rowSlots)
            }
        },
        'sort-click': {
            props: ['title', 'column', 'keys', 'type'],
            template: `
                <div>
                    <a class="cc-sort--click" @click="sortBy(keys)" style="font-weight: bold;cursor: pointer; text-decoration: underline;color: #428BCA;">{{title}}</a>
                    <div class="cc-sort--iocn">
                        <i class="fa fa-caret-up" v-if=" column!=keys || type == 'asc'"></i>
                        <i class="fa fa-caret-down" v-if=" column!=keys || type == 'desc'"></i>
                    </div>
                </div>
            `,
            methods: {
                sortBy (key) {
                    this.$emit('sortby', key)
                }
            }
        }
    },
    props: ['data', 'grid', 'column', 'type', 'width', 'height', 'fixed'],
    data () {
        return {
            slotMapping: {},
            tableWidth: this.width || '100%',
            tableHeight: this.height || '100%',
            defaultTop: 0,
            title: [],
            fixeTitle: [],
            fixedLeft: [],
            fixedRight: [],
            baseGrid: [],
            fixedLeftGrid: [],
            fixedRightGrid: [],
            scrollRight: 0,
            scrollBottom: 0
        }
    },
    mounted () {
        this.defaultTop = parseInt(this.$refs.fixedLeftData.$refs.tbody.style.top)
        this.title = this.$refs.centerData.title
        this.fixedLeft = this.$refs.fixedLeftData.title
        this.fixedRight = this.$refs.fixedRightData.title
        this.$nextTick(() => {
            this.setFixedTitle()
        })
        window.onresize = () => {
            this.setFixedTitle()
        }
    },
    created () {
        // let slotsNames = []
        // let slotMapping = {}
        // let title = []
        let fixedLeft = []
        let fixedRight = []
        let grids = this.grid
        let slotsDef = this.$slots.default.filter((v) => { return v.componentOptions && v.componentOptions.tag === 'cc-table-col' })
        // console.log('slotsDef',slotsDef)
        slotsDef.forEach((slot) => {
            let name = slot.data.attrs.name
            this.slotMapping[name] = slot
            let fixed = slot.data.attrs.fixed
            if (fixed || fixed === '') {
                (fixed === 'right' ? fixedRight : fixedLeft).push(name)
            }
        })
        this.baseGrid = fixedLeft.concat(grids.filter(grid => { return fixedLeft.concat(fixedRight).indexOf(grid) === -1 })).concat(fixedRight)
        this.fixedLeftGrid = fixedLeft
        this.fixedRightGrid = fixedRight
        // console.log(fixedLeft, fixedRight)
        // console.log('title',title)
        // this.title = this.$refs.base.title
    },
    methods: {
        scrollFunction (e) {
            var titleFixed = this.$refs.tableTitle[1]
            titleFixed.style.left = 0 - e.srcElement.scrollLeft + 'px'
            // console.log('fixed',this.$refs.test[0])
            var leftColFixed = this.$refs.fixedLeftData.$refs.tbody
            leftColFixed.style.top = this.defaultTop - e.srcElement.scrollTop + 'px'
            var rightColFixed = this.$refs.fixedRightData.$refs.tbody
            rightColFixed.style.top = this.defaultTop - e.srcElement.scrollTop + 'px'
            // console.log('scrollFunction')
        },
        setFixedTitle () {
            if (!this.$refs.tableTitle) return
            var psTitle = this.$refs.tableTitle[0]
            var psFixTitle = this.$refs.tableTitle[1]
            var ps = psTitle.getElementsByTagName('td')
            var psFixed = psFixTitle.getElementsByTagName('td')
            psFixTitle.style.width = psTitle.clientWidth + 'px'
            var scroll = this.$refs.scroll
            this.scrollRight = scroll.clientWidth < scroll.offsetWidth ? 17 : 0
            this.scrollBottom = scroll.clientHeight < scroll.offsetHeight ? 17 : 0
            for (let i = 0; i < ps.length; i++) {
                psFixed[i].style.width = ps[i].clientWidth + 'px'
            }
            if (this.$refs.tableFootTitle) {
                var psTitleFoot = this.$refs.tableFootTitle[0]
                var psFixTitleFoot = this.$refs.tableFootTitle[1]
                psFixTitleFoot.style.width = psTitleFoot.clientWidth + 'px'
                for (let i = 0; i < ps.length; i++) {
                    psFixed[i].style.width = ps[i].clientWidth + 'px'
                }
            }
            if (this.fixedLeftGrid) {
                this.$refs.fixedLeftGrid.forEach((val, index) => {
                   val.style.width = ps[index].clientWidth + 'px'
                })
                this.$refs.fixedRightGrid.forEach((val, index) => {
                   val.style.width = ps[ps.length - 1].clientWidth + 'px'
                })
            }
        },
        setLoading (status) {
            this.$refs.loading.setShow(status)
        },
        getLoading () {
            return this.$refs.loading.getShow()
        },
        sortBy (key) {
            this.$emit('sortby', key)
        }
    },
    watch: {
        data () {
            this.$nextTick(() => {
                this.setFixedTitle()
            })
        }
    }
}
</script>
<style lang="scss">
/*.cc-table--scope {
}*/
td,tr{
    margin: 0;
    padding: 0;
}
.cc-table{
    border-spacing: 0;
}
.cc-relative {
    overflow: hidden;
    position: relative;
}
.cc-fix {
    overflow: auto;
}
.cc-table tbody td {
    box-sizing: content-box;
    text-align: center;
    line-height: 36px;
    padding: 0 15px 0 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #ebeef5;
}
.cc-table thead tr{
    white-space: nowrap;
    text-align: center;
    line-height: 36px;
    color: #909399;
    background-color: #ffffff;
    border-bottom: 1px solid #ebeef5;
}
.cc-table thead tr:nth-of-type(2) {
    position: absolute;
    top: 0px;
    z-index: 100;
}
.cc-sort--click{
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
    color: rgb(66, 139, 202)
}
.cc-sort--iocn {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    left: 3px;
    top: -2px;
}
.cc-no--data {
    border-bottom: none;
    background-color: transparent !important;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
}
</style>
