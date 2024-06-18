var comMixinTime = (new Date).getTime() / 1000;
const comMixin = {
    updated(){
        var t = (new Date).getTime() / 1000;
        if(t - comMixinTime >= 1){
            comMixinTime = t;
            this.$handleUpdated();
        }
    },
    methods:{
        /** 组件数据变动延缓执行方法 */
        $handleUpdated(){},
    }
};


export default comMixin;