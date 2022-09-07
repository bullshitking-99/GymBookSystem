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
    <div class="inputBasic">
      <div class="label">
        <label for="input">
          {{ placeholder }}
        </label>
      </div>

      <div class="input">
        <input
          id="input"
          type="text"
          :placeholder="placeholder"
          ref="input"
          :value="inputValue"
          :class="{ input_get_focus: onFocus }"
          @focus="onFocus = true"
          @blur="onFocus = false"
          @input="$emit('update:inputValue', input?.value)"
          @keyup.enter="$emit('inputEnter')"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.inputBasic {
  width: 100%;

  .label {
    width: 100%;
    height: 20px;
    position: relative;
    margin-bottom: 5px;

    label {
      position: absolute;
      left: 45px;
      opacity: 0.8;
      font-size: 20px;
    }
  }

  .input {
    width: 100%;
    text-align: center;
    transition: all 0.1s;

    input {
      /* 上右下左 
      左边 18 是因为椭圆边框会遮住光标
      右边 52 是因为要放一个添加按钮
      上下 16 为了提升输入框高度*/
      padding: 5px 12px 5px 12px;

      /* 使input获取焦点时无边框加粗 */
      outline: none;
      width: 80%;
      font-size: 18px;
      border-radius: 12px;

      .input_get_focus {
        border: 2px solid black;
      }
    }
  }
}
</style>
