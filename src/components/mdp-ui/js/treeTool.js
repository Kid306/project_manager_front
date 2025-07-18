
export default {


  reloadAllChildren: function(table,maps, rows,parentIdName,loadChildren,idMaps) {
    

     if(!rows||rows.length==0){
      return;
     }
     if(!maps || maps.length==0){
      return;
     }

     if(!table){
      return;
     }
     var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
     var parentIds=rows.map(i=>i[parentIdName])
     if(idMaps==null){
      idMaps=new Map();
     }
     if(parentIds.length==0){
      return;
     }
     parentIds.forEach(k=>{
       if(!idMaps.has(k)){
        idMaps.set(k,k);
        if (maps.get(k)) {
          const { tree, treeNode, resolve } = maps.get(k)
          lazyTreeNodeMap[k]=[]
          if (tree) { // 重新执行父节点加载子级操作
            loadChildren(tree, treeNode, resolve)
            if(tree[parentIdName]){
              this.reloadAllChildren(table,maps, [tree],parentIdName,loadChildren,idMaps)
            }
          }
        }
       }
     });
  },


  reloadChildren: function(table,maps, parentId,parentIdName,loadChildren) {
      var params={};
      params[parentIdName]=parentId;
      this.reloadAllChildren(table,maps, [params],parentIdName,loadChildren)
  },
  reloadChildrenByOpType: function(table,maps, parentId,parentIdName,loadChildren,opType) {
    var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
    if (maps.get(parentId)) {
      const { tree, treeNode, resolve } = maps.get(parentId)
      if (tree) { // 重新执行父节点加载子级操作
        var oldDatas=lazyTreeNodeMap[parentId]
        loadChildren(tree, treeNode, resolve,oldDatas,opType)
      }
    }

  },
  clearOpType: function(table,maps,parentId,parentIdName,loadChildren) {
    var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
    if (maps.get(parentId)) {
      const { tree, treeNode, resolve } = maps.get(parentId)
      if (tree) { // 重新执行父节点加载子级操作
        var oldDatas=lazyTreeNodeMap[parentId]
        loadChildren(tree, treeNode, resolve,oldDatas,"clearOpType")
      }
    }

  },
  /**
   * 遍历一棵树，对其节点进行数据转换
   * @param {*} tree any[{children?:[]}]
   * @param {*} callback callback(currNode,parent)
   * returns void
   */
  treeCfg(tree,callback){
    if(!tree){
      return;
    }
    let treeCfg_ = (currNode,parent,callback) => {
      if(!currNode){
        return;
      }
      callback(currNode,parent)
      if(currNode.children){
        currNode.children.forEach(c=>{
          treeCfg_(c,currNode,callback)
        })
      }
    }
    tree.forEach(k=>{
      callback(k,null)
      if(k.children){
        k.children.forEach(c=>{
          treeCfg_(c,k,callback)
        })
      }
    })
  },
  

  /**
   * 将类表数据转换为如下树状结构的数据
   * {
   *  xxx:'',
   *  xxx2:'',
   *  children:[
   *    xxx:'',
   *    xxx2:'',
   *  ]
   * }
   * @param {*} data2 将要转换的数据
   * @param {*} pidName 上级字段名称，如 pmenId
   * @param {*} idName 本条数据主键字段名称 如 menuId
   * @param {*} rowCallBack(data),如果需要对部分字段进行转换，可以传入这个回调函数。比如需要将 name:'陈天财' => label:'陈天财'
   * @returns
   */
  translateDataToTree: function(data2,pidName,idName,rowCallBack) {
    
    if(!pidName){
      pidName='pid'
    }
    if(!idName){
      idName='id'
    } 
    var data=JSON.parse(JSON.stringify(data2));
    let parents = data.filter(value =>{ 
      //如果我的上级为空，则我是最上级
      if(value[pidName] == 'undefined' || value[pidName] == null  || value[pidName] == ''|| value[pidName] == '0'){
        return true;

        //如果我的上级不在列表中，我作为最上级
      }else if(data.some(i=>value[pidName]==i[idName])){
        return false;
      }else {
        return true
      }

    })
    let children = data.filter(value =>{
      if(data.some(i=>value[pidName]==i[idName])){
        return true;
      }else{
        return false;
      }
    }) 
    let translator = (parents, children) => {
      parents.forEach((parent) => {
        if(rowCallBack){
          rowCallBack(parent)
        }
        children.forEach((current, index) => {
          
          if (current[pidName] === parent[idName]) {
            let temp = JSON.parse(JSON.stringify(children))
            temp.splice(index, 1)
            translator([current], temp)
            typeof parent.children !== 'undefined'  && parent.children ? parent.children.push(current) : parent.children = [current]
            parent.childrenCnt=parent.children.length
          }
        }
        )
      }
      )
    }

    translator(parents, children)
    
    return parents
  },

}
