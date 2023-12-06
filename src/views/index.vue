<template>
  <div id="app">
    <h1>Test Index Page</h1>
    <p>Hello world!</p>

    <!-- Import the components -->
    <Test />

    <span>Chart Begin</span>
    <!-- Test chart -->
    <!-- <BarChart /> -->
    <Scatter :data="data" :options="options" style="width: 80%; height: 60%;"/>
  </div>
</template>

<script>
import Test from '../components/test.vue';
import BarChart from '../components/chart.vue';

export default {
  components: {
    Test, // Register 'Test' component
    BarChart,
    Scatter
  },
  data() {
    return ChartConfig
  }
};

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'vue-chartjs'
import * as ChartConfig from '../assets/static/js/ChartConfig.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

</script>

<style scoped>
@import '../assets/static/css/scrollbar.css';

#app {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: aquamarine;
}

h1 {
  text-align: center;
}

p {
  text-align: center;
}
</style>
