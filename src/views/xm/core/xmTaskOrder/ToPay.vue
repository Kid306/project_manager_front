<template>
	
	    <el-row class="page-header">
			<div class="pay_way">
			<h2>支付方式</h2>
			<div class="pay_way_items">
				<div class="oItem" @click="selectPayWay(item)"  v-for="(item, index) in payWayOptions" :key="index">
				<img :src="item.icon" />
				<span>{{item.label}}</span>
				<i v-if="item.isChecked" class="select success"></i>
				</div>
			</div>
 			</div>
	    </el-row>
		<el-row class="page-main">  
			<div class="pay_allAmount">
			<h2>订单总额</h2>
			<p class="allAmount">￥<b>{{editForm?editForm.finalFee:''}}</b></p>
			<el-checkbox v-model="agreementChecked">同意</el-checkbox> <a style="font-size: 14px;color: #409EFF">《服务协议》</a>
			</div>
		</el-row>

		<el-row  class="page-bottom bottom-fixed">
		    <el-button @click="handleCancel">取消</el-button>
            <el-button v-loading="load.add" type="primary" @click="createOrder" :disabled="load.add==true">提交</el-button>
		</el-row>
		<mdp-dialog
			title="微信支付"
			v-model="weixinPayVisible"
			:show-close="false"
			append-to-body
			@close="closeDialog"
			width="350px"
			>
			<qriously :value="codeUrl" :size="300" /> 
		</mdp-dialog>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
 	import {  addXmTaskOrder,editXmTaskOrder,editSomeFieldsXmTaskOrder,calcXmTaskOrder} from '@/api/xm/core/xmTaskOrder';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
	import {aliPay, weixinPay, checkWxPayStatus} from '@/api/mdp_pub/pay'

	import aliPayImg from '@/assets/image/module/alipay.png';
	import weixinPayImg from '@/assets/image/module/weixin.png';
	export default {
	    name:'xmTaskOrderEdit',
	    components: {

        },
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['taskId','visible','bizType'],

		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.calcOrder();
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
					ouserid:'',obranchId:'',ostatus:'',ctime:'',ltime:'',payType:'',payStatus:'',payTime:'',prepayId:'',id:'',finalFee:'',othFee:'',originFee:'',payAt:'',payAuthId:'',payOpenid:'',payUserid:'',payUsername:'',discount:'',topFee:'',topStime:'',topEtime:'',hotFee:'',hotStime:'',hotEtime:'',top:'',hot:'',crmSupFee:'',urgentFee:'',urgent:'',crmSup:'',efunds:'',estate:'',etoPlatTime:'',etoDevTime:'',ebackTime:'',taskId:'',topDays:'',hotDays:'',urgentDays:'',urgentStime:'',urgentEtime:'',calcStatus:'',calcTime:'',oshare:'',shareFee:'',payId:'',tranId:'',remark:'',name:''
				},
                maxTableHeight:300,
				codeUrl:'', 
				weixinPayVisible: false,
				payType:'1',
				payWayOptions: [
					{
					label: '支付宝',
					val: '2',
					icon: aliPayImg,
					isChecked: false
					},
					{
					label: '微信',
					val: '1',
					icon: weixinPayImg,
					isChecked: true
					}
				],
				agreementChecked:false,
				timer:0,
			}//end return
		},//end data
		methods: {

		    ...util,
			

			selectPayWay(item) {
			this.payType = item.val;
			this.payWayOptions.forEach(element => {
				element.isChecked = false;
				if(item.val == element.val) {
				element.isChecked = true;
				}
			});
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){ 
				this.$emit('cancel');
			}, 
			calcOrder(){
				var params={taskId:this.taskId,payType:this.payType,bizType:this.bizType}
				calcXmTaskOrder(params).then(res=>{
					var tips = res.tips
					if(tips.isOk){
						Object.assign(this.editForm,res.data)
					}else{
						this.$notify.error(tips.msg);
					}
				})
			},
			createOrder() { 
				if(!this.agreementChecked){ 
                    this.$notify({position:'bottom-left',showClose:true,message:"请仔细阅读协议，并勾选同意",type: 'error'})
					return;
				}
				this.load.add=true;
			var params={taskId:this.taskId,payType:this.payType,bizType:this.bizType}
			addXmTaskOrder(params).then(res => {
				this.load.add=false;
				if(res.tips.isOk){
				//获取订单号
				Object.assign(this.editForm,res.data)
				let orderId = res.data.id;
				if(this.payType == '2') {
					
					this.toAliPay(orderId);
					return;
				}
				if(this.payType == '1') {
					this.toWeixinPay(orderId);
					return;
				}
				}else{
				this.$notify.error(res.tips.msg);
				}
			}).catch(err => {
				this.$notify.error(err.msg);
			}).finally(() => {
			})
			},

			toAliPay(orderId) {
				this.load.add=true;
				var taskId=this.editForm.taskId
			let params = { 
				id: orderId,
				otype: '3',
				returnUrl: `${window.location.protocol+"//"+window.location.host}/${process.env.CONTEXT}/${process.env.VERSION}/#/xm/core/xmTask/XmTaskDetailRoute?id=${taskId}&load=true`
			}
			aliPay(params).then(res => {
				
				this.load.add=false;
				if(res.tips.isOk) {
				const div = document.createElement("divform"+orderId);
				div.innerHTML = res.data.htmlStr;
				document.body.appendChild(div);
				var eles=document.getElementsByTagName("divform"+orderId);
				eles[0].firstElementChild.submit();
				//document.forms[0].submit();
				}else {
				this.$notify.error(res.tips.msg);
				}
			}).finally(() => {
				setTimeout(() => {
				this.load.add = false;
				}, 2000);
			})
			},

			toWeixinPay(orderId) {
				this.load.add=true;
			let params = {
				id: orderId,
				otype: '3',
				returnUrl: ""
			}
			weixinPay(params).then(res => {
				this.load.add=false;
				if(res.tips.isOk) {
				this.codeUrl = res.data.codeUrl;
				this.weixinPayVisible = true;
				this.timer = setInterval(() => {
					this.queryOrderStatus(orderId)
				}, 3000)
				}else {
				this.$notify.error(res.tips.msg);
				}
			}).finally(() => {
				setTimeout(() => {
				this.load.add = false;
				}, 2000);
			})
			},

			//查询订单支付状态
			queryOrderStatus(orderId) {
			console.log("查询订单");
			checkWxPayStatus({'orderId': orderId, "otype": "3"}).then(res => {
				if(res.tips.isOk) {
				//this.$router.push({path:'/my/order/paySuccess', query:{total_amount: this.data.amount, out_trade_no: orderId}});
				this.$emit("pay-success",orderId)
				clearInterval(this.timer);
				}else {
				}
			}).finally(() => {
				
			})
			},

			closeDialog() {
			clearInterval(this.timer);
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {  
				this.calcOrder(); 
            });
		}
	}

</script>

<style lang="scss" scoped>

    .pay_way {
        margin-top: 50px;
        h2 {
            margin-bottom: 20px;
        }
        .pay_way_items {
            display: flex;
            .oItem {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 200px;
                height: 80px;
                margin-right: 30px;
                border: 2px solid #E3E4E6;
                border-radius: 8px;
                margin-top: 5px;
                position: relative;
                cursor: pointer;
                img {
                    width: 50px;
                    height: 50px;
                    margin: 13px 18px 13px 40px;
                }
                .select {
                    font-size: 30px;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    color: #409EFF;
                }
            }
        }

        .phone  {
            margin-top: 10px !important;
            width: 440px;
        }
    }
  
    .pay_allAmount {
        margin-top: 30px;
        h2 {
            margin-bottom: 20px;
        }
        .allAmount {
            font-size: 22px;
            font-weight: bold;
            color: #FA5A55;
            margin-bottom: 20px;
            b {
                font-size: 38px;
            }
        }
    }
</style>