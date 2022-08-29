import { Ref, ref } from "vue";

type REQUEST_METHODS = "get" | "post";

interface IuserInfo {
  account: string;
  password: string;
}

export interface IuseApi {
  loginAuthen: (url: string, body: IuserInfo) => Promise<string>;
}

/* 返回api相关hooks */
function useApi(): IuseApi {
  /**
   * 登录页请求用户验证
   * method为post
   */
  async function loginAuthen(url: string, body: IuserInfo): Promise<string> {
    // 发送登录验证请求
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: transform(body),
    });

    let res = await response.json();
    // if (res.code === 2000) {
    //   console.log("登录成功");
    // } else if (res.code === 2003) {
    //   console.log(res.message);
    // } else {
    //   console.log(res);
    // }

    // response.ok : 状态码为200-299
    return response.ok ? res.message : res;

    /**
     * 将普通对象格式转换为 key=value&.. 格式
     * @param body 请求参数
     * @returns x-www-form-urlencoded 类型字符
     */
    function transform(body: IuserInfo): string {
      let request_body: string = "";
      for (let key in body) {
        request_body += `${key}=${body[key as keyof IuserInfo]}&`;
      }
      return request_body.slice(0, request_body.length - 1);
    }
  }

  return {
    loginAuthen,
  };
}

export { useApi };
