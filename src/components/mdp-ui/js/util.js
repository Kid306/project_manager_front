var DEFAULT_PATTERN = 'YYYY-MM-DD'

const colors=['#909399','#409EFF','#67C23A','#E6A23C','#F56C6C','#00ced1','#c71585','#ff8c00','#c7158577','#ffd700'];
import moment from 'moment'
import {dateShortcuts,daterangeShortcuts} from './dateShortcuts.js'
import {sn} from './sequence.js';//全局公共库

export default {
  getCodeKey:function (itemCode,params){
    var codeKey='mdp-dict-cache'+'@'+itemCode
    if(params){
      for (let [key, value] of Object.entries(params)) {
        if(key=="itemCode"){
          continue;
        }
        codeKey=codeKey+"@"+key+":"+value
       }
    }
    return codeKey;
  },
  getDefaultColors:function(){
    return colors
  },

 getIconById:function(id){
   return null
  },
 getColorById:function(id){
  var cellValue=id
  var colors=this.getDefaultColors();
  if(!cellValue){
    return colors[0]
  }
  var cellValueInt=1*cellValue
    if( isNaN( cellValueInt) ){
      if(typeof cellValue =='string' && cellValue.length>0){
        cellValueInt=0;
         for(var i=0;i<cellValue.length;i++){
             cellValueInt=cellValueInt+ cellValue.charCodeAt(i)
         }
      }else{
        cellValueInt=0;
      }
    }
    var colorIndex=cellValueInt % colors.length
    if(cellValueInt > 0 && colorIndex==0){
      colorIndex=1
    }
    return  colors[colorIndex]

},
  /**
   * 创建随机数
   * @param {*} prefix
   * @returns
   */
  createSeqNo:function(prefix){
    return  sn(prefix);
  },
  //时间2020-09-30
  getDate() {
    return moment().format(DEFAULT_PATTERN)
  },
  //获取两个日期之间的月份列表
  getMonths(startDate, endDate) {
    let months = [];
    let current = moment(startDate);
   
    while (current.isBefore(endDate)) {
      months.push(current.clone());
      current.add(1, 'months');
    }
   
    return months;
  },

  getQueryStringByName: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) {
      context = r[2]
    }
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
  },

  fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1];
    var t = "";
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  },

  isNull(obj) {
    if (obj === null || obj === '' || obj === undefined) {
      return true;
    }
    return false;
  },

  /**
   * 中横线字段转成驼峰命名
   * @param {*} name
   */
   toMCamel(name) {
    return name.replace(/\-(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
  },
  /**
   * 字段转成驼峰命名
   * @param {*} name
   */
  toCamel(name) {
    return name.replace(/\_(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
  },
  /**
   * 驼峰转下横线
   * @param {*} name
   */
  toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
  },
  /**
   * 驼峰转中横线
   * @param {*} name
   */
   toMLine(name) {
    return name.replace(/([A-Z])/g, "-$1").toLowerCase();
  },
  toFixed(val,scale){
    if(!val){
      return 0
    }else{
      return val.toFixed(scale)
    }
  },
  moment:function(){
    return moment()
  },

  initMoment:function(date){
    if(!date){
      return moment()
    }else{
      if((date instanceof Date) || date.constructor===Date){
        return moment(date.getTime())
      }else if(date.isMoment){
        return date
      }else{
        return moment(date)
      }
    }
  },
  formatDate: function(date, pattern) {
    if(!date){
      return date
    }else{
      if((date instanceof Date) || date.constructor===Date){
        return moment(date.getTime()).format(pattern)
      }else if(date.isMoment){
        return date.format(pattern)
      }else{
        return moment(date).format(pattern)
      }
    }
      
  },
  parseDate: function(dateString, pattern) {
      return moment(dateString,pattern)
  },
  setDateRange(params,startKey,endKey,valueFormat,defaultRange){ 

      if(!defaultRange||defaultRange.length<=0){ 
          defaultRange=[-15,15]
      }
      startKey=startKey||"startTime"
      endKey=endKey||"endTime"
      valueFormat=valueFormat||'YYYY-MM-DD HH:mm:ss'
      var start=moment().add(defaultRange[0],'days').startOf('day')
      var end = moment().add(defaultRange[1],'days').endOf('day')
      params[startKey]=start.format(valueFormat)
      params[endKey]=end.format(valueFormat)
      return params
   },

  //type 'year' | 'years' |'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'
  getPickerOptions: function(type) { 
    if(type && (type.indexOf('daterange')>=0||type.indexOf('datetimerange')>=0)){
      return daterangeShortcuts
    }else if(['date','datetime'].some(k=>k==type)){
      return dateShortcuts
    }else {
      return []
    }
  },

  /**
   * 拼接url路径，去除重复的/及#    如 //--> /   #/#--> # 等
   * @param {*} curlDomain 
   * @param  {...any} uri 
   * @returns 
   */
  getUri:function(...uri){ 
    if(!uri||uri.length==0){
      return ""
    } 
    var uris=uri.filter(k=>k && k!="null")    
    var paths=uris.join("/");
    var pathArr=paths.split("://")
    if(pathArr.length>1){
      paths=pathArr[1]
    }
    paths=paths.replaceAll(/\/{2,}/g,"/")
    paths=paths.replaceAll(/#\/#/g,"#")
    if(paths.startsWith("/")){
      paths=paths.substring(1)
    }
    if(paths.endsWith("/")){
      paths=paths.substring(0,paths.length-1)
    }
    if(pathArr.length>1){
      return pathArr[0]+"://"+paths
    }else{
      return paths
    }
  },


/**
 * 防止禁用弹框 _self模式
 * @param {} url
 */
  openWin:function(url) {
    var id='toOpenWindow';
    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_black');
    a.setAttribute('id', id);
    // 防止反复添加
    if(!document.getElementById(id)) document.body.appendChild(a);
    a.click();
  },

  calcMaxHeight:function(cssSelector) {
    
    var table=cssSelector;
    if(typeof cssSelector == 'string'){
      table=document.querySelector(cssSelector);
    }
    var innerHeight=window.innerHeight
    var top=150;


    if(table!=null){
      var rect=table.getBoundingClientRect()

      if(rect && rect.top){
        top=rect.top;
      }
    }
    var maxTableHeight =innerHeight-top;
    return maxTableHeight;
  },
  calcTableMaxHeight:function(cssSelector) {
    var table=cssSelector;
    if(typeof cssSelector == 'string'){
      table=document.querySelector(cssSelector);
    }
    var innerHeight=window.innerHeight
    var pageHeight=32
    var top=150;
    var bottomHeight=24


    if(table!=null){
      var rect=table.getBoundingClientRect()
      if(rect && rect.top!=0){
        top=rect.top;
      }
    }
    var maxTableHeight =innerHeight-top-pageHeight-bottomHeight;
    return maxTableHeight;
  }, 
  /**
   * 将参数放入缓存中，然后缓存中的id
   * @param {*} params 
   * @returns id
   */
  setCacheParams:function(params){
    let id=sn('auto_params_id')
    sessionStorage.setItem(id,JSON.stringify(params))
    return id
  },
  /**
   * 获取缓存中的参数
   * @param {*} id 
   * @returns 
   */
  getCacheParams:function(id){
    let paramsStr=sessionStorage.getItem(id)
    return JSON.parse(paramsStr)
  }
}
