## mdp-date
该组件除了提供origin\tag\x三种样式，其它同element-ui中的el-date一致

##### 一、showStyle

1. `showStyle="origin"`

```vue
<mdp-date show-style="origin"/>
```

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110173240185.png" alt="image-20240110173240185" style="zoom:50%;" />

2. `showStyle="x"`

```vue
<mdp-date show-style="x" style="border: 1px solid">
  <template #avater><p>&#9733;</p></template>
  <template #info><p>悬浮变回原样</p></template>
</mdp-date>
```

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110175355789.png" alt="3" style="zoom:50%;" />

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110174700696.png" alt="image-20240110174700696" style="zoom:50%;" />




3. `showStyle="tag"`

```vue
<mdp-date show-style="tag" style="border: 1px solid">
  <template #info><p>悬浮变回原样</p></template>
</mdp-date>
```

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110175435534.png" alt="50" style="zoom:50%;" />

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110175446637.png" alt="image-20240110175446637" style="zoom:50%;" />

#### `pickerOptions`

格式：[{   text: '今天',   onClick(picker) { picker.$emit('pick', new Date()  ); } }]

new Date()  是 选择'今天' 时得到的数据

<img  src="../../../../docs/images/ui-components/mdp-date/image-20240110183450741.png" alt="image-20240110183450741" style="zoom:40%;" />






#### 自定义属性

| 参数      | 说明 | 类型   | 可选值 | 默认值 |
| --------- | ---- | ------ | ------ | ------ |
| showStyle |      | String | —      | origin |



#### elementUI属性

### Attributes	

| 参数              | 说明                                           | 类型                                      | 可选值                                                       | 默认值                                                       |
| ----------------- | ---------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| value / v-model   | 绑定值                                         | date(DatePicker) / array(DateRangePicker) | —                                                            | —                                                            |
| readonly          | 完全只读                                       | boolean                                   | —                                                            | false                                                        |
| disabled          | 禁用                                           | boolean                                   | —                                                            | false                                                        |
| someOpen          | 文本框可输入                                   | boolean                                   | —                                                            | true                                                         |
| clearable         | 是否显示清除按钮                               | boolean                                   | —                                                            | true                                                         |
| size              | 输入框尺寸                                     | string                                    | large, small, mini                                           | —                                                            |
| placeholder       | 非范围选择时的占位内容                         | string                                    | —                                                            | —                                                            |
| start-placeholder | 范围选择时开始日期的占位内容                   | string                                    | —                                                            | —                                                            |
| end-placeholder   | 范围选择时结束日期的占位内容                   | string                                    | —                                                            | —                                                            |
| type              | 显示类型                                       | string                                    | year/month/date/dates/months/years week/datetime/datetimerange/ daterange/monthrange | date                                                         |
| format            | 显示在输入框中的格式                           | string                                    | 见[日期格式](https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi) | YYYY-MM-DD                                                   |
| align             | 对齐方式                                       | string                                    | left, center, right                                          | left                                                         |
| popper-class      | DatePicker 下拉框的类名                        | string                                    | —                                                            | —                                                            |
| picker-options    | 当前时间日期选择器特有的选项参考下表           | object                                    | —                                                            | [{   text: '今天',   onClick(picker) {     picker.$emit('pick', new Date()); } }, '昨天', ......] |
| range-separator   | 选择范围时的分隔符                             | string                                    | —                                                            | '-'                                                          |
| default-value     | 可选，选择器打开时默认显示的时间               | Date                                      | 可被`new Date()`解析                                         | —                                                            |
| default-time      | 范围选择时选中日期所使用的当日内具体时刻       | string[]                                  | 数组，长度为 2，每项值为字符串，形如`12:00:00`，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 `00:00:00` | —                                                            |
| value-format      | 可选，绑定值的格式。不指定则绑定值为 Date 对象 | string                                    | 见[日期格式](https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi) | YYYY-MM-DD HH:mm:ss                                          |
| name              | 原生属性                                       | string                                    | —                                                            | —                                                            |
| unlink-panels     | 在范围选择器里取消两个日期面板之间的联动       | boolean                                   | —                                                            | false                                                        |
| prefix-icon       | 自定义头部图标的类名                           | string                                    | —                                                            | date                                                 |
| clear-icon        | 自定义清空图标的类名                           | string                                    | —                                                            | circle-close                                         |
| validate-event    | 输入时是否触发表单的校验                       | boolean                                   | -                                                            | true                                                         |
| append-to-body    | DetePicker 自身是否插入至 body 元素上。        | boolean                                   | —                                                            | true                                                         |
|                   |                                                |                                           |                                                              |                                                              |
|                   |                                                |                                           |                                                              |                                                              |

### Picker Options

|      参数      |                             说明                             |              类型              | 可选值 | 默认值 |
| :------------: | :----------------------------------------------------------: | :----------------------------: | :----: | :----: |
|   shortcuts    | 设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表 |            Object[]            |   —    |   —    |
|  disabledDate  |        设置禁用状态，参数为当前日期，要求返回 Boolean        |            Function            |   —    |   —    |
| cellClassName  |                     设置日期的 className                     |         Function(Date)         |   —    |   —    |
| firstDayOfWeek |                           周起始日                           |             Number             | 1 到 7 |   7    |
|     onPick     | 选中日期后会执行的回调，只有当 `daterange` 或 `datetimerange` 才生效 | Function({ maxDate, minDate }) |   —    |   —    |

### Shortcuts

| 参数    | 说明                                                         | 类型     | 可选值 | 默认值 |
| ------- | ------------------------------------------------------------ | -------- | ------ | ------ |
| text    | 标题文本                                                     | string   | —      | —      |
| onClick | 选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.$emit('pick', new Date()) | function | —      | —      |

### Events

| 事件名称 | 说明                    | 回调参数                                               |
| -------- | ----------------------- | ------------------------------------------------------ |
| change   | 用户确认选定的值时触发  | 组件绑定值。格式与绑定值一致，可受 `value-format` 控制 |
| blur     | 当 input 失去焦点时触发 | 组件实例                                               |
| focus    | 当 input 获得焦点时触发 | 组件实例                                               |

### Methods

| 方法名 | 说明              | 参数 |
| ------ | ----------------- | ---- |
| focus  | 使 input 获取焦点 | —    |

