var DEFAULT_PATTERN = 'YYYY-MM-DD'
import moment from 'moment' 

export const dateShortcuts = [{
  text: '上年始',
  value: ()=> { 
    return moment().subtract(1,'years').startOf('year')
  }
},{
  text: '上年末',
  value: ()=> { 
    return moment().subtract(1,'years').endOf('year')
  }
}, {
  text: '本季始',
  value: ()=> { 
    return moment().startOf('quarter')
  }
}, {
  text: '本季末',
  value: ()=> { 
    return moment().endOf('quarter')
  }
}, {
  text: '下季始',
  value: ()=> {
    return moment().add(1,'quarters').startOf('quarter')
  }
}, {
  text: '下季末',
  value: ()=> {
    return moment().add(1,'quarters').endOf('quarter')
  }
}, {
  text: '下年始',
  value: ()=> {
    return moment().add(1,'years').startOf('year')
  }
}, {
  text: '下年末',
  value: ()=> { 
    return moment().add(1,'years').endOf('year')
  }
}]

export const daterangeShortcuts = [

  {
    text: "上周~今周",
    value: ()=> {  
      var start=moment().subtract(1,"weeks").startOf('isoWeek')
      var end=moment().endOf('isoWeek')
      return [start, end]
    }
  }, 
  {
    text: "本周",
    value: ()=> {  
      var start=moment().startOf('isoWeek')
      var end=moment().endOf('isoWeek')
      return [start, end]
    }
  },  
  {
    text: "本月",
    value: ()=> { 
      var start=moment().startOf('month')
      var end=moment().endOf('month')
      return [start, end]
    }
  }, 
  {
    text: "本季",
    value: ()=> { 
      var start=moment().startOf('quarter')
      var end=moment().endOf('quarter')
      return [start, end]
    }
  },   
  {
    text: "本年",
    value: ()=> { 
      var start=moment().startOf('year')
      var end=moment().endOf('year')
      return [start, end]
    }
  },   
{
  text: "上月",
  value: ()=> { 
    var start=moment().subtract(1,'months').startOf('month')
    var end=moment().subtract(1,'months').endOf('month')
    return [start, end]
  }
},
{
  text: "上季",
  value: ()=> { 
    var start=moment().subtract(1,'quarters').startOf('quarter')
    var end=moment().subtract(1,'quarters').endOf('quarter')
    return [start, end]
  }
}, 
{
  text: "上年",
  value: ()=> { 
    var start=moment().subtract(1,'years').startOf('year')
    var end=moment().subtract(1,'years').endOf('year')
    return [start, end]
  }
},
{
  text: "下月",
  value: ()=> { 
    var start=moment().add(1,'months').startOf('month')
    var end=moment().add(1,'months').endOf('month')
    return [start, end]
  }
},  
{
  text: "下季",
  value: ()=> { 
    var start=moment().add(1,'quarters').startOf('quarter')
    var end=moment().add(1,'quarters').endOf('quarter')
    return [start, end]
  }
}, 
{
  text: "下年",
  value: ()=> { 
    var start=moment().add(1,'years').startOf('year')
    var end=moment().add(1,'years').endOf('year')
    return [start, end]
  }
}
]
  
