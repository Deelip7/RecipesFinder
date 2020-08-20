const btn = document.getElementById("submitBtn");
const search = document.getElementById("searchField");
const displayAutoComplete = document.getElementById("displaySuggestions");
const displayResult = document.getElementById("displayResult");

const getRecipe = async (searchRecipe) => {
  let mealArray = [];
  const alertMsg = `<h1 class="display-5 text-white p-2 border border-danger">Search Not Found</h1>`;
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
    let data = await res.json();
    mealArray = Object.values(data.meals);

    let findMatch = mealArray.filter((el) => {
      return el;
    });

    displayAutoComplete.innerHTML = "";
    findMatch.forEach((element) => {
      displayAutoComplete.innerHTML += `<button id="${element.idMeal}"type="submit" class="display-5 p-3 m-2 bg-white rounded-pill h4">${element.strMeal}</button>`;
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
        console.log("showMeal -> meal", meal);
        meal.idMeal === el.target.id ? UI(meal) : null;
        displayAutoComplete.classList.add("hidden");
      });
    });
  });
}

function UI(mealUI) {
  let filteredIngredient = filtered_keys(mealUI, /strIngredient/);
  let filteredMeasure = filtered_keys(mealUI, /strMeasure/);

  console.log(filteredIngredient);
  console.log(filteredMeasure);
  search.value = "";
  displayResult.innerHTML = `<img src="${mealUI.strMealThumb}" class="img-fluid m-4 rounded-pill" alt="Responsive image" width="200px">
                             <h1 class="text-white mb-3"> ${mealUI.strMeal}</h1> 
                             <h4 class="text-white mb-5 mx-auto"> 
                             <img src="Images/map-pin.svg"  width="25px"/>
                             ${mealUI.strArea}<span class="h2 text-white"> | </span>
                             <img src="Images/grid.svg" width="25px">
                             ${mealUI.strCategory} 
                             </h4> 
                             <p class="h4 text-white mb-3 "> 
                              <span class="h3 text-white">Instructions: </span> 
                              ${mealUI.strInstructions.replace(/\./g, ".<br>")} 
                             </p>
                            
                            <table class="table  mx-auto w-100 text-center ">                            
                            <thead>
                            <tr class="text-center"> 
                               <th class="pb-1" scope="col">Ingredient</th>
                               <th class="pb-1" scope="col" >Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr >
                              <td class="text-center px-0">${filteredIngredient}</td>
                              <td class="text-center px-0">${filteredMeasure}</td>
                            </tr>
                            </tbody> 
                            </table>
                            <img src="Images/link-2.svg"  width="30px"/>
                            <a href="${mealUI.strSource}" class="text-white mb-3 h3">Source</a> 
                            <img src="Images/youtube.svg"  width="30px"/>
                            <a href="${mealUI.strYoutube}" class="text-white mb-3 h3">Youtube Link</a> 

                            `;
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

// <span class="badge badge-primary badge-pill">14</span>
