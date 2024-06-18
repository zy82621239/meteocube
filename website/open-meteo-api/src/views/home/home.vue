<template>
    <div>
        <p v-html="describeNote"></p>
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
                                        <el-option value="7" label="7 days (default)"></el-option>
                                        <el-option value="14" label="14 days"></el-option>
                                        <el-option value="16" label="16 days"></el-option>
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
            
            <h3>Hourly Weather Variables</h3>
            <el-checkbox-group v-model="formData.hourly">
                <el-row :gutter="20">
                    <template  v-for="(hourlyList,hourlyBIdx) in hourlyBaseList" >
                        <el-col :span="6" :key="hourlyBIdx">
                            <template  v-for="(hourly,hourlyIdx) in hourlyList" >
                                <div :key="hourlyIdx"><el-checkbox :label="hourly.value">{{hourly.name}}</el-checkbox></div>
                            </template>
                        </el-col>
                    </template>
                </el-row>
                <el-collapse style="margin-top:20px;border: 1px solid #EBEEF5" class="com-collapse">
                    <el-collapse-item name="1">
                        <template slot="title">
                            Additional Variables And Options
                            <el-button size="mini" round v-if="hourlyCount(hourlyAddList)[0] > 0">{{hourlyCount(hourlyAddList).join('/')}}</el-button>
                        </template>
                        <div>
                            <template  v-for="(hourly,hourlyIdx) in hourlyAddList" >
                                <div :key="hourlyIdx" style="width:50%;display: inline-block"><el-checkbox :label="hourly.value">{{hourly.name}}</el-checkbox></div>
                            </template>
                        </div>
                        <p>Note: You can further adjust the forecast time range for hourly weather variables using <mark>&forecast_hours=</mark> and <mark>&past_hours=</mark> as shown below.</p>
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
                    <el-collapse-item name="2">
                        <template slot="title">
                            Solar Radiation Variables
                            <el-button size="mini" round v-if="hourlyCount(hourlySolarList)[0] > 0">{{hourlyCount(hourlySolarList).join('/')}}</el-button>
                        </template>
                        <div>
                            <template  v-for="(hourly,hourlyIdx) in hourlySolarList" >
                                <div :key="hourlyIdx" style="width:50%;display: inline-block"><el-checkbox :label="hourly.value">{{hourly.name}}</el-checkbox></div>
                            </template>
                        </div>
                        <p>Note: Solar radiation is averaged over the past hour. Use <mark>instant</mark> for radiation at the indicated time. For global tilted irradiance GTI please specify Tilt and Azimuth below.</p>
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
                            Pressure Level Variables<el-button size="mini" round v-if="pressureValues.length">{{pressureValues.length}}/{{hourlyPressureList.length * pressureList.length}}</el-button>
                        </template>
                        <com-tabs tab-position="left" :tab-list="pressureList" style="box-shadow: none;border: none;">
                            <template slot-scope="{name}">
                                <template  v-for="(hourly,hourlyIdx) in hourlyPressureList" >
                                    <div :key="hourlyIdx" style="width:50%;display: inline-block"><el-checkbox :label="name+'_'+hourly.value">{{hourly.name}}</el-checkbox></div>
                                </template>
                                <p>Note: Altitudes are approximate and in meters <strong>above sea level</strong> (not above ground). Use <mark>geopotential_height</mark> to get precise altitudes above sea level.</p>
                            </template>
                        </com-tabs>
                    </el-collapse-item>
                    <el-collapse-item title="Weather models" name="4">
                        <el-checkbox-group v-model="formData.models">
                            <el-row :gutter="20">
                                <template  v-for="(modelsList,modelsBIdx) in modelsList" >
                                    <el-col :span="8" style="margin-bottom: 10px;" :key="modelsBIdx">
                                        <template  v-for="(models,modelsIdx) in modelsList" >
                                            <div :key="modelsIdx"><el-checkbox :label="models.value">{{models.name}}</el-checkbox></div>
                                        </template>
                                    </el-col>
                                </template>
                            </el-row>
                        </el-checkbox-group>
                        <p>Note: The default <mark>Best Match</mark> provides the best forecast for any given location worldwide. <mark>Seamless</mark> combines all models from a given provider into a seamless prediction.</p>
                    </el-collapse-item>
                    <el-collapse-item title="15-Minutely Weather Variables" name="5">
                        <p>Note: Only available in Central Europe and North America. Other regions use interpolated hourly data. Solar radiation is averaged over the 15 minutes. Use <mark>instant</mark> for radiation at the indicated time.</p>
                        <p>Note: You can further adjust the forecast time range for 15-minutely weather variables using <mark>&forecast_minutely_15=</mark> and <mark>&past_minutely_15=</mark> as shown below.</p>
                        <div>
                            <el-form-item label="Forecast Minutely 15">
                                <el-select v-model="formData.forecast_minutely_15" aria-label="Forecast days">
                                    <el-option value="" label="- (default)"></el-option>
                                    <el-option value="1" label="1 hour"></el-option>
                                    <el-option value="6" label="6 hours"></el-option>
                                    <el-option value="12" label="12 hours"></el-option>
                                    <el-option value="24" label="24 hours"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Past Minutely 15">
                                <el-select v-model="formData.past_minutely_15" aria-label="Forecast days">
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
            <h3>Daily Weather Variables</h3>
            <el-checkbox-group v-model="formData.daily">
                <el-row :gutter="20">
                    <template  v-for="(modelsList,modelsBIdx) in DailyWeatherList" >
                        <el-col :span="8" style="margin-bottom: 10px;" :key="modelsBIdx">
                            <template  v-for="(models,modelsIdx) in modelsList" >
                                <div :key="modelsIdx"><el-checkbox :label="models.value">{{models.name}}</el-checkbox></div>
                            </template>
                        </el-col>
                    </template>
                </el-row>
            </el-checkbox-group>
            <h3>Current Weather</h3>
            <el-checkbox-group v-model="formData.current">
                <el-row :gutter="20">
                    <template  v-for="(modelsList,modelsBIdx) in WeatherList" >
                        <el-col :span="6" style="margin-bottom: 10px;" :key="modelsBIdx">
                            <template  v-for="(models,modelsIdx) in modelsList" >
                                <div :key="modelsIdx"><el-checkbox :label="models.value">{{models.name}}</el-checkbox></div>
                            </template>
                        </el-col>
                    </template>
                </el-row>
            </el-checkbox-group>
            <div>
                <p>Note: Current conditions are based on 15-minutely weather model data. Every weather variable available in hourly data, is available as current condition as well.</p>
            </div>
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
            describeNote:'',
            labelPosition:"top",
            ServerUrl:'https://my-server.tld',
            defaultServerUrl:'${api}/v1/forecast',
            formData: {
                latitude: ['52.52'],
                longitude: ['13.45'],
                timezone: ['America/Sao_Paulo'],
                forecast_days:'7',
                past_days:'0',
                hourly:['temperature_2m','relative_humidity_2m'],
                forecast_hours:'',
                past_hours:'',
                tilt:0,
                azimuth:0,
                forecast_minutely_15:'',
                past_minutely_15:'',
                apikey:'',
                models:[],
                daily:[],
                current:[],
                temperature_unit:'celsius',
                wind_speed_unit:'kmh',
                precipitation_unit:'mm',
                timeformat:"iso8601"
            },
            hourlyBaseList:[ 
                [
                    {value:"temperature_2m",name:"Temperature (2 m)"},
                    {value:"relative_humidity_2m",name:"Relative Humidity (2 m)"},
                    {value:"dew_point_2m",name:"Dewpoint (2 m)"},
                    {value:"apparent_temperature",name:"Apparent Temperature"},
                    {value:"precipitation_probability",name:"Precipitation Probability"},
                    {value:"precipitation",name:"Precipitation (rain + showers + snow)"},
                    {value:"rain",name:"Rain"},
                    {value:"showers",name:"Showers"},
                    {value:"snowfall",name:"Snowfall"},
                    {value:"snow_depth",name:"Snow Depth"},
                ],
                [
                    {value:"weather_code",name:"Weather code"},
                    {value:"pressure_msl",name:"Sealevel Pressure"},
                    {value:"surface_pressure",name:"Surface Pressure"},
                    {value:"cloud_cover",name:"Cloud cover Total"},
                    {value:"cloud_cover_low",name:"Cloud cover Low"},
                    {value:"cloud_cover_mid",name:"Cloud cover Mid"},
                    {value:"cloud_cover_high",name:"Cloud cover High"},
                    {value:"visibility",name:"Visibility"},
                    {value:"evapotranspiration",name:"Evapotranspiration"},
                    {value:"et0_fao_evapotranspiration",name:"Reference Evapotranspiration (ET₀)"},
                    {value:"vapour_pressure_deficit",name:"Vapour Pressure Deficit"},
                ],
                [
                    {value:"wind_speed_10m",name:"Wind Speed (10 m)"},
                    {value:"wind_speed_80m",name:"Wind Speed (80 m)"},
                    {value:"wind_speed_120m",name:"Wind Speed (120 m)"},
                    {value:"wind_speed_180m",name:"Wind Speed (180 m)"},
                    {value:"wind_direction_10m",name:"Wind Direction (10 m)"},
                    {value:"wind_direction_80m",name:"Wind Direction (80 m)"},
                    {value:"wind_direction_120m",name:"Wind Direction (120 m)"},
                    {value:"wind_direction_180m",name:"Wind Direction (180 m)"},
                    {value:"wind_gusts_10m",name:"Wind Gusts (10 m)"},
                    {value:"temperature_80m",name:"Temperature (80 m)"},
                    {value:"temperature_120m",name:"Temperature (120 m)"},
                    {value:"temperature_180m",name:"Temperature (180 m)"},
                ],
                [
                    {value:"soil_temperature_0cm",name:"Soil Temperature (0 cm)"},
                    {value:"soil_temperature_6cm",name:"Soil Temperature (6 cm)"},
                    {value:"soil_temperature_18cm",name:"Soil Temperature (18 cm)"},
                    {value:"soil_temperature_54cm",name:"Soil Temperature (54 cm)"},
                    {value:"soil_moisture_0_to_1cm",name:"Soil Moisture (0-1 cm)"},
                    {value:"soil_moisture_1_to_3cm",name:"Soil Moisture (1-3 cm)"},
                    {value:"soil_moisture_3_to_9cm",name:"Soil Moisture (3-9 cm)"},
                    {value:"soil_moisture_9_to_27cm",name:"Soil Moisture (9-27 cm)"},
                    {value:"soil_moisture_27_to_81cm",name:"Soil Moisture (27-81 cm)"},
                ]
            ],
            hourlyAddList:[
                {value:"uv_index",name:"UV Index"},
                {value:"uv_index_clear_sky",name:"UV Index Clear Sky"},
                {value:"is_day",name:"Is Day or Night"},
                {value:"cape",name:"CAPE"},
                {value:"freezing_level_height",name:"Freezing Level Height"},
                {value:"sunshine_duration",name:"Sunshine Duration"},
            ],
            hourlySolarList:[
                {value:"shortwave_radiation",name:"Shortwave Solar Radiation GHI"},
                {value:"direct_radiation",name:"Direct Solar Radiation"},
                {value:"diffuse_radiation",name:"Diffuse Solar Radiation DHI"},
                {value:"direct_normal_irradiance",name:"Direct Normal Irradiance DNI"},
                {value:"global_tilted_irradiance",name:"Global Tilted Radiation GTI"},
                {value:"terrestrial_radiation",name:"Terrestrial Solar Radiation"},
                {value:"shortwave_radiation_instant",name:"Shortwave Solar Radiation GHI (Instant)"},
                {value:"direct_radiation_instant",name:"Direct Solar Radiation (Instant)"},
                {value:"diffuse_radiation_instant",name:"Diffuse Solar Radiation DHI (Instant)"},
                {value:"direct_normal_irradiance_instant",name:"Direct Normal Irradiance DNI (Instant)"},
                {value:"global_tilted_irradiance_instant",name:"Global Tilted Radiation GTI"},
                {value:"terrestrial_radiation_instant",name:"Terrestrial Solar Radiation (Instant)"},
            ],
            pressureList:[
                {label:'Temperature',name:'temperature'},
                {label:'Relative Humidity',name:'relative_humidity'},
                {label:'Cloud cover',name:'cloud_cover'},
                {label:'Wind Speed',name:'windspeed'},
                {label:'Wind Direction',name:'winddirection'},
                {label:'Geopotential Height',name:'geopotential_height'},
            ],
            hourlyPressureList:[
                {name:"1000 hPa (110 m)" , value:"1000hPa"},
                {name:"975 hPa (320 m)" , value:"975hPa"},
                {name:"950 hPa (500 m)" , value:"950hPa"},
                {name:"925 hPa (800 m)" , value:"925hPa"},
                {name:"900 hPa (1000 m)" , value:"900hPa"},
                {name:"850 hPa (1500 m)" , value:"850hPa"},
                {name:"800 hPa (1900 m)" , value:"800hPa"},
                {name:"700 hPa (3 km)" , value:"700hPa"},
                {name:"600 hPa (4.2 km)" , value:"600hPa"},
                {name:"500 hPa (5.6 km)" , value:"500hPa"},
                {name:"400 hPa (7.2 km)" , value:"400hPa"},
                {name:"300 hPa (9.2 km)" , value:"300hPa"},
                {name:"250 hPa (10.4 km)" , value:"250hPa"},
                {name:"200 hPa (11.8 km)" , value:"200hPa"},
                {name:"150 hPa (13.5 km)" , value:"150hPa"},
                {name:"100 hPa (15.8 km)" , value:"100hPa"},
                {name:"70 hPa (17.7 km)" , value:"70hPa"},
                {name:"50 hPa (19.3 km)" , value:"50hPa"},
                {name:"30 hPa (22 km)" , value:"30hPa"},
            ],
            modelsList:[
                [
                    {name:'Best match',value:'best_match'},   
                    {name:'ECMWF IFS 0.4°',value:'ecmwf_ifs04'},   
                    {name:'ECMWF IFS 0.25°',value:'ecmwf_ifs025'},   
                    {name:'ECMWF AIFS 0.25°',value:'ecmwf_aifs025'},   
                    {name:'CMA GRAPES Global',value:'cma_grapes_global'},   
                    {name:'BOM ACCESS Global',value:'bom_access_global'},   
                    {name:'MET Norway Nordic',value:'metno_nordic'},   
                ],
                [
                    {name:'GFS Seamless',value:''},   
                    {name:'GFS Global',value:''},   
                    {name:'GFS HRRR',value:''},   
                    {name:'GFS GraphCast',value:''},   
                ],
                [
                    {name:'JMA Seamless',value:''},   
                    {name:'JMA MSM',value:''},   
                    {name:'JMA GSM',value:''},   
                ],
                [
                    {name:'DWD ICON Seamless',value:''},   
                    {name:'DWD ICON Global',value:''},   
                    {name:'DWD ICON EU',value:''},   
                    {name:'DWD ICON D2',value:''},   
                ],
                [
                    {name:'GEM Seamless',value:''},   
                    {name:'GEM Global',value:''},   
                    {name:'GEM Regional',value:''},   
                    {name:'GEM HRDPS Continental',value:''},   
                ],
                [
                    {name:'Météo-France Seamless',value:''},   
                    {name:'Météo-France ARPEGE World',value:''},   
                    {name:'Météo-France ARPEGE Europe',value:''},   
                    {name:'Météo-France AROME France',value:''},  
                    {name:'Météo-France AROME France HD',value:''},   
                ],
                [
                    {name:'ARPAE Seamless',value:''},   
                    {name:'ARPAE COSMO 2I',value:''},   
                    {name:'ARPAE COSMO 2I RUC',value:''},   
                    {name:'ARPAE COSMO 5M',value:''},  
                ]
            ],
            DailyWeatherList:[[{"value":"weather_code","name":"Weather code"},{"value":"temperature_2m_max","name":"Maximum Temperature (2 m)"},{"value":"temperature_2m_min","name":"Minimum Temperature (2 m)"},{"value":"apparent_temperature_max","name":"Maximum Apparent Temperature (2 m)"},{"value":"apparent_temperature_min","name":"Minimum Apparent Temperature (2 m)"},{"value":"sunrise","name":"Sunrise"},{"value":"sunset","name":"Sunset"},{"value":"daylight_duration","name":"Daylight Duration"},{"value":"sunshine_duration","name":"Sunshine Duration"},{"value":"uv_index_max","name":"UV Index"},{"value":"uv_index_clear_sky_max","name":"UV Index Clear Sky"}],[{"value":"precipitation_sum","name":"Precipitation Sum"},{"value":"rain_sum","name":"Rain Sum"},{"value":"showers_sum","name":"Showers Sum"},{"value":"snowfall_sum","name":"Snowfall Sum"},{"value":"precipitation_hours","name":"Precipitation Hours"},{"value":"precipitation_probability_max","name":"Precipitation Probability Max"},{"value":"wind_speed_10m_max","name":"Maximum Wind Speed (10 m)"},{"value":"wind_gusts_10m_max","name":"Maximum Wind Gusts (10 m)"},{"value":"wind_direction_10m_dominant","name":"Dominant Wind Direction (10 m)"},{"value":"shortwave_radiation_sum","name":"Shortwave Radiation Sum"},{"value":"et0_fao_evapotranspiration","name":"Reference Evapotranspiration (ET₀)"}]],
            WeatherList:[[{"value":"temperature_2m","name":"Temperature (2 m)"},{"value":"relative_humidity_2m","name":"Relative Humidity (2 m)"},{"value":"apparent_temperature","name":"Apparent Temperature"},{"value":"is_day","name":"Is Day or Night"}],[{"value":"precipitation","name":"Precipitation"},{"value":"rain","name":"Rain"},{"value":"showers","name":"Showers"},{"value":"snowfall","name":"Snowfall"}],[{"value":"weather_code","name":"Weather code"},{"value":"cloud_cover","name":"Cloud cover Total"},{"value":"pressure_msl","name":"Sealevel Pressure"},{"value":"surface_pressure","name":"Surface Pressure"}],[{"value":"wind_speed_10m","name":"Wind Speed (10 m)"},{"value":"wind_direction_10m","name":"Wind Direction (10 m)"},{"value":"wind_gusts_10m","name":"Wind Gusts (10 m)"}]],
            echartLoading:false,
            httpData:{},
        }
    },
    computed:{
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
        $route(){
            this.handleRouterChange();
        },
    },
    mounted(){
        this.handleRouterChange();
    },
    methods:{
        handleRouterChange(){
            let {type} = this.$route.params;
            let openMeteoDefaultData = this.$config.openMeteoDefaultData;
            this.formData = {...this.formData,...(openMeteoDefaultData[type] || {}).formData};
            this.describeNote = (openMeteoDefaultData[type] || {}).note
            this.getForecastData();
        },
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
                    title :'open-meteo'+' '+data.latitude+'°N'+' '+data.longitude.toFixed(2)+'°E'+' '+data.elevation+'m'+' ',
                    subtext : 'Generated in '+data.generationtime_ms.toFixed(2)+'ms, downloaded in '+(data.generationtime_ms*612/0.8).toFixed(2)+'ms, time in '+data.timezone_abbreviation,
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
                            text: this.httpData.title  + 'above sea level',
                            subtext: this.httpData.subtext,
                            left: 'center'
                        },
                        xAxis:time.map(d=>{
                            var date = (new Date(d));
                            return date.getFullYear()+'-'+(date.getUTCMonth()+1) +'-'+date.getUTCDate()+' '+date.getUTCHours()
                        }),
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
</style>