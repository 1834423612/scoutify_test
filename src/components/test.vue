<template>
<h1>Charts:</h1>
    <div style="display:block;">
        <p>Ranking Points (from making 5 links)-Scenario</p>
        <canvas id="rnkpntChart" style="width:100%;max-width:400px"></canvas>
    </div>
    <div style="display:block;">
        <p>Total Score-Scenario</p>
        <canvas id="psChart" style="width:100%;max-width:400px"></canvas>
    </div>
     <div style="display:block;">
        <p>Piecesscored-Scenario</p>
        <canvas id="piecesscoredchart" style="width:100%;max-width:400px"></canvas>
    </div>
    
    <div style="display:block;">
        <p>Pieces Scored-Seconds:</p>
        <canvas id="psotchart" style="width:100%;max-width:500px"></canvas>
    </div>
    <div style="display:block;">
        <p>Score-Seconds</p>
        <canvas id="myChart" style="width:100%;max-width:500px"></canvas>
    </div>

    <!-- <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script> -->
</template>

<script>
// Replace the Cloudflare Chart.js link to local NPM Packages.
// import the Chart.js
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

/*  ##########################

      Chart Config Template
      (NOT FINISHED, Just for TEST!!!)

    ##########################
*/  

export default {
  name: 'App',
  components: {
    Scatter
  },
  data() {
    return ChartConfig
  }
}
	
//Assumptions: We will always engage. We will score for high, then mid, then low, but because we never will get to the low grid, we don't have to account for it
        const balancingtime = [3, 5, 7];//it can take either 3 seconds, 5 seconds, or 7 seconds
        const pointsforbalancing = [12, 10];//auton and teleop
        const placetime = [2, 4];
        const pointsforbestscorer = [6, 5];// high nodes: auton and teleop
        const pointsforokscorer = [4, 3];//mid nodes
        const pickuptime = [2, 4];
        const autonmovepartofcycle = [4, 6];
        const movepartofcycle = [7, 9, 11];
        const autonPieceLimit = 5;
        const pointsformobility = 3;
        const grabamount = [1];//for games where you can grab more than one piece
        const scenariospoints = new Array(balancingtime.length).fill(
            new Array(placetime.length).fill(
                new Array(pickuptime.length).fill(
                    new Array(autonmovepartofcycle.length).fill(
                        new Array(movepartofcycle.length).fill(
                            new Array(grabamount.length).fill(
                                new Array(0)
                            )
                        )
                    )
                )
            )
        );//for chart

        const rnkValues = [];
        const piecesoverscenarios = [];
        const totalscores = [];
        const piecesscoredovertime = new Array(balancingtime.length).fill(
            new Array(placetime.length).fill(
                new Array(pickuptime.length).fill(
                    new Array(autonmovepartofcycle.length).fill(
                        new Array(movepartofcycle.length).fill(
                            new Array(grabamount.length).fill(
                                new Array(0)
                            )
                        )
                    )
                )
            )
        );

        let decodescenario = (a) =>
            a.charAt(0) * placetime.length * pickuptime.length * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length +
            a.charAt(1) * pickuptime.length * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length +
            a.charAt(2) * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length +
            a.charAt(3) * movepartofcycle.length * grabamount.length +
            a.charAt(4) * grabamount.length +
            a.charAt(5) * 1;//the multiplication by one switches the type from string to number so that the a.charAt(4) is added instead of concatenated

        //create a scenario tree
        for (let i in balancingtime) {
            for (let j in placetime) {
                for (let k in pickuptime) {
                    for (let l in autonmovepartofcycle) {
                        for (let m in movepartofcycle) {
                            for (let n in grabamount) {
                                //initialize the variables
                                let piecesscored = 0;
                                let holdingpiece0 = 1;//start w/ holding one piece
                                let time = 150;
                                let points = pointsformobility + pointsforbalancing[0];//will always strive to make a robot that can get the mobility points
                                //auton
                                //auton balance
                                if (pointsforbalancing[0] !== 0) { time -= balancingtime[i]; }//only subtract balancing time if auton-balance is allowed
                                scenariospoints[i][j][k][l][m][n].push({ x: 150 - time, y: points });
                                //place pieces during auton
                                while (time - placetime[j] >= 135 && piecesscored < autonPieceLimit) {
                                    points += pointsforbestscorer[0] * holdingpiece0;
                                    piecesscored += holdingpiece0;
                                    if (piecesscored % 3 === 0) { points += 5; }
                                    time -= placetime[j];
                                    holdingpiece0 = 0;
                                    scenariospoints[i][j][k][l][m][n].push({ x: 150 - time, y: points });
                                    piecesscoredovertime[i][j][k][l][m][n].push({ x: 150 - time, y: piecesscored });
                                    if (time - autonmovepartofcycle[l] / 2 - pickuptime[k] >= 135) {//the autonmovepartofcycle[l] is divided by two b/c the bot only travels to pick up game pices, not also back 
                                        time -= autonmovepartofcycle[l] / 2 + pickuptime[k];
                                        holdingpiece0 += grabamount[n];
                                        if (piecesscored + holdingpiece0 > autonPieceLimit) { holdingpiece0 = autonPieceLimit - piecesscored }//prevents holding more pieces than allowed given the autonPieceLimit and the pieces already scored: this is needed in a game where you can pick up more than one piece at a time
                                        if (time - autonmovepartofcycle[l] / 2 - placetime[j] >= 135) { time -= autonmovepartofcycle[l] / 2; }
                                        else { time = 135; }
                                    }
                                }
                                //teleop
                                time = 135;
                                // if holding pieces at beginning of teleop
                                if (holdingpiece0 > 0) {
                                    piecesscored += holdingpiece0;
                                    points += pointsforbestscorer[1] * holdingpiece0;
                                    holdingpiece0 = 0;
                                    time -= placetime[j];
                                    if (piecesscored % 3 === 0) { points += 5; }//test for links
                                    scenariospoints[i][j][k][l][m][n].push({ x: 150 - time, y: points });
                                    piecesscoredovertime[i][j][k][l][m][n].push({ x: 150 - time, y: piecesscored });
                                }
                                //score high and mid
                                while (((time - pickuptime[k] - movepartofcycle[l] - placetime[j]-balancingtime[i]>= 0)&&(pointsforbalancing[1] !== 0))||((time - pickuptime[k] - movepartofcycle[l] - placetime[j]>= 0)&&(pointsforbalancing[1] === 0))) {//if we want the program to see how much slower we can be w/out worsening score changing the 0 in ">=0" to some other number is a start.
                                    piecesscored += grabamount[n];
                                    time -= placetime[j] + movepartofcycle[l] + pickuptime[k];
                                    if (piecesscored <= 9) { points += pointsforbestscorer[1] * grabamount[n]; }
                                    else { points += pointsforokscorer[1] * grabamount[n]; }
                                    if (piecesscored % 3 === 0) { points += 5; }
                                    scenariospoints[i][j][k][l][m][n].push({ x: 150 - time, y: points });
                                    piecesscoredovertime[i][j][k][l][m][n].push({ x: 150 - time, y: piecesscored });
                                }
                                //endgame
                                if (pointsforbalancing[1] !== 0) {
                                    points += pointsforbalancing[1];
                                    time -= balancingtime[i];
                                }
                                scenariospoints[i][j][k][l][m][n].push({ x: 150 - time, y: points });

                                let x = decodescenario('' + i + j + k + l + m + n);
                                if (Math.floor(piecesscored / 3) > 3) { rnkValues.push({ x: x, y: 1 }) }
                                else { rnkValues.push({ x: x, y: 0 }) }
                                totalscores.push({ x:x , y: points })
                                piecesoverscenarios.push({ x:x , y: piecesscored })
                            }
                        }
                    }
                }
            }
        }

        const xyValues = [];
        const psotValues = [];//pieces scored over time
        //figure out which scenario each scatter point belongs to by defining the endpoints of each data set
        const endpoints = [-1];//its -1 b/c it's the ending-point in a scenario where nothing happens: it was done like this so the next scenario starts w/ zero (-1+1=0). I added one b/c the endpoint of one scenario is 1 plus the startpoint of another scenario.
        for (let i = 0; i < scenariospoints[0][0][0][0][0][0].length - 1; i++) {
            if (scenariospoints[0][0][0][0][0][0][i].x > scenariospoints[0][0][0][0][0][0][i + 1].x) { endpoints.push(i); }
        }
        endpoints.push(scenariospoints[0][0][0][0][0][0].length);

        const endpointsofpsotValues = [-1];
        for (let i = 0; i < piecesscoredovertime[0][0][0][0][0][0].length - 1; i++) {
            if (piecesscoredovertime[0][0][0][0][0][0][i].x > piecesscoredovertime[0][0][0][0][0][0][i + 1].x) { endpointsofpsotValues.push(i); }
        }
        endpointsofpsotValues.push(piecesscoredovertime[0][0][0][0][0][0].length);


        const scenario = '000000';
        const b = decodescenario(scenario);

        const startpoint = endpoints[b] + 1;//an accessor
        const endpoint = endpoints[b + 1];

        const startpointofpsotValues = endpointsofpsotValues[b] + 1;//an accessor
        const endpointofpsotValues = endpointsofpsotValues[b + 1];

        //for each point in the given range, push a point to the xyValues array
        for (let i = startpoint; i < endpoint+1; i++) { xyValues.push(scenariospoints[0][0][0][0][0][0][i]); }
        for (let i = startpointofpsotValues; i < endpointofpsotValues+1; i++) { psotValues.push(piecesscoredovertime[0][0][0][0][0][0][i]); }
        window.addEventListener("load", function (event) { //only initialize chart once window loads completely to avoid context issues
            
            var scoretimechart = new Chart("myChart", {
                type: "scatter",
                data: {
                    datasets: [{
                        pointRadius: 4,
                        pointBackgroundColor: "rgb(0,0,255)",
                        data: xyValues
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

            var rnkpntchart = new Chart("rnkpntChart", {
                type: "scatter",
                data: {
                    datasets: [{
                        pointRadius: 4,
                        pointBackgroundColor: "rgb(255,0,0)",
                        data: rnkValues
                    }]
                },
                options: {
                    onClick: function (evt) {
                        var element = rnkpntchart.getElementAtEvent(evt);
                        if (element.length > 0) {
                            var ind = element[0]._index;
                            if (confirm('Do you want to see this scenario?')) { alert(ind); }
                        }
                    },
                    legend: { display: false },
                    scales: {
                        xAxes: [{ ticks: { min: 0, max: balancingtime.length * placetime.length * pickuptime.length * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length } }],
                        yAxes: [{ ticks: { min: 0, max: 1, stepSize: 1 } }],
                    }
                }
            });
            var piecesschart = new Chart("piecesscoredchart", {
                type: "scatter",
                data: {
                    datasets: [{
                        pointRadius: 4,
                        pointBackgroundColor: "rgb(255,255,0)",
                        data: piecesoverscenarios
                    }]
                },
                options: {
                    onClick: function (evt) {
                        var element = piecesschart.getElementAtEvent(evt);
                        if (element.length > 0) {
                            var ind = element[0]._index;
                            if (confirm('Do you want to see this scenario?')) { alert(ind); }
                        }
                    },
                    legend: { display: false },
                    scales: {
                        xAxes: [{ ticks: { min: 0, max: balancingtime.length * placetime.length * pickuptime.length * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length } }],
                        yAxes: [{ ticks: { min: 0, max: 20 } }],
                    }
                }
            });
            
            var pschart = new Chart("psChart", {
                type: "scatter",
                data: {
                    datasets: [{
                        pointRadius: 4,
                        pointBackgroundColor: "rgb(255,255,0)",
                        data: totalscores
                    }]
                },
                options: {
                    onClick: function (evt) {
                        var element = pschart.getElementAtEvent(evt);
                        if (element.length > 0) {
                            var ind = element[0]._index;
                            if (confirm('Do you want to see this scenario?')) { alert(ind); }
                        }
                    },
                    legend: { display: false },
                    scales: {
                        xAxes: [{ ticks: { min: 0, max: balancingtime.length * placetime.length * pickuptime.length * autonmovepartofcycle.length * movepartofcycle.length * grabamount.length} }],
                        yAxes: [{ ticks: { min: 0, max: 120 } }],
                    }
                }
            });

            var psotchart = new Chart("psotchart", {
                type: "scatter",
                data: {
                    datasets: [{
                        pointRadius: 4,
                        pointBackgroundColor: "rgb(0,0,255)",
                        data: psotValues
                    }]
                },
                options: {
                    legend: { display: false },
                    scales: {
                        xAxes: [{ ticks: { min: 0, max: 150} }],
                        yAxes: [{ ticks: { min: 0, max: 20 } }],
                    }
                }
            });
        });
</script>
<style>
.card {
    display: flex;
    text-align: center;
    margin: auto;
    background-color: aliceblue;
    border-radius: 15px;
    width: 50%;
    height: 35%;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-inner {
    margin: 15px;
    overflow: auto;
}

.result-card {
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
