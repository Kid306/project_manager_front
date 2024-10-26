<template>
  <MdpKanban v-model="myVal" :itemKey="itemKey" :cfg="cfg"  @plus="(cb)=>$emit('plus',cb)"  @edit="(d,cb)=>$emit('edit',d,cb)">
    <template #header> 
      <slot name="header"> 
        <MdpSelect  width="250px" v-model="y" :options="options" placeholder="分组" :filterFun="(o)=>o.id!=x" title="分组"/> 
        <MdpSelect  width="250px" v-model="x" :options="options" placeholder="泳道" :filterFun="(o)=>o.id!=y" title="泳道"/> 
      </slot>
    </template>
    <template #default="{ element }">
      <slot :element="element">
        {{ contentFun(element) }}
      </slot>
      
    </template>
    <template #toolbar="{element}">
      <slot name="toolbar" :element="element">
        
      </slot>
    </template>
  </MdpKanban>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库

export default {
  name: "MdpTableKanban",
  computed: {
    xyCpd(){
      return this.x+this.y
    },
    myVal: {
      set(v) {
        this.$emit('update:modelValue', v)
      },
      get() {
        return this.modelValue
      }
    }, 
  }, 
  props: {
    modelValue: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    /**
     * 用于初始分组/表头等
     * {
     * 
     * label:'列名',
     * property:'属性名',
     * colType:'数据库字段类型 string/int/date/datatime/',
     * pk:'是否为主键，true/false',
     * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
     * kbIgnore:'在看板中忽略'
     * kbName:'看板根据id取值的字段',
     * kbFormats:[日期类型的格式化YYYY-w周,YYYY-MM月,...等monent支持的任意格式],
     * }
     */
      columnConfigs:{
        type:Array,
        default: null,
    },
    /**
     * 主键
     */
    itemKey:{
      type: String,
      default:'id'
    },
    /**
     * 显示卡片内容体
     */
    contentFun:{
      type:Function,
      default:(item)=>{
        return ""
      }
    },
    /**
     * 默认选中的属性
     * {x:'ctime',y:'userid'}
     */
    init:{
      type:Object,
      default: ()=>{
        return null
      }
    }
     
  },

  data() {
    return { 
      options:[  
      ], 
      y:'',
      x:'', 
      cfg:null,
      defaultKbFormats:['YYYY年','YYYY-Q季','YYYY-MM月','YYYY-w周','YYYY-MM-DD'],
      cfgDefault: {
        x: {
          //第一列以外的数据列
          propertyFun: (item) => {
            //给定一个item,如何计算该字段的值
            return ''
          },
          columnConfigs: [], //如果明确知道字段列表，可以直接指定，[{property:'p1',label:'l1'},{property:'p2',label:'l2'}]
          itemCode: '', //字典编码，用于将propertyFun返回的值进行翻译成中文，并且会覆盖columnsCfg的值
          labelFun: (property, item) => {
            //如果没有字典，并且没有指定columnsCfg，则需要自定义函数进行解析名字
            return property
          },
          sort: null,
          contentFun: (item, column, rowIndex, colIndex) => {
            //默认展示的内容
            return ''
          }
        },
        y: {
          //指第一列数据

          propertyFun: (item) => {
            //给定一个item,如何计算该字段的值
            return ''
          },
          columnConfig: { property: 'colFirst', label: '负责人' }, //如果明确知道字段，可以直接指定，{property:'p1',label:'l1'}
          itemCode: '', //字典编码，用于将propertyFun返回的值进行翻译成中文
          labelFun: (property, item) => {
            //如果没有字典，并且没有指定columnConfig，则需要自定义函数进行解析名字
            return property
          },
          sort: null
        }
      },
    }
  },
  watch: {
    xyCpd(){ 
      this.onChange(this.x,this.y)
    },
    columnConfigs(cfgs){
      this.initCurrData()
    }
  },
  methods: {
    match(text, pattern) {
      const regex = new RegExp(pattern, 'i');
      return regex.test(text);
    },
    getYOption(y){
      if(!y){
        return null
      }
      return this.options.find(k=>k.id==y)
    },
    
    getXOption(x){
      let option = this.options.find(k=>k.id==x) 
      return option
    },
    onChange(x,y){
      if(!x){
        this.$message.warning("请选中泳道")
        return;
      } 
      this.cfg=null
      let xOption=this.getXOption(x)
      let yOption=this.getYOption(y)
      var cfg={x:{},y:{columnConfig:{}}}
      this.setYCfg(cfg,yOption) 
      this.setXCfg(cfg,xOption) 
      this.cfg=cfg
      
    },

    setYCfg(cfg,option){
      if(!option){
        cfg.y=null
        return;
      }
      cfg.y.columnConfig.label=option.label
      cfg.y.columnConfig.property=option.property 
      if(option.itemCode){
        cfg.y.itemCode=option.itemCode 
        cfg.y.propertyFun = (item) => { 
           return item[option.property]
        } 
      }else if(this.match(option.colType,'date')||this.match(option.colType,'datetime')){
        cfg.y.propertyFun = (item) => { 
          if(!item[option.property]){
            return "空日期"
          }
          return util.formatDate(util.parseDate(item[option.property]),option.kbFormat)
        } 
        cfg.y.labelFun = (property,item) => {
            return property
        }
      }else{
        cfg.y.propertyFun = (item) => { 
           return item[option.property]
        } 
        cfg.y.labelFun = (property,item) => {
          if(option.kbName){
            return item[option.kbName]
          }else{
            return property
          } 
        }
      }  
    },
    setXCfg(cfg,option){
      cfg.x.title=option.label
      if(option.itemCode){
        cfg.x.itemCode=option.itemCode 
        cfg.x.propertyFun = (item) => { 
           return item[option.property]
        } 
        return;
      }else if(this.match(option.colType,'date')||this.match(option.colType,'datetime')){
        cfg.x.propertyFun = (item) => { 
          if(!item[option.property]){
            return "空日期"
          }
          return util.formatDate(util.parseDate(item[option.property]),option.kbFormat)
        } 
        cfg.x.labelFun = (property,item) => {
            return property
        }
      }else{
        cfg.x.propertyFun = (item) => { 
           return item[option.property]
        } 
        cfg.x.labelFun = (property,item) => {
          if(option.kbName){
            return item[option.kbName]
          }else{
            return property
          } 
        }
      } 
      
    },
    initCurrData(){
      let cfgs=this.columnConfigs
      if(!cfgs || cfgs.length==0){
        this.options=[]
      }else{
        cfgs=cfgs.filter(k=>k.property && k.kbIgnore!=true)
        let options=[]
        cfgs.forEach(cfg=>{
           
          let optionBase={property:cfg.property,label:cfg.label,name:cfg.label,itemCode:cfg.itemCode,colType:cfg.colType}
          if(cfg.kbName){
            optionBase.kbName=cfg.kbName
          }
          if(this.match(cfg.colType,'date')||this.match(cfg.colType,'datetime')){
            let kbFormats=cfg.kbFormats
            if(!kbFormats || kbFormats.length==0){ 
              kbFormats=this.defaultKbFormats
            } 
            kbFormats.forEach(f=>{
              let option={...optionBase}
              option.name=option.label+" ("+f+")"
              option.kbFormat=f
              options.push(option)
            })
          }else{ 
            let option={...optionBase}
            options.push(option) 
          }
        })
        options.forEach((k,index)=>k.id=index+k.property)
        this.options=options 
        this.setInitXY()
      }
    },
    setInitXY(){
      if(this.init){
        if(this.options.length>0){
          if(this.init.x){
            let xOption=this.options.find(k=>k.property==this.init.x)
            if(!xOption){
              xOption=this.options[0]
            }else{
              this.x=xOption.id
            } 
          }
          if(this.init.y){
            let yOption=this.options.find(k=>k.property==this.init.y)
            if(yOption){
              this.y=yOption.id
            }else{
              this.y=''
            } 
          }
        } 
      }else{
        if(this.options.length>0){
          //this.y=this.options[0].id
          let xOption=this.options.findLast(k=>this.match(k.colType,'date')||this.match(k.colType,'datetime'))
          if(!xOption){
            xOption=this.options[0]
          }
          this.x=xOption.id
        }else{
          this.x=''
          this.y=''
        }
      }
      
    }
  },
  mounted() {
    this.initCurrData() 
    this.onChange(this.x,this.y)
  },
};
</script> 