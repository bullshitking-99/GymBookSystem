import { Dayjs } from "dayjs";

interface IformState {
  isOrder: boolean;
  orderType: "羽毛球" | "健身房" | "";
  isAssignDate: boolean;
  date: string;
  gym_beginTime: number;
  gym_finishTime: number;
  bmt_beginTime: number;
  bmt_finishTime: number;
  prioritySites: number[];
  isOrderWeekend: boolean;
  enhanceMode: boolean;
}

// interface Iform_request_params {
//   isOrder: boolean;
//   date: string;
//   beginTime: number;
//   durationTime: number;
//   prioritySites: number[];
// }
