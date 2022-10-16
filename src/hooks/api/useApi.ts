// const baseUrl = "http://127.0.0.1:8080/";
const baseUrl = "http://shaowei.tech:8080/";

/* 返回api相关hooks */
function useApi(): IuseApi {
  /**
   * 登录页请求用户验证
   * method为post
   */
  async function loginAuthen(body: IuserInfo): Promise<IResponse> {
    // 发送登录验证请求
    let response = await fetch(baseUrl + "api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyTransform<IuserInfo>(body),
    });

    let res: IResponse = await response.json();

    const { setLoginToken } = useLocalStorage();
    if (res.code === 2000) setLoginToken(res.data as string);

    return { message: res.message, code: res.code, data: res.data };
  }

  /**
   * 表单页发送预约请求
   */
  async function addOrderPlan(
    body: IGymOrder | IBadmintonOrder
  ): Promise<IResponse> {
    const { getLoginToken } = useLocalStorage();
    // 发送预约表单请求
    let response = await fetch(baseUrl + "api/badminton/addOrderPlan", {
      method: "POST",
      headers: {
        token: getLoginToken(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyTransform<IGymOrder | IBadmintonOrder>(body),
    });

    let res: IResponse = await response.json();

    console.log("表单请求响应：", res);

    // throw new Error("略略略");

    return { message: res.message, code: res.code, data: res.data };
  }

  async function getOrderPlan(body: "健身房" | "羽毛球"): Promise<IResponse> {
    const { getLoginToken } = useLocalStorage();
    // 发送预约表单请求
    let response = await fetch(
      baseUrl + "api/badminton/getOrderPlan" + `?orderType=${body}`,
      {
        method: "Get",
        headers: {
          token: getLoginToken(),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    let res: IResponse = await response.json();

    // console.log("获取用户预约请求响应：", res);

    return { message: res.message, code: res.code, data: res.data };
  }

  return {
    loginAuthen,
    addOrderPlan,
    getOrderPlan,
  };
}

export function useLocalStorage(): IUseLocalStorage {
  function getLoginToken(): TOKEN | "" {
    return localStorage.getItem("gym-token") || "";
  }
  function setLoginToken(token: string): void {
    localStorage.setItem("gym-token", token);
  }
  function removeLoginToken() {
    localStorage.removeItem("gym-token");
  }

  return {
    getLoginToken,
    setLoginToken,
    removeLoginToken,
  };
}

/**
 * 将普通对象格式转换为 key=value&.. 格式
 * @param body 请求参数
 * @returns x-www-form-urlencoded 类型字符
 */
function bodyTransform<Ibody>(body: Ibody): string {
  let request_body: string = "";
  for (let key in body) {
    request_body += `${key}=${body[key as keyof Ibody]}&`;
  }
  return request_body.slice(0, request_body.length - 1);
}

export default useApi;
