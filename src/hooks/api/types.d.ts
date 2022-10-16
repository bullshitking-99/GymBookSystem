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
  isOrderWeekend: boolean;
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
  data: string | object;
}

interface IuseApi {
  loginAuthen: (body: IuserInfo) => Promise<IResponse>;
  addOrderPlan: (body: IorderPlan) => Promise<IResponse>;
  getOrderPlan: (body: "健身房" | "羽毛球") => Promise<IResponse>;
}

interface IUseLocalStorage {
  getLoginToken: () => TOKEN | "";
  setLoginToken: (token: string) => void;
  removeLoginToken: () => void;
}
