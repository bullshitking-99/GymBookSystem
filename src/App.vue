<script lang="ts" setup>
import SlideSwitcher from "./components/SlideSwitcher.vue";
import { message } from "ant-design-vue";
import { onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import useApi, { useLocalStorage } from "../src/hooks/api/useApi";

const router = useRouter();
const { getLoginToken } = useLocalStorage();

onBeforeMount(() => {
  if (getLoginToken()) router.push("/form");
});
</script>

<template>
  <main>
    <div class="container">
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100vw;
  /* min-height 
  1.使全屏可有背景色 
  2.不限制表单长度，防止出现滚动条 
  3.表单长度高于100vh时，背景色伴随表单所在区域 */
  min-height: 100vh;
  display: grid;
  justify-items: center;
  align-items: center;
  background: rgb(203, 210, 240);
  // background-color: rgba($color: rgb(224, 208, 208), $alpha: 1);
  .container {
    width: 60%;
    min-height: 60vh;
    min-width: 350px;
    max-width: 400px;
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
    border-radius: 24px;
    padding: 48px 28px;
    background-color: rgb(245, 246, 252);
    // background-color: burlywood;

    /* 标题 */
    h1 {
      font-size: 26px;
      text-align: center;
      margin: 24px 0;
    }
  }
}
</style>
