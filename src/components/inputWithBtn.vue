<!-- 
组件说明：
    props：
        modelValue -- input使用的v-model数据
        placeholder -- input placeholder
    event：
        btnClicked -- button触发时emit的响应事件
    slot:
        默认插槽 -- 传入button内，建议为图标或动态组件
 -->
<script lang="ts" setup>
import { PropType, ref, useAttrs } from "vue";
import { stringifyQuery } from "vue-router";

const props = defineProps({
  modelValue: String as PropType<string>,
  placeholder: String as PropType<string>,
});

const emits = defineEmits(["btnClicked"]);

const btnClicked = () => {
  emits("btnClicked", props.modelValue);
};

// 因为setup的私有特性，需要显式向父组件暴露实例中的方法
const input = ref<HTMLInputElement | null>(null);
const input_focus = () => {
  input.value?.focus();
};
defineExpose({
  input_focus,
});
</script>

<template>
  <main>
    <input
      type="text"
      v-model="modelValue"
      :placeholder="placeholder"
      ref="input"
    />
    <button @click="btnClicked">
      <slot></slot>
    </button>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  width: 85%;
  margin: 0 auto;

  input {
    /* 上右下左 
  左边 18 是因为椭圆边框会遮住光标
  右边 52 是因为要放一个添加按钮
  上下 16 为了提升输入框高度*/
    padding: 16px 52px 16px 22px;

    /* 使input获取焦点时无边框加粗 */
    outline: none;
    width: 100%;
    font-size: 18px;
    color: #626262;
    border: none;
    border-radius: 48px;
    box-shadow: 0 0 24 rgba(0, 0, 0, 0.08);
  }

  button {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(#c0a5f3, #7f95f7);
    border: none;
    outline: none;

    position: absolute;
    right: 0;

    cursor: pointer;

    .plus {
      display: block;
      width: 100%;
      height: 100%;
      /* 这里为什么要采用同色渐变呢 */
      background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff);
      background-size: 50% 2px, 2px 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
</style>
