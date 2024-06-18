<template>
    <div>
        <div class="container-fluid"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-cloud-sun me-2" viewBox="0 0 16 16"><path d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .624.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .51-.375A3.502 3.502 0 0 1 7 8zm4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"></path><path d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"></path></svg>
            <a class="navbar-brand" href="/">Open-Meteo</a>
            <com-menu mode="horizontal" 
            :menu-list="navBars" 
            @menu-click="handleNavClick"
            :default-openeds="['4']"
            :default-active="'4'"
            ></com-menu>
        </div>
        <div style="display: flex;flex-direction: row;">
            <div>
                <com-sticky>
                    <com-menu unique-opened 
                        :menu-list="menuArr" 
                        :default-openeds="MenuDefaultOpeneds"
                        :default-active="MenuDefaultActive"
                        @open="handleMenuOpen" 
                        @menu-click="handleMenuClick"
                        ref="Menu"
                        class="el-menu-vertical"
                        ></com-menu>
                </com-sticky>
            </div>
            <div style="padding: 10px;flex-grow: 1;overflow: hidden;">
                <router-view></router-view>
            </div>
        </div>
        <!-- <el-row>
            <el-col :span="4" :xs="0" :sm="6">
                
            </el-col>
            <el-col :span="20" :xs="24" :sm="18">
                <div style="padding:10px;"><router-view></router-view></div>
            </el-col>
        </el-row> -->
    </div>
</template>
<script>
import { mapState } from 'vuex';


export default {
    computed:{
        ...mapState(['menuList'])
    },
    data(){
        return {
            navBars:[
                // {name:"Home" , path:'https://open-meteo.com/'},
                // {name:"Features" , path:'https://open-meteo.com/en/features'},
                // {name:"Pricing" , path:'https://open-meteo.com/en/pricing'},
                // {name:"API Docs" , path:'/api'},
            ],
            menuArr:[],
            MenuDefaultOpeneds:[],
            MenuDefaultActive:null,
        }
    },
    watch:{
        $route(){
            this.initMenu();
        },
    },
    created(){
        this.initMenu();
    },
    methods:{
        initMenu(){
            var activeIndexs = []  , name = this.$route.name, path = this.$route.matched[this.$route.matched.length - 1].path, _params = JSON.stringify(this.ObjectKeysSorted(this.$route.params || {}));
            this.menuArr = this.$util.eachArray(this.$store.state.menuList , (d , i , array , parents)=>{
                var index = [...(parents || []).map(d=>d._index + 1),i+1].join('-');
                if(name == d.name && path == d.path){
                    var _p =  JSON.stringify(this.ObjectKeysSorted(d.params || {}));
                    if(_params == _p || activeIndexs.length === 0){
                        activeIndexs = [index];
                    }
                }
                if(activeIndexs.length > 0 && (d.children || []).map(d=>d.index).indexOf(activeIndexs[0]) > -1){
                    activeIndexs.unshift(index);
                }
                return {
                    ...d,index,
                    children:d.children || []
                };
            } , 'children');
            this.MenuDefaultOpeneds = activeIndexs.length > 0 ? activeIndexs : [this.menuArr[0].index];
            this.MenuDefaultActive = this.MenuDefaultOpeneds[this.MenuDefaultOpeneds.length - 1]
        },
        ObjectKeysSorted(obj){
            let keysSorted = Object.keys(obj).sort(function(a,b){return obj[b]-obj[a]})   //排序健名
            var newD = {};
            for(let i=0;i<keysSorted.length;i++){
                newD[keysSorted[i]]=obj[keysSorted[i]];
            }
            return newD;
        },
        handleMenuOpen(index , indexs , menu ){
            let {name, path, params} = menu || {};
            if(path && name){
                this.$router.push({name, path, params});
            }
            this.MenuDefaultOpeneds = indexs;
            this.MenuDefaultActive = index
        },
        handleNavClick({name, path, params}){
            if(path && name){
                this.$router.push({name,  path, params});
            }
        },
        handleMenuClick({name, path, params} , {index , indexPath}){
            this.MenuDefaultOpeneds = indexPath;
            this.MenuDefaultActive = index
            if(path && name){
                this.$router.push({name, path, params});
            }
        },
    },

}
</script>
<style>
.container-fluid{
    display: flex;
    align-items: center;
    padding:0 20px;
    .navbar-brand{
        margin: 0 .5rem;
    }
    a{
        color:inherit;
        text-decoration:none;
    }
}
.el-menu{
    border: none !important;
}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 300px;
    min-height: 400px;
  }
</style>