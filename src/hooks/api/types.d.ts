type REQUEST_METHODS = "get" | "post";
type TOKEN = string;

interface IuserInfo {
  account: string;
  password: string;
}

interface IGymOrder {
  orderType: "健身房";
  isOrder: boolean;
  isAssignDate: boolean;
  orderDate: string;
  beginTime: number;
  endTime: number;
  timeIndex: number;
  enhanceMode: boolean;
}

interface IBadmintonOrder {
  orderType: "羽毛球";
  isOrder: boolean;
  isAssignDate: boolean;
  orderDate: string;
  beginTime: number;
  endTime: number;
  prioritySites: number[];
  priorityDuration: number;
  isOrderWeekend: boolean;
}

interface IResponse {
  message: string;
  code: number;
  data: string;
}

interface IuseApi {
  loginAuthen: (url: string, body: IuserInfo) => Promise<IResponse>;
  addOrderPlan: (url: string, body: IorderPlan) => Promise<IResponse>;
}

interface IUseLocalStorage {
  getLoginToken: () => TOKEN | "";
  setLoginToken: (token: string) => void;
  removeLoginToken: () => void;
}
