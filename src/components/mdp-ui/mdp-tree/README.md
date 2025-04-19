### 懒加载树 mdp-tree 效果图   
![mdp-tree](/docs/images/ui-components/mdp-tree/mdp-tree.png)  
![mdp-tree-drag](/docs/images/ui-components/mdp-tree/mdp-tree-drag.png)  

mdp-tree属于的懒加载树，相对于el-tree有以下改进:   
1. 实现前后端数据连通，提供crud接口即可，无须写多余的代码
2. 提供本地过滤实现，无须写代码
3. 懒加载实现，第一层默认进行缓存，多个页面共享不再担心性能问题
4. 提供自由拖拽实现，并提供拖拽后是否真正改变了隶属关系判断，进而自动进行提示保存
5. 提供crud界面钩子或者插槽，部门树，菜单树，分类树等轻松实现。
6. 提供刷新整棵树功能，清理缓存、保持数据一致性等不再难
7. 数据大小不用考虑性能问题，因为是懒加载+一级缓存
8. 提供每个节点的右键菜单实现，默认右键按钮有新增子节点、删除节点、编辑节点、刷新节点四个按钮及功能
9. 提供各种已实现的插槽，不想要现有功能可以用插槽替换

### 简单用法 

#### 纯展示
```html
<MdpTree 
		:load="listDatas"
		rootId="0" 
	/>  
```
```js
 listDatas(data,node){
  return new Promis((resolve)=>{
    resolve({
      tips:{isOk:true},
      data:[]
    })
  })
 }
```
#### 支持crud,拖拽，扩展顶部共具体，扩展节点展示名称，扩展节点右键按钮等
```html
<MdpTree
		ref="nodeTree"
		title="分类"
		showCheckbox
		:props="propsCpd"
		:load="listCategory"
		:del="delCategory"
		:batchDel="batchDelCategory"
		:multiple="multiple"
		:showConfirm="showConfirm"
		:hidden="hiddenCpd" 
		@addTopNode="(cb) => onAddTopClick(cb)"
		@editNode="(d, cb, subcb) => onEditClick(d, cb, subcb)"
		@addSubNode="(p, cb) => onAddSubClick(p, cb)" 
		@changePid="(cks,cb) => onChangePidClick(cks,cb)"
		@confirm = "(d)=>{$emit('confirm',d);$emit('select',d)}"
		@check-change="(d,c,i)=>$emit('check-change',d,c,i)"
		@node-click="(d,n,c)=>$emit('node-click',d,n,c)"
		rootId="0"
		:draggable="true"
	>
		<template #topToolbar> 
      <el-button>顶部工具条</el-button>
		</template>
		<template #nodeName="{ data }"> 
      节点显示内容
		</template>
		<template #nodeToolbar="{data}">
			<el-button>节点扩展按钮</el-button>
		</template>
	</MdpTree>
``` 
 ```js
 import {
	addCategory,
	editCategory,
	delCategory,
	batchDelCategory,
	listCategory,
	batchChangeParent,
} from '@/api/mdp_pub/larc'   
 
export default {
	props: {
	'subOpType':{type:String,defalut:'mng'},
	'multiple':{type:Boolean,default:false},
	'showConfirm':{type:Boolean,default:false},
	'hidden':{type:Object,default:()=>null},
	'params':{type:Object,default:()=>null},
	'clearable':{type:Boolean,default:true}, 
			 
		},
	computed: { 
		
				hiddenCpd(){
			var isSelect=this.subOpType=='select'
						var hidden ={ 
								batchDel: true,
								del:isSelect,
								changePid: false,
								addTop: isSelect,
								addSub: isSelect,
								edit: isSelect,
								filter: false,
								page: true,
								}
								hidden=Object.assign(hidden,this.hidden)
								return hidden
				},
				propsCpd(){
					return { id: 'id', pid: 'pid', label: 'name' , isLeaf:(data,n)=>{
						return data.childNum<=0
					}}
				}
	},  
	methods: { 
		listCategory,
		delCategory,
		batchDelCategory,
		//显示编辑界面 Category xm_project_func
		onEditClick: function (formData, callback, addSubCallback) { 
		},
		//显示新增界面 Category xm_project_func
		onAddTopClick: function (callback) {  
		}, 
		onAddSubClick: function (parent, callback) {  
		}, 
		onChangePidClick: function(idLinks,callback){   
		},
		
		refresh(){ 
			this.$refs['nodeTree'].refresh() 
		}, 
		addSubmit(parent,callback){ 
		},
		editSubmit(callback){ 
		}
		 
	} 
}
```
支持大部分el-tree的属性及方法下面仅做特殊部分进行说明
### Props
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|rootId|根节点数据|String |-|0|
|showCheckbox|是否现实checkbox|boolean|true/false|false|
|draggable|是否可以拖拽|boolean|true/false|false| 
|props|el-tree原生的节点关键字段配置|Object，参考props|-|-|
|del|删除数据接口函数|Function(item),其中item为v-model中的其中之一||
|batchDel|批量删除数据接口函数|Function(items),其中items为v-model中的元素||
|showConfirm|是否显示确认按钮|Boolean|true/false|false
|multiple|是否多选|Boolean|true/false|false
|hidden|隐藏配置项,参考hidden说明|Object|-|-
|

 


### Events 事件
|事件名称|说明|回调参数|
|--------|------|--------| 
 addTopNode|点击新增顶级节点按钮后的事件推送|addTopNode(cb),cb为新增成功后回调，cb(d),d为新增成功后的数据
editNode|修改事件推送|editNode(d,cb),d为编辑的数据，cb为编辑成功后回调
addSubNode|新增子节点事件推送|addSubNode(p,cb),p为上级的数据，cb为新增成功后回调 
changePid|拖拽后点击保存按钮事件推送|changePid(cks,cb),cks为[{id:'',pid:''}]，cb为成功后回调
confirm|点击确认按钮后的事件推送|confirm(d),d为选中的节点数据，如果multiple为true,返回数组，如果为false,返回单个数据对象 
addSubNode|新增子节点事件推送|addSubNode(p,cb),p为上级的数据，cb为新增成功后回调 
checkChange|checkbox被选中时候的事件推送|checkChange(data,checked),data为选中的数据，checked为选中还是取消选中 
nodeClick|节点被点击后的事件|nodeClick(data,node,c),data为点击的数据，node为点击的节点对象，c为？ 


### slots 插槽
|插槽名称|说明|参数|
|--------|------|--------|
|topToolbar|顶部工具条按钮配置|#topToolbar
|nodeName|节点名称|#nodeName={data}
|nodeToolbar|节点工具条|#nodeToolbar={data}|

### props 表头字段配置 
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
id|编号字段|string|—|id
label|名称字段|string|—|name
pid|上级编号|String|—|pid 
isLeaf|是否叶子|Function(data)|—|null 
  
  
### hidden 隐藏配置 
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
batchDel|新增按钮|Boolean|true/false|true 
del|新增按钮|Boolean|true/false|true 
changePid|拖拽后保存按钮|Boolean|true/false|true 
addTop|新增顶级节点按钮|Boolean|true/false|true 
addSub|新增子节点按钮|Boolean|true/false|true 
edit|修改按钮|Boolean|true/false|true 
filter|过滤条件显示与否|Boolean|true/false|true 
page|是否显示分页|Boolean|true/false|true 
 