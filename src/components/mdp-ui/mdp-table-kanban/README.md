### 看板 mdp-table-kanban 效果图   
![mdp-table-kanban](/docs/images/ui-components/mdp-table-kanban/mdp-table-kanban.png)  
看板功能属于mdp-table组件的扩展功能，当然也可以独立作为组件使用，不一定需要配合mdp-table  
该组件好处：
1. 只需要提供列信息列表即可自动实现传统硬编码实现的大部分看板功能。
2. 根据用户选择分组条件进行，分组合计
3. 对于日期类型自动按年、季、月、周、日等进行分类合计
4. 如果页面中有mdp-table组件，自动关联mdp-table中的列配置，无须二次编码上送列信息

### 简单用法 

#### 纯展示
```html
  <MdpTableKanban subOpType="detial"
      v-model="tableDatas" 
      :columnConfigs="columnConfigs"
      itemKey="id" 
      :contentFun="(item)=>item.xxx1"
      >  
  </MdpTableKanban>
```

#### 支持crud
```html
    <MdpTableKanban  @del="(d,cb)=>handleDel(d,0,cb)" subOpType='mng'
      @plus="(cb)=>openForm({subOpType:'add',callback:cb})"
      @edit="(d,cb)=>openForm({subOpType:'edit',formData:d,callback:cb})"
      v-model="tableDatas" 
      :columnConfigs="columnConfigs"
      itemKey="id" 
      :contentFun="(item)=>item.xxxName"
    >  
    </MdpTableKanban>
``` 
 

### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|columnConfigs|数据的字段列表，参考columnConfig对象说明|Array |[]|[]|
|v-model|数据列表|Array|[]|[]|
|itemKey|主键，驼峰命名|String|columnConfigs中任意一列|id|
|contentFun|看板显示的内容由该函数输出，当然也可以通过默认插槽覆盖该函数行为|Function(item),其中item为v-model中的其中之一||
|init|设置默认选中的列|{x:'col1',y:'col2'}|x,y均指向columnCofig.property属性|null,自动分配



### Events 事件
|事件名称|说明|回调参数|
|--------|------|--------|
del|点击删除按钮后推送|del(d,cb),d为删除的数据，cb为成功删除后的回调，cb()
plus|点击新增按钮后的事件推送|plus(cb),cb为新增成功后回调，cb(d),d为新增成功后的数据
edit|双击看板后推送编辑事件|edit(d,cb),d为编辑的数据，cb为编辑成功后回调

### slots 插槽
|插槽名称|说明|参数|
|--------|------|--------|
|header|顶部工具条按钮配置| 
|toolbar|工具栏配置|element,为v-model中的一个元素|
|default|看板上的主要内容区域|element,为v-model中的一个元素|

### columnConfig 表头字段配置 
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
label|列名|string|—|—
property|属性名，驼峰命名，用于反解析出表字段|string|—|—
sortNo|前端显示排序，排序从0-999，越小越靠前,在表头、常规查询、高级查询的显示顺序|Number|—|—
colType|数据库字段类型| string/int/date/datatime/|string/int/date/datatime/|string
itemCode|字典表中itemCode字段，填写了该值将从字典表加载下拉列表|string|—|—  
kbName|看板中遇到id型字段，读取的对应名称字段，比如userid字段，对应的username字段，那么此处配置kbName='username',如果配置了itemCode则此参数无效|String|  
kbFormats|看板统计时，日期字段的格式化|Array|monent支持的任意格式化|['YYYY年','YYYY-MM月','YYYY-MM-DD','YYYY-w周','YYYY-Q季']
kbIgnore|看板中是否忽略该字段|Boolean|false/true|false
  
