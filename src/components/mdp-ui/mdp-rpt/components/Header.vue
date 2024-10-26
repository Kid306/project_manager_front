<template>
	<div :class="{ 'row-box': true, 'cfg': isRptCfg }">
		<slot name="title">
			<div class="title">{{ titleVal ? titleVal : (isRptCfg ? '标题' : '') }}</div>
			<el-input class="input" v-model="titleVal" placeholder="标题" />
		</slot>
		<slot name="paramsBtn">
			<el-link icon="more" class="params-btn" v-if="showParams" @click="$refs.paramsDlg.open()" :style="{width:(btnTitle?.length>0?(btnTitle.length+4)+'em':'auto')}">{{ btnTitle||"" }}</el-link> 
		</slot>
		
	</div>
	<div :class="{ 'row-box': true, 'cfg': isRptCfg }">
		<slot name="remark"> 
			<div class="remark">{{ remarkVal ? remarkVal : (isRptCfg ? '详细说明' : '') }}</div>
			<el-input type="textarea" row="4" class="input" v-model="remarkVal" placeholder="说明" />
		</slot>
	</div>
	<MdpDialog ref="paramsDlg"> 
		<ContentWrap>
			<template #header>
				<slot name="toolbarBox">
					<el-space wrap>
						<el-button type="danger" icon="delete" @click="$emit('delete')" title="从报告移出该报表" plain/>
						<slot name="toolbar"></slot>
					</el-space>
				</slot> 
			</template>
			<slot>

			</slot>
		</ContentWrap>
	</MdpDialog>
</template>

<script>
 

 export default {

	components: { 
	},
	props: [ 'showParams', 'isRptCfg','title','remark','btnTitle'],
	computed: { 
		titleVal:{
			set(val){
				this.$emit('update:title',val)
			},
			get(){
				return this.title
			}
		},
		remarkVal:{
			set(val){
				this.$emit('update:remark',val)
			},
			get(){
				return this.remark
			}
		}
	},
	watch: {
		 
	},
	data() {
		return {   
		}//end return
	},//end data
	methods: {
		  
	},//end method
	mounted() {
		 
	}//end mounted
}

</script> 
<style lang="scss">  
  @import '../common.scss';
</style>
