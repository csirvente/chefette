const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
  title: String,
  level: String,
  ingredients: Array,
  cousine: String,
  dishType: String,
  image: {
    type: String,
    default: "https://images.media-allrecipes.com/images/75131.jpg"
  },
  duration: { type: Number, min: 0 } /* Min value should be 0. */,
  creator: String,
  created: Date
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports=Recipe
