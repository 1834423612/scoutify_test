<template>
  <!-- <Scatter :data="data" :options="options" /> -->
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'vue-chartjs'
// import * as chartConfig from './chartConfig.js'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

// export default {
//   name: 'App',
//   components: {
//     Scatter
//   },
//   data() {
//     return chartConfig
//   }
// }

export const data = {
  datasets: [
    {
      label: 'Scatter Dataset 1',
      fill: false,
      borderColor: '#f87979',
      backgroundColor: '#f87979',
      data: [
        {
          x: -2,
          y: 4
        },
      ]
    },
    {
      label: 'Scatter Dataset 2',
      fill: false,
      borderColor: '#7acbf9',
      backgroundColor: '#7acbf9',
      data: [
        {
          x: -2,
          y: 4
        },
      ]
    }
  ]
}

export const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
