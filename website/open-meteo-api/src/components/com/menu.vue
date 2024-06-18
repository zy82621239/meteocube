<script>
export default {
    props:{
        menuList:{
            type:Array,
            required:true,
        },
        mode:{
            type:String,
            validator:function(val){
				return ['horizontal','vertical'].includes(val);
			}
        },
        collapse:{
            type:Boolean,
            default:()=>{ return false;}
        },
        backgroundColor:String,
        textColor:String,
        ActiveTextColor:String,
        defaultActive:String,
        defaultOpeneds:Array,
        uniqueOpened:{
            type:Boolean,
            default:()=>{ return false;}
        },
        menuTrigger:{
            type:String,
            validator:function(val){
				return ['hover','click'].includes(val);
			}
        },
        router:{
            type:Boolean,
            default:()=>{ return false;}
        },
        collapseTransition:{
            type:Boolean,
            default:()=>{ return true;}
        },
        defaultCallback:{
            type:Function,
            default:()=>{ return null;}
        },
    },
    render(createElement) {
        let {menuList , defaultCallback , ...props} = this.$props;
        var $props = {...props};
        var menuArr = {} , activeIndexs = [];
        var childrens = this.$util.eachArray(this.menuList , (d , i , array , parents)=>{
                var index = d.index || [...(parents || []).map(d=>d._index + 1),i+1].join('-');
                let {name, path, params , children , ...ds} = d;
                let isActive = (($props.defaultOpeneds||[]).indexOf(index) > -1 || ($props.defaultActive && $props.defaultActive == index));
                menuArr[index] = {name, path, params,...ds,index};
                if((d.children || []).length > 0){
                    return createElement('el-submenu' , {
                        props:{
                            index,
                            disabled:d.disabled === true,
                            'popper-class':d.popperClass||null,
                            'show-timeout':d.ShowTimeout||300,
                            'hide-timeout':d.HideTimeout||300,
                            // 'popper-append-to-body':d.PopperAppendToBody||null,
                        },
                        class:{'is-active':isActive},
                    }  , [createElement('span', {slot:'title'} , d.name),...d.children,]);
                }else{
                    var domProps = {} , isUrl = this.$util.isUrl(d.path);
                    if(isUrl)domProps.innerHTML = `<a href='${d.path}'>${d.name}</a>`;
                    return createElement('el-menu-item' , {
                        props:{index,disabled:d.disabled === true,route:d.route || {}},
                        domProps,
                        // class:{'is-active':isActive},
                        on:{click:isUrl?()=>{}:(...vars)=>{this.$emit('menu-click' , this.menuArr[index] ,...vars);},},
                    } , d.name );
                }
            } , 'children');
        this.menuArr = menuArr;
        return createElement('el-menu' , {
            props : $props,
            on:{
                select:(index , indexs)=>{
                    this.$emit('select',index , indexs , this.menuArr[index],this.$refs.mainRef);
                },
                open:(index , indexs)=>{
                    this.$emit('open',index , indexs , this.menuArr[index], this.$refs.mainRef);
                },
                close:(index , indexs)=>{
                    this.$emit('close',index , indexs , this.menuArr[index], this.$refs.mainRef);
                },
            },
            ref: 'mainRef'
        } , childrens);
    },
    data(){
        return {
            menuArr:[],
        };
    },
    methods:{
        open(){
            this.$refs.mainRef.open(...arguments);
        },
        close(){
            this.$refs.mainRef.close(...arguments);
        },
    },
}
</script>
<style>
.el-submenu.is-active .el-submenu__title, .el-menu-item.is-active {
    color: #409EFF;
}
</style>