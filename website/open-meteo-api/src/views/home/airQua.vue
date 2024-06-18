<template>
    <div>
        <el-form :label-position="labelPosition" inline size="small" :model="formData">
            <h3>Location and Time</h3>
            <location ref="Coordinates" 
                v-model="formData" 
                @tabChange="handleTabChange('Coordinates',...arguments)"
            ></location>

            <com-tabs style="box-shadow:none;border: none;" ref="ForecastLength" :tab-list="[
                {label:'Forecast Length',name:'forecast-length', fileds:['forecast_days','past_days']},
                {label:'Time Interval',name:'time-interval', fileds:['start_end_date']}
            ]" @tab-click="handleTabChange('ForecastLength',...arguments)">
                <div slot="header-left" style="font-weight: bold;">
                    Time:
                </div>
                <template slot-scope="{name}">
                    <template v-if="name === 'forecast-length'">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="Forecast days">
                                    <el-select v-model="formData.forecast_days" aria-label="Forecast days">
                                        <el-option value="1" label="1 day"></el-option>
                                        <el-option value="3" label="3 days"></el-option>
                                        <el-option value="5" label="5 days (default)"></el-option>
                                        <el-option value="7" label="7 days"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Past days">
                                    <el-select v-model="formData.past_days" aria-label="Forecast days">
                                        <el-option value="0" label="0 (default)"></el-option>
                                        <el-option value="1" label="1 day"></el-option>
                                        <el-option value="2" label="2 days"></el-option>
                                        <el-option value="3" label="3 days"></el-option>
                                        <el-option value="5" label="5 days"></el-option>
                                        <el-option value="7" label="1 week"></el-option>
                                        <el-option value="14" label="2 weeks"></el-option>
                                        <el-option value="31" label="1 month"></el-option>
                                        <el-option value="61" label="2 months"></el-option>
                                        <el-option value="92" label="3 months"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="auto-wrap">
                                By default, we provide forecasts for 7 days, but you can access forecasts for up to 16 days. If you're interested in past weather data, you can use the <mark>Past Days</mark> feature to access archived forecasts.
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="name === 'time-interval'">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-date-picker
                                    v-model="formData.start_end_date"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="Start Date"
                                    end-placeholder="End Date"
                                    value-format="yyyy-MM-dd"
                                    align="right">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="12" class="auto-wrap">
                                The <mark>Start Date</mark> and <mark>End Date</mark> options help you choose a range of dates more easily. Archived forecasts come from a series of weather model runs over time. If you're using the free API, you can access archived forecasts for up to 3 months. For our commercial customers, data is available up to 6 months. You can also check out our Historical Weather API, which provides data going all the way back to 1940.
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </com-tabs>

            <h3>Hourly Air Quality Variables</h3>
            <el-checkbox-group v-model="formData.hourly">
                <el-row :gutter="20">
                    <template  v-for="(hourlyList,hourlyBIdx) in hourlyVariablesList" >
                        <el-col :span="6" :xs="12" :sm="8" :key="hourlyBIdx">
                            <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                            </template>
                        </el-col>
                    </template>
                </el-row>
                <small class="text-muted">* Only available in Europe during pollen season with 4 days forecast</small>


                <el-collapse style="margin-top:20px;border: 1px solid #EBEEF5" class="com-collapse">
                        <el-collapse-item name="1">
                            <template slot="title">
                                European Air Quality Index
                                <el-button size="mini" round v-if="hourlyCount(air_qualityList)[0] > 0">{{hourlyCount(air_qualityList).join('/')}}</el-button>
                            </template>
                            <el-row :gutter="20">
                                <el-col :span="6" :xs="12" :sm="8">
                                    <template  v-for="hourlyList in air_qualityList" >
                                            <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                                <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                                            </template>
                                    </template>
                                </el-col>
                                <el-col :span="18" :xs="12" :sm="16">
                                    <p><small class="text-muted">Note: The European Air Quality Index (AQI) ranges from 0-20 (good), 20-40 (fair),
                                40-60 (moderate), 60-80 (poor), 80-100 (very poor) and exceeds 100 for extremely poor
                                conditions.</small></p> <p><small class="text-muted">Pollutant thresholds in μg/m³ from the <a href="https://www.eea.europa.eu/themes/air/air-quality-index">European Environment Agency (EAA)</a> are given on the right. Particulate Matter (PM) is using a 24 hour roling average, while
                                gases use hourly values.</small></p>
                                </el-col>
                            </el-row>
                            <el-table :data="air_qualityTable" style="width: 100%" :highlight-current-row="false">
                                <el-table-column prop="Pollutant" label="Pollutant(μg/m³)">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.Pollutant"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Timespan" label="Timespan"></el-table-column>
                                <el-table-column prop="Good" label="Good"></el-table-column>
                                <el-table-column prop="Fair" label="Fair"></el-table-column>
                                <el-table-column prop="Moderate" label="Moderate"></el-table-column>
                                <el-table-column prop="Poor" label="Poor"></el-table-column>
                                <el-table-column prop="Verypoor" label="Verypoor"></el-table-column>
                                <el-table-column prop="Extremelypoor" label="Extremelypoor"></el-table-column>
                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item name="2">
                            <template slot="title">
                                United States Air Quality Index  
                                <el-button size="mini" round v-if="hourlyCount(StatesAirQualityList)[0] > 0">{{hourlyCount(StatesAirQualityList).join('/')}}</el-button>
                            </template>
                            <el-row :gutter="20">
                                <el-col :span="6" :xs="12" :sm="8">
                                    <template  v-for="hourlyList in StatesAirQualityList" >
                                            <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                                <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                                            </template>
                                    </template>
                                </el-col>
                                <el-col :span="18" :xs="12" :sm="16">
                                    <p><small class="text-muted">Note: The United States Air Quality Index (AQI) ranges from 0-50 (good), 51-100
							(moderate), 101-150 (unhealthy for sensitive groups), 151-200 (unhealthy), 201-300
							(very unhealthy) and 301-500 (hazardous).</small></p> <p><small class="text-muted">Pollutant thresholds from the <a href="https://en.wikipedia.org/wiki/Air_quality_index#United_States">United States Environmental Protection Agency (EPA)</a>
							are given below. Some thresholds are in parts per billion (ppb) instead of μg/m³. Conversion
							explained
							<a href="https://www.breeze-technologies.de/blog/air-pollution-how-to-convert-between-mgm3-µgm3-ppm-ppb/">here</a>. Particulate Matter (PM) is using a 24 hour roling average, ozone and carbon
							monoxide use 8 hour averages, other gases use hourly values.</small></p>
                                </el-col>
                            </el-row>
                            <el-table :data="StatesAirQualityTable" style="width: 100%" :highlight-current-row="false">
                                <el-table-column prop="Pollutant" label="Pollutant">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.Pollutant"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Timespan" label="Timespan"></el-table-column>
                                <el-table-column prop="Good" label="Good"></el-table-column>
                                <el-table-column prop="Moderate" label="Moderate"></el-table-column>
                                <el-table-column prop="UnhealthyforSensitiveGroups" label="Unhealthy for Sensitive Groups"></el-table-column>
                                <el-table-column prop="Unhealthy" label="Unhealthy"></el-table-column>
                                <el-table-column prop="VeryUnhealthy" label="Very Unhealthy"></el-table-column>
                                <el-table-column prop="Hazardous" label="Hazardous">
                                    <template slot-scope="scope">
                                        <el-row :gutter="20">
                                            <el-col :span="12" v-for="(h , hi) in scope.row.Hazardous" :key="hi">
                                                {{h}}
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item name="3">
                            <template slot="title">
                                Additional Options
                            </template>
                            <p><small class="text-muted">Note: You can further adjust the forecast time range for hourly weather variables using <mark>&amp;forecast_hours=</mark> and <mark>&amp;past_hours=</mark> as shown below.</small></p>
                            <div>
                                <el-form-item label="Forecast Hours">
                                    <el-select v-model="formData.forecast_hours" aria-label="Forecast days">
                                        <el-option value="" label="- (default)"></el-option>
                                        <el-option value="1" label="1 hour"></el-option>
                                        <el-option value="6" label="6 hours"></el-option>
                                        <el-option value="12" label="12 hours"></el-option>
                                        <el-option value="24" label="24 hours"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Past Hours">
                                <el-select v-model="formData.past_hours" aria-label="Forecast days">
                                    <el-option value="" label="- (default)"></el-option>
                                    <el-option value="1" label="1 hour"></el-option>
                                    <el-option value="6" label="6 hours"></el-option>
                                    <el-option value="12" label="12 hours"></el-option>
                                    <el-option value="24" label="24 hours"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>

            </el-checkbox-group>

            <h3>Current Conditions</h3>
            <el-checkbox-group v-model="formData.current">
                <el-row :gutter="20">
                    <template  v-for="(hourlyList,hourlyBIdx) in CurrentConditionsList" >
                        <el-col :span="6" :xs="12" :sm="8" :key="hourlyBIdx">
                            <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                            </template>
                        </el-col>
                    </template>
                </el-row>
            </el-checkbox-group>

            <h3>Settings</h3>
            <div>
                <el-form-item label="Domains">
                    <el-select v-model="formData.domains">
                        <el-option value="auto" label="Global + European"></el-option><el-option value="cams_global" label="Global (40 km)"></el-option><el-option value="cams_europe" label="European (11 km)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Timeformat">
                    <el-select v-model="formData.timeformat">
                        <el-option value="iso8601" label="ISO 8601 (e.g. 2022-12-31)"></el-option><el-option value="unixtime" label="Unix timestamp"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <usage-license ref="Commercial" 
            :serverUrl.sync="ServerUrl" 
            :apiKey.sync="formData.apikey" 
            @tabChange="handleTabChange('Commercial',...arguments)" 
            @update:serverUrl="handleChange"
            ></usage-license>
        </el-form>
        <h3>API Response</h3>
        <div style="position: relative;" v-loading="echartLoading">
            <com-echarts style="width: 100%;height:500px;" ref="echarts"></com-echarts>
            <div style="position: absolute;position: absolute;width: 100%;height: 100%;right: 0; top: 0;background: #ccc;text-align: center;" v-if="isLoading">
                <el-button style="margin-top:225px;" size="mini" round @click="getForecastData">重新加载</el-button>
            </div>
        </div>

        <div style="margin-top:20px;">
            <div>
                <el-button type="primary" plain @click="downFileXlxs">Download XLS</el-button>
                <el-button type="primary" plain @click="downFileCsv">Download CSV</el-button>
            </div>
            <p><strong>API URL</strong> (<a :href="httpConfigFullUrl" target="_blank">Open in new tab</a> or copy this URL into your application).</p>
            <div style="font-size: 50%;padding:10px;border:1px solid #ccc;border-radius: 3px;" class="auto-wrap">{{httpConfigFullUrl }}</div>
        </div>
    </div>
</template>
<script>
import location from './com/location'
import usageLicense from './com/usageLicense'
import comMixin from './com/mixin'
export default {
    components:{usageLicense,location},
    mixins:[comMixin],
    data(){
        return {
            labelPosition:"top",
            ServerUrl:'https://my-server.tld',
            defaultServerUrl:'${air-quality-api}/v1/air-quality',
            formData: {
                latitude: ['52.52'],
                longitude: ['13.45'],
                timezone: ['UTC'],
                forecast_days:'5',
                past_days:'0',
                hourly:['pm10','pm2_5'],
                forecast_hours:'',
                past_hours:'',
                current:[],
                domains:'auto',
                timeformat:'iso8601'
            },
            echartLoading:false,
            formFields:[],
            httpConfigUrl:null,
            httpData:{},
            hourlyVariablesList: [[{"value":"pm10","name":"Particulate Matter PM<sub>10</sub>"},{"value":"pm2_5","name":"Particulate Matter PM<sub>2.5</sub>"},{"value":"carbon_monoxide","name":"Carbon Monoxide CO"},{"value":"nitrogen_dioxide","name":"Nitrogen Dioxide NO<sub>2</sub>"},{"value":"sulphur_dioxide","name":"Sulphur Dioxide SO<sub>2</sub>"},{"value":"ozone","name":"Ozone O<sub>3</sub>"}],[{"value":"aerosol_optical_depth","name":"Aerosol Optical Depth"},{"value":"dust","name":"Dust"},{"value":"uv_index","name":"UV Index"},{"value":"uv_index_clear_sky","name":"UV Index Clear Sky"},{"value":"ammonia","name":"Ammonia NH<sub>3</sub> <small class=\"text-muted\">(*)</small>"}],[{"value":"alder_pollen","name":"Alder Pollen <small class=\"text-muted\">(*)</small>"},{"value":"birch_pollen","name":"Birch Pollen <small class=\"text-muted\">(*)</small>"},{"value":"grass_pollen","name":"Grass Pollen <small class=\"text-muted\">(*)</small>"},{"value":"mugwort_pollen","name":"Mugwort Pollen <small class=\"text-muted\">(*)</small>"},{"value":"olive_pollen","name":"Olive Pollen <small class=\"text-muted\">(*)</small>"},{"value":"ragweed_pollen","name":"Ragweed Pollen <small class=\"text-muted\">(*)</small>"}]],
            air_qualityList:[[{"value":"european_aqi","name":"European AQI"},{"value":"european_aqi_pm2_5","name":"European AQI PM<sub>2.5</sub>"},{"value":"european_aqi_pm10","name":"European AQI PM<sub>10</sub>"},{"value":"european_aqi_nitrogen_dioxide","name":"European AQI NO<sub>2</sub>"},{"value":"european_aqi_ozone","name":"European AQI O<sub>3</sub>"},{"value":"european_aqi_sulphur_dioxide","name":"European AQI SO<sub>2</sub>"}]],
            air_qualityTable:[
                {"Pollutant":"PM<sub>2.5</sub>","Timespan":"24h","Good":"0-10","Fair":"10-20","Moderate":"20-25","Poor":"25-50","Verypoor":"50-75","Extremelypoor":"75-800"},{"Pollutant":"PM<sub>10</sub>","Timespan":"24h","Good":"0-20","Fair":"20-40","Moderate":"40-50","Poor":"50-100","Verypoor":"100-150","Extremelypoor":"150-1200"},
                {"Pollutant":"NO<sub>2</sub>","Timespan":"1h","Good":"0-40","Fair":"40-90","Moderate":"90-120","Poor":"120-230","Verypoor":"230-340","Extremelypoor":"340-1000"},
                {"Pollutant":"O<sub>3</sub>","Timespan":"1h","Good":"0-50","Fair":"50-100","Moderate":"100-130","Poor":"130-240","Verypoor":"240-380","Extremelypoor":"380-800"},
                {"Pollutant":"SO<sub>2</sub>","Timespan":"1h","Good":"0-100","Fair":"100-200","Moderate":"200-350","Poor":"350-500","Verypoor":"500-750","Extremelypoor":"750-1250"}
            ],
            StatesAirQualityList:[[{"value":"us_aqi","name":"United States AQI"},{"value":"us_aqi_pm2_5","name":"United States AQI PM<sub>2.5</sub>"},{"value":"us_aqi_pm10","name":"United States AQI PM<sub>10</sub>"},{"value":"us_aqi_nitrogen_dioxide","name":"United States AQI NO<sub>2</sub>"},{"value":"us_aqi_carbon_monoxide","name":"United States AQI CO"},{"value":"us_aqi_ozone","name":"United States AQI O<sub>3</sub>"},{"value":"us_aqi_sulphur_dioxide","name":"United States AQI SO<sub>2</sub>"}]],
            StatesAirQualityTable:[
                {"Pollutant":"O<sub>3</sub> <small class=\"text-muted\">(ppb)</small>","Timespan":"8h","Good":"0-55","Moderate":"55-70","UnhealthyforSensitiveGroups":"70-85","Unhealthy":"85-105","VeryUnhealthy":"105-200","Hazardous":["-","-"]},
                {"Pollutant":"O<sub>3</sub> <small class=\"text-muted\">(ppb)</small>","Timespan":"1h","Good":"-","Moderate":"-","UnhealthyforSensitiveGroups":"125-165","Unhealthy":"165-205","VeryUnhealthy":"205-405","Hazardous":["405-505","505-605"]},
                {"Pollutant":"PM<sub>2.5</sub> <small class=\"text-muted\">(μg/m³)</small>","Timespan":"24h","Good":"0-12","Moderate":"12-35.5","UnhealthyforSensitiveGroups":"35.5-55.5","Unhealthy":"55.5-150.5","VeryUnhealthy":"150.5-250.5","Hazardous":["250.5-350.5","350.5-500.5"]},
                {"Pollutant":"PM<sub>10</sub> <small class=\"text-muted\">(μg/m³)</small>","Timespan":"24h","Good":"0-55","Moderate":"55-155","UnhealthyforSensitiveGroups":"155-255","Unhealthy":"255-355","VeryUnhealthy":"355-425","Hazardous":["425-505","505-605"]},
                {"Pollutant":"CO <small class=\"text-muted\">(ppm)</small>","Timespan":"8h","Good":"0-4.5","Moderate":"4.5-9.5","UnhealthyforSensitiveGroups":"9.5-12.5","Unhealthy":"12.5-15.5","VeryUnhealthy":"15.5-30.5","Hazardous":["30.5-40.5","40.5-50.5"]},
                {"Pollutant":"SO<sub>2</sub> <small class=\"text-muted\">(ppb)</small>","Timespan":"1h","Good":"0-35","Moderate":"35-75","UnhealthyforSensitiveGroups":"75-185","Unhealthy":"185-305","VeryUnhealthy":"-","Hazardous":["-","-"]},
                {"Pollutant":"SO<sub>2</sub> <small class=\"text-muted\">(ppb)</small>","Timespan":"24h","Good":"-","Moderate":"-","UnhealthyforSensitiveGroups":"-","Unhealthy":"-","VeryUnhealthy":"305-605","Hazardous":["605-805","805-1005"]},
                {"Pollutant":"NO<sub>2</sub> <small class=\"text-muted\">(ppb)</small>","Timespan":"1h","Good":"0-54","Moderate":"54-100","UnhealthyforSensitiveGroups":"100-360","Unhealthy":"360-650","VeryUnhealthy":"650-1250","Hazardous":["1250-1650","1650-2050"]}
            ],
            CurrentConditionsList:[[{"value":"european_aqi","name":"European AQI"},{"value":"us_aqi","name":"United States AQI"},{"value":"pm10","name":"Particulate Matter PM<sub>10</sub>"},{"value":"pm2_5","name":"Particulate Matter PM<sub>2.5</sub>"},{"value":"carbon_monoxide","name":"Carbon Monoxide CO"},{"value":"nitrogen_dioxide","name":"Nitrogen Dioxide NO<sub>2</sub>"},{"value":"sulphur_dioxide","name":"Sulphur Dioxide SO<sub>2</sub>"},{"value":"ozone","name":"Ozone O<sub>3</sub>"}],[{"value":"aerosol_optical_depth","name":"Aerosol Optical Depth"},{"value":"dust","name":"Dust"},{"value":"uv_index","name":"UV Index"},{"value":"uv_index_clear_sky","name":"UV Index Clear Sky"},{"value":"ammonia","name":"Ammonia NH<sub>3</sub> <small class=\"text-muted\">(*)</small>"}],[{"value":"alder_pollen","name":"Alder Pollen <small class=\"text-muted\">(*)</small>"},{"value":"birch_pollen","name":"Birch Pollen <small class=\"text-muted\">(*)</small>"},{"value":"grass_pollen","name":"Grass Pollen <small class=\"text-muted\">(*)</small>"},{"value":"mugwort_pollen","name":"Mugwort Pollen <small class=\"text-muted\">(*)</small>"},{"value":"olive_pollen","name":"Olive Pollen <small class=\"text-muted\">(*)</small>"},{"value":"ragweed_pollen","name":"Ragweed Pollen <small class=\"text-muted\">(*)</small>"}]],
        }
    },
    mounted(){
        this.getForecastData();
    },
    methods:{
        getForecastData(){
            this.echartLoading = true;
            this.initForecastUrl();
            this.$http.get(this.httpConfigUrl).then(({data})=>{
                let {time , ...hourlys} = data.hourly
                var series = [];
                var yAxisIndex = 0;
                for(let serieKey in hourlys){
                    let unit = data.hourly_units[serieKey] || '';
                    series.push({
                        name : serieKey,
                        yAxisIndex:yAxisIndex+'',
                        data:[...hourlys[serieKey]],
                        format:unit,
                        axisLabel: {
                            formatter: '{value}'+unit
                        },
                    });
                    yAxisIndex++;
                }
                var fields = ['time' , ...Object.keys(hourlys).map(d=>d+"（"+data.hourly_units[d]+"）")];
                this.httpData = {
                    title :'open-meteo-'+data.latitude+'N'+data.longitude.toFixed(2)+'E'+data.elevation+'m',
                    headers:['latitude', 'longitude', 'elevation', 'utc_offset_seconds','timezone','timezone_abbreviation',...fields.filter((d,i)=>i > 5).map(d=>'')],
                    data:[
                        [data.latitude,data.longitude,data.elevation,data.utc_offset_seconds,data.timezone,data.timezone_abbreviation,...fields.filter((d,i)=>i > 5).map(d=>'')],
                        [...fields.map(d=>'')],
                        fields,
                        ...time.map((d,i)=>{
                            var v = [d];
                            for(let serieKey in hourlys){
                                v.push(hourlys[serieKey][i] === undefined || hourlys[serieKey][i] === null ? '' : hourlys[serieKey][i])
                            }
                            return v;
                        }),
                    ]
                };
                this.$nextTick(()=>{
                    // var colors = ['#2caffe', '#544fc5'];
                    this.$refs.echarts && this.$refs.echarts.setOptionBase({
                        title:{
                            text: '52.40°N 13.60°E 38m above sea level',
                            subtext: 'Generated in 0.13ms, downloaded in 623ms, time in GMT+0',
                            left: 'center'
                        },
                        xAxis:time.map(d=>{
                            var date = (new Date(d));
                            return date.getFullYear()+'-'+(date.getUTCMonth()+1) +'-'+date.getUTCDate()+' '+date.getUTCHours()
                        }),
                        yAxis:{
                            type: 'value',
                            name:series[0].format || '',
                            nameLocation : 'center',
                            nameGap :35,
                        },
                        isMultipleYAxis:false,
                        series,
                        // color: colors
                    });
                })
            }).finally(()=>{
                this.isLoading = false;
                this.echartLoading = false;
            });
        },
        initEcharts(){
            this.isLoading = false;
            this.echartLoading = true;
            setTimeout(this.getForecastData , 250);
        },
    }
}
</script>
<style lang="less">
.com-collapse {
    .el-collapse-item__header,.el-collapse-item__content{
        padding-left:20px;
        padding-right:20px;
    }
}
.el-form-item--small.el-form-item{
    margin-bottom: 0;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(3){
    background-color: #50f0e6;
    color: #333;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(4) {
    background-color: #50ccaa;
    color: #fff;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(5) {
    background-color: #f0e641;
    color: #333;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(6) {
    background-color: #ff5050;
    color: #fff;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(7) {
    background-color: #960032;
    color: #fff;
}
.el-collapse .el-collapse-item__content tbody td:nth-child(8) {
    background-color: #7d2181;
    color: #fff;
}
</style>