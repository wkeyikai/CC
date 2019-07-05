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
        <cc-tbody :type="type"></cc-tbody>
    </table>
</template>
<script>
import ccTbody from './cc-tbody'
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
    ccTbody
  },
  props: ['type'],
  methods: {
    sortBy (key) {
      this.sortKey = key
      this.sortType = this.sortType === 'asc' ? 'desc' : 'asc'
      this.$parent.sortBy(key, this.sortType)
    },
    slots (slot, para) {
      return slot.scopedSlots(para)
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
