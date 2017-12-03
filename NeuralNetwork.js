/**
 * Created by skili on 08.05.2017.
 */
function Neuron() {
    this.dendrites = [];
    this.dendriteCount = 0;
    this.value = 0.0;
}

function Dendrite() {
    this.weight = 0.0;
}

function NN() {
    this.layers = [];
    this.layerCount = 0;
}

function Layer() {
    this.neurons = [];
    this.neuronCount = 0;
}

function NeuralNetwork(inputCount,hiddenLayerCount,outputCount) {
    this.Network = new NN();
    var Layers = [];
    Layers[0] = inputCount;
    Layers[1] = hiddenLayerCount;
    Layers[2] = outputCount;
    this.Network.layerCount = Layers.length;
    if (this.Network.layerCount < 2){
        throw new Error('Network must have at least 2 layers')
    }
    this.Network.layers = this.createLayers(this.Network.layerCount);
    for(var i=0;i<this.Network.layerCount;i++){
        this.Network.layers[i].neuronCount = Layers[i];
        for(var j=0;j<Layers[i];j++){
            if(i===0){
                this.Network.layers[i].neurons.push(this.createNeuron(0))
            }else{
                this.Network.layers[i].neurons.push(this.createNeuron(Layers[i-1]))
            }
        }
    }
}
NeuralNetwork.prototype.run = function (inputs) {
    for(var i=0;i<this.Network.layerCount;i++){
        for(var j=0;j<this.Network.layers[i].neuronCount;j++){
            if(i===0){
                this.Network.layers[i].neurons[j].value = inputs[j];
            }else{
                var neuronVal = this.Network.layers[i].neurons[j].value;
                neuronVal = 0;
                for (var k = 0; k < this.Network.layers[i-1].neuronCount; k++)
                {
                    neuronVal = neuronVal + this.Network.layers[i - 1].neurons[k].value * this.Network.layers[i].neurons[j].dendrites[k].weight;
                }
                this.Network.layers[i].neurons[j].value = this.bipolarSigmoid(neuronVal);
            }
        }
    }
    var outputresult = [];
    for (var i = 0; i < this.Network.layers[this.Network.layerCount - 1].neuronCount; i++)
    {
        outputresult.push(this.Network.layers[this.Network.layerCount - 1].neurons[i].value);
        if (outputresult[i] > 1)
            outputresult[i] = 1;
        if (outputresult[i] < -1)
            outputresult[i] = -1;
    }

    return outputresult;
};
NeuralNetwork.prototype.getWeights = function () {
    var weight = [];
    for(var i=0;i < this.Network.layerCount;i++){
        if(i>0){
            for(var j=0;j<this.Network.layers[i].neuronCount;j++){
                for(var k=0;k<this.Network.layers[i-1].neuronCount;k++){
                    weight.push(this.Network.layers[i].neurons[j].dendrites[k].weight)
                }
            }
        }
    }
    return weight;
};
NeuralNetwork.prototype.setWeights = function (weights) {
    var dendriteCount = 0;
    for(var i=0;i < this.Network.layerCount;i++){
        if(i>0){
            for(var j=0;j<this.Network.layers[i].neuronCount;j++){
                for(var k=0;k<this.Network.layers[i-1].neuronCount;k++){
                    this.Network.layers[i].neurons[j].dendrites[k].weight = weights[dendriteCount];
                    dendriteCount++;
                }
            }
        }
    }
};
NeuralNetwork.prototype.createNeuron = function (dendriteCount) {
    var neuron = new Neuron;
    neuron.dendriteCount = dendriteCount;
    for (var i = 0; i < dendriteCount;i++)
    {
        var dendrite = new Dendrite();
        neuron.dendrites.push(dendrite);
        neuron.dendrites[i].weight = getRandom();
    }
    return neuron;
};
NeuralNetwork.prototype.createLayers = function (count) {
    var res = [];
    for(var i=0;i<count;i++){
        res.push(new Layer());
    }
    return res;
};
NeuralNetwork.prototype.bipolarSigmoid = function (x) {
    return (1 / (1 + Math.exp(x * -1)));
};