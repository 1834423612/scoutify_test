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
    
class Scoringmethods{
    constructor(mintime,maxtime,points,parkcounter,numberparked,linkcounter,gamepiece){
    this.mintime=mintime;
    this.maxtime=maxtime;
    this.points=points;
    this.parkcounter=parkcounter;//0 for none,1 for docked,2for engaged
    this.numberparked=numberparked;
    this.linkcounter=linkcounter;//0 for none, 1 for low,2 for mid, 3 for high
    this.gamepiece=gamepiece;//cube or cone
    }
    function play(arr1,arr2){
        if(this.parkcounter){arr1[0]+=this.points;}
        if(this.linkcounter){arr2[this.linkcounter-1][0]+=1;}
    }
}
let _parkcounter = [0, 30];// need to score 30 balancing points to get ranking point. array is formatted: [current,threshold]
let _linkcounter = [[0, 3],[0,3],[0,3]];//each link is plus 5 points. 3 arrays b/c low mid and high can't be combined into a link.
let _linkscounter = [0, 5];//need only 4 assuming coop for ranking point -add coop in much later
let gamepiecestart ='cube';//not sure what were going to do to change this during the code to see the different possibilities
const parknone    = new Scoringmethods(0,0,0,0,0,0,0);
const autondock   = new Scoringmethods(2,5,5,1,1,0,0);
const autonengage = new Scoringmethods(3,7,10,1,1,0,0);
const cubelow     = new Scoringmethods(2,5,1,0,0,1,'cube');
const cubemid     = new Scoringmethods(2,5,2,0,0,2,'cube');
const cubehigh    = new Scoringmethods(3,7,3,0,0,3,'cube');
const conelow     = new Scoringmethods(2,5,1,0,0,1,'cone');
const conemid     = new Scoringmethods(2,5,2,0,0,2,'cone');
const conehigh    = new Scoringmethods(3,7,3,0,0,3,'cone');
const endparknone= new Scoringmethods(0,0,0,0,0,0,0);
const enddock1   = new Scoringmethods(2,5,5,1,1,0,0);
const endengage1 = new Scoringmethods(3,7,10,1,1,0,0);
const enddock2   = new Scoringmethods(2,5,5,1,2,0,0);
const endengage2 = new Scoringmethods(3,7,10,1,2,0,0);
const enddock3   = new Scoringmethods(2,5,5,1,3,0,0);
const endengage3 = new Scoringmethods(3,7,10,1,3,0,0);

const auton = {
 park: [parknone,autondock, autonengage],
 scoring: [cubelow, cubemid, cubehigh, conelow, conemid, conehigh]
}
const endgame = {park: [endparknone,enddock1,enddock2,endengage2,enddock3]}
const teleop={scoring:[cubelow, cubemid, cubehigh, conelow, conemid, conehigh]}

const autonscenarios = {}// to add a scenario, set scenario1:[[time left,points,ranking points,park counters],[methods and their order]]
/*
// loop through the different parking options
//the first version of this will only take into account the max times, then we'll expand the code
for (let i = 0; i < auton.park.length; i++) {
    autonscenarios['scenerio' + `${i}`][0][0] = 15-auton.park[i].time[1];//set time to 15 seconds minus the time to park
    autonscenarios['scenerio' + `${i}`][1].push(auton.park[i]);//add the parking scenerio to the scenario
    
    let stall = false; // [stall=true] means there's no time for another method
    while (autontime > 0 || stall === false) { }*/
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
