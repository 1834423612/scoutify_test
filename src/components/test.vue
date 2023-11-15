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

class Scoringmethods {
    constructor(mintime, maxtime, points, parkcounter, numberparked, linkcounter, gamepiece) {
        this.mintime = mintime;
        this.maxtime = maxtime;
        this.points = points;
        this.parkcounter = parkcounter;//0 for none,1 for docked,2for engaged
        this.numberparked = numberparked;
        this.linkcounter = linkcounter;//0 for none, 1 for low,2 for mid, 3 for high
        this.gamepiece = gamepiece;//cube or cone
    }
    place(arr0, arr1, arr2) {//time,points,linkcounter
        arr0 -= this.maxtime;//change this evetually from max time to a range
        arr1 += this.points;
        if (this.linkcounter) { arr2[this.linkcounter - 1][0] += 1; }
    }
    park(arr0, arr1, arr2) {//time,points,parkcounter
        arr0 -= this.maxtime;
        arr1 += this.points * this.numberparked;
        arr2 += this.points * this.numberparked;
    }
}
//might use these counters below
//when to use a counter: counters are to be used during complex rules of the game e.g. if you score 3 game pieces in a row, you get 5 additiional points. this will be calculated in an array like this: [value (in this case how many game pieces in a row you scored),threshold value (in this case three)]. Note that (counter[0] % counter[1]) is the number of links scored and each link is 5 points
//let _parkcounter = [0, 30];// need to score 30 balancing points to get ranking point
//let _linkcounter = [[0, 3],[0,3],[0,3]];//each link is plus 5 points. 3 arrays b/c low mid and high can't be combined into a link.
//let _linkscounter = [0, 5];//need only 4 assuming coop for ranking point -add coop in much later probably w/ another counter

//i commented out certain ways to score, to put them back in (don't), add the name in the scoring property of the game objects (around line 100)
//const parknone = new Scoringmethods(0, 0, 0, 0, 0, 0, 0);
const autondock = new Scoringmethods(2, 5, 5, 1, 1, 0, 0);
const autonengage = new Scoringmethods(3, 7, 10, 2, 1, 0, 0);
const auton1conemid = new Scoringmethods(2, 8, 2, 0, 0, 2, 'cone');//auton1 is the preloaded, and therefore the time is different than normal cone 
const auton1conehigh = new Scoringmethods(3, 10, 3, 0, 0, 3, 'cone');
const auton2conemid = new Scoringmethods(2, 8, 2, 0, 0, 2, 'cone');//auton2 isn't preloaded, but is closer and therefore the time is different than normal cone
const auton2conehigh = new Scoringmethods(3, 10, 3, 0, 0, 3, 'cone');
const conemid = new Scoringmethods(2, 8, 2, 0, 0, 2, 'cone');
const conehigh = new Scoringmethods(3, 10, 3, 0, 0, 3, 'cone');
//const cubelow = new Scoringmethods(2, 7, 1, 0, 0, 1, 'cube');
//const cubemid = new Scoringmethods(2, 8, 2, 0, 0, 2, 'cube');
//const cubehigh = new Scoringmethods(3, 10, 3, 0, 0, 3, 'cube');
//const conelow = new Scoringmethods(2, 7, 1, 0, 0, 1, 'cone');
//const endparknone = new Scoringmethods(0, 0, 0, 0, 0, 0, 0);
const enddock1 = new Scoringmethods(2, 5, 5, 1, 1, 0, 0);
const endengage1 = new Scoringmethods(3, 7, 10, 2, 1, 0, 0);
const enddock2 = new Scoringmethods(2, 5, 5, 1, 2, 0, 0);
const endengage2 = new Scoringmethods(3, 7, 10, 2, 2, 0, 0);
const enddock3 = new Scoringmethods(2, 5, 5, 1, 3, 0, 0);
const endengage3 = new Scoringmethods(3, 7, 10, 2, 3, 0, 0);

//define the game objects
const auton = {
    park: [autondock, autonengage],
    scoring: [auton1conemid, auton1conehigh, auton2conemid, auton2conehigh]
}
const endgame = { park: [enddock1, enddock2, endengage2, enddock3, endengage3] }
const teleop = { scoring: [conemid, conehigh] }

//scenario objects
const autonscenarios = {}// to add a scenario, set scenario1:[[time left,points,park counters,linkcounter,linkcounters],[methods and their order]]
const endgamescenarios = {}
const teleopcenarios = {}

//the first version of this will only take into account the max times, then we'll expand the code
// loop through the different parking options (dock vs engage)
for (let i in auton.park) {
    //park
   //then go through two scenarios (auton1conemid, auton1conehigh)
   //then check time left, if there's time, do the scenarios (auton2conemid, auton2conehigh)
    //repeat line above

    //we should try to make more efficient arrays ==> instead of describing teleop scenario A as "conemid,conehigh,conemid" and Teleop scenario B like "conemid,conalemid, conehigh", we could try describing it as one array [["conemid",2],["conehigh",1]];
    //there still will be too many scenarios, so I also removed all the cube objects. note this isn't equal to a cone only robot b/c a cone only robot can't score links
    //Still, I had to remove the option of not parking durin auton or endgame to reduce the number of scenarios. This seemed safe b/c it's smarter to dock/park than to not park/dock
    //I also removed the low scoring option b/c there were still too many scenarios
    //note that an array's maximum length is 2^32
    //acordingly, we have 15 auton scenarios, and 5 endgame scenarios
    
    
    //my failed attempt
    /* let as = autonscenarios[auton.park[i].keys];
    as[1].push(auton.park[i].keys);//don't know how keys work, will this work to store the name of the method of scoring?
    auton.park[i].park(as[0][0], as[0][1], as[0][2]);//arguments are (time,points,parkcounter)
    let stall = false; // [stall=true] means there's no time for another method
    while (as[0][0] > 0 && stall === false) {
        for (let j in auton.scoring) {
            //check time
            if (auton.scoring[j][1] <= as[0][0]) { }//this is getting complicated w/ the teleop potentioally having 100 sub sub scenarios, we have to change something.
        }
    }
    */

    
}
//endgame
// loop through the different parking options (dock vs engage and 1 player vs 2 players vs 3 players)
let teleop=135;
for (let i in endgame.park) {
    //park w/ the function: endgame.park(teleop,access points property of endgame.park[i],access park counter property of endgame.park[i])
}
//teleop
for (let i in teleop.scoring) {
    //do scoring scenarios
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
