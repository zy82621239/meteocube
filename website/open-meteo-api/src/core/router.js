import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import util from './util'

//解决vue路由重复导航错误
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
var routes = [
    {
        path: '/',
        component: ()=> import('@/views/home/layout'),
        children: util.eachArray(store.state.menuList , (d , i)=>{
            return {
                name:d.name,
                path: d.path,
                meta:{title:d.name , params:d.params || {}},
                props: d.props || (d.params ? true : false),
                component: ()=> import('@/views'+d.router),
                children : d.children || null,
            };
        } , 'children'),
    }
];
const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});
var isInit = true;
router.beforeEach(async (to, from, next) => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    updateTitle(to);
    if(isInit){
        isInit = false;
        next({...to,params:{...to.meta.params}});
    }else{
        next();
    }
})
router.afterEach((to) => {
    
});
/**
 * 更新浏览器标题
 * @param route 路由
 */
function updateTitle(route) {
    if (!route.path.startsWith('/redirect/')) {
        let names = [];
        if(route && route.params.title){
            names.push(route.params.title);
        }else if (route && route.meta && route.meta.title) {
            names.push(route.meta.title);
        }else if (route && route.name) {
            names.push(route.name);
        }
        const appName = process.env.VUE_APP_NAME || 'Open-Meteo.com';
        names.push(appName);
        document.title = names.join(' | ');
    }
}
export default router