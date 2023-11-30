// Use Pinia to store & update Data

import { defineStore } from 'pinia';

export const UseChartStore = defineStore ('ChartData', {
  state: () => xyValues,
})