import Axios from "axios";
import { PROJECT_URL } from "./path";
import { Notification } from "element-ui";

const instance = Axios.create({ timeout: 10000, baseURL: PROJECT_URL });

instance.interceptors.response.use(
  response => response,
  err => Notification.error({ title: "错误", message: err.response.data?.message }),
);

//用户登录
export const postUserLogin = data => instance.post("/user/user/userLogin", data);
//用户注册
export const postRegisterUser = data => instance.post("/user/user/registerUser", data);
