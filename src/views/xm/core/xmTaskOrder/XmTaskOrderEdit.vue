<template>
	
	    <el-row class="page-header" />
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTaskOrder 任务相关费用订单表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="下单用户编号" prop="ouserid">
					<el-input v-model="editForm.ouserid" placeholder="下单用户编号" :maxlength="50" @change="editSomeFields(editForm,'ouserid',$event)"/>
				</el-form-item> 
				<el-form-item label="公司ID-下单客户对应的企业" prop="obranchId">
					<el-input v-model="editForm.obranchId" placeholder="公司ID-下单客户对应的企业" :maxlength="50" @change="editSomeFields(editForm,'obranchId',$event)"/>
				</el-form-item> 
				<el-form-item label="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" prop="ostatus">
					<el-input v-model="editForm.ostatus" placeholder="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" :maxlength="1" @change="editSomeFields(editForm,'ostatus',$event)"/>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="支付方式1微信2支付宝" prop="payType">
					<el-input v-model="editForm.payType" placeholder="支付方式1微信2支付宝" :maxlength="1" @change="editSomeFields(editForm,'payType',$event)"/>
				</el-form-item> 
				<el-form-item label="支付状态0待付款，1已付款" prop="payStatus">
					<el-input v-model="editForm.payStatus" placeholder="支付状态0待付款，1已付款" :maxlength="1" @change="editSomeFields(editForm,'payStatus',$event)"/>
				</el-form-item> 
				<el-form-item label="支付时间" prop="payTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="第三方支付订单编号" prop="prepayId">
					<el-input v-model="editForm.prepayId" placeholder="第三方支付订单编号" :maxlength="50" @change="editSomeFields(editForm,'prepayId',$event)"/>
				</el-form-item> 
				<el-form-item label="订单编号" prop="id">
					<el-input v-model="editForm.id" placeholder="订单编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"/>
				</el-form-item> 
				<el-form-item label="最终总费用=origin_fee" prop="finalFee">
					<el-input v-model="editForm.finalFee" placeholder="最终总费用=origin_fee" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="其它费用" prop="othFee">
					<el-input v-model="editForm.othFee" placeholder="其它费用" :maxlength="10"/>
				</el-form-item> 
				<el-form-item label="原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee" prop="originFee">
					<el-input v-model="editForm.originFee" placeholder="原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="最终付款金额-客户付款后回填" prop="payAt">
					<el-input v-model="editForm.payAt" placeholder="最终付款金额-客户付款后回填" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="支付授权码" prop="payAuthId">
					<el-input v-model="editForm.payAuthId" placeholder="支付授权码" :maxlength="50" @change="editSomeFields(editForm,'payAuthId',$event)"/>
				</el-form-item> 
				<el-form-item label="支付账户对应的第三方openid,注意，下单根付款不一定是同一个人" prop="payOpenid">
					<el-input v-model="editForm.payOpenid" placeholder="支付账户对应的第三方openid,注意，下单根付款不一定是同一个人" :maxlength="50" @change="editSomeFields(editForm,'payOpenid',$event)"/>
				</el-form-item> 
				<el-form-item label="付款用户编号" prop="payUserid">
					<el-input v-model="editForm.payUserid" placeholder="付款用户编号" :maxlength="50" @change="editSomeFields(editForm,'payUserid',$event)"/>
				</el-form-item> 
				<el-form-item label="付款用户名称" prop="payUsername">
					<el-input v-model="editForm.payUsername" placeholder="付款用户名称" :maxlength="255" @change="editSomeFields(editForm,'payUsername',$event)"/>
				</el-form-item> 
				<el-form-item label="折扣率0-199" prop="discount">
					<el-input-number v-model="editForm.discount" :min="0" :max="200" />
				</el-form-item> 
				<el-form-item label="置顶费用" prop="topFee">
					<el-input v-model="editForm.topFee" placeholder="置顶费用" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="置顶开始时间" prop="topStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.topStime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="置顶结束时间" prop="topEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.topEtime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="热搜费用" prop="hotFee">
					<el-input v-model="editForm.hotFee" placeholder="热搜费用" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="热搜开始时间" prop="hotStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.hotStime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="热搜结束时间" prop="hotEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.hotEtime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="是否置顶0否1待付款2已开通3已过期" prop="top">
					<el-input v-model="editForm.top" placeholder="是否置顶0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'top',$event)"/>
				</el-form-item> 
				<el-form-item label="是否热搜0否1待付款2已开通3已过期" prop="hot">
					<el-input v-model="editForm.hot" placeholder="是否热搜0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'hot',$event)"/>
				</el-form-item> 
				<el-form-item label="客服包办费用" prop="crmSupFee">
					<el-input v-model="editForm.crmSupFee" placeholder="客服包办费用" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="加急费用" prop="urgentFee">
					<el-input v-model="editForm.urgentFee" placeholder="加急费用" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="是否加急0否1待付款2已开通3已过期" prop="urgent">
					<el-input v-model="editForm.urgent" placeholder="是否加急0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'urgent',$event)"/>
				</el-form-item> 
				<el-form-item label="是否客服包办0否1待付款2已开通3已过期" prop="crmSup">
					<el-input v-model="editForm.crmSup" placeholder="是否客服包办0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'crmSup',$event)"/>
				</el-form-item> 
				<el-form-item label="托管金额" prop="efunds">
					<el-input v-model="editForm.efunds" placeholder="托管金额" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款" prop="estate">
					<el-input v-model="editForm.estate" placeholder="资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款" :maxlength="1" @change="editSomeFields(editForm,'estate',$event)"/>
				</el-form-item> 
				<el-form-item label="托管资金付款给平台的时间" prop="etoPlatTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.etoPlatTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="托管资金支付给服务商的时间" prop="etoDevTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.etoDevTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="托管资金退回甲方时间" prop="ebackTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ebackTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="任务编号" :maxlength="50" @change="editSomeFields(editForm,'taskId',$event)"/>
				</el-form-item> 
				<el-form-item label="置顶天数" prop="topDays">
					<el-input-number v-model="editForm.topDays" :min="0" :max="200" />
				</el-form-item> 
				<el-form-item label="热搜天数" prop="hotDays">
					<el-input-number v-model="editForm.hotDays" :min="0" :max="200" />
				</el-form-item> 
				<el-form-item label="加急天数" prop="urgentDays">
					<el-input-number v-model="editForm.urgentDays" :min="0" :max="200" />
				</el-form-item> 
				<el-form-item label="加急开始时间" prop="urgentStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.urgentStime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="加急结束时间" prop="urgentEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.urgentEtime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束" prop="calcStatus">
					<el-input v-model="editForm.calcStatus" placeholder="定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束" :maxlength="1" @change="editSomeFields(editForm,'calcStatus',$event)"/>
				</el-form-item> 
				<el-form-item label="计算时间" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item> 
				<el-form-item label="是否开启分享赚0否1待付款2已开通3已过期" prop="oshare">
					<el-input v-model="editForm.oshare" placeholder="是否开启分享赚0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'oshare',$event)"/>
				</el-form-item> 
				<el-form-item label="分享赚佣金" prop="shareFee">
					<el-input v-model="editForm.shareFee" placeholder="分享赚佣金" :maxlength="20"/>
				</el-form-item> 
				<el-form-item label="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" prop="payId">
					<el-input v-model="editForm.payId" placeholder="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" :maxlength="50" @change="editSomeFields(editForm,'payId',$event)"/>
				</el-form-item> 
				<el-form-item label="第三方付款事务号" prop="tranId">
					<el-input v-model="editForm.tranId" placeholder="第三方付款事务号" :maxlength="50" @change="editSomeFields(editForm,'tranId',$event)"/>
				</el-form-item> 
				<el-form-item label="订单备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="订单备注" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)"/>
				</el-form-item> 
				<el-form-item label="订单名称" prop="name">
					<el-input v-model="editForm.name" placeholder="订单名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"/>
				</el-form-item> 
				<el-form-item label="订单业务类型1-保证金，2-营销推广活动" prop="bizType">
					<el-input v-model="editForm.bizType" placeholder="订单业务类型1-保证金，2-营销推广活动" :maxlength="1" @change="editSomeFields(editForm,'bizType',$event)"/>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" class="page-bottom bottom-fixed">
		    <el-button @click="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
 	import {  addXmTaskOrder,editXmTaskOrder,editSomeFieldsXmTaskOrder } from '@/api/xm/core/xmTaskOrder';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	
	export default {
	    name:'xmTaskOrderEdit',
	    components: {

        },
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['xmTaskOrder','visible','opType'],

		watch: {
	      'xmTaskOrder':function( xmTaskOrder ) {
	        if(xmTaskOrder){
	            this.editForm = {...xmTaskOrder};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '订单编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					ouserid:'',obranchId:'',ostatus:'',ctime:'',ltime:'',payType:'',payStatus:'',payTime:'',prepayId:'',id:'',finalFee:'',othFee:'',originFee:'',payAt:'',payAuthId:'',payOpenid:'',payUserid:'',payUsername:'',discount:'',topFee:'',topStime:'',topEtime:'',hotFee:'',hotStime:'',hotEtime:'',top:'',hot:'',crmSupFee:'',urgentFee:'',urgent:'',crmSup:'',efunds:'',estate:'',etoPlatTime:'',etoDevTime:'',ebackTime:'',taskId:'',topDays:'',hotDays:'',urgentDays:'',urgentStime:'',urgentEtime:'',calcStatus:'',calcTime:'',oshare:'',shareFee:'',payId:'',tranId:'',remark:'',name:'',bizType:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTaskOrder 任务相关费用订单表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTaskOrder
							if(this.currOpType=='edit'){
							    func=editXmTaskOrder
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.tips;
                                if(tips.isOk){
                                    this.editForm=res.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmTaskOrder){
                    this.editForm = Object.assign({},this.xmTaskOrder);
                }

                if(this.opType=='edit'){

                }else{

                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)
                params[fieldName]=$event
                var func = editSomeFieldsXmTaskOrder
                func(params).then(res=>{
                  let tips = res.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
		},//end method
		mounted() {
		    this.$nextTick(() => {
                
                this.initData()
                //this.maxTableHeight =util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>