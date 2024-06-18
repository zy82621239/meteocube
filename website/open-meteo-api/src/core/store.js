import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        userInfo: {id: 0,nickname: null,headImg: null},
        systemConfig: {},
        viewConfig: {},
        menuList:[
            {   name:"Weather Forecast", path:'/api' , router:'/home/home', 
                children:[
                    // {name:"Weather Forecast", path:'/' , router:'/home/home',hidden:true},
                    // {name:"DWD Germany", path:'/api/dwd' , params:{type:'dwd'} , router:'/home/home',},
                    // {name:"NOAA U.S.", path:'/api/gfs' , params:{type:'gfs'} , router:'/home/home',},
                    // {name:"Météo-France", path:'/api/meteofrance' , params:{type:'meteofrance'} , router:'/home/home',},
                    // {name:"ECMWF", path:'/api/ecmwf' , params:{type:'ecmwf'} , router:'/home/home',},
                    // {name:"JMA Japan", path:'/api/jma' , params:{type:'jma'} , router:'/home/home',},
                    // {name:"MET Norway", path:'/api/metno' , params:{type:'metno'} , router:'/home/home',},
                    // {name:"GEM Canada", path:'/api/gem' , params:{type:'gem'} , router:'/home/home',},
                    // {name:"BOM Australia", path:'/api/bom' , params:{type:'bom'} , router:'/home/home',},
                    // {name:"CMA China", path:'/api/cma' , params:{type:'cma'} , router:'/home/home',},
                ]
            },
            {name:"Historical Weather", path:'/api/hisWea' , router:'/home/hisWea',},
            {name:"Air Quality", path:'/api/airQua' , router:'/home/airQua',},
            {name:"Elevation", path:'/api/ele' , router:'/home/ele',},
            {name:"API Docs", path:'/api/docs' , router:'/home/apiDoc',},
        ],
    }
});
export default store