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
</template>

<script setup>

// orderby score, ranking points
// graph function needs data points
// make objects of the scenerios
// calc auton, endgame, and then teleop, note the teleop time isn't const

let rnkpntcounter = [0, 30];// need to score 30 balancing points to get ranking point
const autondock = { points: 5, time: [2, 5], rankingpointcounter: true }
const autonengage = { points: 10, time: [3, 7], rankingpointcounter: true }
const parknone = { points: 0, time: [0, 0] }
const gamepiece = { cone: false, cube: true }
const scoringmethod1 = { points: 1, time: [2, 5] }// cube low
const scoringmethod2 = { points: 2, time: [2, 5] }// cube mid
const scoringmethod3 = { points: 3, time: [3, 7] }// cube high
const scoringmethod4 = { points: 1, time: [2, 5] }// cone low
const scoringmethod5 = { points: 2, time: [2, 5] }// cone mid
const scoringmethod6 = { points: 3, time: [3, 7] }// cone high
const autonscenarios = {}// to add a scenario, set scenario1:[[extra time durning auton,points,ranking points,ranking point counters],[methods and their order]]
const auton = {
    park: [autondock, autonengage, parknone],
    scoring: [scoringmethod1, scoringmethod2, scoringmethod3, scoringmethod4, scoringmethod5, scoringmethod6]
}
const endgamedock1 = {}// endgame park
// teleop scoring methods go here

// loop through the different parking options
for (let i = 0; i < auton.parking.length; i++) {
    autonscenarios['scenerio' + `${i}`][1][i] = 20; // TEST VALUE, Change the number HERE!!!!
    autonscenarios['scenerio' + `${i}`][0][0] = 15;
    let stall = false; // [stall=true] means there's no time for another method
    while (autontime > 0 || stall === false) { }
}
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
