<!-- 表单页，收集用户信息与设置参数 -->
<script lang="ts" setup>
import { ref } from "vue";
import InputBasic from "../components/inputBasic.vue";

const inputValue = ref({
  name: "lee",
});
</script>

<template>
  <inputBasic :inputValue="inputValue.name" placeholder="name"></inputBasic>
</template>

<style scoped lang="scss"></style>
