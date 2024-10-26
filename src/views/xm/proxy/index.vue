<template>  
<div class="center">
  <div>商业版功能，请联系商务</div>
  <div>唛盟客服微信二维码</div>
  <img :src="kfImg"/>
</div>

</template>

<script>  

import kfImg from './mm_wx_kf_qrcode.png'
export default {
  data(){
    return {
      kfImg: kfImg
    }
  }
}
</script> 