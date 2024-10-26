<template>
    <section> 
        <span v-if="!myVal||myVal.length==0" @click="$refs['imageDialog'].open()">
            <el-image  :lazy="lazy" :key="idx" :style="styleObj" :fit="fit" :z-index="zIndex" :initial-index="initialIndex" @load="onLoad" @error="onError" @click="$refs['imageDialog'].open()">
                    <template #planceholder>
                        <slot name="placeholder" >
                            {{ placeholder }}
                        </slot> 
                    </template> 
                    <template #error>
                        <slot name="error" > 
                        </slot> 
                    </template>   
            </el-image>
        </span>
        <span v-else-if="!this.multiple" @click="$refs['imageDialog'].open()">
            <el-image :src="myVal" :previewSrcList="previewSrcList" :lazy="lazy" :key="idx" :style="styleObj" :fit="fit" :z-index="zIndex" :initial-index="initialIndex" @load="onLoad" @error="onError" @click="$refs['imageDialog'].open()">
                <template #planceholder>
                        <slot name="placeholder" >
                            {{ placeholder }}
                        </slot> 
                    </template> 
                    <template #error>
                        <slot name="error" > 
                        </slot> 
                    </template>  
            </el-image>
        </span>
        
        <span v-else @click="$refs['imageDialog'].open()">
            <el-image v-for="img,idx in myVal" :previewSrcList="previewSrcList" :lazy="lazy" :key="idx" :src="img" :style="styleObj" :fit="fit" :z-index="zIndex" :initial-index="initialIndex" @load="onLoad" @error="onError">
                <template #planceholder>
                        <slot name="placeholder" >
                            {{ placeholder }}
                        </slot> 
                    </template> 
                    <template #error>
                        <slot name="error" > 
                        </slot> 
                    </template>  
            </el-image>
        </span>
        <mdp-dialog ref="imageDialog">
            <mdp-select-image @select="onChange"/>
        </mdp-dialog> 
    </section>
 </template>

<script>
 /**
  * 图片展示并可选择组件
  */
 
export default {
    name:'MdpImage',  
     components: { 
    },
    computed: {
        myVal:{
            set(val){
                this.$emit('update:modelValue',val)
            },
            get(){
                var val=this.modelValue
                if(!val){ 
                    return val
                }else{
                    if(this.multiple){
                        if(this.split){
                            return val.split(this.split)
                        } 
                    } 
                } 
                return val
            }
        }
    },
    props:{
        /**
         * 存储自定义表单数据的字段
         */
         styleObj:{
            type:Object,
            default: function(){
                return {
                   width: '100px', height: '100px'
                }
            }
        },
        fit:{
            type:String,
            default:'none',
        }, 
        lazy:{
            type:Boolean,
            default:false
        },
        previewSrcList:{
            type:Array,
            default:null,
        },
        zIndex:{
            type:Number,
            default:2000
        },
        initialIndex:{
            type:Number,
            default:null
        },
        modelValue:{
            type:[String,Array],
            default:null,
        },
        multiple:{
            type: Boolean,
            default:false
        },
        split:{
            type:String,
            default:null,
        },
        placeholder:{
            type:String,
            default:'图片上传'
        }
    },
    watch: {
        modelValue(val){
            this.initCurrData() 
        }
    },
    data() {
        return { 
            load:{list:false}, 
        }
    },
    methods: { 
        onLoad(e){
            this.$emit('load',e)
        },
        onError(e){
            this.$emit('error',e)
        }, 
        
        onChange(imgs){   
              
            this.$refs['imageDialog'].close();
            if(!imgs){
                this.myVal=null
            }
            if(this.multiple==true ){
                var val=imgs.map(k=>k.url);
                if(this.split){  
                    var valJoin=val.join(this.split)
                    if(valJoin!=this.modelValue){
                        this.myVal=valJoin
                        this.$emit('change',valJoin)
                        this.$emit("change2",imgs)
                    }  
                }else{
                    this.myVal=val
                    this.$emit('change',val) 
                    this.$emit("change2",imgs)
                }
                
            }else{
                var val=imgs[0].url;
                this.myVal=val
                this.$emit('change',val)
                this.$emit("change2",imgs[0])
            }    
         }, 
         initCurrData(){
            
           
         }
    },
    mounted() {
        this.initCurrData();
    }
}

</script>

<style scoped>

</style>