import { DirectiveBinding } from 'vue'

interface ExHTMLElement extends HTMLElement {
  resizeListener: EventListener
}

export default {
  mounted: (el: ExHTMLElement, binding: DirectiveBinding) => {
    el.resizeListener = () => {
      setHeight(el, binding)
    }
    setHeight(el, binding)
    window.addEventListener('resize', el.resizeListener)
  },
  updated(el: ExHTMLElement, binding: DirectiveBinding) {
      setHeight(el, binding)
  },
  unmounted(el: ExHTMLElement) {
    window.removeEventListener('resize', el.resizeListener)
  }
}

// set el-table height
function setHeight(el: ExHTMLElement, binding: DirectiveBinding) {   
  const disabled=binding?.value?.disabled
  if(disabled){ 
    el.style.height = '100%'
     return;
  }
  const top =el.getBoundingClientRect().top
  const bottom = binding?.value?.bottom || 64
  const pageHeight = window.innerHeight 
  el.style.height = pageHeight - top - bottom + 'px'
  el.style.overflowY = 'auto'  // 新增加
} 