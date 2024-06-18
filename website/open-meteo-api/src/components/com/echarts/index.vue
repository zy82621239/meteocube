<template>
    <div :id="echartsId">
        
    </div>
</template>
<script>
import * as echarts from 'echarts';
import util from '@/core/util';
export default {
    props:{
        options:{
            type:Object,
            default:()=>{ return null; }
        }
    },
    data(){
        return {
            echartsId : 'echarts-'+util.random(8),
            chartsInstance:null,
            chartsOptions:this.options,
        }
    },
    watch: {
        "$props.options"(obj) { //监听语言的变化，每次变动都要重新渲染图表
            this.chartsOptions = {...obj};
            this.initChart(); 
        },
    },
    mounted() {
        this.initChart();
    },
    methods:{
        initChart() {
            if(this.chartsInstance === null){
                this.chartsInstance = echarts.init(document.getElementById(this.echartsId));
            }
            if(Object.keys(this.chartsOptions || {}).length > 0){//https://echarts.apache.org/zh/option.html
                let {title,legend,tooltip,xAxis,yAxis,grid,series} = this.chartsOptions;
                console.log("this.chartsOptions" , {title,legend,tooltip,xAxis,yAxis,grid,series});
                this.chartsInstance.setOption({title,legend,tooltip,xAxis,yAxis,grid,series});
            }
        },
        setOption(obj){
            this.chartsOptions = {...obj};
            this.initChart();
        },
        //设置基础接线图
        setOptionBase(obj){
            var series = (obj.series || []).map(d=>{
                    return {
                        type: 'line',
                        // stack: 'Total',
                        ...(d instanceof Array ? {data : [...d]} : d)
                    }
                });
            var legend = obj.legend === false? null : {type: 'scroll',orient: 'vertical',right: 10,top: 20,bottom: 20,
                ...(obj.legend instanceof Array ? {data : [...obj.legend]} : obj.legend)
            }
            if(obj.legend !== false && (legend.data||[]).length === 0 && series.length > 0){
                legend.data = series.map(d=>d.name);
            }
            var yAxis = obj.yAxis instanceof Array && obj.yAxis[0] instanceof Object ? {...obj.yAxis} : {
                    type: 'value',
                    ...(obj.yAxis instanceof Array ? {data : [...obj.yAxis]} : obj.yAxis)
                }
                , xAxis = obj.xAxis instanceof Array && obj.xAxis[0] instanceof Object ? {...obj.xAxis} : {
                    type: 'category',
                    boundaryGap: false,
                    ...(obj.xAxis instanceof Array ? {data : [...obj.xAxis]} : obj.xAxis)
                } , 
                grid  = {right: obj.legend !== false ? 150 : 0,left:0, ...obj.grid || {}};
            if(obj.isMultipleYAxis && !(yAxis instanceof Array)){
                var _yAxis = [] , isyAxis = yAxis instanceof Array ,isxAxis = xAxis instanceof Array;
                for (let i = 0; i < series.length; i++) {
                    const d = series[i];
                    if(!d.yAxisIndex)d.yAxisIndex = i;
                    if(!isyAxis){
                    var vals = d.data.map(d=>d.value === undefined ? d : d.value === null ? 0 : d.value) 
                        , max = Math.ceil(Math.max.apply(null,vals)/5)*5
                        , min = parseInt(Math.min.apply(null,vals))
                        , interval = Math.max(Math.ceil(((max - min) )/5) , 1);
                        var _y = {
                            type: 'value',
                            position : 'left',//这是定义坐标轴的位置，在左边还是右边
                            offset : i * 50,//这是定义坐标轴相对y轴初始位置的偏移量
                            name:d.format || '',
                            nameLocation : 'center',
                            nameGap :35,
                            ...(obj.yAxis instanceof Array ? yAxis[i] || {} : yAxis),
                            min : min,
                            max : min + interval * 5,
                            interval: interval,
                            splitNumber: 5,
                        };
                        _yAxis.push(_y);
                        // console.log(" ----" , d.name , {min,max , interval} , (max - min)/5);
                        if(_y.position === 'right'){
                            grid.right = (i + 1) * 50;
                        }else{
                            grid.left = (i + 1) * 50;
                        }
                    }
                }
                yAxis = [..._yAxis];
                if(!(xAxis instanceof Array))xAxis = [xAxis];
            }else{
                if(yAxis.position === 'right'){
                    grid.right = 50;
                }else{
                    grid.left = 50;
                }
                series = series.map(d=>{
                    let {yAxisIndex,xAxisIndex,...others} = d;
                    return others;
                });
            }
            this.setOption({
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var result = params[0].name;
                        params.forEach(function (item) {
                            result += '<br/>';
                            result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +item.color +'"></span>';
                            result += item.seriesName+'：' + '<b>' + (item.value === 0 || item.value ? item.value : '') + ((series[item.seriesIndex] || {}).format || '') + '</b>';
                        });
                        return result;
                    }
                },
                ...obj,grid,yAxis,xAxis,legend,series,
            });
        },
    },
}
</script>