<script lang="ts" setup>
import { h, onMounted, Ref, ref, watch } from "vue";
import UseApi from "../hooks/api/useApi";
import inputWithBtn from "../components/inputWithBtn.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";

const { loginAuthen } = UseApi();

const userInfo = ref({
  account: "",
  password: "",
});
const router = useRouter();

// 获取子组件input实例
const account_input = ref<InstanceType<typeof inputWithBtn> | null>(null);
const password_input = ref<InstanceType<typeof inputWithBtn> | null>(null);

// account_input 按钮点击方法 focus password_input
const inputSwitch = () => {
  password_input.value?.input_focus();
};

onMounted(() => {
  // 当localStorage中存在account时自动提取
  const account = localStorage.getItem("account");
  if (account !== null) {
    userInfo.value.account = account;
    inputSwitch();
  } else {
    account_input.value?.input_focus();
  }
});

// 页面声明及状态广播
const declaration: Ref<string> = ref("本系统纯属自娱自乐");
// 控制声明文字抖动效果
const shaking: Ref<boolean> = ref(false);

// 登录按钮等待效果
const isSpin = ref(false);
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "20px",
    color: "white",
  },
  spin: true,
});
const delayTime = 300;

const loginHandler = (password: string) => {
  // console.log(userInfo.value);

  // 显示等待状态
  isSpin.value = true;

  // 清空抖动状态，收到响应时启动抖动
  shaking.value = false;

  // 发送登录请求验证用户信息
  loginAuthen(userInfo.value)
    .then((res) => {
      declaration.value = res.message;
      if (res.code === 2000) {
        router.push("/form");
        // 将账号存至localStorage中，下次直接提
        localStorage.setItem("account", userInfo.value.account);
      }
    })
    .catch(() => {
      // message.error(err.message);
      declaration.value = "未知错误，请重试一次或联系管理员";
    })
    .finally(() => {
      isSpin.value = false;
      shaking.value = true;
    });
};
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
      <a-spin :indicator="indicator" v-if="isSpin" :delay="delayTime"></a-spin>
      <span v-else class="arrow" style="content: '\21A0'">&#8608;</span>
    </inputWithBtn>
  </Transition>

  <div style="height: 5rem"></div>

  <hr />

  <div style="height: 2rem"></div>

  <!-- footer 系统说明 -->
  <div class="declaration" :class="{ shaking }">{{ declaration }}</div>
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

// 文字抖动效果
.shaking {
  color: #e40438;
  animation-name: shaking;
  animation-duration: 0.5s;
}

@keyframes shaking {
  10% {
    transform: translateX(2px);
  }
  20% {
    transform: translateX(-2px);
  }
  30% {
    transform: translateX(2px);
  }
  40% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-2px);
  }
  70% {
    transform: translateX(2px);
  }
  80% {
    transform: translateX(-2px);
  }
  90% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
