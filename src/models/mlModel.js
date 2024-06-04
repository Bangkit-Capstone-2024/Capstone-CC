const tf = require('@tensorflow/tfjs-node');

let model;

const labelMapping = {
  "0": "baby_bed",
  "1": "baby_car_seat",
  "2": "baby_folding_fence",
  "3": "bathtub",
  "4": "booster_seats",
  "5": "bouncer",
  "6": "breast_pump",
  "7": "carrier",
  "8": "earmuffs",
  "9": "ride_ons",
  "10": "rocking_horse",
  "11": "sterilizer",
  "12": "stroller",
  "13": "walkers"
};

// const loadModel = async () => {
//   if (!model) {
//     model = await tf.loadGraphModel('file://./tfjs_model/model.json');
//   }
// };

const loadModel = async () => {
    try {
      if (!model) {
        console.log('Loading model...');
        model = await tf.loadGraphModel('file://./tfjs_model/model.json');
        console.log('Model loaded successfully');
      }
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load model');
    }
};

const classifyImage = async (imageBuffer) => {
    try {
      await loadModel();
  
      const imageTensor = tf.node.decodeImage(imageBuffer, 3)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
  
      const predictions = model.predict(imageTensor);
      return predictions.dataSync();
    } catch (error) {
      console.error('Error classifying image:', error);
      throw new Error('Failed to classify image');
    }
};

const getLabelsFromPrediction = (predictions) => {
  // Assuming predictions are probabilities, get the index of the highest probability
  const highestPredictionIndex = predictions.indexOf(Math.max(...predictions));
  return labelMapping[highestPredictionIndex.toString()];
};

module.exports = { classifyImage, getLabelsFromPrediction };

