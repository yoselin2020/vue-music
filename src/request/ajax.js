import axios from "axios";
import { Toast } from "vant";
const http = axios.create({
  baseURL: "http://localhost:3000",
});
// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    return config;
  },
  function (error) {
    Toast.clear();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对响应成功的数据做点什么
    Toast.clear();
    return response;
  },
  function (error) {
    Toast.clear();
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;
