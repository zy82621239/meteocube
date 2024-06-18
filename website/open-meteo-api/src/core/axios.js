import comConfig from './config'
import util from './util'
import axios from 'axios'

// 创建axios实例
const service = axios.create({
    // validateStatus(status) {
    //   return status >= 200 && status < 504 // 设置默认的合法的状态
    // },
    baseURL: process.env.NODE_ENV === 'development' ? null : comConfig.baseUrl, // api 的 base_url
    timeout: 15000 // 请求超时时间
  })
service.defaults.retry = 3 // 请求重试次数
service.defaults.retryDelay = 1000 // 请求重试时间间隔
service.defaults.shouldRetry = true // 是否重试
service.defaults.withCredentials = true // 表示跨域请求时是否需要使用凭证

// http request 拦截器
// 在ajax发送之前拦截 比如对所有请求统一添加header token
service.interceptors.request.use(
  config => {
    config.url = util.variableConvert(config.url , comConfig.axiosServer , (name , val)=>{
      var baseUrl = val.target;
      return process.env.NODE_ENV === 'production' ? (baseUrl.lastIndexOf('/') === baseUrl.length - 1 ? baseUrl.substr(0,baseUrl.length-1) : baseUrl) : '/'+name;
    })
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
// ajax请求回调之前拦截 对请求返回的信息做统一处理 比如error为401无权限则跳转到登陆界面
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service