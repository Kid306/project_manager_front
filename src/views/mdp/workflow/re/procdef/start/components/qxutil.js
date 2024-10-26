    /**
     * 权限短码格式
     * f1,#,#,#,#|f2,#,#,#,#|f3,#,#,#,#
     * #号 依次代表 hidden、diabled、required、abs属性。也就是 隐藏\禁用\必填\摘要
     * 四个属性都是只能取值0,1,空字符三种，其中空值代表按默认值 
     */
    var  propsMap = {
        hidden:'hidden',
        disabled:'disabled',
        required:'required',
        abs:'abs'
    }
export default { 

    qxCodeMapDefault: { //下面1，2，3，4，5，等数字代表位置索引，默认支持5位，大于5位则抛弃，前四位语义确定，第五自由定义，
      'ctx': [1, 0, 0, 0], // 正文 1-看，2-编辑，3-摘要，4-必填，可自行扩展第五第六位等等
      'att': [1, 0, 0, 0, 0], // 附件 1-看，2-编辑，3-摘要，4-必填，可自行扩展第6第7位等等
      'ptime': [1, 0, 1, 1], // 计划完成时间
      'clist': [1], // 流转记录
      'fchart': [1], // 流程图
      'spon': [1, 0], // 主办
      'moni': [1, 0], // 监控
      'assign': [1], // 任务可手选下一步执行人
      'msgc': [1, ], // 消息推送渠道 1-站内信，2-im,3-微信公众号，4-短信，5-
      'start': [1, 0, 0], // 流程启动 1-是否允许重新调整权限，2-是否允许重新配置各节点审核人,3-是否仅发起人录单
      //下面为表单自定义字段权限
      //每个字段一行，格式参考上面的，字段编码,#,#,#,# 
    },

    /**
     * 将权限短码转换成字段列表
     * @return  {Map<String,Array>} {field1:[1,1,1,1],field2:[0,0,0,0],field3:[1,1,0,0]}
     * @param {string} qxCode  field1,1,1,1,1|field2,0|field3,1,1 等
     */
    defaultMainFields:[
        {field:'ctx',title:'正文',hidden:false,disabled:true,required:true,abs:false},
        {field:'att',title:'附件',hidden:false,disabled:true,required:true,abs:false},
        {field:'ptime',title:'计划完成时间',hidden:false,disabled:true,required:true,abs:false},
        {field:'clist',title:'流转记录',hidden:false,disabled:true,required:true,abs:false},
        {field:'fchart',title:'流程图',hidden:false,disabled:true,required:true,abs:false},
        {field:'spon',title:'主办人',hidden:false,disabled:true,required:true,abs:false},
        {field:'moni',title:'监控人',hidden:false,disabled:true,required:true,abs:false},
        {field:'assign',title:'手选下一步执行人',hidden:false,disabled:true,required:true,abs:false},
        {field:'msgc',title:'消息推送渠道',inner:false,im:true,wxpub:true,sms:false},
        {field:'start',title:'发起人相关配置',editQx:false,nodeInfo:true,disFillForm:true}, 
    ],  
    initMainFields: function (formQxCode) {
        
        var fields=JSON.parse(JSON.stringify(this.defaultMainFields)) 
        if (!formQxCode) {
            fields.forEach(field => {
                this.initField(field,[])
            })
          } else {
             var formQxMap = this.parseQxCode(formQxCode)
            fields.forEach(field => {
                var fieldQx = []
              if (formQxMap.has(field.field)) {
                fieldQx = formQxMap.get(field.field) 
              } 
              
              if(field.field=='msgc'){
                this.initField(field,fieldQx,{hidden:'inner',disabled:'im',required:'wxpub',abs:'sms'})
              }else if(field.field=='start'){
                this.initField(field,fieldQx,{hidden:'editQx',disabled:'nodeInfo',required:'disFillForm'})
              }else{
                this.initField(field,fieldQx)
              }
            }) 
          }
          return fields
    },
    /**
     * 解析通用权限码
     * @return  {Map<String,Array>} {field1:[1,1,1,1],field2:[0,0,0,0],field3:[1,1,0,0]}
     * @param {string} qxCode  field1,1,1,1,1|field2,0|field3,1,1 等
     */
    parseQxCode: function (qxCode, defaultQxMap) {
      if (qxCode == null || qxCode == '' || qxCode == undefined) {
        return defaultQxMap
      } else {
        var qxCodeArr = qxCode.split("|")
        var map = new Map()
        qxCodeArr.forEach(field => {
          var farr = field.split(",")
          map.set(farr[0], farr.splice(1))
        })
        return map;
      }
    },
     
    /**
     * 根据权限码设置每个字段的hidden,disabled,required,abs的值
     * @param {*} formQxCode 
     * @param {*} fields 
     * @returns fields
     */
    initFieldsQx: (formQxCode, fields) => {
      if (!formQxCode) {
        fields.forEach(field => {
            this.initField(field,[])
        })
      } else {
         var formQxMap = this.parseQxCode(formQxCode)
        fields.forEach(field => {
            var fieldQx = []
          if (formQxMap.has(field.field)) {
            fieldQx = formQxMap.get(field.field) 
          }
          this.initField(field,fieldQx)
        })
      }
      return fields
    },

    /**
     * 根据字段的权限码，初始化字段的hidden,disabled,required,abs值
     * @param {*} field 
     * @param {*} fieldQx 
     */
    initField: (field,fieldQx,props) => {
        var m=propsMap
        if(props){
            m=props
        } 
        if (fieldQx.length > 4) {
            field[m.hidden] = fieldQx[1] == '1' ? true : field[m.hidden]
            field[m.disabled] = fieldQx[2] == '1' ? true : field[m.disabled]
            field[m.required] = fieldQx[3] == '1' ? true : field[m.required]
            field[m.abs] = fieldQx[4] == '1'
          } else if (fieldQx.length > 3) {
            field[m.hidden] = fieldQx[1] == '1' ? true : field[m.hidden]
            field[m.disabled] = fieldQx[2] == '1' ? true : field[m.disabled]
            field[m.required] = fieldQx[3] == '1' ? true : field[m.required]
            field[m.abs] = false
          } else if (fieldQx.length > 2) {
            field[m.hidden] = fieldQx[1] == '1' ? true : field[m.hidden]
            field[m.disabled] = fieldQx[2] == '1' ? true : field[m.disabled]
            field[m.required] = field[m.required]
            field[m.abs] = false
          } else if (fieldQx.length > 1) {
            field[m.hidden] = fieldQx[1] == '1' ? true : field[m.hidden]
            field[m.disabled] = field[m.disabled]
            field[m.required] = field[m.required]
            field[m.abs] = false
          }  
    },
    /**
     * 将一个字段的hidden,disabled,required,abs编码成字符串短码权限码，便于保存
     * @param {*} field 
     * @returns 
     */
    fieldToQxCode: (field) => {
      var hidden = field.hidden ? "1" : "0"
      var disabled = field.disabled ? "1" : "0"
      var required = field.required ? "1" : "0"
      var abs = field.abs ? "1" : "0"
      return `${field.field},${hidden},${disabled},${required},${abs}`
    },
    /**
     * 将所有字段的hidden,disabled,required,abs编码成字符串短码权限码，便于保存
     * @param {*} fields 
     */
    fieldsToQxCode: (fields) => {
        fields.map(k=>this.fieldToQxCode(field)).join("|")
    },  


}
