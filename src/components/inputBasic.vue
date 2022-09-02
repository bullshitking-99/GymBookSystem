<!-- 用于表单提交的基础input元素:
        props：
            inputValue -- 与上层组件进行v-model绑定 
            placeholder -- input placeholder
        emits:
            inputEnter -- 在input中输入enter
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
const emit = defineEmits(["inputEnter", "update:inputValue"]);
// const btnClicked = () => {
//   emit("btnClicked", input.value);
// };
</script>

<template>
  <Transition>
    <main :class="{ input_get_focus: onFocus }">
      <input
        type="text"
        :placeholder="placeholder"
        ref="input"
        :value="inputValue"
        @focus="onFocus = true"
        @blur="onFocus = false"
        @input="$emit('update:inputValue', input?.value)"
        @keyup.enter="$emit('inputEnter')"
      />
    </main>
  </Transition>
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
  border-radius: 24px;
  transition: all 0.5s;

  .input_get_focus {
    border: 2px solid black;
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
    border-radius: 24px;
    box-shadow: 0 0 24 rgba(0, 0, 0, 0.08);
  }
}
</style>
