<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { cloneDeep } from 'lodash-es'
import { IconJson } from '@/components/Icon/src/data'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'IconSelect' })

type ParameterCSSProperties = (item?: string) => CSSProperties | undefined

const props = defineProps({
  modelValue: {
    require: false,
    type: String
  }
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string) }>()

const visible = ref(false)
const inputValue = toRef(props, 'modelValue')
const iconList = ref(IconJson)
const icon = ref('add-location')
const currentActiveType = ref('ep:')
// 深拷贝图标数据，前端做搜索
const copyIconList = cloneDeep(iconList.value)

const pageSize = ref(96)
const currentPage = ref(1)

// 搜索条件
const filterValue = ref('')

const tabsList = [
  {
    label: 'Element Plus',
    name: 'ep:'
  },
  {
    label: 'Font Awesome 4',
    name: 'fa:'
  },
  {
    label: 'Font Awesome 5 Solid',
    name: 'fa-solid:'
  }
]

const pageList = computed(() => {
  if (currentPage.value === 1) {
    return copyIconList[currentActiveType.value]
      ?.filter((v) => v.includes(filterValue.value))
      .slice(currentPage.value - 1, pageSize.value)
  } else {
    return copyIconList[currentActiveType.value]
      ?.filter((v) => v.includes(filterValue.value))
      .slice(
        pageSize.value * (currentPage.value - 1),
        pageSize.value * (currentPage.value - 1) + pageSize.value
      )
  }
})
const iconCount = computed(() => {
  return copyIconList[currentActiveType.value] == undefined
    ? 0
    : copyIconList[currentActiveType.value].length
})

const iconItemStyle = computed((): ParameterCSSProperties => {
  return (item) => {
    if (inputValue.value === currentActiveType.value + item) {
      return {
        borderColor: 'var(--el-color-primary)',
        color: 'var(--el-color-primary)'
      }
    }
  }
})
const copyToClipboard = async (val:String) => {
  try {
    const textToCopy = ref(val);
    await navigator.clipboard.writeText(textToCopy.value); 
    ElMessage({
      message: val+'已复制到剪贴板',
      type: 'success'
    });
  } catch (err) { 
  }
}

function handleClick({ props }) {
  currentPage.value = 1
  currentActiveType.value = props.name
  emit('update:modelValue', currentActiveType.value + iconList.value[currentActiveType.value][0])
  icon.value = iconList.value[currentActiveType.value][0]
}

function onChangeIcon(item) {
  icon.value = item
  emit('update:modelValue', currentActiveType.value + item)
  visible.value = false
}

function onCurrentChange(page) {
  currentPage.value = page
}

watch(
  () => {
    return props.modelValue
  },
  () => {
    if (props.modelValue && props.modelValue.indexOf(':') >= 0) {
      currentActiveType.value = props.modelValue.substring(0, props.modelValue.indexOf(':') + 1)
      icon.value = props.modelValue.substring(props.modelValue.indexOf(':') + 1)
    }
  }
)
watch(
  () => {
    return filterValue.value
  },
  () => {
    currentPage.value = 1
  }
)
</script>

<template>
  <div class="selector">  

          <ElInput v-model="filterValue" class="p-2" clearable placeholder="搜索图标" />
          <ElDivider border-style="dashed" />
          <div class="padding"><Icon :icon="currentActiveType+icon" color="blue" size="24"/> <strong> 图标信息: </strong> {{currentActiveType}}{{icon}} <el-button @click="copyToClipboard(currentActiveType+icon)">拷贝</el-button>  <strong> 用法：</strong>{{ "<Icon icon=\""+currentActiveType+icon+"\" color=\"blue\" :size=\"24\" />" }} <el-button @click='copyToClipboard( "<Icon icon=\""+currentActiveType+icon+"\" color=\"blue\" :size=\"24\" />" )'>拷贝</el-button></div>
          <ElDivider border-style="dashed" />   
          <div class="padding">
            <Icon icon="logos:alfresco" size="24"/><Icon icon="logos:analog" size="24"/>更多好看的logos图标请访问 <el-link href="https://icones.js.org/collection/logos">https://icones.js.org/collection/logos</el-link><strong> 用法：</strong>{{ "<Icon icon=\"logos:alfresco\" :size=\"24\" />" }}
          </div>
          <ElTabs v-model="currentActiveType" @tab-click="handleClick" class="padding">
            <ElTabPane
              v-for="(pane, index) in tabsList"
              :key="index"
              :label="pane.label"
              :name="pane.name"
            >
              <ElDivider border-style="dashed" class="tab-divider" />
              <ElScrollbar height="400px">
                <ul class="ml-2 flex flex-wrap px-2">
                  <li
                    v-for="(item, key) in pageList"
                    :key="key"
                    :style="iconItemStyle(item)"
                    :title="item"
                    class="icon-item mr-2 mt-1 w-1/10 flex cursor-pointer items-center justify-center border border-solid p-2"
                    @click="onChangeIcon(item)"
                  >
                    <Icon :icon="currentActiveType + item"  />
                  </li>
                </ul>
              </ElScrollbar>
            </ElTabPane>
          </ElTabs>
          <ElDivider border-style="dashed" />

          <ElPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="iconCount"
            background
            class="h-10 flex items-center justify-center"
            layout="prev, pager, next"
            small
            @current-change="onCurrentChange"
          /> 
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 1px auto !important;
}

.tab-divider.el-divider--horizontal {
  margin: 0 !important;
}

.icon-item {
  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    transform: scaleX(1.05);
    transition: all 0.4s;
  }
}

:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px #ccc;
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px #ccc;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-tabs__item) {
  height: 30px;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
  position: static;
  margin: 0;
}
</style>
