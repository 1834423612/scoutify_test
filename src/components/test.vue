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
let tick=0;//have yet to use this, probably won't need it
//new code: Mr. Shaw informed us were allowed to make certain assumtions: We will at least engage one bot every time. We will score for high, then mid, then low, but because we never will get to the low grid, we don't have to account for this
let balancingtime=[3,5,7];//not min max times, but either 3 seconds, 5 seconds, or seven seconds.
let pointsforbalancing=[12,10];//auton and teleop
let points=[[[[]]]];
let placetime=[2,4];
let highnodesscored=[[[[]]]];
let midnodesscored =[[[[]]]];
let pointsforhigh=[6,5];//auton and teleop
let pointsformid=[4,3];
let holdingpiece=   [[[[]]]];
let time0=[];//multiple time arrays for different levels of calculation
let time1          =[[[[]]]];
let autonpickup=[2,4];
let movepartofcycle=[7,9,11];
let linkcounter    =[[[[]]]];
//calculate auton and endgame engage in one step
for(let i in balancingtime){
 time0[i]=150-(balancingtime[i]*2);
}
//calculate auton scoring
for(let i in time0){
 for(let j in placetime){
  for(let k in autonpickup){
   for(let l in movepartofcycle){
    holdingpiece[i][j][k][l]=true;
    time1[i][j][k][l]=time0[i];
    while((time1[i][j][k][l]+balancingtime[i]-placetime[j])>=135){
     points[i][j][k][l]=pointsforbalancing[0]+pointsforbalancing[1]+3+pointsforhigh[0];//three for mobility
     highnodesscored[i][j][k][l]++;
     time1[i][j][k][l]-=placetime[j];
     holdingpiece[i][j][k][l]=false;
     if(time1[i][j][k][l]-autonpickup[k]>=135&&holdingpiece[i][j][k][l]===false){
      time1[i][j][k][l]-=placetime[j];
      holdingpiece[i][j][k][l]=true;
     }
    }
//calculate teleop (start w/ the scenario where the robot has something already in it and then do the general scenarios (this was the sole purpose of the holdingpiece variable))
    time1[i][j][k][l]=135-balancingtime[i];
    if(holdingpiece[i][j][k][l]===true){
     holdingpiece[i][j][k][l]=false;
     highnodesscored[i][j][k][l]++;
     time1[i][j][k][l]-=placetime[j];
    }
//general scenario
    while(time1[i][j][k][l]-placetime[j]>=0&&highnodesscored[i][j][k][l]!==9){
    //do high score
     highnodesscored[i][j][k][l]++;
     time1[i][j][k][l]-=placetime[j];
     points[i][j][k][l]+=pointsforhigh[1];
    }
    while(time1[i][j][k][l]-placetime[j]>=0){
     midnodesscored[i][j][k][l]++;
     time1[i][j][k][l]-=placetime[j];
     points[i][j][k][l]+=pointsformid[1];
   }
    points[i][j][k][l]+=((highnodesscored[i][j][k][l] % 3)*5);
    points[i][j][k][l]+=((midnodesscored[i][j][k][l] % 3)*5);
    if((highnodesscored[i][j][k][l] % 3)+(highnodesscored[i][j][k][l] % 3)>4){linkcounter[i][j][k][l]++;}
  }
 }     
}


    
/*extra old code
// orderby score, ranking points
// graph function needs data points
// make objects of the scenerios
// calc auton, endgame, and then teleop, note the teleop time isn't const

class Scoringmethods {
    constructor(mintime, maxtime, points, parkcounter, numberparked, linkcounter) {
        this.mintime = mintime;
        this.maxtime = maxtime;
        this.points = points;
        this.parkcounter = parkcounter;//0 for none,1 for docked,2for engaged
        this.numberparked = numberparked;
        this.linkcounter = linkcounter;//0 for none, 1 for low,2 for mid, 3 for high
    }
    place(arr0, arr1, arr2) {//time,points,linkcounter. These are the return arrays
        arr0 -= this.maxtime;//change this evetually from max time to a range
        arr1 += this.points;
        if (this.linkcounter) { arr2[this.linkcounter - 1][0] += 1; }
    }
    park(arr0, arr1, arr2) {//time,points,parkcounter. These are the return arrays
        arr0 -= this.maxtime;
        arr1 += this.points * this.numberparked;
        arr2 += this.points * this.numberparked;
    }
}
//might use these counters below
//when to use a counter: counters are to be used during complex rules of the game e.g. if you score 3 game pieces in a row, you get 5 additiional points. this will be calculated in an array like this: [value (in this case how many game pieces in a row you scored),threshold value (in this case three)]. Note that (counter[0] % counter[1]) is the number of links scored and each link is 5 points
//let _parkcounter = [0, 26];// need to score 30 balancing points to get ranking point
//let _linkcounter = [[0, 3],[0,3],[0,3]];//each link is plus 5 points. 3 arrays b/c low mid and high can't be combined into a link.
//let _linkscounter = [0, 5];//need only 4 assuming coop for ranking point -add coop in much later probably w/ another counter

// I commented out certain ways to score, to put them back in (don't), add the name in the scoring property of the game objects (around line 92)
//a stands for auton, e stands for endgame, t standsfor teleop. l,m,h stand for low, mid, high
const ae = new Scoringmethods(3, 7, 12, 2, 1, 0);
const am0 = new Scoringmethods(2, 8, 2, 0, 0, 2);//auton0 is the preloaded, and therefore the time is different than normal cone 
const ah0 = new Scoringmethods(3, 10, 3, 0, 0, 3);
const am2 = new Scoringmethods(2, 8, 2, 0, 0, 2);//auton2 isn't preloaded, but is closer and therefore the time is different than normal cone
const ah2 = new Scoringmethods(3, 10, 3, 0, 0, 3);
const m = new Scoringmethods(2, 8, 2, 0, 0, 2);
const h = new Scoringmethods(3, 10, 3, 0, 0, 3);
//const conelow = new Scoringmethods(2, 7, 1, 0, 0, 1);
//we will only engage
const e1 = new Scoringmethods(3, 7, 10, 2, 1, 0);
const e2 = new Scoringmethods(3, 7, 10, 2, 2, 0);//2 stands for 2 bots engaging
const e3 = new Scoringmethods(3, 7, 10, 2, 3, 0);//3 stands for 3 bots engaging
    
//define the game objects
const auton = {
    park: [ae],
    scoring: [[am1, ah1], [am2, ah2]]
}
const endgame = { park: [e1, e2,e3] }
const teleop = { scoring: [m, h] }

//scenario objects
const as = []// to add a scenario, set scenario1:[[time left,points,park counters,linkcounter,linkcounters],[methods and their order]]
const es = []//endgame scenarios
const ts = []//teleopscenarios
    
    //old code
//the first version of this will only take into account the max times, then we'll expand the code
// loop through the different parking options (only one for now)
for (let i in auton.park) {
//loop through the different preloaded scoring options
  for(let j in auton.scoring[0]){
//loop through the differnt scoring options
   for(let k in auton.scoring[1]){
    //park
    let methodname=auton.park[i];
    as.push([15,0,0,[methodname]]); //create a place holder array
    let index=as.length-1;//index of the array holder
    methodname.park(as[index][0],as[index][1],as[index][2]);
    //place piece holding at the start of the game
    methodname=auton.scoring[0][j];
    as[index][3].push(methodname);
    methodname.play();
    //place another piece if time left
    methodname=auton.scoring[1][k];
    if(as[index][0]+methodname[0]>=0){
        as[index][3].push(methodname);
        as.play(as[index][0],as[index][1],as[index][2]);
    }
   } 
  }   
 }
   //then go through two scenarios (auton1conemid, auton1conehigh)
   //then check time left, if there's time, do the scenarios (auton2conemid, auton2conehigh)
   //repeat line above
    

//endgame
// loop through the different parking options (1 player or 2 players or 3 players)
for (let i in endgame.park) {
    //park
    let methodname=endgame.park[i];
    es.push([135,0,0,[methodname]]); //create a place holder array
    let index=es.length-1;//index of the array holder
    methodname.park(es[index][0],es[index][1],es[index][2]);
}
//teleop
//number of loops is 14
for (let i in teleop.scoring) {
 for (let j in teleop.scoring) {
  for (let k in teleop.scoring) {
   for (let l in teleop.scoring) {
    for (let m in teleop.scoring) {
     for (let n in teleop.scoring) {
      for (let o in teleop.scoring) {
       for (let p in teleop.scoring) {
        for (let q in teleop.scoring) {
         for (let r in teleop.scoring) {
          for (let s in teleop.scoring) {
           for (let t in teleop.scoring) {
            for (let u in teleop.scoring) {
             for (let v in teleop.scoring) {
              for (let w in teleop.scoring) {
    
       
              }
             }
            }  
           }
          }
         }  
        }   
       }
      }       
     }
    }
   }  
  }   
 }
}*/
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
