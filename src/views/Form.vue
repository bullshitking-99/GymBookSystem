<!-- 表单页，收集用户信息与设置参数 -->
<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { IformState } from "../@types/form";
import UseApi, { useLocalStorage } from "../hooks/api/useApi";
import { debounce } from "../hooks/utils/Decorator";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { h } from "vue";
import { message } from "ant-design-vue";
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import useApi from "../hooks/api/useApi";

const router = useRouter();
const OrderPlan = "OrderPlan";

// 请求预约信息，更新表单状态
(function UpdateForm(): void {
  // 判断session-OrderPlan是否存在
  const hasOrderPlan: boolean = sessionStorage.getItem(OrderPlan) !== null;

  // OrderPlan存在 - 更新表单状态
  if (hasOrderPlan) {
    setFormState();
  }

  // orderPlan不存在 - 发起请求获取OrderPlan
  if (!hasOrderPlan) {
    (async () => {
      const { getOrderPlan } = useApi();
      // 获取用户预约数据
      // promise.all 获取羽毛球和健身房数据
      const orderRequest: Array<Promise<IResponse>> = [
        getOrderPlan("健身房"),
        getOrderPlan("羽毛球"),
      ];

      // loading start

      const res = await Promise.all(orderRequest);
      console.log(res);

      // loading end

      // token过期则需要登录
      if (res[0].code === 2001) {
        message.warn("获取预约信息失败，请重新登录");
        router.push("/");
      }
      // 成功请求则将数据存入session中，更新表单状态
      if (res[0].code === 2000) {
        // 返回data为空-新用户-使用表单初始状态
        // data不为空-老用户-更新表单状态
        if (res[0].data !== []) {
          // setSession 将pinia持久化存储则不需要这一步
          sessionStorage.setItem(OrderPlan, JSON.stringify(res));
          // UpdateForm
          setFormState();
        }
      }
    })();
  }

  /**
   * 设置表单初始状态
   * 需要分隔一下数据环境，存于pinia中，并使用session进行持久化存储
   */
  function setFormState(): void {
    console.log("form update!");
  }
})();

// 表单控制变量
const formState = ref<IformState>({
  isOrder: true,
  orderType: "健身房",
  isAssignDate: false,
  date: "",
  gym_beginTime: 13,
  gym_finishTime: 15,
  bmt_beginTime: 20,
  bmt_finishTime: 40,
  prioritySites: [],
  isOrderWeekend: true,
  enhanceMode: true,
});

// 开启预约开关，控制全局表单是否可选
const isDisabled = ref(false);

// switch 是否指定预约时间，为true则启用datePicker
// datePicker 禁用过去时间
const disabledDates = (current: Dayjs) => {
  // 禁用未来6天时间
  return current && current < dayjs().add(6, "day");
  // 禁用过去时间
  // return current && current < dayjs().subtract(1, "day");
};

// 用于滑块的绑定值，预约场地时间范围
const slider_timeRange = ref<number[]>([
  formState.value.bmt_beginTime,
  formState.value.bmt_finishTime,
]);
// 警告框提示预约时间限制
const isAlert = ref(false);
// 监听用户滑动滑块
watch(slider_timeRange, (newValue) => {
  // 添加防抖
  const slider_watcher = debounce((newValue: Array<number>) => {
    [formState.value.bmt_beginTime, formState.value.bmt_finishTime] = newValue;
    const durationTime = (newValue[1] - newValue[0]) / 20;

    if (durationTime > 2 || durationTime == 0) {
      isAlert.value = true;
    } else {
      isAlert.value = false;
    }
  }, 1000);
  slider_watcher(newValue);
});
const slider_marks: Record<number, number> = {
  0: 13,
  20: 14,
  40: 15,
  60: 16,
  80: 17,
  100: 18,
};

// 健身房预约时段单选
const GymBookingTime = computed<string>({
  get() {
    return JSON.stringify([
      formState.value.gym_beginTime,
      formState.value.gym_finishTime,
    ]);
  },
  set(newValue) {
    [formState.value.gym_beginTime, formState.value.gym_finishTime] =
      JSON.parse(newValue);
  },
});

// 优先场地 列表值
const select_options = ref(
  [...Array(18)].map((_, index) => ({
    value: index + 1,
  }))
);

// 控制提交表单后显示等待状态
const isSpin = ref(false);
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "20px",
    color: "white",
  },
  spin: true,
});
const delayTime = 300;

// 提交btn click事件
const submitForm = () => {
  // 显示等待状态spin
  isSpin.value = true;

  // console.log(formState.value);

  if (formState.value.orderType === "健身房") {
    // 配置健身房请求参数
    const gym_form: IGymOrder = {
      orderType: formState.value.orderType,
      isOrder: formState.value.isOrder,
      isAssignDate: formState.value.isAssignDate,
      orderDate: dayjs(formState.value.date).format("YYYY-MM-DD"),
      beginTime: formState.value.gym_beginTime,
      endTime: formState.value.gym_finishTime,
      timeIndex: CalTimeIndex(formState.value.gym_beginTime),
      enhanceMode: formState.value.enhanceMode,
      isOrderWeekend: formState.value.isOrderWeekend,
    };
    console.log("健身房预约：", gym_form);

    // 调用请求，发送表单
    sendOrder(gym_form);

    // 计算健身房预约时间段序号，后端脑子抽了除了timeIndex还要起止时间
    function CalTimeIndex(bmt_beginTime: number): number {
      switch (bmt_beginTime) {
        case 12:
        case 13:
          return bmt_beginTime - 11;
        case 15:
          return 3;
        case 17:
          return 4;
        default:
          return 2;
      }
    }
  }

  if (formState.value.orderType === "羽毛球") {
    // 配置羽毛球请求参数
    const badminton_form: IBadmintonOrder = {
      orderType: formState.value.orderType,
      isOrder: formState.value.isOrder,
      isAssignDate: formState.value.isAssignDate,
      orderDate: dayjs(formState.value.date).format("YYYY-MM-DD"),
      beginTime: slider_marks[formState.value.bmt_beginTime],
      endTime: slider_marks[formState.value.bmt_finishTime],
      prioritySites: formState.value.prioritySites,
      priorityDuration:
        slider_marks[formState.value.bmt_finishTime] -
        slider_marks[formState.value.bmt_beginTime],
      isOrderWeekend: formState.value.isOrderWeekend,
    };
    console.log("羽毛球预约：", badminton_form);

    // 调用请求，发送表单
    sendOrder(badminton_form);
  }

  // 调用API，提交表单数据并返回结果
  // 获得结果后结束等待状态
  function sendOrder(order: IBadmintonOrder | IGymOrder): void {
    // 进行数据处理与验证
    if (!formCheck(order)) return;

    const { addOrderPlan } = UseApi();
    addOrderPlan(order)
      .finally(() => (isSpin.value = false))
      .then((res) => {
        switch (res.code) {
          case 2000:
            message.success("提交成功辣");
            break;
          case 2001:
            message.warn("登录状态已过期，请重新登录");
            // 删除token信息，重新登录
            const { removeLoginToken } = useLocalStorage();
            removeLoginToken();
            // 延迟1s跳转至登陆页，也可换为对话框，使得用户点击确认后再跳转
            setTimeout(() => {
              router.push("/");
            }, 1000);
            break;
          default:
            message.warn(res.message);
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          message.error(err.message);
        } else {
          message.error("未知错误，请联系管理员解决");
        }
      });
  }

  // 表单数据处理与验证
  function formCheck(order: IBadmintonOrder | IGymOrder): boolean {
    // 表单数据验证与处理
    // 在打开指定预约开关后，必须选择预约日期
    if (order.isAssignDate && !formState.value.date) {
      message.warn("必须选择指定预约日期哦");
      isSpin.value = false;
      return false;
    }
    // 在不指定预约日期的情况下，填充预约日期，该值不会被使用
    if (!order.isAssignDate) order.orderDate = "2022-01-22";

    if (order.orderType === "羽毛球") {
      if (order.priorityDuration > 2 || order.priorityDuration < 1) {
        message.warn("预约时长必须为1-2小时哦");
        isSpin.value = false;
        return false;
      }
    }

    return true;
  }
};
</script>

<template>
  <a-form
    :model="formState"
    :label-col="{ span: 4, offset: 1 }"
    :wrapper-col="{ span: 15, offset: 1 }"
    autocomplete="off"
  >
    <a-form-item label="开启预约">
      <a-switch
        v-model:checked="formState.isOrder"
        @click="isDisabled = !isDisabled"
        checked-children="开"
        un-checked-children="关"
      ></a-switch>
    </a-form-item>
    <a-form-item label="选择场馆">
      <a-radio-group v-model:value="formState.orderType" button-style="solid">
        <a-radio-button value="健身房">健身房</a-radio-button>
        <a-radio-button value="羽毛球">羽毛球</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="指定预约">
      <a-switch
        v-model:checked="formState.isAssignDate"
        :disabled="isDisabled"
        checked-children="是"
        un-checked-children="否"
      ></a-switch>
      <a-date-picker
        placeholder="将仅预约该日期"
        v-model:value="formState.date"
        inputReadOnly
        :disabled-date="disabledDates"
        :disabled="isDisabled || !formState.isAssignDate"
      ></a-date-picker>
    </a-form-item>
    <a-form-item label="预约时间">
      <a-slider
        v-if="formState.orderType === '羽毛球'"
        v-model:value="slider_timeRange"
        range
        :disabled="isDisabled"
        :marks="slider_marks"
        :step="null"
        :tooltipVisible="false"
      />
      <a-radio-group
        :disabled="isDisabled"
        v-model:value="GymBookingTime"
        v-if="formState.orderType === '健身房'"
        button-style="solid"
      >
        <a-radio-button value="[12,13]">12:00-13:30</a-radio-button>
        <a-radio-button value="[13,15]">13:50-15:20</a-radio-button>
        <a-radio-button value="[15,17]">15:40-17:10</a-radio-button>
        <a-radio-button value="[17,19]">17:30-19:00</a-radio-button>
      </a-radio-group>
      <a-alert
        v-if="isAlert && formState.orderType === '羽毛球'"
        message="预约时间应为1-2小时"
        type="warning"
        show-icon
      ></a-alert>
    </a-form-item>

    <a-form-item v-if="formState.orderType === '羽毛球'" label="优先场地">
      <a-select
        placeholder="也可以不选哦"
        v-model:value="formState.prioritySites"
        mode="multiple"
        :options="select_options"
        :disabled="isDisabled"
      ></a-select>
    </a-form-item>

    <a-form-item v-if="formState.orderType === '健身房'" label="增强模式">
      <a-switch
        :disabled="isDisabled"
        v-model:checked="formState.enhanceMode"
        checked-children="预约剩余时段"
        un-checked-children="仅预约该时段"
      ></a-switch>
    </a-form-item>

    <a-form-item label="预约周末">
      <a-switch
        :disabled="isDisabled"
        v-model:checked="formState.isOrderWeekend"
        :checked-children="
          formState.orderType === '健身房'
            ? `求道之人不问寒暑`
            : `精诚所至金石为开`
        "
        :un-checked-children="
          formState.orderType === '健身房' ? '不，劳逸结合' : '不，家境贫寒'
        "
      ></a-switch>
    </a-form-item>
    <div class="submitBtn">
      <a-button
        type="primary"
        shape="round"
        style="width: 100%"
        block
        @click="submitForm"
      >
        <span v-if="!isSpin">提交</span>
        <a-spin :indicator="indicator" v-else :delay="delayTime"></a-spin>
      </a-button>
    </div>
  </a-form>
</template>

<style scoped lang="scss">
.submitBtn {
  margin: 40px 25% 0 25%;
}
</style>
