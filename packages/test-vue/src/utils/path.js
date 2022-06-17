export const PROJECT_HOST =
  process.env.NODE_ENV === "production"
    ? "https://uaoie.top" //生产项目地址
    : "http://localhost:8080"; //开发项目地址
export const PROJECT_URI = "/postCode"; //项目名称
export const PROJECT_URL = PROJECT_HOST + PROJECT_URI; //api地址
export const CHAT_MIN_SERVICE = "/chat"; //聊天微服务
export const USER_MIN_SERVICE = "/user"; //用户微服务
