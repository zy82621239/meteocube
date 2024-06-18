<template>
   <div class="col-12 py-5">
  <h2 id="data-sources">Data Source</h2>
  <p>
    This API uses global NOAA GFS weather forecast and combines them with
    high-resolution HRRR forecasts. HRRR is a rapid-refresh model and updates
    every hour. High-resolution data are only available for the United States.
    For other locations, only GFS is used. For GFS, values are interpolated from
    3-hourly to 1-hourly after 120 hours.
  </p>
  <div class="table-responsive">
	<el-table :data="dataSources" style="width: 100%">
      <el-table-column prop="WeatherModel" label="Weather Model" width="180">
		<template slot-scope="scope">
			<a :href="scope.row.url" target="_blank">{{scope.row.WeatherModel}}</a>
		</template>
	  </el-table-column>
      <el-table-column prop="NationalWeatherProvider" label="National Weather Provider"></el-table-column>
      <el-table-column prop="OriginCountry" label="Origin Country"></el-table-column>
      <el-table-column prop="Resolution" label="Resolution"></el-table-column>
      <el-table-column prop="ForecastLength" label="Forecast Length"></el-table-column>
      <el-table-column prop="Updatefrequency" label="Update frequency" minWidth="180"></el-table-column>
    </el-table>
  </div>
  <h2 id="api-documentation" class="mt-5">API Documentation</h2>
  <p>
    The API endpoint <mark>/v1/gfs</mark> accepts a geographical coordinate, a
    list of weather variables and responds with a JSON hourly weather forecast
    for 7 days. Time always starts at 0:00 today and contains 168 hours. If
    <mark>&amp;forecast_days=16</mark> is set, up to 16 days of forecast can be
    returned. All URL parameters are listed below:
  </p>
  <div class="table-responsive">
	<el-table :data="ApiDocData" style="width: 100%">
      <el-table-column prop="Parameter" label="Parameter" width="180">
		<template slot-scope="scope">
			<div v-html="scope.row.Parameter"></div>
		</template>
	  </el-table-column>
      <el-table-column prop="Format" label="Format"></el-table-column>
      <el-table-column prop="Required" label="Required"></el-table-column>
      <el-table-column prop="Default" label="Default">
		<template slot-scope="scope">
			<div v-html="scope.row.Default"></div>
		</template>
	  </el-table-column>
      <el-table-column prop="Description" label="Description" minWidth="180">
		<template slot-scope="scope">
			<div v-html="scope.row.Description"></div>
		</template>
	  </el-table-column>
    </el-table>
  </div>
</div>
</template>
<script>
export default {
    data(){
		return {
			dataSources:  [{"url":"/en/docs/dwd-api","WeatherModel":"ICON","NationalWeatherProvider":"Deutscher Wetterdienst (DWD)","OriginCountry":"Germany","Resolution":"2 - 11 km","ForecastLength":"7.5 days","Updatefrequency":"Every 3 hours"},{"url":"/en/docs/gfs-api","WeatherModel":"GFS & HRRR","NationalWeatherProvider":"NOAA","OriginCountry":"United States","Resolution":"3 - 25 km","ForecastLength":"16 days","Updatefrequency":"Every hour"},{"url":"/en/docs/meteofrance-api","WeatherModel":"ARPEGE & AROME","NationalWeatherProvider":"Météo-France","OriginCountry":"France","Resolution":"1 - 25 km","ForecastLength":"4 days","Updatefrequency":"Every hour"},{"url":"/en/docs/ecmwf-api","WeatherModel":"IFS & AIFS","NationalWeatherProvider":"ECMWF","OriginCountry":"European Union","Resolution":"25 km","ForecastLength":"7 days","Updatefrequency":"Every 6 hours"},{"url":"/en/docs/jma-api","WeatherModel":"MSM & GSM","NationalWeatherProvider":"JMA","OriginCountry":"Japan","Resolution":"5 - 55 km","ForecastLength":"11 days","Updatefrequency":"Every 3 hours"},{"url":"/en/docs/metno-api","WeatherModel":"MET Nordic","NationalWeatherProvider":"MET Norway","OriginCountry":"Norway","Resolution":"1 km","ForecastLength":"2.5 days","Updatefrequency":"Every hour"},{"url":"/en/docs/gem-api","WeatherModel":"GEM","NationalWeatherProvider":"Canadian Weather Service","OriginCountry":"Canada","Resolution":"2.5 km","ForecastLength":"10 days","Updatefrequency":"Every 6 hours"},{"url":"/en/docs/cma-api","WeatherModel":"GFS GRAPES","NationalWeatherProvider":"China Meteorological Administration (CMA)","OriginCountry":"China","Resolution":"15 km","ForecastLength":"10 days","Updatefrequency":"Every 6 hours"},{"url":"/en/docs/bom-api","WeatherModel":"ACCESS-G","NationalWeatherProvider":"Australian Bureau of Meteorology (BOM)","OriginCountry":"Australia","Resolution":"15 km","ForecastLength":"10 days","Updatefrequency":"Every 6 hours"},{"WeatherModel":"COSMO 2I &amp; 5M","NationalWeatherProvider":"AM ARPAE ARPAP","OriginCountry":"Italy","Resolution":"2 km","ForecastLength":"3 days","Updatefrequency":"Every 3 hours"}],
			ApiDocData:[{"Parameter":"latitude, longitude","Format":"Floating point","Required":"Yes","Default":"","Description":" Geographical WGS84 coordinates of the location. Multiple coordinates can be comma separated. E.g. <mark>&amp;latitude=52.52,48.85&amp;longitude=13.41,2.35</mark>. To return data for multiple locations the JSON output changes to a list of structures. CSV and XLSX formats add a column <mark>location_id</mark>. "},{"Parameter":"elevation","Format":"Floating point","Required":"No","Default":"","Description":" The elevation used for statistical downscaling. Per default, a <a href=\"https://openmeteo.substack.com/p/improving-weather-forecasts-with\" title=\"Elevation based grid-cell selection explained\">90 meter digital elevation model is used</a>. You can manually set the elevation to correctly match mountain peaks. If <mark>&amp;elevation=nan</mark> is specified, downscaling will be disabled and the API uses the average grid-cell height. "},{"Parameter":"hourly","Format":"String array","Required":"No","Default":"","Description":" A list of weather variables which should be returned. Values can be comma separated, or multiple <mark>&amp;hourly=</mark> parameter in the URL can be used. "},{"Parameter":"daily","Format":"String array","Required":"No","Default":"","Description":" A list of daily weather variable aggregations which should be returned. Values can be comma separated, or multiple <mark>&amp;daily=</mark> parameter in the URL can be used. If daily weather variables are specified, parameter <mark>timezone</mark> is required. "},{"Parameter":"current","Format":"String array","Required":"No","Default":"","Description":"A list of weather variables to get current conditions."},{"Parameter":"temperature_unit","Format":"String","Required":"No","Default":"<mark>celsius</mark>","Description":" If <mark>fahrenheit</mark> is set, all temperature values are converted to Fahrenheit. "},{"Parameter":"wind_speed_unit","Format":"String","Required":"No","Default":"<mark>kmh</mark>","Description":" Other wind speed speed units: <mark>ms</mark>, <mark>mph</mark> and <mark>kn</mark>"},{"Parameter":"precipitation_unit","Format":"String","Required":"No","Default":"<mark>mm</mark>","Description":"Other precipitation amount units: <mark>inch</mark>"},{"Parameter":"timeformat","Format":"String","Required":"No","Default":"<mark>iso8601</mark>","Description":" If format <mark>unixtime</mark> is selected, all time values are returned in UNIX epoch time in seconds. Please note that all timestamp are in GMT+0! For daily values with unix timestamps, please apply <mark>utc_offset_seconds</mark> again to get the correct date. "},{"Parameter":"timezone","Format":"String","Required":"No","Default":"<mark>GMT</mark>","Description":" If <mark>timezone</mark> is set, all timestamps are returned as local-time and data is returned starting at 00:00 local-time. Any time zone name from the <a href=\"https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\" target=\"_blank\">time zone database</a> is supported. If <mark>auto</mark> is set as a time zone, the coordinates will be automatically resolved to the local time zone. For multiple coordinates, a comma separated list of timezones can be specified. "},{"Parameter":"past_days","Format":"Integer","Required":"No","Default":"<mark>0</mark>","Description":" If <mark>past_days</mark> is set, past weather data can be returned. "},{"Parameter":"forecast_days","Format":"Integer (0-16)","Required":"No","Default":"<mark>7</mark>","Description":" Per default, only 7 days are returned. Up to 16 days of forecast are possible. "},{"Parameter":" forecast_hours<br>forecast_minutely_15<br>past_hours<br>past_minutely_15 ","Format":"Integer (&gt;0)","Required":"No","Default":"","Description":" Similar to forecast_days, the number of timesteps of hourly and 15-minutely data can controlled. Instead of using the current day as a reference, the current hour or the current 15-minute time-step is used. "},{"Parameter":"start_date<br>end_date","Format":"String (yyyy-mm-dd)","Required":"No","Default":"","Description":" The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. <mark>2022-06-30</mark>). "},{"Parameter":" start_hour<br>end_hour<br>start_minutely_15<br>end_minutely_15 ","Format":"String (yyyy-mm-ddThh:mm)","Required":"No","Default":"","Description":" The time interval to get weather data for hourly or 15 minutely data. Time must be specified as an ISO8601 date (e.g. <mark>2022-06-30T12:00</mark>). "},{"Parameter":"cell_selection","Format":"String","Required":"No","Default":"<mark>land</mark>","Description":" Set a preference how grid-cells are selected. The default <mark>land</mark> finds a suitable grid-cell on land with <a href=\"https://openmeteo.substack.com/p/improving-weather-forecasts-with\" title=\"Elevation based grid-cell selection explained\">similar elevation to the requested coordinates using a 90-meter digital elevation model</a>. <mark>sea</mark> prefers grid-cells on sea. <mark>nearest</mark> selects the nearest possible grid-cell. "},{"Parameter":"apikey","Format":"String","Required":"No","Default":"","Description":" Only required to commercial use to access reserved API resources for customers. The server URL requires the prefix <mark>customer-</mark>. See <a href=\"/en/pricing\" title=\"Pricing information to use the weather API commercially\">pricing</a> for more information. "}]
		}
	},
	mounted(){
		this.initTableData('#data-sources-table');
	},
	methods:{
		initTableData(table){
			var data = [] , headers = [] , el = this.$(table);
			el.find('tr').each((ti , te)=>{
				var obj = {};
				this.$(te).find('th,td').each((i , e)=>{
					if(ti === 0){
						headers.push(e.innerText.replace(/\s*/g,''));
					}else{
						let ael = this.$(e).find('a');
						if(ael.length >= 1 && e.innerText === ael.text()){
							obj.url = ael.attr('href');
							obj[headers[i]] = e.innerText;
						}else{
							obj[headers[i]] = e.innerHTML;
						}
					}
				})
				if(ti > 0)data.push(obj);
			})
			console.log(table , JSON.stringify(data) , headers);
		}
	},
}
</script>