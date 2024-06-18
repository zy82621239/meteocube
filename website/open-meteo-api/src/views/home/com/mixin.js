

import {export_json_to_excel} from "@/vendor/Export2Excel"

export default {
    data(){
        return {
            isLoading:false,
            formFields:[],
            httpConfigUrl:'',
            ServerUrl:'',
            formData:{},
            defaultServerUrl:''
        }
    },
    computed:{
        httpConfigFullUrl(){
            return this.$util.variableConvert(this.httpConfigUrl , this.$config.axiosServer , (name , val)=>{
                var baseUrl = val.target;
                return baseUrl.lastIndexOf('/') === baseUrl.length - 1 ? baseUrl.substr(0,baseUrl.length-1) : baseUrl;
            })
        },
    },
    watch:{
        formData:{
            immediate:true,
            deep:true,
            handler(v){
                this.handleChange();
            },
        },
    },
    created(){
        this.formFields = Object.keys(this.formData);
    },
    methods:{
        handleTabChange(ref , e){
            if(!this.$refs[ref]) return ;
            var index = parseInt(e.index) 
            , $ref = this.$refs[ref].tabList ? this.$refs[ref] : this.$refs[ref].$children[0]
            , tabList = [...$ref.tabList] 
            , formFields = [...this.formFields];
            for (let i = 0; i < tabList.length; i++) {
                const tab = tabList[i];
                if((tab.fileds || []).length){
                    for (let j = 0; j < tab.fileds.length; j++) {
                        var idx = formFields.indexOf(tab.fileds[j]);
                        if(index !== i){
                            if(idx > -1){
                                formFields.splice(idx , 1);
                            }
                        }else if(idx === -1){
                            formFields.push(tab.fileds[j]);
                        }
                    }
                }
            }
            this.formFields = [...formFields];
            this.handleChange();
        },
        hourlyCount(data , name){
            var count = 0 , hourly = this.formData[name || 'hourly'] || [];
            var total = 0;
            for(var i in data){
                if(data[i] instanceof Array){
                    total += data[i].length;
                    count += data[i].filter(d=>hourly.indexOf(d.value) > -1).length;
                }else {
                    total ++ ;
                    if(hourly.indexOf(data[i].value) > -1){
                        count ++;
                    }
                }
            }
            return [count,total];
        },
        handleChange(){
            this.isLoading = true;
            this.initForecastUrl();
        },
        initForecastUrl(){
            var data = {};
            for(let formKey in this.formData){
                var val = this.formData[formKey] || '';
                if(['start_end_date','ServerUrl','coordinates'].indexOf(formKey) === -1 && this.formFields.indexOf(formKey) > -1){
                    if(val.length > 0 && val !== '0' && val !== 'auto') data[formKey] = val instanceof Array ? val.join(',') : val;
                }else if(formKey === 'start_end_date' && val[0] && val[1]){
                    data.start_date = val[0];
                    data.end_date = val[1];
                }
            }
            if( this.formFields.indexOf('coordinates') > -1){
                var datas = (this.formData.coordinates || '').split(/[\s\n]/);
                data = {...data,latitude:'',longitude:'',elevation:'',timezone:'',start_date:'',end_date:''};
                datas.map((v)=>{
                    //latitude, longitude, elevation, timezone, start_date, end_date.
                    var vals = v.split(',');
                    if(vals[0])data.latitude += (data.latitude?',':'')+vals[0];
                    if(vals[1])data.longitude += (data.longitude?',':'')+vals[1];
                    if(vals[2])data.elevation += (data.elevation?',':'')+vals[2];
                    if(vals[3])data.timezone += (data.timezone?',':'')+vals[3];
                    if(vals[4] && vals[5]){
                        data.start_date += (data.start_date?',':'')+vals[4];
                        data.end_date += (data.end_date?',':'')+vals[5];
                    }
                    return {
                        latitude:vals[0],
                        longitude:vals[1],
                        elevation:vals[2],
                        timezone:vals[3],
                        start_date:vals[4],
                        end_date:vals[5],
                    };
                });
                data = this.$util.ObjectTrim(data , false,(v)=>v !== undefined && v !== null && v !== '');
            }
            var serverUrl = this.formFields.indexOf('ServerUrl') > -1 ? this.ServerUrl : this.defaultServerUrl;
            this.httpConfigUrl = serverUrl+(serverUrl.indexOf('?') > -1 ? '&' : '?')+this.$util.buildQuery(data)
			console.log("initForecastUrl",serverUrl , [...this.formFields] , {...data});
        },
        async downFileXlxs(){
            export_json_to_excel({
                header: this.httpData.headers, //必填   导出数据的表头
                data:this.httpData.data, //必填   导出具体数据
                filename: this.httpData.title, //非必填   导出文件名
                autoWidth: true, //非必填   单元格是否自动适应宽度
                bookType: "xlsx" //非必填   导出文件类型
            });
        },
        async downFileCsv(){
            export_json_to_excel({
                header: this.httpData.headers, //必填   导出数据的表头
                data:this.httpData.data, //必填   导出具体数据
                filename: this.httpData.title, //非必填   导出文件名
                autoWidth: true, //非必填   单元格是否自动适应宽度
                bookType: "csv" //非必填   导出文件类型
            });
        },
    }
};