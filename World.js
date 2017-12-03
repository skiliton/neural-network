/**
 * Created by skili on 09.05.2017.
 */
function World(WorldArea,foodCount,creatureCount) {
    this.ticks = 0;
    this.generation = 0;
    this.food = [];
    this.creatures = [];
    this.deaths = 0;
    this.fps = 0;
    this.GA = new GeneticAlgorithm(40,60,1);
    for(var i=0;i<foodCount;i++){
        this.food.push(new Food(WorldArea));
        createFood(i);
    }
    for(var i=0;i<creatureCount;i++){
        this.creatures.push(new Creature(WorldArea));
        createCreature(i);
    }
}
World.prototype.update = function () {
    for(var i=0;i<this.creatures.length;i++){
        var c = this.creatures[i];
        if(c.life>0){
            c.update(this.food);
            if (c.life <= 0){
                this.deaths++;
            }
        }
    }
    this.ticks++;
    if(this.ticks === 10000){
        this.creatures = this.GA.evolve(this.creatures);
        this.ticks = 0;
        this.deaths =0;
        this.generation++;
    }
};
World.prototype.draw = function () {
    for(var i=0;i<this.creatures.length;i++) {
        var creature = this.creatures[i];
        drawCreature(i,creature);
    }
    for(var i=0;i<this.food.length;i++) {
        var food = this.food[i];
        drawFood(i,food);
    }
    drawGraph(this.generation,this.ticks,this.deaths,this.fps);
};

function createFood(id) {
    var world = document.getElementsByClassName('world')[0];
    var food = document.createElement('div');
    food.setAttribute('id','fd'+id);
    food.setAttribute('class','food');
    world.appendChild(food)
}

function createCreature(id) {
    var world = document.getElementsByClassName('world')[0];
    var creature = document.createElement('div');
    creature.setAttribute('id','cr'+id);
    creature.setAttribute('class','creature');
    world.appendChild(creature)
}

function drawFood(id,food){
    var foodNode = document.getElementById('fd'+id);
    foodNode.style.left = food.position.x+'px';
    foodNode.style.top = food.position.y+'px';
}

function drawCreature(id,creature) {
    var creatureNode = document.getElementById('cr'+id);
    creatureNode.style.left = creature.position.x+'px';
    creatureNode.style.top = creature.position.y+'px';
    creatureNode.style.transform = "rotate("+creature.direction+"deg)";
}

function drawGraph(gen,ticks,deaths,fps) {
    var graph = document.getElementsByClassName('graph')[0];
    while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
    }
    var data = '<li>FPS: '+fps+'</li>'+
               '<li>Generation: '+gen+'</li>'+
               '<li>Tick: '+ticks+'</li>'+
               '<li>Deaths: '+deaths+'</li>';
    graph.innerHTML = data;
}
var settings = {
    delay:20,
    population:80,
    food:200,
    run:true
};
function setDelay(){
    var delay = document.getElementById('speed').value;
    if(delay<=1000 && delay>=1){
        settings.delay=delay;
    }
}
function pause() {
    if(!settings.run){
        setTimeout(init, settings.delay);
    }
    settings.run = !settings.run;
}
var AmazingWorld = new World(new Rectangle(0,1500,1000,0),settings.food,settings.population);
var lastTick = 0;
function calculateFPS(tick) {
    AmazingWorld.fps = (tick-lastTick)*5;
    lastTick = tick;
    setTimeout(calculateFPS,200,AmazingWorld.ticks);
}
function init() {
    if(settings.run){
        AmazingWorld.update();
    }
    AmazingWorld.draw();
    setTimeout(init, settings.delay);
}

init();
setTimeout(calculateFPS,200,AmazingWorld.ticks);