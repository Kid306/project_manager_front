<template>
  <ContentWrap>
    <template #header>
      <el-space wrap>
        <slot name="header">
          <!-- <el-button>负责人-需求-状态板</el-button>
          <el-button>负责人-需求-周板</el-button>
          <el-button>负责人-需求-月板</el-button>
          <el-button>提出人-需求-状态板</el-button>
          <el-button>提出人-需求-周板</el-button>
          <el-button>提出人-需求-月板</el-button> -->
        </slot> 
      </el-space>
    </template> 
    <el-table ref="table" :data="dataSet" v-adaptive="{ bottom: 50 }" style="width: 100%" border>
      <template v-for="(column, colIndex) in yColumnConfigs" :key="colIndex">
      <el-table-column :label="column.label + '(' + countYColLabel(column, colIndex) + ')'" width="200" v-if="!column.hidden">
        <template #header>
          <div style="height:40px;">
            <div class="titleY">{{ column.label }}({{ countYColLabel(column, colIndex) }})</div>
            <div class="titleX">{{ cfg?.x?.title }}</div> 
          </div>
        </template> 
        <template #default="scope"> 
            <div>
              {{ scope.row[column.property+'_name'] || scope.row[column.property+""] }}
            </div>  
          </template>
        </el-table-column>
      </template>
      <template v-for="(column, colIndex) in xColumnConfigs" :key="colIndex">
        <el-table-column :label="column.label + '(' + countXColLabel(column, colIndex) + ')'" min-width="250">
          <template #default="scope"> 
            <MdpDraggable :itemKey="itemKey" group="group1" v-model="scope.row[column.property+'']" :key="$mdp.createSeqNo('drag')"
              @del="(d, cb) => $emit('del', d, cb)" @edit="(d, cb) => $emit('edit', d, cb)"  @plus="(cb) => $emit('plus', cb)">
              <template #toolbar="{element,index}">
                <slot name="toolbar" :element="element" :index="index"></slot>
              </template>  
              <template #default="{ element, index }"> 
                <div  :key="colIndex + '-' + index">
                  <slot :element="element" :index="index" :colIndex="colIndex">  
                      <div>{{ this.cfg.x.contentFun(element, column, index, colIndex) }}</div> 
                  </slot>
                </div>
              </template>
            </MdpDraggable> 
          </template>
        </el-table-column>
      </template>
    </el-table>
  </ContentWrap>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库
import MdpDraggable from '@/components/Draggable/index.vue'

export default {
  name: 'MdpKanban',
  props: {
    itemKey: {
      type: String,
      default: 'id'
    },
    cfg: {
      type: Object,
      default: () => {
        return null
      }
    },
    modelValue: {
      type: Array,
      default: ()=>{
        return []
      }
    }
  },
  data() {
    return {
      cfgInit: {
        x: {
          title:'x轴标题',
          //第一列以外的数据列
          propertyFun: (item) => {
            //给定一个item,如何计算该字段的值
            return ''
          },
          columnConfigs: [], //如果明确知道字段列表，可以直接指定，[{property:'p1',label:'l1'},{property:'p2',label:'l2'}]
          itemCode: '', //字典编码，用于将propertyFun返回的值进行翻译成中文，并且会覆盖columnConfigs的值
          labelFun: (property, item) => {
            //如果没有字典，并且没有指定columnConfigs，则需要自定义函数进行解析名字
            return property
          },
          sort:null,
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
          columnConfig: { property: 'colFirst', label: 'labelFirst' }, //如果明确知道字段，可以直接指定，{property:'p1',label:'l1'}
          itemCode: '', //字典编码，用于将propertyFun返回的值进行翻译成中文
          labelFun: (property, item) => {
            //如果没有字典，并且没有指定columnConfig，则需要自定义函数进行解析名字
            return property
          },
          sort: null
        }
      },
      yColumnConfigs: [
        /*{property:'p1',label:'l1'},{property:'p2',label:'l2'} */
      ], //表头定义
      xColumnConfigs: [
        /*{property:'p1',label:'l1'},{property:'p2',label:'l2'} */
      ], //表头定义
      dataSet: [
        {
          /* p1:'',p2:[],p3:[],p4:[] */
        } //每一行数据对应表头字段，每个字段下面放该字段的值，第一列必须位字符串
      ],
      dicts: {}
    }
  },
  components: { MdpDraggable },
  watch: {
    modelValue() {
      this.initData()
    },
    cfg(){
      
      this.initData()
    }
  }, 
  methods: {
    countXColLabel(column,colIndex){ 
      let count=0
      this.dataSet.forEach(k=>{
        let l=k[column.property]
        if(l){
          count=count+l.length
        }
       
      })
      return count
    },
    
    countYColLabel(column,colIndex){ 
       return this.dataSet.length
    },
    modelValue2dataSet(modelValue) { 

      let dataSet = []
      let xColumnConfigs = []
      let yColumnConfigs = []
      let xNameMap = new Map()
      let isXLabelFun=false
      let groupYMap = new Map()
      let groupYNameMap = new Map()
      let keysY=[]
      let yProperty='colFirst'
      
      if(this.cfg.y){
        let isYLabelFun = !this.cfg.y.itemCode && this.cfg.y.labelFun
        let hasItemCode=this.cfg.y.itemCode
        if(hasItemCode){
          this.dicts[this.cfg.y.itemCode].forEach(o=>groupYNameMap.set(o.id,o.name))
        }
        
        modelValue.forEach((k) => {
          let property=""
          if(hasItemCode){
            property = k[this.cfg.y.columnConfig.property]
          }else{
            property = this.cfg.y.propertyFun(k)
          }
          
          let list = groupYMap.get(property)
          if (!list) {
            list = []
          }
          list.push({...k})
          groupYMap.set(property, list)
          if (isYLabelFun) {
            let label = this.cfg.y.labelFun(property, k)
            groupYNameMap.set(property, label)
          } 
        })
        keysY = [...groupYMap.keys()]
        
        yProperty = this.cfg.y.columnConfig.property 
      }else{
        keysY=[yProperty]
        groupYMap.set(yProperty,modelValue)
        groupYNameMap.set(yProperty,yProperty)
      }
        isXLabelFun =
          !this.cfg.x.itemCode && (!this.cfg.x.columnConfigs || this.cfg.x.columnConfigs.length == 0) && this.cfg.x.labelFun
        keysY.forEach((k) => {
          let list = groupYMap.get(k)
          let row = {}
          row[yProperty] = k
          row[yProperty+"_name"] = groupYNameMap.get(k)
          list.forEach((item) => {
            let  p = this.cfg.x.propertyFun(item)
            let ls = row[p]
            if (!ls) {
              ls = []
            }
            ls.push(item)
            row[p] = ls

            if (isXLabelFun) {
              xNameMap.set(p, this.cfg.x.labelFun(p, item))
            } 
          })
          dataSet.push(row)
        })
        if(!this.cfg.y?.sort){
          dataSet.sort()
        }else{
          dataSet.sort(this.cfg.y.sort)
        }
      


      //下面计算columnConfigs
      
      // 1.第一列，也就是y轴的处理
      if(this.cfg.y && this.cfg.y.columnConfig?.property){
        yColumnConfigs.push(this.cfg.y.columnConfig) //y轴可以直接指定
      }else{
        yColumnConfigs.push({property:yProperty,label:yProperty,hidden:true}) //隐藏y轴
      }
      

      // 2. 第二列之后的，也就是x轴上的定义
      if (isXLabelFun) {
        let xKeys = [...xNameMap.keys()]
        if(!this.cfg.x.sort){
          xKeys.sort()
        }else{
          xKeys.sort(this.cfg.x.sort)
        }  
        xKeys.forEach((x) => {
          xColumnConfigs.push({ property: x, label: xNameMap.get(x) })
        })
      } else if (this.cfg.x.itemCode) {
        let options = this.dicts[this.cfg.x.itemCode]
        if(!this.cfg.x.sort){
          options.sort()
        }else{
          options.sort(this.cfg.x.sort)
        } 
        options.forEach((o) => {
          xColumnConfigs.push({ property: o.id, label: o.name })
        })
      } else if (this.cfg.x.columnConfigs) {
        xColumnConfigs.push(...this.cfg.x.columnConfigs)
      }
      // 做一次空值赋值处理，不然拖不上去
      dataSet.forEach((k,index)=>{
        xColumnConfigs.forEach((c,ci)=>{
          if(ci>0){
            let l=k[c.property]
            if(!l){
              k[c.property]=[]
            }
          }
        })
      })

      return { dataSet, xColumnConfigs, yColumnConfigs }
    },
    async initData() {
      if(!this.cfg){
        return;
      }
      if(!this.cfg.x){
        return;
      }
      let xItemCode = this.cfg.x.itemCode
      if (xItemCode) {
        let xo = await this.$mdp.getDictOptions(xItemCode)
        this.dicts[xItemCode] = xo
      }
      if(this.cfg.y){
        let yItemCode = this.cfg.y.itemCode
        if (yItemCode) {
          let yo = await this.$mdp.getDictOptions(yItemCode)
          this.dicts[yItemCode] = yo
        }
      }
      if(!this.modelValue||this.modelValue.length==0){
        this.dataSet=[]
        this.xColumnConfigs=[]
        this.yColumnConfigs=[]
        return;
      } 
      let { dataSet, xColumnConfigs,yColumnConfigs } = this.modelValue2dataSet(this.modelValue)
      this.dataSet = dataSet
      this.xColumnConfigs = xColumnConfigs 
      this.yColumnConfigs = yColumnConfigs
        this.$refs.table?.doLayout() 
    },
  },
  mounted() {
    this.initData()
  }
}
</script>

<style lang="less" scoped>
.titleY:before {
    content: '';
    position: absolute;
    width: 1px;
    /*这里需要自己调整，根据td的宽度和高度*/
    height: 400px;
    top: 0;
    left: 0;
    background-color: grey;
    opacity: 0.3;
    display: block;
    transform: rotate(-75deg);
    transform-origin: top;
    /*这里需要自己调整，根据线的位置*/
}
.titleY { 
  padding-top:20px;
  float: left; 
}
.titleX {   
  padding-bottom:20px;
    float: right; 
}
  
</style>
