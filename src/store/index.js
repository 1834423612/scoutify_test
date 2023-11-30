// Use Pinia to store & update Data

import { defineStore } from 'pinia';

export const useStore = defineStore('mainStore', {
  state: () => ({
    xyValues: [],
    rnkValues: []
  }),
  actions: {
    setXyValues(values) {
      this.xyValues = values;
    },
    setRnkValues(values) {
      this.rnkValues = values;
    }
  }
});
