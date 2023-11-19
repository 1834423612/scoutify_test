<template>
    <div class="card">
        <div class="card-inner">
            <h2>Game Scoring System</h2>
            <div>
                <label for="auton-time">Auton Time (seconds): </label>
                <input id="auton-time" type="number" v-model.number="auton" />
            </div>
            <div>
                <label for="teleop-time">Teleop Time (seconds): </label>
                <input id="teleop-time" type="number" v-model.number="teleop" />
            </div>
            <div>
                <label for="endgame-time">Endgame Time (seconds): </label>
                <input id="endgame-time" type="number" v-model.number="endgame" />
            </div>
            <button @click="calculateScores">Calculate Scores</button>

            <!-- Click Button Function/Activity -->
            <div v-if="scoreCalculated">
                <!-- Output/Show Events At here -->
            </div>
            <!-- <div v-if="scoreCalculated">
            <h3>Scores:</h3>
            <p>Auton Score: {{ testscores[0] }}</p>
            <p>Teleop Score: {{ testscores[1] }}</p>
            <p>Endgame Score: {{ testscores[2] }}</p>
            <p>Total Score: {{ score }}</p>
        </div> -->
        </div>
    </div>

    <!-- Result Card -->
    <div v-if="scoreCalculated" class="result-card">
        <h3>Calculated Scores:</h3>
        <p>Auton Score: {{ testscores[0] }}</p>
        <p>Teleop Score: {{ testscores[1] }}</p>
        <p>Endgame Score: {{ testscores[2] }}</p>
        <p>Total Score: {{ score }}</p>
    </div>
    <canvas id="myChart" style="width:100%;max-width:700px"></canvas>
</template>

<script setup>
import { Scatter } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
//need to import the correct things (the things above obviosly aren't the rigt) from chartjs make sure that its a scatter graph
//new code: Mr. Shaw informed us were allowed to make certain assumtions: We will at least engage one bot every time. We will score for high, then mid, then low, but because we never will get to the low grid, we don't have to account for this
let balancingtime = [3, 5, 7];//not min max times, but either 3 seconds, 5 seconds, or seven seconds.
let pointsforbalancing = [12, 10];//auton and teleop
let placetime            = [2, 4];
let pointsforhigh        = [6, 5];//auton and teleop
let pointsformid         = [4, 3];
let autonpickup          = [2, 4];
let autonmovepartofcycle = [4,6];
let movepartofcycle      = [7, 9, 11];
let nodesscored          = new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length)))));
let holdingpiece         = new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length)))));
let time                 = new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length)))));
let points               = new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length)))));
let linkcounter          = new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length)))));//5 arrays
const autonPieceLimit    = 5;
const xyValues = [{x:0,y:0}];//for chart
//calculate auton and endgame engage in one step
for (let i in balancingtime) {
    for (let j in placetime) {
        for (let k in autonpickup) {
            for (let l in autonmovepartofcycle) {
                for (let m in movepartofcycle) {
            //auton
                //set variable default values
                    holdingpiece[i][j][k][l][m] = true;
                    nodesscored[i][j][k][l][m]=0;
                    let autonPCCount = 0;
                //balance
                    time[i][j][k][l][m] = 150 - balancingtime[i];
                    points[i][j][k][l][m] = pointsforbalancing[0]; //auton
                //place pieces on grid
                    while (time[i][j][k][l][m] - placetime[j] >= 135 && autonPCCount < autonPieceLimit) {
                        points[i][j][k][l][m]+=pointsforhigh[0];
                        ++nodesscored[i][j][k][l][m];
                        time[i][j][k][l][m] -= placetime[j];
                        holdingpiece[i][j][k][l][m] = false;
                        if (time[i][j][k][l][m] - autonmovepartofcycle[l]/2 - autonpickup[k] >= 135) {//the autonmovepartofcycle[l] is divided by two b/c the robot only travels to pick up the cones, not also back 
                            time[i][j][k][l][m] -= autonmovepartofcycle[l]/2 + autonpickup[k];
                            holdingpiece[i][j][k][l][m] = true;
                            if(time[i][j][k][l][m]-autonmovepartofcycle[l]/2-placetime[j]<135){time[i][j][k][l][m]=135;}
                            else{time[i][j][k][l][m]-=autonmovepartofcycle[l]/2;}
                        }
                        ++autonPCCount;
                    }
            //endgame
                    time[i][j][k][l][m] = 135 - balancingtime[i];
                    points[i][j][k][l][m] += pointsforbalancing[1];
             //calculate teleop (start w/ the scenario where the robot has something already in it and then do the general scenarios (this was the sole purpose of the holdingpiece variable))
                    if (holdingpiece[i][j][k][l][m] === true) {
                        holdingpiece[i][j][k][l][m] = false;
                        ++nodesscored[i][j][k][l][m];
                        points[i][j][k][l][m]+=pointsforhigh[1];
                        time[i][j][k][l][m] -= placetime[j];
                    }
            //general scenario
                //do high score
                    while (time[i][j][k][l][m]-movepartofcycle[l]-placetime[j]>=0 && nodesscored[i][j][k][l][m] !== 9) {
                        ++nodesscored[i][j][k][l][m];
                        time[i][j][k][l][m] -=placetime[j]+movepartofcycle[l]+autonpickup[k];
                        points[i][j][k][l][m] += pointsforhigh[1];
                    }
                //do mid score
                    while (time[i][j][k][l][m]-movepartofcycle[l]-placetime[j]>=0) {
                        ++nodesscored[i][j][k][l][m];
                        time[i][j][k][l][m] -= placetime[j]+movepartofcycle[l]+autonpickup[k];
                        points[i][j][k][l][m] += pointsformid[1];
                    }
                    points[i][j][k][l][m] += (Math.floor(nodesscored[i][j][k][l][m] / 3) * 5);
                    if (Math.floor(nodesscored[i][j][k][l][m] / 3) > 3) { linkcounter[i][j][k][l][m]=1; }
                }
            }
        }
    }
}
/*console.log(points)
let word = "these scenarios include a rankpoint from links";
if (!(linkcounter.includes(1))) { word = "these scenarios don't include a rankpoint from links"; }
console.log.println(word);*/

//chart
//{x:150, y:15}
//for(let i=0;i<10;i++){xyValues.push({x:150,y:15});}

window.addEventListener("load", function(event) { //only initialize chart once window loads completely to avoid context issues
    new Chart("myChart", {
    type: "scatter",
    data: {
        datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgb(0,0,255)",
        data: xyValues
        }]
    },
    options: {
        legend: {display: false},
        scales: {
        xAxes: [{ticks: {min: 0, max:150}}],
        yAxes: [{ticks: {min: 30, max:120}}],
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
