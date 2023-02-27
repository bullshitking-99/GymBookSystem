<!-- 
    本质为tabBar，样式上为点击切换增加滑块滑动效果
    props：一个tabBar options数组，作为tabBar中的点击选项，目前组件CSS不完善，仅支持两个option
    emits：options点击事件，返回点击的option
 -->
<script lang="ts" setup>
import { ref } from "vue";

// 通过泛型参数来定义 props 的类型
const props = defineProps<{
  options: Array<string>;
}>();

const emit = defineEmits(["change"]);

const choosed = ref(props.options[0]);

function change(event: Event) {
  const option = (event.target as HTMLElement).innerHTML;
  choosed.value = option;
  emit("change", option);
}
</script>

<template>
  <button id="container">
    <div
      id="slider"
      :class="[choosed === props.options[0] ? 'ChooseLeft' : 'ChooseRight']"
    ></div>
    <div
      v-for="option in props.options"
      :key="option"
      class="option"
      @click="change"
      :class="{ choosed: choosed === option }"
    >
      {{ option }}
    </div>
  </button>
</template>

<style scoped lang="scss">
#container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  border-radius: 48px;
  border: none;
  background: rgba(255, 255, 255, 1);
  // background-color: #1890ff;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
  // 毛玻璃
  backdrop-filter: blur(5px);
  height: 50px;
  transition: all 0.5s;
  transform: scale(1.05);
  user-select: none;
  perspective: 500px;

  // 点击反馈-缩小
  // 需在此处单独设置 transition: transform
  &:active #slider {
    transform: scale(0.9);
    transform-origin: center;
  }

  #slider {
    position: absolute;
    width: 90px;
    border: none;
    border-radius: 48px;
    height: 80%;
    // background-color: rgba(255, 255, 255, 1);
    background-color: #1890ff;
    z-index: -100;
    // 存在多个transition时，需要写在一起，写多个transition会覆盖导致前者失效
    // 此处active事件结束后，transition：transform让滑块平滑恢复原尺寸
    transition: left 0.5s cubic-bezier(0.82, 0.12, 0.18, 0.88), transform 0.3s;
  }
  .ChooseLeft {
    left: 6px;
  }
  .ChooseRight {
    left: 110px;
  }

  .option {
    padding: 15px 30px;
    // color: rgba(0, 0, 0, 0.7);
    color: gray;
    font-weight: 700;
    transition: all 0.5s linear;
    cursor: pointer;
  }
  .choosed {
    // color: black;
    color: white;
    font-weight: bold;
    // transform-origin: center;
    // transform: scale(1.1);
  }
}
</style>
