<template>
  <span>
    <!--显示/隐藏列-->
    <el-button
      :type="type"
      @click="showHiQuery"
      :size="size"
      :style="styleObj" 
      :circle="circle"
      :round="round"
      :plain="plain"
      :title="btnName"
    >
        <el-badge  :value="conditionCount" />
    </el-button>

    <mdp-dialog append-to-body v-model="hiQueryVisible" :width="width">
      <div class="padding">
        
        <el-alert 
                title="支持输入框中填入以下#{user.userid},#{user.username},#{接口参数},#{env.date}等表达式，后台会自动进行赋值"
                type="warning"
              />
      </div>
      <el-tree 
        :data="treeDataCpd"
        node-key="cid"
        default-expand-all
        :expand-on-click-node="false"
        apend-to-body
      >
        <template #default="{ node, data }">
          <!--列名-->
          <el-form>
            <el-form-item v-if="data.sqlLink == 'AND' || data.sqlLink == 'OR'" label-width="0px"> 
              <el-row class="padding-top">
                <el-col :span="10" > 
                  <mdp-select  width="100%"
                  showStyle="tag"
                  key="0"  :clearable="false"
                  v-model="data.sqlLink"
                  item-code="sql_link_and_sql_oper"
                  :filter-fun="(o, i) => filterFun(o, i, 'SQL_LINK')"
                  @change2="onSqlLinkChange($event, data)"
                />   
                </el-col>
                <el-col :span="14"> 
                  <el-popover trigger="click">
                    <template #reference>
                      <el-button type="primary" style="margin-left:310px;" icon="plus" plain/>

                    </template>
                    <template #default> 
                      <el-space wrap>
                          <el-button type="primary"  @click="() => appendSqlLink(node, data)"  icon="plus" plain>
                        &nbsp;&nbsp;新增连接符
                      </el-button>
                      <el-button type="success"  @click="() => append(node, data)" icon="plus" plain>
                        新增条件
                      </el-button>
                    </el-space>
                    </template>
                  </el-popover>

                  <el-button
                    v-if="node.parent.parent"
                    type="danger" 
                    @click="() => remove(node, data)" icon="delete" plain/>  
                </el-col>
              </el-row> 
          </el-form-item>
          <el-form-item v-else>
          <el-row class="padding-top" :gutter="10">
            <!--列名---->
            <mdp-select
              key="1"
              style="width: 10em"
              v-model="data.property"
              :options="columnOptionsCpd"
              @change2="(c) => onColumnChange(c, data)"
            />
            &nbsp;
            <!--操作符-->
            <mdp-select
              key="3"
              style="width: 8em"
              v-model="data.sqlOper"
              item-code="sql_link_and_sql_oper"
              :filter-fun="(o, i) => filterFun(o, i, 'SQL_OPER')"
            />
            &nbsp;&nbsp;&nbsp;
            <span v-if="data.sqlOper != '$IS NULL' && data.sqlOper != '$IS NOT NULL'">
              <!--如果是数据字典-->
              <span v-if="data.itemCode != null && data.itemCode != ''">
                <mdp-select
                  v-model="data.sqlVal"
                  :item-code="data.itemCode"
                  width="14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else-if="data.dictOptions">
                <mdp-select
                  v-model="data.sqlVal"
                  :options="data.dictOptions"
                  width="14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else-if="data.slot">
                <slot :name="data.slot" :data="data" @input="data.sqlVal"></slot>
              </span>
              <span v-else-if="data.colType == 'Date'||data.colType=='date'">
                <el-date-picker
                  style="width: 14rem"
                  v-model="data.sqlVal"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择日期"
                />
              </span>
              <span v-else-if="data.colType == 'String'">
                <el-input v-model="data.sqlVal" style="width: 14rem" />
              </span>
              <span v-else-if="['dateTime','datetime', 'time', 'Time', 'DateTime','Datetime'].some((k) => k == data.colType)">
                <el-date-picker
                  style="width: 14rem"
                  v-model="data.sqlVal"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择日期时间"
                />
              </span>
              <span v-else-if="['int', 'Integer', 'long', 'Long'].some((k) => k == data.colType)">
                <el-input-number
                  :precision="0"
                  v-model="data.sqlVal"
                  style="width: 14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span
                v-else-if="
                  ['float', 'Float', 'double', 'Double', 'BigDecimal','bigDecimal'].some(
                    (k) => k == data.colType
                  )
                "
              >
                <el-input-number
                  :precision="2"
                  v-model="data.sqlVal"
                  style="width: 14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else>
                <el-input v-model="data.sqlVal" style="width: 14rem" placeholder="空值将自动忽略" />
              </span>
            </span>
            <span v-if="data.sqlOper == '$BETWEEN'">
              ~
              <!--如果是数据字典-->
              <span v-if="data.itemCode">
                <mdp-select
                  v-model="data.endVal"
                  :item-code="data.itemCode"
                  width="14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else-if="data.dictOptions">
                <mdp-select
                  v-model="data.endVal"
                  :options="data.dictOptions"
                  width="14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else-if="data.slot2">
                <slot :name="data.slot2" :data="data" @input="data.endVal"></slot>
              </span>
              <span v-else-if="data.colType == 'Date'||data.colType=='date'">
                <el-date-picker
                  style="width: 14rem"
                  v-model="data.endVal"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择日期"
                />
              </span>
              <span v-else-if="data.colType == 'String'">
                <el-input v-model="data.endVal" style="width: 14rem" />
              </span>
              <span v-else-if="['dateTime','datetime', 'time', 'Time', 'DateTime','Datetime'].some((k) => k == data.colType)">
                <el-date-picker
                  style="width: 14rem"
                  v-model="data.endVal"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择日期时间"
                />
              </span>
              <span v-else-if="['int', 'Integer', 'long', 'Long'].some((k) => k == data.colType)">
                <el-input-number
                  :precision="0"
                  v-model="data.endVal"
                  style="width: 14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span
                v-else-if="
                  ['float', 'Float', 'double', 'Double', 'BigDecimal','bigDecimal'].some(
                    (k) => k == data.colType
                  )
                "
              >
                <el-input-number
                  :precision="2"
                  v-model="data.endVal"
                  style="width: 14rem"
                  placeholder="空值将自动忽略"
                />
              </span>
              <span v-else>
                <el-input v-model="data.endVal" style="width: 14rem" placeholder="空值将自动忽略" />
              </span>
            </span>
            &nbsp;
            <el-button type="danger"  @click="() => remove(node, data)" icon="delete" plain/>
          </el-row>
        </el-form-item>
        </el-form>
        </template>
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </mdp-dialog>
  </span>
</template>

<script>
import util from '../js/util.js'
export default {
  name: 'MdpHiQuery',
  computed: {
    conditionCount() {
      return this.countHiQueryParams(this.queryCondition)
    },
    columnOptionsCpd() {
      var columnConfigs = this.columnConfigs.filter((k) => k.showHiQuery != false && k.property)
      var cols = columnConfigs.map((c) => {
        return {
          id: c.property,
          name: c.label,
          colType: c.colType,
          sqlVal: c.sqlVal,
          colPrefix: c.colPrefix,
          endVal: c.endVal,
          isCommon: c.isCommon,
          itemCode: c.itemCode,
          dictOptions: c.dictOptions,
          slot: c.slot,
          slot2: c.slot2 ? c.slot2 : c.slot
        }
      })
      cols.sort((a, b) => {
        if (a.isCommon == true && b.isCommon != true) {
          return -1
        } else if (a.isCommon == true && b.isCommon == true) {
          return 0
        } else if (a.isCommon != true && b.isCommon == true) {
          return 1
        } else {
          return 9
        }
      })
      return cols
    },
    treeDataCpd() {
      var defVal = {
        cid: util.createSeqNo('hq_'),
        label: 'AND',
        property: '',
        children: [],
        sqlLink: 'AND'
      }
      if (this.queryCondition == null || !this.queryCondition.cid) {
        //this.queryCondition=defVal;
        return [defVal]
      } else {
        return [this.queryCondition]
      }
    },
    value: {
      set(val) {
        this.$emit('update:modelValue', val)
      },
      get() {
        return this.modelValue
      }
    }
  },
  props: {
    text: {
      type: Boolean,
      default: false
    },
    columnConfigs: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelValue: {
      type: Object,
      default: () => {
        return null
      }
    },
    width: {
      type: [String, Number],
      default: '60%'
    },
    type: {
      type: String,
      default: 'default'
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    styleObj: {
      type: Object,
      default: null
    },
    btnName: {
      type: String,
      default: '高级查询'
    },
    size: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.queryCondition = val && val.cid ? val : this.createDefSqlLink()
    },
    columnOptionsCpd(val) {
      if (val && val.length > 0) {
        this.queryCondition = this.createDefSqlLink()
      }
    }
  },
  data() {
    return {
      hiQueryVisible: false, //是否显示表格的列配置
      checkAllColumn: false, //是否全选
      isIndeterminate: false,

      /**
       * 根据表格头初始化columnConfigs
       * {
       * cid:'主键，自动生成',
       * label:'列名',
       * property:'属性名',
       * sortNo:'排序从0-999，越小越靠前',
       * isCommon:'是否常用',
       * colType:'数据库字段类型 string/int/date/datatime/',
       * showHiQuery:'是否显示在高级查询true/false',
       * showCol:'是否在表格中显示该列true/false',
       * sqlLink:'链接操作符 and or ',
       * sqlOper:'运算操作符，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
       * sqlVal:'查询条件值，多选的话逗号分隔'，如果时bwtween，该值存开始值
       * endVal:'',
       * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
       * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
       * hiDisabled:'是否允许编辑查询条件',
       * children:[],
       * }
       */
      queryCondition: {}
    }
  },
  mounted() {
    if (this.value && this.value.cid) {
      this.queryCondition = this.value
    } else {
      this.queryCondition = this.createDefSqlLink()
    }
  },
  methods: {
    createDefCondition() {
      var newChild = {
        cid: util.createSeqNo('hq_'),
        sqlLink: '',
        label: '',
        children: [],
        sqlOper: '=',
        sqlVal: '',
        endVal: '',
        colType: '',
        itemCode: '',
        dictOptions: []
      }
      return newChild
    },
    createDefSqlLink() {
      var newChild = this.createOneSqlLink()
      if (this.columnOptionsCpd.length > 0) {
        var defNum = this.columnOptionsCpd.length > 5 ? 5 : this.columnOptionsCpd.length
        var children = []
        for (var i = 0; i < defNum; i++) {
          var condition = this.columnOption2Condition(this.columnOptionsCpd[i])
          children.push(condition)
        }
        newChild.children = children
      }
      return newChild
    },
    createOneSqlLink() {
      var newChild = {
        cid: util.createSeqNo('hq_'),
        sqlLink: 'AND',
        label: 'AND',
        children: [],
        sqlOper: '',
        sqlVal: '',
        endVal: '',
        colType: '',
        itemCode: '',
        dictOptions: []
      }
      return newChild
    },
    append(node, data) {
      if (!data.children) {
        data.children=[] 
      }
      data.children.push(this.createDefCondition())
    },
    appendSqlLink(node, data) {
      if (!data.children) { 
        data.children=[]  
      }
      data.children.push(this.createOneSqlLink())
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.cid === data.cid)
      children.splice(index, 1)
    },
    showHiQuery() {
      this.hiQueryVisible = true
    },
    save() {
      this.$emit('update:modelValue', this.queryCondition)
      this.$emit('change', this.queryCondition)
      this.hiQueryVisible = false
    },
    filterFun(option, item, operType) {
      if (!option.relyType) {
        return true
      }
      if (option.relyType.indexOf(operType) >= 0) {
        return true
      }
      return false
    },
    onSqlLinkChange(val, data) {
      if (val) {
        data.label = val.name
      } else {
        data.label = ''
      }
    },
    columnOption2Condition(column, c) {
      if (!c) {
        c = { cid: util.createSeqNo('hq_') }
      } else if (!c.cid) {
        c.cid = util.createSeqNo('hq_')
      }

      c.label = column.name
      c.colType = column.colType
      c.isCommon = column.isCommon
      c.colPrefix = column.colPrefix
      c.sqlVal = column.sqlVal
      c.endVal = column.endVal
      c.itemCode = column.itemCode
      c.dictOptions = column.dictOptions
      c.sqlOper = '='
      c.property = column.id
      c.slot = column.slot
      c.slot2 = column.slot2 ? column.slot2 : column.slot
      return c
    },
    onColumnChange(column, c) {
      this.columnOption2Condition(column, c)
    },
    /**
     * 计算有效的条件
     * @param {*} hi
     * @returns
     */
    countHiQueryParams(hi) {
      var count = 0
      if (hi == null || !hi.cid) {
        return 0
      } else {
        if (hi.children && hi.children.length > 0) {
          if (hi.sqlLink == 'AND' || hi.sqlLink == 'OR') {
            hi.children.forEach((k) => {
              var child = this.countHiQueryParams(k)
              count = count + child
            })
            return count
          } else {
            return 0
          }
        } else {
          if (hi.sqlLink == 'AND' || hi.sqlLink == 'OR') {
            return 0
          } else {
            if (hi.sqlOper == '=' && !hi.sqlVal) {
              return 0
            } else if (!hi.sqlOper) {
              return 0
            } else if (hi.sqlOper != '$IS NULL' && hi.sqlOper != '$IS NOT NULL') {
              if (hi.sqlVal == null || hi.sqlVal == '') {
                return 0
              }
            }
            return 1
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: 50px;
}

.hi-query-row {
  margin-top: 20px;
  margin-bottom: 20px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
