/*  ##########################

      Chart Config Beginning

    ##########################
*/

export default {
    setup() {
      const myChartRef = ref(null);
      const rnkpntChartRef = ref(null);
  
      const initCharts = () => {
        new Chart(myChartRef.value, {
          type: 'scatter',
          data: {
            datasets: [{
              pointRadius: 4,
              pointBackgroundColor: 'rgb(0,0,255)',
              data: xyValues // Replace with your data
            }]
          },
          options: {
            legend: { display: false },
            scales: {
              xAxes: [{ ticks: { min: 0, max: 150 } }],
              yAxes: [{ ticks: { min: 0, max: 120 } }],
            }
          }
        });
  
        new Chart(rnkpntChartRef.value, {
          type: 'scatter',
          data: {
            datasets: [{
              pointRadius: 4,
              pointBackgroundColor: 'rgb(255,255,0)',
              data: rnkValues // Replace with your data
            }]
          },
          options: {
            legend: { display: false },
            scales: {
              xAxes: [{ ticks: { min: 0, max: balancingtime.length * placetime.length * autonpickup.length * autonmovepartofcycle.length * movepartofcycle.length } }],
              yAxes: [{ ticks: { min: 0, max: 1, stepSize: 1 } }],
            }
          }
        });
      };
  
      onMounted(() => {
        initCharts();
      });
  
      return {
        myChartRef,
        rnkpntChartRef
      };
    }
  };







// window.addEventListener("load", function (event) { //only initialize chart once window loads completely to avoid context issues
//         new Chart("myChart", {
//             type: "scatter",
//             data: {
//                 datasets: [{
//                     pointRadius: 4,
//                     pointBackgroundColor: "rgb(0,0,255)",
//                     data: xyValues
//                 }]
//             },
//             options: {
//                 legend: { display: false },
//                 scales: {
//                     xAxes: [{ ticks: { min: 0, max: 150 } }],
//                     yAxes: [{ ticks: { min: 0, max: 120 } }],
//                 }
//             }
//         });
    
//         new Chart("rnkpntChart", {
//             type: "scatter",
//             data: {
//                 datasets: [{
//                     pointRadius: 4,
//                     pointBackgroundColor: "rgb(255,255,0)",
//                     data: rnkValues
//                 }]
//             },
//             options: {
//                 legend: { display: false },
//                 scales: {
//                     xAxes: [{ ticks: { min: 0, max: balancingtime.length * placetime.length * autonpickup.length * autonmovepartofcycle.length * movepartofcycle.length } }],
//                     yAxes: [{ ticks: { min: 0, max: 1, stepSize: 1 } }],
//                 }
//             }
//         });
//     });