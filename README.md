use cc

import src\main.js

```vue
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugin/cc'

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
```
or

import other component(ex: src\component\main.vue )

```vue
import '@/plugin/cc'
```

use table

```vue
<template>
    <div>
		<cc-table :data="gridData" :grid="['space','id','name']"  @sortby="sortBy" :column="sort.column" :type="sort.sort_type">
			<cc-table-col name="space" label="test">
				<template slot-scope="{row}">
					{{123}}
				</template>
			</cc-table-col>
			<cc-table-col name="id" label="ID">
			</cc-table-col>
			<cc-table-col name="name" label="NAME" sort="name_sort">
				<template slot-scope="{row}">
					{{row.id+':'+row.name}}
				</template>
			</cc-table-col>
		</cc-table>
	</div>
</template>
<script>
import '@/plugin/cc'
export default {
    components: { ccTable, ccTableCol },
	data () {
		return {
			demoRowData: {
				id: '1',
				name: 'Aaron',
			},
			gridData: [],
			sort: {
				column: '',
				sort_type: ''
			}
		}
	},
	created () {
		this.gridData.push(this.demoRowData)
	},
	methods: {
		sortBy () {
		}
	}
}
</script>
```