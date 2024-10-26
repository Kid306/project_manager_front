### 快速分栏 mdp-lr-box 效果图   
![mdp-lr-box](/docs/images/ui-components/mdp-lr-box/mdp-lr-box.png)  

![mdp-lr-box-dept-tree](/docs/images/ui-components/mdp-lr-box/mdp-lr-box-dept-tree.png)  
l代表左边，r代表右变  
原理为把屏幕分成左右两栏，通过设置lspan设置左边宽度，剩余宽度为右边宽度。如果右边想继续分栏，嵌套mdp-lr-box达到右边继续二分的效果。  
同时提供左边栏目伸缩功能  
该组件相对于el-row的好处：
1. 代码更为简洁
2. 每个分栏可动态调整大小，无须进行各个分栏分别处理
3. 可轻松实现单个或者多个栏目伸缩

### 简单用法 

#### 二栏
```html
  <mdp-lr-box :lspan="6">
    <template #left> 
      <div>左边组件</div>
    </template>
    <div>右边组件，默认进入#right插槽</div>
  <mdp-lr-box>
```

#### 三栏
```html
  <mdp-lr-box :lspan="6">
    <template #left> 
      <div>左边组件</div>
    </template> 
    <mdp-lr-box :lspan="12"> 
      <template #left> 
        <div>左边组件</div>
      </template> 
      
      <div>右边组件，默认进入#right插槽</div>
    </mdp-lr-box>
  <mdp-lr-box>
```

#### 二栏目伸缩
```html
  <mdp-lr-box :lspan="6" ref="lrbox">
    <template #left> 
      <div>左边组件</div>
    </template>
    <div>
      <el-button :icon="$refs.lrbox.myExpand?'DArrowLeft':'DArrowRight'" @click="$refs.lrbox.toggle()" plain title="展开/收起左边"/>
    </div>
  <mdp-lr-box>
``` 

#### 三栏目伸缩
#### 三栏
```html
  <mdp-lr-box :lspan="6">
    <template #left> 
      <div>左边组件</div>
    </template> 
    <mdp-lr-box :lspan="12" ref="lrbox"> 
      <template #left> 
        <div>左边组件</div>
      </template> 
      
      <div>
          <el-button :icon="$refs.lrbox.myExpand?'DArrowLeft':'DArrowRight'" @click="$refs.lrbox.toggle()" plain title="展开/收起左边"/>
      </div>
    </mdp-lr-box>
  <mdp-lr-box>
```
 

### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|lspan|左边栏目的宽度|number |0~24|6
|expand|是否展开|boolean|true  


### Events
|事件名称|说明|回调参数|
|--------|------|--------|
toggle|收缩事件|expand,true为展开，false为收缩

### Methods
|方法名称|说明|参数|
|--------|------|--------|
|doExpand(expand)|收缩或者展开| expand true为展开，false为收缩|
|toggle()|收缩切换|无|
  
