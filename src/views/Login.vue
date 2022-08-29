<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useApi } from "../hooks/api/useApi";
import inputWithBtn from "../components/inputWithBtn.vue";

const { loginAuthen } = useApi();

const userInfo = ref({
  account: "",
  password: "",
});

// 组件加载时 focus account_input
const account_input = ref<InstanceType<typeof inputWithBtn> | null>(null);
onMounted(() => {
  account_input.value?.input_focus();
});

// account_input 按钮点击方法 focus password_input
const password_input = ref<InstanceType<typeof inputWithBtn> | null>(null);
const inputSwitch = (account: string) => {
  password_input.value?.input_focus();
};

const loginHandler = (password: string) => {
  console.log(userInfo.value);

  // 发送登录请求验证用户信息
  loginAuthen("http://shaowei.tech:8080/api/user/login", userInfo.value).then(
    (res) => (declaration.value = res)
  );
};

// 页面声明及状态广播
const declaration = ref("本系统纯属自娱自乐");
</script>

<template>
  <h2>Login</h2>

  <div style="height: 2rem"></div>

  <Transition>
    <inputWithBtn
      placeholder="ACCOUNT"
      @btnClicked="inputSwitch"
      ref="account_input"
      v-model:inputValue="userInfo.account"
    >
      <span class="arrow" style="content: '\21A1'">&#8609;</span>
    </inputWithBtn>
  </Transition>

  <div style="height: 2rem"></div>

  <Transition>
    <inputWithBtn
      placeholder="PASSWORD"
      @btnClicked="loginHandler"
      ref="password_input"
      v-model:inputValue="userInfo.password"
    >
      <span class="arrow" style="content: '\21A0'">&#8608;</span>
    </inputWithBtn>
  </Transition>

  <div style="height: 5rem"></div>

  <hr />

  <div style="height: 2rem"></div>

  <!-- footer 系统说明 -->
  <div class="declaration">{{ declaration }}</div>
</template>

<style scoped lang="scss">
h2 {
  font-size: 24px;
  text-align: center;
  margin: 2.5rem 0;
}

.arrow {
  font-size: 25px;
  color: white;
}

hr {
  width: 50%;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(#c0a5f3, #7f95f7);
}

.declaration {
  text-align: center;
  opacity: 0.7;
}
</style>
