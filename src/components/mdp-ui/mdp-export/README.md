### 导出数据 
支持导出word/excel/pdf等
### 简单用法 

```html
<mdp-export @excel="export2Excel" @word="export2Word" @pdf="export2Pdf"/>
```

#### 整体隐藏
```html 

<mdp-export hidden/>
```

#### 隐藏excel/word/pdf等按钮
```html
<mdp-export :excel="false :word="false" :pdf="false"/>
```

#### 添加自定义按钮
```html
<mdp-export>
  <el-button>导出txt</el-button>
</mdp-export>
``` 
 

### Attributes
|参数|说明|类型|可选值|默认值|  
|--------|------|--------|-----------------|----------------|  
|hidden|收费整体隐藏|Boolean |true/false|false  
|excel|是否可以下载为excel|boolean|true  
|word|是否可以下载为word|boolean|false  
|pdf|是否可以下载为pdf|boolean|false  


### Events
|事件名称|说明|回调参数|  
|--------|------|--------|  
excel|下载excel按钮的点击事件|  
word|下载word按钮的点击事件|  
pdf|下载pdf按钮的点击事件|  

### Slot
|方法名称|说明|参数|
|--------|------|--------| 
default|添加自定义按钮
  
