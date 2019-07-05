<template>
    <div>
        <a class="cc-sort--click" @click="sortBy(keys)">{{title}}</a>
        <div class="cc-sort--icon">
            <i class="fa fa-caret-up" v-if=" column!=keys || type == 'asc'"></i>
            <i class="fa fa-caret-down" v-if=" column!=keys || type == 'desc'"></i>
        </div>
    </div>
</template>
<script>
export default {
  name: 'cc-sort',
  props: {title: String, column: String, keys: String, type: String}
}
</script>

<style lang="css">
.cc-sort--click{
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
    color: rgb(66, 139, 202);
    /*font-weight: bold;
    cursor: pointer;
    text-decoration:underline;
    color: #428BCA;*/
}
.cc-sort--icon {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    left: 3px;
    top: -2px;
}
.cc-sort--icon i.fa.fa-caret-up {
    position: absolute;
    bottom: -3.5px;
}
.cc-sort--icon i.fa.fa-caret-down {
    position: absolute;
    top: -3.5px;
}
</style>
