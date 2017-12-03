/**
 * Created by skili on 10.05.2017.
 */
function GeneticAlgorithm(selectPercentage,crossoverChance,mutationChance){
    this.selectPercentage = selectPercentage;
    this.crossoverChance = crossoverChance;
    this.mutationChance = mutationChance;
}
GeneticAlgorithm.prototype.selectRandomParent = function (Parents) {
    var ParentsSorted = shuffle(Parents);
    var parentTreshold = randomBetween(0, 100);
    for(var i=0;i<Parents.length;i++)
    {
        if (ParentsSorted[i].parentChance > parentTreshold)
        {
            return ParentsSorted[i];
        }
    }
    return null;
};
GeneticAlgorithm.prototype.evolve = function (Creatures) {
    this.Creatures = Creatures;
    console.log(Creatures);
    var NextGen = this.getNextGeneration(Creatures);
    console.log(NextGen);
    var Parents = this.calculateParentChance(NextGen);
    var NewPopulation = this.crossover(Parents);
    var EvolvedPopulation = this.mutate(NewPopulation);
    for(var i=0;i<EvolvedPopulation.length;i++){
        EvolvedPopulation[i].reset();
    }
    return EvolvedPopulation;
};
GeneticAlgorithm.prototype.getNextGeneration = function(Creatures){
    //Order by descending fitness
    Creatures.sort(function(a, b) {
        return b.fitness - a.fitness;
    });
    var selectionEndPoint = (Creatures.length * (this.selectPercentage / 100));
    var nextGen = [];
    for(var i=0;i<selectionEndPoint;i++){
        nextGen.push(Creatures[i]);
    }
    return nextGen;
};
GeneticAlgorithm.prototype.calculateParentChance = function (NextGeneration) {
    var highestFitness = 0;
    for (var i=0;i<NextGeneration.length;i++)
    {
        if (NextGeneration[i].fitness > highestFitness)
            highestFitness = NextGeneration[i].fitness;
    }
    for (var i=0;i<NextGeneration.length;i++)
    {
        if (highestFitness === 0)
        {
            NextGeneration[i].parentChance = 100;
        }
        else
        {
            NextGeneration[i].parentChance = (NextGeneration[i].fitness / highestFitness) * 100;
        }
    }
    return NextGeneration;
};
GeneticAlgorithm.prototype.mutate = function (NextGeneration) {
    for(var i=0;i<NextGeneration.length;i++){
        if(randomBetween(0,100)<this.mutationChance){
            var weights = NextGeneration[i].brain.getWeights();
            var mutationPoint = randomBetween(0,weights.length);
            weights[mutationPoint] = randomBetween(-1,1);
            NextGeneration[i].brain.setWeights(weights);
        }
    }
    return NextGeneration;
};
GeneticAlgorithm.prototype.crossover = function (NextGeneration) {
    var nrOfCrossOver = this.Creatures.length - NextGeneration.length;
    var generation = NextGeneration;
    for (var j = 0; j < nrOfCrossOver; j++)
    {
        var ParentA = this.selectRandomParent(NextGeneration);
        var ParentB = this.selectRandomParent(NextGeneration);
        var parentAWeights = ParentA.brain.getWeights();
        var parentBWeights = ParentB.brain.getWeights();

        var childWeights = [];

        var crossOverPoint = randomBetween(0, parentAWeights.length);

        for (var i = 0; i < crossOverPoint; i++)
        {
            childWeights[i] = parentAWeights[i];
        }
        for (var i = crossOverPoint; i < parentAWeights.length; i++)
        {
            childWeights[i] = parentBWeights[i];
        }
        var Child = new Creature(ParentA.WorldArea);
        Child.brain.setWeights(childWeights);
        generation.push(Child);
    }
    return generation;
};