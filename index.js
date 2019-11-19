
window.onload = startup();

//The starting number of ingredients is 1
var current_ingredients;

/********************************************************
* Startup - Adds listeners to the initial buttons, 
* add/view recipes, allows for action on click
*********************************************************/
function startup(){
    const ORIGINAL_INGREDIENTS = 1;
    current_ingredients = ORIGINAL_INGREDIENTS;

    console.log("startup");
    var view_recipes = document.getElementById("view_recipes");
    view_recipes.addEventListener("click", viewRecipes, false);

    var add_recipes = document.getElementById("add_recipes");
    add_recipes.addEventListener("click", addRecipePage, false);

    var cancel_recipe = document.getElementById("cancelRecipe");
    cancel_recipe.addEventListener("click", cancelRecipe, false);

    var add_ingredient_btn = document.getElementById("addIngredient"); 
    add_ingredient_btn.addEventListener("click", addIngredient, false);

    var remove_ingredient_btn = document.getElementById("removeIngredient"); 
    remove_ingredient_btn.addEventListener("click", removeIngredient, false);

    // var main_course_radio = document.getElementById("main_course");
    // main_course_radio.addEventListener("click", displayMainCourseOptions, false);

    // var side_dish_radio = document.getElementById("side_dish");
    // side_dish_radio.addEventListener("click", displaySideDishOptions, false);

    // var dessert_radio = document.getElementById("dessert");
    // dessert_radio.addEventListener("click", displayDessertOptions, false);

    var submit_recipe_btn = document.getElementById("submitRecipe");
    submit_recipe_btn.addEventListener("click", submitRecipe, false);
}

/********************************************************
* Slides in the view recipe page from the left
*********************************************************/
function viewRecipes(){
    var viewRecipePage = document.getElementById("viewRecipePage");
    viewRecipePage.style.marginLeft = "0vw";
}

/********************************************************
* Slides in the view recipe page from the right
*********************************************************/
function addRecipePage(){
    var addRecipePage = document.getElementById("addRecipePage");
    addRecipePage.style.display = "block";
    setTimeout(function(){ addRecipePage.style.marginLeft = "0vw"; }, 200);

    var view_recipes = document.getElementById("view_recipes");
    var add_recipes = document.getElementById("add_recipes");
    view_recipes.style.visibility = "hidden";
    add_recipes.style.visibility = "hidden";
}

/********************************************************
* CancelRecipe() - Puts the add recipe page back off to
* the side and makes the initial view/add buttons visible
*
* Also unchecks the course type radio buttons and should
* eventually remove any extra ingridents added as well
* 
* And remove any combo option selection
*********************************************************/
//TODO: Clear all fields on cancel
function cancelRecipe(){
    var addRecipePage = document.getElementById("addRecipePage");
    addRecipePage.style.marginLeft = "100vw";
    setTimeout(function(){ addRecipePage.style.display = "none"; }, 700);
    

    var view_recipes = document.getElementById("view_recipes");
    var add_recipes = document.getElementById("add_recipes");
    setTimeout(function(){ view_recipes.style.visibility = "visible"; add_recipes.style.visibility = "visible"; }, 300);

    //Scrolls back to the top of page
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    //Unckeck the course selection
    document.getElementById('main_course').checked = false;
    document.getElementById('side_dish').checked = false;
    document.getElementById('dessert').checked = false;

    var ingredients_div = document.getElementById("ingredients_div");
    var descendents = Array.prototype.slice.call(ingredients_div.querySelectorAll("*"));
    
    var e;
    if (descendents.length > 1){
        for (var i = 1; i < descendents.length; i++){
            e = descendents[i];
            e.remove();
            current_ingredients -= 1;
        }
    }

    //Clear all of the fields on cancel
    document.getElementById("recipeName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("recipeSource").value = "";
    document.getElementById("main_course").checked = false;
    document.getElementById("side_dish").checked = false;
    document.getElementById("dessert").checked = false;

    var ingredients_div = document.getElementById("ingredients_div");
    var descendents = Array.prototype.slice.call(ingredients_div.querySelectorAll("*"));
        for (var i = 0; i < descendents.length; i++){
            descendents[i].value = "";
        }

        document.getElementById("directions").value = "";
        document.getElementById("addRecipeTags").value = "";


}

/********************************************************
* addIngredient() - Adds a new ingredient to the form
*********************************************************/
function addIngredient(){
    current_ingredients += 1;

    var ingredientDiv = document.getElementById("ingredients_div");
    var newIngredient = document.createElement("input");
    newIngredient.placeholder = "Ingredient " + current_ingredients;
    newIngredient.name = "ingredient_" + current_ingredients;
    newIngredient.type = "text";

    ingredientDiv.appendChild(newIngredient);

}

/********************************************************
* removeIngrident() - Removes the most recent ingredient
* that was added. Can't remove less than 3.
*********************************************************/
function removeIngredient(){

    var ingredients_div = document.getElementById("ingredients_div");
    Array.prototype.slice.call(ingredients_div.querySelectorAll("*"));
    
    if (current_ingredients <= 1){
        //Don't remove if you would have less than 1
    } else {
        document.getElementById("ingredients_div").lastChild.remove();
        current_ingredients -= 1;
    }
}

/********************************************************
* submitRecipe() -  Turns the recipe into JSON for
* storage and whatnot
*********************************************************/
function submitRecipe(){

    var mainCourse = document.getElementById("main_course");
    var sideDish = document.getElementById("side_dish");
    var dessert = document.getElementById("dessert");

    const recipe = {
        recipeName: "",
        description: "",
        source: "",
        course_type: "",
        ingredients: [],
        directions: "",
        tags: []
      };

      //Set the name & description to the object
      recipe.recipeName = document.getElementById("recipeName").value;
      recipe.description = document.getElementById("description").value;
      recipe.source = document.getElementById("recipeSource").value;
      
      //Get the type from the radio & select box
     if (mainCourse.checked){
            recipe.course_type = "main course";

     } else if (sideDish.checked){
            recipe.course_type = "side dish";

     } else if (dessert.checked){
            recipe.course_type = "dessert";
     }

    //Get all of the ingredients and save them all separately
    var ingredients_div = document.getElementById("ingredients_div");
    var descendents = Array.prototype.slice.call(ingredients_div.querySelectorAll("*"));
     
    //To save any ingredients
        for (var i = 0; i < descendents.length; i++){
            recipe.ingredients[i] = descendents[i].value;
        }

    recipe.directions = document.getElementById("directions").value;

    //TODO: Now make the submit button actually save this json stuff


/********************************************************
* The recipe tags ONLY work correctly if they are
* separated by spaces, eg: can i help you
* or if they are separated by commas:
* this, is, a, bunch, of, tags
* Or any way in between such as:
* this, is, a bunch of tags, here
* But anything else like tags,like,this,will,break.
*********************************************************/
     //Get the value of the tags
     var tagString = document.getElementById("addRecipeTags").value;

     //Search for any commas, replace them with nothing
     tagString = tagString.replace(/,/g, "");

     //Split the string on spaces and save the tags to an array in the object
     recipe.tags = tagString.split(" ");

    //  console.log(recipe);

     

     console.log(JSON.stringify(recipe));

}


/********************************************************
*
*********************************************************/