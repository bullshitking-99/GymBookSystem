import { Dayjs } from "dayjs";

interface IformState {
  isOrder: boolean;
  date: string;
  beginTime: number;
  finishTime: number;
  prioritySites: number[];
}

interface Iform_request_params {
  isOrder: boolean;
  date: string;
  beginTime: number;
  durationTime: number;
  prioritySites: number[];
}

enum SliderMarks {
  0 = 13,
  20 = 14,
  40 = 15,
  60 = 16,
  80 = 17,
  100 = 18,
}
