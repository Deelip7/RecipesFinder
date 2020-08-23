// Global Variables for DOM manipulation
const searchField = document.getElementById("searchField");
const displayAutoComplete = document.getElementById("displaySuggestions");
const displayResult = document.getElementById("displayResult");
const saveFavoritesDiv = document.getElementById("saveFavoritesDiv");
const saveRecipes = document.querySelector(".saveRecipes");

// const removeRecipes = document.querySelectorAll(".removeRecipes");

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
    let meals;
    if (localStorage.getItem("meals") === null) {
      // create local storage array called "meals" and set it = []
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals")); // if "meals" array exists return it to addData()
    }
    return meals;
  }

  static addData(meal) {
    const saveFavoritesBtn = document.getElementById("saveBtn");
    saveFavoritesBtn.addEventListener("click", (e) => {
      saveFavoritesDiv.classList.add("show");

      saveFavoritesBtn.innerHTML = ` <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg> 
      `;
      let hasId = false;
      const meals = StoreData.getData(); //array from local storage

      if (meals.length !== 0) {
        meals.forEach((e) => {
          if (hasId === true) {
            return;
          } else {
            hasId = e.id.includes(meal.id);
          }
        });
      }
      if (hasId === false) {
        meals.push(meal);
        localStorage.setItem("meals", JSON.stringify(meals));
        StoreData.saveFavoritesRecipe();
      }
    });
  }

  static saveFavoritesRecipe() {
    saveRecipes.innerHTML = "";
    StoreData.getData().forEach((e) => {
      saveRecipes.innerHTML += `
                              <div class="recipeContainer">
                                <button id="${e.id}" class="savedRecipe">${e.meal}</button>
                                <div class="removeRecipes">X</div>
                              </div>`;
    });
  }

  static removeData(el) {
    // el parameter is coming remove button Onclick
    const meals = StoreData.getData(); //array from local storage
    meals.forEach((meal, index) => {
      // loops iterate over each item in  local storage array
      if (meal.id == el.id) {
        // if local storage array = to button e.target remove it from array
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals)); //push new data from user to local storage
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
  static getRecipe = async (searchRecipe, fromWhere) => {
    let mealArray = [];
    try {
      let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
      let data = await res.json();
      mealArray = Object.values(data.meals);

      displayAutoComplete.innerHTML = "";
      mealArray.forEach((element) => {
        displayAutoComplete.innerHTML += `<button id="${element.idMeal}" type="submit" class="btn btn-outline-light p-3 m-2 rounded-pill">${element.strMeal}</button>`;
      });

      if (fromWhere === "fromSavedRecipe") {
        UI.dipslayRecipe(mealArray[0]);
      } else {
        UI.showRecipeOptions(mealArray);
      }
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

  // Autocomplete users search and display to UI
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
    //Change save button icon based on localstorage
    //----------------------- save button icon ---------------------------
    let isSavedrecipe = false;
    let saveIcon = null;

    const isSavedIcon = `<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
    </svg> `;

    const notSavedIcon = `<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
    </svg>`;

    const savedRecipeList = StoreData.getData();

    savedRecipeList.forEach((e) => {
      if (mealUI.idMeal === e.id) {
        return (isSavedrecipe = true);
      }
    });

    if (isSavedrecipe === true) {
      saveIcon = isSavedIcon;
    } else {
      saveIcon = notSavedIcon;
    }
    //---------------------------------------------------------------

    const savedMeal = new Favorite(mealUI.idMeal, mealUI.strMeal);

    //Filtered data for Ingredient Measurement list
    let filteredIngredient = UI.filteredRecipeObjects(mealUI, /strIngredient/);
    let filteredMeasure = UI.filteredRecipeObjects(mealUI, /strMeasure/);

    // clear input field
    searchField.value = "";

    // Add API data to UI
    displayResult.innerHTML = `
                              <img src="${mealUI.strMealThumb}" class="img-fluid mt-4 rounded-pill" alt="Responsive image" width="200px">

                              <button type="button" class="btn btn-outline-light m-4 rounded-pill" id="saveBtn"> 
                               ${saveIcon}
                              </button>

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
  //Remove meal from UI and DOM but not from the local storage.
  static removemeal(el) {
    el.parentElement.remove();
  }
}
/*
/------------------------------------------------------------
/   Events
/------------------------------------------------------------
/   Pass Input Field value to UI class
/
*/
document.addEventListener("DOMContectLoaded", StoreData.saveFavoritesRecipe());

searchField.addEventListener("input", () => {
  if (searchField.value.length === 0) {
    //IF searchField is empty = hid it
    displayAutoComplete.classList.add("hidden");
  } else {
    // User inputs and UI functions
    UI.getRecipe(searchField.value, "fromAutoSearch");
    displayAutoComplete.classList.remove("hidden");
  }
});

//Toggle saved recipe list
document.querySelector(".showSavedRecipes").addEventListener("click", (e) => {
  saveFavoritesDiv.classList.toggle("show");
});

//Display Recipe when user select from saved recipe list
saveRecipes.addEventListener("click", (e) => {
  if (e.target.classList.contains("savedRecipe")) {
    searchField.value = e.target.firstChild.data;
    displayAutoComplete.classList.add("hidden");
    saveFavoritesDiv.classList.remove("show");

    UI.getRecipe(searchField.value, "fromSavedRecipe");
  }
});

//Remove meal from UI and DOM but not from the local storage.
saveRecipes.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeRecipes")) {
    UI.removemeal(e.target);
    StoreData.removeData(e.target.previousElementSibling);
  }
});

//hide save recipes on window scroll
saveFavoritesDiv.addEventListener("mouseleave", (e) => {
  console.log(e);
  window.addEventListener("scroll", (e) => {
    saveFavoritesDiv.classList.remove("show");
  });
});
