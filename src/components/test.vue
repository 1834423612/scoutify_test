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
let tick = 0;//have yet to use this, probably won't need it
//new code: Mr. Shaw informed us were allowed to make certain assumtions: We will at least engage one bot every time. We will score for high, then mid, then low, but because we never will get to the low grid, we don't have to account for this
let balancingtime = [3, 5, 7];//not min max times, but either 3 seconds, 5 seconds, or seven seconds.
let pointsforbalancing = [12, 10];//auton and teleop
let points = [[[[]]]];
let placetime = [2, 4];
let highnodesscored = [[[[]]]];
let midnodesscored = [[[[]]]];
let pointsforhigh = [6, 5];//auton and teleop
let pointsformid = [4, 3];
let holdingpiece = [[[[]]]];
let time0 = [];//multiple time arrays for different levels of calculation
let time1 = [[[[]]]];
let autonpickup = [2, 4];
let movepartofcycle = [7, 9, 11];
let linkcounter = [[[[]]]];
//calculate auton and endgame engage in one step
for (let i in balancingtime) {
    time0[i] = 150 - (balancingtime[i] * 2);
}
//calculate auton scoring
for (let i in time0) {
    for (let j in placetime) {
        for (let k in autonpickup) {
            for (let l in movepartofcycle) {
                holdingpiece[i][j][k][l] = true;
                time1[i][j][k][l] = time0[i];
                while ((time1[i][j][k][l] + balancingtime[i] - placetime[j]) >= 135) {
                    points[i][j][k][l] = pointsforbalancing[0] + pointsforbalancing[1] + 3 + pointsforhigh[0];//three for mobility
                    highnodesscored[i][j][k][l]++;
                    time1[i][j][k][l] -= placetime[j];
                    holdingpiece[i][j][k][l] = false;
                    if (time1[i][j][k][l] - autonpickup[k] >= 135 && holdingpiece[i][j][k][l] === false) {
                        time1[i][j][k][l] -= placetime[j];
                        holdingpiece[i][j][k][l] = true;
                    }
                }
                //calculate teleop (start w/ the scenario where the robot has something already in it and then do the general scenarios (this was the sole purpose of the holdingpiece variable))
                time1[i][j][k][l] = 135 - balancingtime[i];
                if (holdingpiece[i][j][k][l] === true) {
                    holdingpiece[i][j][k][l] = false;
                    highnodesscored[i][j][k][l]++;
                    time1[i][j][k][l] -= placetime[j];
                }
                //general scenario
                while (time1[i][j][k][l] - placetime[j] >= 0 && highnodesscored[i][j][k][l] !== 9) {
                    //do high score
                    highnodesscored[i][j][k][l]++;
                    time1[i][j][k][l] -= placetime[j];
                    points[i][j][k][l] += pointsforhigh[1];
                }
                while (time1[i][j][k][l] - placetime[j] >= 0) {
                    midnodesscored[i][j][k][l]++;
                    time1[i][j][k][l] -= placetime[j];
                    points[i][j][k][l] += pointsformid[1];
                }
                points[i][j][k][l] += ((highnodesscored[i][j][k][l] % 3) * 5);
                points[i][j][k][l] += ((midnodesscored[i][j][k][l] % 3) * 5);
                if ((highnodesscored[i][j][k][l] % 3) + (highnodesscored[i][j][k][l] % 3) > 3) { linkcounter[i][j][k][l]++; }

            }
        }
    }
}
let word = "these scenarios include a rankpoint from links";
if (!linkcounter.includes(1)) { word = "these scenarios don't include a rankpoint from links"; }
console.log.println(word);
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
