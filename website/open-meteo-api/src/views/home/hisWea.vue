<template>
    <div>
        <p v-html="describeNote"></p>
        <el-form :label-position="labelPosition" inline size="small" :model="formData">
            <h3>Location and Time</h3>
            <location ref="Coordinates" 
                v-model="formData" 
                @tabChange="handleTabChange('Coordinates',...arguments)"
            ></location>

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
                    <p>You can access past weather data dating back to 1940. However, there is a 5-day delay in the
				data. If you want information for the most recent days, you can use the <a href="/en/docs" title="Weather forecast API">forecast API</a>
				and adjust the <mark>Past Days</mark> setting.</p> 
                <p>Quick:
				<el-button type="primary" size="mini" plain @click="formData = {...formData,start_end_date:['2000-01-01','2009-12-31']};">2000-2010</el-button> 
                <el-button type="primary" size="mini" plain @click="formData = {...formData,start_end_date:['2010-01-01','2021-12-31']};">2010-2022</el-button> 
                <el-button type="primary" size="mini" plain @click="formData = {...formData,start_end_date:['2020-01-01','2020-12-31']};">2020</el-button> 
                <el-button type="primary" size="mini" plain @click="formData = {...formData,start_end_date:['2021-01-01','2021-12-31']};">2021</el-button> 
                <el-button type="primary" size="mini" plain @click="formData = {...formData,start_end_date:['2022-01-01','2022-12-31']};">2022</el-button></p>
                </el-col>
            </el-row>
            <h3>Hourly Weather Variables</h3>
            <el-checkbox-group v-model="formData.hourly">
                <el-row :gutter="20">
                    <template  v-for="(hourlyList,hourlyBIdx) in HourlyWeatherVariablesList" >
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
                        Additional Variables
                        <el-button size="mini" round v-if="hourlyCount(additionalList)[0] > 0">{{hourlyCount(additionalList).join('/')}}</el-button>
                    </template>
                    <template  v-for="hourlyList in additionalList" >
                        <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                            <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                        </template>
                    </template>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        Solar Radiation Variables
                        <el-button size="mini" round v-if="hourlyCount(solarlList)[0] > 0">{{hourlyCount(solarlList).join('/')}}</el-button>
                    </template>
                    <el-row :gutter="20">
                        <template  v-for="(hourlyList,hourlyIdx) in solarlList" >
                            <el-col :span="8" style="margin-bottom: 10px;" :key="hourlyIdx">
                                <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                    <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                                </template>
                            </el-col>
                        </template>
                    </el-row>
                    <small class="text-muted">Note: Solar radiation is averaged over the past hour. Use<mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please specify Tilt and Azimuth below.</small> 
                    <div>
                        <el-form-item label="Panel Tilt (0° horizontal)">
                            <el-input v-model="formData.tilt" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Panel Azimuth (0° S, -90° E, 90° W)">
                            <el-input v-model="formData.azimuth" type="number"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        Reanalysis models
                        <el-button size="mini" round v-if="hourlyCount(modelslList,'models')[0] > 0">{{hourlyCount(modelslList,'models').join('/')}}</el-button>
                    </template>
                    <el-checkbox-group v-model="formData.models">
                        <el-row :gutter="20">
                            <template  v-for="(hourlyList,hourlyIdx) in modelslList" >
                                <el-col :span="8" style="margin-bottom: 10px;" :key="hourlyIdx">
                                    <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                        <div :key="hourlyIdx"><el-checkbox :label="hourly.value"><span v-html="hourly.name"></span></el-checkbox></div>
                                    </template>
                                </el-col>
                            </template>
                        </el-row>
                    </el-checkbox-group>
                    <small class="text-muted">Note: The default <mark>Best Match</mark> combines ERA5 and ERA5-Land seamlessly. The
						CERRA model will also be included in <mark>Best Match</mark> once real-time updates become
						available.</small>
                </el-collapse-item>
            </el-collapse>

            </el-checkbox-group>

            <h3>Daily Weather Variables</h3>
            <el-checkbox-group v-model="formData.daily">
                <el-row :gutter="20">
                    <template  v-for="(hourlyList,hourlyBIdx) in DailyList" >
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
                <el-form-item label="Temperature Unit">
                    <el-select v-model="formData.temperature_unit">
                        <el-option value="celsius" label="Celsius °C"></el-option><el-option value="fahrenheit" label="Fahrenheit °F"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Wind Speed Unit">
                    <el-select v-model="formData.wind_speed_unit">
                        <el-option value="kmh" label="Km/h"></el-option><el-option value="ms" label="m/s"></el-option><el-option value="mph" labvel="Mph"></el-option><el-option value="kn" label="Knots"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Precipitation Unit">
                    <el-select v-model="formData.precipitation_unit">
                        <el-option value="mm" label="Millimeter"></el-option><el-option value="inch" label="Inch"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Timeformat">
                    <el-select v-model="formData.timeformat">
                        <el-option value="iso8601" label="ISO 8601 (e.g. 2022-12-31)"></el-option><el-option value="unixtime" label="Unix timestamp"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <usage-license ref="Commercial" 
            style="margin-top:10px;"
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
            <p>Note: This API call is equivalent to <strong>26.1</strong> calls because of factors like long time intervals, the number of locations, variables, or models involved.</p>
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
            describeNote:`Now, with the addition of the 9-kilometer ECMWF IFS model, the historical weather API provides access to a staggering 90 terabytes of meteorological data! Read the <a href="https://open.substack.com/pub/openmeteo/p/processing-90-tb-historical-weather" target="_blank">blog article</a>.`,
            labelPosition:"top",
            ServerUrl:'https://my-server.tld',
            defaultServerUrl:'${archive-api}/v1/archive',
            formData: {
                latitude: ['52.52'],
                longitude: ['13.41'],
                timezone: ['UTC'],
                start_end_date:['2020-01-01','2020-12-31'],
                tilt:0,
                azimuth:0,
                hourly:['temperature_2m'],
                models:[],
                daily:[],
                temperature_unit:'celsius',
                wind_speed_unit:'kmh',
                precipitation_unit:'mm',
                timeformat:'iso8601',
            },
            echartLoading:false,
            formFields:[],
            httpConfigUrl:null,
            httpData:{},
            HourlyWeatherVariablesList:[[{"value":"temperature_2m","name":"Temperature (2 m)"},{"value":"relative_humidity_2m","name":"Relative Humidity (2 m)"},{"value":"dew_point_2m","name":"Dewpoint (2 m)"},{"value":"apparent_temperature","name":"Apparent Temperature"},{"value":"precipitation","name":"Precipitation (rain + snow)"},{"value":"rain","name":"Rain"},{"value":"snowfall","name":"Snowfall"},{"value":"snow_depth","name":"Snow depth"}],[{"value":"weather_code","name":"Weather code"},{"value":"pressure_msl","name":"Sealevel Pressure"},{"value":"surface_pressure","name":"Surface Pressure"},{"value":"cloud_cover","name":"Cloud cover Total"},{"value":"cloud_cover_low","name":"Cloud cover Low"},{"value":"cloud_cover_mid","name":"Cloud cover Mid"},{"value":"cloud_cover_high","name":"Cloud cover High"},{"value":"et0_fao_evapotranspiration","name":"Reference Evapotranspiration (ET₀)"},{"value":"vapour_pressure_deficit","name":"Vapour Pressure Deficit"}],[{"value":"wind_speed_10m","name":"Wind Speed (10 m)"},{"value":"wind_speed_100m","name":"Wind Speed (100 m)"},{"value":"wind_direction_10m","name":"Wind Direction (10 m)"},{"value":"wind_direction_100m","name":"Wind Direction (100 m)"},{"value":"wind_gusts_10m","name":"Wind Gusts (10 m)"}],[{"value":"soil_temperature_0_to_7cm","name":"Soil Temperature (0-7 cm)"},{"value":"soil_temperature_7_to_28cm","name":"Soil Temperature (7-28 cm)"},{"value":"soil_temperature_28_to_100cm","name":"Soil Temperature (28-100 cm)"},{"value":"soil_temperature_100_to_255cm","name":"Soil Temperature (100-255 cm)"},{"value":"soil_moisture_0_to_7cm","name":"Soil Moisture (0-7 cm)"},{"value":"soil_moisture_7_to_28cm","name":"Soil Moisture (7-28 cm)"},{"value":"soil_moisture_28_to_100cm","name":"Soil Moisture (28-100 cm)"},{"value":"soil_moisture_100_to_255cm","name":"Soil Moisture (100-255 cm)"}]],
            additionalList:[[{"value":"is_day","name":"Is Day or Night"},{"value":"sunshine_duration","name":"Sunshine Duration"}]],
            solarlList:[[{"value":"shortwave_radiation","name":"Shortwave Solar Radiation GHI"},{"value":"direct_radiation","name":"Direct Solar Radiation"},{"value":"diffuse_radiation","name":"Diffuse Solar Radiation DHI"},{"value":"direct_normal_irradiance","name":"Direct Normal Irradiance DNI"},{"value":"global_tilted_irradiance","name":"Global Tilted Radiation GTI"},{"value":"terrestrial_radiation","name":"Terrestrial Solar Radiation"}],[{"value":"shortwave_radiation_instant","name":"Shortwave Solar Radiation GHI (Instant)"},{"value":"direct_radiation_instant","name":"Direct Solar Radiation (Instant)"},{"value":"diffuse_radiation_instant","name":"Diffuse Solar Radiation DHI (Instant)"},{"value":"direct_normal_irradiance_instant","name":"Direct Normal Irradiance DNI (Instant)"},{"value":"global_tilted_irradiance_instant","name":"Global Tilted Radiation GTI"},{"value":"terrestrial_radiation_instant","name":"Terrestrial Solar Radiation (Instant)"}]],
            modelslList:[[{"value":"best_match","name":"Best match&nbsp;<span class=\"text-muted\">(ECMWF IFS &amp; ERA5)</span>"},{"value":"ecmwf_ifs","name":"ECMWF IFS&nbsp;<span class=\"text-muted\">(9 km, Global, 2017 onwards)</span>"}],[{"value":"era5_seamless","name":"ERA5-Seamless&nbsp;<span class=\"text-muted\">(ERA5 &amp; ERA5-Land combined)</span>"},{"value":"era5","name":"ERA5&nbsp;<span class=\"text-muted\">(25 km, Global)</span>"},{"value":"era5_land","name":"ERA5-Land&nbsp;<span class=\"text-muted\">(10 km, Global)</span>"},{"value":"cerra","name":"CERRA&nbsp;<span class=\"text-muted\">(5 km, Europe, 1985 to June 2021)</span>"}]],
            DailyList:[[{"value":"weather_code","name":"Weather code"},{"value":"temperature_2m_max","name":"Maximum Temperature (2 m)"},{"value":"temperature_2m_min","name":"Minimum Temperature (2 m)"},{"value":"temperature_2m_mean","name":"Mean Temperature (2 m)"},{"value":"apparent_temperature_max","name":"Maximum Apparent Temperature (2 m)"},{"value":"apparent_temperature_min","name":"Minimum Apparent Temperature (2 m)"},{"value":"apparent_temperature_mean","name":"Mean Apparent Temperature (2 m)"},{"value":"sunrise","name":"Sunrise"},{"value":"sunset","name":"Sunset"},{"value":"daylight_duration","name":"Daylight Duration"},{"value":"sunshine_duration","name":"Sunshine Duration"}],[{"value":"precipitation_sum","name":"Precipitation Sum"},{"value":"rain_sum","name":"Rain Sum"},{"value":"snowfall_sum","name":"Snowfall Sum"},{"value":"precipitation_hours","name":"Precipitation Hours"},{"value":"wind_speed_10m_max","name":"Maximum Wind Speed (10 m)"},{"value":"wind_gusts_10m_max","name":"Maximum Wind Gusts (10 m)"},{"value":"wind_direction_10m_dominant","name":"Dominant Wind Direction (10 m)"},{"value":"shortwave_radiation_sum","name":"Shortwave Radiation Sum"},{"value":"et0_fao_evapotranspiration","name":"Reference Evapotranspiration (ET₀)"}]],
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
                        legend:false,
                        title:{
                            text: '52.55°N 13.41°E 38m above sea level',
                            subtext: 'Generated in 0.24ms, downloaded in 603ms, time in GMT+0',
                            left: 'center'
                        },
                        xAxis:time.map(d=>{
                            var date = (new Date(d));
                            return date.getFullYear()+'-'+(date.getUTCMonth()+1) +'-'+date.getUTCDate()+' '+date.getUTCHours()
                        }),
                        yAxis:{
                            type: 'value',
                            position : 'right',
                        },
                        isMultipleYAxis:true,
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