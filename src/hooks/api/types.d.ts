type REQUEST_METHODS = "get" | "post";
type TOKEN = string;

interface IuserInfo {
  account: string;
  password: string;
}

interface ILoginResponse {
  message: string;
  code: number;
  data: string;
}

interface IuseApi {
  loginAuthen: (url: string, body: IuserInfo) => Promise<ILoginResponse>;
}

interface IUseLocalStorage {
  getLoginToken: () => TOKEN | "";
  setLoginToken: (token: string) => void;
}
