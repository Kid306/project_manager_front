import axios from '@/config/maxios'
import config from '@/api/mdp_pub/mdp_config'
let base = config.getPayCtx();

export const aliPay = params => { return axios.post(`${base}/pay/alipay/uniOrder`, params) }
export const weixinPay = params => { return axios.post(`${base}/pay/wxpay/uniOrder/native`, params) }
export const checkWxPayStatus = params => { return axios.get(`${base}/pay/wxpay/uniOrder/checkOrderStatus`, {params}) }
