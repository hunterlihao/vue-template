export interface LoginForm {
  username: string;
  password: string;
}

interface dataType {
  token?: string;
  message?: string;
}

export interface LoginResponseData {
  code: number;
  data: dataType;
}

interface User {
  checkUser: UserInfo;
}

interface UserInfo {
  userid: string;
  avatar: string;
  username: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token: string;
}

export interface UserInfoResponseData {
  code: number;
  data: User;
}
