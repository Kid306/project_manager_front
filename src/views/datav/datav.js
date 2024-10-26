import * as DataV from '@dataview/datav-vue3';


const compLists = {
  install: function(app) {
    const module = Object.keys(DataV);
    for (const m of module) {
      if (m === 'Loading') continue; // 因为项目饿了么注册过这个组件，就不用datav提供的，跳过本次循环
      app.component(DataV[m].name, DataV[m]);
    }

  }
}

export default compLists