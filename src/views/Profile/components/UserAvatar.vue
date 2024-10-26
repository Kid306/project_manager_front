<template>
  <div class="change-avatar">
    <CropperAvatar
      ref="cropperRef"
      :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
      :showBtn="false"
      :value="img"
      width="120px"
      @change="handelUpload"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes' 

import axios from '@/config/maxios'
const {proxy} = getCurrentInstance()
import { CropperAvatar } from '@/components/Cropper'
import { useUserStore } from '@/store/modules/user'

const message = useMessage()

defineOptions({ name: 'UserAvatar' })

defineProps({
  img: propTypes.string.def('')
})

const userStore = useUserStore()


const cropperRef = ref()
const handelUpload = async ({ data }) => {
   
// 假设你已经有了一个名为imageBlob的Blob图片
const imageBlob = data;
const file = blobToFile(imageBlob, 'image.png');
 
// 使用FormData来构建请求
const formData = new FormData();
formData.append('file', file);
 
// 使用axios发送请求
let response = await axios.upload({url:proxy.$mdp.getArcImageUploadPath(),params:{categoryId:'userhead'}, data:formData})
 let {tips}=response
 if(tips.isOk){
   let res= await proxy.$mdp.editHeadimgurl({ headimgurl:response.data.url })
    cropperRef.value.close()
    if(res.tips.isOk){
      userStore.setUserHeadimgurlAction(response.data.url)
    }else{
      message.showTips(tips)
    }
    
  }else{
    message.showTips(tips)
  }
 }



// 假设你已经有了一个Blob对象，例如从canvas.toBlob()获取的图片Blob
const blobToFile = (blob, fileName) => {
  // 创建一个File对象
  return new File([blob], fileName, { type: blob.type });
}

</script>

<style lang="scss" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }
}
</style>
