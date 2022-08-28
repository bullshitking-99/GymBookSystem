import { Ref, ref } from "vue";

type REQUEST_METHODS = "get" | "post";

interface IuserInfo {
  account: string;
  password: string;
}

export interface IuseApi {
  loginAuthen: (url: string, body: IuserInfo) => void;
}

/* 返回api相关hooks */
function useApi(): IuseApi {
  /**
   * 登录页请求用户验证
   * method为post
   */
  function loginAuthen(url: string, body: IuserInfo): void {
    const userInfo: Ref<IuserInfo> = ref(body);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo.value),
    })
      .then((response) => {
        console.log(response.json());
      })
      .catch((error) => console.log(error));
  }

  return {
    loginAuthen,
  };
}

export { useApi };
