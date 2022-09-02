/* 返回api相关hooks */
function useApi(): IuseApi {
  /**
   * 登录页请求用户验证
   * method为post
   */
  async function loginAuthen(
    url: string,
    body: IuserInfo
  ): Promise<ILoginResponse> {
    // 发送登录验证请求
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyTransform(body),
    });

    let res: ILoginResponse = await response.json();

    const { setLoginToken } = useLocalStorage();
    if (res.code === 2000) setLoginToken(res.data);

    return { message: res.message, code: res.code, data: res.data };
  }

  return {
    loginAuthen,
  };
}

export function useLocalStorage(): IUseLocalStorage {
  function getLoginToken(): TOKEN | "" {
    return localStorage.getItem("gym-token") || "";
  }
  function setLoginToken(token: string): void {
    localStorage.setItem("gym-token", token);
  }

  return {
    getLoginToken,
    setLoginToken,
  };
}

/**
 * 将普通对象格式转换为 key=value&.. 格式
 * @param body 请求参数
 * @returns x-www-form-urlencoded 类型字符
 */
function bodyTransform(body: IuserInfo): string {
  let request_body: string = "";
  for (let key in body) {
    request_body += `${key}=${body[key as keyof IuserInfo]}&`;
  }
  return request_body.slice(0, request_body.length - 1);
}

export default useApi;
