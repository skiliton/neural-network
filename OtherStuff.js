/**
 * Created by skili on 07.05.2017.
 */
function createRandomPoint(Area){
    if(!(Area instanceof Rectangle)){
        throw new Error('Area must be instanceof Rectangle');
    }
    return new Vector2D(
        randomBetween(Area.left,Area.right),
        randomBetween(Area.top,Area.bottom)
    );
}
function randomBetween(start,end){
    return Math.floor(Math.random() * end) + start;
}

function Vector2D(x,y){
    this.x = x;
    this.y = y;
}

function Rectangle(top,right,bottom,left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
}

function getDistance(Start,End){
    var newVector  = new Vector2D((Start.x-End.x),(Start.y-End.y));
    return Math.sqrt(newVector.x*newVector.x+newVector.y*newVector.y);
}

function getClosestFood(food,start){
    closest = 320000;
    closestFood = null;
    for(var i=0;i<food.length;i++)
    {
        var foodDistance = getDistance(start, food[i].position);
        if (foodDistance < closest)
        {
            closest = foodDistance;
            closestFood = food[i];
        }
    }
    return closestFood;
}

function getRandom(){
    return (Math.random() * 2)-1;
}
function movePoint(center,direction,length) {
    radians = (direction * Math.PI / 180);
    return new Vector2D(
        (center.x + (Math.cos(radians) * length)),
        (center.y + (Math.sin(radians) * length))
    );
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}