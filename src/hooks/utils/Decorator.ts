/**
 * 防抖
 * 调用装饰器后开始计时，经过一段冷静时间再调用真正的处理函数，连续调用重置计时，计时完执行最新的一次
 * 常用于输入框的搜索提示，即等待输入完成后再进行处理
 */
export function debounce(func: Function, delay: number): Function {
  // 记录上一次调度标识
  let lastTimerId: number;

  // 这里加this是因为ts需要知道this是啥，实际执行中这个this是一个隐式参数，跟没有一样
  return function (this: object, ...args: any) {
    // 取消上一次调度，若调度已执行，clearTimeout无副作用
    clearTimeout(lastTimerId);
    lastTimerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
