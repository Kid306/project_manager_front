<script lang="ts" setup>

import { getCurrentInstance,defineEmits,defineExpose,useAttrs,useSlots } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is' 
defineOptions({ name: 'MdpDialog' })
const emit = defineEmits(['update:modelValue','close']);

const slots = useSlots()
const currInstance = getCurrentInstance()
const props = defineProps({
  data:propTypes.object.def({}),
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('弹窗'),
  fullscreen: propTypes.bool.def(false),
  width: propTypes.oneOfType([String, Number]).def('60%'),
  scroll: propTypes.bool.def(false), // 是否开启滚动条。如果是的话，按照 maxHeight 设置最大高度
  maxHeight: propTypes.oneOfType([String, Number]).def('400px')
})
const visible = ref(false)
const value = computed({ 
      set(val:boolean){ 
        emit('update:modelValue',val)
        visible.value=val
        if(val==false){
          emit('close')
        }
      },
      get(){  
        return props.modelValue||visible.value
      }  
})
const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight', 'appendToBody']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullscreen = ref(false)
isFullscreen.value=props.fullscreen

const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen)
}

const myTitle = ref(null)
const data3 = ref({} as any)
const open = (data2) => { 
  visible.value=true 
  if(data2 && data2.title){
    myTitle.value=data2.title
  }
  if(data2){
    data3.value=data2
  }else{
    data3.value={}
  }
}

const close = () => { 
   value.value=false
}

currInstance.close=close
currInstance.open=open
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)

watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
    }
  },
  {
    immediate: true
  }
)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})
defineExpose({
  open,close
})
</script>

<template>
  <ElDialog
    v-bind="getBindValue"
    v-model="value"
    :close-on-click-modal="false"
    :fullscreen="isFullscreen"
    :width="width"
    lock-scroll
    draggable
    class="com-dialog" 
    :show-close="false"
    append-to-body
  >
    <template #header="{ close }">
      <div class="relative h-54px flex items-center justify-between pl-15px pr-15px">
        <slot name="title">
          {{ myTitle||title }}
        </slot>
        <div
          class="absolute right-15px top-[50%] h-54px flex translate-y-[-50%] items-center justify-between"
        >
          <Icon
            class="is-hover mr-10px cursor-pointer"
            :icon="isFullscreen ? 'radix-icons:exit-full-screen' : 'radix-icons:enter-full-screen'"
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="toggleFull"
          />
          <Icon
            class="is-hover cursor-pointer"
            icon="ep:close"
            hover-color="var(--el-color-primary)"
            color="var(--el-color-info)"
            @click="close"
          />
        </div>
      </div>
    </template>   
    <ElScrollbar v-if="scroll===true" :style="dialogStyle">
        <slot  :visible="value" :title="myTitle||title" :data="data3?data3:{}" :dialog="currInstance"></slot>
      </ElScrollbar>
      <slot v-else :visible="value" :title="myTitle||title" :data="data3?data3:{}" :dialog="currInstance"></slot>
   
    <template v-if="slots.footer" #footer>
      <slot name="footer" :visible="value" :title="myTitle||title" :data="data3?data3:{}" :dialog="currInstance"></slot>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.com-dialog {
  .#{$elNamespace}-overlay-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .#{$elNamespace}-dialog {
    margin: 0 !important;

    &__header {
      height: 54px;
      padding: 0;
      margin-right: 0 !important;
      border-bottom: 1px solid var(--el-border-color);
    }

    &__body {
      padding: 15px !important;
    }

    &__footer {
      border-top: 1px solid var(--el-border-color);
    }

    &__headerbtn {
      top: 0;
    }
  }
}
</style>
