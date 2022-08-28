<script lang="ts">
// 使用普通的 <script> 来声明选项
// 禁止透传attrs自动赋予根元素，在组件内部手动指定属性继承元素
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
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
  console.log(account_input.value);
  account_input.value?.input_focus();
});

// account_input 按钮点击方法 focus password_input
const password_input = ref<InstanceType<typeof inputWithBtn> | null>(null);
const inputSwitch = () => {
  password_input.value?.input_focus();
};

const loginHandler = () => {
  // 发送登录请求验证用户信息
  loginAuthen("http://shaowei.tech:8080/api/user/login", userInfo.value);
};
</script>

<template>
  <h2>Login</h2>

  <div style="height: 2rem"></div>

  <inputWithBtn
    :modelValue="userInfo.account"
    placeholder="ACCOUNT"
    @btnClicked="inputSwitch"
    ref="account_input"
  >
    <span class="arrow" style="content: '\21A1'">&#8609;</span>
  </inputWithBtn>

  <div style="height: 2rem"></div>

  <inputWithBtn
    :modelValue="userInfo.password"
    placeholder="PASSWORD"
    @btnClicked="loginHandler"
    ref="password_input"
  >
    <span class="arrow" style="content: '\21A0'">&#8608;</span>
  </inputWithBtn>

  <div style="height: 5rem"></div>

  <hr />

  <div style="height: 2rem"></div>

  <!-- footer 系统说明 -->
  <div class="declaration">本系统纯属自娱自乐</div>
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
