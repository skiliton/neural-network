/**
 * Created by skili on 06.05.2017.
 */
'use strict';
function Creature(WorldArea){
    if(!(WorldArea instanceof Rectangle)){
       throw new Error("WorldArea must be instanceof Rectangle")
    }
    this.WorldArea = WorldArea;
    this.life = 100;
    this.position = createRandomPoint(WorldArea);
    this.fitness = 0;
    this.direction = randomBetween(0,360);
    this.brain = new NeuralNetwork(2, 250, 3);
    this.parentChance = 0;
}
Creature.prototype.reset = function () {
    this.direction = randomBetween(0,360);
    this.life = 100;
    this.fitness = 0;
};
//@food array<Food>
Creature.prototype.update = function (food) {
    if(this.life<0){
        this.fitness = 0;
        return false;
    }
    var closestFood = getClosestFood(food, this.position);
    var leftSensor = movePoint(this.position, (this.direction - 45 - 90), 30);
    var rightSensor = movePoint(this.position, (this.direction + 45 - 90), 30);
    var closestFoodLeft = getDistance(closestFood.position, leftSensor);
    var closestFoodRight = getDistance(closestFood.position, rightSensor);
    var distanceToFood = getDistance(closestFood.position,this.position);
    if (distanceToFood < 20)
    {
        this.life += 30;
        this.fitness += 10;
        closestFood.position = createRandomPoint(this.WorldArea);
    }
    this.life-=0.025;
    var input = this.createInputs(closestFoodLeft,closestFoodRight);
    var output = this.brain.run(input);
    if (output[0] > output[1])
    {
        this.direction += output[0] * 4;
    }
    else
    {
        this.direction -= output[1] * 4;
    }
    var speed = output[2] * 2;
    var directionInRad = ((this.direction - 90) * Math.PI / 180);
    this.position.x += (Math.cos(directionInRad) * speed);
    this.position.y += (Math.sin(directionInRad) * speed);
    this.returnToArea(); //if creature went further than world border
};
Creature.prototype.createInputs = function (closestFoodLeft,closestFoodRight) {
    var input = [];
    if (closestFoodLeft > closestFoodRight)
    {
        input[0] = 1;
        input[1] = -1;
    }
    else
    {
        input[0] = -1;
        input[1] = 1;
    }
    return input;
};
Creature.prototype.returnToArea = function(){
    if (this.position.x < this.WorldArea.left)
        this.position.x = this.WorldArea.left;
    if (this.position.x > this.WorldArea.right)
        this.position.x = this.WorldArea.right;
    if (this.position.y < this.WorldArea.top)
        this.position.y = this.WorldArea.top;
    if (this.position.y > this.WorldArea.bottom)
        this.position.y = this.WorldArea.bottom;
};