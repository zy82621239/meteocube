var baseUrl = 'https://api.open-meteo.com/';
// if(process.env.NODE_ENV === 'production'){
// 	baseUrl = location.origin+'/';
// }

module.exports = {
    baseUrl,
    axiosServer:{
        '${api}': {
            target: 'https://api.open-meteo.com/',
        },
        '${archive-api}': {
            target: 'https://archive-api.open-meteo.com/',
        },
        '${air-quality-api}': {
            target: 'https://air-quality-api.open-meteo.com/',
        },
    },
    openMeteoConfig:{
        timezone:[
            "America/Anchorage",
            "America/Los_Angeles",
            "America/Denver",
            "America/Chicago",
            "America/New_York",
            "America/Sao_Paulo",
            {value:"UTC",name:"Not set (GMT+0)"},
            {value:"GMT",name:"GMT+0"},
            {value:"auto",name:"Automatically detect time zone"},
            "Europe/London",
            "Europe/Berlin",
            "Europe/Moscow",
            "Africa/Cairo",
            "Asia/Bangkok",
            "Asia/Singapore",
            "Asia/Tokyo",
            "Australia/Sydney",
            "Pacific/Auckland"
        ]
    },
    openMeteoDefaultData:{
        dwd:{
            note:`This API offers access to the renowned ICON weather models from the German Weather service DWD,
            delivering 15-minutely data for short-term forecasts in central Europe and 11 km resolution global
            forecasts. The ICON model is a preferred choice in <a href="/en/docs">generic weather forecast API</a> if no other high resolution weather models are available.`,
            formData:{
                latitude: '52.52',
                longitude: '13.41',
                timezone: 'UTC',
            },
        },
        gfs:{
            note:`<div class="alert alert-primary" role="alert">By combining the reliable NOAA GFS weather model with the rapid updating HRRR weather model, this
            API provides unrivaled forecasts for the US region. For a global forecast, the <a href="/en/docs">Weather Forecast API</a> selects the most suitable weather models automatically to ensure optimal accuracy.</div>`,
            formData:{
                latitude: '52.52',
                longitude: '13.41',
                timezone: 'UTC',
            },
        }
    }
}