<template>
	
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<!-- <el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> -->
				<el-form-item label="执行人姓名" prop="bidUserid">
 					  <mdp-select-user v-model="addForm.bidUserid" :init-name="addForm.bidUsername" @change2="(e)=>{addForm.bidUsername=e.username;addForm.bidBranchId=e.branchId}"/>
				</el-form-item>
				<el-form-item label="报价工期" prop="quoteWeekday">
					<div>
						<el-input v-model="addForm.quoteWeekday" style="width:30%;" type="number" placeholder="报价工期（不包括周六日）" />工作日
						<el-date-picker
							v-model="quoteDateRanger"
							class="hidden-sm-and-down"
							type="daterange"
							align="right"
							:unlink-panels="true"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="完成日期"
							value-format="YYYY-MM-DD HH:mm:ss"
							:default-time="['00:00:00','23:59:59']"
							:picker-options="pickerOptions"
						 />
					</div>
				</el-form-item>
				<el-form-item label="报价工作量" prop="quoteWorkload">
					<el-input v-model="addForm.quoteWorkload" type="number" placeholder="报价工作量（人时）" />
				</el-form-item>
				<el-form-item label="报价金额" prop="quoteAmount">
					<el-input v-model="addForm.quoteAmount" type="number" placeholder="报价金额" />
				</el-form-item>
				<el-form-item label="擅长技能" prop="skillRemark">
					<el-input type="textarea" :row="3" v-model="addForm.skillRemark" placeholder="擅长技能" />
				</el-form-item>
				<el-form-item label="匹配指数" prop="matchScore">
					<el-input v-model="addForm.matchScore" type="number" placeholder="匹配指数" />
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input type="textarea" :row="3" v-model="addForm.remarks" placeholder="备注说明" />
				</el-form-item>
				<el-form-item label="创建人姓名" prop="createUsername">
					{{userInfo.username}}
				</el-form-item>
			</el-form>

			<div class="footer"> 
						<el-button @click="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click="addSubmit" :disabled="load.add==true">提交</el-button>
 				</div>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import { addXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	

	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		props:['xmTaskExecuser','visible',"xmTask",'execuserAddType'],
		watch: {
	      'xmTaskExecuser':function( xmTaskExecuser ) {
	        this.addForm = xmTaskExecuser;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
 				this.setQuoteInfoByXmTask();
				if(this.execuserAddType!="join"){
					this.showSelectUsers();
				}else{
					this.addForm.bidUserid=this.userInfo.userid
					this.addForm.bidUsername=this.userInfo.username
					this.addForm.bidBranchId=this.userInfo.branchId
				}
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				dicts:{
					projectTaskExecuserStatus:[],
					projectTaskSettleStatus:[],

				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_task_execuse
				addForm: {
					createTime:'',id:'',taskId:'',bidUserid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',bidUsername:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},
				userSelectVisible: false,
				quoteDateRanger: [
				],
				pickerOptions:  util.getPickerOptions('datarange'),
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmTaskExecuser xm_task_execuser 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(!this.addForm.bidUserid){
					this.$notify.error("请选择一个人");
					return
				} 
				else{
					this.$refs.addForm.validate((valid) => {
						if (valid) {
							this.$confirm('确认提交吗？', '提示', {}).then(() => {
								this.load.add=true
								let params = Object.assign({}, this.addForm);
								params.taskId = this.xmTask.id;
								params.projectId=this.xmTask.projectId
								params.phaseId=this.xmTask.phaseId
								params.projectName=this.xmTask.projectName
								params.taskName=this.xmTask.name
								if(this.quoteDateRanger.length>=2){
									params.quoteStartTime=this.quoteDateRanger[0]
									params.quoteEndTime=this.quoteDateRanger[1]
								}
								addXmTaskExecuser(params).then((res) => {
									this.load.add=false
									var tips=res.tips;
									if(tips.isOk){
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
								}).catch( err  => this.load.add=false);
							});
						}
					});
				}
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			showSelectUsers: function(){
				this.userSelectVisible=true;
			}, 

			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			setQuoteInfoByXmTask(){
				if(this.xmTask){
				this.addForm.quoteWorkload=this.xmTask.budgetWorkload
				this.addForm.quoteAmount=this.xmTask.budgetCost
				this.addForm.quoteStartTime=this.xmTask.startTime
				this.addForm.quoteEndTime=this.xmTask.endTime
				this.quoteDateRanger=[this.xmTask.startTime,this.xmTask.endTime]
				var start= new Date(this.addForm.quoteStartTime);
				var end= new Date(this.addForm.quoteEndTime);
				var weekday=this.getWeekday(start,end);
				this.addForm.quoteWeekday=weekday
			}
			}
			/**end 在上面加自定义方法**/

		},//end method
		components: { 
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmTaskExecuser);
			this.setQuoteInfoByXmTask();
			if(this.execuserAddType!="join"){
				this.showSelectUsers();
			}else{
				this.addForm.bidUserid=this.userInfo.userid
				this.addForm.bidUsername=this.userInfo.username
				this.addForm.bidBranchId=this.userInfo.branchId
			}

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
