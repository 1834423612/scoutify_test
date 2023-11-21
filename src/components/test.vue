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
<script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
</template>

<script setup>
//Assumptions: We will always engage. We will score for high, then mid, then low, but because we never will get to the low grid, we don't have to account for it
let balancingtime = [3, 5, 7];//it can take either 3 seconds, 5 seconds, or 7 seconds
let pointsforbalancing = [12, 10];//auton and teleop
let placetime = [2, 4];
let pointsforhigh = [6, 5];//auton and teleop
let pointsformid = [4, 3];
let autonpickup = [2, 4];
let autonmovepartofcycle = [4,6];
let movepartofcycle =  [7, 9, 11];
const autonPieceLimit = 5;
const scenariospoints=new Array(balancingtime.length).fill(new Array(placetime.length).fill(new Array(autonpickup.length).fill(new Array(autonmovepartofcycle.length).fill(new Array(movepartofcycle.length).fill(new Array(0))))));//for chart

//create a scenario tree
for (let i in balancingtime) {
    for (let j in placetime) {
        for (let k in autonpickup) {
            for (let l in autonmovepartofcycle) {
                for (let m in movepartofcycle) {
//initilize the variables
let linkrankpointcounter=0;
let nodesscored=0;
let autonPCCount = 0;
let holdingpiece=1;//start w/ holding one piece

//auton balance
let points=pointsforbalancing[0]+3;//the three is for mobility
let time=150-balancingtime[i];
scenariospoints[i][j][k][l][m].push({x: 150-time, y: points});

//place pieces during auton
while (time - placetime[j] >= 135 && autonPCCount < autonPieceLimit) {
points+=pointsforhigh[0]*holdingpiece;
            ++nodesscored;
	if (nodesscored % 3===0){points+=5;}
            time -= placetime[j];
	autonPCCount+=holdingpiece;
            holdingpiece = 0;
	scenariospoints[i][j][k][l][m].push({x: 150-time, y: points});
            if (time - autonmovepartofcycle[l]/2 - autonpickup[k] >= 135) {//the autonmovepartofcycle[l] is divided by two b/c the robot only travels to pickup station, not back 
            	time -= autonmovepartofcycle[l]/2 + autonpickup[k];
            	++holdingpiece;
if(time-autonmovepartofcycle[l]/2-placetime[j]>=135){time-=autonmovepartofcycle[l]/2;}
else{time=135;}
}
  }
//endgame
time = 135 - balancingtime[i];
points += pointsforbalancing[1];
scenariospoints[i][j][k][l][m].push({x: 150-time, y: points});
//teleop
// if holding pieces at beginning of teleop
if (holdingpiece>0) {
++nodesscored;
points+=pointsforhigh[1]*holdingpiece;
holdingpiece = 0;
time-= placetime[j];
if (nodesscored % 3===0){points+=5;}//test for links
	scenariospoints[i][j][k][l][m].push({x: 150-time, y: points});
}
//score high and mid
while (time-movepartofcycle[l]-placetime[j]>=0) {
++nodesscored;
time-=placetime[j]+movepartofcycle[l]+autonpickup[k];
if(nodesscored<=9){points += pointsforhigh[1];}
else{points+= pointsformid[1];}
if (nodesscored % 3===0){points +=5;}
scenariospoints[i][j][k][l][m].push({x: 150-time, y: points});
}
if (Math.floor(nodesscored / 3) > 3) { linkrankcounter=1; }
                }
            }
        }
    }
}
const xyValues =[scenariospoints[0][0][0][0][0][0]];

//for(let i in scenariospoints[0][0][0][0][0][i]){xyValues.push(scenariospoints[0][0][0][0][0][i]);}

document.write(xyValues);

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
        yAxes: [{ticks: {min: 0, max:120}}],
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
