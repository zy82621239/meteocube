<template>
    <com-tabs style="box-shadow:none;border: none;" :tab-list="[
                {label:'Coordinates',name:'Coordinates' , fileds:['latitude','longitude','timezone']},
                {label:'List',name:'list' , fileds:['coordinates']}
                ]"  @tab-click="$emit('tabChange', ...arguments)">
                <div slot="header-left" style="font-weight: bold;">
                    Location:
                </div>
                <template slot-scope="{name}">
                    <template v-if="name === 'Coordinates'">
                        <div style="display: flex;align-items: self-end;margin-bottom:10px;" v-for="(lat,latIndex) in formData.latitude" :key="latIndex">
                            <el-form-item label="Latitude">
                                <el-input v-model="formData.latitude[latIndex]" type="number" step="0.01"></el-input>
                            </el-form-item>
                            <el-form-item label="Longitude">
                                <el-input v-model="formData.longitude[latIndex]" type="number" step="0.01"></el-input>
                            </el-form-item>
                            <el-form-item label="Timezone">
                                <el-select v-model="formData.timezone[latIndex]">
                                    <el-option
                                    v-for="item in timezoneList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div style="display: inline-block;">
                                <!-- <el-button icon="el-icon-search">Search Locations ...</el-button> -->
                                <el-button icon="el-icon-plus" @click="formData.latitude.push('')" v-if="latIndex === 0"></el-button>
                                <el-button icon="el-icon-delete" @click="formData.latitude.splice(latIndex,1);formData.longitude.splice(latIndex,1);formData.timezone.splice(latIndex,1);" v-else></el-button>
                            </div>
                        </div>
                    </template>
                    <template v-if="name === 'list'">
                        <el-row :gutter="20">
                            <el-col :span="12"><el-input type="textarea" :rows="5" v-model="formData.coordinates"></el-input></el-col>
                            <el-col :span="12" class="auto-wrap">
                                You can provide multiple coordinates. One per line and separated by commas. For each location, you can also set a time period if needed. Format: latitude, longitude, elevation, timezone, start_date, end_date. Only latitude and longitude are required. Examples:
                                <br/><br/>
                                52.52,13.41<br/>
                                51.5085,-0.1257,,auto<br/>
                                52.52,13.41,,Europe/Berlin,2021-01-01,2021-01-31<br/>
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </com-tabs>
</template>
<script>
export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    props:{
        value:{
            type:Object,
            default(){return {}}
        },
    },
    watch:{
        "$props.value":{
        deep:true,
        immediate:true,
        handler(v){
            // this.formData =v;
        }
        },
        "formData":{
        deep:true,
        immediate:true,
        handler(v){
            this.$emit('change', v)
        }
        },
    },
    created(){
        this.initTimezone();
    },
    data(){
        return {
            timezoneList:[],
            ServerUrl:this.serverUrl || '',
            formData:this.value || '',
        };
    },
    methods:{
        initTimezone(){
            var ki = 0;
            this.timezoneList = this.$config.openMeteoConfig.timezone.map((d,k)=>{
                var t = typeof d , val = null;
                if(t === 'object'){
                    val = {...d};
                }else if(ki === k) {
                    ki ++;
                    val = {value:d,name:d};
                }else {
                    val = {value:k,name:d};
                }
                return val;
            });
        },
    }
}
</script>