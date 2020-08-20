const btn = document.getElementById("submitBtn");
const search = document.getElementById("searchField");
const displayAutoComplete = document.getElementById("displaySuggestions");
const displayResult = document.getElementById("displayResult");

class Favorite {
  constructor(mealName, id) {
    this.meal = mealName;
    this.id = id;
  }
}

const getRecipe = async (searchRecipe) => {
  let mealArray = [];
  const alertMsg = `<img src="Images/alert-circle.svg" width="50px" class="border-0 mb-3"/>
                  <h1 class="display-5 text-white p-3 border border-danger h3">No Result Found</h1>`;
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
    let data = await res.json();
    mealArray = Object.values(data.meals);

    let findMatch = mealArray.filter((el) => {
      return el;
    });

    displayAutoComplete.innerHTML = "";
    findMatch.forEach((element) => {
      displayAutoComplete.innerHTML += `<button id="${element.idMeal}"type="submit" class="display-5 p-3 m-2 bg-white rounded-pill h5">${element.strMeal}</button>`;
    });
  } catch (err) {
    // catches errors both in fetch and response.json
    displayAutoComplete.innerHTML = alertMsg;
    console.log(err);
  }
  if (searchRecipe.length === 0) {
    displayAutoComplete.innerHTML = "";
  } else {
    displayAutoComplete.classList.remove("hidden");
    showMeal(mealArray);
  }
};

search.addEventListener("input", () => getRecipe(search.value));

function showMeal(mealList) {
  document.querySelectorAll("button").forEach((btnElement) => {
    btnElement.addEventListener("click", (el) => {
      mealList.forEach((meal) => {
        meal.idMeal === el.target.id ? UI(meal) : null;
        displayAutoComplete.classList.add("hidden");
      });
    });
  });
}

function UI(mealUI) {
  const savedMeal = new Favorite(mealUI.idMeal, mealUI.strMeal);

  let filteredIngredient = filtered_keys(mealUI, /strIngredient/);
  let filteredMeasure = filtered_keys(mealUI, /strMeasure/);

  //--- clear input field
  search.value = "";
  //--- Add table to UI
  displayResult.innerHTML = `
                            <img src="${mealUI.strMealThumb}" class="img-fluid mt-4 rounded-pill" alt="Responsive image" width="200px">
                            <button type="button" class="btn btn-outline-light m-4 rounded-pill" id="saveBtn">Save &#10084 Recipe</button>

                            <h1 class="text-white mb-3"> ${mealUI.strMeal}</h1> 
                             
                            <h4 class="text-white mb-5 mx-auto"> 
                            <img src="Images/map-pin.svg"  width="25px"/>
                             ${mealUI.strArea}<span class="h2 text-white"> | </span>
                            <img src="Images/grid.svg" width="25px">
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
                              <img src="Images/link-2.svg"  width="25px" class="border-0 mb-2 mr-2"/>
                                <a href="${mealUI.strSource}" target="_blank" class="text-white h4 mr-4">Source</a> 
                              <img src="Images/youtube.svg"  width="25px" class="border-0 mb-2 mr-2"/>
                                <a href="${mealUI.strYoutube}" target="_blank" class="text-white h4 mr-2">YouTube</a> 
                            </div>
                            `;

  document.getElementById("saveBtn").addEventListener("click", (e) => {
    StoreData.addData(savedMeal);
  });
}

let filtered_keys = (obj, filter) => {
  let key,
    keys = [];
  for (key in obj)
    if (filter.test(key) && obj[key] !== "" && obj[key] !== " " && obj[key] !== null) {
      let x = `<div class="text-white h4">
                ${obj[key]}
                </div>`;
      keys.push(x);
    }
  return keys.join("");
};

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
    // plan parameter is coming from user input
    const plans = StoreData.getData(); //array from local storage
    plans.push(plan);
    localStorage.setItem("plans", JSON.stringify(plans)); //push new data from user to local storage
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
