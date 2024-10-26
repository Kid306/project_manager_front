<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign' 
defineOptions({ name: 'ContentWrap' }) 
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')

defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def(''),
  hideFooter:propTypes.bool.def(true),
  hideHeader:propTypes.bool.def(false),
})
</script>

<template>
  <ElCard :class="[prefixCls,'mdp-card']">
    <template v-if="$slots.header"  #header> 
      <slot name="header"></slot> 
    </template>  
    <slot v-if="$slots.default"></slot>  
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElCard>
</template>
<style lang="scss">
.mdp-card {
  .el-card__header {   
    
    padding-left:5px;
    padding-top:5px;
    padding-bottom: 5px;  
  }
  .el-card__body {   
    padding-left:5px;
    padding-top:5px;
    padding-bottom: 5px;  
  }
}

</style> 
