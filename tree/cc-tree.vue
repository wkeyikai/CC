<template>
  <ul class="cc-tree-view">
    <li class="cc-tree-branch" >
      <div v-if="parent"
        class="cc-tree-header"
        :class="hiLight?'cc-tree-targer':(hover?'cc-tree-hover':'')"
        :disabled="source.isLock"
        @click="selected(source)"
        @mouseover="mouseover"
        @mouseout="mouseout">
        <span class="cc-tree-name">
          <span>
            <input type="checkbox"
              :id="source.name + source.id"
              v-if="checkbox"
              v-model="source[checked]"
              :indeterminate.prop="source.notAll"
              :disabled="source.isLock"
              @change="check(source);parentCheck(source)">
            <label :for="source.name + source.id"></label>
          </span>
          <span class="cc-icon" @click="change(source)">
            <i v-if="(source[lists]||[]).length==0" class="cc-icon-blank"></i>
            <i v-else-if="isOpen" class>-</i>
            <i v-else class>+</i>
          </span>
          <span class="cc-tree-label">
            <slot name="label" :vm="this" :source="source">{{source.name}}</slot>
          </span>
        </span>
        <div class="cc-tree-custom">
          <slot name="custom" :vm="this" :source="source"></slot>
        </div>
      </div>
      <!-- v-if="source[lists]&&source[lists].length>0"-->
      <cc-tree v-show="isOpen||!parent"
        v-for="(item,index) in source[lists]"
        ref="tree"
        class="cc-tree-children"
        :key="index"
        :custom="custom"
        :source="item"
        :parent="source"
        :open="isOpen"
        :checkbox="checkbox"
        @selected="selected"
        @update="update">
        <template slot="label" slot-scope="props">
          <slot name="label" :vm="props.vm" :source="props.source">{{props.source.name}}</slot>
        </template>
        <template slot="custom" slot-scope="props">
          <slot name="custom" :vm="props.vm" :source="props.source"></slot>
        </template>
      </cc-tree>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'cc-tree',
  props: ['source', 'open', 'item', 'parent', 'childrenTag', 'checkedTag', 'checkbox', 'custom'],
  created () {
    // this.source.parent = this.parent//tmp
    // this.source.hiLight = false
    // if(!this.parent){
    //     console.log('this.parent')
    //     this.setHover()
    // }
    // 第三狀態init
    /* if(this.padding==0){
        this.$watch('source', ()=>{
            //console.log('source')
            this.source.notAll = this.iconStatus(this.source)
        });
    } */
  },
  data () {
    return {
      lists: this.childrenTag || 'lists',
      checked: this.checkedTag || 'checked',
      notAll: false,
      isOpen: this.open,
      // padding: this.level || 0,
      show: false,
      hover: false,
      hiLight: false,
      preHiLight: {}
      // vm:this
    }
  },
  methods: {
    toggle (status) {
      /* this.$children.forEach(function (val) {
          val.setToggle(status);
      }); */
      this.isOpen = status
      if (!this.$refs.tree) {
        return
      }
      this.$refs.tree.forEach(function (val) {
        val.toggle(status)
      })
    },
    selected (source, item) {
      if (!this.parent) {
        if (this.preHiLight) {
          this.preHiLight.hiLight = false
        }
        this.preHiLight = item
        // this.setHover()
        item && (item.hiLight = true)
      }
      if (this._events.selected) {
        this.$emit('selected', source, item || this)
      }
    },
    setSelect (index = '0') {
      this.$nextTick(() => {
        let indexs = index.split('-')
        let item = this
        indexs.forEach((val) => {
          if (!item.$refs.tree) return
          item = item.$refs.tree[val]
        })
        item && (item.selected(item.source))
        // (item.selected = true)
      })
    },
    change (source) {
      this.isOpen = !this.isOpen
    },
    update () {
      // 強制更新狀態 tmp
      this.source[this.checked] = !this.source[this.checked]
      this.source[this.checked] = !this.source[this.checked]
      this.parentCheck(this.source)
      // console.log('update',this.padding,this.source.notAll)
      // this.$nextTick(()=>{
      //     this.$emit('update')
      // })
    },
    check (item) {
      let select = item[this.checked]
      if (!select) {
        item.notAll = false
      }
      if (item[this.lists] && item[this.lists].length) {
        item[this.lists].forEach((val, idx) => {
          val[this.checked] = select
          /* if(!select){
                        val.notAll = false
                    } */
          // item[this.lists][idx][this.checked]  = select;
          this.check(item[this.lists][idx])
        })
      }
    },
    parentCheck (item) {
      // let select = item[this.checked]
      // let trueTag = true
      // let falseTag = false
      // let status = true, total = false
      // let items = []
      if (this.parent) {
        let datas = this.parent[this.lists].map((v) => { return v[this.checked] })
        let all = [false, ...datas].reduce((o, n) => { return o || n })
        // let notAll = ![true,...datas].reduce((o,n)=>{return o && n})
        this.parent[this.checked] = all
        // this.parent.notAll = (notAll||this.notAll)&&all//第三狀態
        this.$nextTick(() => {
          this.$emit('update')
        })
      }
    },
    iconStatus (item) {
      let select = item[this.checked]
      let datas = []
      let notData = false
      item[this.lists].forEach((val, idx) => {
        datas.push(val[this.checked])
        val.notAll = this.iconStatus(item[this.lists][idx])
        notData = notData || val.notAll
      })
      let notAll = ![true, ...datas].reduce((o, n) => { return o && n })
      return (notAll || notData) && select
    },
    mouseover () {
      this.hover = true
    },
    mouseout () {
      this.hover = false
    },
    getData (id) {
      var trueArr = []
      var falseArr = []
      var dataStatusArray = (data) => {
        if (data[this.lists]) {
          data[this.lists].forEach((val) => {
            // (val[this.checked] ? trueArr : falseArr).push(val[id])
            (val[this.checked] ? trueArr : falseArr).push(val[id])
            dataStatusArray(val)
          })
        }
      }
      dataStatusArray(this.source)
      // console.log('dataStatus_array end',this.source)
      return {checked: trueArr, notCheck: falseArr}
    },
    getSeleced (tag) {
      return this.getData(tag)
    },
    setHover () {
      // var dataStatus_array = (data)=> {
      //     if (data[this.lists]) {
      //         data[this.lists].forEach(function (val) {
      //             dataStatus_array(val)
      //             val.hiLight = false
      //         });
      //     }
      // }
      // dataStatus_array(this.source)
      let deepSetHiLight = (data) => {
        if (data.$refs.tree) {
          data.$refs.tree.forEach(function (val) {
            deepSetHiLight(val)
            val.hiLight = false
          })
        }
      }
      deepSetHiLight(this)
    },
    setToggle (toggle) { // tmp
      this.isOpen = toggle
      // console.log('tree',this.$refs.tree);
      if (!this.$refs.tree) {
        return
      }
      this.$refs.tree.forEach(function (val) {
        val.setToggle(toggle)
      })
    }
  },
  computed: {
    classObject: function () {
      return {
        active: this.isActive && !this.error,
        'text-danger': this.error && this.error.type === 'fatal'
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">
</style>
