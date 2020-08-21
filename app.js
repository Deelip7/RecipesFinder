const btn = document.getElementById("submitBtn");
const searchField = document.getElementById("searchField");
const displayAutoComplete = document.getElementById("displaySuggestions");
const displayResult = document.getElementById("displayResult");

/*
/------------------------------------------------------------
/   Favorite Classes
/------------------------------------------------------------
/   Used for storing data to LocalStorage
*/
class Favorite {
  constructor(id, meal) {
    this.meal = meal;
    this.id = id;
  }
}

/*
/------------------------------------------------------------
/  StoreData Classes
/------------------------------------------------------------
/   Set/Get/Remove date from LocalStorage.
*/

class StoreData {
  static getData() {
    let plans;
    if (localStorage.getItem("plans") === null) {
      // create local storage array called "plans" and set it = []
      plans = [];
    } else {
      plans = JSON.parse(localStorage.getItem("plans")); // if "plans" array exists return it to addData()
    }

    return plans;
  }

  static addData(plan) {
    document.getElementById("saveBtn").addEventListener("click", (e) => {
      let hasId = false;
      const plans = StoreData.getData(); //array from local storage

      plans.forEach((e) => {
        hasId = e.id.includes(plan.id);
      });

      if (hasId === false) {
        plans.push(plan);
        localStorage.setItem("plans", JSON.stringify(plans));
      }
    });
  }

  static removeData(el) {
    // el parameter is coming remove button Onclick
    const plans = StoreData.getData(); //array from local storage
    plans.forEach((plan, index) => {
      // loops iterate over each item in  local storage array
      if (plan.id == el) {
        // if local storage array = to button e.target remove it from array
        plans.splice(index, 1);
      }
    });
    localStorage.setItem("plans", JSON.stringify(plans)); //push new data from user to local storage
  }
}

/*
/------------------------------------------------------------
/  UI Classes
/------------------------------------------------------------
/ Update UI dynamical as user types. Display Recipe based on button click
/ Update DOM with API data and store to localStorage if needed
*/

class UI {
  // Get Recipe using API data
  static getRecipe = async (searchRecipe) => {
    let mealArray = [];
    try {
      let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
      let data = await res.json();
      mealArray = Object.values(data.meals);

      displayAutoComplete.innerHTML = "";
      mealArray.forEach((element) => {
        displayAutoComplete.innerHTML += `<button id="${element.idMeal}" type="submit" class="btn btn-outline-light p-3 m-2 rounded-pill">${element.strMeal}</button>`;
      });
      UI.showRecipeOptions(mealArray);
    } catch (err) {
      // catches errors both in fetch and response.json
      UI.noRecipeFound();
      console.log(err);
    }
  };

  // Alert user if no match is found
  static noRecipeFound() {
    const alertMsg = `<img src="Images/alert-circle.svg" width="50px" class="border-0 mb-3"/>
    <h1 class="display-5 text-white p-3 border border-danger h3">No Result Found</h1>`;
    displayAutoComplete.innerHTML = alertMsg;
  }

  static showRecipeOptions(mealList) {
    document.querySelectorAll("button").forEach((btnElement) => {
      btnElement.addEventListener("click", (el) => {
        mealList.forEach((meal) => {
          meal.idMeal === el.target.id ? UI.dipslayRecipe(meal) : null;
          displayAutoComplete.classList.add("hidden");
        });
      });
    });
  }
  // API data recived from dipslayRecipe().
  // Remove null and empty values and return
  static filteredRecipeObjects = (obj, filter) => {
    let key,
      keys = [];
    for (key in obj)
      if (filter.test(key) && obj[key] !== "" && obj[key] !== " " && obj[key] !== null) {
        let IngredientMeasurement = `<div class="text-white h4">
                    ${obj[key]}
                    </div>`;
        keys.push(IngredientMeasurement);
      }
    return keys.join("");
  };

  //Get meal recipe data from API and add it to DOM
  static dipslayRecipe(mealUI) {
    const savedMeal = new Favorite(mealUI.idMeal, mealUI.strMeal);

    //Filtered data for Ingredient Measurement list
    let filteredIngredient = UI.filteredRecipeObjects(mealUI, /strIngredient/);
    let filteredMeasure = UI.filteredRecipeObjects(mealUI, /strMeasure/);

    // clear input field
    searchField.value = "";

    // Add API data to UI
    displayResult.innerHTML = `
                              <img src="${mealUI.strMealThumb}" class="img-fluid mt-4 rounded-pill" alt="Responsive image" width="200px">
                              <button type="button" class="btn btn-outline-light m-4 rounded-pill" id="saveBtn">Save &#x2764 Recipe</button>
  
                              <h1 class="text-white mb-3"> ${mealUI.strMeal}</h1> 
                               
                              <h4 class="text-white mb-5 mx-auto"> 
                              <img src="Images/map-pin2.svg"  width="25px"/>
                               ${mealUI.strArea}<span class="h2 text-white"> | </span>
                              <img src="Images/grid2.svg" width="25px">
                               ${mealUI.strCategory} 
                              </h4> 
  
                              <p class="h4 text-white mb-3" id="instruction"> 
                                <span class="h3 text-white">Instructions: </span> 
                                ${mealUI.strInstructions.replace(/\./g, ".<br>")} 
                              </p>
                            
                              <table class="table  mx-auto w-100 text-center">                            
                                <thead>
                                  <tr class="text-center"> 
                                    <th class="pb-1" scope="col">Ingredient</th>
                                    <th class="pb-1" scope="col" >Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td class="text-center px-0">${filteredIngredient}</td>
                                    <td class="text-center px-0">${filteredMeasure}</td>
                                  </tr>
                                </tbody> 
                              </table>
                              <div class="source">
                                <img src="Images/link-2.svg"  width="20px" class="border-0 mb-2 mr-2"/>
                                  <a href="${mealUI.strSource}" target="_blank" class="text-white mr-4">Source</a> 
                                <img src="Images/youtube.svg"  width="20px" class="border-0 mb-2 mr-2"/>
                                  <a href="${mealUI.strYoutube}" target="_blank" class="text-white mr-2">YouTube</a> 
                              </div>
                              `;
    // After "Save Recipe" button creation
    // pass data to StoreData class and save it to LocalStorage
    StoreData.addData(savedMeal);
  }
}
/*
/------------------------------------------------------------
/   Events
/------------------------------------------------------------
/   Pass searchField value to UI class
/
*/
searchField.addEventListener("input", () => {
  if (searchField.value.length === 0) {
    //IF searchField is empty = hid it
    displayAutoComplete.classList.add("hidden");
  } else {
    // User inputs and UI functions
    UI.getRecipe(searchField.value);
    displayAutoComplete.classList.remove("hidden");
  }
});
