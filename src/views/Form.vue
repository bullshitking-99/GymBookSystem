<!-- 表单页，收集用户信息与设置参数 -->
<script lang="ts" setup>
import { ref, watch } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { IformState, Iform_request_params, SliderMarks } from "../@types/form";

const formState = ref<IformState>({
  isOrder: false,
  date: "",
  beginTime: 20,
  finishTime: 40,
  prioritySites: [],
});

// 绑定switcher，控制全局表单是否可选
const isDisabled = ref(true);

// datePicker 禁用未来六天时间
const disabledDates = (current: Dayjs) => {
  return current && current < dayjs().add(6, "day");
};

// 用于滑块的绑定值，预约场地时间范围
const slider_timeRange = ref<number[]>([
  formState.value.beginTime,
  formState.value.finishTime,
]);
watch(slider_timeRange, (newValue) => {
  [formState.value.beginTime, formState.value.finishTime] = newValue;
});

const slider_marks: Record<number, number> = {
  0: 13,
  20: 14,
  40: 15,
  60: 16,
  80: 17,
  100: 18,
};

// 选择器选项绑定值，优先场地
const select_options = ref(
  [...Array(20)].map((_, index) => ({
    value: index + 1,
  }))
);

// 提交btn click事件
const submitForm = () => {
  console.log(formState.value);
  // 配置请求参数
  const form_request_params: Iform_request_params = {
    isOrder: formState.value.isOrder,
    date: dayjs(formState.value.date).format("YYYY-MM-DD"),
    beginTime: slider_marks[formState.value.beginTime],
    durationTime:
      slider_marks[formState.value.finishTime] -
      slider_marks[formState.value.beginTime],
    prioritySites: formState.value.prioritySites,
  };
  console.log(form_request_params);
};

// 提交表单且数据验证成功后回调事件
const onFinish = () => {};

// 提交表单且数据验证失败后回调事件
const onFinishFailed = () => {};
</script>

<template>
  <a-form
    :model="formState"
    :label-col="{ span: 4, offset: 1 }"
    :wrapper-col="{ span: 15, offset: 1 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item label="开启预约">
      <a-switch
        v-model:checked="formState.isOrder"
        @click="isDisabled = !isDisabled"
      ></a-switch>
    </a-form-item>
    <a-form-item label="预约日期">
      <a-date-picker
        v-model:value="formState.date"
        inputReadOnly
        :disabled-date="disabledDates"
        :disabled="isDisabled"
      ></a-date-picker>
    </a-form-item>
    <a-form-item label="预约时间">
      <a-slider
        v-model:value="slider_timeRange"
        range
        :disabled="isDisabled"
        :marks="slider_marks"
        :step="null"
        :tooltipVisible="false"
      />
    </a-form-item>
    <a-form-item label="优先场地">
      <a-select
        v-model:value="formState.prioritySites"
        mode="tags"
        :options="select_options"
        :disabled="isDisabled"
      ></a-select>
    </a-form-item>
    <div class="submitBtn">
      <a-button type="primary" shape="round" block @click="submitForm">
        提交
      </a-button>
    </div>
  </a-form>
</template>

<style scoped lang="scss">
.submitBtn {
  margin: 40px 25% 0 25%;
}
</style>
