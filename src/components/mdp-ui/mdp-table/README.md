### mdp-table 唛盟表格组件
该组件相对于el-table，进行了以下优化：
1. 内置了增、删、改、查、高级查询、重置查询、导出、列配置、分页、批量编辑、看板等功能
2. 内置了对按钮权限的控制机制,功能非常强大
3. 提供高级查询功能，支持用户定制任意复杂的查询条件；条件输入框自动根据表格列配置识别为字典、日期、数字等，操作体验不一般哦。
4. 提供看板功能，表格列表太枯燥，无法按各种维度进行直观展示，看板功能可以让用户从各个维度分析数据
5. 内置了mng/detail/select等多种打开模式，一套代码用在各种场景不再困难，复用率超高的存在：  
   a. 以前你可能需要控制界面不可编辑，得复制一份代码，唛盟里只需要 将界面打开模式改为detail模式即可  
   b. 以前你可能想把这组件作为别的组件的弹框选择数据界面，做不到，得复制一份代码，唛盟里只需要把打开模式设置为select模式即可
6. 无须替换el-table，唛盟支持在el-table上应用唛盟的各种功能，历史包袱不要怕。
7. 提供提交数据不成功后的数据自动回滚功能。
8. 提供表单编辑自动同步更新表格数据功能，不再需要重新执行后端接口啦，性能杠杆的。
9. 提供类似excel般的多行同时更新功能，更改100行，点击100行数据的问题不复存在啦。在唛盟这里更改1万行也是操作一次完成。
10. 简化了繁琐的选项式api,以最少的代码实现灵活又强大的功能

- 综合管理  
  ![综合管理表格](/docs/images/ui-components/table-mng.jpg)
- 可编辑表格    
  ![可编辑表格](/docs/images/ui-components/edit-table.jpg)
- 可编辑-树状表格    
  ![可编辑-树状表格](/docs/images/ui-components/left-right-tree-table.jpg)

### 用法

#### 基本用法，根el-table保持一致,直接定义表头，mdp框架将解析出表头内容，用于配置显示列，排序，高级查询等
```html 
<mdp-table :crud-apis="crudApis">
    <el-table-column
        prop="bizDate"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stuName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stuAddress"
        label="地址">
      </el-table-column>
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            } 
        }
      }
    }
  </script>
```


#### 通过属性columnCfgs传入表格字段列表，mdp框架将解析出表头内容，用于配置显示列，排序，高级查询等
```html  
<mdp-table :crud-apis="crudApis" :column-cfgs="columnCfgs"> 
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            },
            columnCfgs:{
                [
                    {label:'日期',property:'bizDate'},
                    {label:'姓名',property:'stuName'},
                    {label:'地址',property:'stuAddress'},
                ]
            }
        }
      }
    }
  </script>
```

#### 多选、单选模式、可编辑表格
```html 
<mdp-table :crud-apis="crudApis" :column-cfgs="columnCfgs" :multiple="true" :someOpen="true"> 
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            },
            columnCfgs:{
                [
                    {label:'日期',property:'bizDate'},
                    {label:'姓名',property:'stuName'},
                    {label:'地址',property:'stuAddress'},
                ]
            }
        }
      }
    }
  </script>
```

#### 历史原因没有用mdp-table组件，可以用el-table组件也是可以的
el-table组件照常使用,需要把MdpTableMixin.js引入组件，把el-table的ref改为ref="table"即可

```html  
<el-button @click="searchTableDatas()">执行查询</el-button>
<el-button @click="searchReset()">重置查询</el-button>
<el-table ref="table" :data="tableDatas"> 
  <el-table-column/>
</el-table>
``` 
```js 
  <script>
    
    import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
    export default { 
      mixins: [MdpTableMixin],
      data() {
        return { 
            //操作后台数据的api列表
            apis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            }
        }
      }
    },
    methods:{ 
      //页面初始化需要配置的特殊逻辑写这里
      initCurrData(){
          this.searchTableDatas();
      },

      /**
        * 检查参数是否满足调用后台接口的条件
        *
        * @param params 提交给后台的参数池,map类型
        * @returns true / false
        */
      preQueryParamCheck(params){
          return true;
      },

      //页面数据加载完后需要对数据进行加工处理的
      afterList(res,isOk,apiName){

      },

      /**
        * 对修改的字段进行判断，返回false ,将取消更新数据库
        * @param {*} row 当前选中的行
        * @param {*} fieldName 修改的字段名
        * @param {*} $event 修改后的值
        * @param {*} params 将要提交服务器的参数
        * @returns true/false 返回false ,将取消更新数据库
        */
      editSomeFieldsCheck(row,fieldName,$event,params){
          if(this.currOpType=='add'||this.currOpType=='detail'){
              return false;
          }
          params[fieldName]=$event
          return true;
      },
    }
  </script>
```

### Props
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|crud-apis|增删改查的接口函数,参考crud-apis|object|-| -
|multiple|是否多选|boolean|—|false
|show-hi-query|是否显示高级查询|boolean|—|true
|show-common-query|是否显示常规查询|boolean|—|true
|someOpen|是否可编辑|boolean|—|false
|column-cfgs|表头列配置项列表，参考column-cfgs|Array|-|-
|subOpType|当前界面操作模式|String|mng-综合管理，crud都支持/detail-所有按钮不可点击，所有输入不允许更改，只看/select-选择模式|mng
|params|内置的请求参数，无论界面如何变动，查询接口都会带上这里传入的参数，该参数如有变化，将引起界面重新初始化|Object|-|null
|pageable|是否可分页|Boolean|true
|pageSmall|是否小分页|Boolean|true
|pageLayout|分页中layout参数|slot,total, sizes, prev, next,pager,jumper|slot,total, sizes, prev, next,pager,jumper
|pageSize|分页中每页大小|Number|-|10
|parentOpType|父组件的操作模式，当需要进行联动权限检查时用到，比如当父组件时mng,子组件应该如何如何等|String|mng/detal/select等

### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|apis|增删改查的接口函数,由crudApis进行覆盖,参考crud-apis|object|-| -   
|filters|需要提交后台的动态查询条件|Object|—|{}
|defaultFilters|默认的查询条件，mounted阶段覆盖进filters,重置查询覆盖进filters
|column-configs|表头列配置项列表,由column-cfgs进行覆盖，如果没有配置column-cfigs，将自动解析el-table-column，参考column-cfgs|Array|-|-
|currOpType|界面操作模式，由subOpType进行覆盖|String|mng-综合管理，crud都支持/detail-所有按钮不可点击，所有输入不允许更改，只看/select-选择模式|mng
dataBak|当前编辑行的备份，用于提交失败的回退|Object|-|null
pageInfo|分页参数|Object,参考pageInfo说明,{pageSize:10,pageNum:1,orderFields:[],orderDirs:[],total:0,count:true}|-|-
 


### Events
|事件名称|说明|回调参数|
|--------|------|--------|
change2|选中值发生变化时触发，在需要获取值以外更多信息时使用|目前的选中的整个对象,如果multiple=false,返回一个对象，否则返回对象数组
change|选中值发生变化时触发|目前的选中值，如果multiple=false,返回一个值，否则返回值数组，如果split有则，则返回以split分割的字符串，如1,2,3,4,5
visible-change|下拉框出现/隐藏时触发|出现则为 true，隐藏则为 false
remove-tag|多选模式下移除tag时触发|移除的tag值
clear|可清空的单选模式下用户点击清空按钮时触发|—
blur|当 input 失去焦点时触发|(event: Event)
focus|当 input 获得焦点时触发|(event: Event)

### slot
|name|说明|
|--------|------|
—|Option 组件列表
info|鼠标未进入时展示的内容，showStyle=tag\x时有效
oper|鼠标进入后展示的内容，showStyle=tag\x时有效
~~prefix|Select 组件头部内容~~
empty|无选项时的列表

### column-cfgs 表头字段配置 
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
label|列名|string|—|—
property|属性名，驼峰命名，用于反解析出表字段|string|—|—
sortNo|前端显示排序，排序从0-999，越小越靠前,在表头、常规查询、高级查询的显示顺序|Number|—|—
isCommon|是否常用，用于常规查询是否显示|Boolean|true/false|false
colType|数据库字段类型| string/int/date/datatime/|string/int/date/datatime/|string
showHq|是否在高级查询中显示|boolean|true、false|true
showCol|列名|boolean|—|—
sqlOper|数据库操作符|string|gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql|eq
sqlVal|默认值|string|—|多选的话逗号分隔
beginVal|区间取值时的开始值|string|—|如果sqlOper=between,值存于beginVal及envVal中
endVal|区间取值时的结束值|string|—|如果sqlOper=between,值存于beginVal及envVal中
pk|是否为主键|boolean|true、false|false
itemCode|字典表中itemCode字段，填写了该值将从字典表加载下拉列表|string|—|—
colPrefix|属性需要添加前缀时使用，比如res.id=xxxxx,此次填写res.|string|—|—
disabledHq|是否允许编辑查询条件|boolean|—|—
kbName|看板中遇到id型字段，读取的对应名称字段，比如userid字段，对应的username字段，那么此处配置kbName='username',如果配置了itemCode则此参数无效|String|  
kbFormats|看板统计时，日期字段的格式化|Array|monent支持的任意格式化|['YYYY年','YYYY-MM月','YYYY-MM-DD','YYYY-w周','YYYY-Q季']
kbIgnore|看板中是否忽略该字段|Boolean|false/true|false

### crud-apis api列表

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
list|查询api|Promise|—|—
add|新增api|Promise|—|—
edit|修改api|Promise|—|—
del|删除api|Promise|—|—
editSomeFields|批量修改部分字段|Promise|—|—
### Methods

|方法名|说明|参数|
|--------|------|--------|
searchTableDatas|执行后端查询接口，返回数据赋值给tableDatas|-
searchReset|重置界面上的所有查询条件，包括高级查询，执行后端查询接口，返回数据赋值给tableDatas|-
initCurrData|初始化页面时执行，一般在mounted阶段执行，在参数变化后会自动调度执行一遍|无参数
afterList(res,isOk,apiName)|执行完查询接口后的回调|res-后端返回的原始数据，isOk-接口是否成功执行，apiName执行的接口名称
editSomeFieldsCheck(row,fieldName,$event,params)|修改某个字段提交前参数赋值及检查|row-当前编辑的行,fieldName-当前编辑的列名，$envent-当前编辑的最新数据，params-将要提交给后端的参数池
preQueryParamCheck(params)|提交查询前进行参数合法性检查|params-将要提交给后端的参数池

### PageInfo 分页参数

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
pageSize|每页条数|Number|-|10
pageNum|当前第几页，从1开始|Number|-|1
total|总条数|Number|-|0
count|是否需要服务端重新计算count|Boolean|-|false 
orderFields|排序列 如 ['sex','student_id']，必须为数据库字段|字符串Array|-|[] 
orderDirs|排序方向 如 ['desc','asc']|字符串Array|desc-降序,asc升序|[] 

