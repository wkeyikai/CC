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
import ccTable from '@/components/cc/cc-table'
import ccTableCol from '@/components/cc/cc-table-col'
export default {
    components: {
        treeview,gismap,gisline,gismark
    },
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