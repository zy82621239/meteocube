<template>
  <div :class="['tab-box','tab-box--'+tabPosition]">
    <div class="flex-center">
      <div :class="'el-tabs--'+type" v-if="['top','bottom'].includes(tabPosition) && $scopedSlots['header-left']">
        <div class="el-tabs__header el-tabs__header-slot">
          <div class="flex-center tab-box-left"><div class="el-tabs__item"><slot name="header-left"></slot></div></div>
        </div>
      </div>
      <el-tabs ref="tabs" v-model="activeName"
               :type="type"
               :closable="closable"
               :addable="addable"
               :tab-position="tabPosition"
               :stretch="stretch"
               :before-leave="beforeLeave"
               @tab-click="handleEmit('tab-click' , ...arguments)"
               @tab-remove="handleEmit('tab-remove' , ...arguments)"
               @tab-add="handleEmit('tab-add' , ...arguments)"
               @edit="handleEmit('edit' , ...arguments)"
               style="flex: 1;"
               :class="headerClass"
      >
        <el-tab-pane
            :label="tab.label"
            :disabled="tab.disabled === true"
            :name="tab.name"
            :closable="tab.closable === true"
            :lazy="tab.lazy === true"
            v-for="(tab , index) in tabList"
            :key="index">
          <template slot="label">
            <slot name="label" v-bind="tab">
              {{tab.label}}
            </slot>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div :class="'el-tabs--'+type" v-if="['top','bottom'].includes(tabPosition) && $scopedSlots['header-right']">
        <div class="el-tabs__header el-tabs__header-slot">
          <div class="flex-center tab-box-right"><div class="el-tabs__item"><slot name="header-right"></slot></div></div>
        </div>
      </div>
    </div>
    <div class="tab-box-content" :style="bodyStyle">
      <template v-for="tab in tabList">
        <slot :name="tab.slot" v-bind="tab" v-if="tab.slot && tab.slot !== 'default' && !['header-right','header-left','label'].includes(tab.slot) && activeName === tab.name+''"></slot>
      </template>
      <slot v-bind="tabList.filter(d=>d.name+''===activeName+'')[0] || {}" ></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props:{
    tabList:{
      type:Array,
      default(){return [];}
    },
    value:{
      type:String,
      default(){return null;}
    },
    closable:{
      type:Boolean,
      default(){return false;}
    },
    addable:{
      type:Boolean,
      default(){return false;}
    },
    editable:{
      type:Boolean,
      default(){return false;}
    },
    tabPosition:{
      type:String,
      default(){return 'top';},//top/right/bottom/left
      validator(v){
        return ['top','right','bottom','left'].includes(v);
      },
    },
    type:{
      type:String,
      default(){return null;},//card/border-card
      validator(v){
        return ['card','border-card'].includes(v);
      },
    },
    stretch:{
      type:Boolean,
      default(){return false;}
    },
    beforeLeave:Function,//Function(activeName, oldActiveName)
    bodyStyle:{
      type:[String,Object],
      default(){return {};}
    },
    headerClass:{
      type:[String,Object],
      default(){return {};}
    },
  },data(){
    return {
      activeName : this.value,
    }
  },
  watch:{
    activeName(v){
      this.$emit('change',v+'');
    },
    value(v){
      if(v+"" !== this.activeName+""){
        this.activeName = v;
      }
    },
  },
  created(){
    if(this.value === null && this.tabList.length > 0)this.activeName = this.tabList[0].name;
  },
  methods:{
    handleEmit(type , ...vars){
      this.$emit('change',this.activeName+'');
      this.$emit(type,...vars);
    },
  }
}
</script>

<style scoped lang="less">
.tab-box::v-deep {
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
  border: 1px solid #DCDFE6;
  background-color: #fff;
  .flex-center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tab-box-left,.tab-box-right{
    padding:0;
    margin-bottom: -1px;
  }
  .el-tabs--border-card{
    .tab-box-left{
      // padding-left:15px;
      border-right:1px solid #DCDFE6
    }
    .tab-box-right{
      // padding-right:15px;
      border-left:1px solid #DCDFE6
    }
  }
  .el-tabs--border-card>.el-tabs__header {
    border-bottom: 1px solid #E4E7ED;
  }
  .tab-box-content{
    padding: 15px;
  }
  .el-tab-badge{
    position: absolute;
  }
  .el-tabs__header-slot{
    border-bottom-color:transparent !important;
    background-color:transparent !important;
  }
  .el-tabs__nav-wrap::after{
    background-color:transparent;
  }
}
.tab-box--left,.tab-box--right{
  display: flex;
  flex-direction: row;
  .flex-center{
    flex-shrink: 0;
  }
  .tab-box-content{
    flex-grow: 1;
  }
}
.el-tabs--border-card::v-deep{
  box-shadow:none;
  border: none;
  > .el-tabs__content {
    height: 0;
    padding: 0;
  }
}
</style>