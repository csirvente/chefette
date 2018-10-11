const express = require("express");
const router = express.Router();
const Recipes = require("../models/recipe");
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const _ = require("lodash");

router.use(ensureLogin.ensureLoggedIn());

/* GET private page */
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("authentication/private", { user: req.user });
});

//chefette
router.get("/meals", ensureLogin.ensureLoggedIn(), function(req, res, next) {
  Recipes.find()
    .then(resultsRecipes => {
      console.log("This is all the results found", resultsRecipes);
      //Myrecipes
      User.find({ _id: req.user._id })
        .populate("recipes")
        .then(user => {
          console.log(user);
          if (!user) {
            return res.status(404).render("not-found");
          }
          res.render("chefette/meals", { resultsRecipes, user });
        })
        .catch(next);
    })
    .catch(err => {
      console.log("An error happened:" + err);
    });
});

router.get("/meals/:id", function(req, res, next) {
  let recipesId = req.params.id;
  Recipes.findById(recipesId)
    .then(recipeCard => {
      console.log("Recipe:", recipeCard);
      res.render("chefette/meal-card", { recipeCard });
    })
    .catch(err => {
      console.log("An error happened:" + err);
    });
});

/* solution alternative method get router.get('/add-recipe:id', (req, res) =>
 { let recipesId = req.params.id; // 
  probleme ça fait rafraichir la page
  NPO checker dans la console chrome pour console.log et dans terminator pour la MAJ server
  ici c'est Mongo qui met à jour, il est aussi poussible de recharger la page avec javascript push & .save()
  */

router.post("/add-recipe", (req, res) => {
  console.log(req.user);
  let recipesId = req.body.recipesId;
  User.update({ _id: req.user._id }, { $push: { recipes: recipesId } })
    .then(() => {
      res.send(`Recipes: ${recipesId}`);
    })
    .catch(err => {
      console.log("An error happened:" + err);
    });
});

router.get("/groceries", ensureLogin.ensureLoggedIn(), function(
  req,
  res,
  next
) {
  Recipes.find()
    .then(resultsRecipes => {
      console.log("This is all the results found", resultsRecipes);
      //Myrecipes
      User.find({ _id: req.user._id })
        .populate("recipes")
        .then(user => {
          console.log(user);
          if (!user) {
            return res.status(404).render("not-found");
          }
          console.log(user[0].recipes[0].ingredients);

          function myIngredientsFlatten() {
            var i;
            let myIngredients = [];
            for (i = 0; i < user[0].recipes.length; i++) {
              myIngredients.push(user[0].recipes[i].ingredients);
            }
            console.log(myIngredients);

            return _.flatten(myIngredients);
           
          }
          let myIngredients = myIngredientsFlatten()

          /* user.ingredients.flatten() */
          /* user.0.ingredient.flattend lodash*/

          res.render("chefette/groceries", { resultsRecipes, user,myIngredients });
        })
        .catch(next);
    })
    .catch(err => {
      console.log("An error happened:" + err);
    });
});

module.exports = router;
