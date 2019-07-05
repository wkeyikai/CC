<script>
export default {
    name: 'ccTbody',
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
</script>
