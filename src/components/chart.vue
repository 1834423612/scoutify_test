<template>
    <div class="chart-container">
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
</template>

<!--  -->
<script lang="js">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March'],
                datasets: [
                    {
                        data: [1, 2, 3],
                        borderColor: '#36A2EB',
                        backgroundColor: '#9BD0F5',
                    },
                    {
                        data: [2, 3, 4],
                        borderColor: '#FF6384',
                        backgroundColor: '#FFB1C1',
                    },
                    {
                        data: [3, 4, 5],
                        borderColor: '#F869D4',
                        backgroundColor: '#9647EE',
                    }
                ]
            },
            chartOptions: {
                responsive: true
            }
        }
    }
}
</script>

<style scoped>
.chart-container {
    /* width: 60%;
    height: 80%; */
    display: flex;
    text-align: center;
    flex-direction: column;
    margin: 10%;
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>