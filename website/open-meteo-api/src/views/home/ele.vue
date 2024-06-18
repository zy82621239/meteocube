<template>
    <div>
        <p v-html="describeNote"></p>
        <el-form :label-position="labelPosition" inline size="small" :model="formData">
            <h3>Select Coordinates or City</h3>
            <div style="display: flex;align-items: self-end;margin-bottom:10px;" v-for="(lat,latIndex) in formData.latitude" :key="latIndex">
                <el-form-item label="Latitude">
                    <el-input v-model="formData.latitude[latIndex]" type="number" step="0.01"></el-input>
                </el-form-item>
                <el-form-item label="Longitude">
                    <el-input v-model="formData.longitude[latIndex]" type="number" step="0.01"></el-input>
                </el-form-item>
                <div style="display: inline-block;">
                    <el-button icon="el-icon-search">Search Locations ...</el-button>
                    <el-button icon="el-icon-plus" @click="formData.latitude.push('')" v-if="latIndex === 0"></el-button>
                    <el-button icon="el-icon-delete" @click="formData.latitude.splice(latIndex,1);formData.longitude.splice(latIndex,1);" v-else></el-button>
                </div>
            </div>
            <usage-license ref="Commercial" 
            :serverUrl.sync="ServerUrl" 
            :apiKey.sync="formData.apikey" 
            @tabChange="handleTabChange('Commercial',...arguments)" 
            @update:serverUrl="handleChange"
            ></usage-license>
        </el-form>

        <h3>API Response</h3>
        <div style="position: relative;">
            <el-button @click="getForecastData">Preview</el-button>
            <div v-loading="echartLoading" style="margin-top:10px;font-size: 50%;padding:10px;border:1px solid #ccc;border-radius: 3px;" class="auto-wrap">{{JSON.stringify(httpData)}}</div>
        </div>

        <div style="margin-top:20px;">
            <p><strong>API URL</strong> (<a :href="httpConfigFullUrl" target="_blank">Open in new tab</a>).</p>
            <div style="font-size: 50%;padding:10px;border:1px solid #ccc;border-radius: 3px;" class="auto-wrap">{{httpConfigFullUrl }}</div>
            <small>You can copy this API URL into your application</small>
        </div>
    </div>
</template>
<script>
import usageLicense from './com/usageLicense'
export default {
    components:{usageLicense},
    data(){
        return {
            describeNote:`Get more information on how weather forecasts are improved with elevation models in our <a href="https://openmeteo.substack.com/p/87a094f1-325d-497a-8a9d-4d16b794fd15" target="_blank">blog article</a>.`,
            labelPosition:"top",
            ServerUrl:'https://my-server.tld',
            formData: {
                latitude: ['52.52'],
                longitude: ['13.45']
            },
            isLoading:false,
            echartLoading:false,
            formFields:[],
            httpConfigUrl:null,
            httpData:{},
        }
    },
    computed:{
        httpConfigFullUrl(){
            return this.$util.variableConvert(this.httpConfigUrl , this.$config.axiosServer , (name , val)=>{
                var baseUrl = val.target;
                return baseUrl.lastIndexOf('/') === baseUrl.length - 1 ? baseUrl.substr(0,baseUrl.length-1) : baseUrl;
            })
        },
        pressureValues(){
            var values = [];
            this.pressureList.map(d=>{
                this.hourlyPressureList.map(d1=>{
                    values.push(d.name+'_'+d1.value);
                })
            });
            return values.filter(d=>(this.formData.hourly||[]).indexOf(d) > -1)
        },
    },
    watch:{
        formData:{
            // immediate:true,
            deep:true,
            handler(){
                this.handleChange();
            },
        },
    },
    created(){
        this.formFields = Object.keys(this.formData);
    },
    mounted(){
        this.getForecastData();
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
        handleChange(e){
            this.isLoading = true;
            this.initForecastUrl();
        },
        initForecastUrl(){
            var data = {};
            for(let formKey in this.formData){
                if(this.formFields.indexOf(formKey) > -1){
                    var val = this.formData[formKey] || '';
                    if(val) data[formKey] = val instanceof Array ? val.join(',') : val;
                }
            }
            var serverUrl = this.formFields.indexOf('ServerUrl') > -1 ? this.ServerUrl : '${api}/v1/elevation';
            this.httpConfigUrl = serverUrl+(serverUrl.indexOf('?') > -1 ? '&' : '?')+this.$util.buildQuery(data)
        },
        getForecastData(){
            this.echartLoading = true;
            this.initForecastUrl();
            this.$http.get(this.httpConfigUrl).then(({data})=>{
                this.httpData = data;
            }).finally(()=>{
                this.isLoading = false;
                this.echartLoading = false;
            });
        },
    }
}
</script>
<style lang="less">
.el-form-item--small.el-form-item{
    margin-bottom: 0;
}
</style>