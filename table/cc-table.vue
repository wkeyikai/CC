<template>
    <div class="cc-table--scope">
        <div class="cc-relative" :style="{width:tableWidth,height:tableHeight}">
            <div class="cc-fix" :style="{width:tableWidth,height:tableHeight}" @scroll="scrollFunction">
                <table class="cc-table" :style="{width:tableWidth,height:tableHeight}">
                    <thead>
                        <tr v-for="(row,idx) in ['tableTitle','tableTitleFixed']" ref="tableTitle" :key="idx">
                            <td v-for="(col,i) in title" :key="i">
                                <sort-click v-if="col.sort" :title="col.label" v-on:sortby="sortBy" :keys="col.sort" :column="column" :type="type" ></sort-click>
                                <template v-else>{{col.label}}</template>
                            </td>
                        </tr>
                    </thead>
                    <template>
                    <cc-tbody>
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
            render (h) {
                // console.log('children',this.$parent.data)
                // console.log('>>',this.$parent.$slots.default)
                // console.log('this=>',this.$parent.$slots.default[0].data.attrs)
                // console.log('this=>',this.$parent.$slots.default[0].data.scopedSlots.default)
                // console.log('fun',fun)
                let slotsNames = []
                let slotMapping = {}
                let title = []
                let grids = this.$parent.grid
                let slotsDef = this.$parent.$slots.default.filter((v) => { return v.componentOptions && v.componentOptions.tag === 'cc-table-col' })
                // console.log('slotsDef',slotsDef)
                slotsDef.forEach((slot) => {
                    slotMapping[slot.data.attrs.name] = slot
                })
                // console.log('map',slotMapping)
                grids.forEach((grid) => {
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
                // console.log('title',title)
                this.$parent.title = title
                let rowSlots = []
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
                // slots = [h('tr', [h('td','1'),h('td','2')]),h('tr', [h('td','2'),h('td','1')])]
                return h('tbody', rowSlots)
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
    props: ['data', 'grid', 'column', 'type', 'width', 'height'],
    data () {
        return {
            tableWidth: this.width || '100%',
            tableHeight: this.height || '100%',
            title: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.setFixedTitle()
        })
        window.onresize = () => {
            this.setFixedTitle()
        }
    },
    created () {
    },
    methods: {
        scrollFunction (e) {
            var titleFixed = this.$refs.tableTitle[1]
            titleFixed.style.left = 0 - e.srcElement.scrollLeft + 'px'
        },
        setFixedTitle () {
            if (!this.$refs.tableTitle) return
            var psTitle = this.$refs.tableTitle[0]
            var psFixTitle = this.$refs.tableTitle[1]
            var ps = psTitle.getElementsByTagName('td')
            var psFixed = psFixTitle.getElementsByTagName('td')
            psFixTitle.style.width = psTitle.clientWidth + 'px'
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
