<!-- 
组件说明：
    props：
        inputValue -- 与上层组件进行v-model绑定 
        placeholder -- input placeholder
    emits：
        btnClicked -- button点击时的响应事件，向上传递当前组件实例的input.value
    slot:
        默认插槽 -- 传入button内，建议为图标或动态组件
 -->
<script lang="ts" setup>
import { PropType, ref, useAttrs } from "vue";

const props = defineProps({
  inputValue: String as PropType<string>,
  placeholder: String as PropType<string>,
});

// input是否获得焦点
const onFocus = ref(false);

// 因为setup的私有特性，需要显式向父组件暴露实例中的方法
const input = ref<HTMLInputElement | null>(null);
const input_focus = () => {
  input.value?.focus();
};
defineExpose({
  input_focus,
});

// Emit 向上传递input中的值
const emit = defineEmits(["btnClicked", "update:inputValue"]);
// const btnClicked = () => {
//   emit("btnClicked", input.value);
// };
</script>

<template>
  <main :class="{ input_get_focus: onFocus }">
    <input
      type="text"
      :placeholder="placeholder"
      ref="input"
      :value="inputValue"
      @focus="onFocus = true"
      @blur="onFocus = false"
      @input="$emit('update:inputValue', input?.value)"
      @keydown.enter="$emit('btnClicked')"
    />
    <button @click="$emit('btnClicked', input?.value)">
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
  border-radius: 48px;
  transition: all 0.5s;

  .input_get_focus {
    transform: scale(1.05);
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  }

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

    transition: all 0.2s;
    &:active {
      transform: scale(0.85);
    }

    cursor: pointer;
  }
}
</style>
