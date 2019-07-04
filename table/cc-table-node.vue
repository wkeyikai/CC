<template>
    <table ref="table">
        <thead>
            <tr v-for="(row,idx) in 2" ref="title" :key="idx">
                <td v-for="(col,j) in title" :key="j">
                    <template v-if="col.sort">
                        <a class="sort-click" @click="sortBy(col.sort)">{{col.label}}</a>
                        <div class="sort">
                            <i class="fa fa-caret-up" v-if=" sortKey!=col.sort || sortType == 'asc'"></i>
                            <i class="fa fa-caret-down" v-if=" sortKey!=col.sort || sortType == 'desc'"></i>
                        </div>
                    </template>
                    <template v-else>{{col.label}}</template>
                </td>
            </tr>
        </thead>
        <tbody-item :type="type"></tbody-item>
    </table>
</template>
<script>
export default {
    name: 'cc-table-node',
    // props: ['data'],
    data () {
        return {
            sortKey: '',
            sortType: ''
        }
    },
    components: {
        'tbody-item': {
            data () {
                return {}
            },
            props: ['type'],
            render (h) {
                let rowSlots = []
                this.$parent.data.forEach((val, i) => {
                    let slots = []
                    this.$parent.slotsNames.forEach((slot, j) => {
                        let props = {
                            index: i,
                            row: val,
                            txt: val[slot.name]
                        }
                        let txt = slot.scopedSlots(props)
                        slots.push(h('td', { class: slot.setting.class, style: slot.setting.style }, txt))
                    })
                    let trSet = ((index) => {
                        return {
                            on: {
                                mouseover: (e) => {
                                    this.$parent.triggerIndex = index
                                }
                            },
                            class: { trigger: this.$parent.triggerIndex === index }
                        }
                    })(i)
                    rowSlots.push(h('tr', trSet, slots))
                })
                return h('tbody', rowSlots)
            }
        }
    },
    props: ['type'],
    methods: {
        sortBy (key) {
            this.sortKey = key
            this.sortType = this.sortType === 'asc' ? 'desc' : 'asc'
            this.$parent.sortBy(key, this.sortType)
        }
    },
    computed: {
        data () {
            return this.$parent.data
        },
        title () {
            return this.$parent.tables[this.type].title || []
        },
        slotsNames () {
            return this.$parent.tables[this.type].slotsNames || []
        },
        triggerIndex: {
            get () {
                return this.$parent.triggerIndex
            },
            set (value) {
                this.$parent.triggerIndex = value
            }
        }
    }
}
</script>

<style lang="css">
</style>
